import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { defaultFooterData } from './lib/footer-data';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-9xl font-bold text-gray-800 dark:text-white">
            404
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-neutral-400">
            Página no encontrada
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-500">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-blue-700 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
