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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
      {/* Layout tipo Cal.com: 3 paneles horizontales - Centrado verticalmente */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <BookingForm locale={locale} />
      </div>
    </div>
  );
}
