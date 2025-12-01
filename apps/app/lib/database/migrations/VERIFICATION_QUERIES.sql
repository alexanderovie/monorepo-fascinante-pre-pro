-- ============================================
-- QUERIES DE VERIFICACIÓN POST-MIGRACIÓN
-- ============================================
-- Ejecuta estas queries después de aplicar las migraciones
-- para verificar que todo está correcto
-- ============================================

-- ============================================
-- 1. VERIFICAR RLS HABILITADO
-- ============================================
SELECT
  tablename,
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = t.tablename) as policy_count
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename IN ('oauth_tokens', 'profiles', 'businesses', 'subscriptions')
ORDER BY tablename;

-- Debe mostrar rls_enabled = true para todas las tablas críticas

-- ============================================
-- 2. VERIFICAR SEARCH_PATH EN FUNCIONES
-- ============================================
SELECT
  p.proname as function_name,
  CASE
    WHEN pg_get_functiondef(p.oid) LIKE '%SET search_path = ''%' THEN '✅ CORRECTO'
    ELSE '❌ FALTA search_path'
  END as search_path_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'create_guest_user',
    'decrypt_oauth_token',
    'encrypt_oauth_token',
    'get_google_business_token',
    'save_google_business_token',
    'update_oauth_tokens_updated_at',
    'update_updated_at_column',
    'update_user_integrations_updated_at'
  )
ORDER BY p.proname;

-- Todas deben mostrar "✅ CORRECTO"

-- ============================================
-- 3. VERIFICAR POLÍTICAS OPTIMIZADAS
-- ============================================
SELECT
  tablename,
  policyname,
  CASE
    WHEN qual::text LIKE '%(SELECT auth.uid())%' OR with_check::text LIKE '%(SELECT auth.uid())%' THEN '✅ OPTIMIZADA'
    WHEN qual::text LIKE '%auth.uid()%' OR with_check::text LIKE '%auth.uid()%' THEN '❌ NO OPTIMIZADA'
    ELSE 'ℹ️ NO USA auth.uid()'
  END as optimization_status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('documents', 'chats', 'messages', 'user_integrations', 'oauth_tokens')
ORDER BY tablename, policyname;

-- Las políticas que usan auth.uid() deben estar optimizadas

-- ============================================
-- 4. VERIFICAR ÍNDICES EN FOREIGN KEYS
-- ============================================
SELECT
  tc.table_name,
  kcu.column_name,
  CASE
    WHEN pi.indexname IS NOT NULL THEN '✅ TIENE ÍNDICE'
    ELSE '❌ FALTA ÍNDICE'
  END as index_status,
  pi.indexname
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN pg_indexes pi
  ON pi.tablename = tc.table_name
  AND pi.schemaname = tc.table_schema
  AND pi.indexdef LIKE '%' || kcu.column_name || '%'
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('notifications', 'suggestions', 'waitlist', 'Chat', 'Message')
ORDER BY tc.table_name, kcu.column_name;

-- Todas las foreign keys deben tener índice

-- ============================================
-- 5. VERIFICAR VIEW oauth_tokens_info
-- ============================================
SELECT
  viewname,
  definition LIKE '%security_invoker%' as has_security_invoker,
  CASE
    WHEN definition LIKE '%security_invoker%' THEN '✅ CORRECTO'
    ELSE '❌ FALTA security_invoker'
  END as view_status
FROM pg_views
WHERE schemaname = 'public'
  AND viewname = 'oauth_tokens_info';

-- Debe mostrar "✅ CORRECTO"

-- ============================================
-- 6. RESUMEN DE MEJORAS APLICADAS
-- ============================================
SELECT
  'RLS habilitado en oauth_tokens' as improvement,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_tables t
      JOIN pg_class c ON c.relname = t.tablename
      WHERE t.schemaname = 'public'
        AND t.tablename = 'oauth_tokens'
        AND c.relrowsecurity = true
    ) THEN '✅ APLICADO'
    ELSE '❌ PENDIENTE'
  END as status

UNION ALL

SELECT
  'Funciones con search_path corregido' as improvement,
  CASE
    WHEN (
      SELECT COUNT(*) FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public'
        AND p.proname IN ('create_guest_user', 'decrypt_oauth_token', 'encrypt_oauth_token', 'get_google_business_token', 'save_google_business_token', 'update_oauth_tokens_updated_at', 'update_updated_at_column', 'update_user_integrations_updated_at')
        AND pg_get_functiondef(p.oid) LIKE '%SET search_path = ''%'
    ) = 8 THEN '✅ APLICADO'
    ELSE '❌ PENDIENTE'
  END as status

UNION ALL

SELECT
  'Políticas RLS optimizadas' as improvement,
  CASE
    WHEN (
      SELECT COUNT(*) FROM pg_policies
      WHERE schemaname = 'public'
        AND (qual::text LIKE '%(SELECT auth.uid())%' OR with_check::text LIKE '%(SELECT auth.uid())%')
    ) > 30 THEN '✅ APLICADO'
    ELSE '❌ PENDIENTE'
  END as status

UNION ALL

SELECT
  'Índices en foreign keys' as improvement,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname LIKE '%_fk'
    ) THEN '✅ APLICADO'
    ELSE '❌ PENDIENTE'
  END as status;

-- ============================================
-- FIN DE VERIFICACIONES
-- ============================================
