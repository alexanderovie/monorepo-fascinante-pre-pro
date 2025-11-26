/**
 * Integrations Page
 *
 * Página para gestionar integraciones con terceros.
 * Basada en la plantilla Preline Pro account-integrations.html
 * Refactorizada de forma escalable y modular.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'
import IntegrationsContent from '../components/integrations/IntegrationsContent'

/**
 * Página protegida de integraciones.
 * Verifica que el usuario esté autenticado antes de mostrar el contenido.
 */
export default async function IntegrationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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
            <Link href="/" className="hover:text-gray-800 dark:hover:text-neutral-200">
              Dashboard
            </Link>
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
            <span className="truncate">Integrations</span>
          </li>
        </ol>
        {/* End Breadcrumb */}

        <div className="p-2 sm:p-5 sm:py-0 md:pt-5">
          <Suspense fallback={<IntegrationsLoadingSkeleton />}>
            <IntegrationsContent />
          </Suspense>
        </div>
      </main>
      {/* End Main Content */}

      <Footer />
    </div>
  )
}

/**
 * Loading skeleton para la página de integraciones
 */
function IntegrationsLoadingSkeleton() {
  return (
    <div className="space-y-5">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 dark:bg-neutral-700 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96 dark:bg-neutral-700"></div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-2 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-32 dark:bg-neutral-700"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-64 dark:bg-neutral-700"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-white border border-gray-200 rounded-xl dark:bg-neutral-800 dark:border-neutral-700 animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}

