'use client';

/**
 * BookingContainer Component
 *
 * Client Component que contiene el estado y las 3 columnas del booking.
 * Maneja la selección de fecha y hora.
 */

import { useState } from 'react';
import BookingCalendar from './BookingCalendar';

interface BookingContainerProps {
  locale: string;
}

export default function BookingContainer({ locale }: BookingContainerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden min-h-[600px] w-full">
      {/* COLUMNA 1: Información del servicio (izquierda) */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-neutral-700">
        {/* Contenido columna 1 irá aquí */}
      </div>

      {/* COLUMNA 2: Calendario (centro) */}
      <div className="flex-1 min-w-0 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-neutral-700">
        <BookingCalendar
          locale={locale}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      {/* COLUMNA 3: Horarios (derecha) */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 p-6">
        {/* Contenido columna 3 irá aquí */}
      </div>
    </div>
  );
}
