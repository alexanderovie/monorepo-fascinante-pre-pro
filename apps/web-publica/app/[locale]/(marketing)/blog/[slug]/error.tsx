'use client';

import { useEffect } from 'react';
import { Link } from '../../../../../i18n/navigation';

/**
 * Blog Post Error Boundary
 * Actualizado: Noviembre 2025
 * Maneja errores de renderizado en artículos de blog
 */

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log a servicio de errores (Sentry, LogRocket, etc.)
    console.error('Blog post error:', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Algo salió mal
          </h2>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">
            No pudimos cargar el artículo. Por favor, intenta de nuevo.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700"
            >
              Intentar de nuevo
            </button>
            <Link
              href="/blog"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200"
            >
              Volver al blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
