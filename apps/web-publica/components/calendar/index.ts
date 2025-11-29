/**
 * Calendar Components - Public Exports
 *
 * Exporta todos los componentes del sistema de calendario.
 * Punto de entrada principal para importar componentes UI.
 */

export { Calendar } from './Calendar';
export { CalendarDay } from './CalendarDay';
export { CalendarHeader } from './CalendarHeader';
export { CalendarWeekdays } from './CalendarWeekdays';
export { CalendarGrid } from './CalendarGrid';

// Re-export types for convenience
export type {
  CalendarProps,
  CalendarDayProps,
  CalendarHeaderProps,
  CalendarWeekdaysProps,
  CalendarGridProps,
} from '@/lib/calendar';
