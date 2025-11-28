'use client'

import { useActionState } from 'react'
import { useOAuth } from '@/lib/auth/use-oauth'
import type { login as loginAction } from './actions'

interface LoginFormProps {
  loginAction: typeof loginAction
}

/**
 * LoginForm Component
 *
 * Formulario de login con:
 * - Botones OAuth (Google, Apple) usando hook personalizado
 * - Formulario email/password
 * - Integración con Supabase Auth
 * - Loading states y error handling mejorados
 *
 * Best Practices Elite Pro:
 * - Uso de hook personalizado para OAuth (centralización de lógica)
 * - Loading states consistentes
 * - Error handling tipado
 * - Logging estructurado (via hook)
 * - CSRF protection (via hook)
 */
export default function LoginForm({ loginAction }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  // Hook personalizado para OAuth (centraliza toda la lógica)
  const { signIn: signInWithOAuth, isLoading: isOAuthLoading, error: oauthError } = useOAuth()

  // Handlers simplificados usando el hook
  const handleGoogleSignIn = () => signInWithOAuth('google')
  const handleAppleSignIn = () => signInWithOAuth('apple')

  // Loading state combinado (email/password o OAuth)
  const isLoading = isPending || isOAuthLoading

  return (
    <>
      {/* Button Group */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          id="google-signin"
          name="google-signin"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="py-2.5 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        >
          <svg
            className="shrink-0 size-4"
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_4132_5805)">
              <path
                d="M32.2566 16.36C32.2566 15.04 32.1567 14.08 31.9171 13.08H16.9166V19.02H25.7251C25.5454 20.5 24.5866 22.72 22.4494 24.22L22.4294 24.42L27.1633 28.1L27.4828 28.14C30.5189 25.34 32.2566 21.22 32.2566 16.36Z"
                fill="#4285F4"
              />
              <path
                d="M16.9166 32C21.231 32 24.8463 30.58 27.5028 28.12L22.4694 24.2C21.1111 25.14 19.3135 25.8 16.9366 25.8C12.7021 25.8 9.12677 23 7.84844 19.16L7.66867 19.18L2.71513 23L2.65521 23.18C5.2718 28.4 10.6648 32 16.9166 32Z"
                fill="#34A853"
              />
              <path
                d="M7.82845 19.16C7.48889 18.16 7.28915 17.1 7.28915 16C7.28915 14.9 7.48889 13.84 7.80848 12.84V12.62L2.81499 8.73999L2.6552 8.81999C1.55663 10.98 0.937439 13.42 0.937439 16C0.937439 18.58 1.55663 21.02 2.63522 23.18L7.82845 19.16Z"
                fill="#FBBC05"
              />
              <path
                d="M16.9166 6.18C19.9127 6.18 21.9501 7.48 23.0886 8.56L27.6027 4.16C24.8263 1.58 21.231 0 16.9166 0C10.6648 0 5.27181 3.6 2.63525 8.82L7.80851 12.84C9.10681 8.98 12.6821 6.18 16.9166 6.18Z"
                fill="#EB4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_4132_5805">
                <rect width="32" height="32" fill="white" transform="translate(0.937439)" />
              </clipPath>
            </defs>
          </svg>
          Iniciar sesión con Google
        </button>

        <button
          type="button"
          id="apple-signin"
          name="apple-signin"
          onClick={handleAppleSignIn}
          disabled={isLoading}
          className="py-2.5 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        >
          <svg
            className="shrink-0 size-4"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27.2192 10.9088C27.0336 11.0528 23.7568 12.8992 23.7568 17.0048C23.7568 21.7536 27.9264 23.4336 28.0512 23.4752C28.032 23.5776 27.3888 25.776 25.8528 28.016C24.4832 29.9872 23.0528 31.9552 20.8768 31.9552C18.7008 31.9552 18.1408 30.6912 15.6288 30.6912C13.1808 30.6912 12.3104 31.9968 10.32 31.9968C8.3296 31.9968 6.9408 30.1728 5.344 27.9328C3.4944 25.3024 2 21.216 2 17.3376C2 11.1168 6.0448 7.8176 10.0256 7.8176C12.1408 7.8176 13.904 9.2064 15.232 9.2064C16.496 9.2064 18.4672 7.7344 20.8736 7.7344C21.7856 7.7344 25.0624 7.8176 27.2192 10.9088ZM19.7312 5.1008C20.7264 3.92 21.4304 2.2816 21.4304 0.6432C21.4304 0.416 21.4112 0.1856 21.3696 0C19.7504 0.0608 17.824 1.0784 16.6624 2.4256C15.7504 3.4624 14.8992 5.1008 14.8992 6.7616C14.8992 7.0112 14.9408 7.2608 14.96 7.3408C15.0624 7.36 15.2288 7.3824 15.3952 7.3824C16.848 7.3824 18.6752 6.4096 19.7312 5.1008Z"
              className="fill-black dark:fill-neutral-200"
              fill="currentColor"
            />
          </svg>
          {isOAuthLoading ? 'Cargando...' : 'Iniciar sesión con Apple'}
        </button>
      </div>
      {/* End Button Group */}

      {/* OAuth Error Display */}
      {oauthError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          {oauthError}
        </div>
      )}

      <div className="flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-700 dark:after:border-neutral-700">
        O
      </div>

      {/* Email/Password Form */}
      <form action={formAction}>
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              disabled={isLoading}
              className="py-2 sm:py-2.5 px-3 block w-full border-gray-200 rounded-lg sm:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-white">
                Contraseña
              </label>
              <a
                className="inline-flex items-center gap-x-1.5 text-xs text-gray-600 hover:text-gray-700 decoration-2 hover:underline focus:outline-hidden focus:underline dark:text-neutral-500 dark:hover:text-neutral-600"
                href="#"
              >
                Olvidé mi contraseña
              </a>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                data-hs-toggle-password='{"target": "#password"}'
                className="py-2 sm:py-2.5 px-3 block w-full border-gray-200 rounded-lg sm:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                placeholder="********"
              />
              <button
                type="button"
                id="toggle-password"
                name="toggle-password"
                aria-label="Mostrar u ocultar contraseña"
                data-hs-toggle-password='{"target": "#password"}'
                className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
              >
                <svg
                  className="shrink-0 size-4"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    className="hs-password-active:hidden"
                    d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                  />
                  <path
                    className="hs-password-active:hidden"
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  />
                  <path
                    className="hs-password-active:hidden"
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                  />
                  <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22" />
                  <path
                    className="hidden hs-password-active:block"
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                  />
                  <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {state?.error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            id="login-submit"
            name="login-submit"
            disabled={isPending}
            className="py-2.5 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600"
          >
            {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </div>
      </form>

      <p className="text-sm text-gray-500 dark:text-neutral-500">
        ¿Nuevo en Fascinante Digital?{' '}
        <a
          className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium focus:outline-hidden focus:underline dark:text-blue-500"
          href="/signup"
        >
          Regístrate
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </a>
      </p>
    </>
  )
}
