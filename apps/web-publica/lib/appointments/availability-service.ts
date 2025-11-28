/**
 * Servicio de Disponibilidad - Capa de Lógica de Negocio
 *
 * Calcula la disponibilidad de horarios por día basándose en:
 * - Configuración de horarios del profesional
 * - Citas ya reservadas
 * - Días bloqueados/feriados
 *
 * Este servicio es robusto: maneja errores y siempre retorna datos válidos.
 */

import { createClient } from '@/lib/supabase/server';
import type {
  DayAvailability,
  AvailabilityMap,
  AvailabilitySettings,
  Appointment,
  BlockedDate,
  AvailabilityResult,
} from './types';

// Re-exportar tipos para uso externo
export type { AvailabilityResult };
import { format, parseISO, getDay, startOfDay } from 'date-fns';
import { startOfToday } from 'date-fns';

/**
 * Cache simple en memoria para evitar consultas repetidas
 * Key: fecha en formato YYYY-MM-DD
 * Value: DayAvailability
 */
const availabilityCache = new Map<string, AvailabilityMap>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const cacheTimestamps = new Map<string, number>();

/**
 * Limpia el cache después de TTL
 */
function isCacheValid(key: string): boolean {
  const timestamp = cacheTimestamps.get(key);
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_TTL;
}

/**
 * Invalida el cache de una fecha específica
 */
export function invalidateAvailabilityCache(date?: string) {
  if (date) {
    availabilityCache.delete(date);
    cacheTimestamps.delete(date);
  } else {
    availabilityCache.clear();
    cacheTimestamps.clear();
  }
}

/**
 * Obtiene la configuración de disponibilidad del profesional
 * Por ahora asumimos que solo hay un profesional (el dueño del sistema)
 */
async function getAvailabilitySettings(): Promise<AvailabilitySettings | null> {
  try {
    const supabase = createClient();

    // Por ahora buscamos el primer profesional disponible
    // TODO: En el futuro esto debería buscar por professional_id específico
    const { data, error } = await supabase
      .from('availability_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching availability settings:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching availability settings:', error);
    return null;
  }
}

/**
 * Obtiene las citas confirmadas o pendientes en un rango de fechas
 */
async function getAppointments(
  startDate: Date,
  endDate: Date
): Promise<Appointment[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('appointments')
      .select('id, professional_id, start_time, end_time, status, location')
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
      .in('status', ['pending', 'confirmed'])
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    // Asegurar que los datos coincidan con el tipo Appointment
    return (data || []).map((apt) => ({
      id: apt.id,
      professional_id: apt.professional_id,
      start_time: apt.start_time,
      end_time: apt.end_time,
      status: apt.status as Appointment['status'],
      location: (apt.location || 'virtual') as Appointment['location'],
    }));
  } catch (error) {
    console.error('Exception fetching appointments:', error);
    return [];
  }
}

/**
 * Obtiene los días bloqueados en un rango de fechas
 */
async function getBlockedDates(
  startDate: Date,
  endDate: Date
): Promise<BlockedDate[]> {
  try {
    const supabase = createClient();

    const startDateStr = format(startDate, 'yyyy-MM-dd');
    const endDateStr = format(endDate, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('blocked_dates')
      .select('*')
      .gte('date', startDateStr)
      .lte('date', endDateStr);

    if (error) {
      console.error('Error fetching blocked dates:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching blocked dates:', error);
    return [];
  }
}

/**
 * Genera todos los posibles horarios para un día según la configuración
 */
function generateTimeSlotsForDay(
  date: Date,
  settings: AvailabilitySettings
): string[] {
  const dayOfWeek = getDay(date); // 0 = domingo, 1 = lunes, etc.
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const dayName = dayNames[dayOfWeek];
  const startTimeKey = `${dayName}_start` as keyof AvailabilitySettings;
  const endTimeKey = `${dayName}_end` as keyof AvailabilitySettings;

  const startTime = settings[startTimeKey] as string | null;
  const endTime = settings[endTimeKey] as string | null;

  // Si no hay horario configurado para este día, retornar vacío
  if (!startTime || !endTime) {
    return [];
  }

  const slots: string[] = [];
  const slotDuration = settings.slot_duration_minutes || 30;

  // Parsear horarios (formato HH:MM:SS o HH:MM)
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    // Formatear como HH:MM
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeStr);

    // Avanzar el tiempo
    currentMin += slotDuration;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return slots;
}

/**
 * Verifica si un horario está disponible (no está ocupado ni bloqueado)
 */
function isSlotAvailable(
  date: Date,
  timeSlot: string,
  appointments: Appointment[],
  blockedDates: BlockedDate[],
  settings: AvailabilitySettings
): boolean {
  const dateStr = format(date, 'yyyy-MM-dd');
  const [hours, minutes] = timeSlot.split(':').map(Number);

  // Crear fecha completa del slot
  const slotDateTime = new Date(date);
  slotDateTime.setHours(hours, minutes, 0, 0);
  const slotEndTime = new Date(slotDateTime.getTime() + (settings.slot_duration_minutes || 30) * 60 * 1000);

  // Verificar si el día está completamente bloqueado
  const dayBlocked = blockedDates.find(
    (bd) => bd.date === dateStr && bd.all_day
  );
  if (dayBlocked) {
    return false;
  }

  // Verificar si el horario está parcialmente bloqueado
  const partialBlock = blockedDates.find(
    (bd) => bd.date === dateStr && !bd.all_day && bd.start_time && bd.end_time
  );
  if (partialBlock && partialBlock.start_time && partialBlock.end_time) {
    const blockStart = parseISO(`${dateStr}T${partialBlock.start_time}`);
    const blockEnd = parseISO(`${dateStr}T${partialBlock.end_time}`);
    if (
      (slotDateTime >= blockStart && slotDateTime < blockEnd) ||
      (slotEndTime > blockStart && slotEndTime <= blockEnd)
    ) {
      return false;
    }
  }

  // Verificar si hay una cita en este horario
  const conflictingAppointment = appointments.find((apt) => {
    const aptStart = parseISO(apt.start_time);
    const aptEnd = parseISO(apt.end_time);

    // Verificar solapamiento
    return (
      (slotDateTime >= aptStart && slotDateTime < aptEnd) ||
      (slotEndTime > aptStart && slotEndTime <= aptEnd) ||
      (slotDateTime <= aptStart && slotEndTime >= aptEnd)
    );
  });

  if (conflictingAppointment) {
    return false;
  }

  // Verificar que no sea una cita de mismo día si no está permitido
  const today = startOfToday();
  if (!settings.allow_same_day_booking && format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
    // Verificar si la hora actual ya pasó
    const now = new Date();
    if (slotDateTime <= now) {
      return false;
    }
  }

  return true;
}

/**
 * Calcula la disponibilidad para un día específico
 */
function calculateDayAvailability(
  date: Date,
  settings: AvailabilitySettings,
  appointments: Appointment[],
  blockedDates: BlockedDate[]
): DayAvailability {
  const dateStr = format(date, 'yyyy-MM-dd');
  const allSlots = generateTimeSlotsForDay(date, settings);

  const availableSlots: string[] = [];
  const occupiedSlots: string[] = [];

  allSlots.forEach((slot) => {
    if (isSlotAvailable(date, slot, appointments, blockedDates, settings)) {
      availableSlots.push(slot);
    } else {
      occupiedSlots.push(slot);
    }
  });

  const total = allSlots.length;
  const available = availableSlots.length;
  const occupied = occupiedSlots.length;
  const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

  return {
    date: dateStr,
    slotsDisponibles: available,
    slotsTotales: total,
    slotsOcupados: occupied,
    porcentaje: percentage,
    horariosDisponibles: availableSlots,
    horariosOcupados: occupiedSlots,
  };
}

/**
 * Función principal: Obtiene la disponibilidad para un rango de fechas
 *
 * @param startDate - Fecha de inicio del rango
 * @param endDate - Fecha de fin del rango
 * @returns Mapa de disponibilidad por fecha
 */
export async function getAvailabilityByDateRange(
  startDate: Date,
  endDate: Date
): Promise<AvailabilityResult> {
  try {
    // Verificar cache primero
    const cacheKey = `${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    if (availabilityCache.has(cacheKey) && isCacheValid(cacheKey)) {
      const cached = availabilityCache.get(cacheKey);
      if (cached) {
        return {
          availability: cached,
          error: null,
          message: 'Datos desde cache',
        };
      }
    }

    // Obtener configuración de disponibilidad
    const settings = await getAvailabilitySettings();
    if (!settings) {
      // Fallback: retornar disponibilidad por defecto (todos los días disponibles)
      return getDefaultAvailability(startDate, endDate);
    }

    // Obtener citas y días bloqueados
    const [appointments, blockedDates] = await Promise.all([
      getAppointments(startDate, endDate),
      getBlockedDates(startDate, endDate),
    ]);

    // Calcular disponibilidad día por día
    const availability: AvailabilityMap = {};
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayAvailability = calculateDayAvailability(
        currentDate,
        settings,
        appointments,
        blockedDates
      );
      availability[dayAvailability.date] = dayAvailability;

      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Guardar en cache
    availabilityCache.set(cacheKey, availability);
    cacheTimestamps.set(cacheKey, Date.now());

    return {
      availability,
      error: null,
      message: 'Disponibilidad calculada exitosamente',
    };
  } catch (error) {
    console.error('Error calculating availability:', error);

    // Fallback: retornar disponibilidad por defecto en caso de error
    return {
      availability: getDefaultAvailability(startDate, endDate).availability,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Usando disponibilidad por defecto debido a un error',
    };
  }
}

/**
 * Disponibilidad por defecto cuando no hay configuración o hay error
 * Asume que todos los días tienen horarios disponibles (9:00 - 17:00)
 */
function getDefaultAvailability(
  startDate: Date,
  endDate: Date
): AvailabilityResult {
  const availability: AvailabilityMap = {};
  const defaultSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00',
  ];

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    availability[dateStr] = {
      date: dateStr,
      slotsDisponibles: defaultSlots.length,
      slotsTotales: defaultSlots.length,
      slotsOcupados: 0,
      porcentaje: 100,
      horariosDisponibles: defaultSlots,
      horariosOcupados: [],
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    availability,
    error: null,
    message: 'Usando disponibilidad por defecto',
  };
}

/**
 * Obtiene la disponibilidad para un mes específico
 */
export async function getAvailabilityForMonth(month: Date): Promise<AvailabilityResult> {
  const startDate = startOfDay(new Date(month.getFullYear(), month.getMonth(), 1));
  const endDate = startOfDay(new Date(month.getFullYear(), month.getMonth() + 1, 0));

  return getAvailabilityByDateRange(startDate, endDate);
}
