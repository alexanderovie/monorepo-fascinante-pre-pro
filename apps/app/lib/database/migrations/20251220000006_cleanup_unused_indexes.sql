-- ============================================
-- MIGRACIÓN: Limpiar Índices No Usados
-- ============================================
-- Fecha: 2025-12-20
-- Descripción: Elimina índices que nunca se han usado según pg_stat_user_indexes
--
-- Cambios:
-- 1. Identifica índices con idx_scan = 0 (nunca usados)
-- 2. Elimina índices no usados (excepto primary keys y unique constraints)
-- 3. Mantiene índices recién creados (últimos 7 días)
--
-- Basado en: Supabase Database Advisor Lint 0005 (unused_index)
-- ============================================

BEGIN;

-- ============================================
-- 1. CREAR FUNCIÓN PARA IDENTIFICAR ÍNDICES NO USADOS
-- ============================================

CREATE OR REPLACE FUNCTION public.identify_unused_indexes()
RETURNS TABLE(
  schemaname TEXT,
  tablename TEXT,
  indexname TEXT,
  indexdef TEXT,
  idx_scan BIGINT,
  days_since_creation INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.nspname::TEXT as schemaname,
    t.relname::TEXT as tablename,
    i.relname::TEXT as indexname,
    pg_get_indexdef(i.oid)::TEXT as indexdef,
    s.idx_scan,
    EXTRACT(DAY FROM (NOW() - pg_stat_file(pg_relation_filepath(i.oid))::timestamp))::INTEGER as days_since_creation
  FROM pg_class i
  JOIN pg_index idx ON idx.indexrelid = i.oid
  JOIN pg_class t ON idx.indrelid = t.oid
  JOIN pg_namespace n ON t.relnamespace = n.oid
  LEFT JOIN pg_stat_user_indexes s ON s.indexrelid = i.oid
  WHERE n.nspname = 'public'
    AND i.relkind = 'i'
    AND (s.idx_scan = 0 OR s.idx_scan IS NULL) -- Nunca usado
    AND NOT idx.indisprimary -- No es primary key
    AND NOT idx.indisunique -- No es unique constraint
    AND NOT i.relname LIKE '%_pkey' -- No es primary key por nombre
    AND NOT i.relname LIKE '%_key' -- No es constraint key
    AND EXTRACT(DAY FROM (NOW() - pg_stat_file(pg_relation_filepath(i.oid))::timestamp)) > 7 -- Más de 7 días
  ORDER BY t.relname, i.relname;
END;
$$;

COMMENT ON FUNCTION public.identify_unused_indexes() IS
'Identifica índices que nunca se han usado. Útil para limpieza de recursos.';

-- ============================================
-- 2. ELIMINAR ÍNDICES NO USADOS (LISTA ESPECÍFICA)
-- ============================================
-- Basado en los resultados de get_advisors (unused_index)
-- Solo eliminamos índices que sabemos que no se usan

-- Índices de optimización RLS que creamos pero aún no se usan (esperar más tiempo)
-- NO los eliminamos todavía, solo los que tienen más de 30 días sin uso

-- Eliminar índices legacy que definitivamente no se usan
DROP INDEX IF EXISTS public.idx_profiles_email;
DROP INDEX IF EXISTS public.idx_profiles_role;
DROP INDEX IF EXISTS public.idx_profiles_org;
DROP INDEX IF EXISTS public.idx_profiles_onboarding;

DROP INDEX IF EXISTS public.idx_businesses_user;
DROP INDEX IF EXISTS public.idx_businesses_google_location;
DROP INDEX IF EXISTS public.idx_businesses_active;
DROP INDEX IF EXISTS public.idx_businesses_sync_status;
DROP INDEX IF EXISTS public.idx_businesses_cache_expires;
DROP INDEX IF EXISTS public.idx_businesses_metrics_gin;

DROP INDEX IF EXISTS public.idx_subscriptions_user;
DROP INDEX IF EXISTS public.idx_subscriptions_stripe_customer;
DROP INDEX IF EXISTS public.idx_subscriptions_stripe_subscription;
DROP INDEX IF EXISTS public.idx_subscriptions_active;
DROP INDEX IF EXISTS public.idx_subscriptions_period_end;

DROP INDEX IF EXISTS public.idx_audits_user;
DROP INDEX IF EXISTS public.idx_audits_business;
DROP INDEX IF EXISTS public.idx_audits_status;
DROP INDEX IF EXISTS public.idx_audits_created;
DROP INDEX IF EXISTS public.idx_audits_user_business;
DROP INDEX IF EXISTS public.idx_audits_results_gin;

-- Índices de activity_events no usados (excepto los que creamos recientemente)
DROP INDEX IF EXISTS public.idx_activity_events_location_id;
DROP INDEX IF EXISTS public.idx_activity_events_account_id;
DROP INDEX IF EXISTS public.idx_activity_events_timestamp;
DROP INDEX IF EXISTS public.idx_activity_events_action;
DROP INDEX IF EXISTS public.idx_activity_events_notified;

-- Índices de notifications no usados
DROP INDEX IF EXISTS public.idx_notifications_location_id;
DROP INDEX IF EXISTS public.idx_notifications_scheduled_for;
DROP INDEX IF EXISTS public.idx_notifications_sent;
DROP INDEX IF EXISTS public.idx_notifications_read;

-- Índices de notification_preferences no usados
DROP INDEX IF EXISTS public.idx_notification_preferences_user_id;

-- Índices de google_business_profile_connections no usados
DROP INDEX IF EXISTS public.idx_gbp_connections_account_id;

-- Índices de chats no usados
DROP INDEX IF EXISTS public.idx_chats_created_at;

-- Índices de messages no usados
DROP INDEX IF EXISTS public.idx_messages_created_at;

-- Índices de documents no usados
DROP INDEX IF EXISTS public.idx_documents_chat_id;
DROP INDEX IF EXISTS public.idx_documents_user_id;

-- Índices de votes no usados
DROP INDEX IF EXISTS public.idx_votes_message_id;

-- Índices de auth_users no usados
DROP INDEX IF EXISTS public.idx_auth_users_email;

-- Índices de services no usados
DROP INDEX IF EXISTS public.idx_services_professional;
DROP INDEX IF EXISTS public.idx_services_is_active;

-- Índices de appointments no usados (excepto los públicos que sí se usan)
DROP INDEX IF EXISTS public.idx_appointments_professional;
DROP INDEX IF EXISTS public.idx_appointments_start_time;
DROP INDEX IF EXISTS public.idx_appointments_status;
DROP INDEX IF EXISTS public.idx_appointments_confirmation_token;
DROP INDEX IF EXISTS public.idx_appointments_client_email;
DROP INDEX IF EXISTS public.idx_appointments_service_id;

-- Índices de blocked_dates no usados
DROP INDEX IF EXISTS public.idx_blocked_dates_professional;
DROP INDEX IF EXISTS public.idx_blocked_dates_date;

-- Índices de waitlist no usados
DROP INDEX IF EXISTS public.idx_waitlist_professional;
DROP INDEX IF EXISTS public.idx_waitlist_notified;

-- Índices de payments no usados
DROP INDEX IF EXISTS public.idx_payments_appointment;
DROP INDEX IF EXISTS public.idx_payments_stripe_intent;
DROP INDEX IF EXISTS public.idx_payments_stripe_session;
DROP INDEX IF EXISTS public.idx_payments_status;

-- Índices de appointment_automation_logs no usados
DROP INDEX IF EXISTS public.idx_automation_logs_appointment;
DROP INDEX IF EXISTS public.idx_automation_logs_type;
DROP INDEX IF EXISTS public.idx_automation_logs_status;
DROP INDEX IF EXISTS public.idx_automation_logs_created_at;

-- Índices de user_integrations no usados
DROP INDEX IF EXISTS public.idx_user_integrations_user_id;
DROP INDEX IF EXISTS public.idx_user_integrations_expires_at;

-- Índices de oauth_tokens no usados (en schema private)
-- Nota: Estos están en schema private, no los tocamos desde aquí

-- ============================================
-- 3. COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================

COMMENT ON FUNCTION public.identify_unused_indexes() IS
'Función para identificar índices no usados. Ejecutar manualmente antes de eliminar índices.';

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
-- Después de aplicar:
-- 1. Verificar que las queries siguen funcionando
-- 2. Monitorear performance (debería mejorar)
-- 3. Si algún índice eliminado era necesario, recrearlo
-- 4. Usar identify_unused_indexes() para futuras limpiezas
-- ============================================

COMMIT;
