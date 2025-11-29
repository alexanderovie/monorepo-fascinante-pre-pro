'use client';

import { useState, useEffect } from 'react';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const MONTHS = [
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
];

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function Calendar({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  className = '',
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  // Sincronizar con selectedDate externo
  useEffect(() => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      setCurrentDate(newDate);
      setViewMonth(newDate.getMonth());
      setViewYear(newDate.getFullYear());
    }
  }, [selectedDate]);

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
  }, [viewMonth, viewYear]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    // Ajustar para que lunes sea 0
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    
    // Validar minDate y maxDate
    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;

    setCurrentDate(newDate);
    onDateSelect?.(newDate);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleMonthChange = (monthIndex: number) => {
    setViewMonth(monthIndex);
  };

  const handleYearChange = (year: number) => {
    setViewYear(year);
  };

  const isDateSelected = (day: number) => {
    return (
      currentDate.getDate() === day &&
      currentDate.getMonth() === viewMonth &&
      currentDate.getFullYear() === viewYear
    );
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };


  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
    const daysInMonth = getDaysInMonth(viewMonth, viewYear);
    const daysInPrevMonth = getDaysInMonth(
      viewMonth === 0 ? 11 : viewMonth - 1,
      viewMonth === 0 ? viewYear - 1 : viewYear
    );

    const weeks: Array<{ day: number; isCurrentMonth: boolean }[]> = [];
    let currentWeek: Array<{ day: number; isCurrentMonth: boolean }> = [];

    // Días del mes anterior
    for (let i = firstDay - 1; i >= 0; i--) {
      currentWeek.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        day,
        isCurrentMonth: true,
      });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Días del mes siguiente
    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({
        day: nextMonthDay,
        isCurrentMonth: false,
      });
      nextMonthDay++;
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = generateCalendarDays();
  const years = Array.from({ length: 10 }, (_, i) => viewYear - 5 + i);

  return (
    <div
      className={`w-80 flex flex-col bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-700 ${className}`}
    >
      {/* Calendar */}
      <div className="p-3 space-y-0.5">
        {/* Months */}
        <div className="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3">
          {/* Prev Button */}
          <div className="col-span-1">
            <button
              type="button"
              className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              aria-label="Previous"
              onClick={handlePrevMonth}
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
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </div>
          {/* End Prev Button */}

          {/* Month / Year */}
          <div className="col-span-3 flex justify-center items-center gap-x-1">
            <div className="relative">
              <select
                data-hs-select={JSON.stringify({
                  placeholder: 'Select month',
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
                value={viewMonth}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-gray-800 dark:text-neutral-200">/</span>

            <div className="relative">
              <select
                data-hs-select={JSON.stringify({
                  placeholder: 'Select year',
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
                value={viewYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* End Month / Year */}

          {/* Next Button */}
          <div className="col-span-1 flex justify-end">
            <button
              type="button"
              className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              aria-label="Next"
              onClick={handleNextMonth}
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
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          {/* End Next Button */}
        </div>
        {/* Months */}

        {/* Weeks */}
        <div className="flex pb-1.5">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="m-px w-10 block text-center text-sm text-gray-500 dark:text-neutral-500"
            >
              {day}
            </span>
          ))}
        </div>
        {/* Weeks */}

        {/* Days */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex">
            {week.map(({ day, isCurrentMonth }, dayIndex) => {
              const isSelected =
                isCurrentMonth && isDateSelected(day);
              const isDisabled = !isCurrentMonth || isDateDisabled(day);

              return (
                <div key={`${weekIndex}-${dayIndex}`}>
                  <button
                    type="button"
                    className={`m-px size-10 flex justify-center items-center border-[1.5px] text-sm rounded-full focus:outline-hidden ${
                      isSelected
                        ? 'bg-blue-600 border-transparent font-medium text-white hover:border-blue-600 dark:bg-blue-500 dark:hover:border-neutral-700'
                        : isDisabled
                          ? 'border-transparent text-gray-800 opacity-50 pointer-events-none dark:text-neutral-200'
                          : 'border-transparent text-gray-800 hover:border-blue-600 hover:text-blue-600 focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500'
                    }`}
                    onClick={() => handleDateClick(day)}
                    disabled={isDisabled}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
        {/* Days */}
      </div>
    </div>
  );
}
