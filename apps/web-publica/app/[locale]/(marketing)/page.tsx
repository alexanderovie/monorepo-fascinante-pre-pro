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
          badge="What we do"
          title="Helping small businesses grow their visibility online"
          description="At Fascinante Digital, we believe every local business deserves to be seen. We combine technology, automation, and strategy to make you visible on Google — no marketing knowledge required."
          items={defaultFeaturesData}
        />
        <FeaturesAccordion />
        <CaseStudy items={defaultCaseStudyData} />
        <Clients />
        <FAQ
          title="Your questions, answered"
          description="Answers to the most frequently asked questions."
          items={defaultFAQData}
        />
        <CTA
          badge="Get started"
          title={
            <>
              Automate your visibility and
              <br />
              attract real customers
            </>
          }
          primaryButton={{
            label: 'Try it free',
            href: URLS.tryItFree,
          }}
          secondaryButton={{
            label: 'Get a demo',
            href: URLS.getDemo,
          }}
        />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
