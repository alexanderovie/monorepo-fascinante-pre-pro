'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
function IntegrationsContentInner() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | 'all'>('all')
  const [showOnlyPopular, setShowOnlyPopular] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Manejar mensajes de éxito/error del callback OAuth
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    if (success === 'true' && message) {
      setNotification({ type: 'success', message })
      // Limpiar URL después de mostrar el mensaje
      window.history.replaceState({}, '', window.location.pathname)
      // Actualizar estado de Google Business Profile a connected
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === 'google-business-profile'
            ? {
                ...integration,
                status: 'connected' as const,
                connectedAt: new Date().toISOString(),
              }
            : integration
        )
      )
      // Ocultar notificación después de 5 segundos
      setTimeout(() => setNotification(null), 5000)
    } else if (error && message) {
      setNotification({ type: 'error', message })
      // Limpiar URL después de mostrar el mensaje
      window.history.replaceState({}, '', window.location.pathname)
      // Ocultar notificación después de 5 segundos
      setTimeout(() => setNotification(null), 5000)
    }
  }, [searchParams])

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
    // Para Google Business Profile, redirigir al flujo OAuth
    if (integrationId === 'google-business-profile') {
      // Redirigir al endpoint de OAuth
      window.location.href = '/api/integrations/google-business-profile/connect'
      return
    }

    // Para otras integraciones, actualizar estado local (en producción, esto haría una llamada a la API)
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

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-lg border ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-500'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-500'
          }`}
        >
          <div className="flex items-start gap-x-3">
            {notification.type === 'success' ? (
              <svg
                className="shrink-0 size-5 mt-0.5"
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
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg
                className="shrink-0 size-5 mt-0.5"
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
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="shrink-0 text-current opacity-50 hover:opacity-100"
            >
              <svg
                className="size-4"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* End Notification Banner */}

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

/**
 * Integrations Content Component (wrapped in Suspense for useSearchParams)
 */
export default function IntegrationsContent() {
  return (
    <Suspense
      fallback={
        <div className="space-y-5">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 dark:bg-neutral-700 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 dark:bg-neutral-700"></div>
          </div>
        </div>
      }
    >
      <IntegrationsContentInner />
    </Suspense>
  )
}

