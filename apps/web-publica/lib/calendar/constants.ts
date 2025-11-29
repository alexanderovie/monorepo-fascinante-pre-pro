/**
 * Calendar Constants - Constantes Internacionalizadas
 *
 * Constantes centralizadas para nombres de meses, días, formatos, etc.
 * Soporta múltiples locales y facilita la internacionalización.
 */

import type { CalendarLocale, MonthIndex, WeekdayIndex } from './types';

/**
 * Nombres de meses en inglés (completos)
 */
export const MONTHS_EN: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/**
 * Nombres de meses en español (completos)
 */
export const MONTHS_ES: readonly string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const;

/**
 * Nombres de meses en inglés (cortos)
 */
export const MONTHS_SHORT_EN: readonly string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * Nombres de meses en español (cortos)
 */
export const MONTHS_SHORT_ES: readonly string[] = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const;

/**
 * Días de la semana en inglés (cortos) - Iniciando en lunes
 */
export const WEEKDAYS_SHORT_EN_MON: readonly string[] = [
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa',
  'Su',
] as const;

/**
 * Días de la semana en inglés (cortos) - Iniciando en domingo
 */
export const WEEKDAYS_SHORT_EN_SUN: readonly string[] = [
  'Su',
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa',
] as const;

/**
 * Días de la semana en inglés (largo) - Iniciando en lunes
 */
export const WEEKDAYS_LONG_EN_MON: readonly string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/**
 * Días de la semana en inglés (largo) - Iniciando en domingo
 */
export const WEEKDAYS_LONG_EN_SUN: readonly string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

/**
 * Días de la semana en español (cortos) - Iniciando en lunes
 */
export const WEEKDAYS_SHORT_ES_MON: readonly string[] = [
  'Lu',
  'Ma',
  'Mi',
  'Ju',
  'Vi',
  'Sá',
  'Do',
] as const;

/**
 * Días de la semana en español (cortos) - Iniciando en domingo
 */
export const WEEKDAYS_SHORT_ES_SUN: readonly string[] = [
  'Do',
  'Lu',
  'Ma',
  'Mi',
  'Ju',
  'Vi',
  'Sá',
] as const;

/**
 * Días de la semana en español (largo) - Iniciando en lunes
 * Formato Cal.com: DOM, LUN, MAR, MIÉ, JUE, VIE, SÁB
 */
export const WEEKDAYS_LONG_ES_MON: readonly string[] = [
  'LUN',
  'MAR',
  'MIÉ',
  'JUE',
  'VIE',
  'SÁB',
  'DOM',
] as const;

/**
 * Días de la semana en español (largo) - Iniciando en domingo
 * Formato Cal.com: DOM, LUN, MAR, MIÉ, JUE, VIE, SÁB
 */
export const WEEKDAYS_LONG_ES_SUN: readonly string[] = [
  'DOM',
  'LUN',
  'MAR',
  'MIÉ',
  'JUE',
  'VIE',
  'SÁB',
] as const;

/**
 * Obtener nombres de meses según locale
 */
export function getMonths(
  locale: CalendarLocale,
  format: 'full' | 'short' = 'full'
): readonly string[] {
  if (locale === 'es') {
    return format === 'short' ? MONTHS_SHORT_ES : MONTHS_ES;
  }
  return format === 'short' ? MONTHS_SHORT_EN : MONTHS_EN;
}

/**
 * Obtener días de la semana según locale, formato e inicio
 */
export function getWeekdays(
  locale: CalendarLocale,
  format: 'short' | 'long' = 'short',
  weekStart: 'sunday' | 'monday' = 'monday'
): readonly string[] {
  const isSunday = weekStart === 'sunday';

  if (locale === 'es') {
    if (format === 'long') {
      return isSunday ? WEEKDAYS_LONG_ES_SUN : WEEKDAYS_LONG_ES_MON;
    }
    return isSunday ? WEEKDAYS_SHORT_ES_SUN : WEEKDAYS_SHORT_ES_MON;
  }

  // English
  if (format === 'long') {
    return isSunday ? WEEKDAYS_LONG_EN_SUN : WEEKDAYS_LONG_EN_MON;
  }
  return isSunday ? WEEKDAYS_SHORT_EN_SUN : WEEKDAYS_SHORT_EN_MON;
}

/**
 * Obtener nombre del mes por índice
 */
export function getMonthName(
  monthIndex: MonthIndex,
  locale: CalendarLocale,
  format: 'full' | 'short' = 'full'
): string {
  const months = getMonths(locale, format);
  return months[monthIndex] || '';
}

/**
 * Obtener nombre del día por índice
 */
export function getWeekdayName(
  weekdayIndex: WeekdayIndex,
  locale: CalendarLocale,
  format: 'short' | 'long' = 'short',
  weekStart: 'sunday' | 'monday' = 'monday'
): string {
  const weekdays = getWeekdays(locale, format, weekStart);

  // Ajustar índice según inicio de semana
  if (weekStart === 'sunday') {
    return weekdays[weekdayIndex] || '';
  }

  // Si la semana empieza en lunes, domingo (0) debe ser el último
  const adjustedIndex = weekdayIndex === 0 ? 6 : weekdayIndex - 1;
  return weekdays[adjustedIndex] || '';
}

/**
 * Constantes de configuración por defecto
 */
export const DEFAULT_CALENDAR_CONFIG = {
  locale: 'es' as CalendarLocale,
  variant: 'cal-com' as const,
  weekdayFormat: 'long' as const,
  weekStart: 'sunday' as const,
  yearRange: {
    min: new Date().getFullYear() - 5,
    max: new Date().getFullYear() + 5,
  },
} as const;
