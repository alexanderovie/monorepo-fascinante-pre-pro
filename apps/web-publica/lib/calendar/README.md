# 📅 Calendar Library - Sistema de Calendario Reutilizable

Sistema de calendario robusto, reutilizable y type-safe para Next.js con TypeScript.

## 🏗️ Arquitectura

### Estructura de Carpetas
```
lib/calendar/
├── types.ts       # Definiciones TypeScript
├── constants.ts   # Constantes internacionalizadas
├── utils.ts       # Funciones puras de utilidad
├── hooks.ts       # Hooks React reutilizables
├── index.ts       # Exportaciones públicas
└── README.md      # Esta documentación
```

## 📦 Exportaciones

### Tipos
```typescript
import type {
  CalendarProps,
  CalendarConfig,
  CalendarVariant,
  CalendarLocale,
  // ... más tipos
} from '@/lib/calendar';
```

### Utilidades
```typescript
import {
  generateCalendarWeeks,
  isDateInRange,
  formatCalendarDate,
  // ... más utilidades
} from '@/lib/calendar';
```

### Hooks
```typescript
import { useCalendar, useUncontrolledCalendar } from '@/lib/calendar';
```

### Constantes
```typescript
import {
  getMonths,
  getWeekdays,
  DEFAULT_CALENDAR_CONFIG,
} from '@/lib/calendar';
```

## 🚀 Uso Básico

### Hook useCalendar
```typescript
import { useCalendar } from '@/lib/calendar';
import type { CalendarConfig } from '@/lib/calendar';

const config: CalendarConfig = {
  locale: 'es',
  variant: 'cal-com',
  weekStart: 'sunday',
  weekdayFormat: 'long',
};

const calendar = useCalendar(config, selectedDate, onDateSelect);

// Usar en componente
<div>
  <CalendarHeader
    currentMonth={calendar.currentMonth}
    currentYear={calendar.currentYear}
    onPrevMonth={calendar.goToPrevMonth}
    onNextMonth={calendar.goToNextMonth}
  />
  <CalendarGrid
    weeks={calendar.weeks}
    selectedDate={calendar.selectedDate}
    onDaySelect={calendar.selectDate}
  />
</div>
```

## ✨ Características

- ✅ **Type-safe:** TypeScript estricto, sin `any`
- ✅ **Reutilizable:** Componentes y hooks modulares
- ✅ **Internacionalizado:** Soporte ES/EN nativo
- ✅ **Configurable:** Múltiples variantes y opciones
- ✅ **Robusto:** Validaciones y manejo de errores
- ✅ **Documentado:** JSDoc completo

## 📚 Próximos Pasos

Ver `components/calendar/` para los componentes UI reutilizables que usan esta librería.
