/**
 * Google Business Profile - Get Locations Data
 *
 * ÉLITE: Obtiene las ubicaciones de Google Business Profile desde la API
 * con cache automático de Next.js para carga instantánea.
 *
 * Características:
 * - Llamadas directas al cliente GBP (mejor práctica para Server Components)
 * - Cache con unstable_cache (recomendado por Next.js 15)
 * - Cache por 5 minutos con tags para invalidación
 * - Manejo robusto de errores
 * - Type-safe
 * - Formato optimizado para tabla
 *
 * Referencia oficial Next.js:
 * - https://nextjs.org/docs/app/building-your-application/caching#unstable_cache
 * - Server Components deben usar funciones directas, no fetch a API routes internas
 */

import { createClient } from '@/utils/supabase/server'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import { getGBPTokens } from '../integrations/gbp-tokens'
import { getLocationsTableData } from './get-locations-table-data'
import type { LocationTableRow } from './types'

// ÉLITE: En Next.js 15, ReadonlyRequestCookies no se exporta directamente
// Usamos el tipo inferido de cookies()
type ReadonlyRequestCookies = Awaited<ReturnType<typeof cookies>>

export interface LocationsDataResult {
  locations: LocationTableRow[]
  accountId: string | null
  error: string | null
}

/**
 * Función interna para obtener locations sin cache
 * ÉLITE: Separada para poder aplicar cache con unstable_cache
 *
 * IMPORTANTE: Recibe cookies como parámetro para cumplir con restricciones de unstable_cache
 */
async function _getLocationsDataInternal(
  accountId: string,
  includeHealthScore: boolean,
  userId: string,
  cookieStore: ReadonlyRequestCookies
): Promise<LocationsDataResult> {
  try {
    // Verificar que el usuario tiene tokens de GBP
    // ÉLITE: Pasar cookies como parámetro para evitar acceso dinámico dentro de cache
    const tokens = await getGBPTokens(userId, cookieStore)
    if (!tokens) {
      return {
        locations: [],
        accountId: null,
        error: 'No GBP tokens found. Please connect your Google Business Profile account.',
      }
    }

    // ÉLITE: No intentar cargar si accountId es mock
    if (accountId === '123456789' || accountId === '987654321') {
      return {
        locations: [],
        accountId,
        error: 'Mock account ID detected',
      }
    }

    // Obtener datos de la tabla usando la función existente
    // ÉLITE: Pasar cookies y userId como parámetros para evitar acceso dinámico dentro de cache
    const locations = await getLocationsTableData({
      accountId,
      includeHealthScore,
      cookieStore,
      userId,
    })

    return {
      locations,
      accountId,
      error: null,
    }
  } catch (error) {
    console.error('[GBP getLocationsData] Error fetching locations:', error)
    return {
      locations: [],
      accountId,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Obtiene las ubicaciones de Google Business Profile para una cuenta específica
 * ÉLITE: Usa unstable_cache de Next.js 15 (recomendado oficialmente)
 *
 * Según documentación oficial Next.js:
 * - Server Components deben usar funciones directas, no fetch a API routes
 * - unstable_cache es la forma recomendada de cachear funciones async
 * - Tags permiten invalidación granular con revalidateTag
 *
 * @param accountId - ID de la cuenta de GBP (sin prefijo "accounts/")
 * @param includeHealthScore - Si incluir health score (más lento pero más completo)
 * @returns Datos de ubicaciones formateados para tabla
 */
export async function getLocationsData(
  accountId: string,
  includeHealthScore: boolean = false
): Promise<LocationsDataResult> {
  // ÉLITE: Obtener cookies FUERA de unstable_cache (requisito de Next.js 15)
  const cookieStore = await cookies()

  const supabase = await createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      locations: [],
      accountId: null,
      error: 'User not authenticated',
    }
  }

  // ÉLITE PRO: Usar unstable_cache según documentación oficial Next.js 15
  // Cache key incluye accountId, includeHealthScore y userId para granularidad
  // Revalidate: 60 segundos (1 minuto) - reducido para ver cambios más rápido durante desarrollo
  // Tags: para invalidación on-demand con revalidateTag
  // IMPORTANTE: Pasar cookies como argumento, no accederlas dentro de la función
  //
  // NOTA: En desarrollo, React Strict Mode puede causar llamadas duplicadas.
  // Esto es normal y no afecta producción. El cache previene llamadas reales duplicadas.
  const getCachedLocations = unstable_cache(
    async (
      accountId: string,
      includeHealthScore: boolean,
      userId: string,
      cookies: ReadonlyRequestCookies
    ) => {
      // ÉLITE PRO: Logging optimizado - solo eventos importantes
      // No loguear cada cache miss (ruido innecesario)
      return _getLocationsDataInternal(accountId, includeHealthScore, userId, cookies)
    },
    [`gbp-locations-${accountId}-${includeHealthScore}-${user.id}`],
    {
      revalidate: 300, // 5 minutos - balance entre frescura y performance
      tags: ['gbp-locations', `gbp-locations-${accountId}`, `gbp-locations-user-${user.id}`],
    }
  )

  return getCachedLocations(accountId, includeHealthScore, user.id, cookieStore)
}

/**
 * Obtiene las ubicaciones con cache automático de Next.js
 * ÉLITE: Usa fetch con cache para stale-while-revalidate
 *
 * NOTA: Esta función usa fetch interno para aprovechar el cache de Next.js.
 * Para uso directo del cliente GBP, usar getLocationsData().
 *
 * @param accountId - ID de la cuenta de GBP
 * @param includeHealthScore - Si incluir health score
 * @returns Datos de ubicaciones con cache
 */
export async function getLocationsDataCached(
  accountId: string,
  includeHealthScore: boolean = false
): Promise<LocationsDataResult> {
  try {
    // ÉLITE: Usar fetch con cache de Next.js para stale-while-revalidate
    // El cache se invalida automáticamente después de 5 minutos
    // NOTA: En producción, usar URL absoluta. En desarrollo, usar relativa para evitar problemas de CORS
    const isProduction = process.env.NODE_ENV === 'production'
    const baseUrl = isProduction
      ? process.env.NEXT_PUBLIC_APP_URL || 'https://app.fascinantedigital.com'
      : 'http://localhost:3001'
    const url = `${baseUrl}/api/integrations/google-business-profile/locations?accountId=${accountId}&includeHealthScore=${includeHealthScore}`

    const response = await fetch(url, {
      next: {
        revalidate: 300, // 5 minutos
        tags: ['gbp-locations', `gbp-locations-${accountId}`],
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        locations: [],
        accountId,
        error: errorData.message || `HTTP ${response.status}`,
      }
    }

    const data = await response.json()

    if (!data.success || !data.data) {
      return {
        locations: [],
        accountId,
        error: 'Invalid response format',
      }
    }

    return {
      locations: data.data,
      accountId,
      error: null,
    }
  } catch (error) {
    console.error('[GBP getLocationsDataCached] Error:', error)
    return {
      locations: [],
      accountId,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
