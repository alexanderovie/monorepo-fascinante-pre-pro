/**
 * Get Location Detail
 *
 * ÉLITE PRO: Obtiene los detalles completos de una ubicación específica
 * según estándares de la industria.
 *
 * Características:
 * - Server Component compatible
 * - Cache con unstable_cache
 * - Manejo robusto de errores
 * - Type-safe
 */

import { unstable_cache } from 'next/cache'
import { createGBPClient } from '../integrations/gbp-client'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import type { GBPLocation } from './types'

// ÉLITE: En Next.js 15, ReadonlyRequestCookies no se exporta directamente
// Usamos el tipo inferido de cookies()
type ReadonlyRequestCookies = Awaited<ReturnType<typeof cookies>>

export interface LocationDetailResult {
  location: GBPLocation | null
  error?: string
}

/**
 * Función interna que obtiene los datos de la ubicación
 * ÉLITE: Separada para poder cachearla
 */
async function _getLocationDetailInternal(
  locationId: string,
  userId: string,
  cookieStore: ReadonlyRequestCookies
): Promise<LocationDetailResult> {
  try {
    const client = await createGBPClient(userId, cookieStore)

    // ÉLITE: Obtener todos los campos relevantes para la página de detalle
    // Referencia: https://developers.google.com/my-business/content/location-data#get_a_location_by_name
    // IMPORTANTE: Usar solo campos válidos según documentación oficial
    // Campos probados y funcionando en get-locations-table-data.ts
    const readMask = [
      'name',
      'title',
      'categories',
      'storefrontAddress',
      'phoneNumbers',
      'websiteUri',
      'regularHours',
      'openInfo',
      'metadata',
    ].join(',')
    // ÉLITE: updateTime y createTime vienen automáticamente en la respuesta sin incluirlos en readMask
    // specialHours no es un campo válido en readMask según la API

    const location = await client.getLocation(locationId, readMask)

    return { location }
  } catch (error) {
    console.error(`[GBP getLocationDetail] Error fetching location ${locationId}:`, error)
    return {
      location: null,
      error: error instanceof Error ? error.message : 'Failed to fetch location details',
    }
  }
}

/**
 * Obtiene los detalles completos de una ubicación
 *
 * @param locationId - ID de la ubicación (sin prefijo "locations/")
 * @returns Detalles de la ubicación o error
 */
export async function getLocationDetail(locationId: string): Promise<LocationDetailResult> {
  // ÉLITE: Obtener cookies FUERA de unstable_cache (requisito de Next.js 15)
  const cookieStore = await cookies()

  const supabase = await createClient(cookieStore)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { location: null, error: 'User not authenticated' }
  }

  // ÉLITE PRO: Cache con revalidate de 5 minutos (300 segundos)
  // Tags para invalidación on-demand
  // Logging optimizado - solo eventos importantes
  const getCachedLocation = unstable_cache(
    async (locationId: string, userId: string, cookies: ReadonlyRequestCookies) => {
      // ÉLITE PRO: Logging reducido - solo en casos de error o debugging específico
      return _getLocationDetailInternal(locationId, userId, cookies)
    },
    [`gbp-location-detail-${locationId}-${user.id}`],
    {
      revalidate: 300, // 5 minutos - balance entre frescura y performance
      tags: ['gbp-locations', `gbp-location-${locationId}`, `gbp-location-user-${user.id}`],
    }
  )

  return getCachedLocation(locationId, user.id, cookieStore)
}
