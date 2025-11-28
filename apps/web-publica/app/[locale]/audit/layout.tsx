import HeaderAudit from '../components/HeaderAudit';
import Footer from '../components/Footer';
import { auditFooterData } from '../lib/audit-footer-data';

const baseUrl = 'https://fascinantedigital.com';
const auditUrl = `${baseUrl}/audit`;

/**
 * Layout específico para la página de Audit
 *
 * Según Next.js App Router best practices:
 * - Layouts anidados sobrescriben el layout padre para rutas específicas
 * - Este layout NO incluye Banner2 (solo para páginas de marketing)
 * - Header y Footer pueden ser diferentes para audit
 *
 * Estructura:
 * - Header (puede ser diferente al estándar)
 * - Main content (children)
 * - Footer (puede ser diferente al estándar)
 */
export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Schema.org Structured Data - Service (Free Visibility Audit - Specific) */}
      {/* Note: JSON-LD can be placed in body, Google will read it */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Free Google Visibility Audit',
            serviceType: 'Free Visibility Audit',
            url: auditUrl,
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
            offers: {
              '@type': 'Offer',
              url: auditUrl,
              priceCurrency: 'USD',
              price: '0',
              description:
                'Free audit to analyze your Google Business visibility and readiness for ads. Discover how your business appears on Google and what is missing.',
            },
            brand: {
              '@type': 'Brand',
              name: 'Fascinante Digital',
            },
            description:
              'Get a free Google Business Profile visibility audit. Discover how your business appears on Google, identify missing information, and understand your readiness to attract real customers without paid ads.',
          }),
        }}
      />
      <div className="flex flex-col min-h-screen">
        <HeaderAudit />
        <main className="flex-1">
          {children}
        </main>
        <Footer data={auditFooterData} />
      </div>
    </>
  );
}
