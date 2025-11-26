import { login, signup } from './actions'

/**
 * Página de Login/Signup
 *
 * Permite a los usuarios iniciar sesión o registrarse usando
 * email y contraseña. Utiliza Server Actions para manejar
 * la autenticación de forma segura en el servidor.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-neutral-400">
            O{' '}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              crea una cuenta nueva
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              formAction={login}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button>
          </div>

          <div>
            <button
              type="submit"
              formAction={signup}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
