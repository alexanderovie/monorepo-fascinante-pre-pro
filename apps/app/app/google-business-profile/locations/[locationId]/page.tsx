/**
 * Google Business Profile - Location Detail Page
 *
 * ÉLITE PRO: Página de detalle de ubicación según estándares de la industria.
 * Muestra información completa, métricas, y acciones de gestión.
 *
 * Características:
 * - Server Component con data fetching optimizado
 * - Navegación breadcrumb
 * - Información completa de la ubicación
 * - Acciones rápidas (editar, ver en Maps, etc.)
 * - Responsive y accesible
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import Header from '../../../components/layout/Header'
import Sidebar from '../../../components/layout/Sidebar'
import Footer from '../../../components/layout/Footer'
import ActivityOffcanvas from '../../../components/layout/ActivityOffcanvas'
import SearchModal from '../../../components/layout/SearchModal'
import { getLocationDetail } from '@/lib/gbp/get-location-detail'
import LocationDetailSkeleton from '../../../components/gbp/LocationDetailSkeleton'
import LocationDetailContent from '../../../components/gbp/LocationDetailContent'

/**
 * Componente interno que hace el fetch de datos
 * Envuelto en Suspense para streaming progresivo
 */
async function LocationDetailData({ locationId }: { locationId: string }) {
  const result = await getLocationDetail(locationId)

  if (result.error || !result.location) {
    return (
      <div className="p-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-900/50">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
            Error loading location
          </h3>
          <p className="text-red-600 dark:text-red-300">
            {result.error || 'Location not found'}
          </p>
          <Link
            href="/google-business-profile/locations"
            className="mt-4 inline-block text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            ← Back to Locations
          </Link>
        </div>
      </div>
    )
  }

  return <LocationDetailContent location={result.location} locationId={locationId || ''} />
}

/**
 * Página de detalle de ubicación
 */
export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ locationId: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { locationId } = await params

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 relative">
      {/* Header */}
      <Header user={user} />

      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main id="content" className="pt-15 pb-10 sm:pb-16">
        {/* Breadcrumb */}
        <div className="px-2 sm:px-5 sm:py-0 md:pt-5">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/google-business-profile"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  Google Business Profile
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <Link
                    href="/google-business-profile/locations"
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    Locations
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-neutral-500">
                    Location Details
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-5 sm:py-0 md:pt-5">
          <Suspense fallback={<LocationDetailSkeleton />}>
            <LocationDetailData locationId={locationId} />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ActivityOffcanvas />
      <SearchModal />
    </div>
  )
}

