/**
 * CalendarDay Component
 *
 * Componente atómico que representa un día individual en el calendario.
 * Reutilizable, type-safe y con soporte para múltiples variantes visuales.
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { CalendarDayProps } from '@/lib/calendar';
import type { CalendarVariant, DayState } from '@/lib/calendar';

/**
 * Obtener clases CSS según el estado y variante del día
 */
function getDayClasses(
  state: DayState,
  isDisabled: boolean,
  variant: CalendarVariant = 'cal-com'
): string {
  const baseClasses = 'flex justify-center items-center text-sm font-medium transition-all focus:outline-hidden';

  // Variante Cal.com: Cuadrados con bordes (estilo exacto)
  if (variant === 'cal-com') {
    // Cal.com usa cuadrados más grandes con más espaciado
    const squareBase = 'w-full aspect-square border border-gray-300 dark:border-neutral-600';

    if (isDisabled) {
      return cn(
        baseClasses,
        squareBase,
        'text-gray-400 dark:text-neutral-500 cursor-not-allowed pointer-events-none'
      );
    }

    if (state === 'selected') {
      // Cal.com usa negro sólido para selección
      return cn(
        baseClasses,
        squareBase,
        'bg-gray-900 text-white border-gray-900 dark:bg-neutral-800 dark:border-neutral-800 dark:text-white',
        'hover:bg-gray-800 dark:hover:bg-neutral-700'
      );
    }

    if (state === 'today') {
      return cn(
        baseClasses,
        squareBase,
        'text-gray-900 bg-gray-50 border-gray-300 dark:text-white dark:bg-neutral-800/50 dark:border-neutral-600'
      );
    }

    if (state === 'unavailable') {
      return cn(
        baseClasses,
        squareBase,
        'text-gray-300 line-through cursor-not-allowed dark:text-neutral-600'
      );
    }

    // Estado available (default) - Cal.com usa gris medio claro
    return cn(
      baseClasses,
      squareBase,
      'text-gray-700 bg-white',
      'hover:bg-gray-50 hover:border-gray-400',
      'cursor-pointer transition-colors',
      'dark:text-neutral-300 dark:bg-neutral-900 dark:border-neutral-700',
      'dark:hover:bg-neutral-800 dark:hover:border-neutral-600'
    );
  }

  // Variante Preline: Círculos (original)
  if (variant === 'preline') {
    const circleBase = 'size-10 rounded-full border-[1.5px]';

    if (isDisabled) {
      return cn(
        baseClasses,
        circleBase,
        'border-transparent text-gray-800 opacity-50 pointer-events-none dark:text-neutral-200'
      );
    }

    if (state === 'selected') {
      return cn(
        baseClasses,
        circleBase,
        'bg-blue-600 border-transparent text-white font-medium hover:border-blue-600 dark:bg-blue-500 dark:hover:border-neutral-700'
      );
    }

    if (state === 'today') {
      return cn(
        baseClasses,
        circleBase,
        'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
      );
    }

    if (state === 'unavailable') {
      return cn(
        baseClasses,
        circleBase,
        'border-transparent text-gray-400 line-through cursor-not-allowed dark:text-neutral-500'
      );
    }

    // Estado available (default)
    return cn(
      baseClasses,
      circleBase,
      'border-transparent text-gray-800 hover:border-blue-600 hover:text-blue-600 focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500'
    );
  }

  // Variante custom: Similar a cal-com por defecto
  return getDayClasses(state, isDisabled, 'cal-com');
}

/**
 * Componente de día del calendario
 *
 * Renderiza un día individual con su estado, estilos y comportamiento.
 * Optimizado con memo para evitar re-renders innecesarios.
 */
export const CalendarDay = memo(function CalendarDay({
  day,
  variant = 'cal-com',
  onClick,
  locale,
  className,
}: CalendarDayProps) {
  const handleClick = () => {
    if (!day.isDisabled && onClick) {
      onClick(day.date);
    }
  };

  const dayClasses = getDayClasses(day.state, day.isDisabled, variant);

  return (
    <div className="flex items-center justify-center p-0.5">
      <button
        type="button"
        className={cn(dayClasses, className)}
        onClick={handleClick}
        disabled={day.isDisabled}
        aria-label={
          day.isToday
            ? `${day.day}, Hoy`
            : day.isCurrentMonth
              ? `${day.day} de ${day.date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { month: 'long' })}`
              : undefined
        }
        aria-pressed={day.state === 'selected'}
        aria-disabled={day.isDisabled}
        data-date={day.date.toISOString()}
        data-day={day.day}
        data-month={day.month}
        data-year={day.year}
        data-state={day.state}
        data-current-month={day.isCurrentMonth}
        data-today={day.isToday}
      >
        {day.day}
      </button>
    </div>
  );
});

CalendarDay.displayName = 'CalendarDay';
