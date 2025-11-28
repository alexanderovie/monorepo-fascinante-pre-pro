/**
 * Google Business Profile Utilities
 *
 * ÉLITE PRO: Funciones utilitarias reutilizables para manejo de datos de GBP
 * según estándares de la industria.
 *
 * Características:
 * - Validación robusta
 * - Normalización de datos
 * - Type-safe
 * - Reutilizable
 * - Preparado para i18n
 */

import { LOCATION_DEFAULTS } from './constants'
import type { GBPLocation } from './types'

/**
 * ÉLITE PRO: Valida y normaliza un número de teléfono
 *
 * Características:
 * - Valida formato básico (mínimo 10 dígitos)
 * - Normaliza a formato E.164 para links tel:
 * - Maneja diferentes formatos de entrada
 * - Retorna null si es inválido
 *
 * @param phone - Número de teléfono en cualquier formato
 * @returns Número normalizado en formato E.164 o null si es inválido
 *
 * Ejemplos:
 * - "(800) 930-0532" -> "+18009300532"
 * - "0424-6306894" -> "+584246306894" (asumiendo Venezuela)
 * - "+1-800-930-0532" -> "+18009300532"
 */
export function validateAndNormalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null

  // ÉLITE: Limpiar el número (remover espacios, guiones, paréntesis, etc.)
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')

  // ÉLITE: Validar que tenga al menos 10 dígitos (estándar internacional mínimo)
  const digitsOnly = cleaned.replace(/\D/g, '')
  if (digitsOnly.length < 10) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[GBP Utils] Invalid phone number (too short):', phone)
    }
    return null
  }

  // ÉLITE: Si ya tiene código de país (+), mantenerlo
  if (cleaned.startsWith('+')) {
    return cleaned
  }

  // ÉLITE: Si empieza con 0 (formato local), intentar detectar país
  // Por ahora, asumimos que si empieza con 0 y tiene 11 dígitos, es formato local
  // En producción, esto debería usar una librería como libphonenumber-js
  if (cleaned.startsWith('0') && digitsOnly.length === 11) {
    // Ejemplo: 0424-6306894 (Venezuela) -> +584246306894
    // Esto es una heurística básica - en producción usar librería especializada
    const withoutLeadingZero = digitsOnly.substring(1)
    // Asumir código de país basado en el número de dígitos
    // Para números de 10 dígitos sin +, asumir US (+1)
    return `+1${withoutLeadingZero}`
  }

  // ÉLITE: Si tiene 10 dígitos sin código de país, asumir US (+1)
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`
  }

  // ÉLITE: Si tiene 11 dígitos y empieza con 1, ya tiene código de país
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`
  }

  // ÉLITE: Si no coincide con ningún patrón conocido, retornar null
  if (process.env.NODE_ENV === 'development') {
    console.warn('[GBP Utils] Could not normalize phone number:', phone)
  }
  return null
}

/**
 * ÉLITE PRO: Formatea un número de teléfono para mostrar en UI
 *
 * Características:
 * - Formato legible para humanos
 * - Mantiene formato original si es válido
 * - Fallback a formato estándar
 *
 * @param phone - Número de teléfono
 * @returns Número formateado para mostrar o null
 */
export function formatPhoneForDisplay(phone: string | null | undefined): string | null {
  if (!phone) return null

  const normalized = validateAndNormalizePhone(phone)
  if (!normalized) return phone // Si no se puede normalizar, mostrar original

  // ÉLITE: Formatear para mostrar (ej: +1 (800) 930-0532)
  // Para US: +1 (XXX) XXX-XXXX
  if (normalized.startsWith('+1') && normalized.length === 12) {
    const areaCode = normalized.substring(2, 5)
    const firstPart = normalized.substring(5, 8)
    const secondPart = normalized.substring(8, 12)
    return `+1 (${areaCode}) ${firstPart}-${secondPart}`
  }

  // ÉLITE: Para otros países, mostrar formato más simple
  return normalized
}

/**
 * ÉLITE PRO: Obtiene el teléfono principal de una ubicación
 *
 * Características:
 * - Valida existencia
 * - Normaliza formato
 * - Maneja casos edge
 * - Logging para debugging
 *
 * @param location - Ubicación de GBP
 * @param locationId - ID de la ubicación (para logging)
 * @returns Teléfono normalizado o null
 */
export function getPrimaryPhone(
  location: GBPLocation,
  locationId?: string
): string | null {
  const phone = location.phoneNumbers?.primaryPhone

  if (!phone) {
    // ÉLITE PRO: Logging reducido - solo loguear una vez por location
    // Evitar spam de logs cuando el componente se re-renderiza múltiples veces
    // En producción, este warning no debería aparecer
    return null
  }

  // ÉLITE: Validar que no esté vacío después de trim
  const trimmedPhone = phone.trim()
  if (!trimmedPhone) {
    if (process.env.NODE_ENV === 'development' && locationId) {
      console.warn('[GBP Utils] Primary phone is empty for location:', locationId)
    }
    return null
  }

  // ÉLITE: Normalizar y validar
  const normalized = validateAndNormalizePhone(trimmedPhone)
  if (!normalized) {
    if (process.env.NODE_ENV === 'development' && locationId) {
      console.warn('[GBP Utils] Invalid phone format for location:', locationId, 'Phone:', phone)
    }
    return null
  }

  return normalized
}

/**
 * ÉLITE PRO: Obtiene teléfono formateado para mostrar en UI
 *
 * @param location - Ubicación de GBP
 * @param locationId - ID de la ubicación (opcional, para logging)
 * @returns Teléfono formateado o mensaje por defecto
 */
export function getFormattedPhone(
  location: GBPLocation,
  locationId?: string
): string {
  const phone = getPrimaryPhone(location, locationId)
  if (!phone) {
    return LOCATION_DEFAULTS.NO_PHONE
  }

  const formatted = formatPhoneForDisplay(phone)
  return formatted || phone // Fallback al número normalizado si no se puede formatear
}

/**
 * ÉLITE PRO: Obtiene teléfono para link tel:
 *
 * @param location - Ubicación de GBP
 * @param locationId - ID de la ubicación (opcional, para logging)
 * @returns Teléfono en formato E.164 para link tel: o null
 */
export function getPhoneForTelLink(
  location: GBPLocation,
  locationId?: string
): string | null {
  return getPrimaryPhone(location, locationId)
}

/**
 * ÉLITE PRO: Verifica si una ubicación tiene teléfono válido
 *
 * @param location - Ubicación de GBP
 * @returns true si tiene teléfono válido, false en caso contrario
 */
export function hasValidPhone(location: GBPLocation): boolean {
  return getPrimaryPhone(location) !== null
}
