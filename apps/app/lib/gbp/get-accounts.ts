/**
 * Google Business Profile - Get Accounts
 *
 * ÉLITE: Obtiene las cuentas de Google Business Profile desde la API
 * con cache automático de Next.js para performance óptima.
 *
 * Características:
 * - Llamadas directas al cliente GBP (mejor práctica para Server Components)
 * - Cache con unstable_cache (recomendado por Next.js 15)
 * - Stale-while-revalidate (5 minutos)
 * - Manejo robusto de errores
 * - Type-safe
 *
 * Referencia oficial Next.js:
 * - https://nextjs.org/docs/app/building-your-application/caching#unstable_cache
 * - Server Components deben usar funciones directas, no fetch a API routes internas
 */

import { unstable_cache } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getGBPTokens } from '../integrations/gbp-tokens'
import { createGBPClient } from '../integrations/gbp-client'
import type { GBPAccount } from './types'

/**
 * Función interna para obtener accounts sin cache
 * ÉLITE: Separada para poder aplicar cache con unstable_cache
 */
async function _getAccountsInternal(userId: string): Promise<GBPAccount[]> {
  try {
    // Verificar que el usuario tiene tokens de GBP
    const tokens = await getGBPTokens(userId)
    if (!tokens) {
      console.log('[GBP getAccounts] No tokens found, user needs to connect GBP first')
      return []
    }

    // Usar el cliente GBP directamente (mejor práctica para Server Components)
    const client = await createGBPClient()
    const response = await client.listAccounts()

    // Transformar la respuesta de Google al formato interno
    const accounts: GBPAccount[] = (response.accounts || []).map((account) => {
      // Extraer accountId del formato "accounts/{accountId}"
      const accountId = account.name.replace('accounts/', '')

      return {
        accountId,
        accountName: account.accountName || accountId,
        accountType: (account.type?.toLowerCase() as 'personal' | 'organization') || 'personal',
        locationCount: 0, // Se actualizará cuando obtengamos las ubicaciones
      }
    })

    return accounts
  } catch (error) {
    console.error('[GBP getAccounts] Error fetching accounts from API:', error)
    // En caso de error, retornar array vacío (el componente mostrará estado vacío)
    return []
  }
}

/**
 * Obtiene las cuentas de Google Business Profile desde la API
 * ÉLITE: Usa unstable_cache de Next.js 15 (recomendado oficialmente)
 *
 * Según documentación oficial Next.js:
 * - Server Components deben usar funciones directas, no fetch a API routes
 * - unstable_cache es la forma recomendada de cachear funciones async
 * - Tags permiten invalidación granular con revalidateTag
 *
 * @returns Array de cuentas GBP, o array vacío si hay error o no hay cuentas
 */
export async function getAccounts(): Promise<GBPAccount[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log('[GBP getAccounts] User not authenticated')
    return []
  }

  // ÉLITE: Usar unstable_cache según documentación oficial Next.js 15
  // Cache key incluye userId para granularidad por usuario
  // Revalidate: 300 segundos (5 minutos)
  // Tags: para invalidación on-demand con revalidateTag
  const getCachedAccounts = unstable_cache(
    async () => {
      return _getAccountsInternal(user.id)
    },
    [`gbp-accounts-${user.id}`],
    {
      revalidate: 300, // 5 minutos
      tags: ['gbp-accounts', `gbp-accounts-user-${user.id}`],
    }
  )

  return getCachedAccounts()
}

