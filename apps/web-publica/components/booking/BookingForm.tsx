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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    error: availabilityError,
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

  // ÉLITE PRO: Navegación por teclado en horarios
  const handleTimeSlotKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, time: string) => {
      const currentIndex = timeSlots.indexOf(time);

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          const nextSlot = timeSlots[currentIndex + 1];
          if (nextSlot) {
            const nextButton = document.getElementById(`time-slot-${nextSlot}`);
            nextButton?.focus();
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          const prevSlot = timeSlots[currentIndex - 1];
          if (prevSlot) {
            const prevButton = document.getElementById(`time-slot-${prevSlot}`);
            prevButton?.focus();
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          // Navegar 3 posiciones hacia abajo (siguiente fila en grid de 3 columnas)
          const downSlot = timeSlots[currentIndex + 3];
          if (downSlot) {
            const downButton = document.getElementById(`time-slot-${downSlot}`);
            downButton?.focus();
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          // Navegar 3 posiciones hacia arriba (fila anterior en grid de 3 columnas)
          const upSlot = timeSlots[currentIndex - 3];
          if (upSlot) {
            const upButton = document.getElementById(`time-slot-${upSlot}`);
            upButton?.focus();
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
    <div className="grid gap-6 md:grid-cols-2">
      {/* Sección de selección de fecha */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === 'es' ? 'Selecciona una fecha' : 'Select a date'}
          </CardTitle>
          <CardDescription>
            {isLoadingAvailability
              ? locale === 'es'
                ? 'Cargando disponibilidad...'
                : 'Loading availability...'
              : locale === 'es'
              ? 'Elige el día que mejor se adapte a tu horario'
              : 'Choose the day that best fits your schedule'}
          </CardDescription>
          {availabilityError && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              {locale === 'es'
                ? 'Mostrando disponibilidad estimada'
                : 'Showing estimated availability'}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isLoadingAvailability && Object.keys(availability).length === 0 ? (
            <div className="flex items-center justify-center h-64">
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
              // FASE 2: Modifiers para colorear días según disponibilidad
              modifiers={modifiers}
              modifiersClassNames={{
                // Verde: Muchos horarios disponibles (6+)
                available: cn(
                  'bg-green-50 dark:bg-green-900/20',
                  'border-2 border-green-300 dark:border-green-600',
                  'hover:bg-green-100 dark:hover:bg-green-900/30',
                  'font-semibold',
                  'relative'
                ),
                // Amarillo: Pocos horarios (1-5)
                fewSlots: cn(
                  'bg-yellow-50 dark:bg-yellow-900/20',
                  'border-2 border-yellow-300 dark:border-yellow-600',
                  'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
                  'font-semibold',
                  'relative'
                ),
                // Gris: Sin horarios (0) - También deshabilitar
                unavailable: cn(
                  'opacity-40',
                  'cursor-not-allowed',
                  'hover:bg-transparent',
                  'line-through'
                ),
              }}
              // FASE 2: Footer informativo con disponibilidad del día seleccionado
              footer={calendarFooter}
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                // Header con navegación mejorada (flechas más visibles y separadas del título)
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
                // Tabla con mejor separación y claridad
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
        </CardContent>
      </Card>

      {/* Sección de selección de horario */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === 'es' ? 'Selecciona un horario' : 'Select a time'}
          </CardTitle>
          <CardDescription>
            {selectedDate
              ? locale === 'es'
                ? `Horarios disponibles para el ${format(selectedDate, 'PPP', { locale: dateLocale })}`
                : `Available times for ${format(selectedDate, 'PPP', { locale: dateLocale })}`
              : locale === 'es'
              ? 'Primero selecciona una fecha'
              : 'Please select a date first'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <div ref={timeSlotContainerRef} className="grid grid-cols-3 gap-2">
              {timeSlots.map((time, index) => (
                <Button
                  key={time}
                  id={`time-slot-${time}`}
                  ref={index === 0 ? firstTimeSlotRef : null}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  onKeyDown={(e) => handleTimeSlotKeyDown(e, time)}
                  className="h-12"
                  aria-label={
                    locale === 'es'
                      ? `Seleccionar horario ${time}`
                      : `Select time ${time}`
                  }
                >
                  {time}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 dark:text-neutral-400">
              <p className="text-sm">
                {locale === 'es'
                  ? 'Selecciona una fecha para ver los horarios disponibles'
                  : 'Select a date to see available times'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de la reserva seleccionada */}
      {selectedDate && selectedTime && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {locale === 'es' ? 'Resumen de tu reserva' : 'Booking summary'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {format(selectedDate, 'PPP', { locale: dateLocale })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">{selectedTime}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDate(undefined);
                    setSelectedTime(null);
                  }}
                >
                  {locale === 'es' ? 'Cambiar' : 'Change'}
                </Button>
              </div>

              {/* TODO: Agregar formulario de información del cliente y botón de reservar */}
              <p className="text-sm text-gray-600 dark:text-neutral-400 text-center">
                {locale === 'es'
                  ? 'Próximamente: Formulario de información y pago'
                  : 'Coming soon: Information form and payment'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
