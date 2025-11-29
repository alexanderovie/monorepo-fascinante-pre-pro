import { Link } from '../../../../../i18n/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { defaultFooterData } from '../../../lib/footer-data';

/**
 * Blog Post Not Found Page
 * Actualizado: Noviembre 2025
 * 404 personalizado para artículos no encontrados
 */

export default function BlogPostNotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Artículo no encontrado
            </h2>
            <p className="mt-2 text-gray-600 dark:text-neutral-400">
              El artículo que buscas no existe o fue eliminado.
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700"
            >
              Volver al blog
            </Link>
          </div>
        </div>
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
