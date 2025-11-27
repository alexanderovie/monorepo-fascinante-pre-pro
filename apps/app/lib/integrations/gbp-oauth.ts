/**
 * Google Business Profile OAuth Utilities
 *
 * Utilidades para el flujo OAuth 2.0 de Google Business Profile APIs.
 * Basado en la documentación oficial de Google Business Profile APIs.
 *
 * Scopes requeridos:
 * - https://www.googleapis.com/auth/business.manage
 *
 * Referencias:
 * - https://developers.google.com/my-business/content/oauth
 */

/**
 * Scopes de OAuth para Google Business Profile
 */
export const GBP_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/business.manage',
].join(' ')

/**
 * URL base de autorización de Google OAuth 2.0
 */
export const GOOGLE_OAUTH_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

/**
 * URL para intercambiar código por tokens
 */
export const GOOGLE_OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token'

/**
 * Genera la URL de autorización OAuth para Google Business Profile
 */
export function generateGBPOAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GBP_OAUTH_SCOPES,
    access_type: 'offline', // Necesario para obtener refresh token
    prompt: 'consent', // Fuerza mostrar consentimiento para obtener refresh token
    state,
  })

  return `${GOOGLE_OAUTH_AUTH_URL}?${params.toString()}`
}

/**
 * Intercambia el código de autorización por tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  scope: string
}> {
  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(
      `Failed to exchange code for tokens: ${JSON.stringify(error)}`
    )
  }

  const tokenResponse = await response.json()

  // Log detallado (sin exponer valores completos por seguridad)
  console.log('[GBP OAuth] Token exchange response:', {
    hasAccessToken: !!tokenResponse.access_token,
    hasRefreshToken: !!tokenResponse.refresh_token,
    refreshTokenLength: tokenResponse.refresh_token?.length || 0,
    expiresIn: tokenResponse.expires_in,
    tokenType: tokenResponse.token_type,
    scope: tokenResponse.scope,
  })

  // Validar que se recibió el refresh_token
  if (!tokenResponse.refresh_token) {
    console.warn('[GBP OAuth] WARNING: Google did not return refresh_token')
    console.warn('[GBP OAuth] This usually happens if:')
    console.warn('[GBP OAuth] 1. User already authorized before (revoke and re-authorize)')
    console.warn('[GBP OAuth] 2. prompt=consent was not used in authorization URL')
    console.warn('[GBP OAuth] 3. access_type=offline was not used')
  }

  return tokenResponse
}

/**
 * Refresca el access token usando el refresh token
 */
export async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<{
  access_token: string
  expires_in: number
  token_type: string
  scope: string
}> {
  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(
      `Failed to refresh access token: ${JSON.stringify(error)}`
    )
  }

  return response.json()
}
