import { Suspense } from 'react'
import ErrorContent from './ErrorContent'

/**
 * Página de error para códigos de autenticación inválidos
 *
 * Se muestra cuando el intercambio del código OAuth falla o el código es inválido.
 *
 * Best Practices Elite Pro (Next.js 15.5.6):
 * - Server Component por defecto (mejor performance)
 * - Suspense boundary para useSearchParams (requerido en Next.js 15)
 * - Muestra mensajes de error específicos desde query params
 * - Códigos de error para tracking
 * - UI amigable con opciones de recuperación
 */
export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-md w-full px-4">
        <Suspense fallback={<ErrorFallback />}>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  )
}

/**
 * Fallback mientras se cargan los searchParams
 */
function ErrorFallback() {
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
        Cargando información del error...
      </p>
    </div>
  )
}
