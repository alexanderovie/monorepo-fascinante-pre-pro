/**
 * Google Business Profile - Get Accounts
 *
 * ÉLITE: Obtiene las cuentas de Google Business Profile desde la API
 * con cache automático de Next.js para performance óptima.
 *
 * Características:
 * - Fetch en servidor con cache automático
 * - Stale-while-revalidate (5 minutos)
 * - Manejo robusto de errores
 * - Type-safe
 */

import { createClient } from '@/utils/supabase/server'
import { getGBPTokens } from '../integrations/gbp-tokens'
import { createGBPClient } from '../integrations/gbp-client'
import type { GBPAccount } from './types'

/**
 * Obtiene las cuentas de Google Business Profile desde la API
 * ÉLITE: Usa el cliente GBP directamente con cache de Next.js
 *
 * @returns Array de cuentas GBP, o array vacío si hay error o no hay cuentas
 */
export async function getAccounts(): Promise<GBPAccount[]> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log('[GBP getAccounts] User not authenticated')
      return []
    }

    // Verificar que el usuario tiene tokens de GBP
    const tokens = await getGBPTokens(user.id)
    if (!tokens) {
      console.log('[GBP getAccounts] No tokens found, user needs to connect GBP first')
      return []
    }

    // Usar el cliente GBP directamente (mejor práctica)
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

