/**
 * CalendarGrid Component
 *
 * Componente que renderiza el grid completo de días del calendario.
 * Orquesta la renderización de múltiples semanas con CalendarDay.
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { CalendarDay } from './CalendarDay';
import type { CalendarGridProps } from '@/lib/calendar';

/**
 * Componente de grid del calendario
 *
 * Renderiza todas las semanas del calendario con sus días.
 * Cada semana contiene 7 días (CalendarDay components).
 */
export const CalendarGrid = memo(function CalendarGrid({
  weeks,
  selectedDate: _selectedDate,
  variant = 'cal-com',
  locale,
  onDaySelect,
  className,
}: CalendarGridProps) {
  return (
    <div
      className={cn('space-y-0', className)}
      role="grid"
      aria-label="Calendario de días"
    >
      {weeks.map((week, weekIndex) => (
        <div
          key={`week-${weekIndex}`}
          className="flex gap-0.5 lg:gap-0.5"
          role="row"
          aria-label={`Semana ${weekIndex + 1}`}
        >
          {week.map((day, dayIndex) => (
            <CalendarDay
              key={`${day.year}-${day.month}-${day.day}-${dayIndex}`}
              day={day}
              variant={variant}
              locale={locale}
              onClick={onDaySelect}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

CalendarGrid.displayName = 'CalendarGrid';
