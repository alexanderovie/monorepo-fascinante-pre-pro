/**
 * Book Appointment Page - Fascinante Digital
 *
 * Página pública para que los clientes reserven citas de consultoría/auditoría.
 * Server Component que renderiza el formulario de reserva.
 */

import { notFound } from 'next/navigation';
import { routing } from '../../../i18n/routing';
import BookingForm from '@/components/booking/BookingForm';

interface BookPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Página pública de reserva de citas
 */
export default async function BookPage({ params }: BookPageProps) {
  const { locale } = await params;

  // Validar locale
  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {locale === 'es' ? 'Reserva tu Consultoría' : 'Book Your Consultation'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            {locale === 'es'
              ? 'Selecciona una fecha y hora para tu sesión de consultoría o auditoría'
              : 'Select a date and time for your consultation or audit session'}
          </p>
        </div>

        <BookingForm locale={locale} />
      </div>
    </div>
  );
}
