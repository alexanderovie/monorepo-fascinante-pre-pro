/**
 * Página de confirmación de email
 * 
 * Se muestra después de que el usuario se registra,
 * indicándole que debe verificar su email.
 */
export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verifica tu email
        </h2>
        <p className="text-gray-600 dark:text-neutral-400">
          Hemos enviado un enlace de confirmación a tu dirección de email.
          Por favor, revisa tu bandeja de entrada y haz clic en el enlace para
          activar tu cuenta.
        </p>
      </div>
    </div>
  )
}

