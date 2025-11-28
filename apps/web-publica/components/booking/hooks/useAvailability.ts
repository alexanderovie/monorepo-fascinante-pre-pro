/**
 * Hook personalizado para gestionar la disponibilidad de citas
 *
 * Este hook:
 * - Carga la disponibilidad cuando cambia el mes
 * - Maneja estados de loading, error y success
 * - Proporciona funciones para obtener disponibilidad de un día específico
 *
 * Uso:
 *   const { availability, isLoading, error } = useAvailability(selectedMonth);
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAvailabilityForMonth } from '@/lib/appointments/availability-service';
import type { DayAvailability, AvailabilityMap, AvailabilityResult } from '@/lib/appointments/types';
import { startOfMonth } from 'date-fns';

interface UseAvailabilityReturn {
  /** Mapa de disponibilidad por fecha (YYYY-MM-DD) */
  availability: AvailabilityMap;
  /** Si está cargando la disponibilidad */
  isLoading: boolean;
  /** Error si hubo algún problema */
  error: string | null;
  /** Obtiene la disponibilidad de un día específico */
  getDayAvailability: (date: Date) => DayAvailability | null;
  /** Verifica si un día tiene muchos horarios disponibles (6+) */
  hasManySlots: (date: Date) => boolean;
  /** Verifica si un día tiene pocos horarios (1-5) */
  hasFewSlots: (date: Date) => boolean;
  /** Verifica si un día no tiene horarios disponibles */
  hasNoSlots: (date: Date) => boolean;
  /** Recargar la disponibilidad */
  refetch: () => Promise<void>;
}

/**
 * Hook para gestionar disponibilidad de citas
 *
 * @param month - Mes del cual se quiere obtener la disponibilidad
 * @returns Objeto con availability, estados de carga y funciones helper
 */
export function useAvailability(month: Date): UseAvailabilityReturn {
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Normalizar el mes al inicio del mes para evitar recargas innecesarias
  const monthKey = useMemo(() => {
    const monthStart = startOfMonth(month);
    return monthStart.toISOString();
  }, [month]);

  /**
   * Carga la disponibilidad para el mes especificado
   */
  const loadAvailability = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result: AvailabilityResult = await getAvailabilityForMonth(month);

      if (result.error) {
        setError(result.error);
        // Aún así, usar los datos disponibles (puede ser fallback)
        if (Object.keys(result.availability).length > 0) {
          setAvailability(result.availability);
        }
      } else {
        setAvailability(result.availability);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading availability:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      // Mantener disponibilidad anterior si existe (no limpiar)
    } finally {
      setIsLoading(false);
    }
  }, [month]);

  // Cargar disponibilidad cuando cambia el mes
  useEffect(() => {
    loadAvailability();
  }, [monthKey, loadAvailability]);

  /**
   * Obtiene la disponibilidad de un día específico
   */
  const getDayAvailability = useCallback(
    (date: Date): DayAvailability | null => {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      return availability[dateStr] || null;
    },
    [availability]
  );

  /**
   * Verifica si un día tiene muchos horarios disponibles (6+)
   */
  const hasManySlots = useCallback(
    (date: Date): boolean => {
      const dayAvail = getDayAvailability(date);
      return dayAvail ? dayAvail.slotsDisponibles >= 6 : false;
    },
    [getDayAvailability]
  );

  /**
   * Verifica si un día tiene pocos horarios (1-5)
   */
  const hasFewSlots = useCallback(
    (date: Date): boolean => {
      const dayAvail = getDayAvailability(date);
      return dayAvail ? dayAvail.slotsDisponibles > 0 && dayAvail.slotsDisponibles < 6 : false;
    },
    [getDayAvailability]
  );

  /**
   * Verifica si un día no tiene horarios disponibles
   */
  const hasNoSlots = useCallback(
    (date: Date): boolean => {
      const dayAvail = getDayAvailability(date);
      return dayAvail ? dayAvail.slotsDisponibles === 0 : true;
    },
    [getDayAvailability]
  );

  /**
   * Recarga la disponibilidad manualmente
   */
  const refetch = useCallback(async () => {
    await loadAvailability();
  }, [loadAvailability]);

  return {
    availability,
    isLoading,
    error,
    getDayAvailability,
    hasManySlots,
    hasFewSlots,
    hasNoSlots,
    refetch,
  };
}
