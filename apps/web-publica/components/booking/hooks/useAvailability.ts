/**
 * Hook personalizado para gestionar la disponibilidad de citas
 *
 * Este hook:
 * - Carga la disponibilidad cuando cambia el mes
 * - Maneja estados de loading, error y success
 * - Proporciona funciones para obtener disponibilidad de un día específico
 *
 * ARQUITECTURA CORREGIDA: Usa API Route en lugar de importar funciones del servidor
 *
 * Uso:
 *   const { availability, isLoading, error } = useAvailability(selectedMonth);
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DayAvailability, AvailabilityMap } from '@/lib/appointments/types';
import { startOfMonth, format } from 'date-fns';

interface AvailabilityApiResponse {
  availability: AvailabilityMap;
  error: string | null;
  message?: string;
  warning?: boolean;
}

interface UseAvailabilityReturn {
  /** Mapa de disponibilidad por fecha (YYYY-MM-DD) */
  availability: AvailabilityMap;
  /** Si está cargando la disponibilidad */
  isLoading: boolean;
  /** Error si hubo algún problema */
  error: string | null;
  /** Si hay un warning (error pero con datos de fallback) */
  warning: boolean | null;
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
  const [warning, setWarning] = useState<boolean | null>(null);

  // Normalizar el mes al inicio del mes para evitar recargas innecesarias
  const monthKey = useMemo(() => {
    const monthStart = startOfMonth(month);
    return format(monthStart, 'yyyy-MM-dd');
  }, [month]);

  /**
   * Carga la disponibilidad para el mes especificado desde la API
   */
  const loadAvailability = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setWarning(null);

    try {
      // Normalizar mes al inicio del mes
      const monthStart = startOfMonth(month);
      const monthISO = format(monthStart, 'yyyy-MM-dd');

      // Llamar a la API route
      const response = await fetch(`/api/availability?month=${monthISO}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Cache strategy: no cache en el navegador, siempre fetch fresh
        cache: 'no-store',
      });

      // Verificar respuesta HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data: AvailabilityApiResponse = await response.json();

      // Manejar respuesta
      if (data.error && !data.warning) {
        // Error real sin datos
        setError(data.error);
        setAvailability({});
      } else if (data.warning) {
        // Warning: error pero con datos de fallback
        setWarning(true);
        setError(data.error);
        setAvailability(data.availability || {});
      } else {
        // Éxito
        setAvailability(data.availability || {});
        setError(null);
        setWarning(null);
      }
    } catch (err) {
      console.error('Error loading availability:', err);

      const errorMessage = err instanceof Error
        ? err.message
        : 'Error desconocido al cargar disponibilidad';

      setError(errorMessage);
      setWarning(null);

      // Mantener disponibilidad anterior si existe (no limpiar en caso de error)
      // Esto evita que la UI se quede en blanco si hay un error temporal
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
      const dateStr = format(date, 'yyyy-MM-dd');
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
    warning,
    getDayAvailability,
    hasManySlots,
    hasFewSlots,
    hasNoSlots,
    refetch,
  };
}
