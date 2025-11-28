/**
 * Book Appointment Page - Fascinante Digital
 *
 * Página pública para que los clientes reserven citas de consultoría/auditoría.
 * Server Component con diseño élite pro: Sección centrada vertical y horizontalmente en toda la pantalla.
 */

import { notFound } from 'next/navigation';
import { routing } from '../../../i18n/routing';
import BookingContainer from './components/BookingContainer';

interface BookPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Página pública de reserva de citas
 * Diseño centrado vertical y horizontalmente - Marco con 3 columnas
 */
export default async function BookPage({ params }: BookPageProps) {
  const { locale } = await params;

  // Validar locale
  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Marco centrado estilo Cal.com - Diseño élite pro con 3 columnas */}
      <div className="w-full max-w-7xl mx-auto">
        <BookingContainer locale={locale} />
      </div>
    </div>
  );
}
