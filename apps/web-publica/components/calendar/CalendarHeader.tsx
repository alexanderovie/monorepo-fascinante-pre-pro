/**
 * CalendarHeader Component
 *
 * Componente de navegación del calendario con selectores de mes/año.
 * Usa Preline UI Advanced Select para los dropdowns.
 */

'use client';

import { memo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getMonths } from '@/lib/calendar';
import type { CalendarHeaderProps, MonthIndex } from '@/lib/calendar';

/**
 * Componente de header del calendario
 *
 * Incluye:
 * - Botón para mes anterior
 * - Selectores de mes y año (Preline UI Advanced Select)
 * - Botón para mes siguiente
 */
export const CalendarHeader = memo(function CalendarHeader({
  currentMonth,
  currentYear,
  locale,
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth,
  yearRange = {
    min: new Date().getFullYear() - 5,
    max: new Date().getFullYear() + 5,
  },
  className,
}: CalendarHeaderProps) {
  const months = getMonths(locale, 'full');
  const years = Array.from(
    { length: yearRange.max - yearRange.min + 1 },
    (_, i) => yearRange.min + i
  );

  // Reinicializar Preline Select cuando cambia el mes/año
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentMonth, currentYear]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMonthChange(Number(e.target.value) as MonthIndex);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onYearChange(Number(e.target.value));
  };

  const isSpanish = locale === 'es';

  return (
    <div
      className={cn(
        'grid grid-cols-5 items-center gap-x-2 pb-3',
        className
      )}
      role="toolbar"
      aria-label="Navegación del calendario"
    >
      {/* Botón Mes Anterior */}
      <div className="col-span-1">
        <button
          type="button"
          className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          aria-label={isSpanish ? 'Mes anterior' : 'Previous month'}
          onClick={onPrevMonth}
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Selectores Mes / Año */}
      <div className="col-span-3 flex justify-center items-center gap-x-1">
        {/* Selector de Mes */}
        <div className="relative" key={`month-select-${currentMonth}-${currentYear}`}>
          <select
            data-hs-select={JSON.stringify({
              placeholder: isSpanish ? 'Seleccionar mes' : 'Select month',
              toggleTag: '<button type="button" aria-expanded="false"></button>',
              toggleClasses:
                'hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 before:absolute before:inset-0 before:z-1 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500',
              dropdownClasses:
                'mt-2 z-50 w-32 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700',
              optionClasses:
                'p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800',
              optionTemplate:
                '<div class="flex justify-between items-center w-full"><span data-title></span><span class="hidden hs-selected:block"><svg class="shrink-0 size-3.5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></div>',
            })}
            className="hidden"
            value={currentMonth}
            onChange={handleMonthChange}
            aria-label={isSpanish ? 'Seleccionar mes' : 'Select month'}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Separador */}
        <span className="text-gray-800 dark:text-neutral-200">/</span>

        {/* Selector de Año */}
        <div className="relative" key={`year-select-${currentMonth}-${currentYear}`}>
          <select
            data-hs-select={JSON.stringify({
              placeholder: isSpanish ? 'Seleccionar año' : 'Select year',
              toggleTag: '<button type="button" aria-expanded="false"></button>',
              toggleClasses:
                'hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 before:absolute before:inset-0 before:z-1 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500',
              dropdownClasses:
                'mt-2 z-50 w-20 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700',
              optionClasses:
                'p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800',
              optionTemplate:
                '<div class="flex justify-between items-center w-full"><span data-title></span><span class="hidden hs-selected:block"><svg class="shrink-0 size-3.5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></div>',
            })}
            className="hidden"
            value={currentYear}
            onChange={handleYearChange}
            aria-label={isSpanish ? 'Seleccionar año' : 'Select year'}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón Mes Siguiente */}
      <div className="col-span-1 flex justify-end">
        <button
          type="button"
          className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          aria-label={isSpanish ? 'Mes siguiente' : 'Next month'}
          onClick={onNextMonth}
        >
          <svg
            className="shrink-0 size-4"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
});

CalendarHeader.displayName = 'CalendarHeader';
