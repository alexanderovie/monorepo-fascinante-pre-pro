/**
 * Calculate Location Progress
 *
 * ÉLITE: Calcula el progreso de completitud de una ubicación de Google Business Profile
 * basado en los campos requeridos.
 *
 * Características:
 * - Score de 0-5 basado en campos completados
 * - Porcentaje de 0-100
 * - Lista de campos completados y faltantes
 *
 * Referencia: Basado en mejores prácticas de completitud de perfiles
 */

import type { GBPLocation, LocationProgress } from './types'

/**
 * Calcula el progreso de completitud de una ubicación
 * ÉLITE: Basado en 6 campos esenciales
 *
 * Campos evaluados:
 * 1. title - Nombre del negocio
 * 2. address - Dirección completa
 * 3. phone - Número de teléfono
 * 4. website - Sitio web
 * 5. hours - Horarios de atención
 * 6. category - Categoría principal
 */
export function calculateLocationProgress(location: GBPLocation): LocationProgress {
  const fields = {
    title: !!location.title,
    address: !!location.storefrontAddress?.addressLines?.length,
    phone: !!location.phoneNumbers?.length && !!location.phoneNumbers[0]?.phoneNumber,
    website: !!location.websiteUri,
    hours: !!location.regularHours?.periods?.length,
    category: !!location.categories?.primaryCategory,
  }

  const completedFields = Object.entries(fields)
    .filter(([_, completed]) => completed)
    .map(([field]) => field)

  const missingFields = Object.entries(fields)
    .filter(([_, completed]) => !completed)
    .map(([field]) => field)

  const completedCount = completedFields.length
  const totalFields = Object.keys(fields).length
  const percentage = Math.round((completedCount / totalFields) * 100)
  const score = Math.round((completedCount / totalFields) * 5) // 0-5

  return {
    score,
    percentage,
    completedFields,
    missingFields,
  }
}
