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
   * - Reviews/Media: https://mybusiness.googleapis.com/v4
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    apiBase: 'account' | 'business' | 'performance' | 'reviews' = 'account',
    retryConfig?: RetryConfig
  ): Promise<T> {
    // Seleccionar el endpoint base según el tipo de API
    const baseUrls = {
      account: 'https://mybusinessaccountmanagement.googleapis.com/v1',
      business: 'https://mybusinessbusinessinformation.googleapis.com/v1',
      performance: 'https://businessprofileperformance.googleapis.com/v1',
      reviews: 'https://mybusiness.googleapis.com/v4', // Reviews y Media API
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

        // ÉLITE PRO: Logging estructurado solo para errores
        // No loguear requests exitosos (ruido innecesario)
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
    apiBase: 'account' | 'business' | 'performance' | 'reviews' = 'account',
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
    apiBase: 'account' | 'business' | 'performance' | 'reviews' = 'account',
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
    apiBase: 'account' | 'business' | 'performance' | 'reviews' = 'account',
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
    apiBase: 'account' | 'business' | 'performance' | 'reviews' = 'account',
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
    apiBase: 'account' | 'business' | 'performance' | 'reviews' = 'account',
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

    // ÉLITE PRO: Logging optimizado - solo en desarrollo y solo para debugging específico
    // No loguear cada request exitoso (ruido innecesario)
    // Comentar o remover en producción para mejor performance

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

  // ==================== REVIEWS API ====================

  /**
   * Lista reviews de una ubicación
   * GET /v4/accounts/{accountId}/locations/{locationId}/reviews
   *
   * Referencia oficial: https://developers.google.com/my-business/content/review-data#list_all_reviews
   * Endpoint: https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews
   *
   * @param accountId - ID de la cuenta
   * @param locationId - ID de la ubicación
   * @param options - Opciones de paginación
   * @returns Respuesta con reviews, averageRating, totalReviewCount, nextPageToken
   */
  async listReviews(
    accountId: string,
    locationId: string,
    options?: {
      pageSize?: number
      pageToken?: string
      orderBy?: string
    }
  ): Promise<GBPReviewsResponse> {
    const { pageSize, pageToken, orderBy } = options || {}
    const normalizedAccountId = accountId.replace(/^accounts\//, '')
    const params = new URLSearchParams()
    if (pageSize) params.append('pageSize', pageSize.toString())
    if (pageToken) params.append('pageToken', pageToken)
    if (orderBy) params.append('orderBy', orderBy)

    const queryString = params.toString()
    const endpoint = `/accounts/${normalizedAccountId}/locations/${locationId}/reviews${queryString ? `?${queryString}` : ''}`

    // ÉLITE: Reviews API usa base URL diferente (mybusiness.googleapis.com/v4)
    return this.get<GBPReviewsResponse>(endpoint, 'reviews')
  }

  /**
   * Obtiene un review específico
   * GET /v4/accounts/{accountId}/locations/{locationId}/reviews/{reviewId}
   *
   * Referencia oficial: https://developers.google.com/my-business/content/review-data#get_a_specific_review
   */
  async getReview(accountId: string, locationId: string, reviewId: string): Promise<GBPReview> {
    const normalizedAccountId = accountId.replace(/^accounts\//, '')
    const endpoint = `/accounts/${normalizedAccountId}/locations/${locationId}/reviews/${reviewId}`

    return this.get<GBPReview>(endpoint, 'reviews')
  }

  /**
   * Responde a un review
   * PUT /v4/accounts/{accountId}/locations/{locationId}/reviews/{reviewId}/reply
   *
   * Referencia oficial: https://developers.google.com/my-business/content/review-data#reply_to_a_review
   * Body: { reply: { comment: string } }
   */
  async replyToReview(
    accountId: string,
    locationId: string,
    reviewId: string,
    reply: { comment: string }
  ): Promise<{ reply: { comment: string; updateTime: string } }> {
    const normalizedAccountId = accountId.replace(/^accounts\//, '')
    const endpoint = `/accounts/${normalizedAccountId}/locations/${locationId}/reviews/${reviewId}/reply`

    return this.put<{ reply: { comment: string; updateTime: string } }>(endpoint, { reply }, 'reviews')
  }

  // ==================== MEDIA API ====================

  /**
   * Lista media (fotos/videos) de una ubicación
   * GET /v4/accounts/{accountId}/locations/{locationId}/media
   *
   * Referencia oficial: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.media/list
   */
  async listMedia(
    accountId: string,
    locationId: string,
    options?: {
      pageSize?: number
      pageToken?: string
    }
  ): Promise<GBPMediaResponse> {
    const { pageSize, pageToken } = options || {}
    const normalizedAccountId = accountId.replace(/^accounts\//, '')
    const params = new URLSearchParams()
    if (pageSize) params.append('pageSize', pageSize.toString())
    if (pageToken) params.append('pageToken', pageToken)

    const queryString = params.toString()
    const endpoint = `/accounts/${normalizedAccountId}/locations/${locationId}/media${queryString ? `?${queryString}` : ''}`

    // ÉLITE: Media API usa la misma base URL que Reviews (mybusiness.googleapis.com/v4)
    return this.get<GBPMediaResponse>(endpoint, 'reviews')
  }

  /**
   * Obtiene un media específico
   * GET /v4/accounts/{accountId}/locations/{locationId}/media/{mediaKey}
   */
  async getMedia(accountId: string, locationId: string, mediaKey: string): Promise<GBPMedia> {
    const normalizedAccountId = accountId.replace(/^accounts\//, '')
    const endpoint = `/accounts/${normalizedAccountId}/locations/${locationId}/media/${mediaKey}`

    return this.get<GBPMedia>(endpoint, 'reviews')
  }

  // ==================== PLACE ACTIONS API ====================

  /**
   * Lista place action links de una ubicación
   * GET /v1/locations/{locationId}/placeActionLinks
   *
   * Referencia oficial: https://developers.google.com/my-business/reference/placeactions/rest
   */
  async listPlaceActions(locationId: string): Promise<GBPPlaceActionsResponse> {
    const endpoint = `/locations/${locationId}/placeActionLinks`

    return this.get<GBPPlaceActionsResponse>(endpoint, 'business')
  }

  /**
   * Obtiene un place action específico
   * GET /v1/locations/{locationId}/placeActionLinks/{id}
   */
  async getPlaceAction(locationId: string, actionId: string): Promise<GBPPlaceAction> {
    const endpoint = `/locations/${locationId}/placeActionLinks/${actionId}`

    return this.get<GBPPlaceAction>(endpoint, 'business')
  }

  /**
   * Crea un place action link
   * POST /v1/locations/{locationId}/placeActionLinks
   */
  async createPlaceAction(
    locationId: string,
    placeAction: {
      placeActionType: string
      uri: string
      providerType?: string
      isPreferred?: boolean
    }
  ): Promise<GBPPlaceAction> {
    const endpoint = `/locations/${locationId}/placeActionLinks`

    return this.post<GBPPlaceAction>(endpoint, placeAction, 'business')
  }

  /**
   * Actualiza un place action link
   * PATCH /v1/locations/{locationId}/placeActionLinks/{id}
   */
  async updatePlaceAction(
    locationId: string,
    actionId: string,
    updateMask: string,
    placeAction: Partial<{
      uri: string
      isPreferred: boolean
    }>
  ): Promise<GBPPlaceAction> {
    const params = new URLSearchParams()
    params.append('updateMask', updateMask)

    const endpoint = `/locations/${locationId}/placeActionLinks/${actionId}?${params.toString()}`

    return this.patch<GBPPlaceAction>(endpoint, placeAction, 'business')
  }

  /**
   * Obtiene metadata de tipos de place actions disponibles
   * GET /v1/placeActionTypeMetadata
   */
  async getPlaceActionTypeMetadata(): Promise<{ placeActionTypeMetadata: GBPPlaceActionTypeMetadata[] }> {
    const endpoint = '/placeActionTypeMetadata'

    return this.get<{ placeActionTypeMetadata: GBPPlaceActionTypeMetadata[] }>(endpoint, 'business')
  }

  // ==================== ATTRIBUTES API ====================

  /**
   * Obtiene atributos de una ubicación
   * GET /v1/locations/{locationId}/attributes
   *
   * Referencia oficial: https://developers.google.com/my-business/reference/businessinformation/rest/v1/Attributes
   */
  async getLocationAttributes(locationId: string): Promise<GBPLocationAttributesResponse> {
    const endpoint = `/locations/${locationId}/attributes`

    return this.get<GBPLocationAttributesResponse>(endpoint, 'business')
  }

  /**
   * Actualiza atributos de una ubicación
   * PATCH /v1/locations/{locationId}/attributes?attributeMask={mask}
   *
   * Referencia oficial: https://developers.google.com/my-business/reference/businessinformation/rest/v1/Attributes
   * Body: { name: string, attributes: Array<Attribute> }
   */
  async updateLocationAttributes(
    locationId: string,
    attributeMask: string,
    attributes: {
      name: string
      attributes: Array<{
        name: string
        repeatedEnumValue?: {
          setValues: string[]
          unsetValues: string[]
        }
        uriValues?: Array<{ uri: string }>
        values?: string[]
      }>
    }
  ): Promise<GBPLocationAttributesResponse> {
    const params = new URLSearchParams()
    params.append('attributeMask', attributeMask)

    const endpoint = `/locations/${locationId}/attributes?${params.toString()}`

    return this.patch<GBPLocationAttributesResponse>(endpoint, attributes, 'business')
  }

  /**
   * Obtiene atributos disponibles para una ubicación
   * GET /v1/attributes?parent=locations/{locationId}
   */
  async getAvailableAttributes(locationId: string): Promise<GBPAvailableAttributesResponse> {
    const params = new URLSearchParams()
    params.append('parent', `locations/${locationId}`)

    const endpoint = `/attributes?${params.toString()}`

    return this.get<GBPAvailableAttributesResponse>(endpoint, 'business')
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
  GBPReview,
  GBPReviewsResponse,
  GBPMedia,
  GBPMediaResponse,
  GBPPlaceAction,
  GBPPlaceActionsResponse,
  GBPPlaceActionTypeMetadata,
  GBPAttribute,
  GBPLocationAttributesResponse,
  GBPAvailableAttributesResponse,
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
