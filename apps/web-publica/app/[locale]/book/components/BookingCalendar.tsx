/**
 * BookingCalendar Component
 *
 * Wrapper del componente Calendar reutilizable, configurado específicamente
 * para el contexto de booking con validaciones y configuraciones específicas.
 */

'use client';

import { Calendar } from '@/components/calendar';
import type { CalendarLocale } from '@/lib/calendar';

interface BookingCalendarProps {
  locale: string;
  selectedDate?: Date | undefined;
  onDateSelect?: (date: Date | undefined) => void;
}

/**
 * Componente de calendario para booking
 *
 * Configurado con:
 * - Variante Cal.com (estilo exacto)
 * - Semana empieza en domingo
 * - Formato largo de días de semana
 * - Validaciones de booking (si se implementan)
 */
export default function BookingCalendar({
  locale,
  selectedDate,
  onDateSelect,
}: BookingCalendarProps) {
  const calendarLocale: CalendarLocale = locale === 'es' ? 'es' : 'en';

  // Obtener fecha de hoy sin hora (medianoche)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Deshabilitar fechas pasadas (comportamiento estándar de la industria)
  const isDateDisabled = (date: Date): boolean => {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly < today;
  };

  return (
    <Calendar
      locale={calendarLocale}
      variant="cal-com"
      weekdayFormat="long"
      weekStart="sunday"
      selectedDate={selectedDate}
      onDateSelect={(date: Date) => onDateSelect?.(date)}
      dateRange={{ min: today }}
      isDateDisabled={isDateDisabled}
    />
  );
}
