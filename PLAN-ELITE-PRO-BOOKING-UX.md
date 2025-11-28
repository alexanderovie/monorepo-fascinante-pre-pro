# Plan ÉLITE PRO - Comportamientos UX de Sistemas de Reserva Profesionales

## 🎯 Objetivo
Implementar comportamientos estándar de la industria que hacen que los sistemas de reserva sean intuitivos, eficientes y profesionales (Cal.com, Calendly, Acuity Scheduling).

---

## 📱 1. AUTO-FOCUS Y AUTO-SCROLL (Móvil/Desktop)

### Problema Actual
Cuando un usuario selecciona una fecha en móvil, el focus permanece en el calendario, requiriendo scroll manual para ver los horarios.

### Comportamiento ÉLITE PRO

#### A) Auto-scroll a Sección de Horarios (Móvil)
**Cuándo:** Después de seleccionar una fecha en dispositivos móviles
**Comportamiento:**
- Scroll suave automático a la sección de horarios
- El primer horario disponible recibe focus automático (para navegación por teclado)
- Animación suave con `scrollIntoView({ behavior: 'smooth', block: 'center' })`

#### B) Auto-focus en Primer Horario (Desktop + Móvil)
**Cuándo:** Después de seleccionar fecha
**Comportamiento:**
- El primer botón de horario disponible recibe focus
- Permite navegación inmediata con teclado (Arrow keys + Enter)
- Mejora accesibilidad y velocidad de reserva

**Implementación:**
```tsx
const timeSlotRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (selectedDate && !selectedTime && timeSlotRef.current) {
    // Smooth scroll en móvil
    if (window.innerWidth < 768) {
      timeSlotRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
    // Focus en primer horario disponible
    setTimeout(() => {
      timeSlotRef.current?.focus();
    }, 300); // Delay para que scroll termine primero
  }
}, [selectedDate, selectedTime]);
```

---

## ⌨️ 2. NAVEGACIÓN POR TECLADO ÉLITE

### Comportamientos Estándar de la Industria

#### A) Navegación en Horarios con Teclado
- **Arrow Keys (← →)**: Navegar entre horarios disponibles
- **Arrow Keys (↑ ↓)**: Navegar entre filas (si grid tiene múltiples filas)
- **Enter/Space**: Seleccionar horario
- **Tab**: Salir de la sección de horarios
- **Escape**: Deseleccionar fecha/horario

#### B) Focus Management
- Focus visible y claro en todos los estados
- Focus trap dentro de secciones activas
- Focus restoration al cambiar de sección

**Implementación:**
```tsx
const handleTimeSlotKeyDown = (e: React.KeyboardEvent, time: string, index: number) => {
  const slots = timeSlots;
  const currentIndex = slots.indexOf(time);

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      const nextSlot = slots[currentIndex + 1];
      if (nextSlot) {
        document.getElementById(`time-slot-${nextSlot}`)?.focus();
      }
      break;
    case 'ArrowLeft':
      e.preventDefault();
      const prevSlot = slots[currentIndex - 1];
      if (prevSlot) {
        document.getElementById(`time-slot-${prevSlot}`)?.focus();
      }
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      setSelectedTime(time);
      break;
  }
};
```

---

## 🎨 3. FEEDBACK VISUAL INSTANTÁNEO

### A) Indicador de Progreso
**Comportamiento:**
- Barra de progreso visual mostrando: Fecha → Horario → Información → Pago
- Estados claros: ✅ Completado, 🔄 Actual, ⏭️ Pendiente

### B) Animaciones Microinteractivas
**Implementar:**
- ✅ Pulse animation cuando se selecciona fecha
- ✅ Ripple effect en botones de horario
- ✅ Slide-in animation para el resumen de reserva
- ✅ Loading states mientras se validan disponibilidades

### C) Confirmación Visual Inmediata
- Checkmark animado al seleccionar fecha
- Highlight visual del horario seleccionado
- Transición suave entre estados

---

## 🔄 4. GESTIÓN DE ESTADO INTELIGENTE

### A) Persistencia Local (LocalStorage)
**Comportamiento:**
- Guardar selección parcial en localStorage
- Si usuario cierra/reabre, restaurar: fecha + horario seleccionado
- Expirar después de 1 hora

**Implementación:**
```tsx
useEffect(() => {
  if (selectedDate && selectedTime) {
    localStorage.setItem('booking-draft', JSON.stringify({
      date: selectedDate.toISOString(),
      time: selectedTime,
      timestamp: Date.now()
    }));
  }
}, [selectedDate, selectedTime]);

useEffect(() => {
  const draft = localStorage.getItem('booking-draft');
  if (draft) {
    const { date, time, timestamp } = JSON.parse(draft);
    // Restaurar si tiene menos de 1 hora
    if (Date.now() - timestamp < 3600000) {
      setSelectedDate(new Date(date));
      setSelectedTime(time);
    }
  }
}, []);
```

### B) Validación Predictiva
- Validar disponibilidad ANTES de mostrar horarios
- Mostrar skeleton/loading mientras valida
- Indicar días sin disponibilidad en el calendario

---

## 📊 5. INDICADORES DE DISPONIBILIDAD VISUALES

### A) Calendario con Indicadores
**Comportamientos ÉLITE:**
- ✅ Dots/circles pequeños en días con disponibilidad
- 🔴 Días completamente ocupados con estilo diferente
- 🟡 Días con disponibilidad limitada
- Días sin disponibilidad: Opacidad reducida

**Implementación:**
```tsx
// Modificar clase day según disponibilidad
day: (date) => {
  const hasAvailability = checkDayAvailability(date);
  const isLimited = checkLimitedAvailability(date);

  return cn(
    'day-base-classes',
    !hasAvailability && 'opacity-40 cursor-not-allowed',
    isLimited && 'border-2 border-yellow-400'
  );
}
```

### B) Horarios con Estados Claros
- ✅ Disponible: Botón normal
- ⏳ Pocos lugares: Badge "Quedan 2 lugares"
- 🔴 Ocupado: Botón deshabilitado con tooltip "No disponible"
- ⏰ Próximamente: Para horarios futuros lejanos

---

## 🎯 6. UX FLUJO OPTIMIZADO

### A) Progreso Multi-Step Visual
```
[Step 1: Fecha] → [Step 2: Horario] → [Step 3: Información] → [Step 4: Confirmación]
   ✅              🔄                  ⏭️                      ⏭️
```

### B) Validación en Tiempo Real
- Validar solapamiento de horarios al seleccionar
- Mostrar mensaje si horario ya no disponible
- Auto-refresh de disponibilidad cada 30 segundos

### C) Sugerencias Inteligentes
- Si día seleccionado está completo, sugerir día siguiente
- Si horario seleccionado está ocupado, sugerir horario similar más cercano
- "Personas que reservaron esto también vieron..."

---

## 📱 7. OPTIMIZACIONES MÓVILES ESPECÍFICAS

### A) Vista Adaptativa
**Desktop:** 2 columnas (Fecha | Horarios)
**Móvil:** Stack vertical con scroll optimizado

### B) Touch Optimizations
- Áreas táctiles mínimas 44x44px ✅ (ya implementado)
- Swipe gestures para cambiar mes
- Pull-to-refresh para actualizar disponibilidad

### C) Mobile-First Interactions
- Sticky header con resumen de selección
- Bottom sheet para selección de horarios (opcional)
- Haptic feedback en selecciones (si está disponible)

---

## 🔔 8. NOTIFICACIONES Y CONFIRMACIÓN

### A) Toast Notifications
**Casos de uso:**
- ✅ "Fecha seleccionada: [fecha]"
- ✅ "Horario seleccionado: [horario]"
- ⚠️ "Este horario está casi lleno, reserva pronto"
- ❌ "Este horario ya no está disponible, por favor selecciona otro"

### B) Confirmación Before Leave
- Si usuario intenta salir con selección parcial, mostrar:
  "¿Seguro que quieres salir? Tu selección se perderá"

---

## ♿ 9. ACCESIBILIDAD ÉLITE

### A) ARIA Labels Completos
```tsx
<DayPicker
  aria-label="Selecciona una fecha para tu cita"
  aria-describedby="date-picker-help"
  role="application"
/>

<div id="date-picker-help" className="sr-only">
  Usa las teclas de flecha para navegar fechas, Enter para seleccionar
</div>
```

### B) Screen Reader Announcements
- "Fecha [X] seleccionada"
- "[N] horarios disponibles para esta fecha"
- "Horario [X] seleccionado"

### C) Keyboard Navigation Completa
- Tab order lógico y predecible
- Skip links para usuarios de teclado
- Focus indicators visibles y claros

---

## 🚀 10. PERFORMANCE Y OPTIMIZACIONES

### A) Lazy Loading de Horarios
- Solo cargar horarios cuando se selecciona fecha
- Skeleton loading mientras carga
- Cache de disponibilidades (5 minutos)

### B) Debounce en Búsquedas
- Si hay filtros/búsqueda, debounce de 300ms

### C) Memoization
- Memoizar componentes pesados
- useMemo para cálculos de disponibilidad
- React.memo para listas de horarios

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Prioridad ALTA (MVP Élite)
- [ ] Auto-scroll a horarios después de seleccionar fecha (móvil)
- [ ] Auto-focus en primer horario disponible
- [ ] Navegación por teclado en horarios (Arrow keys)
- [ ] Indicadores visuales de disponibilidad en calendario
- [ ] Toast notifications para feedback inmediato
- [ ] Persistencia en localStorage

### Prioridad MEDIA (Mejoras Élite)
- [ ] Barra de progreso multi-step
- [ ] Validación predictiva de disponibilidad
- [ ] Estados visuales avanzados (disponible/pocos lugares/ocupado)
- [ ] Animaciones microinteractivas
- [ ] Confirmación before leave

### Prioridad BAJA (Nice to Have)
- [ ] Swipe gestures en móvil
- [ ] Sugerencias inteligentes
- [ ] Auto-refresh de disponibilidad
- [ ] Haptic feedback

---

## 🎨 Referencias de Sistemas ÉLITE

### Cal.com
- ✅ Auto-scroll suave a horarios
- ✅ Focus management perfecto
- ✅ Indicadores visuales claros
- ✅ Navegación por teclado excelente

### Calendly
- ✅ Progress indicator
- ✅ Sugerencias inteligentes
- ✅ Validación en tiempo real

### Acuity Scheduling
- ✅ Indicadores de disponibilidad en calendario
- ✅ Feedback inmediato
- ✅ Mobile-optimized

---

## 💡 Implementación Recomendada

**Fase 1 (Ahora):**
1. Auto-scroll + auto-focus
2. Navegación por teclado básica
3. Toast notifications

**Fase 2 (Próximo):**
4. Indicadores de disponibilidad
5. Persistencia localStorage
6. Barra de progreso

**Fase 3 (Futuro):**
7. Validación predictiva
8. Animaciones avanzadas
9. Sugerencias inteligentes

---

## 📝 Notas Técnicas

- Usar `useRef` para referencias a elementos del DOM
- `useEffect` para efectos de scroll/focus
- `useCallback` para handlers de teclado
- Considerar `IntersectionObserver` para lazy loading
- Implementar `useLocalStorage` hook personalizado

¿Avanzamos con la implementación de la Fase 1?
