/**
 * Calendar Library - Public Exports
 *
 * Exporta todos los tipos, utilidades, constantes y hooks del sistema de calendario.
 * Punto de entrada principal para importar funcionalidades del calendario.
 */

// Types
export type {
  CalendarLocale,
  WeekdayIndex,
  MonthIndex,
  DayState,
  CalendarVariant,
  WeekdayFormat,
  WeekStart,
  DateRange,
  CalendarDay,
  CalendarWeek,
  CalendarConfig,
  CalendarProps,
  CalendarDayProps,
  CalendarHeaderProps,
  CalendarWeekdaysProps,
  CalendarGridProps,
  UseCalendarReturn,
} from './types';

// Interfaces
export type {
  CalendarDay as ICalendarDay,
  CalendarWeek as ICalendarWeek,
} from './types';

// Constants
export {
  MONTHS_EN,
  MONTHS_ES,
  MONTHS_SHORT_EN,
  MONTHS_SHORT_ES,
  WEEKDAYS_SHORT_EN_MON,
  WEEKDAYS_SHORT_EN_SUN,
  WEEKDAYS_LONG_EN_MON,
  WEEKDAYS_LONG_EN_SUN,
  WEEKDAYS_SHORT_ES_MON,
  WEEKDAYS_SHORT_ES_SUN,
  WEEKDAYS_LONG_ES_MON,
  WEEKDAYS_LONG_ES_SUN,
  DEFAULT_CALENDAR_CONFIG,
  getMonths,
  getWeekdays,
  getMonthName,
  getWeekdayName,
} from './constants';

// Utils
export {
  getDaysInMonth,
  getFirstDayOfMonth,
  adjustDayIndexForWeekStart,
  isSameDay,
  isToday,
  isDateInRange,
  createDateOnly,
  isDayInCurrentMonth,
  generateCalendarWeeks,
  formatCalendarDate,
  clamp,
} from './utils';

// Hooks
export {
  useCalendar,
  useUncontrolledCalendar,
} from './hooks';
