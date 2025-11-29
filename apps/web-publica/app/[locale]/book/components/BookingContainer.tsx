'use client';

/**
 * BookingContainer Component
 *
 * Client Component que contiene el estado y las 3 columnas del booking.
 * Maneja la selección de fecha y hora.
 */

import { useState } from 'react';
import BookingCalendar from './BookingCalendar';
import { BookingInfo } from './BookingInfo';
import { BookingTimeSlots } from './BookingTimeSlots';

interface BookingContainerProps {
  locale: string;
}

export default function BookingContainer({ locale }: BookingContainerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [_selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Resetear horario cuando cambia la fecha
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string, date: Date) => {
    setSelectedTime(time);
    // Aquí se puede hacer algo con la selección completa (fecha + hora)
    // Ejemplo: enviar a API, actualizar estado global, etc.
    void { date, time }; // Placeholder para uso futuro
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden w-full lg:min-h-[500px]">
      {/* COLUMNA 1: Información del servicio (izquierda) */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-neutral-700">
        <BookingInfo
          locale={locale}
          duration={30}
          meetingType={
            locale === 'es' ? 'Reunión de 30 min' : '30 min Meeting'
          }
          meetingLink="https://meet.google.com/xxx-xxxx-xxx"
          timezone="America/New_York"
        />
      </div>

      {/* COLUMNA 2: Calendario (centro) */}
      <div className="flex-1 min-w-0 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-neutral-700 flex items-center justify-center">
        <BookingCalendar
          locale={locale}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* COLUMNA 3: Horarios (derecha) */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 p-6 flex flex-col">
        <BookingTimeSlots
          locale={locale}
          selectedDate={selectedDate}
          onSlotSelect={handleTimeSelect}
          slotDuration={30}
          startTime="09:00"
          endTime="17:00"
        />
      </div>
    </div>
  );
}
