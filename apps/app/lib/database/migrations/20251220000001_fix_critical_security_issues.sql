-- ============================================
-- MIGRACIÓN: Fase 1 - Seguridad Crítica
-- ============================================
-- Fecha: 2025-12-20
-- Descripción: Corrige vulnerabilidades críticas de seguridad
--
-- Cambios:
-- 1. Habilita RLS en oauth_tokens (tiene políticas pero RLS deshabilitado)
-- 2. Corrige search_path en 9 funciones (previene SQL injection)
-- 3. Corrige view oauth_tokens_info (security_invoker)
--
-- Basado en: Supabase Security Best Practices (Diciembre 2025)
-- ============================================

BEGIN;

-- ============================================
-- 1. HABILITAR RLS EN oauth_tokens
-- ============================================
-- CRÍTICO: Esta tabla tiene 4 políticas RLS pero RLS está deshabilitado
-- Las políticas no se aplican sin RLS habilitado

ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.oauth_tokens IS
'ÉLITE: OAuth tokens con RLS habilitado. Políticas optimizadas con (SELECT auth.uid()).';

-- ============================================
-- 2. CORREGIR SEARCH_PATH EN FUNCIONES
-- ============================================
-- Previene SQL injection mediante search_path manipulation
-- Todas las referencias deben ser fully qualified

-- 2.1. create_guest_user
CREATE OR REPLACE FUNCTION public.create_guest_user()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  user_id UUID;
BEGIN
  INSERT INTO public.auth_users (email, name, provider)
  VALUES (NULL, 'Guest User', 'guest')
  RETURNING id INTO user_id;

  RETURN user_id;
END;
$function$;

COMMENT ON FUNCTION public.create_guest_user() IS
'Crea un usuario invitado. Search_path fijado para seguridad.';

-- 2.2. decrypt_oauth_token
CREATE OR REPLACE FUNCTION public.decrypt_oauth_token(encrypted_token text, encryption_key text)
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_token, 'base64'),
    encryption_key
  );
END;
$function$;

COMMENT ON FUNCTION public.decrypt_oauth_token(text, text) IS
'Desencripta tokens OAuth. Search_path fijado para seguridad.';

-- 2.3. encrypt_oauth_token
CREATE OR REPLACE FUNCTION public.encrypt_oauth_token(token text, encryption_key text)
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  -- Usar pgcrypto para encriptación AES-256
  RETURN encode(
    pgp_sym_encrypt(token, encryption_key),
    'base64'
  );
END;
$function$;

COMMENT ON FUNCTION public.encrypt_oauth_token(text, text) IS
'Encripta tokens OAuth. Search_path fijado para seguridad.';

-- 2.4. get_google_business_token
CREATE OR REPLACE FUNCTION public.get_google_business_token(p_user_id uuid, p_provider text)
RETURNS TABLE(
  token_value text,
  expires_at timestamp with time zone,
  scope text,
  is_expired boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    vs.decrypted_secret::TEXT as token_value,
    ot.expires_at,
    ot.scope,
    (ot.expires_at IS NOT NULL AND ot.expires_at < NOW()) as is_expired,
    ot.created_at
  FROM public.oauth_tokens ot
  JOIN vault.decrypted_secrets vs ON vs.id = ot.vault_secret_id
  WHERE ot.user_id = p_user_id
    AND ot.provider = p_provider
  ORDER BY ot.created_at DESC
  LIMIT 1;
END;
$function$;

COMMENT ON FUNCTION public.get_google_business_token(uuid, text) IS
'Obtiene token de Google Business Profile. Search_path fijado para seguridad.';

-- 2.5. save_google_business_token
CREATE OR REPLACE FUNCTION public.save_google_business_token(
  p_user_id uuid,
  p_token_value text,
  p_provider text,
  p_scope text,
  p_expires_at timestamp with time zone
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_secret_id UUID;
  v_oauth_id UUID;
BEGIN
  -- 1. Guardar token en vault.secrets (cifrado automático de Supabase)
  SELECT vault.create_secret(p_token_value, p_provider || ' token') INTO v_secret_id;

  -- 2. Guardar metadata en oauth_tokens
  INSERT INTO public.oauth_tokens (
    user_id,
    provider,
    vault_secret_id,
    expires_at,
    scope
  ) VALUES (
    p_user_id,
    p_provider,
    v_secret_id,
    p_expires_at,
    p_scope
  )
  RETURNING id INTO v_oauth_id;

  RETURN v_oauth_id;
END;
$function$;

COMMENT ON FUNCTION public.save_google_business_token(uuid, text, text, text, timestamp with time zone) IS
'Guarda token de Google Business Profile. Search_path fijado para seguridad.';

-- 2.6. update_oauth_tokens_updated_at
CREATE OR REPLACE FUNCTION public.update_oauth_tokens_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

COMMENT ON FUNCTION public.update_oauth_tokens_updated_at() IS
'Trigger para actualizar updated_at en oauth_tokens. Search_path fijado para seguridad.';

-- 2.7. update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

COMMENT ON FUNCTION public.update_updated_at_column() IS
'Trigger genérico para actualizar updated_at. Search_path fijado para seguridad.';

-- 2.8. update_user_integrations_updated_at
CREATE OR REPLACE FUNCTION public.update_user_integrations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

COMMENT ON FUNCTION public.update_user_integrations_updated_at() IS
'Trigger para actualizar updated_at en user_integrations. Search_path fijado para seguridad.';

-- ============================================
-- 3. CORREGIR VIEW oauth_tokens_info
-- ============================================
-- Cambiar de SECURITY DEFINER a security_invoker = true
-- Esto hace que la view respete RLS de las tablas subyacentes

-- Primero eliminar la view existente
DROP VIEW IF EXISTS public.oauth_tokens_info;

-- Recrear con security_invoker = true (Postgres 15+)
CREATE VIEW public.oauth_tokens_info
WITH (security_invoker = true)
AS
SELECT
  oauth_tokens.id,
  oauth_tokens.user_id,
  oauth_tokens.provider,
  oauth_tokens.expires_at,
  oauth_tokens.scope,
  oauth_tokens.created_at,
  oauth_tokens.updated_at,
  CASE
    WHEN (oauth_tokens.expires_at > now()) THEN true
    ELSE false
  END AS is_valid
FROM public.oauth_tokens;

COMMENT ON VIEW public.oauth_tokens_info IS
'View de información de tokens OAuth. Usa security_invoker para respetar RLS.';

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
-- Después de aplicar esta migración:
-- 1. Verifica que RLS está habilitado en oauth_tokens
-- 2. Prueba que las funciones funcionan correctamente
-- 3. Verifica que la view respeta RLS
-- ============================================

COMMIT;
