/**
 * Calendar Component
 *
 * Componente principal del calendario que orquesta todos los subcomponentes.
 * Reutilizable, configurable y type-safe.
 */

'use client';

import type { CalendarProps } from '@/lib/calendar';
import { DEFAULT_CALENDAR_CONFIG, useCalendar } from '@/lib/calendar';
import { cn } from '@/lib/utils';
import { memo, useEffect } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekdays } from './CalendarWeekdays';

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
        'w-full flex flex-col',
        className
      )}
      role="application"
      aria-label="Calendario"
    >
      <div className="p-2 lg:pt-0 lg:px-0 lg:pb-4 space-y-2">
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

        {/* Headers de días de semana - Mismo formato en todas las vistas (3 letras) */}
        <div className="w-full">
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
