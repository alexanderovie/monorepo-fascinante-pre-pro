-- ============================================
-- MIGRACIÓN: Políticas RLS para Acceso Público
-- ============================================
-- Esta migración agrega políticas que permiten lectura pública
-- de disponibilidad y servicios, manteniendo datos sensibles protegidos.
--
-- Basado en estándares de la industria (Cal.com, Calendly)
-- y mejores prácticas de Supabase RLS.
-- ============================================

-- ============================================
-- 1. AVAILABILITY_SETTINGS: Lectura Pública
-- ============================================
-- Permitir que usuarios anónimos vean horarios disponibles

CREATE POLICY IF NOT EXISTS "Public can read availability settings"
ON availability_settings FOR SELECT
TO anon
USING (true);

-- También permitir a usuarios autenticados leer
CREATE POLICY IF NOT EXISTS "Authenticated users can read availability settings"
ON availability_settings FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- 2. SERVICES: Lectura Pública de Servicios Activos
-- ============================================
-- Solo mostrar servicios activos al público

CREATE POLICY IF NOT EXISTS "Public can read active services"
ON services FOR SELECT
TO anon
USING (is_active = true);

-- Usuarios autenticados pueden ver todos (si es necesario)
CREATE POLICY IF NOT EXISTS "Authenticated users can read all services"
ON services FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- 3. BLOCKED_DATES: Lectura Pública
-- ============================================
-- Permitir ver días bloqueados

CREATE POLICY IF NOT EXISTS "Public can read blocked dates"
ON blocked_dates FOR SELECT
TO anon
USING (true);

-- ============================================
-- 4. APPOINTMENTS: Lectura Pública (Solo Slots Ocupados)
-- ============================================
-- Implementar Column-Level Security + RLS
-- para ocultar datos personales

-- Paso 4.1: Revocar acceso a columnas sensibles para anon
REVOKE SELECT (client_name, client_email, client_phone, notes, confirmation_token, cancelled_at, cancellation_reason, cancelled_by)
ON appointments
FROM anon;

-- Paso 4.2: Permitir lectura de solo columnas necesarias para calcular disponibilidad
GRANT SELECT (
  id,
  professional_id,
  start_time,
  end_time,
  status,
  location,
  service_id,
  timezone
)
ON appointments
TO anon;

-- Paso 4.3: Política RLS para slots ocupados (solo pending y confirmed)
CREATE POLICY IF NOT EXISTS "Public can view occupied slots"
ON appointments FOR SELECT
TO anon
USING (status IN ('pending', 'confirmed'));

-- ============================================
-- 5. APPOINTMENTS: Permitir Crear Citas (INSERT)
-- ============================================
-- Permitir que usuarios anónimos creen citas
-- con validaciones de seguridad estrictas

CREATE POLICY IF NOT EXISTS "Public can create appointments"
ON appointments FOR INSERT
TO anon
WITH CHECK (
  -- Validaciones de seguridad
  start_time >= NOW() AND -- No citas en el pasado
  end_time > start_time AND -- Rango válido
  status = 'pending' AND -- Siempre empieza como pending
  confirmation_required = true -- Siempre requiere confirmación
);

-- También permitir a usuarios autenticados crear citas
-- (pueden crear para otros profesionales si hay múltiples)
CREATE POLICY IF NOT EXISTS "Authenticated users can create appointments"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- 6. ÍNDICES PARA PERFORMANCE
-- ============================================
-- Optimizar consultas públicas de disponibilidad

CREATE INDEX IF NOT EXISTS idx_appointments_status_time_public
ON appointments(status, start_time, end_time)
WHERE status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS idx_appointments_professional_status_time
ON appointments(professional_id, status, start_time, end_time)
WHERE status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS idx_blocked_dates_date_active
ON blocked_dates(date, all_day)
WHERE date >= CURRENT_DATE;

CREATE INDEX IF NOT EXISTS idx_services_active_public
ON services(is_active, id)
WHERE is_active = true;

-- ============================================
-- 7. COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================

COMMENT ON POLICY "Public can read availability settings" ON availability_settings IS
'Permite que usuarios anónimos vean horarios disponibles. Necesario para página pública de reservas.';

COMMENT ON POLICY "Public can read active services" ON services IS
'Permite que usuarios anónimos vean servicios disponibles. Solo muestra servicios activos.';

COMMENT ON POLICY "Public can read blocked dates" ON blocked_dates IS
'Permite que usuarios anónimos vean días bloqueados para evitar intentos de reserva.';

COMMENT ON POLICY "Public can view occupied slots" ON appointments IS
'Permite que usuarios anónimos vean slots ocupados para calcular disponibilidad. Column-level security oculta datos personales.';

COMMENT ON POLICY "Public can create appointments" ON appointments IS
'Permite que usuarios anónimos creen citas con validaciones estrictas: no pasado, status pending, requiere confirmación.';

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
-- Después de aplicar esta migración:
-- 1. Verifica que la web pública puede ver disponibilidad
-- 2. Verifica que los datos sensibles están protegidos
-- 3. Prueba crear una cita desde la web pública
-- 4. Revisa que los índices mejoran el performance
-- ============================================
