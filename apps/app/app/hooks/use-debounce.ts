/**
 * useDebounce Hook
 *
 * ÉLITE PRO: Hook reutilizable para debounce de valores.
 * Optimiza performance evitando actualizaciones excesivas en búsquedas y filtros.
 *
 * Basado en mejores prácticas de React 2025.
 */

import { useState, useEffect } from 'react'

/**
 * Hook para debounce de un valor
 * @param value - Valor a debounce
 * @param delay - Delay en milisegundos (default: 300ms)
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

