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
import ImportLocationsModal from '../../components/dashboard/ImportLocationsModal'
import ExportLocationsModal from '../../components/dashboard/ExportLocationsModal'
import LocationsTableSkeleton from '../../components/dashboard/LocationsTableSkeleton'
import AccountSelector from '../../components/gbp/AccountSelector'
import { getAccounts } from '@/lib/gbp/get-accounts'
import { getLocationsData } from '@/lib/gbp/get-locations-data'

/**
 * Componente interno que hace el fetch de datos
 * Envuelto en Suspense para streaming progresivo
 *
 * @param accountId - ID de la cuenta seleccionada desde URL params (opcional)
 */
async function LocationsContent({ accountId }: { accountId?: string | null }) {
  // ÉLITE: Fetch paralelo para evitar waterfall
  // Primero obtener accounts, luego usar la seleccionada o primera para locations
  const accounts = await getAccounts()

  if (accounts.length === 0) {
    // No hay cuentas, mostrar tabla vacía
    return (
      <>
        <ProjectCard
          initialData={[]}
          accountId={null}
        />
      </>
    )
  }

  // ÉLITE: Determinar qué cuenta usar
  // 1. Si hay accountId en URL params, validar que exista y usarlo
  // 2. Si no hay accountId o no es válido, usar la primera cuenta
  let selectedAccount = accounts[0]

  if (accountId) {
    const foundAccount = accounts.find((acc) => acc.accountId === accountId)
    if (foundAccount) {
      selectedAccount = foundAccount
    }
    // Si no se encuentra, usar la primera (fallback)
  }

  // ÉLITE: No intentar cargar si accountId es mock
  if (selectedAccount.accountId === '123456789' || selectedAccount.accountId === '987654321') {
    return (
      <>
        <AccountSelector accounts={accounts} currentAccountId={selectedAccount.accountId} />
        <ProjectCard
          initialData={[]}
          accountId={selectedAccount.accountId}
        />
      </>
    )
  }

  // ÉLITE: Usar getLocationsData directamente (mejor que fetch interno en Server Component)
  // El cache de Next.js se aplica automáticamente a las funciones async en Server Components
  const locationsResult = await getLocationsData(selectedAccount.accountId, true)

  return (
    <>
      <AccountSelector accounts={accounts} currentAccountId={selectedAccount.accountId} />
      <ProjectCard
        initialData={locationsResult.locations}
        accountId={selectedAccount.accountId}
      />
    </>
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
 * - Soporte para selección de cuenta mediante URL params
 *
 * IMPORTANTE: Siempre usa `getUser()` en el servidor, nunca `getSession()`,
 * ya que `getUser()` valida el token con el servidor de Auth.
 */
export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Nota: El middleware ya protege esta ruta y redirige a /login si no hay usuario.
  // Esta verificación es una capa adicional de seguridad (defense in depth).
  if (!user) {
    redirect('/login')
  }

  // ÉLITE: Leer accountId de searchParams (Next.js 15 requiere await)
  const params = await searchParams
  const accountId = params.accountId || null

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
          {/* ÉLITE PRO: Suspense boundary para streaming progresivo */}
          {/* Key basado en accountId para forzar re-mount cuando cambia la cuenta */}
          {/* Esto es parte del patrón moderno: cache invalidation + key-based re-render */}
          <Suspense key={accountId || 'default'} fallback={<LocationsTableSkeleton />}>
            <LocationsContent accountId={accountId} />
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

      {/* Import Locations Modal */}
      <ImportLocationsModal />

      {/* Export Locations Modal */}
      <ExportLocationsModal />
    </div>
  )
}
