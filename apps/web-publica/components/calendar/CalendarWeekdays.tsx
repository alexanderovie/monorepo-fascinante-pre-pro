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
        const isWednesday =
          day.startsWith('MI') || // Español: MI, MIÉ
          day.startsWith('Mi') ||
          day.startsWith('WED') || // Inglés: WED
          day.startsWith('Wed') ||
          day.startsWith('Wednesday');

        return (
          <span
            key={`${day}-${index}`}
            className={cn(
              'flex-1 lg:w-[42px] block text-center text-xs',
              'text-gray-600 dark:text-neutral-400',
              'font-semibold uppercase tracking-wide',
              isWednesday && 'text-blue-600'
            )}
            role="columnheader"
            aria-label={day}
          >
            {day}
          </span>
        );
      })}
    </div>
  );
});

CalendarWeekdays.displayName = 'CalendarWeekdays';
