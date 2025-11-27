/**
 * Google Business Profile - Get Locations Data
 *
 * ÉLITE: Obtiene las ubicaciones de Google Business Profile desde la API
 * con cache automático de Next.js para carga instantánea.
 *
 * Características:
 * - Fetch en servidor con cache automático (stale-while-revalidate)
 * - Cache por 5 minutos con tags para invalidación
 * - Manejo robusto de errores
 * - Type-safe
 * - Formato optimizado para tabla
 */

import { createClient } from '@/utils/supabase/server'
import { getGBPTokens } from '../integrations/gbp-tokens'
import { createGBPClient } from '../integrations/gbp-client'
import { getLocationsTableData } from './get-locations-table-data'
import type { LocationTableRow } from './types'

export interface LocationsDataResult {
  locations: LocationTableRow[]
  accountId: string | null
  error: string | null
}

/**
 * Obtiene las ubicaciones de Google Business Profile para una cuenta específica
 * ÉLITE: Usa cache de Next.js con stale-while-revalidate para carga instantánea
 *
 * @param accountId - ID de la cuenta de GBP (sin prefijo "accounts/")
 * @param includeHealthScore - Si incluir health score (más lento pero más completo)
 * @returns Datos de ubicaciones formateados para tabla
 */
export async function getLocationsData(
  accountId: string,
  includeHealthScore: boolean = false
): Promise<LocationsDataResult> {
  try {
    const supabase = await createClient()
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

    // Verificar que el usuario tiene tokens de GBP
    const tokens = await getGBPTokens(user.id)
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
    // Esta función ya maneja el formato y mapeo de datos
    const locations = await getLocationsTableData({
      accountId,
      includeHealthScore,
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

