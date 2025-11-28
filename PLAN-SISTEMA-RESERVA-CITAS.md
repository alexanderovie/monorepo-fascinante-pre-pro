# 🎯 PLAN ELITE PRO: Sistema de Reserva de Citas
## Con Automatizaciones Estándar de la Industria

---

## 📋 RESUMEN EJECUTIVO

Sistema de reserva de citas profesional, ligero y personalizado, sin dependencias pesadas como Cal.com. Diseñado siguiendo estándares de la industria con automatizaciones inteligentes y UX optimizada.

**Arquitectura:**
- **Dashboard** (`apps/app`): Visualización y gestión de citas (puerto 3001)
- **Web Pública** (`apps/web-publica`): Reserva de citas para clientes (puerto 3002)
- **Backend**: Supabase (PostgreSQL + Edge Functions para automatizaciones)

---

## 🚀 AUTOMATIZACIONES ESTÁNDAR DE LA INDUSTRIA

### 1. **Notificaciones Automáticas (Email/SMS)**
- ✅ **Confirmación inmediata** al cliente al reservar
- ✅ **Recordatorio 24h antes** de la cita
- ✅ **Recordatorio 2h antes** (opcional)
- ✅ **Confirmación de asistencia** 1h antes (con link para confirmar/cancelar)
- ✅ **Notificación al profesional** cuando se reserva una cita
- ✅ **Resumen diario** para el profesional (citas del día)

### 2. **Gestión Inteligente de Horarios**
- ✅ **Bloqueo automático** de horarios pasados
- ✅ **Buffer time** entre citas (configurable por servicio)
- ✅ **Zona horaria automática** basada en ubicación del cliente
- ✅ **Horarios de trabajo** configurables por día de la semana
- ✅ **Días festivos/feriados** configurables
- ✅ **Vacaciones temporales** del profesional

### 3. **Prevención de Doble Reserva**
- ✅ **Locks temporales** (5-10 min) al seleccionar un slot
- ✅ **Validación en tiempo real** antes de confirmar
- ✅ **Conflictos detectados** automáticamente

### 4. **Recordatorios y Seguimiento**
- ✅ **Confirmación requerida** 2h antes (evita no-shows)
- ✅ **Auto-cancelación** si no confirma a tiempo
- ✅ **Lista de espera** automática si se cancela una cita
- ✅ **Notificación de cancelación** a siguiente en lista

### 5. **Automatización de Reagendamiento**
- ✅ **Auto-reagendamiento** cuando el profesional cancela
- ✅ **Sugerencias inteligentes** de horarios alternativos
- ✅ **Política de cancelación** (ventanas de tiempo)

### 6. **Post-Cita Automatizada**
- ✅ **Encuesta de satisfacción** automática post-cita
- ✅ **Solicitud de reseña** (opcional, después de 24h)
- ✅ **Seguimiento** para re-reservas

### 7. **Integración con Calendarios Externos**
- ✅ **Sincronización bidireccional** con Google Calendar / Outlook
- ✅ **Bloqueos automáticos** cuando hay eventos externos
- ✅ **Auto-actualización** cuando se cambia algo externamente

### 8. **Automatización de Pagos (Si aplica)**
- ✅ **Pago requerido** para confirmar cita (opcional)
- ✅ **Reembolso automático** si se cancela a tiempo
- ✅ **Cobro diferido** (por ejemplo, 50% al reservar, 50% después)

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS (Supabase)

```sql
-- Tabla principal de citas
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES auth.users(id) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),

  -- Horario
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled, no_show
  confirmation_token VARCHAR(255) UNIQUE,

  -- Detalles
  service_id UUID REFERENCES services(id),
  service_type VARCHAR(100), -- Para retrocompatibilidad
  notes TEXT,
  location VARCHAR(255), -- 'virtual', 'office', o dirección física

  -- Pago
  requires_payment BOOLEAN DEFAULT false,
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, refunded

  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,

  -- Índices
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Configuración de disponibilidad del profesional
CREATE TABLE availability_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,

  -- Horarios por día
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
  slot_duration_minutes INTEGER DEFAULT 30,
  buffer_time_minutes INTEGER DEFAULT 15,
  timezone VARCHAR(50) DEFAULT 'UTC',

  -- Opciones
  allow_same_day_booking BOOLEAN DEFAULT true,
  max_advance_days INTEGER DEFAULT 90,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Días bloqueados/feriados
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  reason VARCHAR(255),
  all_day BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,

  UNIQUE(professional_id, date)
);

-- Lista de espera
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES auth.users(id) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  preferred_date DATE,
  preferred_time TIME,
  service_type VARCHAR(100),
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log de automatizaciones (auditoría)
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id),
  automation_type VARCHAR(50) NOT NULL, -- 'email_confirmation', 'reminder_24h', 'reminder_2h', etc.
  status VARCHAR(20) NOT NULL, -- 'sent', 'failed', 'pending'
  recipient VARCHAR(255),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pagos asociados a citas (Stripe)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) NOT NULL,

  -- Stripe
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_checkout_session_id VARCHAR(255) UNIQUE,

  -- Monto
  amount INTEGER NOT NULL, -- En centavos
  currency VARCHAR(3) DEFAULT 'usd',

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, refunded
  payment_method VARCHAR(50), -- card, etc.

  -- Metadatos
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Servicios/Tipos de consultoría configurables
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES auth.users(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price_cents INTEGER NOT NULL, -- Precio en centavos
  requires_payment BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_confirmation_token ON appointments(confirmation_token);
CREATE INDEX idx_automation_logs_appointment ON automation_logs(appointment_id);
CREATE INDEX idx_waitlist_professional ON waitlist(professional_id);
CREATE INDEX idx_payments_appointment ON payments(appointment_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_services_professional ON services(professional_id);
```

---

## 🎨 FUNCIONALIDADES PRINCIPALES

### **Dashboard (apps/app)**

#### Vista de Calendario
- ✅ Vista mensual/semanal/diaria
- ✅ Citas coloreadas por estado
- ✅ Filtros: estado, fecha, cliente
- ✅ Drag & drop para reagendar (opcional)

#### Gestión de Citas
- ✅ Ver detalles completos
- ✅ Editar/Reagendar
- ✅ Cancelar con razón
- ✅ Marcar como completada
- ✅ Enviar recordatorio manual
- ✅ Notas internas

#### Configuración
- ✅ Horarios de disponibilidad
- ✅ Días bloqueados/feriados
- ✅ Duración de slots
- ✅ Buffer time
- ✅ Políticas de cancelación

### **Web Pública (apps/web-publica)**

#### Página de Reserva
- ✅ Selección de fecha (calendario visual)
- ✅ Selección de hora (slots disponibles)
- ✅ Formulario de datos del cliente
- ✅ Confirmación inmediata
- ✅ Link para gestionar la cita (confirmar/cancelar)

#### Gestión del Cliente
- ✅ Ver/editar su cita
- ✅ Confirmar asistencia
- ✅ Cancelar (si está permitido)
- ✅ Reagendar

---

## ⚙️ IMPLEMENTACIÓN TÉCNICA

### **1. Edge Functions (Supabase) para Automatizaciones**

```
supabase/functions/
├── send-email/
│   └── index.ts          # Envío de emails (Resend/SendGrid)
├── send-sms/
│   └── index.ts          # Envío de SMS (Twilio)
├── appointment-reminders/
│   └── index.ts          # Cron job para recordatorios
├── confirmation-checker/
│   └── index.ts          # Verifica confirmaciones pendientes
└── sync-calendar/
    └── index.ts          # Sincronización con Google Calendar
```

### **2. Triggers de Base de Datos**

```sql
-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para enviar email al crear cita
CREATE OR REPLACE FUNCTION trigger_appointment_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Llamar a Edge Function para enviar email
  PERFORM net.http_post(
    url := 'https://[TU-PROYECTO].supabase.co/functions/v1/send-email',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'type', 'appointment_confirmation',
      'appointment_id', NEW.id,
      'client_email', NEW.client_email
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_appointment_created
  AFTER INSERT ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_appointment_created();
```

### **3. Cron Jobs (Supabase pg_cron)**

```sql
-- Recordatorio 24h antes
SELECT cron.schedule(
  'reminder-24h',
  '0 * * * *', -- Cada hora
  $$
  SELECT net.http_post(
    url := 'https://[TU-PROYECTO].supabase.co/functions/v1/appointment-reminders',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object('type', '24h_reminder')::text
  );
  $$
);

-- Verificar confirmaciones pendientes
SELECT cron.schedule(
  'check-confirmations',
  '*/15 * * * *', -- Cada 15 minutos
  $$
  SELECT net.http_post(
    url := 'https://[TU-PROYECTO].supabase.co/functions/v1/confirmation-checker',
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  $$
);
```

### **4. Componentes React**

```
apps/app/app/dashboard/appointments/
├── calendar/
│   ├── CalendarView.tsx      # Vista de calendario
│   ├── MonthView.tsx
│   ├── WeekView.tsx
│   └── DayView.tsx
├── AppointmentCard.tsx        # Card individual
├── AppointmentDetails.tsx     # Modal/panel de detalles
└── AvailabilitySettings.tsx   # Configuración

apps/web-publica/app/[locale]/book/
├── page.tsx                   # Página principal de reserva
├── CalendarPicker.tsx         # Selección de fecha
├── TimeSlotPicker.tsx         # Selección de hora
├── BookingForm.tsx            # Formulario
└── ConfirmationPage.tsx       # Página de confirmación
```

---

## 📦 DEPENDENCIAS NECESARIAS

### **Dashboard (`apps/app`)**
- ✅ `@fullcalendar/react` - Calendario profesional
- ✅ `@fullcalendar/daygrid`
- ✅ `@fullcalendar/timegrid`
- ✅ `@fullcalendar/interaction`
- ✅ `date-fns` - Manejo de fechas
- ✅ `date-fns-tz` - Zonas horarias
- ✅ `react-hook-form` - Manejo de formularios
- ✅ `zod` - Validación de schemas
- ✅ `@hookform/resolvers` - Integración zod + react-hook-form
- ✅ `@stripe/stripe-js` - Stripe frontend
- ✅ `stripe` - Stripe backend

### **Web Pública (`apps/web-publica`)**
- ✅ `react-day-picker` - Selección de fechas (ligero)
- ✅ `date-fns` - Manejo de fechas
- ✅ `date-fns-tz` - Zonas horarias
- ✅ `react-hook-form` - Manejo de formularios
- ✅ `zod` - Validación de schemas
- ✅ `@hookform/resolvers` - Integración zod + react-hook-form
- ✅ `@stripe/stripe-js` - Stripe frontend

### **Backend (Supabase Edge Functions)**
- ✅ `@supabase/functions-js`
- ✅ `resend` - Emails (ya tienes API key) ✅
- ✅ `twilio` - SMS (ya tienes API) ✅
- ✅ `stripe` - Pagos (necesitamos configurar) 🆕

---

## 🎯 PLAN DE IMPLEMENTACIÓN (Fases)

### **Fase 1: MVP (Semana 1-2)**
- [ ] Estructura de BD completa (incluyendo pagos)
- [ ] Instalar dependencias (FullCalendar, Stripe, date-fns, etc.)
- [ ] API básica (crear/leer/actualizar citas)
- [ ] Página de reserva en web pública (`/book`)
- [ ] Vista de calendario en dashboard (`/dashboard/appointments`)
- [ ] Integración Stripe (Checkout Session)
- [ ] Confirmación por email básica (Resend)

### **Fase 2: Automatizaciones Core (Semana 3)**
- [ ] Recordatorios automáticos (24h, 2h)
- [ ] Confirmación requerida
- [ ] Bloqueo de horarios pasados
- [ ] Validación de disponibilidad

### **Fase 3: Gestión Avanzada (Semana 4)**
- [ ] Configuración de horarios
- [ ] Días bloqueados
- [ ] Lista de espera
- [ ] Sincronización con Google Calendar

### **Fase 4: Optimizaciones (Semana 5)**
- [ ] UX mejorada
- [ ] Tests
- [ ] Performance optimization
- [ ] Analytics básicos

---

## ✅ ESPECIFICACIONES CONFIRMADAS

### **Contexto del Negocio**
- **Tipo de servicio**: Consultoría/Auditoría para principiantes (gente que no sabe qué es un H1)
- **Público objetivo**: No técnicos, principiantes en marketing digital/web

### **Requisitos Técnicos**
- ✅ **Pagos online**: Stripe integrado
- ✅ **Tipo de citas**: Presenciales y virtuales
- ✅ **Email**: Resend (ya tienes API key)
- ✅ **SMS**: Twilio (ya tienes API)
- ✅ **Escalabilidad**: Múltiples profesionales (empezando solo tú)
- ✅ **Duración**: 30 min inicial, configurable/escalable

### **Stack Tecnológico**
Ver archivo completo: `STACK-TECNOLOGICO-APROBADO.md`

**Resumen:**
- Next.js 15.5.6 (App Router) ✅
- Supabase (PostgreSQL + Auth + Edge Functions) ✅
- Resend (Email) ✅
- Twilio (SMS) ✅
- Stripe (Pagos) 🆕
- FullCalendar (Dashboard) 🆕
- react-day-picker (Web Pública) 🆕
- date-fns + date-fns-tz 🆕
- react-hook-form + zod 🆕

---

## 🆕 TABLA DE PAGOS (Agregar a BD)

```sql
-- Pagos asociados a citas
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) NOT NULL,

  -- Stripe
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_checkout_session_id VARCHAR(255) UNIQUE,

  -- Monto
  amount INTEGER NOT NULL, -- En centavos
  currency VARCHAR(3) DEFAULT 'usd',

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, refunded
  payment_method VARCHAR(50), -- card, etc.

  -- Metadatos
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_appointment ON payments(appointment_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
```

---

## ✅ CHECKLIST DE APROBACIÓN

- [x] Arquitectura aprobada
- [x] Automatizaciones confirmadas
- [x] Estructura de BD validada (incluye pagos)
- [x] Tecnologías confirmadas
- [x] Especificaciones completas
- [ ] **Listo para empezar Fase 1** ⏳

---

**✅ TODO CONFIRMADO - ¿AVANZAMOS CON LA IMPLEMENTACIÓN?**
