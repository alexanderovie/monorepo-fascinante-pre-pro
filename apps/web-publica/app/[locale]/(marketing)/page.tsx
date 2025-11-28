import Header from '../components/Header';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import ProductsCarousel from '../components/ProductsCarousel';
import Features from '../components/Features';
import FeaturesAccordion from '../components/FeaturesAccordion';
import CaseStudy from '../components/CaseStudy';
import Clients from '../components/Clients';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { defaultStatsData } from '../lib/stats-data';
import { defaultProductsData } from '../lib/products-data';
import { defaultFeaturesData } from '../lib/features-data';
import { defaultCaseStudyData } from '../lib/case-study-data';
import { defaultFAQData } from '../lib/faq-data';
import { defaultFooterData } from '../lib/footer-data';
import { defaultHeroDownloadData } from '../lib/hero-download-data';
import { URLS } from '../../../lib/constants';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('hero');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero
          badge={t('badge')}
          title={
            <>
              {t('title')}
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              {t('titleOn')}
            </>
          }
          description={t('description')}
          primaryButton={{
            label: t('primaryButton'),
            href: URLS.tryItFree,
          }}
          secondaryButton={{
            label: t('secondaryButton'),
            href: URLS.getDemo,
          }}
          downloadSection={defaultHeroDownloadData}
        />
        <Stats items={defaultStatsData} />
        <ProductsCarousel title="Products" items={defaultProductsData} />
        <Features
          badge="Lo que hacemos"
          title="Hacemos que tu negocio aparezca en Google"
          description="Usamos datos reales de Google Business Profile para mostrarte exactamente cómo te ven tus clientes. Sin jerga técnica, sin promesas vacías — solo resultados que puedes medir."
          items={defaultFeaturesData}
        />
        <FeaturesAccordion />
        <CaseStudy items={defaultCaseStudyData} />
        <Clients />
        <FAQ
          title="Tus preguntas, respondidas"
          description="Respuestas claras a las preguntas más frecuentes sobre visibilidad en Google."
          items={defaultFAQData}
        />
        <CTA
          badge="Comienza ahora"
          title={
            <>
              Automatiza tu visibilidad y
              <br />
              atrae clientes reales
            </>
          }
          primaryButton={{
            label: 'Pruébalo gratis',
            href: URLS.tryItFree,
          }}
          secondaryButton={{
            label: 'Solicita una demo',
            href: URLS.getDemo,
          }}
        />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
