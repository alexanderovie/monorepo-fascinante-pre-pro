import type { PerformanceMetrics } from '@/lib/gbp/types'
import { formatNumber } from '@/lib/utils/format'

interface PerformanceOverviewCardProps {
  metrics: Omit<PerformanceMetrics, 'locationId'>
}

/**
 * Performance Overview Card Component
 *
 * Muestra métricas de performance agregadas: vistas, búsquedas y acciones.
 * Server Component - Datos estáticos.
 */
export default function PerformanceOverviewCard({ metrics }: PerformanceOverviewCardProps) {
  // Calcular tendencias (mock - en producción vendría de la API)
  const viewsTrend = 12.5 // % de aumento
  const searchesTrend = 8.3 // % de aumento
  const actionsTrend = 15.2 // % de aumento

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="p-5 pb-3 flex justify-between items-center">
        <h2 className="ms-1 inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
          Performance Overview
        </h2>
        <span className="text-xs text-gray-500 dark:text-neutral-400">
          Últimos 30 días
        </span>
      </div>
      {/* End Header */}

      {/* Body */}
      <div className="flex flex-col justify-between h-full pb-5 px-5">
        {/* Main Metric */}
        <div>
          <h4 className="text-4xl md:text-5xl font-medium text-gray-800 dark:text-neutral-200">
            {formatNumber(metrics.views.total)}
          </h4>
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-500">
            Total de vistas
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 space-y-4">
          {/* Views Breakdown */}
          <div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                Vistas
              </span>
              <span
                className={`text-xs font-medium ${
                  viewsTrend > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                }`}
              >
                {viewsTrend > 0 ? '↑' : '↓'} {Math.abs(viewsTrend)}%
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Búsqueda:</span>
                <span className="font-medium">{formatNumber(metrics.views.searchViews)}</span>
              </div>
              <div className="flex justify-between">
                <span>Maps:</span>
                <span className="font-medium">{formatNumber(metrics.views.mapsViews)}</span>
              </div>
            </div>
          </div>

          {/* Searches */}
          <div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                Búsquedas
              </span>
              <span
                className={`text-xs font-medium ${
                  searchesTrend > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                }`}
              >
                {searchesTrend > 0 ? '↑' : '↓'} {Math.abs(searchesTrend)}%
              </span>
            </div>
            <div className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
              {formatNumber(metrics.searches.total)}
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
              Descubrimiento: {formatNumber(metrics.searches.discovery)} • Directas:{' '}
              {formatNumber(metrics.searches.direct)}
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                Acciones
              </span>
              <span
                className={`text-xs font-medium ${
                  actionsTrend > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                }`}
              >
                {actionsTrend > 0 ? '↑' : '↓'} {Math.abs(actionsTrend)}%
              </span>
            </div>
            <div className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
              {formatNumber(metrics.actions.total)}
            </div>
            <div className="mt-1 space-y-0.5 text-xs text-gray-600 dark:text-neutral-400">
              <div>Sitio web: {formatNumber(metrics.actions.websiteClicks)}</div>
              <div>Llamadas: {formatNumber(metrics.actions.phoneCalls)}</div>
              <div>Direcciones: {formatNumber(metrics.actions.directionRequests)}</div>
            </div>
          </div>
        </div>
        {/* End Stats Grid */}
      </div>
      {/* End Body */}
    </div>
  )
}
