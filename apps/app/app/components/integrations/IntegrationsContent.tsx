'use client'

import { useState, useMemo } from 'react'
import type { Integration, IntegrationCategory } from '@/lib/integrations/types'
import {
  availableIntegrations,
  getIntegrationsByCategory,
  getPopularIntegrations,
  searchIntegrations,
} from '@/lib/integrations/integrations-data'
import IntegrationCard from './IntegrationCard'
import IntegrationsFilters from './IntegrationsFilters'

/**
 * Integrations Content Component
 *
 * Componente principal que maneja el estado y la lógica de las integraciones.
 * Client Component - Requiere interactividad (filtros, búsqueda, conexión).
 */
export default function IntegrationsContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | 'all'>('all')
  const [showOnlyPopular, setShowOnlyPopular] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations)

  // Filtrar integraciones según búsqueda y filtros
  const filteredIntegrations = useMemo(() => {
    let result: Integration[] = integrations

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      result = searchIntegrations(searchQuery)
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      result = result.filter((integration) => integration.category === selectedCategory)
    }

    // Filtrar solo populares
    if (showOnlyPopular) {
      result = result.filter((integration) => integration.isPopular)
    }

    return result
  }, [searchQuery, selectedCategory, showOnlyPopular, integrations])

  // Handlers
  const handleConnect = async (integrationId: string) => {
    // Actualizar estado local (en producción, esto haría una llamada a la API)
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: 'pending' as const }
          : integration
      )
    )

    // Simular conexión (en producción, esto sería una llamada a la API)
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? {
                ...integration,
                status: 'connected' as const,
                connectedAt: new Date().toISOString(),
              }
            : integration
        )
      )
    }, 1500)
  }

  const handleDisconnect = async (integrationId: string) => {
    // Actualizar estado local (en producción, esto haría una llamada a la API)
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              status: 'disconnected' as const,
              connectedAt: undefined,
              lastSyncAt: undefined,
            }
          : integration
      )
    )
  }

  const handleViewSettings = (integrationId: string) => {
    // En producción, esto navegaría a la página de configuración de la integración
    console.log('View settings for:', integrationId)
    // window.location.href = `/integrations/${integrationId}/settings`
  }

  return (
    <div className="space-y-5">
      {/* Header - Solo visible en desktop (en mobile el breadcrumb ya muestra el título) */}
      <div className="hidden lg:block">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
          Integrations
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          Connect Preline to other tools that you use.
        </p>
      </div>
      {/* End Header */}

      {/* Filters */}
      <IntegrationsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showOnlyPopular={showOnlyPopular}
        onShowOnlyPopularChange={setShowOnlyPopular}
        totalIntegrations={filteredIntegrations.length}
      />
      {/* End Filters */}

      {/* Integrations Grid */}
      {filteredIntegrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onViewSettings={handleViewSettings}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto size-12 text-gray-400 dark:text-neutral-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-neutral-200">
            No integrations found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
      {/* End Integrations Grid */}
    </div>
  )
}

