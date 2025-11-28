/**
 * Location Actions
 *
 * ÉLITE PRO: Server Actions para operaciones de ubicación
 * que se llaman desde Client Components.
 */

'use server'

import { createGBPClient } from '@/lib/integrations/gbp-client'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * Responde a un review
 */
export async function replyToReviewAction(
  accountId: string,
  locationId: string,
  reviewId: string,
  reply: { comment: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const client = await createGBPClient(user.id, cookieStore)
    await client.replyToReview(accountId, locationId, reviewId, reply)

    return { success: true }
  } catch (error) {
    console.error(`[Location Actions] Error replying to review ${reviewId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reply to review',
    }
  }
}

/**
 * Crea un place action
 */
export async function createPlaceActionAction(
  locationId: string,
  placeAction: {
    placeActionType: string
    uri: string
    providerType?: string
    isPreferred?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const client = await createGBPClient(user.id, cookieStore)
    await client.createPlaceAction(locationId, placeAction)

    return { success: true }
  } catch (error) {
    console.error('[Location Actions] Error creating place action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create place action',
    }
  }
}

/**
 * Actualiza un place action
 */
export async function updatePlaceActionAction(
  locationId: string,
  actionId: string,
  updateMask: string,
  placeAction: Partial<{
    uri: string
    isPreferred: boolean
  }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const client = await createGBPClient(user.id, cookieStore)
    await client.updatePlaceAction(locationId, actionId, updateMask, placeAction)

    return { success: true }
  } catch (error) {
    console.error('[Location Actions] Error updating place action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update place action',
    }
  }
}

/**
 * Actualiza atributos de una ubicación
 * ÉLITE PRO: Basado en documentación oficial
 * Referencia: https://developers.google.com/my-business/reference/businessinformation/rest/v1/Attributes
 */
export async function updateLocationAttributesAction(
  locationId: string,
  attributeMask: string,
  attributes: {
    name: string
    attributes: Array<{
      name: string // "locations/{locationId}/attributes/{attributeId}"
      repeatedEnumValue?: {
        setValues: string[]
        unsetValues: string[]
      }
      uriValues?: Array<{ uri: string }>
      values?: string[]
    }>
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const client = await createGBPClient(user.id, cookieStore)
    await client.updateLocationAttributes(locationId, attributeMask, attributes)

    return { success: true }
  } catch (error) {
    console.error('[Location Actions] Error updating attributes:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update attributes',
    }
  }
}
