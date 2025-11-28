/**
 * Server Actions for Locations Page
 *
 * ÉLITE PRO: Server Actions para invalidación de cache y operaciones del servidor.
 * Patrón moderno de Next.js 15 - sin parches, solución robusta y escalable.
 *
 * Características:
 * - Invalidación granular de cache con revalidateTag
 * - Type-safe
 * - Reutilizable
 * - Escalable para futuras operaciones
 */

'use server'

import { revalidateTag } from 'next/cache'

/**
 * ÉLITE PRO: Invalidar cache de locations cuando cambia la cuenta
 * Usa revalidateTag para invalidación granular y eficiente
 *
 * @param accountId - ID de la cuenta que cambió
 * @param userId - ID del usuario (opcional, para invalidación más granular)
 */
export async function invalidateLocationsCache(accountId: string, userId?: string) {
  try {
    // ÉLITE: Invalidar cache específico de la cuenta
    revalidateTag(`gbp-locations-${accountId}`)

    // ÉLITE: Invalidar cache general de locations
    revalidateTag('gbp-locations')

    // ÉLITE: Si hay userId, invalidar cache específico del usuario
    if (userId) {
      revalidateTag(`gbp-locations-user-${userId}`)
    }

    return { success: true }
  } catch (error) {
    console.error('[Locations Actions] Error invalidating cache:', error)
    return { success: false, error: 'Failed to invalidate cache' }
  }
}

/**
 * ÉLITE PRO: Invalidar cache de accounts
 * Útil cuando se agregan o eliminan cuentas
 */
export async function invalidateAccountsCache(userId?: string) {
  try {
    revalidateTag('gbp-accounts')

    if (userId) {
      revalidateTag(`gbp-accounts-user-${userId}`)
    }

    return { success: true }
  } catch (error) {
    console.error('[Locations Actions] Error invalidating accounts cache:', error)
    return { success: false, error: 'Failed to invalidate accounts cache' }
  }
}
