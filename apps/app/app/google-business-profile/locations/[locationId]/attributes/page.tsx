/**
 * Google Business Profile - Location Attributes Page
 *
 * ÉLITE PRO: Página para gestionar atributos de una ubicación específica
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import Header from '../../../../components/layout/Header'
import Sidebar from '../../../../components/layout/Sidebar'
import Footer from '../../../../components/layout/Footer'
import ActivityOffcanvas from '../../../../components/layout/ActivityOffcanvas'
import SearchModal from '../../../../components/layout/SearchModal'
import AttributesList from '../../../../components/gbp/AttributesList'
import { getLocationAttributes, getAvailableAttributes } from '@/lib/gbp/get-attributes'

/**
 * Componente interno que hace el fetch de datos
 */
async function AttributesContent({ locationId }: { locationId: string }) {
  const [attributesResult, availableResult] = await Promise.all([
    getLocationAttributes(locationId),
    getAvailableAttributes(locationId),
  ])

  if (attributesResult.error) {
    return (
      <div className="p-5">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-900/50">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
            Error loading attributes
          </h3>
          <p className="text-yellow-600 dark:text-yellow-300">{attributesResult.error}</p>
        </div>
      </div>
    )
  }

  return (
    <AttributesList
      attributes={attributesResult.attributes?.attributes || []}
      availableAttributes={availableResult.attributes?.attributes || []}
      locationId={locationId}
    />
  )
}

/**
 * Página de attributes de ubicación
 */
export default async function LocationAttributesPage({
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
      <Header user={user} />
      <Sidebar user={user} />

      <main id="content" className="lg:ps-65 pt-15 pb-10 sm:pb-16">
        {/* Breadcrumb */}
        <div className="p-2 sm:p-5 sm:py-0 md:pt-5">
          <div className="flex items-center py-3 text-gray-500 dark:text-neutral-500">
            <Link
              href="/google-business-profile/locations"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
            >
              Locations
            </Link>
            <svg className="shrink-0 size-3.5 mx-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 13L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <Link
              href={`/google-business-profile/locations/${locationId}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
            >
              Detail
            </Link>
            <svg className="shrink-0 size-3.5 mx-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 13L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-gray-500 dark:text-neutral-500">Attributes</span>
          </div>
        </div>

        <div className="p-2 sm:p-5 sm:py-0 md:pt-5">
          <Suspense fallback={<div className="p-5">Cargando attributes...</div>}>
            <AttributesContent locationId={locationId} />
          </Suspense>
        </div>
      </main>

      <Footer />
      <ActivityOffcanvas />
      <SearchModal />
    </div>
  )
}

