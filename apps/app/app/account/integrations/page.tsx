/**
 * Account Integrations Page
 *
 * Página de integraciones dentro del sistema de tabs de Account.
 * Basada en la plantilla Preline Pro account-integrations.html
 * Refactorizada de forma escalable y modular.
 */

import { Suspense } from 'react'
import IntegrationsContent from '../../components/integrations/IntegrationsContent'

/**
 * Página de integraciones dentro de Account.
 * El layout (Header, Sidebar, Footer, Tabs) está en account/layout.tsx
 */
export default function AccountIntegrationsPage() {
  return (
    <Suspense fallback={<IntegrationsLoadingSkeleton />}>
      <IntegrationsContent />
    </Suspense>
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

