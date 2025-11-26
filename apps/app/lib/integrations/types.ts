/**
 * Integrations Types
 *
 * Tipos TypeScript para el sistema de integraciones.
 * Diseñado para ser escalable y fácil de extender.
 */

/**
 * Estado de una integración
 */
export type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error'

/**
 * Categoría de integración
 */
export type IntegrationCategory =
  | 'communication'
  | 'productivity'
  | 'development'
  | 'storage'
  | 'marketing'
  | 'calendar'
  | 'monitoring'
  | 'automation'

/**
 * Tipo de autenticación requerida
 */
export type AuthType = 'oauth' | 'api_key' | 'webhook' | 'none'

/**
 * Información de una integración
 */
export interface Integration {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  icon: string // URL o path al icono
  status: IntegrationStatus
  authType: AuthType
  connectedAt?: string // ISO date string
  lastSyncAt?: string // ISO date string
  settingsUrl?: string // URL para configurar la integración
  documentationUrl?: string
  features: string[] // Lista de características/features
  isPopular?: boolean // Integración popular/recomendada
  isNew?: boolean // Nueva integración
}

/**
 * Datos de conexión de una integración
 */
export interface IntegrationConnection {
  integrationId: string
  userId: string
  status: IntegrationStatus
  accessToken?: string // Encriptado en producción
  refreshToken?: string // Encriptado en producción
  expiresAt?: string // ISO date string
  metadata?: Record<string, unknown> // Datos adicionales específicos de la integración
  connectedAt: string // ISO date string
  lastSyncAt?: string // ISO date string
}

/**
 * Configuración de una integración
 */
export interface IntegrationConfig {
  integrationId: string
  enabled: boolean
  settings: Record<string, unknown>
  webhooks?: {
    url: string
    events: string[]
  }[]
}

/**
 * Respuesta de conexión de integración
 */
export interface IntegrationConnectResponse {
  success: boolean
  integrationId: string
  authUrl?: string // URL para OAuth flow
  error?: string
  message?: string
}

