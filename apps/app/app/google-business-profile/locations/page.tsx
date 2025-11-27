/**
 * Google Business Profile - Locations Page
 *
 * ÉLITE: Server Component con data fetching en servidor para carga instantánea.
 * Muestra todas las ubicaciones de negocio con búsqueda, filtros y gestión completa.
 *
 * Esta página está protegida por autenticación. Solo usuarios autenticados pueden acceder.
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Footer from '../../components/layout/Footer'
import ActivityOffcanvas from '../../components/layout/ActivityOffcanvas'
import SearchModal from '../../components/layout/SearchModal'
import ProjectCard from '../../components/dashboard/ProjectCard'
import AddProjectModal from '../../components/dashboard/AddProjectModal'
import LocationsTableSkeleton from '../../components/dashboard/LocationsTableSkeleton'
import { getAccounts } from '@/lib/gbp/get-accounts'
import { getLocationsDataCached } from '@/lib/gbp/get-locations-data'

/**
 * Componente interno que hace el fetch de datos
 * Envuelto en Suspense para streaming progresivo
 */
async function LocationsContent() {
  // ÉLITE: Fetch paralelo para evitar waterfall
  // Primero obtener accounts, luego usar la primera para locations
  const accounts = await getAccounts()

  if (accounts.length === 0) {
    // No hay cuentas, mostrar tabla vacía
    return (
      <ProjectCard
        initialData={[]}
        accountId={null}
      />
    )
  }

  const firstAccount = accounts[0]

  // ÉLITE: No intentar cargar si accountId es mock
  if (firstAccount.accountId === '123456789' || firstAccount.accountId === '987654321') {
    return (
      <ProjectCard
        initialData={[]}
        accountId={firstAccount.accountId}
      />
    )
  }

  // Obtener locations con cache
  const locationsResult = await getLocationsDataCached(firstAccount.accountId, true)

  return (
    <ProjectCard
      initialData={locationsResult.locations}
      accountId={firstAccount.accountId}
    />
  )
}

/**
 * Página protegida de Locations.
 * Verifica que el usuario esté autenticado antes de mostrar el contenido.
 *
 * ÉLITE: Server Component async con data fetching en servidor.
 * - Fetch paralelo (accounts + locations) para evitar waterfall
 * - Streaming con Suspense para carga progresiva
 * - Cache automático de Next.js (stale-while-revalidate)
 * - Sin loading visible en primer render
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
          {/* ÉLITE: Suspense boundary para streaming progresivo */}
          <Suspense fallback={<LocationsTableSkeleton />}>
            <LocationsContent />
          </Suspense>
        </div>
      </main>
      {/* End Main Content */}

      <Footer />

      {/* Activity Offcanvas */}
      <ActivityOffcanvas />

      {/* Search Modal */}
      <SearchModal />

      {/* Add Project Modal */}
      <AddProjectModal />
    </div>
  )
}
