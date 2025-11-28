/**
 * Get Attributes
 *
 * ÉLITE PRO: Obtiene y gestiona atributos de una ubicación de Google Business Profile
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
import type { GBPLocationAttributesResponse, GBPAvailableAttributesResponse } from './types'
import type { ReadonlyRequestCookies } from '@/utils/supabase/server'

export interface GetAttributesResult {
  attributes: GBPLocationAttributesResponse | null
  error?: string
}

export interface GetAvailableAttributesResult {
  attributes: GBPAvailableAttributesResponse | null
  error?: string
}

/**
 * Función interna que obtiene los atributos de una ubicación
 */
async function _getLocationAttributesInternal(
  locationId: string,
  userId: string,
  cookieStore: ReadonlyRequestCookies
): Promise<GetAttributesResult> {
  try {
    const client = await createGBPClient(userId, cookieStore)
    const attributesResponse = await client.getLocationAttributes(locationId)

    return {
      attributes: attributesResponse as GBPLocationAttributesResponse,
    }
  } catch (error) {
    console.error(`[GBP getLocationAttributes] Error fetching attributes for location ${locationId}:`, error)
    return {
      attributes: null,
      error: error instanceof Error ? error.message : 'Failed to fetch attributes',
    }
  }
}

/**
 * Obtiene atributos de una ubicación
 */
export async function getLocationAttributes(locationId: string): Promise<GetAttributesResult> {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { attributes: null, error: 'User not authenticated' }
  }

  const getCachedAttributes = unstable_cache(
    async (locationId: string, userId: string, cookies: ReadonlyRequestCookies) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GBP Cache] Fetching attributes for location: ${locationId} (cache miss)`)
      }
      return _getLocationAttributesInternal(locationId, userId, cookies)
    },
    [`gbp-attributes-${locationId}-${user.id}`],
    {
      revalidate: 300, // 5 minutos
      tags: ['gbp-attributes', `gbp-attributes-${locationId}`, `gbp-attributes-user-${user.id}`],
    }
  )

  return getCachedAttributes(locationId, user.id, cookieStore)
}

/**
 * Obtiene atributos disponibles para una ubicación
 */
export async function getAvailableAttributes(locationId: string): Promise<GetAvailableAttributesResult> {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { attributes: null, error: 'User not authenticated' }
  }

  try {
    const client = await createGBPClient(user.id, cookieStore)
    const attributesResponse = await client.getAvailableAttributes(locationId)

    return {
      attributes: attributesResponse as GBPAvailableAttributesResponse,
    }
  } catch (error) {
    console.error(`[GBP getAvailableAttributes] Error fetching available attributes for location ${locationId}:`, error)
    return {
      attributes: null,
      error: error instanceof Error ? error.message : 'Failed to fetch available attributes',
    }
  }
}

// ÉLITE: updateLocationAttributes movido a actions.ts para evitar importar cookies() en Client Components
