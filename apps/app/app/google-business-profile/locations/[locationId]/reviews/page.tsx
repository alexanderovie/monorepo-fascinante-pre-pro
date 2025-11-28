/**
 * Google Business Profile - Location Reviews Page
 *
 * ÉLITE PRO: Página para mostrar reviews de una ubicación específica
 * según estándares de la industria.
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
import ReviewsCard from '../../../../components/gbp/ReviewsCard'
import { getReviews } from '@/lib/gbp/get-reviews'
import { getLocationDetail } from '@/lib/gbp/get-location-detail'
import { getAccounts } from '@/lib/gbp/get-accounts'

/**
 * Componente interno que hace el fetch de datos
 */
async function ReviewsContent({ locationId }: { locationId: string }) {
  // ÉLITE: Obtener accountId desde la ubicación
  const locationResult = await getLocationDetail(locationId)
  if (!locationResult.location) {
    return (
      <div className="p-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-900/50">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
            Error loading location
          </h3>
          <p className="text-red-600 dark:text-red-300">{locationResult.error || 'Location not found'}</p>
        </div>
      </div>
    )
  }

  // ÉLITE: Obtener accountId desde accounts
  const accounts = await getAccounts()
  if (accounts.length === 0) {
    return (
      <div className="p-5">
        <p className="text-gray-500 dark:text-neutral-400">No accounts available</p>
      </div>
    )
  }

  const accountId = accounts[0].accountId

  // ÉLITE: Obtener reviews
  const reviewsResult = await getReviews({
    accountId,
    locationId,
    pageSize: 50,
  })

  if (reviewsResult.error) {
    return (
      <div className="p-5">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-900/50">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
            Error loading reviews
          </h3>
          <p className="text-yellow-600 dark:text-yellow-300">{reviewsResult.error}</p>
        </div>
      </div>
    )
  }

  return (
    <ReviewsCard
      reviews={reviewsResult.reviews?.reviews || []}
      metrics={reviewsResult.metrics}
      accountId={accountId}
      locationId={locationId}
    />
  )
}

/**
 * Página de reviews de ubicación
 */
export default async function LocationReviewsPage({
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
            <svg
              className="shrink-0 size-3.5 mx-2"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 13L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <Link
              href={`/google-business-profile/locations/${locationId}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
            >
              Detail
            </Link>
            <svg
              className="shrink-0 size-3.5 mx-2"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 13L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-gray-500 dark:text-neutral-500">Reviews</span>
          </div>
        </div>

        <div className="p-2 sm:p-5 sm:py-0 md:pt-5">
          <Suspense fallback={<div className="p-5">Cargando reviews...</div>}>
            <ReviewsContent locationId={locationId} />
          </Suspense>
        </div>
      </main>

      <Footer />
      <ActivityOffcanvas />
      <SearchModal />
    </div>
  )
}


