'use client';

/**
 * BookingForm - Componente de reserva de citas
 *
 * Componente cliente que permite a los usuarios:
 * 1. Seleccionar una fecha usando react-day-picker
 * 2. Seleccionar un horario disponible
 * 3. Completar información personal
 * 4. Reservar la cita (con pago si es requerido)
 *
 * FASE 2: Integración con sistema de disponibilidad en tiempo real
 * - Indicadores visuales de disponibilidad (colores)
 * - Contadores de horarios disponibles
 * - Horarios dinámicos desde la base de datos
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, addDays, startOfDay, parseISO, startOfMonth } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAvailability } from './hooks/useAvailability';

interface BookingFormProps {
  locale: string;
}

export default function BookingForm({ locale }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const dateLocale = locale === 'es' ? es : enUS;

  // Refs para auto-scroll y auto-focus
  const timeSlotContainerRef = useRef<HTMLDivElement>(null);
  const firstTimeSlotRef = useRef<HTMLButtonElement>(null);

  // FASE 2: Hook de disponibilidad - Carga disponibilidad del mes actual
  const {
    availability,
    isLoading: isLoadingAvailability,
    error: _availabilityError,
    warning: _availabilityWarning,
    getDayAvailability,
    hasManySlots,
    hasFewSlots,
    hasNoSlots,
  } = useAvailability(currentMonth);

  // FASE 2: Obtener horarios disponibles para la fecha seleccionada (en lugar de hardcodeados)
  const timeSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    const dayAvail = getDayAvailability(selectedDate);
    if (dayAvail && dayAvail.horariosDisponibles.length > 0) {
      return dayAvail.horariosDisponibles;
    }

    // Fallback: horarios por defecto si no hay disponibilidad cargada aún
    return [
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
    ];
  }, [selectedDate, getDayAvailability]);

  // Deshabilitar fechas pasadas y fechas muy lejanas (máx 90 días)
  const disabledDates = {
    before: startOfDay(new Date()),
    after: addDays(new Date(), 90),
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes

    // FASE 2: Si cambiamos de mes, actualizar currentMonth para cargar disponibilidad
    if (date) {
      const monthStart = startOfMonth(date);
      if (monthStart.getTime() !== startOfMonth(currentMonth).getTime()) {
        setCurrentMonth(monthStart);
      }
    }
  };

  // FASE 2: Calcular modifiers para react-day-picker (colores según disponibilidad)
  const modifiers = useMemo(() => {
    const availableDates: Date[] = [];
    const fewSlotsDates: Date[] = [];
    const unavailableDates: Date[] = [];

    // Recorrer todas las fechas del mes y clasificarlas
    Object.keys(availability).forEach((dateStr) => {
      try {
        const date = parseISO(dateStr);
        if (hasManySlots(date)) {
          availableDates.push(date);
        } else if (hasFewSlots(date)) {
          fewSlotsDates.push(date);
        } else if (hasNoSlots(date)) {
          unavailableDates.push(date);
        }
      } catch (error) {
        console.error(`Error parsing date ${dateStr}:`, error);
      }
    });

    return {
      available: availableDates,
      fewSlots: fewSlotsDates,
      unavailable: unavailableDates,
    };
  }, [availability, hasManySlots, hasFewSlots, hasNoSlots]);

  // FASE 2: Calcular footer informativo del día seleccionado
  const calendarFooter = useMemo(() => {
    if (!selectedDate) return null;

    const dayAvail = getDayAvailability(selectedDate);
    if (!dayAvail || dayAvail.slotsDisponibles === 0) return null;

    const slotsCount = dayAvail.slotsDisponibles;
    const isFew = slotsCount < 6;

    return (
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
        <div className="text-center">
          <p className={cn(
            "text-sm font-semibold",
            isFew ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
          )}>
            {locale === 'es'
              ? `${slotsCount} horarios disponibles`
              : `${slotsCount} slots available`}
          </p>
          {isFew && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              {locale === 'es' ? '¡Apúrate! Quedan pocos' : 'Hurry! Few left'}
            </p>
          )}
        </div>
      </div>
    );
  }, [selectedDate, getDayAvailability, locale]);

  // ÉLITE PRO: Auto-scroll y auto-focus después de seleccionar fecha
  useEffect(() => {
    if (selectedDate && !selectedTime && timeSlotContainerRef.current) {
      const isMobile = window.innerWidth < 768;

      // Auto-scroll suave a la sección de horarios (solo en móvil)
      if (isMobile) {
        setTimeout(() => {
          timeSlotContainerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      }

      // Auto-focus en el primer horario disponible (desktop + móvil)
      setTimeout(() => {
        firstTimeSlotRef.current?.focus();
      }, isMobile ? 400 : 100); // Delay mayor en móvil para que termine el scroll
    }
  }, [selectedDate, selectedTime]);

  // ÉLITE PRO: Navegación por teclado en horarios (lista vertical)
  const handleTimeSlotKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, time: string) => {
      const currentIndex = timeSlots.indexOf(time);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextSlot = timeSlots[currentIndex + 1];
          if (nextSlot) {
            const nextButton = document.getElementById(`time-slot-${nextSlot}`);
            nextButton?.focus();
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          const prevSlot = timeSlots[currentIndex - 1];
          if (prevSlot) {
            const prevButton = document.getElementById(`time-slot-${prevSlot}`);
            prevButton?.focus();
          }
          break;

        case 'Home':
          e.preventDefault();
          const firstButton = document.getElementById(`time-slot-${timeSlots[0]}`);
          firstButton?.focus();
          break;

        case 'End':
          e.preventDefault();
          const lastButton = document.getElementById(`time-slot-${timeSlots[timeSlots.length - 1]}`);
          lastButton?.focus();
          break;
      }
    },
    [timeSlots]
  );

  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
      {/* PANEL IZQUIERDO: Información del Servicio (como Cal.com) */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 p-6">
        {/* Logo/Marca */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Fascinante Digital
          </span>
        </div>

        {/* Título del Evento */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {locale === 'es' ? 'Reunión de 30 min' : '30 min Meeting'}
        </h2>

        {/* Detalles del Servicio */}
        <div className="space-y-4">
          {/* Duración */}
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400">
            <svg
              className="w-5 h-5 text-gray-400 dark:text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>30m</span>
          </div>

          {/* Plataforma */}
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400">
            <svg
              className="w-5 h-5 text-gray-400 dark:text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>Google Meet</span>
          </div>

          {/* Timezone */}
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400">
            <svg
              className="w-5 h-5 text-gray-400 dark:text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="flex items-center gap-1">
              America/New_York
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* PANEL CENTRO: Calendario */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 overflow-auto">
        {isLoadingAvailability && Object.keys(availability).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                {locale === 'es' ? 'Cargando disponibilidad...' : 'Loading availability...'}
              </p>
            </div>
          </div>
        ) : (
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDates}
            locale={dateLocale}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="mx-auto"
            modifiers={modifiers}
            modifiersClassNames={{
              available: cn(
                'bg-green-50 dark:bg-green-900/20',
                'border-2 border-green-300 dark:border-green-600',
                'hover:bg-green-100 dark:hover:bg-green-900/30',
                'font-semibold',
                'relative'
              ),
              fewSlots: cn(
                'bg-yellow-50 dark:bg-yellow-900/20',
                'border-2 border-yellow-300 dark:border-yellow-600',
                'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
                'font-semibold',
                'relative'
              ),
              unavailable: cn(
                'opacity-40',
                'cursor-not-allowed',
                'hover:bg-transparent',
                'line-through'
              ),
            }}
            footer={calendarFooter}
            classNames={{
              months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
              month: 'space-y-4',
              caption: 'flex justify-between items-center mb-4 px-1',
              caption_label: 'text-base font-semibold text-gray-900 dark:text-white',
              nav: 'flex items-center gap-2',
              nav_button: cn(
                'h-9 w-9 flex items-center justify-center',
                'bg-white dark:bg-neutral-800',
                'border border-gray-300 dark:border-neutral-700 rounded-lg',
                'text-gray-700 dark:text-neutral-300',
                'hover:bg-gray-50 dark:hover:bg-neutral-700',
                'hover:border-blue-500 dark:hover:border-blue-400',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              ),
              nav_button_previous: '',
              nav_button_next: '',
              table: 'w-full border-collapse',
              head_row: 'flex justify-between mb-2',
              head_cell: 'text-xs font-semibold text-gray-600 dark:text-neutral-400 w-10 h-10 flex items-center justify-center',
              row: 'flex justify-between w-full mb-1',
              cell: 'text-center p-0 w-10 h-10 flex items-center justify-center relative',
              day: cn(
                'w-10 h-10 rounded-lg',
                'font-medium text-sm',
                'transition-all duration-200',
                'hover:bg-gray-100 dark:hover:bg-neutral-700',
                'text-gray-900 dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
              ),
              day_selected:
                'bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white shadow-md',
              day_today: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold',
              day_outside: 'text-gray-300 dark:text-neutral-600 opacity-40',
              day_disabled: 'text-gray-300 dark:text-neutral-600 opacity-40 cursor-not-allowed hover:bg-transparent',
              day_range_middle:
                'aria-selected:bg-gray-100 dark:aria-selected:bg-neutral-800 aria-selected:text-gray-900 dark:aria-selected:text-white',
              day_hidden: 'invisible',
            }}
          />
        )}
      </div>

      {/* PANEL DERECHO: Horarios (lista vertical como Cal.com) */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 p-6 overflow-auto">
        {/* Header con fecha seleccionada */}
        <div className="mb-4">
          {selectedDate ? (
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {format(selectedDate, 'EEE dd', { locale: dateLocale })}
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                {format(selectedDate, 'MMMM yyyy', { locale: dateLocale })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {locale === 'es' ? 'Selecciona una fecha' : 'Select a date'}
            </p>
          )}
        </div>

        {/* Lista vertical de horarios */}
        {selectedDate ? (
          <div ref={timeSlotContainerRef} className="space-y-2 max-h-[500px] lg:max-h-[600px] overflow-y-auto">
            {timeSlots.map((time, index) => (
              <Button
                key={time}
                id={`time-slot-${time}`}
                ref={index === 0 ? firstTimeSlotRef : null}
                variant={selectedTime === time ? 'default' : 'outline'}
                onClick={() => setSelectedTime(time)}
                onKeyDown={(e) => handleTimeSlotKeyDown(e, time)}
                className={cn(
                  'w-full justify-start h-12 px-4',
                  'flex items-center gap-2',
                  selectedTime === time
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
                )}
                aria-label={
                  locale === 'es'
                    ? `Seleccionar horario ${time}`
                    : `Select time ${time}`
                }
              >
                {/* Indicador verde de disponibilidad */}
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    selectedTime === time ? 'bg-white' : 'bg-green-500'
                  )}
                />
                <span className="font-medium">{time}</span>
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-500 dark:text-neutral-400">
            <p className="text-sm text-center">
              {locale === 'es'
                ? 'Selecciona una fecha para ver los horarios disponibles'
                : 'Select a date to see available times'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
