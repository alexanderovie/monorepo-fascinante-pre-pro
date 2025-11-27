/**
 * Google Business Profile Dashboard Data Fetcher
 *
 * ÉLITE: Obtiene datos reales de Google Business Profile API
 * para el dashboard, siguiendo las mejores prácticas de 2025.
 *
 * Características:
 * - Obtiene cuentas reales de la API
 * - Manejo robusto de errores
 * - Fallback a datos mock si la API falla
 * - Type-safe
 */

import { createClient } from '@/utils/supabase/server'
import { getGBPTokens } from '../integrations/gbp-tokens'
import { createGBPClient } from '../integrations/gbp-client'
import type { GBPDashboardData, GBPAccount } from './types'
import { mockGBPDashboardData } from './mock-data'

/**
 * Obtiene las cuentas de Google Business Profile desde la API
 * ÉLITE: Usa el cliente GBP directamente (mejor práctica que fetch interno)
 */
async function fetchAccountsFromAPI(): Promise<GBPAccount[]> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    // Verificar que el usuario tiene tokens de GBP
    const tokens = await getGBPTokens(user.id)
    if (!tokens) {
      console.log('[GBP Dashboard] No tokens found, user needs to connect GBP first')
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
    console.error('[GBP Dashboard] Error fetching accounts from API:', error)
    // En caso de error, retornar array vacío (el dashboard mostrará estado vacío)
    return []
  }
}

/**
 * Obtiene los datos del dashboard de Google Business Profile
 * ÉLITE: Combina datos reales de la API con datos mock para métricas
 *
 * Estrategia:
 * 1. Obtener cuentas reales de la API
 * 2. Si hay cuentas, usar la primera como seleccionada
 * 3. Para métricas, usar datos mock por ahora (se actualizarán cuando implementemos esos endpoints)
 * 4. Si no hay cuentas, retornar datos mock para desarrollo
 */
export async function getGBPDashboardData(): Promise<GBPDashboardData> {
  try {
    // 1. Obtener cuentas reales de la API
    const accounts = await fetchAccountsFromAPI()

    // 2. Si hay cuentas, construir datos reales
    if (accounts.length > 0) {
      const selectedAccount = accounts[0] // Seleccionar la primera cuenta por defecto

      return {
        selectedAccount,
        accounts,
        locationGroups: [], // Se actualizará cuando implementemos el endpoint de location groups
        locations: [], // Se actualizará cuando implementemos el endpoint de locations
        aggregatedMetrics: mockGBPDashboardData.aggregatedMetrics, // Mock por ahora
        quotaUsage: mockGBPDashboardData.quotaUsage, // Mock por ahora
      }
    }

    // 3. Si no hay cuentas, retornar datos mock (para desarrollo/testing)
    console.log('[GBP Dashboard] No accounts found, using mock data')
    return mockGBPDashboardData
  } catch (error) {
    console.error('[GBP Dashboard] Error getting dashboard data:', error)
    // En caso de error, retornar datos mock como fallback
    return mockGBPDashboardData
  }
}
