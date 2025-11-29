# 🎯 Plan Elite: Replicar Calendario Cal.com - Paso a Paso

## 🏗️ Filosofía de Desarrollo

### Principios:
- ✅ **Reutilizable:** Componentes modulares que puedan usarse en otros contextos
- ✅ **Robusto:** TypeScript estricto, validación, manejo de errores
- ✅ **Elite:** Código limpio, bien documentado, arquitectura sólida
- ✅ **Mantenible:** Separación de concerns, fácil de extender
- ✅ **Sin parches:** Diseño desde cero con arquitectura correcta

---

## 📋 PASOS DETALLADOS

### **FASE 1: Arquitectura y Estructura Base** 🔧

#### **Paso 1.1: Crear Estructura de Carpetas**
```
apps/web-publica/
├── lib/
│   └── calendar/
│       ├── types.ts              # Tipos TypeScript compartidos
│       ├── constants.ts          # Constantes (meses, días, formatos)
│       ├── utils.ts              # Utilidades (fechas, cálculos)
│       └── hooks.ts              # Hooks reutilizables (useCalendar)
├── components/
│   └── calendar/
│       ├── Calendar.tsx          # Componente principal reutilizable
│       ├── CalendarDay.tsx       # Componente individual de día
│       ├── CalendarHeader.tsx    # Header con navegación mes/año
│       ├── CalendarGrid.tsx      # Grid de días del mes
│       └── CalendarWeekdays.tsx  # Headers de días de semana
└── app/[locale]/book/
    └── components/
        ├── BookingContainer.tsx  # Orquestador (ya existe)
        ├── BookingCalendar.tsx   # Wrapper específico para booking
        ├── BookingInfo.tsx       # Columna 1: Info del servicio
        └── BookingTimeSlots.tsx  # Columna 3: Horarios disponibles
```

**Objetivo:** Estructura clara con separación de concerns.

---

#### **Paso 1.2: Definir Tipos TypeScript Robustos**
Crear `lib/calendar/types.ts` con:
- `CalendarProps` - Props del componente principal
- `CalendarDayProps` - Props de día individual
- `CalendarConfig` - Configuración (locale, formato, inicio semana)
- `DateRange` - Rangos de fechas permitidos
- `DayState` - Estados posibles de un día (selected, disabled, available, etc.)

**Objetivo:** Tipado fuerte para evitar errores en runtime.

---

#### **Paso 1.3: Crear Constantes Internacionalizadas**
Crear `lib/calendar/constants.ts` con:
- Nombres de meses (ES/EN)
- Días de semana (ES/EN)
- Formatos de fecha
- Configuraciones por locale

**Objetivo:** Centralizar constantes para fácil mantenimiento.

---

### **FASE 2: Utilidades y Lógica de Negocio** 🧮

#### **Paso 2.1: Crear Utilidades de Fechas**
Crear `lib/calendar/utils.ts` con funciones puras:
- `getDaysInMonth(month, year)` - Días en un mes
- `getFirstDayOfMonth(month, year)` - Primer día de la semana
- `isSameDay(date1, date2)` - Comparar fechas
- `isDateInRange(date, range)` - Validar rango
- `formatCalendarDate(date, locale)` - Formatear para UI
- `generateCalendarWeeks(month, year, startOfWeek)` - Generar grid

**Objetivo:** Lógica de negocio separada y testeable.

---

#### **Paso 2.2: Crear Hook Personalizado**
Crear `lib/calendar/hooks.ts` con:
- `useCalendar(config)` - Hook principal que maneja:
  - Estado del mes/año actual
  - Fecha seleccionada
  - Navegación prev/next
  - Validaciones
  - Callbacks

**Objetivo:** Lógica de estado encapsulada y reutilizable.

---

### **FASE 3: Componentes Base Reutilizables** 🧩

#### **Paso 3.1: CalendarDay Component**
Crear componente atómico:
- Props tipadas
- Estados: normal, selected, disabled, unavailable
- Estilos configurables (cuadrado vs círculo)
- Accesibilidad (aria-labels, keyboard navigation)
- Event handlers

**Objetivo:** Componente reutilizable para cualquier contexto.

---

#### **Paso 3.2: CalendarWeekdays Component**
Crear headers de días:
- Configurable: inicio de semana (domingo/lunes)
- Formato: corto/largo
- Internacionalización

**Objetivo:** Headers flexibles y configurable.

---

#### **Paso 3.3: CalendarHeader Component**
Crear navegación mes/año:
- Selectores Preline UI (ya tenemos)
- Botones prev/next
- Formato configurable
- Internacionalización

**Objetivo:** Navegación robusta y consistente.

---

#### **Paso 3.4: CalendarGrid Component**
Crear grid de días:
- Genera semanas dinámicamente
- Renderiza días del mes anterior/siguiente
- Maneja estados de días
- Layout responsivo

**Objetivo:** Grid flexible y escalable.

---

#### **Paso 3.5: Calendar Component Principal**
Orquestar todos los subcomponentes:
- Usa el hook `useCalendar`
- Configuración centralizada
- Props claras y documentadas
- Error boundaries
- Loading states (si necesario)

**Objetivo:** Componente principal completo y robusto.

---

### **FASE 4: Estilos Cal.com** 🎨

#### **Paso 4.1: Sistema de Temas/Variantes**
Crear sistema de variantes:
- `variant: 'cal-com' | 'preline' | 'custom'`
- Estilos específicos por variante
- Configuración de colores
- Formas (cuadrado vs círculo)

**Objetivo:** Fácil cambio de estilo sin tocar lógica.

---

#### **Paso 4.2: Implementar Estilos Cal.com**
Aplicar estilos específicos:
- Cuadrados en lugar de círculos
- Color negro/gris para selección
- Formato largo de días (DOM, LUN, etc.)
- Semana empieza en domingo
- Espaciado y tamaños correctos

**Objetivo:** Match exacto con Cal.com visualmente.

---

### **FASE 5: Integración con Booking** 📅

#### **Paso 5.1: BookingCalendar Wrapper**
Crear wrapper específico:
- Usa Calendar principal
- Configuración específica para booking
- Conecta con estado de BookingContainer
- Maneja validaciones de booking (días disponibles, etc.)

**Objetivo:** Capa de integración sin contaminar componente base.

---

#### **Paso 5.2: BookingInfo Component (Columna 1)**
Crear componente de información:
- Duración de la cita
- Link de Google Meet/Zoom
- Timezone
- Descripción del servicio
- Props configurables

**Objetivo:** Componente reutilizable para otros contextos.

---

#### **Paso 5.3: BookingTimeSlots Component (Columna 3)**
Crear lista de horarios:
- Recibe fecha seleccionada
- Muestra horarios disponibles
- Indicadores visuales (puntos verdes)
- Scroll para muchos horarios
- Selección de horario
- Estados: available, booked, unavailable

**Objetivo:** Componente robusto con estados claros.

---

### **FASE 6: Internacionalización** 🌐

#### **Paso 6.1: Integrar con next-intl**
- Mensajes de calendario
- Formatos de fecha por locale
- Nombres de meses/días traducidos
- Validaciones con mensajes traducidos

**Objetivo:** Soporte completo multi-idioma.

---

### **FASE 7: Testing y Validación** ✅

#### **Paso 7.1: Validaciones Robustas**
- Validación de props
- Validación de fechas
- Validación de rangos
- Manejo de errores edge cases

**Objetivo:** Sistema robusto sin fallos.

---

#### **Paso 7.2: Accesibilidad**
- ARIA labels completos
- Navegación por teclado
- Focus management
- Screen reader support

**Objetivo:** Accesible para todos los usuarios.

---

## 📊 Orden de Implementación Recomendado

### **Opción A: Desarrollo Incremental (Recomendado)**
1. ✅ Fase 1: Arquitectura (tipos, constantes, estructura)
2. ✅ Fase 2: Utilidades (lógica pura, testeable)
3. ✅ Fase 3: Componentes base (empezar por CalendarDay)
4. ✅ Fase 4: Estilos Cal.com (aplicar visual)
5. ✅ Fase 5: Integración Booking
6. ✅ Fase 6: Internacionalización
7. ✅ Fase 7: Validación final

### **Opción B: Por Componentes Completos**
1. ✅ CalendarDay completo (tipos + lógica + estilos)
2. ✅ CalendarHeader completo
3. ✅ CalendarGrid completo
4. ✅ Calendar principal completo
5. ✅ Integración Booking

---

## 🎯 Entregables por Paso

Cada paso debe incluir:
- ✅ Código TypeScript tipado
- ✅ Documentación JSDoc
- ✅ Manejo de errores
- ✅ Validaciones
- ✅ Tests básicos (si aplicable)

---

## 🔍 Checklist de Calidad por Componente

Para cada componente nuevo:
- [ ] TypeScript estricto (sin `any`)
- [ ] Props documentadas con JSDoc
- [ ] Manejo de errores
- [ ] Casos edge considerados
- [ ] Accesibilidad básica
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Internacionalización

---

## 💡 Principios de Diseño

### **Separación de Concerns:**
- **Presentación** → Componentes UI
- **Lógica** → Hooks y utilidades
- **Datos** → Tipos y constantes
- **Configuración** → Props y contextos

### **Reutilización:**
- Componentes atómicos y composables
- Props configurables pero con defaults sensatos
- Sin dependencias de contexto específico

### **Robustez:**
- Validación de inputs
- Manejo de estados edge
- Error boundaries
- TypeScript estricto

---

## 🚀 ¿Por dónde empezamos?

**Recomendación:** Empezar por **FASE 1** (Arquitectura) porque:
1. Define la base sólida
2. Permite trabajar en paralelo después
3. Evita refactoring futuro
4. Establece estándares claros

¿Empezamos con el Paso 1.1 (Estructura de carpetas y tipos base)?
