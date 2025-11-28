'use client';

/**
 * BookingCalendar Component
 *
 * Componente de calendario para la columna del medio del booking.
 * Calendario removido - esperando instrucciones para implementación.
 */

interface BookingCalendarProps {
  locale: string;
  selectedDate?: Date | undefined;
  onDateSelect?: (date: Date | undefined) => void;
}

export default function BookingCalendar({
  locale,
  selectedDate: _selectedDate,
  onDateSelect: _onDateSelect,
}: BookingCalendarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header del calendario */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {locale === 'es' ? 'Selecciona una fecha' : 'Select a date'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
          {locale === 'es'
            ? 'Elige el día que mejor se adapte a tu horario'
            : 'Choose the day that best fits your schedule'}
        </p>
      </div>

      {/* Calendario - Removido, esperando instrucciones */}
      <div className="flex items-center justify-center flex-1 min-h-[400px]">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Calendario removido - Esperando instrucciones
          </p>
        </div>
      </div>
    </div>
  );
}
