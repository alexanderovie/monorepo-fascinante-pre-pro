/**
 * BookingTimeSlots Component
 *
 * Componente para la columna derecha que muestra los horarios disponibles.
 * Replicando el estilo de Cal.com con slots disponibles, indicadores visuales, etc.
 */

'use client';

import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface TimeSlot {
  /** Hora en formato HH:MM */
  time: string;
  /** Si el slot está disponible */
  available: boolean;
  /** Si el slot está reservado */
  booked?: boolean;
}

interface BookingTimeSlotsProps {
  locale: string;
  /** Fecha seleccionada para mostrar horarios */
  selectedDate?: Date;
  /** Horarios disponibles para la fecha seleccionada */
  slots?: TimeSlot[];
  /** Callback cuando se selecciona un horario */
  onSlotSelect?: (time: string, date: Date) => void;
  /** Duración del slot en minutos (para generar slots si no se proporcionan) */
  slotDuration?: number;
  /** Hora de inicio (formato HH:MM) */
  startTime?: string;
  /** Hora de fin (formato HH:MM) */
  endTime?: string;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Generar slots de tiempo por defecto si no se proporcionan
 */
function generateDefaultSlots(
  startTime: string = '09:00',
  endTime: string = '17:00',
  duration: number = 30
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push({
      time: timeString,
      available: true,
      booked: false,
    });

    // Incrementar tiempo
    currentMin += duration;
    if (currentMin >= 60) {
      currentHour += 1;
      currentMin = currentMin % 60;
    }
  }

  return slots;
}

/**
 * Formatear fecha para mostrar
 */
function formatSelectedDate(date: Date, locale: string): string {
  const dateLocale = locale === 'es' ? es : enUS;
  return format(date, "EEEE, d 'de' MMMM", { locale: dateLocale });
}

/**
 * Componente de horarios disponibles para booking
 *
 * Muestra una lista de horarios disponibles para la fecha seleccionada,
 * con indicadores visuales (punto verde para disponibles).
 */
export const BookingTimeSlots = memo(function BookingTimeSlots({
  locale,
  selectedDate,
  slots,
  onSlotSelect,
  slotDuration = 30,
  startTime = '09:00',
  endTime = '17:00',
  className,
}: BookingTimeSlotsProps) {
  const isSpanish = locale === 'es';

  // Generar slots si no se proporcionan
  const availableSlots = useMemo(() => {
    if (slots) return slots;
    if (!selectedDate) return [];
    return generateDefaultSlots(startTime, endTime, slotDuration);
  }, [slots, selectedDate, startTime, endTime, slotDuration]);

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available || slot.booked || !selectedDate || !onSlotSelect) {
      return;
    }

    onSlotSelect(slot.time, selectedDate);
  };

  if (!selectedDate) {
    return (
      <div
        className={cn(
          'flex flex-col h-full',
          className
        )}
      >
        <p className="text-sm text-gray-500 dark:text-neutral-400 text-center py-8">
          {isSpanish
            ? 'Selecciona una fecha para ver horarios disponibles'
            : 'Select a date to see available times'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full',
        // Se adapta a la altura que impone el calendario
        className
      )}
    >
      {/* Fecha seleccionada */}
      <div className="mb-4 flex-shrink-0 flex flex-col justify-start items-center lg:items-start">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 text-center lg:text-left">
          {isSpanish ? 'Horarios disponibles' : 'Available times'}
        </h3>
        <p className="text-xs text-gray-600 dark:text-neutral-400 text-center lg:text-left">
          {formatSelectedDate(selectedDate, locale)}
        </p>
      </div>

      {/* Lista de horarios */}
      {/* En móvil: sin scroll (overflow-visible), en escritorio: con scroll */}
      <div
        className={cn(
          // Usar flex-1 para expandirse y llenar el espacio disponible
          'flex-1 min-h-0',
          // Scroll solo en escritorio
          'lg:overflow-y-auto',
          // Scrollbar personalizado estilo Cal.com (solo en escritorio)
          'lg:[&::-webkit-scrollbar]:w-1.5',
          'lg:[&::-webkit-scrollbar-track]:bg-transparent',
          'lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full',
          'lg:dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600',
          'lg:hover:[&::-webkit-scrollbar-thumb]:bg-gray-400',
          'lg:dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500'
        )}
      >
        <div className="space-y-1 lg:pr-2">
          {availableSlots.map((slot, index) => {
            const isAvailable = slot.available && !slot.booked;

            return (
              <button
                key={`${slot.time}-${index}`}
                type="button"
                onClick={() => handleSlotClick(slot)}
                disabled={!isAvailable}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg lg:text-left justify-center lg:justify-start',
                  'border border-gray-200 dark:border-neutral-700',
                  'transition-colors',
                  isAvailable
                    ? 'hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer hover:border-gray-300 dark:hover:border-neutral-600'
                    : 'opacity-50 cursor-not-allowed',
                  slot.booked &&
                    'line-through text-gray-400 dark:text-neutral-500'
                )}
                aria-label={
                  isAvailable
                    ? `${slot.time} - ${isSpanish ? 'Disponible' : 'Available'}`
                    : `${slot.time} - ${isSpanish ? 'No disponible' : 'Unavailable'}`
                }
              >
                {/* Indicador verde para disponibles */}
                {isAvailable && (
                  <span
                    className="size-2 rounded-full bg-green-500 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
                {slot.booked && (
                  <span
                    className="size-2 rounded-full bg-gray-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}

                {/* Hora */}
                <span
                  className={cn(
                    'text-sm font-medium',
                    isAvailable
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-neutral-500'
                  )}
                >
                  {slot.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

BookingTimeSlots.displayName = 'BookingTimeSlots';
