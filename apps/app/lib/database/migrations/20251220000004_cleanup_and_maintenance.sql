-- ============================================
-- MIGRACIÓN: Fase 4 - Limpieza y Mantenimiento
-- ============================================
-- Fecha: 2025-12-20
-- Descripción: Limpieza opcional y preparación para producción
--
-- Cambios:
-- 1. Comentarios y documentación mejorada
-- 2. Preparación para futuras mejoras
--
-- Nota: Esta migración es opcional y no crítica
-- Basado en: Mejores prácticas de mantenimiento de base de datos
-- ============================================

BEGIN;

-- ============================================
-- 1. MEJORAR COMENTARIOS EN TABLAS PRINCIPALES
-- ============================================

COMMENT ON TABLE public.profiles IS
'ÉLITE: Perfiles de usuario con RLS habilitado. Políticas optimizadas con (SELECT auth.uid()).';

COMMENT ON TABLE public.businesses IS
'ÉLITE: Google My Business locations con RLS habilitado. Acceso solo a owner.';

COMMENT ON TABLE public.subscriptions IS
'ÉLITE: Stripe subscriptions con RLS habilitado. Service role para webhooks.';

COMMENT ON TABLE public.audits IS
'Reportes de auditoría generados. RLS deshabilitado (requiere revisión).';

COMMENT ON TABLE public.analytics_cache IS
'Cache layer para llamadas API costosas (Google, DataForSEO). RLS deshabilitado (requiere revisión).';

COMMENT ON TABLE public.oauth_tokens IS
'ÉLITE: Metadatos de tokens OAuth. Los refresh tokens se guardan encriptados en Vault. RLS habilitado.';

-- ============================================
-- 2. DOCUMENTAR TABLAS LEGACY
-- ============================================
-- Estas tablas parecen ser legacy/duplicadas
-- Se documentan para futura decisión de migración/eliminación

COMMENT ON TABLE public."Chat" IS
'LEGACY: Tabla legacy de chat. Considerar migrar datos a public.chats y eliminar.';

COMMENT ON TABLE public."User" IS
'LEGACY: Tabla legacy de usuarios. Considerar migrar datos a public.users y eliminar.';

COMMENT ON TABLE public."Message" IS
'LEGACY: Tabla legacy de mensajes. Considerar migrar datos a public.messages y eliminar.';

COMMENT ON TABLE public."Document" IS
'LEGACY: Tabla legacy de documentos. Considerar migrar datos a public.documents y eliminar.';

COMMENT ON TABLE public."Vote" IS
'LEGACY: Tabla legacy de votos. Considerar migrar datos a public.votes y eliminar.';

COMMENT ON TABLE public."Suggestion" IS
'LEGACY: Tabla legacy de sugerencias. Considerar migrar datos a public.suggestions y eliminar.';

COMMENT ON TABLE public."Stream" IS
'LEGACY: Tabla legacy de streams. Considerar migrar datos o eliminar si no se usa.';

-- ============================================
-- 3. PREPARACIÓN PARA FUTURAS MEJORAS
-- ============================================
-- Comentarios sobre decisiones futuras

COMMENT ON TABLE public.audits IS
'FUTURO: Considerar habilitar RLS con políticas apropiadas para multi-tenant.';

COMMENT ON TABLE public.analytics_cache IS
'FUTURO: Considerar habilitar RLS si se necesita acceso por usuario. Actualmente es cache interno.';

-- ============================================
-- 4. VERIFICACIÓN DE INTEGRIDAD
-- ============================================
-- Estas queries verifican que todo está correcto
-- No hacen cambios, solo documentan el estado

-- Verificar que RLS está habilitado en tablas críticas
DO $$
DECLARE
  rls_disabled_tables TEXT[];
BEGIN
  SELECT array_agg(tablename)
  INTO rls_disabled_tables
  FROM pg_tables t
  JOIN pg_class c ON c.relname = t.tablename
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE t.schemaname = 'public'
    AND c.relkind = 'r'
    AND NOT c.relrowsecurity
    AND tablename NOT IN ('audits', 'analytics_cache') -- Excepciones conocidas
    AND tablename NOT LIKE 'Chat' -- Legacy tables
    AND tablename NOT LIKE 'User'
    AND tablename NOT LIKE 'Message'
    AND tablename NOT LIKE 'Document'
    AND tablename NOT LIKE 'Vote'
    AND tablename NOT LIKE 'Suggestion'
    AND tablename NOT LIKE 'Stream';

  IF array_length(rls_disabled_tables, 1) > 0 THEN
    RAISE NOTICE 'ADVERTENCIA: Las siguientes tablas no tienen RLS habilitado: %',
      array_to_string(rls_disabled_tables, ', ');
  END IF;
END $$;

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
-- Esta migración es principalmente documentación
-- No hace cambios críticos, solo mejora la claridad
--
-- Próximos pasos recomendados:
-- 1. Decidir sobre tablas legacy (migrar o eliminar)
-- 2. Revisar necesidad de RLS en audits y analytics_cache
-- 3. Monitorear performance después de todas las optimizaciones
-- ============================================

COMMIT;
