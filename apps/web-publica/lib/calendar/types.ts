/**
 * Calendar Types - TypeScript Definitions
 *
 * Tipos compartidos para el sistema de calendario reutilizable.
 * Diseñado para ser robusto, type-safe y fácil de extender.
 */

/**
 * Locale soportado para internacionalización
 */
export type CalendarLocale = 'es' | 'en';

/**
 * Día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
 */
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Mes del año (0 = Enero, 11 = Diciembre)
 */
export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Estado posible de un día en el calendario
 */
export type DayState =
  | 'available' // Disponible para selección
  | 'selected' // Actualmente seleccionado
  | 'disabled' // Deshabilitado (día fuera del mes o fuera de rango)
  | 'unavailable' // No disponible (ej: día bloqueado)
  | 'today'; // Día de hoy (puede combinarse con otros estados)

/**
 * Variante visual del calendario
 */
export type CalendarVariant = 'cal-com' | 'preline' | 'custom';

/**
 * Formato de los nombres de días de la semana
 */
export type WeekdayFormat = 'short' | 'long';

/**
 * Configuración de dónde empieza la semana
 */
export type WeekStart = 'sunday' | 'monday';

/**
 * Rango de fechas permitido
 */
export interface DateRange {
  /** Fecha mínima permitida (inclusive) */
  min?: Date;
  /** Fecha máxima permitida (inclusive) */
  max?: Date;
}

/**
 * Representa un día en el grid del calendario
 */
export interface CalendarDay {
  /** Número del día (1-31) */
  day: number;
  /** Mes del día (0-11) */
  month: MonthIndex;
  /** Año del día */
  year: number;
  /** Fecha completa */
  date: Date;
  /** Si el día pertenece al mes actualmente visible */
  isCurrentMonth: boolean;
  /** Si es el día de hoy */
  isToday: boolean;
  /** Estado del día */
  state: DayState;
  /** Si el día está deshabilitado */
  isDisabled: boolean;
}

/**
 * Semana del calendario (array de 7 días)
 */
export type CalendarWeek = CalendarDay[];

/**
 * Configuración base del calendario
 */
export interface CalendarConfig {
  /** Locale para internacionalización */
  locale: CalendarLocale;
  /** Variante visual del calendario */
  variant?: CalendarVariant;
  /** Formato de días de semana (corto/largo) */
  weekdayFormat?: WeekdayFormat;
  /** Día de inicio de la semana */
  weekStart?: WeekStart;
  /** Rango de fechas permitido */
  dateRange?: DateRange;
  /** Función personalizada para determinar si un día está disponible */
  isDateAvailable?: (date: Date) => boolean;
  /** Función personalizada para determinar si un día está deshabilitado */
  isDateDisabled?: (date: Date) => boolean;
}

/**
 * Props base para el componente Calendar
 */
export interface CalendarProps extends CalendarConfig {
  /** Fecha seleccionada actualmente */
  selectedDate?: Date;
  /** Callback cuando se selecciona una fecha */
  onDateSelect?: (date: Date) => void;
  /** Mes inicial a mostrar (default: mes actual) */
  initialMonth?: MonthIndex;
  /** Año inicial a mostrar (default: año actual) */
  initialYear?: number;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

/**
 * Props para el componente CalendarDay
 */
export interface CalendarDayProps {
  /** Datos del día */
  day: CalendarDay;
  /** Variante visual */
  variant?: CalendarVariant;
  /** Callback cuando se hace click en el día */
  onClick?: (date: Date) => void;
  /** Locale para formateo */
  locale?: CalendarLocale;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Props para el componente CalendarHeader
 */
export interface CalendarHeaderProps {
  /** Mes actual visible */
  currentMonth: MonthIndex;
  /** Año actual visible */
  currentYear: number;
  /** Locale */
  locale: CalendarLocale;
  /** Callback para cambiar de mes */
  onMonthChange: (month: MonthIndex) => void;
  /** Callback para cambiar de año */
  onYearChange: (year: number) => void;
  /** Callback para ir al mes anterior */
  onPrevMonth: () => void;
  /** Callback para ir al mes siguiente */
  onNextMonth: () => void;
  /** Rango de años disponibles para seleccionar */
  yearRange?: {
    min: number;
    max: number;
  };
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Props para el componente CalendarWeekdays
 */
export interface CalendarWeekdaysProps {
  /** Locale */
  locale: CalendarLocale;
  /** Formato (corto/largo) */
  format?: WeekdayFormat;
  /** Día de inicio de la semana */
  weekStart?: WeekStart;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Props para el componente CalendarGrid
 */
export interface CalendarGridProps {
  /** Semanas del calendario */
  weeks: CalendarWeek[];
  /** Fecha seleccionada */
  selectedDate?: Date;
  /** Variante visual */
  variant?: CalendarVariant;
  /** Locale */
  locale: CalendarLocale;
  /** Callback cuando se selecciona un día */
  onDaySelect?: (date: Date) => void;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Retorno del hook useCalendar
 */
export interface UseCalendarReturn {
  /** Mes actual visible */
  currentMonth: MonthIndex;
  /** Año actual visible */
  currentYear: number;
  /** Fecha seleccionada */
  selectedDate?: Date;
  /** Semanas del calendario generadas */
  weeks: CalendarWeek[];
  /** Ir al mes anterior */
  goToPrevMonth: () => void;
  /** Ir al mes siguiente */
  goToNextMonth: () => void;
  /** Cambiar de mes */
  setMonth: (month: MonthIndex) => void;
  /** Cambiar de año */
  setYear: (year: number) => void;
  /** Seleccionar una fecha */
  selectDate: (date: Date) => void;
  /** Ir a una fecha específica */
  goToDate: (date: Date) => void;
  /** Ir al mes actual */
  goToToday: () => void;
  /** Verificar si una fecha está disponible */
  isDateAvailable: (date: Date) => boolean;
  /** Verificar si una fecha está deshabilitada */
  isDateDisabled: (date: Date) => boolean;
}
