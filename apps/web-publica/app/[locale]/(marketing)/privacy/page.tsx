import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { defaultFooterData } from '../../lib/footer-data';

/**
 * Privacy Page - Página de política de privacidad
 * Contenido pendiente
 */
export default function PrivacyPage() {
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

