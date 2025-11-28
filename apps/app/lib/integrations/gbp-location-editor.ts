/**
 * Google Business Profile Location Editor
 *
 * ÉLITE PRO: Wrapper para operaciones de edición de ubicaciones
 * que integra rate limiting y activity logging de forma no invasiva.
 *
 * Características:
 * - Rate limiting automático (10 ediciones/min por perfil)
 * - Activity logging automático
 * - Manejo robusto de errores
 * - Type-safe
 * - No modifica código existente (wrapper pattern)
 *
 * Patrón: Facade Pattern + Middleware
 * - Envuelve el cliente GBP existente
 * - Agrega funcionalidad sin modificar código base
 * - Fácil de desactivar si es necesario
 */

import { createGBPClient } from './gbp-client'
import { canEditLocation, getEditWaitTime, getRateLimitStatus } from './gbp-rate-limiter'
import { createActivityLogger, type ActivityEvent, type ActivityAction } from '../gbp/activity-logger'
import { GBPAPIError, GBPErrorCode } from './gbp-errors'
import type { GBPLocation } from '../gbp/types'
import type { ReadonlyRequestCookies } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * Opciones para actualizar una ubicación
 */
export interface UpdateLocationOptions {
  locationId: string
  accountId: string
  updateMask: string
  locationData: Partial<GBPLocation>
  userId: string
  cookieStore?: ReadonlyRequestCookies | Awaited<ReturnType<typeof cookies>>
  metadata?: {
    ipAddress?: string
    userAgent?: string
    source?: 'api' | 'ui' | 'automation'
    reason?: string
  }
  skipRateLimit?: boolean // Para operaciones internas del sistema
  skipActivityLog?: boolean // Para operaciones que no requieren logging
}

/**
 * Resultado de una operación de edición
 */
export interface UpdateLocationResult {
  location: GBPLocation
  rateLimitStatus: {
    tokensAvailable: number
    maxTokens: number
    waitTimeMs: number
  }
  activityEventId?: string
}

/**
 * ÉLITE PRO: Servicio para editar ubicaciones con rate limiting y activity logging
 *
 * Patrón: Facade - Envuelve el cliente GBP existente sin modificarlo
 */
export class LocationEditor {
  /**
   * Actualiza una ubicación con rate limiting y activity logging automáticos
   *
   * @param options - Opciones de actualización
   * @returns Ubicación actualizada y estado del rate limiter
   * @throws GBPAPIError si se excede el rate limit o hay error en la API
   */
  static async updateLocation(options: UpdateLocationOptions): Promise<UpdateLocationResult> {
    const {
      locationId,
      accountId,
      updateMask,
      locationData,
      userId,
      cookieStore,
      metadata,
      skipRateLimit = false,
      skipActivityLog = false,
    } = options

    // ÉLITE: 1. Verificar rate limit (a menos que se omita explícitamente)
    if (!skipRateLimit) {
      const canEdit = await canEditLocation(locationId)

      if (!canEdit) {
        const waitTime = getEditWaitTime(locationId)
        const status = getRateLimitStatus(locationId)

        // ÉLITE: Incluir información de rate limit en el mensaje para debugging
        const errorMessage = `Rate limit exceeded for location ${locationId}. Maximum 10 edits per minute. Wait ${Math.ceil(waitTime / 1000)} seconds before trying again. (Tokens: ${status.tokensAvailable}/${status.maxTokens})`

        throw new GBPAPIError(
          GBPErrorCode.RATE_LIMIT_EXCEEDED,
          errorMessage,
          {
            retryable: true,
            retryAfter: Math.ceil(waitTime / 1000),
            statusCode: 429,
          }
        )
      }
    }

    // ÉLITE: 2. Obtener ubicación actual para comparar cambios (activity log)
    let oldLocation: GBPLocation | null = null
    if (!skipActivityLog) {
      try {
        const client = await createGBPClient(userId, cookieStore)
        oldLocation = await client.getLocation(locationId)
      } catch (error) {
        // Si no se puede obtener la ubicación actual, continuar sin oldLocation
        // El activity log se creará sin comparación de cambios
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Location Editor] Could not fetch old location for activity log:', error)
        }
      }
    }

    // ÉLITE: 3. Realizar la actualización usando el cliente GBP existente
    const client = await createGBPClient(userId, cookieStore)
    const updatedLocation = await client.updateLocation(locationId, updateMask, locationData)

    // ÉLITE: 4. Registrar actividad (a menos que se omita explícitamente)
    let activityEventId: string | undefined
    if (!skipActivityLog) {
      try {
        const logger = createActivityLogger(cookieStore)

        // Calcular cambios realizados
        const changes = this.calculateChanges(oldLocation, updatedLocation, updateMask)

        const activityEvent: ActivityEvent = {
          userId,
          locationId,
          accountId,
          action: this.determineAction(updateMask),
          changes,
          metadata,
        }

        await logger.logActivity(activityEvent)
        activityEventId = activityEvent.id
      } catch (error) {
        // No fallar la operación si el logging falla
        // Solo loguear el error para debugging
        console.error('[Location Editor] Error logging activity (non-blocking):', error)
      }
    }

    // ÉLITE: 5. Obtener estado actual del rate limiter
    const rateLimitStatus = getRateLimitStatus(locationId)

    return {
      location: updatedLocation,
      rateLimitStatus,
      activityEventId,
    }
  }

  /**
   * Calcula los cambios realizados comparando ubicación antigua y nueva
   */
  private static calculateChanges(
    oldLocation: GBPLocation | null,
    newLocation: GBPLocation,
    updateMask: string
  ): Record<string, { old: any; new: any }> {
    const changes: Record<string, { old: any; new: any }> = {}
    const fields = updateMask.split(',').map((f) => f.trim())

    if (!oldLocation) {
      // Si no hay ubicación antigua, marcar todos los campos como nuevos
      for (const field of fields) {
        const newValue = this.getNestedValue(newLocation, field)
        if (newValue !== undefined) {
          changes[field] = { old: null, new: newValue }
        }
      }
      return changes
    }

    // Comparar campos actualizados
    for (const field of fields) {
      const oldValue = this.getNestedValue(oldLocation, field)
      const newValue = this.getNestedValue(newLocation, field)

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes[field] = { old: oldValue, new: newValue }
      }
    }

    return changes
  }

  /**
   * Obtiene un valor anidado de un objeto usando notación de punto
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  /**
   * Determina el tipo de acción basado en el updateMask
   */
  private static determineAction(updateMask: string): ActivityAction {
    const mask = updateMask.toLowerCase()

    if (mask.includes('regularhours') || mask.includes('specialhours')) {
      return 'hours_update'
    }

    if (mask.includes('categories')) {
      return 'category_update'
    }

    if (mask.includes('attributes')) {
      return 'attribute_update'
    }

    // Por defecto, es una edición general
    return 'location_edit'
  }

  /**
   * Obtiene el estado del rate limiter para una ubicación
   * Útil para mostrar información al usuario antes de intentar editar
   */
  static getLocationRateLimitStatus(locationId: string) {
    return getRateLimitStatus(locationId)
  }
}
