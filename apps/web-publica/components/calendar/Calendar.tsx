/**
 * Calendar Component
 *
 * Componente principal del calendario que orquesta todos los subcomponentes.
 * Reutilizable, configurable y type-safe.
 */

'use client';

import React, { memo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCalendar } from '@/lib/calendar';
import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekdays } from './CalendarWeekdays';
import { CalendarGrid } from './CalendarGrid';
import type { CalendarProps } from '@/lib/calendar';
import { DEFAULT_CALENDAR_CONFIG } from '@/lib/calendar';

/**
 * Componente principal del calendario
 *
 * Orquesta todos los subcomponentes y maneja la lógica del calendario
 * usando el hook useCalendar. Completamente reutilizable y configurable.
 *
 * @example
 * ```tsx
 * <Calendar
 *   locale="es"
 *   variant="cal-com"
 *   weekStart="sunday"
 *   weekdayFormat="long"
 *   selectedDate={selectedDate}
 *   onDateSelect={handleDateSelect}
 * />
 * ```
 */
export const Calendar = memo(function Calendar({
  locale,
  variant = DEFAULT_CALENDAR_CONFIG.variant,
  weekdayFormat = DEFAULT_CALENDAR_CONFIG.weekdayFormat,
  weekStart = variant === 'cal-com' ? 'sunday' : DEFAULT_CALENDAR_CONFIG.weekStart,
  dateRange,
  isDateAvailable,
  isDateDisabled,
  selectedDate,
  onDateSelect,
  initialMonth,
  initialYear,
  className,
}: CalendarProps) {
  // Configuración del calendario
  const config = {
    locale,
    variant,
    weekdayFormat,
    weekStart,
    dateRange,
    isDateAvailable,
    isDateDisabled,
  };

  // Usar el hook de calendario
  const calendar = useCalendar(config, selectedDate, onDateSelect);

  // Aplicar mes/año inicial si se proporcionan
  useEffect(() => {
    if (initialMonth !== undefined && initialYear !== undefined) {
      calendar.setMonth(initialMonth);
      calendar.setYear(initialYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  return (
    <div
      className={cn(
        'w-full lg:w-[320px] flex flex-col',
        // En móvil: sin marco (sin fondo, sin borde, sin sombra)
        // En escritorio: con marco
        'lg:bg-white lg:border lg:border-gray-200 lg:shadow-sm lg:rounded-lg lg:overflow-hidden',
        'lg:dark:bg-neutral-900 lg:dark:border-neutral-700',
        className
      )}
      role="application"
      aria-label="Calendario"
    >
      <div className="p-2 lg:p-4 space-y-2">
        {/* Header con navegación */}
        <CalendarHeader
          currentMonth={calendar.currentMonth}
          currentYear={calendar.currentYear}
          locale={locale}
          onMonthChange={calendar.setMonth}
          onYearChange={calendar.setYear}
          onPrevMonth={calendar.goToPrevMonth}
          onNextMonth={calendar.goToNextMonth}
        />

        {/* Headers de días de semana (responsive) */}
        {/* Móvil: formato corto (Sun, Mon, ... / DOM, LUN, ...) */}
        <div className="flex lg:hidden">
          <CalendarWeekdays
            locale={locale}
            format="short"
            weekStart={weekStart}
          />
        </div>

        {/* Desktop: formato configurado (por defecto, largo estilo Cal.com) */}
        <div className="hidden lg:flex">
          <CalendarWeekdays
            locale={locale}
            format={weekdayFormat}
            weekStart={weekStart}
          />
        </div>

        {/* Grid de días */}
        <CalendarGrid
          weeks={calendar.weeks}
          selectedDate={calendar.selectedDate}
          variant={variant}
          locale={locale}
          onDaySelect={calendar.selectDate}
        />
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';
