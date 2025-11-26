'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

/**
 * ErrorContent Component
 *
 * Client Component que lee searchParams.
 * Requiere Suspense boundary en Next.js 15.5.6+
 */
export default function ErrorContent() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('code')
  const errorMessage = searchParams.get('message') || 'No se pudo completar el proceso de autenticación. Por favor, intenta nuevamente.'

  return (
    <div className="text-center">
      <div className="mb-4">
        <svg
          className="mx-auto size-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
        Error de autenticación
      </h1>

      <p className="text-gray-600 dark:text-neutral-400 mb-6">
        {errorMessage}
      </p>

      {errorCode && (
        <p className="text-xs text-gray-500 dark:text-neutral-500 mb-4">
          Código de error: <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">{errorCode}</code>
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-x-2 py-2 px-4 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          Volver al inicio de sesión
        </Link>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-x-2 py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-gray-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  )
}
