import Link from 'next/link'

/**
 * Página de error para códigos de autenticación inválidos
 *
 * Se muestra cuando el intercambio del código OAuth falla o el código es inválido.
 */
export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-md w-full px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Error de autenticación
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mb-6">
            No se pudo completar el proceso de autenticación. Por favor, intenta nuevamente.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-x-2 py-2 px-4 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

