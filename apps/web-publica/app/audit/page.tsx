import Header from '../components/Header';
import Footer from '../components/Footer';
import { defaultFooterData } from '../lib/footer-data';

/**
 * Audit Page - Sin contenido por ahora
 * Página básica con Header y Footer
 */
export default function AuditPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Contenido pendiente */}
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}

