import Link from 'next/link'
import Image from 'next/image'
import { login } from './actions'
import LoginForm from './LoginForm'
import AuthenticationChartsImage from './AuthenticationChartsImage'

/**
 * Página de Login
 *
 * Diseño basado en el template Preline Pro con:
 * - Sidebar con branding
 * - Botones OAuth (Google, Apple)
 * - Formulario de email/password
 * - Integración con Supabase Auth
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-full">
      {/* Sidebar */}
      <div className="hidden min-h-screen lg:w-100 xl:w-107.5 bg-gray-100 lg:flex flex-col justify-between p-6 dark:bg-neutral-950">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          {/* Logo */}
          <Link
            className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
            href="/"
            aria-label="Fascinante Digital"
          >
            <Image
              className="w-28 dark:invert"
              src="/assets/logo-fascinante.svg"
              alt="Fascinante Digital Logo"
              width={112}
              height={24}
              priority
            />
          </Link>
          {/* End Logo */}
        </div>
        {/* End Header */}

        {/* Body */}
        <div>
          <span className="text-2xl font-medium text-gray-800 dark:text-white">
            La forma más simple de gestionar tu negocio digital
          </span>

          {/* Authentication Charts Image */}
          <AuthenticationChartsImage />
        </div>
        {/* End Body */}

        {/* Footer */}
        <div className="flex justify-center gap-x-8">
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            © 2025 Fascinante Digital
          </span>
        </div>
        {/* End Footer */}
      </div>
      {/* End Sidebar */}

      {/* Content */}
      <div className="grow px-5">
        <div className="h-full min-h-screen sm:w-112 flex flex-col justify-center mx-auto space-y-5">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
              Inicia sesión en tu cuenta
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
              Construye productos digitales con Fascinante Digital.
            </p>
          </div>
          {/* End Title */}

          {/* Login Form Component */}
          <LoginForm loginAction={login} />
        </div>
      </div>
      {/* End Content */}
    </main>
  )
}
