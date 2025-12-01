-- ============================================
-- MIGRACIÓN: Consolidar Políticas Duplicadas
-- ============================================
-- Fecha: 2025-12-20
-- Descripción: Consolida políticas RLS duplicadas que afectan performance
--
-- Cambios:
-- 1. Consolida políticas en appointments (2 INSERT para authenticated)
-- 2. Consolida políticas en availability_settings (2 SELECT para authenticated)
-- 3. Consolida políticas en services (2 SELECT para authenticated)
--
-- Basado en: Supabase Database Advisor Lint 0006 (multiple_permissive_policies)
-- ============================================

BEGIN;

-- ============================================
-- 1. CONSOLIDAR POLÍTICAS: appointments
-- ============================================
-- Problema: 2 políticas INSERT para authenticated
-- - "Authenticated users can create appointments"
-- - "Authenticated users can manage their appointments" (FOR ALL incluye INSERT)

-- Eliminar política específica de INSERT (la política FOR ALL ya la cubre)
DROP POLICY IF EXISTS "Authenticated users can create appointments" ON public.appointments;

-- La política "Authenticated users can manage their appointments" (FOR ALL) ya cubre INSERT, UPDATE, DELETE, SELECT
-- No necesitamos hacer nada más

-- ============================================
-- 2. CONSOLIDAR POLÍTICAS: availability_settings
-- ============================================
-- Problema: 2 políticas SELECT para authenticated
-- - "Authenticated users can manage their availability" (FOR ALL incluye SELECT)
-- - "Authenticated users can read availability settings"

-- Verificar qué políticas públicas existen primero
-- Si hay política pública, mantenerla. Si no, la política FOR ALL ya cubre SELECT

-- Eliminar política duplicada de SELECT
DROP POLICY IF EXISTS "Authenticated users can read availability settings" ON public.availability_settings;

-- La política "Authenticated users can manage their availability" (FOR ALL) ya cubre SELECT
-- Las políticas públicas se mantienen (son necesarias para acceso anónimo)

-- ============================================
-- 3. CONSOLIDAR POLÍTICAS: services
-- ============================================
-- Problema: 2 políticas SELECT para authenticated
-- - "Authenticated users can manage their services" (FOR ALL incluye SELECT)
-- - "Authenticated users can read all services"

-- Eliminar política duplicada de SELECT
DROP POLICY IF EXISTS "Authenticated users can read all services" ON public.services;

-- La política "Authenticated users can manage their services" (FOR ALL) ya cubre SELECT
-- Las políticas públicas se mantienen (son necesarias para acceso anónimo)

-- ============================================
-- 4. VERIFICAR Y ELIMINAR ÍNDICE DUPLICADO
-- ============================================
-- availability_settings tiene 2 índices idénticos según advisors

-- Intentar eliminar el constraint-based index
-- Si es un constraint, no podemos eliminarlo directamente
-- En su lugar, verificamos que solo hay uno activo

-- El índice idx_availability_settings_professional ya existe
-- El constraint availability_settings_professional_id_key es un UNIQUE constraint
-- No podemos eliminarlo sin eliminar el constraint, así que lo dejamos
-- (El constraint tiene un propósito de integridad, no solo performance)

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
-- Después de aplicar:
-- 1. Verificar que las queries siguen funcionando correctamente
-- 2. Monitorear performance (debería mejorar al tener menos políticas por query)
-- 3. Verificar que usuarios authenticated pueden hacer todas las operaciones
-- 4. Verificar que usuarios anónimos mantienen acceso público donde corresponde
-- ============================================

COMMIT;
