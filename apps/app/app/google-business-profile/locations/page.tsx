/**
 * Google Business Profile - Locations Page
 *
 * Página de ubicaciones de Google Business Profile.
 * Muestra todas las ubicaciones de negocio con búsqueda, filtros y gestión completa.
 *
 * Esta página está protegida por autenticación. Solo usuarios autenticados pueden acceder.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Footer from '../../components/layout/Footer'
import ActivityOffcanvas from '../../components/layout/ActivityOffcanvas'
import SearchModal from '../../components/layout/SearchModal'

/**
 * Página protegida de Locations.
 * Verifica que el usuario esté autenticado antes de mostrar el contenido.
 *
 * IMPORTANTE: Siempre usa `getUser()` en el servidor, nunca `getSession()`,
 * ya que `getUser()` valida el token con el servidor de Auth.
 */
export default async function LocationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Nota: El middleware ya protege esta ruta y redirige a /login si no hay usuario.
  // Esta verificación es una capa adicional de seguridad (defense in depth).
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 relative">
      <Header user={user} />
      <Sidebar user={user} />

      {/* Main Content */}
      <main id="content" className="pt-15 pb-10 sm:pb-16">
        {/* Breadcrumb */}
        <ol className="lg:hidden pt-3 md:pt-5 sm:pb-2 md:pb-0 px-2 sm:px-5 flex items-center whitespace-nowrap">
          <li className="flex items-center text-sm text-gray-600 dark:text-neutral-500">
            Dashboard
            <svg
              className="shrink-0 overflow-visible size-4 ms-1.5 text-gray-400 dark:text-neutral-600"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
            </svg>
          </li>
          <li className="flex items-center text-sm text-gray-600 dark:text-neutral-500">
            Google Business Profile
            <svg
              className="shrink-0 overflow-visible size-4 ms-1.5 text-gray-400 dark:text-neutral-600"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
            </svg>
          </li>
          <li className="ps-1.5 flex items-center truncate font-semibold text-gray-800 dark:text-neutral-200 text-sm truncate">
            <span className="truncate">Locations</span>
          </li>
        </ol>
        {/* End Breadcrumb */}

        <div className="p-2 sm:p-5 sm:py-0 md:pt-5">
          {/* Header Section */}
          <div className="mb-5">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">Locations</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
              Manage and monitor all your business locations
            </p>
          </div>
          {/* End Header Section */}

          {/* Content Section - Pendiente de implementación */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Contenido de locations pendiente de implementación
              </p>
            </div>
          </div>
          {/* End Content Section */}
        </div>
      </main>
      {/* End Main Content */}

      <Footer />

      {/* Activity Offcanvas */}
      <ActivityOffcanvas />

      {/* Search Modal */}
      <SearchModal />
    </div>
  )
}
