/**
 * Calendar Utilities - Funciones Puras de Utilidad
 *
 * Funciones puras para cálculos de fechas, validaciones y generación de datos.
 * Sin efectos secundarios, fácilmente testeable.
 */

import type {
  CalendarDay,
  CalendarWeek,
  DateRange,
  MonthIndex,
  WeekStart,
} from './types';

/**
 * Obtener el número de días en un mes específico
 */
export function getDaysInMonth(month: MonthIndex, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Obtener el índice del primer día de la semana de un mes
 * Retorna 0-6 donde 0 es domingo, 1 es lunes, etc.
 */
export function getFirstDayOfMonth(
  month: MonthIndex,
  year: number
): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Ajustar el índice del día según dónde empieza la semana
 * Convierte el índice nativo de JS (0=domingo) al índice según weekStart
 */
export function adjustDayIndexForWeekStart(
  dayIndex: number,
  weekStart: WeekStart
): number {
  if (weekStart === 'sunday') {
    return dayIndex;
  }

  // Si la semana empieza en lunes, domingo (0) debe ser el último (6)
  return dayIndex === 0 ? 6 : dayIndex - 1;
}

/**
 * Verificar si dos fechas son el mismo día (ignorando hora)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Verificar si una fecha es hoy
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Verificar si una fecha está dentro de un rango
 */
export function isDateInRange(date: Date, range?: DateRange): boolean {
  if (!range) return true;

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (range.min) {
    const minOnly = new Date(range.min);
    minOnly.setHours(0, 0, 0, 0);
    if (dateOnly < minOnly) return false;
  }

  if (range.max) {
    const maxOnly = new Date(range.max);
    maxOnly.setHours(23, 59, 59, 999);
    if (dateOnly > maxOnly) return false;
  }

  return true;
}

/**
 * Crear un objeto Date solo con año, mes y día (sin hora)
 */
export function createDateOnly(
  year: number,
  month: MonthIndex,
  day: number
): Date {
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Verificar si un día pertenece al mes actual
 */
export function isDayInCurrentMonth(
  day: number,
  weekIndex: number,
  currentMonth: MonthIndex,
  currentYear: number,
  weekStart: WeekStart
): boolean {
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const adjustedFirstDay = adjustDayIndexForWeekStart(firstDay, weekStart);
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // Si es la primera semana y el día es menor o igual al primer día ajustado,
  // pertenece al mes anterior
  if (weekIndex === 0 && day <= adjustedFirstDay + (7 - adjustedFirstDay - daysInMonth % 7)) {
    // Días del mes anterior en la primera semana
    if (day <= 7 - adjustedFirstDay) {
      return false;
    }
  }

  // Si el día es mayor que los días del mes, pertenece al mes siguiente
  if (day > daysInMonth) {
    return false;
  }

  return true;
}

/**
 * Generar las semanas de un calendario para un mes/año específico
 */
export function generateCalendarWeeks(
  month: MonthIndex,
  year: number,
  weekStart: WeekStart = 'monday',
  isDateAvailable?: (date: Date) => boolean,
  isDateDisabled?: (date: Date) => boolean,
  dateRange?: DateRange,
  selectedDate?: Date
): CalendarWeek[] {
  const firstDay = getFirstDayOfMonth(month, year);
  const adjustedFirstDay = adjustDayIndexForWeekStart(firstDay, weekStart);
  const daysInMonth = getDaysInMonth(month, year);

  // Mes anterior
  const prevMonth = month === 0 ? 11 : (month - 1);
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonth as MonthIndex, prevYear);

  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];

  // Días del mes anterior
  const daysFromPrevMonth = adjustedFirstDay;
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const day = daysInPrevMonth - daysFromPrevMonth + i + 1;
    const date = createDateOnly(prevYear, prevMonth as MonthIndex, day);
    const isTodayDate = isToday(date);
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
    const isDisabled = true; // Siempre deshabilitados los días fuera del mes
    const isInRange = isDateInRange(date, dateRange);

    currentWeek.push({
      day,
      month: prevMonth as MonthIndex,
      year: prevYear,
      date,
      isCurrentMonth: false,
      isToday: isTodayDate,
      state: isSelected ? 'selected' : isDisabled ? 'disabled' : 'available',
      isDisabled: isDisabled || !isInRange || (isDateDisabled ? isDateDisabled(date) : false),
    });
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = createDateOnly(year, month, day);
    const isTodayDate = isToday(date);
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
    const isInRange = isDateInRange(date, dateRange);
    const isDisabledByFunc = isDateDisabled ? isDateDisabled(date) : false;
    const isDisabled = !isInRange || isDisabledByFunc;
    const isAvailable = isDateAvailable ? isDateAvailable(date) : true;

    let state: CalendarDay['state'] = 'available';
    if (isSelected) {
      state = 'selected';
    } else if (isDisabled || !isAvailable) {
      state = isDisabled ? 'disabled' : 'unavailable';
    } else if (isTodayDate) {
      state = 'today';
    }

    currentWeek.push({
      day,
      month,
      year,
      date,
      isCurrentMonth: true,
      isToday: isTodayDate,
      state,
      isDisabled,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Días del mes siguiente
  let nextMonthDay = 1;
  while (currentWeek.length < 7) {
    const nextMonth = month === 11 ? 0 : (month + 1);
    const nextYear = month === 11 ? year + 1 : year;
    const date = createDateOnly(nextYear, nextMonth as MonthIndex, nextMonthDay);
    const isTodayDate = isToday(date);
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
    const isDisabled = true; // Siempre deshabilitados los días fuera del mes

    currentWeek.push({
      day: nextMonthDay,
      month: nextMonth as MonthIndex,
      year: nextYear,
      date,
      isCurrentMonth: false,
      isToday: isTodayDate,
      state: isSelected ? 'selected' : 'disabled',
      isDisabled,
    });

    nextMonthDay++;
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Formatear una fecha según el locale
 */
export function formatCalendarDate(
  date: Date,
  locale: 'es' | 'en',
  format: 'full' | 'short' = 'full'
): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Clamp un valor entre un mínimo y máximo
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
