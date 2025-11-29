# PLAN: Recrear Página `/book` - Sistema de Reserva de Citas

## 🎯 Objetivo
Recrear completamente la página `/book` (`http://localhost:3002/en/book` y `/es/book`) con una arquitectura mejorada, mejor UX, y consistencia total con el resto de la web pública.

---

## 📋 Análisis del Estado Actual

### ✅ Lo que ya funciona:
1. **Layout de 3 paneles** (tipo Cal.com):
   - Panel izquierdo: Información del servicio
   - Panel centro: Calendario con `react-day-picker`
   - Panel derecho: Lista de horarios disponibles

2. **Funcionalidad FASE 2 implementada**:
   - Indicadores visuales de disponibilidad (colores)
   - Contadores de horarios disponibles
   - Horarios dinámicos desde la base de datos
   - Hook `useAvailability` para carga de datos

3. **UX Élite Pro**:
   - Auto-scroll en móvil
   - Auto-focus en horarios
   - Navegación por teclado

### ⚠️ Lo que necesita mejorarse:
1. **Falta Header/Footer** - La página está aislada
2. **Falta formulario completo** - Solo selección de fecha/hora
3. **Falta paso de información personal** - Nombre, email, teléfono
4. **Falta confirmación/pago** - No hay flujo completo
5. **Falta manejo de errores visual** - Sin toasts/notificaciones
6. **Falta metadata SEO** - Sin optimización para reservas

---

## 🏗️ Arquitectura Propuesta

### Estructura de Componentes:

```
apps/web-publica/app/[locale]/book/
├── page.tsx                    # Server Component (metadata, validación)
└── components/
    ├── BookingLayout.tsx       # Layout wrapper (Header/Footer incluidos)
    ├── BookingSteps.tsx        # Navegación de pasos (1/3, 2/3, 3/3)
    ├── Step1DateTime.tsx       # Selección de fecha/hora (actual BookingForm simplificado)
    ├── Step2PersonalInfo.tsx   # Formulario de información personal
    ├── Step3Confirmation.tsx   # Resumen y confirmación
    └── BookingSuccess.tsx      # Página de éxito post-reserva
```

### Flujo de Usuario:

```
1. Llega a /book
   ↓
2. Ve Header + Footer (consistente con sitio)
   ↓
3. Paso 1: Selecciona Fecha y Hora
   ↓
4. Paso 2: Completa información personal
   - Nombre completo
   - Email
   - Teléfono (opcional)
   - Notas (opcional)
   ↓
5. Paso 3: Confirma y Paga (si aplica)
   - Resumen de la cita
   - Información personal
   - Método de pago (Stripe - futuro)
   ↓
6. BookingSuccess: Confirmación
   - Mensaje de éxito
   - Detalles de la cita
   - Link a Google Calendar
   - Botón para nueva reserva
```

---

## 🎨 Diseño y Estilo

### Header y Footer:
- **Header**: Reutilizar componente existente `apps/web-publica/app/[locale]/components/Header.tsx`
- **Footer**: Reutilizar componente existente `apps/web-publica/app/[locale]/components/Footer.tsx`
- Mantener consistencia visual con resto del sitio

### Estilos:
- **Preline UI** para componentes base
- **Tailwind CSS** para personalización
- **Dark mode** completo
- **Responsive**: Mobile-first
- **Animaciones suaves** para transiciones entre pasos

---

## 📝 Implementación Detallada

### 1. **page.tsx** (Server Component)
```typescript
// Funciones:
- Validar locale
- Generar metadata SEO optimizada
- Cargar mensajes i18n
- Renderizar BookingLayout
```

**Metadata SEO a incluir:**
- Title: "Book Appointment - Fascinante Digital"
- Description: "Schedule your free consultation..."
- Open Graph tags
- Schema.org JSON-LD para `EventReservation`
- Canonical URLs

### 2. **BookingLayout.tsx**
```typescript
// Componente wrapper que incluye:
- <Header /> (reutilizado)
- <main> con contenido de booking
- <Footer /> (reutilizado)
```

### 3. **BookingSteps.tsx**
```typescript
// Navegación de pasos (stepper):
- Indicador visual: "Step 1 of 3"
- Navegación entre pasos
- Validación antes de avanzar
- Botones "Previous" / "Next"
```

### 4. **Step1DateTime.tsx**
```typescript
// Refactorizar BookingForm actual:
- Mantener funcionalidad actual (calendario + horarios)
- Simplificar para solo este paso
- Integrar con useAvailability existente
- Validación: fecha y hora requeridas
```

### 5. **Step2PersonalInfo.tsx** (NUEVO)
```typescript
// Formulario con react-hook-form + Zod:
- Campos:
  * Nombre completo (required)
  * Email (required, validación)
  * Teléfono (optional)
  * Notas/comentarios (optional, textarea)
- Validación en tiempo real
- Manejo de errores visual
```

### 6. **Step3Confirmation.tsx** (NUEVO)
```typescript
// Resumen de la reserva:
- Fecha y hora seleccionadas
- Información personal
- Método de reunión (Google Meet / Office)
- Botón "Confirm & Book"
- Checkbox de términos y condiciones
```

### 7. **BookingSuccess.tsx** (NUEVO)
```typescript
// Página de éxito:
- Mensaje de confirmación
- Detalles de la cita
- Link para agregar a Google Calendar
- Botón para nueva reserva
- Información sobre próximos pasos
```

---

## 🔧 Tecnologías y Dependencias

### Ya instaladas:
- ✅ `react-hook-form` - Para formularios
- ✅ `zod` - Para validación
- ✅ `@hookform/resolvers` - Integración form + zod
- ✅ `date-fns` - Manejo de fechas
- ✅ `react-day-picker` - Calendario
- ✅ `@supabase/supabase-js` - Backend

### A agregar (si es necesario):
- ⚠️ `react-hot-toast` o similar - Para notificaciones (opcional)
- ⚠️ `@stripe/stripe-js` - Ya instalado, solo falta implementar

---

## 🔄 Estado Global (Context API)

Crear `BookingContext.tsx` para manejar estado entre pasos:

```typescript
interface BookingState {
  step: 1 | 2 | 3;
  selectedDate: Date | null;
  selectedTime: string | null;
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  };
  appointmentId: string | null; // Después de crear
}
```

---

## 🎯 Características Élite Pro a Mantener

1. ✅ **Indicadores visuales de disponibilidad** (verde/amarillo/gris)
2. ✅ **Contadores de horarios disponibles**
3. ✅ **Auto-scroll en móvil** después de seleccionar fecha
4. ✅ **Auto-focus** en primer horario
5. ✅ **Navegación por teclado** (Arrow keys, Home, End)
6. ✅ **Loading states** mientras carga disponibilidad
7. ✅ **Error handling** robusto

### Nuevas características a agregar:
- 🆕 **Validación en tiempo real** en Step 2
- 🆕 **Animaciones suaves** entre pasos
- 🆕 **Toast notifications** para feedback
- 🆕 **Progress indicator** visual (stepper)
- 🆕 **Auto-guardado** en localStorage (por si pierde conexión)

---

## 📱 Responsive Design

### Mobile (< 768px):
- Stack vertical de los 3 paneles
- Calendario más compacto
- Botones full-width
- Stepper horizontal simplificado

### Tablet (768px - 1024px):
- Layout adaptativo
- Calendario en columna central

### Desktop (> 1024px):
- Layout de 3 columnas (como Cal.com)
- Stepper horizontal completo
- Sidebar con información del servicio

---

## 🌐 Internacionalización (i18n)

### Mensajes a agregar en `messages/es.json` y `messages/en.json`:

```json
{
  "booking": {
    "title": "Reservar Cita",
    "subtitle": "Agenda tu consultoría gratuita",
    "steps": {
      "step1": "Selecciona Fecha y Hora",
      "step2": "Tu Información",
      "step3": "Confirmación"
    },
    "form": {
      "name": "Nombre completo",
      "email": "Email",
      "phone": "Teléfono (opcional)",
      "notes": "Notas adicionales (opcional)"
    },
    "success": {
      "title": "¡Cita Reservada!",
      "message": "Tu cita ha sido confirmada",
      "addToCalendar": "Agregar a Google Calendar"
    }
  }
}
```

---

## 🔐 Validación y Seguridad

### Validaciones:
1. **Fecha/Hora**: No puede ser en el pasado
2. **Email**: Formato válido + verificación de dominio
3. **Teléfono**: Formato opcional pero si se ingresa debe ser válido
4. **Rate limiting**: Ya implementado en API (`/api/availability`)

### Seguridad:
- ✅ **RLS policies** ya implementadas en Supabase
- ✅ **Rate limiting** en middleware
- ✅ **Sanitización** de inputs
- ⚠️ **CSRF protection** (Next.js built-in)

---

## 📊 Schema.org para SEO

Agregar JSON-LD para `EventReservation`:

```json
{
  "@context": "https://schema.org",
  "@type": "EventReservation",
  "reservationFor": {
    "@type": "Event",
    "name": "Consultation Meeting",
    "startDate": "...",
    "endDate": "..."
  },
  "underName": {
    "@type": "Person",
    "name": "..."
  },
  "reservationStatus": "https://schema.org/ReservationConfirmed"
}
```

---

## 🧪 Testing (Futuro)

### Casos a probar:
1. Selección de fecha válida/inválida
2. Selección de horario disponible/ocupado
3. Validación de formulario personal
4. Creación exitosa de cita
5. Manejo de errores de red
6. Responsive en diferentes dispositivos

---

## 📦 Archivos a Crear/Modificar

### Nuevos:
1. `apps/web-publica/app/[locale]/book/components/BookingLayout.tsx`
2. `apps/web-publica/app/[locale]/book/components/BookingSteps.tsx`
3. `apps/web-publica/app/[locale]/book/components/Step1DateTime.tsx`
4. `apps/web-publica/app/[locale]/book/components/Step2PersonalInfo.tsx`
5. `apps/web-publica/app/[locale]/book/components/Step3Confirmation.tsx`
6. `apps/web-publica/app/[locale]/book/components/BookingSuccess.tsx`
7. `apps/web-publica/app/[locale]/book/context/BookingContext.tsx`
8. `apps/web-publica/app/[locale]/book/lib/validation.ts` (schemas Zod)

### Modificar:
1. `apps/web-publica/app/[locale]/book/page.tsx` - Agregar metadata, usar BookingLayout
2. `apps/web-publica/components/booking/BookingForm.tsx` - Refactorizar a Step1DateTime
3. `apps/web-publica/app/[locale]/book/success/page.tsx` - Nueva página de éxito

---

## ⚡ Orden de Implementación

### Fase 1: Estructura Base (1-2 horas)
1. Crear `BookingLayout.tsx` con Header/Footer
2. Modificar `page.tsx` para usar nuevo layout
3. Crear `BookingContext.tsx` para estado global
4. Crear `BookingSteps.tsx` (navegación básica)

### Fase 2: Refactorizar Paso 1 (1 hora)
1. Refactorizar `BookingForm.tsx` → `Step1DateTime.tsx`
2. Integrar con `BookingContext`
3. Agregar validación de paso

### Fase 3: Agregar Paso 2 (2-3 horas)
1. Crear `Step2PersonalInfo.tsx`
2. Implementar formulario con react-hook-form + Zod
3. Validación en tiempo real
4. Integrar con contexto

### Fase 4: Agregar Paso 3 (2 horas)
1. Crear `Step3Confirmation.tsx`
2. Mostrar resumen completo
3. Implementar creación de cita en Supabase
4. Manejo de errores

### Fase 5: Página de Éxito (1 hora)
1. Crear `BookingSuccess.tsx`
2. Integrar con Google Calendar
3. Mensajes i18n

### Fase 6: Mejoras y Pulido (2-3 horas)
1. Animaciones entre pasos
2. Toast notifications
3. Auto-guardado en localStorage
4. Metadata SEO
5. Schema.org JSON-LD
6. Testing manual

---

## 🎯 Resultado Esperado

Una página `/book` completamente funcional con:
- ✅ Header y Footer consistentes con el sitio
- ✅ Flujo de 3 pasos claro e intuitivo
- ✅ Validación robusta en todos los pasos
- ✅ UX élite pro mantenida (auto-scroll, auto-focus, etc.)
- ✅ Responsive en todos los dispositivos
- ✅ SEO optimizado
- ✅ i18n completo (EN/ES)
- ✅ Manejo de errores profesional
- ✅ Confirmación post-reserva

---

## ❓ Preguntas para Clarificar

1. **¿Incluir pago en esta versión?** (Stripe está listo pero no implementado)
2. **¿Formulario de información personal antes o después de fecha/hora?**
3. **¿Qué información adicional mostrar en el paso 3?** (Términos, política de cancelación, etc.)
4. **¿Agregar opción de recordatorios?** (Email, SMS)

---

## ✅ Checklist de Aprobación

Antes de comenzar, confirma:
- [ ] ¿Quieres Header/Footer en la página `/book`?
- [ ] ¿Formulario de información personal es obligatorio?
- [ ] ¿Qué pasos quieres exactamente? (1, 2, 3, más?)
- [ ] ¿Incluir pago en esta implementación?
- [ ] ¿Mantener el layout de 3 paneles actual o cambiarlo?

---

**¿Te parece bien este plan? ¿Quieres ajustar algo antes de comenzar?**
