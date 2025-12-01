/**
 * Get Media
 *
 * ÉLITE PRO: Obtiene media (fotos/videos) de una ubicación de Google Business Profile
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
import type { GBPMediaResponse } from './types'
import type { ReadonlyRequestCookies } from '@/utils/supabase/server'

export interface GetMediaParams {
  accountId: string
  locationId: string
  pageSize?: number
  pageToken?: string
}

export interface GetMediaResult {
  media: GBPMediaResponse | null
  error?: string
}

/**
 * Función interna que obtiene el media
 * ÉLITE: Separada para poder cachearla
 */
async function _getMediaInternal(
  accountId: string,
  locationId: string,
  userId: string,
  cookieStore: ReadonlyRequestCookies,
  options?: {
    pageSize?: number
    pageToken?: string
  }
): Promise<GetMediaResult> {
  try {
    const client = await createGBPClient(userId, cookieStore)

    // ÉLITE: Obtener media
    const mediaResponse = await client.listMedia(accountId, locationId, {
      pageSize: options?.pageSize || 50,
      pageToken: options?.pageToken,
    })

    return {
      media: mediaResponse as GBPMediaResponse,
    }
  } catch (error) {
    console.error(`[GBP getMedia] Error fetching media for location ${locationId}:`, error)
    return {
      media: null,
      error: error instanceof Error ? error.message : 'Failed to fetch media',
    }
  }
}

/**
 * Obtiene media de una ubicación
 *
 * @param params - Parámetros para obtener media
 * @returns Media o error
 */
export async function getMedia(params: GetMediaParams): Promise<GetMediaResult> {
  // ÉLITE: Obtener cookies FUERA de unstable_cache (requisito de Next.js 15)
  const cookieStore = await cookies()

  const supabase = await createClient(cookieStore)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { media: null, error: 'User not authenticated' }
  }

  // ÉLITE: Cache con revalidate de 10 minutos (600 segundos) - media cambia menos frecuentemente
  const getCachedMedia = unstable_cache(
    async (
      accountId: string,
      locationId: string,
      userId: string,
      cookies: ReadonlyRequestCookies,
      options?: { pageSize?: number; pageToken?: string }
    ) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GBP Cache] Fetching media for location: ${locationId} (cache miss)`)
      }
      return _getMediaInternal(accountId, locationId, userId, cookies, options)
    },
    [`gbp-media-${params.accountId}-${params.locationId}-${params.pageToken || 'first'}-${user.id}`],
    {
      revalidate: 600, // 10 minutos
      tags: [
        'gbp-media',
        `gbp-media-${params.accountId}`,
        `gbp-media-${params.locationId}`,
        `gbp-media-user-${user.id}`,
      ],
    }
  )

  return getCachedMedia(
    params.accountId,
    params.locationId,
    user.id,
    cookieStore,
    {
      pageSize: params.pageSize,
      pageToken: params.pageToken,
    }
  )
}

