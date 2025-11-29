/**
 * Calendar Hooks - Hooks Reutilizables
 *
 * Hooks personalizados para manejar el estado y lógica del calendario.
 * Encapsula toda la lógica de negocio de manera reutilizable.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  CalendarConfig,
  CalendarWeek,
  MonthIndex,
  UseCalendarReturn,
} from './types';
import {
  generateCalendarWeeks,
  isDateInRange,
} from './utils';
import { DEFAULT_CALENDAR_CONFIG } from './constants';

/**
 * Hook principal para manejar el estado y lógica del calendario
 *
 * @param config - Configuración del calendario
 * @param selectedDate - Fecha seleccionada externamente (controlado)
 * @param onDateSelect - Callback cuando se selecciona una fecha
 * @returns Objeto con estado y funciones de control del calendario
 *
 * @example
 * ```tsx
 * const calendar = useCalendar({
 *   locale: 'es',
 *   variant: 'cal-com',
 *   weekStart: 'sunday',
 * });
 *
 * return (
 *   <Calendar
 *     currentMonth={calendar.currentMonth}
 *     currentYear={calendar.currentYear}
 *     weeks={calendar.weeks}
 *     onDayClick={calendar.selectDate}
 *   />
 * );
 * ```
 */
export function useCalendar(
  config: CalendarConfig,
  selectedDate?: Date,
  onDateSelect?: (date: Date) => void
): UseCalendarReturn {
  // Merge config con defaults (memoizado para evitar re-renders)
  const finalConfig = useMemo(
    (): CalendarConfig => ({
      locale: config.locale ?? DEFAULT_CALENDAR_CONFIG.locale,
      variant: config.variant ?? DEFAULT_CALENDAR_CONFIG.variant,
      weekdayFormat:
        config.weekdayFormat ?? DEFAULT_CALENDAR_CONFIG.weekdayFormat,
      weekStart: config.weekStart ?? DEFAULT_CALENDAR_CONFIG.weekStart,
      dateRange: config.dateRange,
      isDateAvailable: config.isDateAvailable,
      isDateDisabled: config.isDateDisabled,
    }),
    [
      config.locale,
      config.variant,
      config.weekdayFormat,
      config.weekStart,
      config.dateRange,
      config.isDateAvailable,
      config.isDateDisabled,
    ]
  );

  // Obtener mes/año inicial
  const getInitialMonth = (): MonthIndex => {
    if (selectedDate) {
      return selectedDate.getMonth() as MonthIndex;
    }
    return new Date().getMonth() as MonthIndex;
  };

  const getInitialYear = (): number => {
    if (selectedDate) {
      return selectedDate.getFullYear();
    }
    return new Date().getFullYear();
  };

  // Estado interno del mes/año visible
  const [currentMonth, setCurrentMonth] = useState<MonthIndex>(getInitialMonth);
  const [currentYear, setCurrentYear] = useState<number>(getInitialYear);

  // Estado interno de fecha seleccionada (para modo no controlado)
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(
    selectedDate
  );

  // Sincronizar con fecha seleccionada externa
  useEffect(() => {
    if (selectedDate) {
      setInternalSelectedDate(selectedDate);
      setCurrentMonth(selectedDate.getMonth() as MonthIndex);
      setCurrentYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  // Determinar fecha seleccionada (controlada vs no controlada)
  const activeSelectedDate = selectedDate ?? internalSelectedDate;

  // Generar semanas del calendario
  const weeks: CalendarWeek[] = useMemo(() => {
    return generateCalendarWeeks(
      currentMonth,
      currentYear,
      finalConfig.weekStart,
      finalConfig.isDateAvailable,
      finalConfig.isDateDisabled,
      finalConfig.dateRange,
      activeSelectedDate
    );
  }, [
    currentMonth,
    currentYear,
    finalConfig.weekStart,
    finalConfig.isDateAvailable,
    finalConfig.isDateDisabled,
    finalConfig.dateRange,
    activeSelectedDate,
  ]);

  // Navegar al mes anterior
  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => (prev - 1) as MonthIndex);
    }
  }, [currentMonth]);

  // Navegar al mes siguiente
  const goToNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => (prev + 1) as MonthIndex);
    }
  }, [currentMonth]);

  // Cambiar de mes
  const setMonth = useCallback(
    (month: MonthIndex) => {
      setCurrentMonth(month);
    },
    []
  );

  // Cambiar de año
  const setYear = useCallback((year: number) => {
    setCurrentYear(year);
  }, []);

  // Seleccionar una fecha
  const selectDate = useCallback(
    (date: Date) => {
      // Validar que la fecha esté en rango
      if (!isDateInRange(date, finalConfig.dateRange)) {
        return;
      }

      // Validar con función personalizada si existe
      if (finalConfig.isDateDisabled && finalConfig.isDateDisabled(date)) {
        return;
      }

      // Actualizar estado interno si no es controlado
      if (!selectedDate) {
        setInternalSelectedDate(date);
      }

      // Cambiar vista al mes de la fecha seleccionada
      setCurrentMonth(date.getMonth() as MonthIndex);
      setCurrentYear(date.getFullYear());

      // Llamar callback externo
      onDateSelect?.(date);
    },
    [finalConfig, selectedDate, onDateSelect]
  );

  // Ir a una fecha específica (sin seleccionarla)
  const goToDate = useCallback((date: Date) => {
    setCurrentMonth(date.getMonth() as MonthIndex);
    setCurrentYear(date.getFullYear());
  }, []);

  // Ir al mes actual
  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today.getMonth() as MonthIndex);
    setCurrentYear(today.getFullYear());

    // Si no hay fecha seleccionada, seleccionar hoy
    if (!activeSelectedDate) {
      selectDate(today);
    }
  }, [activeSelectedDate, selectDate]);

  // Verificar si una fecha está disponible
  const isDateAvailable = useCallback(
    (date: Date): boolean => {
      // Verificar rango
      if (!isDateInRange(date, finalConfig.dateRange)) {
        return false;
      }

      // Verificar función personalizada
      if (finalConfig.isDateDisabled && finalConfig.isDateDisabled(date)) {
        return false;
      }

      // Verificar función de disponibilidad personalizada
      if (finalConfig.isDateAvailable) {
        return finalConfig.isDateAvailable(date);
      }

      return true;
    },
    [finalConfig]
  );

  // Verificar si una fecha está deshabilitada
  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      // Verificar rango
      if (!isDateInRange(date, finalConfig.dateRange)) {
        return true;
      }

      // Verificar función personalizada
      if (finalConfig.isDateDisabled) {
        return finalConfig.isDateDisabled(date);
      }

      return false;
    },
    [finalConfig]
  );

  return {
    currentMonth,
    currentYear,
    selectedDate: activeSelectedDate,
    weeks,
    goToPrevMonth,
    goToNextMonth,
    setMonth,
    setYear,
    selectDate,
    goToDate,
    goToToday,
    isDateAvailable,
    isDateDisabled,
  };
}

/**
 * Hook simplificado para calendario no controlado
 *
 * Útil cuando no necesitas control externo del estado.
 *
 * @param config - Configuración del calendario
 * @returns Objeto con estado y funciones de control del calendario
 */
export function useUncontrolledCalendar(
  config: CalendarConfig
): Omit<UseCalendarReturn, 'selectedDate'> & {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
} {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const calendar = useCalendar(config, selectedDate, setSelectedDate);

  return {
    ...calendar,
    selectedDate: calendar.selectedDate,
    onDateSelect: calendar.selectDate,
  };
}
