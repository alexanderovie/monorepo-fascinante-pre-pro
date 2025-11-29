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

  return (
    <Calendar
      locale={calendarLocale}
      variant="cal-com"
      weekdayFormat="long"
      weekStart="sunday"
      selectedDate={selectedDate}
      onDateSelect={(date: Date) => onDateSelect?.(date)}
      // Validaciones adicionales pueden agregarse aquí:
      // dateRange={{ min: new Date(), max: ... }}
      // isDateDisabled={(date) => ... }
    />
  );
}
