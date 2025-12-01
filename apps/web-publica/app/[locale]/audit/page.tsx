import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AuditFormSection from '../components/AuditFormSection';
import Hero from '../components/Hero';
import { resolveHeroPreset, resolveToHeroProps, HeroPresetError } from '../lib/hero-presets';
import { notFound } from 'next/navigation';
import { getAlternatesUrls } from '../../../lib/seo/metadata-helpers';

const baseUrl = 'https://fascinantedigital.com';

/**
 * Generate metadata dinámica para la página de auditoría
 * Basado en Next.js 15 generateMetadata (Nov 2025)
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'audit' });

  const localeMap: Record<string, string> = {
    en: 'en_US',
    es: 'es_ES',
  };

  const title = t('title');
  const description = t('description');
  const alternates = getAlternatesUrls('/audit', locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'website',
      locale: localeMap[locale] || 'en_US',
      url: alternates.canonical,
      siteName: 'Fascinante Digital',
      title,
      description,
      images: [
        {
          url: `${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`,
          width: 1200,
          height: 630,
          alt: 'Fascinante Digital - Free Google Visibility Audit',
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

/**
 * Audit Page - Página de auditoría gratuita
 * Hero + Formulario para solicitar auditoría de visibilidad en Google
 *
 * Layout igual que Contact Page: Hero (sin background, sin botones) + FormSection
 *
 * Manejo robusto de errores según mejores prácticas Next.js 15:
 * - Try-catch para errores de preset
 * - notFound() para errores de configuración
 */
export default async function AuditPage() {
  try {
    const heroData = await resolveHeroPreset('audit');
    const heroProps = resolveToHeroProps(heroData);

    return (
      <>
        <Hero {...heroProps} />
        <AuditFormSection />
      </>
    );
  } catch (error) {
    // Log error en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('Error resolving hero preset for audit page:', error);
    }

    // Si es un error de preset (configuración), mostrar 404
    if (error instanceof HeroPresetError) {
      notFound();
    }

    // Re-lanzar otros errores para que Next.js los maneje
    throw error;
  }
}
