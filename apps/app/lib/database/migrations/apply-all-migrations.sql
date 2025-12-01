-- ============================================
-- SCRIPT MASTER: Aplicar Todas las Migraciones
-- ============================================
-- Este script aplica todas las migraciones en orden
-- Úsalo solo si quieres aplicar todo de una vez
--
-- RECOMENDACIÓN: Aplica las migraciones una por una
-- para poder verificar cada paso
-- ============================================

-- IMPORTANTE: Este script requiere que los archivos de migración
-- estén disponibles. Si usas Supabase CLI, usa:
-- supabase db push
--
-- Si usas el Dashboard, copia y pega cada migración individualmente

\echo '============================================'
\echo 'APLICANDO MIGRACIONES DE MEJORAS ÉLITE'
\echo '============================================'
\echo ''

\echo 'Fase 1: Seguridad Crítica...'
\i 20251220000001_fix_critical_security_issues.sql

\echo 'Fase 2: Optimización RLS...'
\i 20251220000002_optimize_rls_policies.sql

\echo 'Fase 3: Índices en Foreign Keys...'
\i 20251220000003_add_missing_indexes.sql

\echo 'Fase 4: Limpieza y Mantenimiento...'
\i 20251220000004_cleanup_and_maintenance.sql

\echo ''
\echo '============================================'
\echo 'TODAS LAS MIGRACIONES APLICADAS EXITOSAMENTE'
\echo '============================================'
\echo ''
\echo 'Próximos pasos:'
\echo '1. Verifica que RLS está habilitado en oauth_tokens'
\echo '2. Prueba que las funciones funcionan correctamente'
\echo '3. Monitorea el performance de queries'
\echo '4. Revisa los índices creados'
\echo ''
