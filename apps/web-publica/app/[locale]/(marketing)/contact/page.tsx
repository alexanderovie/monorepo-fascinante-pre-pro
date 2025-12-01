import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import ContactSection from '../../components/ContactSection';
import { defaultFooterData } from '../../lib/footer-data';
import { getTranslations } from 'next-intl/server';

/**
 * Contact Page - Página de contacto
 * Actualizado: Diciembre 2025
 * Hero con mismo layout que blog page
 */
type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale: _locale } = await params;
  const t = await getTranslations('hero.contact');

  // El locale está disponible para futuras expansiones (i18n, analytics, etc.)
  // Se usa el prefijo _ para indicar que es intencionalmente no usado actualmente
  // pero se mantiene para consistencia con otras páginas y preparación para futuras funcionalidades

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Mismo layout que blog page */}
        <Hero
          badge={t('badge')}
          title={t('title')}
          description={t('description')}
          primaryButton={null}
          secondaryButton={null}
          tabs={[]}
          showBackground={false}
        />

        {/* Contact Section */}
        <ContactSection />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
