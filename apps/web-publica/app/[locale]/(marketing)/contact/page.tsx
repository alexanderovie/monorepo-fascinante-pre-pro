import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import ContactSection from '../../components/ContactSection';
import { defaultFooterData } from '../../lib/footer-data';
import { getTranslations } from 'next-intl/server';

/**
 * Contact Page - Página de contacto con Hero y formulario
 */
export default async function ContactPage() {
  const t = await getTranslations('hero.contact');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero
          badge={t('badge')}
          title={t('title')}
          description={t('description')}
          tabs={[]}
          showBackground={false}
          primaryButton={null}
          secondaryButton={null}
        />
        <ContactSection />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
