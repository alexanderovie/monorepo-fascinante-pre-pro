'use client'

import { useEffect, useState, useRef } from 'react'
import type { LocationTableRow } from '@/lib/gbp/types'

interface LocationsTableProps {
  accountId: string
  includeHealthScore?: boolean
}

/**
 * Locations Table Component
 *
 * Tabla de ubicaciones de Google Business Profile con búsqueda, filtros y datos reales.
 * Client Component - Requiere interactividad (búsqueda, filtros).
 *
 * ÉLITE PRO: Implementa mejores prácticas de la industria 2025:
 * - Cancelación de requests pendientes al cambiar cuenta
 * - Loading states optimistas
 * - Manejo robusto de errores
 * - Cache básico por cuenta (evita recargas innecesarias)
 */
export default function LocationsTable({ accountId, includeHealthScore = false }: LocationsTableProps) {
  const [data, setData] = useState<LocationTableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // ÉLITE PRO: Cache básico por cuenta para evitar recargas innecesarias
  const cacheRef = useRef<Map<string, { data: LocationTableRow[]; timestamp: number }>>(new Map())
  const CACHE_DURATION = useRef(5 * 60 * 1000) // 5 minutos

  // ÉLITE PRO: AbortController para cancelar requests pendientes
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // ÉLITE PRO: Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo AbortController para este request
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // ÉLITE: No intentar cargar si accountId es mock
        if (accountId === '123456789' || accountId === '987654321') {
          setError('Por favor, conecta tu cuenta de Google Business Profile primero')
          setLoading(false)
          return
        }

        // ÉLITE PRO: Verificar cache primero
        const cacheKey = `${accountId}-${includeHealthScore}`
        const cached = cacheRef.current.get(cacheKey)
        const now = Date.now()

        if (cached && now - cached.timestamp < CACHE_DURATION.current) {
          // Usar datos del cache
          setData(cached.data)
          setLoading(false)
          return
        }

        const response = await fetch(
          `/api/integrations/google-business-profile/locations?accountId=${accountId}&includeHealthScore=${includeHealthScore}`,
          { signal } // ÉLITE PRO: Pasar signal para cancelación
        )

        // ÉLITE PRO: Verificar si fue cancelado
        if (signal.aborted) {
          return
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()

        // ÉLITE PRO: Verificar si fue cancelado antes de actualizar estado
        if (signal.aborted) {
          return
        }

        if (result.success && result.data) {
          setData(result.data)
          // ÉLITE PRO: Guardar en cache
          cacheRef.current.set(cacheKey, {
            data: result.data,
            timestamp: now,
          })
        } else {
          setError(result.error || 'Error al cargar datos')
        }
      } catch (err) {
        // ÉLITE PRO: Ignorar errores de cancelación
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        // ÉLITE PRO: Solo actualizar loading si no fue cancelado
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    if (accountId) {
      loadData()
    }

    // ÉLITE PRO: Cleanup - cancelar request al desmontar o cambiar accountId
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [accountId, includeHealthScore])

  // Filtrar por término de búsqueda
  const filteredData = data.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-neutral-400">Cargando ubicaciones...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/20 dark:bg-red-900/10">
        <div className="flex">
          <div className="shrink-0">
            <svg
              className="size-4 text-red-600 dark:text-red-500"
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
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <div className="ms-3">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-500">Error</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-neutral-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Business Locations</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
            {filteredData.length} {filteredData.length === 1 ? 'ubicación' : 'ubicaciones'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className="shrink-0 size-4"
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
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add Location
          </button>
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Import/Export
          </button>
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Filter {data.length}
          </button>
        </div>
      </div>
      {/* End Header */}

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-2 px-3 pe-11 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
            <svg
              className="shrink-0 size-4 text-gray-400"
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
          </div>
        </div>
      </div>
      {/* End Search */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400"
              >
                Progress
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400"
              >
                Last Updated
              </th>
              {includeHealthScore && (
                <th
                  scope="col"
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400"
                >
                  Health Score
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-neutral-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={includeHealthScore ? 6 : 5} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    {searchTerm ? 'No se encontraron ubicaciones' : 'No hay ubicaciones disponibles'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredData.map((location) => (
                <tr
                  key={location.locationId}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800 dark:text-neutral-200">{location.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800 dark:text-neutral-200">{location.category}</div>
                    {location.additionalCategories && location.additionalCategories.length > 0 && (
                      <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                        {location.additionalCategories.join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full ${
                        location.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500'
                          : location.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500'
                            : location.status === 'Needs Review'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500'
                              : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {location.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden dark:bg-neutral-700">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all dark:bg-blue-500"
                          style={{ width: `${location.progress.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-neutral-400">
                        {location.progress.score}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                    {location.lastUpdated}
                  </td>
                  {includeHealthScore && location.healthScore && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`shrink-0 size-4 ${
                              star <= location.healthScore!.score
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-neutral-600'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* End Table */}
    </div>
  )
}
