'use client'

import { useState } from 'react'
import type { GBPDashboardData, GBPAccount } from '@/lib/gbp/types'
import AccountSelector from './AccountSelector'
import PerformanceOverviewCard from './PerformanceOverviewCard'
import ReviewsCard from './ReviewsCard'
import EngagementCard from './EngagementCard'
import QuotaUsageCard from './QuotaUsageCard'
import LocationsTable from './LocationsTable'

interface GBPDashboardProps {
  initialData: GBPDashboardData
}

/**
 * Google Business Profile Dashboard Component
 *
 * Componente principal que integra todas las cards y el selector de cuenta.
 * Client Component - Maneja el estado de la cuenta seleccionada.
 */
export default function GBPDashboard({ initialData }: GBPDashboardProps) {
  const [selectedAccount, setSelectedAccount] = useState<GBPAccount | null>(
    initialData.selectedAccount
  )

  // Filtrar datos según la cuenta seleccionada
  const filteredData = selectedAccount
    ? {
        ...initialData,
        selectedAccount,
        locations: initialData.locations.filter(
          (loc) => loc.accountId === selectedAccount.accountId
        ),
        locationGroups: initialData.locationGroups.filter(
          (group) => group.accountId === selectedAccount.accountId
        ),
      }
    : initialData

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Account Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="space-y-1 sm:space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
            Google Business Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            Administra tus perfiles de negocio y métricas de rendimiento
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <AccountSelector
            accounts={initialData.accounts}
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccount}
          />
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <PerformanceOverviewCard metrics={filteredData.aggregatedMetrics.performance} />
        <ReviewsCard metrics={filteredData.aggregatedMetrics.reviews} />
        <EngagementCard metrics={filteredData.aggregatedMetrics.engagement} />
        {/* Quota Usage Card - Oculto en xl+ (1280px+) */}
        <div className="xl:hidden">
          <QuotaUsageCard quotaUsage={filteredData.quotaUsage} />
        </div>
      </div>

      {/* Locations Table */}
      {selectedAccount && (
        <LocationsTable accountId={selectedAccount.accountId} includeHealthScore={false} />
      )}
    </div>
  )
}
