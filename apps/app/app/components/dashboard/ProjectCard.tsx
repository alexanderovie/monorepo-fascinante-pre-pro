/**
 * Business Locations Card Component
 *
 * Muestra una tabla completa de ubicaciones de negocio gestionadas con búsqueda, filtros,
 * ordenamiento y paginación. Incluye información de categoría, estado, progreso del perfil,
 * última actualización y health score.
 *
 * ÉLITE PRO: Integra datos reales de Google Business Profile cuando están disponibles,
 * usando datos mock solo para campos faltantes. Mantiene el diseño exacto del template.
 */
'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { LocationTableRow } from '@/lib/gbp/types'
import { useLocationsTable, type Location } from '@/app/hooks/use-locations-table'
import { useDebounce } from '@/app/hooks/use-debounce'
import { LOCATION_DEFAULTS, EMPTY_STATE_MESSAGES } from '@/lib/gbp/constants'

// Helper component para renderizar estrellas de health score
function HealthScoreStars({ score }: { score: number }) {
  return (
    <div className="flex gap-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`shrink-0 size-3.5 ${
            star <= score
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-gray-300 dark:text-neutral-700'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
      ))}
    </div>
  );
}

// Helper component para renderizar badges de estado
function StatusBadge({ status }: { status: 'active' | 'pending' | 'needs-review' }) {
  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
    },
    'needs-review': {
      label: 'Needs Review',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-md ${config.className}`}>
      {config.label}
    </span>
  );
}

// Helper component para renderizar progress bar de completitud del perfil
function ProfileProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100;
  return (
    <div className="flex items-center gap-x-3">
      <span className="text-sm text-gray-500 dark:text-neutral-500">
        {current}/{total}
      </span>
      <div
        className="flex w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="flex flex-col justify-center overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap dark:bg-blue-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Helper component para Sort Dropdown (reutilizable y funcional)
// ÉLITE PRO: Conectado con el hook de tabla para ordenamiento real
function SortDropdown({
  id,
  label,
  field,
  sortState,
  onSort,
}: {
  id: string
  label: string
  field: 'name' | 'category' | 'status' | 'progress' | 'lastUpdated' | 'healthScore'
  sortState: { field: string | null; direction: 'asc' | 'desc' }
  onSort: (field: 'name' | 'category' | 'status' | 'progress' | 'lastUpdated' | 'healthScore') => void
}) {
  const isActive = sortState.field === field
  const sortIcon = isActive ? (sortState.direction === 'asc' ? '↑' : '↓') : '⇅'

  return (
    <div className="hs-dropdown relative inline-flex w-full cursor-pointer">
      <button
        id={id}
        type="button"
        onClick={() => onSort(field)}
        className={`px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm text-nowrap whitespace-nowrap font-normal ${
          isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-neutral-500'
        } focus:outline-hidden focus:bg-gray-100 dark:focus:bg-neutral-700`}
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label={`Sort by ${label}`}
      >
        {label}
        <span className="text-xs ml-1">{sortIcon}</span>
        <svg
          className="shrink-0 size-3.5"
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
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      </button>
    </div>
  )
}

/**
 * ÉLITE: Función helper para crear una ubicación vacía con valores por defecto
 * Sin hardcodeo - usa constantes centralizadas
 */
function createEmptyLocation(id: number): Location {
  return {
    id,
    name: LOCATION_DEFAULTS.UNNAMED_LOCATION,
    category: LOCATION_DEFAULTS.NO_CATEGORY,
    status: 'active',
    tags: [],
    progress: {
      current: LOCATION_DEFAULTS.DEFAULT_PROGRESS_SCORE,
      total: LOCATION_DEFAULTS.DEFAULT_PROGRESS_TOTAL,
    },
    lastUpdated: LOCATION_DEFAULTS.NO_DATE,
    healthScore: LOCATION_DEFAULTS.DEFAULT_HEALTH_SCORE,
  }
}

// Mapear status de API a formato del componente
function mapStatus(status: 'Active' | 'Pending' | 'Needs Review' | 'Closed'): 'active' | 'pending' | 'needs-review' {
  switch (status) {
    case 'Active':
      return 'active'
    case 'Pending':
      return 'pending'
    case 'Needs Review':
      return 'needs-review'
    case 'Closed':
      return 'active' // Tratamos Closed como active para el badge
    default:
      return 'active'
  }
}

// Formatear fecha
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateString
  }
}

interface ProjectCardProps {
  /**
   * Datos iniciales de locations desde el servidor.
   * Si se proporciona, se usa inmediatamente sin fetch inicial.
   */
  initialData?: LocationTableRow[]
  /**
   * AccountId para refetch client-side si es necesario.
   */
  accountId?: string | null
}

export default function ProjectCard({ initialData, accountId }: ProjectCardProps = {}) {
  const router = useRouter()

  // ÉLITE: Si hay initialData, usarlo inmediatamente (Server Component)
  // Si no, usar array vacío y hacer fetch (sin hardcodeo)
  const [rawLocations, setRawLocations] = useState<Location[]>(
    initialData
      ? initialData.map((row, index) => {
          // ÉLITE: Mapear datos reales sin usar mocks hardcodeados
          return {
            id: index + 1,
            locationId: row.locationId, // ÉLITE: Guardar locationId real para navegación
            name: row.name || LOCATION_DEFAULTS.UNNAMED_LOCATION,
            category: row.category || LOCATION_DEFAULTS.NO_CATEGORY,
            status: mapStatus(row.status || LOCATION_DEFAULTS.DEFAULT_STATUS),
            // ÉLITE: No mostrar additionalCategories - solo primary category
            tags: [],
            progress: {
              current: row.progress?.score ?? LOCATION_DEFAULTS.DEFAULT_PROGRESS_SCORE,
              total: LOCATION_DEFAULTS.DEFAULT_PROGRESS_TOTAL,
            },
            lastUpdated: row.lastUpdated || LOCATION_DEFAULTS.NO_DATE,
            healthScore: row.healthScore?.score
              ? Math.round(row.healthScore.score)
              : LOCATION_DEFAULTS.DEFAULT_HEALTH_SCORE,
          }
        })
      : [] // ÉLITE: Array vacío en lugar de mocks hardcodeados
  )
  const [loading, setLoading] = useState(!initialData) // No loading si hay initialData

  useEffect(() => {
    // ÉLITE: Si ya tenemos initialData, no hacer fetch inicial
    if (initialData) {
      return
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // accountId e initialData no deben estar en deps:
    // - initialData: solo se usa para estado inicial, no para refetch
    // - accountId: se obtiene dentro del efecto, no debe causar re-ejecución
    async function loadRealData() {
      try {
        // Intentar obtener cuentas disponibles
        const accountsResponse = await fetch('/api/integrations/google-business-profile/accounts')

        if (!accountsResponse.ok) {
          // ÉLITE: Sin datos - array vacío (no hardcodeo)
          setRawLocations([])
          setLoading(false)
          return
        }

        const accountsData = await accountsResponse.json()

        if (!accountsData.success || !accountsData.accounts || accountsData.accounts.length === 0) {
          // ÉLITE: Sin cuentas - array vacío (no hardcodeo)
          setRawLocations([])
          setLoading(false)
          return
        }

        // Usar accountId de props si está disponible, sino usar la primera cuenta
        const selectedAccountId = accountId || accountsData.accounts[0]?.accountId

        if (!selectedAccountId) {
          // ÉLITE: Sin accountId - array vacío (no hardcodeo)
          setRawLocations([])
          setLoading(false)
          return
        }

        // ÉLITE: No intentar cargar si accountId es mock
        if (selectedAccountId === '123456789' || selectedAccountId === '987654321') {
          setRawLocations([])
          setLoading(false)
          return
        }

        // Obtener ubicaciones reales
        const locationsResponse = await fetch(
          `/api/integrations/google-business-profile/locations?accountId=${selectedAccountId}&includeHealthScore=true`
        )

        if (!locationsResponse.ok) {
          // ÉLITE: Error al cargar - array vacío (no hardcodeo)
          setRawLocations([])
          setLoading(false)
          return
        }

        const locationsData = await locationsResponse.json()

        if (locationsData.success && locationsData.data && locationsData.data.length > 0) {
          // ÉLITE: Mapear datos reales sin usar mocks hardcodeados
          const realLocations = locationsData.data.map((row: LocationTableRow, index: number) => {
            return {
              id: index + 1,
              locationId: row.locationId, // ÉLITE: Guardar locationId real para navegación
              name: row.name || LOCATION_DEFAULTS.UNNAMED_LOCATION,
              category: row.category || LOCATION_DEFAULTS.NO_CATEGORY,
              status: mapStatus(row.status || LOCATION_DEFAULTS.DEFAULT_STATUS),
              // ÉLITE: No mostrar additionalCategories - solo primary category
              tags: [],
              progress: {
                current: row.progress?.score ?? LOCATION_DEFAULTS.DEFAULT_PROGRESS_SCORE,
                total: LOCATION_DEFAULTS.DEFAULT_PROGRESS_TOTAL,
              },
              lastUpdated: row.lastUpdated || LOCATION_DEFAULTS.NO_DATE,
              healthScore: row.healthScore?.score
                ? Math.round(row.healthScore.score)
                : LOCATION_DEFAULTS.DEFAULT_HEALTH_SCORE,
            }
          })

          setRawLocations(realLocations)
        } else {
          // ÉLITE: Sin ubicaciones - array vacío (no hardcodeo)
          setRawLocations([])
        }
      } catch (error) {
        // ÉLITE: Error - array vacío y log (no hardcodeo)
        console.error('Error loading real locations:', error)
        setRawLocations([])
      } finally {
        setLoading(false)
      }
    }

    loadRealData()
    // accountId e initialData no deben estar en deps:
    // - initialData: solo se usa para estado inicial, no para refetch
    // - accountId: se obtiene dentro del efecto, no debe causar re-ejecución
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ÉLITE: Inicializar Preline UI para dropdowns
  useEffect(() => {
    if (typeof window !== 'undefined' && window.HSStaticMethods) {
      window.HSStaticMethods.autoInit()
    }
  }, [])

  // ÉLITE PRO: Usar hook personalizado para manejo completo de tabla
  // Convierte rawLocations al formato Location del hook
  const locationsForTable: Location[] = useMemo(
    () =>
      rawLocations.map((loc) => ({
        id: loc.id,
        locationId: loc.locationId, // ÉLITE: Preservar locationId para navegación
        name: loc.name,
        category: loc.category,
        status: loc.status,
        tags: loc.tags,
        progress: loc.progress,
        lastUpdated: loc.lastUpdated,
        healthScore: loc.healthScore,
      })),
    [rawLocations]
  )

  // ÉLITE PRO: Hook centralizado para búsqueda, filtros, ordenamiento y paginación
  const {
    paginatedLocations,
    filterState,
    sortState,
    paginationState,
    setSearchQuery,
    setSortField,
    setCurrentPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = useLocationsTable({
    initialData: locationsForTable,
    itemsPerPage: 10,
  })

  // ÉLITE: Debounce para búsqueda (optimización de performance)
  const [searchInputValue, setSearchInputValue] = useState('')
  const debouncedSearchQuery = useDebounce(searchInputValue, 300)

  useEffect(() => {
    setSearchQuery(debouncedSearchQuery)
  }, [debouncedSearchQuery, setSearchQuery])

  return (
    <div className="p-5 space-y-4 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="flex justify-between items-center gap-x-5">
        <h2 className="inline-block font-semibold text-lg text-gray-800 dark:text-neutral-200">Business Locations</h2>

        <div className="flex justify-end items-center gap-x-2">
          {/* Button */}
          <button
            type="button"
            className="py-1.5 sm:py-2 px-2.5 inline-flex items-center gap-x-1.5 text-sm sm:text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            data-hs-overlay="#hs-pro-dasadpm"
          >
            <svg
              className="hidden sm:block shrink-0 size-3.5"
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
          {/* End Button */}
        </div>
      </div>
      {/* End Header */}

      {/* Filter Group */}
      <div className="grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-5">
        <div>
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
              <svg
                className="shrink-0 size-4 text-gray-500 dark:text-neutral-400"
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
                  <input
                    type="text"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    className="py-1 sm:py-1.5 ps-10 pe-8 block w-full bg-gray-100 border-transparent rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:bg-neutral-800 dark:focus:ring-neutral-600"
                    placeholder="Search locations"
                  />
            <div className="hidden absolute inset-y-0 end-0 flex items-center z-20 pe-1">
              <button
                type="button"
                className="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </button>
            </div>
          </div>
          {/* End Search Input */}
        </div>
        {/* End Col */}

        <div className="flex md:justify-end items-center gap-x-2">
          {/* Import / Export Dropdown */}
          <div className="hs-dropdown [--auto-close:true] relative inline-flex">
            <button
              id="hs-pro-dptied"
              type="button"
              className="py-1.5 sm:py-2 px-2.5 inline-flex items-center gap-x-1.5 text-sm sm:text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <svg
                className="shrink-0 mt-0.5 size-3.5"
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
                <path d="m3 16 4 4 4-4" />
                <path d="M7 20V4" />
                <path d="m21 8-4-4-4 4" />
                <path d="M17 4v16" />
              </svg>
              Import / Export
              <svg
                className="shrink-0 size-3.5"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-44 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-xl dark:bg-neutral-900"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-pro-dptied"
            >
              <div className="p-1">
                <button
                  type="button"
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-300 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  data-hs-overlay="#hs-pro-dicm"
                >
                  <svg
                    className="shrink-0 mt-0.5 size-4"
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Import contacts
                </button>
                <button
                  type="button"
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-300 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  data-hs-overlay="#hs-pro-decm"
                >
                  <svg
                    className="shrink-0 mt-0.5 size-4"
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  Export contacts
                </button>
              </div>
            </div>
          </div>
          {/* End Import / Export Dropdown */}

          {/* Download Dropdown */}
          <div className="hs-dropdown [--auto-close:inside] [--placement:top-right] relative inline-flex">
            <button
              id="hs-pro-dptfd"
              type="button"
              className="py-1.5 sm:py-2 px-2.5 inline-flex items-center gap-x-1.5 text-sm sm:text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <svg
                className="shrink-0 size-3.5"
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
                <line x1="21" x2="14" y1="4" y2="4" />
                <line x1="10" x2="3" y1="4" y2="4" />
                <line x1="21" x2="12" y1="12" y2="12" />
                <line x1="8" x2="3" y1="12" y2="12" />
                <line x1="21" x2="16" y1="20" y2="20" />
                <line x1="12" x2="3" y1="20" y2="20" />
                <line x1="14" x2="14" y1="2" y2="6" />
                <line x1="8" x2="8" y1="10" y2="14" />
                <line x1="16" x2="16" y1="18" y2="22" />
              </svg>
              Filter
              <span className="font-medium text-[10px] py-0.5 px-[5px] bg-gray-800 text-white leading-3 rounded-full dark:bg-neutral-500">
                {totalItems}
              </span>
            </button>

            <div
              className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-48 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-xl dark:bg-neutral-900"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-pro-dptfd"
            >
              {/* Search Input */}
              <div className="pt-1 px-1">
                <div className="pb-1 border-b border-gray-200 dark:border-neutral-800">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-2.5">
                      <svg
                        className="shrink-0 size-3.5 text-gray-400 dark:text-white/60"
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
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="py-1 sm:py-1.5 px-8 block w-full bg-gray-100 border-transparent rounded-md sm:text-sm placeholder:text-gray-500 focus:outline-hidden focus:border-blue-500 focus:ring-blue-500 focus:bg-white disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-transparent dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600 dark:focus:bg-neutral-900"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
              {/* End Search Input */}

              <div className="p-1 space-y-0.5">
                <a
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-300 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  href="#"
                >
                  <svg
                    className="shrink-0 mt-0.5 size-3.5"
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
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                  </svg>
                  Name
                </a>
                <a
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-300 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  href="#"
                >
                  <svg
                    className="shrink-0 mt-0.5 size-3.5"
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
                    <path d="M11 12H3" />
                    <path d="M16 6H3" />
                    <path d="M16 18H3" />
                    <path d="M21 12h-6" />
                  </svg>
                  Category
                </a>
                <a
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-300 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  href="#"
                >
                  <svg
                    className="shrink-0 mt-0.5 size-3.5"
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
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Status
                </a>
                <a
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-300 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  href="#"
                >
                  <svg
                    className="shrink-0 mt-0.5 size-3.5"
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
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                    <path d="M10 6h4" />
                    <path d="M10 10h4" />
                    <path d="M10 14h4" />
                    <path d="M10 18h4" />
                  </svg>
                  Progress
                </a>
                <a
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-300 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  href="#"
                >
                  <svg
                    className="shrink-0 mt-0.5 size-3.5"
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
                    <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <circle cx="12" cy="10" r="2" />
                    <line x1="8" x2="8" y1="2" y2="4" />
                    <line x1="16" x2="16" y1="2" y2="4" />
                  </svg>
                  Last Updated
                </a>
                <a
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-300 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  href="#"
                >
                  <svg
                    className="shrink-0 mt-0.5 size-3.5"
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
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Health Score
                </a>
              </div>
            </div>
          </div>
          {/* End Download Dropdown */}
        </div>
        {/* End Col */}
      </div>
      {/* End Filter Group */}

      {/* Table Section */}
      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <div className="min-w-full inline-block align-middle">
          {/* Table */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead>
              <tr className="border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                <th scope="col" className="px-3 py-2.5 text-start">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  />
                </th>

                <th scope="col" className="min-w-[200px] sm:min-w-[250px] md:min-w-70">
                  <SortDropdown
                    id="hs-pro-dutnms"
                    label="Name"
                    field="name"
                    sortState={sortState}
                    onSort={setSortField}
                  />
                </th>

                <th scope="col" className="min-w-45 hidden sm:table-cell">
                  <SortDropdown
                    id="hs-pro-duttgs"
                    label="Category"
                    field="category"
                    sortState={sortState}
                    onSort={setSortField}
                  />
                </th>

                <th scope="col" className="min-w-45">
                  <SortDropdown
                    id="hs-pro-dutass"
                    label="Status"
                    field="status"
                    sortState={sortState}
                    onSort={setSortField}
                  />
                </th>

                <th scope="col" className="hidden md:table-cell">
                  <SortDropdown
                    id="hs-pro-dutprs"
                    label="Progress"
                    field="progress"
                    sortState={sortState}
                    onSort={setSortField}
                  />
                </th>

                <th scope="col" className="hidden lg:table-cell">
                  <SortDropdown
                    id="hs-pro-dutdds"
                    label="Last Updated"
                    field="lastUpdated"
                    sortState={sortState}
                    onSort={setSortField}
                  />
                </th>

                <th scope="col" className="hidden md:table-cell">
                  <SortDropdown
                    id="hs-pro-dutrts"
                    label="Health Score"
                    field="healthScore"
                    sortState={sortState}
                    onSort={setSortField}
                  />
                </th>
              </tr>
            </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {paginatedLocations.map((location) => (
                <tr
                  key={location.id}
                  className="divide-x divide-gray-200 dark:divide-neutral-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                  onClick={(e) => {
                    // ÉLITE PRO: Comportamiento estándar de la industria - navegar a detalle al hacer click
                    // Excluir clicks en checkboxes y botones de acción
                    const target = e.target as HTMLElement
                    if (
                      target.tagName === 'INPUT' ||
                      target.tagName === 'BUTTON' ||
                      target.closest('input') ||
                      target.closest('button')
                    ) {
                      return
                    }

                    // Navegar a página de detalle si hay locationId
                    if (location.locationId) {
                      router.push(`/google-business-profile/locations/${location.locationId}`)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    // ÉLITE: Soporte para keyboard navigation (Enter/Space)
                    if ((e.key === 'Enter' || e.key === ' ') && location.locationId) {
                      e.preventDefault()
                      router.push(`/google-business-profile/locations/${location.locationId}`)
                    }
                  }}
                  aria-label={`View details for ${location.name}`}
                >
                  <td className="size-px whitespace-nowrap">
                    <div className="px-3 py-4">
                      <input
                        type="checkbox"
                        className="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      />
                    </div>
                  </td>
                  <td className="min-w-[200px] sm:min-w-[250px] md:min-w-70">
                    <div className="px-3 sm:px-5 py-2">
                      <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200 break-words sm:break-normal">
                        {location.name}
                      </p>
                    </div>
                  </td>
                  <td className="size-px whitespace-nowrap hidden sm:table-cell">
                    {/* ÉLITE: Mostrar solo primary category en la columna Category */}
                    <div className="px-5 py-2">
                      <p className="text-sm text-gray-800 dark:text-neutral-200">
                        {location.category || LOCATION_DEFAULTS.NO_CATEGORY}
                      </p>
                    </div>
                  </td>
                  <td className="size-px whitespace-nowrap">
                    <div className="px-3 sm:px-5 py-2">
                      <StatusBadge status={location.status} />
                    </div>
                  </td>
                  <td className="size-px whitespace-nowrap hidden md:table-cell">
                    <div className="px-5 py-2">
                      <ProfileProgressBar current={location.progress.current} total={location.progress.total} />
                    </div>
                  </td>
                  <td className="size-px whitespace-nowrap hidden lg:table-cell">
                    <div className="px-5 py-2">
                      <span className="text-sm text-gray-600 dark:text-neutral-400">{location.lastUpdated}</span>
                    </div>
                  </td>
                  <td className="size-px whitespace-nowrap hidden md:table-cell">
                    <div className="px-5 py-2">
                      <HealthScoreStars score={location.healthScore} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* End Table */}
        </div>
      </div>
      {/* End Table Section */}

      {/* Footer */}
      <div className="grid grid-cols-2 items-center gap-y-2 sm:gap-y-0 sm:gap-x-5">
              <p className="text-sm text-gray-800 dark:text-neutral-200">
                <span className="font-medium">{totalItems}</span>
                <span className="text-gray-500 dark:text-neutral-500"> results</span>
              </p>

        {/* Pagination */}
        {/* ÉLITE PRO: Ocultar paginación si no hay datos (estándar de la industria) */}
        {totalItems > 0 && (
          <nav className="flex justify-end items-center gap-x-1" aria-label="Pagination">
            <button
              type="button"
              onClick={() => setCurrentPage(paginationState.currentPage - 1)}
              disabled={!hasPreviousPage}
              className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
              aria-label="Previous"
              aria-disabled={!hasPreviousPage}
            >
              <svg
                className="shrink-0 size-3.5"
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
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="sr-only">Previous</span>
            </button>
            <div className="flex items-center gap-x-1">
              <span
                className="min-h-9.5 min-w-9.5 flex justify-center items-center bg-gray-100 text-gray-800 py-2 px-3 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:text-white"
                aria-current="page"
              >
                {paginationState.currentPage}
              </span>
              <span className="min-h-9.5 flex justify-center items-center text-gray-500 py-2 px-1.5 text-sm dark:text-neutral-500">
                of
              </span>
              <span className="min-h-9.5 flex justify-center items-center text-gray-500 py-2 px-1.5 text-sm dark:text-neutral-500">
                {totalPages}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage(paginationState.currentPage + 1)}
              disabled={!hasNextPage}
              className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
              aria-label="Next"
              aria-disabled={!hasNextPage}
            >
              <span className="sr-only">Next</span>
              <svg
                className="shrink-0 size-3.5"
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </nav>
        )}
        {/* End Pagination */}
      </div>
      {/* End Footer */}
    </div>
  );
}
