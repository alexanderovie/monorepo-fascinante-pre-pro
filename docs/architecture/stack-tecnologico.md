# 🛠️ STACK TECNOLÓGICO APROBADO
## Sistema de Reserva de Citas - Consultoría/Auditoría

---

## ✅ TECNOLOGÍAS CONFIRMADAS

### **Frontend**
- ✅ **Next.js 15.5.6** (App Router) - Ya instalado
- ✅ **React 19.2.0** - Ya instalado
- ✅ **TypeScript 5.9.3** - Ya instalado
- ✅ **Tailwind CSS 4.1.17** - Ya instalado
- ✅ **Preline UI 3.2.3** - Ya instalado

### **Backend**
- ✅ **Supabase** (PostgreSQL + Auth + Edge Functions) - Ya configurado
  - Base de datos: PostgreSQL
  - Autenticación: Supabase Auth
  - Edge Functions: Para automatizaciones

### **Comunicaciones**
- ✅ **Resend** - Para emails (ya tienes API key)
- ✅ **Twilio** - Para SMS (ya tienes API)

### **Pagos**
- 🆕 **Stripe** - Necesitamos instalar
  - `stripe` (backend)
  - `@stripe/stripe-js` (frontend)

---

## 📦 NUEVAS DEPENDENCIAS A INSTALAR

### **Dashboard (`apps/app`)**

```json
{
  "dependencies": {
    // Calendario ligero y profesional
    "@fullcalendar/react": "^6.1.15",
    "@fullcalendar/daygrid": "^6.1.15",
    "@fullcalendar/timegrid": "^6.1.15",
    "@fullcalendar/interaction": "^6.1.15",

    // Manejo de fechas y zonas horarias
    "date-fns": "^3.6.0",
    "date-fns-tz": "^2.0.0",

    // Formularios y validación
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.8",
    "@hookform/resolvers": "^3.9.0",

    // Pagos (Stripe)
    "@stripe/stripe-js": "^4.9.0",
    "stripe": "^17.3.1"
  }
}
```

### **Web Pública (`apps/web-publica`)**

```json
{
  "dependencies": {
    // Calendario para selección de fecha
    "react-day-picker": "^9.4.4",

    // Manejo de fechas
    "date-fns": "^3.6.0",
    "date-fns-tz": "^2.0.0",

    // Formularios y validación
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.8",
    "@hookform/resolvers": "^3.9.0",

    // Pagos (Stripe)
    "@stripe/stripe-js": "^4.9.0"
  }
}
```

### **Supabase Edge Functions** (nuevo directorio)

```
supabase/
└── functions/
    ├── send-email/
    │   ├── index.ts
    │   └── package.json      # resend
    ├── send-sms/
    │   ├── index.ts
    │   └── package.json      # twilio
    ├── appointment-reminders/
    │   ├── index.ts
    │   └── package.json
    ├── confirmation-checker/
    │   ├── index.ts
    │   └── package.json
    ├── process-payment/
    │   ├── index.ts
    │   └── package.json      # stripe
    └── create-checkout-session/
        ├── index.ts
        └── package.json      # stripe
```

**Dependencias de Edge Functions:**
- `resend` - Para emails
- `twilio` - Para SMS
- `stripe` - Para pagos
- `@supabase/supabase-js` - Cliente de Supabase

---

## 🎯 ARQUITECTURA COMPLETA

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐          ┌──────────────┐            │
│  │   Dashboard  │          │  Web Pública │            │
│  │  (apps/app)  │          │ (web-publica)│            │
│  │   :3001      │          │   :3002      │            │
│  └──────┬───────┘          └──────┬───────┘            │
│         │                         │                     │
│         └─────────┬───────────────┘                     │
│                   │                                     │
└───────────────────┼─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              SUPABASE BACKEND                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────┐            │
│  │      PostgreSQL Database               │            │
│  │  - appointments                        │            │
│  │  - availability_settings               │            │
│  │  - blocked_dates                       │            │
│  │  - waitlist                            │            │
│  │  - payments                            │            │
│  │  - automation_logs                     │            │
│  └────────────────────────────────────────┘            │
│                                                          │
│  ┌────────────────────────────────────────┐            │
│  │      Edge Functions (Deno)             │            │
│  │  - send-email (Resend)                 │            │
│  │  - send-sms (Twilio)                   │            │
│  │  - appointment-reminders               │            │
│  │  - confirmation-checker                │            │
│  │  - process-payment (Stripe)            │            │
│  │  - create-checkout-session (Stripe)    │            │
│  └────────────────────────────────────────┘            │
│                                                          │
│  ┌────────────────────────────────────────┐            │
│  │      pg_cron (Cron Jobs)               │            │
│  │  - Recordatorios automáticos           │            │
│  │  - Verificación de confirmaciones      │            │
│  └────────────────────────────────────────┘            │
│                                                          │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              SERVICIOS EXTERNOS                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Resend  │  │  Twilio  │  │  Stripe  │             │
│  │  (Email) │  │  (SMS)   │  │ (Pagos)  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 VARIABLES DE ENTORNO NECESARIAS

### **Dashboard (`apps/app/.env.local`)**
```env
# Ya existentes
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Nuevas para pagos
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **Web Pública (`apps/web-publica/.env.local`)**
```env
# Ya existentes
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Nueva para pagos
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### **Supabase Edge Functions (secrets)**
```bash
# Configurar en Supabase Dashboard > Edge Functions > Secrets
RESEND_API_KEY=re_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📋 CHECKLIST DE INSTALACIÓN

### **Paso 1: Instalar Dependencias**
- [ ] Instalar dependencias en `apps/app`
- [ ] Instalar dependencias en `apps/web-publica`
- [ ] Configurar Supabase Edge Functions

### **Paso 2: Configurar APIs**
- [ ] Configurar cuenta de Stripe
- [ ] Obtener claves de Stripe (Publishable + Secret)
- [ ] Configurar webhook de Stripe
- [ ] Verificar API keys de Resend
- [ ] Verificar API keys de Twilio

### **Paso 3: Configurar Base de Datos**
- [ ] Crear tablas en Supabase
- [ ] Crear triggers y funciones
- [ ] Configurar cron jobs
- [ ] Configurar RLS (Row Level Security)

### **Paso 4: Configurar Edge Functions**
- [ ] Crear función `send-email`
- [ ] Crear función `send-sms`
- [ ] Crear función `appointment-reminders`
- [ ] Crear función `confirmation-checker`
- [ ] Crear función `process-payment`
- [ ] Crear función `create-checkout-session`
- [ ] Configurar secrets en Supabase

---

## 🎯 RESUMEN TÉCNICO

### **¿Qué tecnologías usamos?**

1. **Frontend:**
   - Next.js 15.5.6 (App Router)
   - React 19
   - TypeScript
   - Tailwind CSS + Preline UI
   - FullCalendar (dashboard) / react-day-picker (web pública)
   - react-hook-form + zod

2. **Backend:**
   - Supabase (PostgreSQL)
   - Supabase Auth
   - Supabase Edge Functions (Deno)

3. **Automatizaciones:**
   - Resend (emails)
   - Twilio (SMS)
   - pg_cron (cron jobs en Supabase)

4. **Pagos:**
   - Stripe (Checkout Sessions + Webhooks)

5. **Fechas:**
   - date-fns + date-fns-tz

---

## ✅ CONFIRMACIÓN

**Stack aprobado para:**
- ✅ Consultoría/Auditoría para principiantes
- ✅ Pagos online integrados (Stripe)
- ✅ Citas presenciales y virtuales
- ✅ Email (Resend) y SMS (Twilio)
- ✅ Escalable a múltiples profesionales
- ✅ Duración configurable (30 min inicial)

**¿Todo correcto? ¿Avanzamos con la implementación?**
