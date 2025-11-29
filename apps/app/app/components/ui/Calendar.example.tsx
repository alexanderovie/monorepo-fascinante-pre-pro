'use client';

/**
 * Ejemplo de uso del componente Calendar
 * 
 * Este componente es una implementación del calendario de Preline UI
 * convertido a React/TSX funcional para Next.js.
 */

import { useState } from 'react';
import Calendar from './Calendar';

export default function CalendarExample() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Fecha seleccionada:', date);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Ejemplo de Calendario</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-neutral-400">
          Fecha seleccionada:{' '}
          {selectedDate?.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Calendario básico */}
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      {/* Calendario con restricciones de fecha */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">
          Calendario con rango de fechas
        </h3>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          minDate={new Date()} // Solo fechas futuras
          maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 días desde hoy
        />
      </div>
    </div>
  );
}

