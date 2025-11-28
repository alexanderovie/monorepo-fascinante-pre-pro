import { Banner2 } from '../../../components/banner2';

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
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Banner2
        title="Version 2.0 is now available!"
        description="Check out all the new features"
        linkText="here"
        linkUrl="/features"
      />
      {children}
    </>
  );
}
