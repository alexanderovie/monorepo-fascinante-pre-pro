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
        // Colores de prueba para ver el ancho de cada contenedor
        const bgColors = [
          'bg-red-100',
          'bg-orange-100',
          'bg-yellow-100',
          'bg-green-100',
          'bg-blue-100',
          'bg-indigo-100',
          'bg-purple-100',
        ];

        return (
          <span
            key={`${day}-${index}`}
            className={cn(
              'w-full block text-center text-[11px] sm:text-xs',
              'text-gray-600 dark:text-neutral-400',
              'font-semibold uppercase tracking-wide',
              bgColors[index % 7] // Color de fondo diferente para cada día
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
