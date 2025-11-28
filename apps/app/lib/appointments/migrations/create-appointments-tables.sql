-- Sistema de Reserva de Citas - Migración de Tablas
--
-- ÉLITE PRO: Tablas para sistema de reserva de citas con automatizaciones
-- Diseñado para consultoría/auditoría escalable
--
-- Ejecutar en Supabase SQL Editor

-- ============================================
-- 1. TABLA PRINCIPAL: APPOINTMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),

  -- Horario
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'confirmed',
    'completed',
    'cancelled',
    'no_show'
  )),
  confirmation_token VARCHAR(255) UNIQUE,
  confirmation_required BOOLEAN DEFAULT true,
  confirmed_at TIMESTAMPTZ,

  -- Detalles
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_type VARCHAR(100), -- Para retrocompatibilidad
  notes TEXT,
  location VARCHAR(255) CHECK (location IN ('virtual', 'office')) DEFAULT 'virtual',

  -- Pago
  requires_payment BOOLEAN DEFAULT false,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
    'pending',
    'paid',
    'refunded',
    'failed'
  )),

  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  cancelled_by VARCHAR(20) CHECK (cancelled_by IN ('client', 'professional', 'system')),

  -- Validaciones
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT appointments_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para appointments
CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_confirmation_token ON appointments(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_appointments_client_email ON appointments(client_email);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);

-- ============================================
-- 2. SERVICIOS/TIPOS DE CONSULTORÍA
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30 CHECK (duration_minutes > 0),
  price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  requires_payment BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT services_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_services_professional ON services(professional_id);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active) WHERE is_active = true;

-- ============================================
-- 3. CONFIGURACIÓN DE DISPONIBILIDAD
-- ============================================
CREATE TABLE IF NOT EXISTS availability_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Horarios por día (TIME formato HH:MM:SS)
  monday_start TIME,
  monday_end TIME,
  tuesday_start TIME,
  tuesday_end TIME,
  wednesday_start TIME,
  wednesday_end TIME,
  thursday_start TIME,
  thursday_end TIME,
  friday_start TIME,
  friday_end TIME,
  saturday_start TIME,
  saturday_end TIME,
  sunday_start TIME,
  sunday_end TIME,

  -- Configuración general
  slot_duration_minutes INTEGER DEFAULT 30 CHECK (slot_duration_minutes > 0),
  buffer_time_minutes INTEGER DEFAULT 15 CHECK (buffer_time_minutes >= 0),
  timezone VARCHAR(50) DEFAULT 'UTC',

  -- Opciones
  allow_same_day_booking BOOLEAN DEFAULT true,
  max_advance_days INTEGER DEFAULT 90 CHECK (max_advance_days > 0),

  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT availability_settings_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_availability_settings_professional ON availability_settings(professional_id);

-- ============================================
-- 4. DÍAS BLOQUEADOS/FERIADOS
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  reason VARCHAR(255),
  all_day BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,

  UNIQUE(professional_id, date),
  CONSTRAINT blocked_dates_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT valid_blocked_time_range CHECK (
    (all_day = true) OR
    (all_day = false AND start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
  )
);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_professional ON blocked_dates(professional_id);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates(date);

-- ============================================
-- 5. LISTA DE ESPERA
-- ============================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  preferred_date DATE,
  preferred_time TIME,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_type VARCHAR(100),
  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT waitlist_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT waitlist_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_waitlist_professional ON waitlist(professional_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_notified ON waitlist(notified) WHERE notified = false;

-- ============================================
-- 6. PAGOS (Citas individuales)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,

  -- Stripe
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_checkout_session_id VARCHAR(255) UNIQUE,

  -- Monto
  amount INTEGER NOT NULL CHECK (amount > 0), -- En centavos
  currency VARCHAR(3) DEFAULT 'usd',

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'succeeded',
    'failed',
    'refunded',
    'canceled'
  )),
  payment_method VARCHAR(50),

  -- Metadatos
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT payments_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payments_appointment ON payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================
-- 7. LOGS DE AUTOMATIZACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS appointment_automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  automation_type VARCHAR(50) NOT NULL CHECK (automation_type IN (
    'email_confirmation',
    'email_reminder_24h',
    'email_reminder_2h',
    'sms_confirmation',
    'sms_reminder_24h',
    'sms_reminder_2h',
    'confirmation_check',
    'auto_cancellation'
  )),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  recipient VARCHAR(255),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT appointment_automation_logs_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_automation_logs_appointment ON appointment_automation_logs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_type ON appointment_automation_logs(automation_type);
CREATE INDEX IF NOT EXISTS idx_automation_logs_status ON appointment_automation_logs(status);
CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at ON appointment_automation_logs(created_at);

-- ============================================
-- 8. EXTENDER TABLA DE NOTIFICACIONES EXISTENTE
-- ============================================
-- Agregar tipos de notificación de citas al enum existente
-- Primero eliminamos el constraint antiguo si existe
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Agregamos el nuevo constraint con todos los tipos (existentes + nuevos)
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    -- Tipos existentes de GBP
    'activity_change',
    'verification_required',
    'admin_added',
    'admin_removed',
    'location_deleted',
    'system_alert',
    -- Nuevos tipos de citas
    'appointment_confirmation',
    'appointment_reminder_24h',
    'appointment_reminder_2h',
    'appointment_cancellation',
    'appointment_rescheduled',
    'appointment_completed',
    'waitlist_notification'
  ));

-- ============================================
-- 9. TRIGGERS PARA UPDATED_AT
-- ============================================
-- Usar la función existente update_updated_at_column()

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_settings_updated_at
  BEFORE UPDATE ON availability_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own appointments as professional"
  ON appointments FOR SELECT
  USING (auth.uid() = professional_id);

CREATE POLICY "Users can manage their own appointments"
  ON appointments FOR ALL
  USING (auth.uid() = professional_id);

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own services"
  ON services FOR ALL
  USING (auth.uid() = professional_id);

-- Availability Settings
ALTER TABLE availability_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own availability"
  ON availability_settings FOR ALL
  USING (auth.uid() = professional_id);

-- Blocked Dates
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own blocked dates"
  ON blocked_dates FOR ALL
  USING (auth.uid() = professional_id);

-- Waitlist
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own waitlist"
  ON waitlist FOR SELECT
  USING (auth.uid() = professional_id);

CREATE POLICY "Users can manage their own waitlist"
  ON waitlist FOR ALL
  USING (auth.uid() = professional_id);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payments for their appointments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = payments.appointment_id
      AND appointments.professional_id = auth.uid()
    )
  );

-- Automation Logs
ALTER TABLE appointment_automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view automation logs for their appointments"
  ON appointment_automation_logs FOR SELECT
  USING (
    appointment_id IS NULL OR
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_automation_logs.appointment_id
      AND appointments.professional_id = auth.uid()
    )
  );

-- ============================================
-- 11. COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE appointments IS 'Citas/Appointments del sistema de reserva. Soporta consultoría presencial y virtual.';
COMMENT ON TABLE services IS 'Tipos de servicios/consultoría ofrecidos. Configurables por profesional.';
COMMENT ON TABLE availability_settings IS 'Configuración de horarios de disponibilidad por día de la semana.';
COMMENT ON TABLE blocked_dates IS 'Días bloqueados/feriados cuando el profesional no está disponible.';
COMMENT ON TABLE waitlist IS 'Lista de espera para citas cuando no hay disponibilidad inmediata.';
COMMENT ON TABLE payments IS 'Pagos individuales de citas. Diferente de subscriptions (planes recurrentes).';
COMMENT ON TABLE appointment_automation_logs IS 'Log de automatizaciones enviadas (emails, SMS, etc.) para auditoría.';

COMMENT ON COLUMN appointments.confirmation_token IS 'Token único para que el cliente confirme/cancele su cita sin autenticarse';
COMMENT ON COLUMN appointments.confirmation_required IS 'Si requiere confirmación del cliente antes de la cita (evita no-shows)';
COMMENT ON COLUMN services.price_cents IS 'Precio en centavos. Ejemplo: 5000 = $50.00';
COMMENT ON COLUMN payments.amount IS 'Monto en centavos. Ejemplo: 5000 = $50.00';
