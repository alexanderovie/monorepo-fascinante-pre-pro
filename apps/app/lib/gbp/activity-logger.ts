/**
 * Google Business Profile Activity Logger
 *
 * ÉLITE PRO: Sistema de audit log y tracking de cambios
 * según estándares de la industria (Event Sourcing pattern).
 *
 * Características:
 * - Registra todos los cambios realizados en ubicaciones
 * - Soporta notificaciones automáticas (48 horas según política de Google)
 * - Audit trail completo para cumplimiento
 * - Type-safe con TypeScript
 *
 * Referencias:
 * - Event Sourcing Pattern
 * - Google Business Profile API Policies (Transparency requirements)
 * - Audit Logging Best Practices
 */

import { createClient } from '@/utils/supabase/server'
import type { ReadonlyRequestCookies } from '@/utils/supabase/server'

/**
 * Tipos de acciones que se pueden registrar
 */
export type ActivityAction =
  | 'location_edit'
  | 'location_create'
  | 'location_delete'
  | 'admin_add'
  | 'admin_remove'
  | 'hours_update'
  | 'category_update'
  | 'attribute_update'
  | 'verification_initiated'
  | 'verification_completed'

/**
 * Interfaz para eventos de actividad
 */
export interface ActivityEvent {
  id?: string
  userId: string
  locationId: string
  accountId: string
  action: ActivityAction
  changes: Record<string, { old: any; new: any }>
  metadata?: {
    ipAddress?: string
    userAgent?: string
    source?: 'api' | 'ui' | 'automation'
    reason?: string
  }
  timestamp?: Date
  notified?: boolean
  notificationSentAt?: Date
}

/**
 * ÉLITE PRO: Servicio de logging de actividad
 *
 * Registra todos los cambios para cumplir con políticas de transparencia de Google
 */
export class ActivityLogger {
  private cookieStore?: ReadonlyRequestCookies

  constructor(cookieStore?: ReadonlyRequestCookies) {
    this.cookieStore = cookieStore
  }

  /**
   * Registra un evento de actividad
   *
   * @param event - Evento a registrar
   */
  async logActivity(event: ActivityEvent): Promise<void> {
    try {
      const supabase = await createClient(this.cookieStore)

      // Preparar datos para insertar
      const activityData = {
        user_id: event.userId,
        location_id: event.locationId,
        account_id: event.accountId,
        action: event.action,
        changes: event.changes,
        metadata: event.metadata || {},
        notified: event.notified || false,
        notification_sent_at: event.notificationSentAt || null,
      }

      // Insertar en base de datos
      const { error } = await supabase
        .from('activity_events')
        .insert(activityData)

      if (error) {
        console.error('[Activity Logger] Error logging activity:', error)
        // No lanzar error para no interrumpir el flujo principal
        // Solo loguear para debugging
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Activity Logger] ✅ Logged activity: ${event.action} for location ${event.locationId}`)
        }
      }

      // ÉLITE: Verificar si requiere notificación según política de Google
      if (this.requiresNotification(event.action)) {
        await this.scheduleNotification(event)
      }
    } catch (error) {
      console.error('[Activity Logger] Unexpected error:', error)
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  /**
   * Obtiene el historial de actividad de una ubicación
   *
   * @param locationId - ID de la ubicación
   * @param limit - Límite de resultados (default: 50)
   */
  async getActivityHistory(
    locationId: string,
    limit: number = 50
  ): Promise<ActivityEvent[]> {
    try {
      const supabase = await createClient(this.cookieStore)

      const { data, error } = await supabase
        .from('activity_events')
        .select('*')
        .eq('location_id', locationId)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('[Activity Logger] Error fetching activity history:', error)
        return []
      }

      return (data || []).map(this.mapDatabaseToEvent)
    } catch (error) {
      console.error('[Activity Logger] Unexpected error:', error)
      return []
    }
  }

  /**
   * Obtiene el historial de actividad de un usuario
   *
   * @param userId - ID del usuario
   * @param limit - Límite de resultados (default: 50)
   */
  async getUserActivity(
    userId: string,
    limit: number = 50
  ): Promise<ActivityEvent[]> {
    try {
      const supabase = await createClient(this.cookieStore)

      const { data, error } = await supabase
        .from('activity_events')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('[Activity Logger] Error fetching user activity:', error)
        return []
      }

      return (data || []).map(this.mapDatabaseToEvent)
    } catch (error) {
      console.error('[Activity Logger] Unexpected error:', error)
      return []
    }
  }

  /**
   * Verifica si una acción requiere notificación según política de Google
   *
   * Según política: "debes notificar al cliente final en 48 horas después del cambio"
   * Acciones críticas que requieren notificación:
   * - Agregar/remover administradores
   * - Eliminar ubicación
   * - Cambios importantes de configuración
   */
  private requiresNotification(action: ActivityAction): boolean {
    const criticalActions: ActivityAction[] = [
      'admin_add',
      'admin_remove',
      'location_delete',
      'verification_initiated',
    ]

    return criticalActions.includes(action)
  }

  /**
   * Programa una notificación para el evento
   *
   * ÉLITE: Las notificaciones se envían dentro de 48 horas según política de Google
   */
  private async scheduleNotification(event: ActivityEvent): Promise<void> {
    try {
      const supabase = await createClient(this.cookieStore)

      // Crear registro de notificación pendiente
      const notificationData = {
        user_id: event.userId,
        location_id: event.locationId,
        activity_event_id: event.id,
        type: 'activity_change',
        message: this.generateNotificationMessage(event),
        scheduled_for: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 horas
        sent: false,
      }

      const { error } = await supabase
        .from('notifications')
        .insert(notificationData)

      if (error) {
        console.error('[Activity Logger] Error scheduling notification:', error)
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Activity Logger] 📧 Scheduled notification for activity: ${event.action}`)
        }
      }
    } catch (error) {
      console.error('[Activity Logger] Error scheduling notification:', error)
    }
  }

  /**
   * Genera mensaje de notificación para el evento
   */
  private generateNotificationMessage(event: ActivityEvent): string {
    const actionMessages: Record<ActivityAction, string> = {
      location_edit: 'Se realizaron cambios en la ubicación',
      location_create: 'Se creó una nueva ubicación',
      location_delete: 'Se eliminó una ubicación',
      admin_add: 'Se agregó un nuevo administrador a la ubicación',
      admin_remove: 'Se removió un administrador de la ubicación',
      hours_update: 'Se actualizaron los horarios de la ubicación',
      category_update: 'Se actualizó la categoría de la ubicación',
      attribute_update: 'Se actualizaron los atributos de la ubicación',
      verification_initiated: 'Se inició el proceso de verificación de la ubicación',
      verification_completed: 'Se completó la verificación de la ubicación',
    }

    return actionMessages[event.action] || 'Se realizó un cambio en la ubicación'
  }

  /**
   * Mapea datos de base de datos a ActivityEvent
   */
  private mapDatabaseToEvent(row: any): ActivityEvent {
    return {
      id: row.id,
      userId: row.user_id,
      locationId: row.location_id,
      accountId: row.account_id,
      action: row.action as ActivityAction,
      changes: row.changes || {},
      metadata: row.metadata || {},
      timestamp: new Date(row.timestamp),
      notified: row.notified || false,
      notificationSentAt: row.notification_sent_at ? new Date(row.notification_sent_at) : undefined,
    }
  }
}

/**
 * Helper function para crear instancia de ActivityLogger
 */
export function createActivityLogger(cookieStore?: ReadonlyRequestCookies): ActivityLogger {
  return new ActivityLogger(cookieStore)
}
