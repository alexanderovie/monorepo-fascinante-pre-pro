import { Banner2 } from '../../../components/banner2';
import { getTranslations } from 'next-intl/server';

/**
 * Layout compartido para páginas de marketing
 *
 * Según Next.js App Router best practices (Route Groups):
 * - Las carpetas entre paréntesis NO afectan la URL
 * - Este layout se aplica a todas las páginas dentro de (marketing)
 * - Incluye Banner2 que NO estará en /audit
 *
 * Estructura:
 * - Banner2 (topbar con gradiente)
 * - Children (contenido de cada página que incluye Header y Footer)
 */
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('banner');

  return (
    <>
      <Banner2
        title={t('version2Title')}
        description={t('version2Description')}
        linkText={t('viewFeatures')}
        linkUrl="/features"
      />
      {children}
    </>
  );
}
