-- ============================================
-- MIGRACIÓN: Rate Limiting para API Pública
-- ============================================
-- Implementa rate limiting para prevenir abuso de la API pública
-- usando Supabase pre-request function
-- ============================================

-- ============================================
-- 1. TABLA PARA REGISTRO DE REQUESTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_ip_endpoint_window UNIQUE (ip_address, endpoint, window_start)
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint_time
ON public.api_rate_limits(ip_address, endpoint, window_start DESC);

-- Índice para limpieza de registros antiguos
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start
ON public.api_rate_limits(window_start);

-- ============================================
-- 2. FUNCIÓN PARA LIMPIAR REGISTROS ANTIGUOS
-- ============================================

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Eliminar registros de más de 1 hora
  DELETE FROM public.api_rate_limits
  WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$;

-- ============================================
-- 3. FUNCIÓN PRE-REQUEST PARA RATE LIMITING
-- ============================================

CREATE OR REPLACE FUNCTION public.check_appointment_rate_limit()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  req_method TEXT;
  req_path TEXT;
  req_ip INET;
  req_endpoint TEXT;
  current_window TIMESTAMPTZ;
  window_start TIMESTAMPTZ;
  request_count INTEGER;
  max_requests INTEGER := 100; -- 100 requests por ventana
  window_minutes INTEGER := 15; -- Ventana de 15 minutos
BEGIN
  -- Obtener información de la request
  req_method := current_setting('request.method', true);
  req_path := current_setting('request.path', true);

  -- Solo aplicar rate limiting a GET requests (queries)
  -- Para endpoints de disponibilidad
  IF req_method = 'GET' AND req_path LIKE '%availability%' THEN
    -- Obtener IP del cliente
    BEGIN
      req_ip := split_part(
        current_setting('request.headers', true)::json->>'x-forwarded-for',
        ',',
        1
      )::INET;
    EXCEPTION
      WHEN OTHERS THEN
        -- Si no se puede obtener IP, usar '127.0.0.1' como fallback
        req_ip := '127.0.0.1'::INET;
    END;

    -- Normalizar endpoint (solo la ruta base)
    req_endpoint := '/api/availability';

    -- Calcular inicio de la ventana de tiempo (redondeado a 15 minutos)
    window_start := date_trunc('hour', NOW()) +
                    (EXTRACT(MINUTE FROM NOW())::INTEGER / window_minutes)::INTEGER *
                    (window_minutes || ' minutes')::INTERVAL;

    -- Verificar o crear registro para esta IP/endpoint/ventana
    INSERT INTO public.api_rate_limits (ip_address, endpoint, request_count, window_start)
    VALUES (req_ip, req_endpoint, 1, window_start)
    ON CONFLICT (ip_address, endpoint, window_start)
    DO UPDATE SET
      request_count = api_rate_limits.request_count + 1,
      created_at = NOW()
    RETURNING request_count INTO request_count;

    -- Verificar si excedió el límite
    IF request_count > max_requests THEN
      RAISE EXCEPTION USING
        ERRCODE = 'P0001',
        MESSAGE = json_build_object(
          'error', 'Rate limit exceeded',
          'message', format('Too many requests. Maximum %s requests per %s minutes allowed.', max_requests, window_minutes),
          'retry_after', window_minutes * 60
        )::TEXT;
    END IF;

    -- Limpiar registros antiguos ocasionalmente (10% de probabilidad)
    IF random() < 0.1 THEN
      PERFORM public.cleanup_old_rate_limits();
    END IF;
  END IF;
END;
$$;

-- ============================================
-- 4. CONFIGURAR PRE-REQUEST FUNCTION
-- ============================================

-- Configurar la función para que se ejecute antes de cada request
ALTER ROLE authenticator
  SET pgrst.db_pre_request = 'public.check_appointment_rate_limit';

-- Notificar a PostgREST para recargar la configuración
NOTIFY pgrst, 'reload config';

-- ============================================
-- 5. POLÍTICAS RLS (Solo el sistema puede escribir)
-- ============================================

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Nadie puede leer directamente (solo el sistema)
CREATE POLICY "Only system can access rate limits"
ON public.api_rate_limits
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- ============================================
-- 6. COMENTARIOS
-- ============================================

COMMENT ON TABLE public.api_rate_limits IS
'Registra requests a la API pública para rate limiting. Limita a 100 requests por IP por ventana de 15 minutos.';

COMMENT ON FUNCTION public.check_appointment_rate_limit() IS
'Pre-request function que verifica rate limits antes de procesar requests a endpoints de disponibilidad. Lanza excepción si se excede el límite.';

COMMENT ON FUNCTION public.cleanup_old_rate_limits() IS
'Limpia registros de rate limiting de más de 1 hora para mantener la tabla pequeña.';

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================

