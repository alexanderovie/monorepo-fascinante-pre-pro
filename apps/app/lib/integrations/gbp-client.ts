/**
 * Google Business Profile API Client
 *
 * ÉLITE: Cliente para interactuar con Google Business Profile API
 * siguiendo las mejores prácticas de 2025.
 *
 * Características:
 * - Refresh automático de tokens
 * - Manejo robusto de errores con tipos específicos
 * - Retry logic con exponential backoff y jitter
 * - Rate limiting awareness
 * - Timeout handling
 * - Type-safe responses
 * - Logging estructurado
 *
 * Referencias:
 * - Google Business Profile API Documentation
 * - OAuth 2.0 Best Practices
 * - Google API Error Handling Best Practices
 */

import { getValidAccessToken } from './gbp-refresh'
import { createClient } from '@/utils/supabase/server'
import { GBPAPIError, GBPErrorCode, requiresTokenRefresh } from './gbp-errors'
import { withRetry, type RetryConfig } from './gbp-retry'

// ÉLITE: En Next.js 15, ReadonlyRequestCookies no se exporta directamente
// Usamos el tipo inferido de cookies()
import { cookies } from 'next/headers'
type ReadonlyRequestCookies = Awaited<ReturnType<typeof cookies>>

/**
 * Cliente base para hacer requests a Google Business Profile API
 * ÉLITE: Implementación robusta con manejo de errores de nivel industrial
 */
class GBPAPIClient {
  private userId: string
  private cookieStore?: ReadonlyRequestCookies
  private readonly defaultTimeout: number = 30000 // 30 segundos
  private readonly defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    jitter: true,
  }

  constructor(userId: string, cookieStore?: ReadonlyRequestCookies) {
    this.userId = userId
    this.cookieStore = cookieStore
  }

  /**
   * Hace un request autenticado a la API de Google Business Profile
   * ÉLITE: Maneja automáticamente el refresh de tokens, retry logic y errores
   *
   * Endpoints base según documentación oficial:
   * - Account Management: https://mybusinessaccountmanagement.googleapis.com/v1
   * - Business Information: https://mybusinessbusinessinformation.googleapis.com/v1
   * - Performance: https://businessprofileperformance.googleapis.com/v1
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    apiBase: 'account' | 'business' | 'performance' = 'account',
    retryConfig?: RetryConfig
  ): Promise<T> {
    // Seleccionar el endpoint base según el tipo de API
    const baseUrls = {
      account: 'https://mybusinessaccountmanagement.googleapis.com/v1',
      business: 'https://mybusinessbusinessinformation.googleapis.com/v1',
      performance: 'https://businessprofileperformance.googleapis.com/v1',
    }

    const url = `${baseUrls[apiBase]}${endpoint}`
    const config = retryConfig || this.defaultRetryConfig

    // ÉLITE: Usar retry logic con exponential backoff
    return withRetry(
      async () => {
        // Obtener access token válido (se refresca automáticamente si es necesario)
        // ÉLITE: Pasar cookieStore para cumplir con restricciones de unstable_cache
        const accessToken = await getValidAccessToken(this.userId, false, this.cookieStore)

        // Crear AbortController para timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout)

        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'User-Agent': 'Fascinante-Digital/1.0', // Identificar nuestra app
              ...options.headers,
            },
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()

            // ÉLITE: Logging detallado del error
            console.error('[GBP Client] Request failed:', {
              url,
              status: response.status,
              statusText: response.statusText,
              errorText,
              headers: Object.fromEntries(response.headers.entries()),
            })

            const gbpError = GBPAPIError.fromResponse(response.status, errorText)

            // Si requiere refresh de token, hacerlo y retry
            if (requiresTokenRefresh(gbpError)) {
              console.log('[GBP API] Token refresh required, refreshing and retrying...')
              // ÉLITE: Pasar cookieStore para cumplir con restricciones de unstable_cache
              await getValidAccessToken(this.userId, true, this.cookieStore)
              // El retry logic se encargará de reintentar
              throw gbpError
            }

            // Lanzar error estructurado
            throw gbpError
          }

          // Validar que la respuesta sea JSON válido
          const contentType = response.headers.get('content-type')
          if (!contentType?.includes('application/json')) {
            throw new GBPAPIError(
              GBPErrorCode.UNKNOWN_ERROR,
              `Unexpected content type: ${contentType}`,
              { statusCode: response.status }
            )
          }

          return response.json()
        } catch (error) {
          clearTimeout(timeoutId)

          // Si es un abort (timeout), crear error específico
          if (error instanceof Error && error.name === 'AbortError') {
            throw new GBPAPIError(GBPErrorCode.TIMEOUT, 'Request timeout', {
              statusCode: 504,
              retryable: true,
            })
          }

          // Si ya es un GBPAPIError, re-lanzarlo
          if (error instanceof GBPAPIError) {
            throw error
          }

          // Convertir error desconocido a GBPAPIError
          throw GBPAPIError.fromUnknown(error)
        }
      },
      config
    )
  }

  /**
   * GET request
   * ÉLITE: Con retry logic y manejo de errores robusto
   */
  async get<T>(
    endpoint: string,
    apiBase: 'account' | 'business' | 'performance' = 'account',
    retryConfig?: RetryConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, apiBase, retryConfig)
  }

  /**
   * POST request
   * ÉLITE: Con retry logic y manejo de errores robusto
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    apiBase: 'account' | 'business' | 'performance' = 'account',
    retryConfig?: RetryConfig
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      apiBase,
      retryConfig
    )
  }

  /**
   * PUT request
   * ÉLITE: Con retry logic y manejo de errores robusto
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    apiBase: 'account' | 'business' | 'performance' = 'account',
    retryConfig?: RetryConfig
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      apiBase,
      retryConfig
    )
  }

  /**
   * PATCH request
   * ÉLITE: Con retry logic y manejo de errores robusto
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    apiBase: 'account' | 'business' | 'performance' = 'account',
    retryConfig?: RetryConfig
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
      },
      apiBase,
      retryConfig
    )
  }

  /**
   * DELETE request
   * ÉLITE: Con retry logic y manejo de errores robusto
   */
  async delete<T>(
    endpoint: string,
    apiBase: 'account' | 'business' | 'performance' = 'account',
    retryConfig?: RetryConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, apiBase, retryConfig)
  }

  /**
   * Lista todas las cuentas del usuario autenticado
   * ÉLITE: Endpoint oficial de Google Business Profile API
   * GET /v1/accounts
   *
   * Características:
   * - Retry automático en caso de errores transitorios
   * - Manejo robusto de errores
   * - Validación de respuesta
   *
   * Referencia: https://developers.google.com/my-business/content/account-management#list_accounts
   */
  async listAccounts(): Promise<GBPAccountsListResponse> {
    const response = await this.get<GBPAccountsListResponse>('/accounts', 'account')

    // ÉLITE: Validar estructura de respuesta
    if (!response || typeof response !== 'object') {
      throw new GBPAPIError(
        GBPErrorCode.VALIDATION_ERROR,
        'Invalid response format from Google Business Profile API',
        { retryable: false }
      )
    }

    // Validar que accounts sea un array si existe
    if (response.accounts && !Array.isArray(response.accounts)) {
      throw new GBPAPIError(
        GBPErrorCode.VALIDATION_ERROR,
        'Invalid accounts format in response',
        { retryable: false }
      )
    }

    return response
  }

  /**
   * Obtiene una cuenta específica
   * ÉLITE: Endpoint oficial de Google Business Profile API
   * GET /v1/{name=accounts/*}
   *
   * @param accountName - Nombre de la cuenta en formato "accounts/{accountId}"
   */
  async getAccount(accountName: string): Promise<GBPAccount> {
    return this.get<GBPAccount>(`/${accountName}`, 'account')
  }

  /**
   * Lista todas las ubicaciones de una cuenta
   * ÉLITE: Endpoint oficial de Google Business Profile API
   * GET /v1/accounts/{accountId}/locations
   *
   * Características:
   * - Retry automático en caso de errores transitorios
   * - Manejo robusto de errores
   * - Validación de respuesta
   * - Soporte para readMask para optimizar
   *
   * Referencia: https://developers.google.com/my-business/content/location-data#list_locations
   */
  async listLocations(
    accountId: string,
    options?: {
      readMask?: string
      pageSize?: number
      pageToken?: string
    }
  ): Promise<GBPLocationsListResponse> {
    const { readMask, pageSize, pageToken } = options || {}

    // ÉLITE: Normalizar accountId - remover prefijo "accounts/" si existe
    const normalizedAccountId = accountId.replace(/^accounts\//, '')

    // Construir query params
    const params = new URLSearchParams()
    if (readMask) params.append('readMask', readMask)
    if (pageSize) params.append('pageSize', pageSize.toString())
    if (pageToken) params.append('pageToken', pageToken)

    const queryString = params.toString()
    const endpoint = `/accounts/${normalizedAccountId}/locations${queryString ? `?${queryString}` : ''}`

    // ÉLITE: Logging detallado para debugging
    console.log('[GBP Client] listLocations request:', {
      accountId,
      normalizedAccountId,
      endpoint,
      readMask,
      pageSize,
      pageToken,
    })

    const response = await this.get<GBPLocationsListResponse>(endpoint, 'business')

    // ÉLITE: Validar estructura de respuesta
    if (!response || typeof response !== 'object') {
      throw new GBPAPIError(
        GBPErrorCode.VALIDATION_ERROR,
        'Invalid response format from Google Business Profile API',
        { retryable: false }
      )
    }

    // Validar que locations sea un array si existe
    if (response.locations && !Array.isArray(response.locations)) {
      throw new GBPAPIError(
        GBPErrorCode.VALIDATION_ERROR,
        'Invalid locations format in response',
        { retryable: false }
      )
    }

    return response
  }

  /**
   * Obtiene una ubicación específica
   * ÉLITE: Endpoint oficial de Google Business Profile API
   * GET /v1/locations/{locationId}
   *
   * @param locationId - ID de la ubicación
   * @param readMask - Campos a incluir en la respuesta
   */
  async getLocation(locationId: string, readMask?: string): Promise<GBPLocation> {
    const params = new URLSearchParams()
    if (readMask) params.append('readMask', readMask)

    const queryString = params.toString()
    const endpoint = `/locations/${locationId}${queryString ? `?${queryString}` : ''}`

    return this.get<GBPLocation>(endpoint, 'business')
  }

  /**
   * Actualiza una ubicación usando PATCH
   * ÉLITE: Endpoint oficial de Google Business Profile API
   * PATCH /v1/locations/{locationId}?updateMask={fields}
   *
   * IMPORTANTE: Este método NO incluye rate limiting ni activity logging.
   * Para operaciones de edición, usar updateLocationWithRateLimit() en lugar de este método.
   *
   * @param locationId - ID de la ubicación
   * @param updateMask - Campos a actualizar (ej: "title,phoneNumbers,storefrontAddress")
   * @param locationData - Datos a actualizar
   *
   * Referencia: https://developers.google.com/my-business/content/location-data#update_a_location
   */
  async updateLocation(
    locationId: string,
    updateMask: string,
    locationData: Partial<GBPLocation>
  ): Promise<GBPLocation> {
    const params = new URLSearchParams()
    params.append('updateMask', updateMask)

    const endpoint = `/locations/${locationId}?${params.toString()}`

    return this.patch<GBPLocation>(endpoint, locationData, 'business')
  }
}

/**
 * Factory function para crear un cliente GBP API
 * ÉLITE: Obtiene el userId del usuario autenticado automáticamente
 *
 * @param userId - Opcional: ID del usuario (si se proporciona, evita llamar a createClient)
 * @param cookieStore - Opcional: cookies obtenidas fuera de función cacheada (para uso con unstable_cache)
 */
export async function createGBPClient(
  userId?: string,
  cookieStore?: Parameters<typeof createClient>[0]
): Promise<GBPAPIClient> {
  // Si se proporciona userId, usarlo directamente (para funciones cacheadas)
  // ÉLITE: Pasar cookieStore al constructor para cumplir con restricciones de unstable_cache
  if (userId) {
    return new GBPAPIClient(userId, cookieStore)
  }

  // Si no se proporciona userId, obtenerlo del usuario autenticado (uso normal)
  const supabase = await createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  return new GBPAPIClient(user.id, cookieStore)
}

/**
 * Tipos para las respuestas de la API
 * Basados en la documentación oficial de Google Business Profile API
 * https://developers.google.com/my-business/content/account-management
 */

// Importar tipos desde types.ts
import type {
  GBPLocation,
  GBPLocationsListResponse,
} from '@/lib/gbp/types'

/**
 * Respuesta de la API para listar cuentas
 * GET /v1/accounts
 */
export interface GBPAccountsListResponse {
  accounts?: GBPAccount[]
  nextPageToken?: string
}

/**
 * Cuenta de Google Business Profile
 * Basado en: https://developers.google.com/my-business/content/account-management#account
 */
export interface GBPAccount {
  name: string // Formato: "accounts/{accountId}"
  accountName?: string
  type?: 'PERSONAL' | 'ORGANIZATION'
  organizationInfo?: {
    registeredDomain?: string
    address?: {
      addressLines?: string[]
      locality?: string
      administrativeArea?: string
      postalCode?: string
      regionCode?: string
    }
  }
  verificationState?: 'VERIFIED' | 'UNVERIFIED' | 'VERIFICATION_REQUESTED'
  vettedState?: 'VETTED' | 'NOT_VETTED'
}

export interface GBPMetrics {
  // TODO: Definir según los endpoints que uses
  [key: string]: unknown
}
