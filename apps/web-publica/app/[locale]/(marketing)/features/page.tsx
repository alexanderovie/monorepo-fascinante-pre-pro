import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '../../components/Header';
import FeaturesHero from '../../components/FeaturesHero';
import IconSection from '../../components/IconSection';
import FeaturesGrid from '../../components/FeaturesGrid';
import Testimonial from '../../components/Testimonial';
import DownloadApps from '../../components/DownloadApps';
import CTA from '../../components/CTA';
import Footer from '../../components/Footer';
import { defaultIconSectionData } from '../../lib/icon-section-data';
import { defaultFeaturesGridData } from '../../lib/features-grid-data';
import { defaultTestimonialData } from '../../lib/testimonial-data';
import { defaultDownloadAppsData } from '../../lib/download-apps-data';
import { defaultFooterData } from '../../lib/footer-data';
import { defaultFloatingCards } from '../../lib/features-hero-cards-data';
import { URLS } from '../../../../lib/constants';
import { getAlternatesUrls } from '../../../../lib/seo/metadata-helpers';

const baseUrl = 'https://fascinantedigital.com';

/**
 * Generate metadata dinámica para la página de características
 * Basado en Next.js 15 generateMetadata (Diciembre 2025)
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const localeMap: Record<string, string> = {
    en: 'en_US',
    es: 'es_ES',
  };

  const title = t('title') + ' – Features';
  const description = 'Discover all the features and capabilities of Fascinante Digital. Learn how we help businesses improve their Google visibility and attract real customers.';

  return {
    title,
    description,
    alternates: getAlternatesUrls('/features', locale),
    openGraph: {
      type: 'website',
      locale: localeMap[locale] || 'en_US',
      url: getAlternatesUrls('/features', locale).canonical,
      siteName: 'Fascinante Digital',
      title,
      description,
      images: [
        {
          url: `${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`,
          width: 1200,
          height: 630,
          alt: 'Fascinante Digital - Features',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`],
    },
  };
}

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <FeaturesHero
          badge="Preline Build"
          title="Do more with Preline in Web App"
          description="You can use Preline for much more than just Web App."
          cards={defaultFloatingCards}
        />
        <IconSection
          badge="From beginners to experts"
          title="Learn to develop sites with components and design systems"
          items={defaultIconSectionData}
        />
        <FeaturesGrid
          title="Build workflows incredibly fast"
          description="Whether you're a solo professional or part of a large team, Preline empowers you to automate your workflows effortlessly—no coding needed."
          items={defaultFeaturesGridData}
        />
        <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
          <Testimonial data={defaultTestimonialData} />
        </div>
        <DownloadApps
          badge="Preline Apps"
          title="Get the Preline App. Your essential business tool."
          items={defaultDownloadAppsData}
        />
        <CTA
          badge="Get started"
          title={
            <>
              The Web App powering
              <br />
              thousands of companies.
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
