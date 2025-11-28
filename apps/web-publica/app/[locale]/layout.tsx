import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import "./globals.css";
import PrelineScriptWrapper from "./components/PrelineScriptWrapper";
import CrispChat from "@/components/crisp/CrispChat";

const baseUrl = "https://fascinantedigital.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Validar locale
  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound();
  }

  // Cargar mensajes para metadata
  const messages = await getMessages({ locale });

  const localeMap: Record<string, string> = {
    en: 'en_US',
    es: 'es_ES',
  };

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: messages.metadata?.title as string || "Fascinante Digital – Free Google Visibility Audit & SEO",
      template: messages.metadata?.titleTemplate as string || "%s | Fascinante Digital",
    },
    description: messages.metadata?.description as string || "Get a free audit and discover how your business appears on Google.",
    keywords: messages.metadata?.keywords as string[] || [],
    authors: [{ name: "Fascinante Digital Team" }],
    creator: "Fascinante Digital Team",
    publisher: "Fascinante Digital LLC",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
      },
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale] || 'en_US',
      url: baseUrl,
      siteName: "Fascinante Digital",
      title: messages.metadata?.title as string || "Fascinante Digital – Free Google Visibility Audit",
      description: messages.metadata?.description as string || "Discover how your business appears on Google.",
      images: [
        {
          url: `${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`,
          width: 1200,
          height: 630,
          alt: "Fascinante Digital dashboard showing Google visibility metrics",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.metadata?.title as string || "Fascinante Digital – Google Visibility Audit",
      description: messages.metadata?.description as string || "Make your business visible on Google.",
      images: [`${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`],
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon0.svg', type: 'image/svg+xml' },
        { url: '/icon1.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      title: 'Fascinante',
      statusBarStyle: 'default',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#2563EB',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validar locale
  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound();
  }

  // Cargar mensajes para el cliente
  const messages = await getMessages({ locale });

  // Mapeo de locale a lang attribute
  const langMap: Record<string, string> = {
    en: 'en',
    es: 'es',
  };

  return (
    <html lang={langMap[locale] || 'en'}>
      <head>
        {/* Resource Hints: Optimiza carga de app.fascinantedigital.com */}
        <link rel="dns-prefetch" href="https://app.fascinantedigital.com" />
        <link rel="preconnect" href="https://app.fascinantedigital.com" crossOrigin="anonymous" />

        {/* Resource Hints: Optimiza carga de Crisp Chat */}
        <link rel="dns-prefetch" href="https://client.crisp.chat" />
        <link rel="preconnect" href="https://client.crisp.chat" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://storage.crisp.chat" />
        <link rel="preconnect" href="https://storage.crisp.chat" crossOrigin="anonymous" />

        {/* Schema.org Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Fascinante Digital',
              url: baseUrl,
              logo: `${baseUrl}/assets/logo-fascinante.svg`,
              image: `${baseUrl}/assets/logo-fascinante.svg`,
              email: 'info@fascinantedigital.com',
              telephone: '+1-800-886-4981',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '2054 Vista Pkwy #400',
                addressLocality: 'West Palm Beach',
                addressRegion: 'FL',
                postalCode: '33411',
                addressCountry: 'US',
              },
              sameAs: [
                'https://www.instagram.com/fascinantedigital',
                'https://www.facebook.com/fascinantedigital',
                'https://www.linkedin.com/company/fascinantedigital',
              ],
              description:
                'Fascinante Digital helps small businesses appear on Google through automated visibility audits, local SEO, and digital growth tools.',
              foundingDate: '2024',
            }),
          }}
        />

        {/* Schema.org Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: baseUrl,
              name: 'Fascinante Digital',
              description:
                'Get a free audit and discover how your business appears on Google. Improve your visibility and attract real customers automatically.',
            }),
          }}
        />

        {/* Schema.org Structured Data - ProfessionalService (LocalBusiness) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Fascinante Digital',
              image: {
                '@type': 'ImageObject',
                url: `${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`,
                width: 1200,
                height: 630,
              },
              url: baseUrl,
              telephone: '+1-800-886-4981',
              priceRange: '$$',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '2054 Vista Pkwy #400',
                addressLocality: 'West Palm Beach',
                addressRegion: 'FL',
                postalCode: '33411',
                addressCountry: 'US',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 26.7153,
                longitude: -80.1200,
              },
              openingHours: 'Mo-Fr 09:00-18:00',
              sameAs: [
                'https://www.instagram.com/fascinantedigital',
                'https://www.facebook.com/fascinantedigital',
                'https://www.linkedin.com/company/fascinantedigital',
              ],
              description:
                'Fascinante Digital provides automated visibility audits, local SEO, and digital marketing services for small businesses.',
            }),
          }}
        />

        {/* Schema.org Structured Data - Service (Consolidated Services for Homepage) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              serviceType: [
                'Free Visibility Audit',
                'Local SEO Optimization',
                'Reputation Management',
                'Digital Automation',
              ],
              provider: {
                '@type': 'ProfessionalService',
                name: 'Fascinante Digital',
                image: {
                  '@type': 'ImageObject',
                  url: `${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`,
                  width: 1200,
                  height: 630,
                },
                url: baseUrl,
                telephone: '+1-800-886-4981',
                priceRange: '$$',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '2054 Vista Pkwy #400',
                  addressLocality: 'West Palm Beach',
                  addressRegion: 'FL',
                  postalCode: '33411',
                  addressCountry: 'US',
                },
              },
              areaServed: {
                '@type': 'Place',
                name: 'United States',
              },
              offers: [
                {
                  '@type': 'Offer',
                  url: `${baseUrl}/audit`,
                  priceCurrency: 'USD',
                  price: '0',
                  description:
                    'Free audit to analyze your Google Business visibility and readiness for ads.',
                },
                {
                  '@type': 'Offer',
                  url: baseUrl,
                  priceCurrency: 'USD',
                  price: '99',
                  description:
                    'Local SEO optimization and visibility growth for small businesses.',
                },
              ],
              brand: {
                '@type': 'Brand',
                name: 'Fascinante Digital',
              },
              description:
                'Fascinante Digital provides automated visibility audits, local SEO, reputation management, and digital automation services for small businesses across the US.',
            }),
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <PrelineScriptWrapper />
        <CrispChat
          locale={locale}
          position="right"
          colorTheme="blue"
          hideOnMobile={false}
        />
      </body>
    </html>
  );
}
