/**
 * Get Place Actions
 *
 * ÉLITE PRO: Obtiene y gestiona place actions (acciones de lugar) de una ubicación
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
import type { GBPPlaceActionsResponse, GBPPlaceActionTypeMetadata } from './types'
import type { ReadonlyRequestCookies } from '@/utils/supabase/server'

export interface GetPlaceActionsResult {
  placeActions: GBPPlaceActionsResponse | null
  error?: string
}

export interface GetPlaceActionTypeMetadataResult {
  metadata: GBPPlaceActionTypeMetadata[] | null
  error?: string
}

/**
 * Función interna que obtiene los place actions
 */
async function _getPlaceActionsInternal(
  locationId: string,
  userId: string,
  cookieStore: ReadonlyRequestCookies
): Promise<GetPlaceActionsResult> {
  try {
    const client = await createGBPClient(userId, cookieStore)
    const placeActionsResponse = await client.listPlaceActions(locationId)

    return {
      placeActions: placeActionsResponse as GBPPlaceActionsResponse,
    }
  } catch (error) {
    console.error(`[GBP getPlaceActions] Error fetching place actions for location ${locationId}:`, error)
    return {
      placeActions: null,
      error: error instanceof Error ? error.message : 'Failed to fetch place actions',
    }
  }
}

/**
 * Obtiene place actions de una ubicación
 */
export async function getPlaceActions(locationId: string): Promise<GetPlaceActionsResult> {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { placeActions: null, error: 'User not authenticated' }
  }

  const getCachedPlaceActions = unstable_cache(
    async (locationId: string, userId: string, cookies: ReadonlyRequestCookies) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GBP Cache] Fetching place actions for location: ${locationId} (cache miss)`)
      }
      return _getPlaceActionsInternal(locationId, userId, cookies)
    },
    [`gbp-place-actions-${locationId}-${user.id}`],
    {
      revalidate: 300, // 5 minutos
      tags: ['gbp-place-actions', `gbp-place-actions-${locationId}`, `gbp-place-actions-user-${user.id}`],
    }
  )

  return getCachedPlaceActions(locationId, user.id, cookieStore)
}

/**
 * Obtiene metadata de tipos de place actions disponibles
 */
export async function getPlaceActionTypeMetadata(): Promise<GetPlaceActionTypeMetadataResult> {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { metadata: null, error: 'User not authenticated' }
  }

  try {
    const client = await createGBPClient(user.id, cookieStore)
    const metadataResponse = await client.getPlaceActionTypeMetadata()

    return {
      metadata: (metadataResponse as any)?.placeActionTypeMetadata || null,
    }
  } catch (error) {
    console.error('[GBP getPlaceActionTypeMetadata] Error:', error)
    return {
      metadata: null,
      error: error instanceof Error ? error.message : 'Failed to fetch place action type metadata',
    }
  }
}

// ÉLITE: createPlaceAction y updatePlaceAction movidos a actions.ts para evitar importar cookies() en Client Components
