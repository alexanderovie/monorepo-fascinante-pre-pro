/**
 * Tipos TypeScript para el sistema de reserva de citas
 * Definiciones compartidas entre servicios y componentes
 */

/**
 * Información de disponibilidad para un día específico
 */
export interface DayAvailability {
  /** Fecha en formato ISO string (YYYY-MM-DD) */
  date: string;
  /** Número de horarios disponibles */
  slotsDisponibles: number;
  /** Número total de horarios posibles */
  slotsTotales: number;
  /** Número de horarios ocupados */
  slotsOcupados: number;
  /** Porcentaje de disponibilidad (0-100) */
  porcentaje: number;
  /** Lista de horarios disponibles en formato HH:MM */
  horariosDisponibles: string[];
  /** Lista de horarios ocupados en formato HH:MM */
  horariosOcupados: string[];
}

/**
 * Disponibilidad para un rango de fechas
 * Key es la fecha en formato YYYY-MM-DD
 */
export type AvailabilityMap = Record<string, DayAvailability>;

/**
 * Configuración de disponibilidad desde la base de datos
 */
export interface AvailabilitySettings {
  id: string;
  professional_id: string;
  slot_duration_minutes: number;
  buffer_time_minutes: number;
  timezone: string;
  allow_same_day_booking: boolean;
  max_advance_days: number;
  monday_start: string | null;
  monday_end: string | null;
  tuesday_start: string | null;
  tuesday_end: string | null;
  wednesday_start: string | null;
  wednesday_end: string | null;
  thursday_start: string | null;
  thursday_end: string | null;
  friday_start: string | null;
  friday_end: string | null;
  saturday_start: string | null;
  saturday_end: string | null;
  sunday_start: string | null;
  sunday_end: string | null;
}

/**
 * Cita desde la base de datos
 */
export interface Appointment {
  id: string;
  professional_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  location: 'virtual' | 'office';
}

/**
 * Fecha bloqueada desde la base de datos
 */
export interface BlockedDate {
  id: string;
  professional_id: string;
  date: string;
  reason: string | null;
  all_day: boolean;
  start_time: string | null;
  end_time: string | null;
}

/**
 * Resultado del cálculo de disponibilidad
 */
export interface AvailabilityResult {
  /** Mapa de disponibilidad por fecha */
  availability: AvailabilityMap;
  /** Si hubo un error al calcular */
  error: string | null;
  /** Mensaje descriptivo del resultado */
  message?: string;
}

