import Header from '../components/Header';
import Footer from '../components/Footer';
import { defaultFooterData } from '../lib/footer-data';

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
