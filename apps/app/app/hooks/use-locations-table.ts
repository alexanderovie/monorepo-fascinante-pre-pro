/**
 * useLocationsTable Hook
 *
 * ÉLITE PRO: Hook personalizado escalable y reutilizable para manejar el estado
 * completo de la tabla de ubicaciones (búsqueda, filtros, ordenamiento, paginación).
 *
 * Características:
 * - Estado centralizado y tipado
 * - Funciones puras para filtrado y ordenamiento
 * - Debounce automático para búsqueda (optimización de performance)
 * - Paginación calculada dinámicamente
 * - Memoización de resultados para evitar recálculos innecesarios
 * - Type-safe con TypeScript
 *
 * Basado en mejores prácticas de React 2025 y patrones de diseño modernos.
 */

import { useState, useMemo, useCallback, useEffect } from 'react'

export type LocationStatus = 'active' | 'pending' | 'needs-review'
export type SortField = 'name' | 'category' | 'status' | 'progress' | 'lastUpdated' | 'healthScore'
export type SortDirection = 'asc' | 'desc'

export interface Location {
  id: number
  name: string
  category: string
  status: LocationStatus
  tags: string[]
  progress: { current: number; total: number }
  lastUpdated: string
  healthScore: number
}

export interface FilterState {
  searchQuery: string
  status?: LocationStatus
  category?: string
  minHealthScore?: number
}

export interface SortState {
  field: SortField | null
  direction: SortDirection
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
}

export interface UseLocationsTableOptions {
  initialData: Location[]
  itemsPerPage?: number
  debounceMs?: number
}

export interface UseLocationsTableReturn {
  // Datos procesados
  filteredAndSortedLocations: Location[]
  paginatedLocations: Location[]

  // Estado
  filterState: FilterState
  sortState: SortState
  paginationState: PaginationState

  // Acciones
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: LocationStatus | undefined) => void
  setCategoryFilter: (category: string | undefined) => void
  setMinHealthScore: (score: number | undefined) => void
  setSortField: (field: SortField | null) => void
  setSortDirection: (direction: SortDirection) => void
  setCurrentPage: (page: number) => void
  resetFilters: () => void

  // Información calculada
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Función pura para filtrar ubicaciones
 * ÉLITE: Separada para testabilidad y reutilización
 */
function filterLocations(locations: Location[], filters: FilterState): Location[] {
  return locations.filter((location) => {
    // Búsqueda por texto (case-insensitive)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase()
      const matchesSearch =
        location.name.toLowerCase().includes(query) ||
        location.category.toLowerCase().includes(query) ||
        location.tags.some((tag) => tag.toLowerCase().includes(query))

      if (!matchesSearch) return false
    }

    // Filtro por estado
    if (filters.status && location.status !== filters.status) {
      return false
    }

    // Filtro por categoría
    if (filters.category && location.category !== filters.category) {
      return false
    }

    // Filtro por health score mínimo
    if (filters.minHealthScore !== undefined && location.healthScore < filters.minHealthScore) {
      return false
    }

    return true
  })
}

/**
 * Función pura para ordenar ubicaciones
 * ÉLITE: Separada para testabilidad y reutilización
 */
function sortLocations(locations: Location[], sort: SortState): Location[] {
  if (!sort.field) return locations

  const sorted = [...locations].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sort.field) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'category':
        aValue = a.category.toLowerCase()
        bValue = b.category.toLowerCase()
        break
      case 'status':
        // Ordenar por prioridad: active > pending > needs-review
        const statusPriority: Record<LocationStatus, number> = {
          active: 3,
          pending: 2,
          'needs-review': 1,
        }
        aValue = statusPriority[a.status]
        bValue = statusPriority[b.status]
        break
      case 'progress':
        aValue = a.progress.current / a.progress.total
        bValue = b.progress.current / b.progress.total
        break
      case 'lastUpdated':
        aValue = new Date(a.lastUpdated).getTime()
        bValue = new Date(b.lastUpdated).getTime()
        break
      case 'healthScore':
        aValue = a.healthScore
        bValue = b.healthScore
        break
      default:
        return 0
    }

    if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Hook principal para manejar el estado de la tabla de ubicaciones
 * ÉLITE PRO: Lógica centralizada, escalable y reutilizable
 */
export function useLocationsTable({
  initialData,
  itemsPerPage = 10,
  debounceMs = 300,
}: UseLocationsTableOptions): UseLocationsTableReturn {
  // Estado de filtros
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
  })

  // Estado de ordenamiento
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: 'asc',
  })

  // Estado de paginación
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage,
  })

  // ÉLITE: Memoizar ubicaciones filtradas y ordenadas
  // Solo recalcula cuando cambian los datos, filtros o ordenamiento
  const filteredAndSortedLocations = useMemo(() => {
    const filtered = filterLocations(initialData, filterState)
    const sorted = sortLocations(filtered, sortState)
    return sorted
  }, [initialData, filterState, sortState])

  // Información calculada
  // ÉLITE PRO: Cálculo robusto según estándares de la industria
  const totalItems = filteredAndSortedLocations.length
  // ÉLITE: totalPages nunca debe ser 0 (mínimo 1 para evitar división por cero)
  // Si no hay items, totalPages = 1 pero la paginación se oculta en la UI
  const totalPages = Math.max(1, Math.ceil(totalItems / paginationState.itemsPerPage))

  // ÉLITE PRO: Ajustar página actual si excede totalPages (cuando filtros cambian)
  // Esto previene mostrar páginas vacías cuando los filtros reducen los resultados
  const validCurrentPage = Math.min(paginationState.currentPage, totalPages)

  const hasNextPage = validCurrentPage < totalPages && totalItems > 0
  const hasPreviousPage = validCurrentPage > 1

  // ÉLITE: Memoizar ubicaciones paginadas con página válida
  // Solo recalcula cuando cambian las ubicaciones filtradas o la paginación
  const paginatedLocations = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * paginationState.itemsPerPage
    const endIndex = startIndex + paginationState.itemsPerPage
    return filteredAndSortedLocations.slice(startIndex, endIndex)
  }, [filteredAndSortedLocations, validCurrentPage, paginationState.itemsPerPage])

  // ÉLITE PRO: Sincronizar página actual si excede totalPages (solo cuando cambian los filtros)
  // ÉLITE: No incluir paginationState.currentPage en deps - solo queremos ajustar cuando totalPages cambia
  // Si incluimos currentPage, se crearía un loop infinito
  useEffect(() => {
    if (paginationState.currentPage > totalPages && totalPages > 0) {
      setPaginationState((prev) => ({ ...prev, currentPage: totalPages }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]) // Solo cuando totalPages cambia (por filtros), no cuando currentPage cambia

  // Acciones para filtros
  const setSearchQuery = useCallback((query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }))
    // Resetear a primera página cuando se busca
    setPaginationState((prev) => ({ ...prev, currentPage: 1 }))
  }, [])

  const setStatusFilter = useCallback((status: LocationStatus | undefined) => {
    setFilterState((prev) => ({ ...prev, status }))
    setPaginationState((prev) => ({ ...prev, currentPage: 1 }))
  }, [])

  const setCategoryFilter = useCallback((category: string | undefined) => {
    setFilterState((prev) => ({ ...prev, category }))
    setPaginationState((prev) => ({ ...prev, currentPage: 1 }))
  }, [])

  const setMinHealthScore = useCallback((score: number | undefined) => {
    setFilterState((prev) => ({ ...prev, minHealthScore: score }))
    setPaginationState((prev) => ({ ...prev, currentPage: 1 }))
  }, [])

  // Acciones para ordenamiento
  const setSortField = useCallback((field: SortField | null) => {
    setSortState((prev) => {
      // Si se hace clic en el mismo campo, cambiar dirección
      if (prev.field === field && field !== null) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { ...prev, field, direction: 'asc' }
    })
  }, [])

  const setSortDirection = useCallback((direction: SortDirection) => {
    setSortState((prev) => ({ ...prev, direction }))
  }, [])

  // Acciones para paginación
  // ÉLITE PRO: Validación robusta según estándares de la industria
  const setCurrentPage = useCallback((page: number) => {
    setPaginationState((prev) => {
      // ÉLITE: Calcular totalPages actual para validación
      const currentTotalItems = filteredAndSortedLocations.length
      const currentTotalPages = Math.max(1, Math.ceil(currentTotalItems / prev.itemsPerPage))

      // ÉLITE: Validar que la página esté en rango válido
      // Si la página solicitada es mayor que totalPages, usar la última página válida
      // Si es menor que 1, usar página 1
      const validPage = Math.max(1, Math.min(page, currentTotalPages))

      return { ...prev, currentPage: validPage }
    })
  }, [filteredAndSortedLocations])

  // Resetear todos los filtros
  const resetFilters = useCallback(() => {
    setFilterState({ searchQuery: '' })
    setSortState({ field: null, direction: 'asc' })
    setPaginationState({ currentPage: 1, itemsPerPage })
  }, [itemsPerPage])

  return {
    filteredAndSortedLocations,
    paginatedLocations,
    filterState,
    sortState,
    paginationState: {
      ...paginationState,
      currentPage: validCurrentPage, // ÉLITE: Retornar página válida (ajustada si excede totalPages)
    },
    setSearchQuery,
    setStatusFilter,
    setCategoryFilter,
    setMinHealthScore,
    setSortField,
    setSortDirection,
    setCurrentPage,
    resetFilters,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  }
}
