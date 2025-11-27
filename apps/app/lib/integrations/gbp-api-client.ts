/**
 * Google Business Profile API Client
 *
 * Cliente para hacer consultas a la API de Google Business Profile.
 * Maneja automáticamente la renovación de tokens usando refresh_token.
 *
 * Referencias:
 * - https://developers.google.com/my-business/content/overview
 * - https://developers.google.com/my-business/content/basic-setup
 */

import { getGBPTokens, storeGBPTokens, isTokenExpired } from './gbp-tokens'
import { refreshAccessToken } from './gbp-oauth'

/**
 * Obtiene un access token válido para el usuario.
 * Si el token está expirado, lo renueva automáticamente usando el refresh_token.
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  const tokens = await getGBPTokens(userId)

  if (!tokens) {
    throw new Error('No tokens found. User needs to connect Google Business Profile first.')
  }

  // Si el token no está expirado, retornarlo directamente
  if (!isTokenExpired(tokens.expires_at)) {
    console.log('[GBP API] Using existing access token')
    return tokens.access_token
  }

  // Token expirado, renovarlo usando refresh_token
  console.log('[GBP API] Access token expired, refreshing...')

  const clientId = process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing GOOGLE_BUSINESS_PROFILE_CLIENT_ID or GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET')
  }

  const refreshedTokens = await refreshAccessToken(
    tokens.refresh_token,
    clientId,
    clientSecret
  )

  // Calcular nueva fecha de expiración
  const newExpiresAt = Date.now() + refreshedTokens.expires_in * 1000

  // Actualizar tokens en la base de datos
  await storeGBPTokens(userId, {
    access_token: refreshedTokens.access_token,
    refresh_token: tokens.refresh_token, // El refresh_token no cambia
    expires_at: newExpiresAt,
    token_type: refreshedTokens.token_type,
    scope: refreshedTokens.scope,
  })

  console.log('[GBP API] Access token refreshed successfully')
  return refreshedTokens.access_token
}

/**
 * Hace una petición autenticada a la API de Google Business Profile
 */
export async function makeGBPRequest(
  userId: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = await getValidAccessToken(userId)

  const url = endpoint.startsWith('http')
    ? endpoint
    : `https://mybusinessaccountmanagement.googleapis.com/v1/${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(`GBP API request failed: ${JSON.stringify(error)}`)
  }

  return response
}

/**
 * Ejemplo: Obtener todas las cuentas de Google Business Profile del usuario
 */
export async function getGBPAccounts(userId: string) {
  const response = await makeGBPRequest(userId, 'accounts')
  return response.json()
}

/**
 * Ejemplo: Obtener todas las ubicaciones de una cuenta
 */
export async function getGBPLocations(userId: string, accountName: string) {
  const response = await makeGBPRequest(
    userId,
    `accounts/${accountName}/locations`
  )
  return response.json()
}

/**
 * Ejemplo: Obtener métricas de rendimiento de una ubicación
 * Usa la API de Performance Reports
 */
export async function getGBPLocationMetrics(
  userId: string,
  locationName: string,
  startDate: string, // Formato: YYYY-MM-DD
  endDate: string // Formato: YYYY-MM-DD
) {
  // La API de Performance Reports tiene un endpoint diferente
  const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${locationName}/reportInsights`

  const response = await makeGBPRequest(
    userId,
    url,
    {
      method: 'POST',
      body: JSON.stringify({
        locationNames: [locationName],
        basicRequest: {
          metricRequests: [
            {
              metric: 'QUERIES_DIRECT',
            },
            {
              metric: 'QUERIES_INDIRECT',
            },
            {
              metric: 'VIEWS_MAPS',
            },
            {
              metric: 'VIEWS_SEARCH',
            },
            {
              metric: 'ACTIONS_WEBSITE',
            },
            {
              metric: 'ACTIONS_PHONE',
            },
            {
              metric: 'ACTIONS_DRIVING_DIRECTIONS',
            },
          ],
          timeRange: {
            startTime: `${startDate}T00:00:00Z`,
            endTime: `${endDate}T23:59:59Z`,
          },
        },
      }),
    }
  )

  return response.json()
}
