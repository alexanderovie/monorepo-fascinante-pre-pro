import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactSection from '../../components/ContactSection';
import { defaultFooterData } from '../../lib/footer-data';

/**
 * Contact Page - Página de contacto (sin Hero, solo formulario)
 */
export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ContactSection />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
