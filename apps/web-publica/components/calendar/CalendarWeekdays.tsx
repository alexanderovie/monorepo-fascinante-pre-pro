/**
 * CalendarWeekdays Component
 *
 * Componente que renderiza los headers de los días de la semana.
 * Soporta múltiples formatos, locales e inicio de semana.
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { getWeekdays } from '@/lib/calendar';
import type { CalendarWeekdaysProps } from '@/lib/calendar';

/**
 * Componente de headers de días de la semana
 *
 * Renderiza los nombres de los días de la semana (LUN, MAR, etc.)
 * con soporte para formato corto/largo y diferentes inicios de semana.
 */
export const CalendarWeekdays = memo(function CalendarWeekdays({
  locale,
  format = 'short',
  weekStart = 'monday',
  className,
}: CalendarWeekdaysProps) {
  const weekdays = getWeekdays(locale, format, weekStart);

  return (
    <div
      className={cn(
        'grid grid-cols-7 gap-0.5',
        'pb-1.5',
        className
      )}
      role="row"
      aria-label="Días de la semana"
    >
      {weekdays.map((day, index) => {
        return (
          <div key={`${day}-${index}`} className="flex items-center justify-center p-0.5">
            <span
              className={cn(
                'w-full block text-center text-[11px] sm:text-xs',
                'text-gray-600 dark:text-neutral-400',
                'font-semibold uppercase tracking-wide'
              )}
              role="columnheader"
              aria-label={day}
            >
              {day}
            </span>
          </div>
        );
      })}
    </div>
  );
});

CalendarWeekdays.displayName = 'CalendarWeekdays';
