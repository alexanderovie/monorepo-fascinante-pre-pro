'use client';

/**
 * BookingContainer Component
 *
 * Client Component que contiene el estado y las 3 columnas del booking.
 * Maneja la selección de fecha y hora.
 */

import { useState, useEffect, useRef } from 'react';
import BookingCalendar from './BookingCalendar';
import { BookingInfo } from './BookingInfo';
import { BookingTimeSlots } from './BookingTimeSlots';
import BookingConfirmationDialog from './BookingConfirmationDialog';

interface BookingContainerProps {
  locale: string;
}

export default function BookingContainer({ locale }: BookingContainerProps) {
  // Ref para el contenedor de horarios (para hacer scroll automático)
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  // Seleccionar día actual por defecto
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    getToday()
  );

  // Asegurar que el día actual esté seleccionado al montar
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(getToday());
    }
  }, [selectedDate]);

  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Resetear horario cuando cambia la fecha
    setSelectedTime(undefined);
    setIsDialogOpen(false);

    // Hacer scroll automático a los horarios cuando se selecciona un día
    if (date && timeSlotsRef.current) {
      // Pequeño delay para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        timeSlotsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  };

  const handleTimeSelect = (time: string, _date: Date) => {
    setSelectedTime(time);
    // Abrir dialog de confirmación
    setIsDialogOpen(true);
  };

  const handleConfirmBooking = async (data: {
    name: string;
    email: string;
    notes?: string;
  }) => {
    // TODO: Implementar llamada a API real
    // Aquí iría la llamada a la API:
    // const response = await fetch('/api/bookings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ date: selectedDate, time: selectedTime, ...data }),
    // });
    // if (!response.ok) throw new Error('Failed to confirm booking');
    void { date: selectedDate, time: selectedTime, ...data }; // Placeholder
  };

  return (
    <div className="flex flex-col lg:flex-col xl:flex-col 2xl:flex-row bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden w-full max-w-[590.63px] mx-auto lg:max-w-[958.67px] xl:max-w-[960px] xl:mx-auto 2xl:max-w-none 2xl:mx-0 lg:items-stretch 2xl:items-stretch">
      {/* COLUMNA 1: Información del servicio (izquierda) - Se adapta a la altura del calendario */}
      <div className="w-full lg:w-full xl:w-full 2xl:w-80 xl:w-96 flex-shrink-0 p-3 lg:pt-6 lg:px-6 lg:pb-6 border-b lg:border-b xl:border-b 2xl:border-b-0 lg:border-r-0 xl:border-r-0 2xl:border-r border-gray-200 dark:border-neutral-700 flex flex-col 2xl:max-h-[590.63px]">
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

      {/* Contenedor para columnas 2 y 3 en lg y xl */}
      <div className="flex flex-col lg:flex-row xl:flex-row 2xl:contents">
        {/* COLUMNA 2: Calendario (centro) - Esta columna determina la altura */}
        <div className="flex-1 min-w-0 lg:h-[590.63px] xl:h-[590.63px] 2xl:h-auto p-3 lg:pt-6 lg:px-6 lg:pb-6 border-b lg:border-b-0 xl:border-b-0 lg:border-r xl:border-r 2xl:border-b-0 2xl:border-r border-gray-200 dark:border-neutral-700 flex items-start justify-center">
          <BookingCalendar
            locale={locale}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>

        {/* COLUMNA 3: Horarios (derecha) - Se adapta a la altura del calendario */}
        <div
          ref={timeSlotsRef}
          className="w-full lg:w-96 xl:w-96 lg:h-[590.63px] xl:h-[590.63px] 2xl:h-auto flex-shrink-0 p-3 lg:pt-6 lg:px-6 lg:pb-6 border-b lg:border-b-0 xl:border-b-0 2xl:border-b-0 border-gray-200 dark:border-neutral-700 flex flex-col 2xl:max-h-[590.63px]"
        >
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

      {/* Dialog de confirmación */}
      {selectedDate && selectedTime && (
        <BookingConfirmationDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          duration={30}
          locale={locale}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
