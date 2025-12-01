-- ============================================
-- MIGRACIÓN: Instalar pg_cron y Configurar Jobs
-- ============================================
-- Fecha: 2025-12-20
-- Descripción: Instala pg_cron y configura jobs para procesar notificaciones
--
-- Cambios:
-- 1. Instala extensión pg_cron
-- 2. Crea función para procesar notificaciones pendientes
-- 3. Configura job para ejecutar cada 5 minutos
--
-- Basado en: Supabase pg_cron Best Practices (Diciembre 2025)
-- ============================================

BEGIN;

-- ============================================
-- 1. INSTALAR EXTENSIÓN pg_cron
-- ============================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

COMMENT ON EXTENSION pg_cron IS
'Job scheduler para PostgreSQL. Usado para procesar notificaciones programadas.';

-- ============================================
-- 2. INSTALAR pg_net (si no está instalado)
-- ============================================
-- Necesario para hacer HTTP requests desde la DB

CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================
-- 3. CREAR FUNCIÓN PARA PROCESAR NOTIFICACIONES
-- ============================================
-- Esta función será llamada por el cron job
-- Invoca la Edge Function que procesa las notificaciones

CREATE OR REPLACE FUNCTION public.process_scheduled_notifications()
RETURNS TABLE(
  processed_count INTEGER,
  error_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_processed INTEGER := 0;
  v_errors INTEGER := 0;
  v_notification RECORD;
  v_edge_function_url TEXT;
  v_service_role_key TEXT;
  v_request_id BIGINT;
BEGIN
  -- Obtener configuración
  BEGIN
    v_edge_function_url := current_setting('app.settings.edge_function_url', true);
    v_service_role_key := current_setting('app.settings.service_role_key', true);
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Configuración no encontrada. Configura app.settings.edge_function_url y app.settings.service_role_key';
    RETURN;
  END;

  -- Obtener notificaciones listas para enviar (scheduled_for <= NOW() y sent = false)
  FOR v_notification IN
    SELECT
      id,
      user_id,
      activity_event_id,
      notification_type,
      scheduled_for
    FROM public.notifications
    WHERE sent = false
      AND scheduled_for <= NOW()
    ORDER BY scheduled_for ASC
    LIMIT 50 -- Procesar máximo 50 por ejecución para evitar timeouts
  LOOP
    BEGIN
      -- Invocar Edge Function usando pg_net (async HTTP)
      -- La Edge Function procesará la notificación y actualizará sent = true
      SELECT net.http_post(
        url := v_edge_function_url || '/process-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_service_role_key
        ),
        body := jsonb_build_object(
          'notification_id', v_notification.id,
          'user_id', v_notification.user_id,
          'activity_event_id', v_notification.activity_event_id,
          'notification_type', v_notification.notification_type
        )
      ) INTO v_request_id;

      v_processed := v_processed + 1;

    EXCEPTION WHEN OTHERS THEN
      -- Log error pero continúa con siguiente notificación
      v_errors := v_errors + 1;
      RAISE WARNING 'Error procesando notificación %: %', v_notification.id, SQLERRM;
    END;
  END LOOP;

  RETURN QUERY SELECT v_processed, v_errors;
END;
$$;

COMMENT ON FUNCTION public.process_scheduled_notifications() IS
'Procesa notificaciones programadas listas para enviar. Invoca Edge Function para envío real.';

-- ============================================
-- 4. CONFIGURAR CRON JOB
-- ============================================
-- Ejecutar cada 5 minutos para procesar notificaciones

-- Primero eliminar job si existe (para poder recrearlo)
SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'process_scheduled_notifications';

-- Crear nuevo job
SELECT cron.schedule(
  'process_scheduled_notifications',           -- job name
  '*/5 * * * *',                              -- cada 5 minutos
  $$SELECT public.process_scheduled_notifications()$$
);

-- ============================================
-- 5. CREAR FUNCIÓN PARA LIMPIAR CACHE EXPIRADO
-- ============================================
-- Limpia analytics_cache con expires_at < NOW()

CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM public.analytics_cache
  WHERE expires_at < NOW();

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN v_deleted_count;
END;
$$;

COMMENT ON FUNCTION public.cleanup_expired_cache() IS
'Limpia entradas de cache expiradas. Ejecutado diariamente.';

-- ============================================
-- 6. CONFIGURAR CRON JOB PARA CLEANUP
-- ============================================
-- Ejecutar diariamente a las 2 AM

SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'cleanup_expired_cache';

SELECT cron.schedule(
  'cleanup_expired_cache',
  '0 2 * * *',                                -- diariamente a las 2 AM
  $$SELECT public.cleanup_expired_cache()$$
);

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
-- Después de aplicar:
-- 1. Configurar app.settings.edge_function_url en Supabase
-- 2. Configurar app.settings.service_role_key en Supabase
-- 3. Verificar que los jobs se ejecutan: SELECT * FROM cron.job;
-- 4. Ver logs: SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
-- ============================================

COMMIT;
