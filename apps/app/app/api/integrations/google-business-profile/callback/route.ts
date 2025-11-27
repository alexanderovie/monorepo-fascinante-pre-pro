import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { exchangeCodeForTokens } from '@/lib/integrations/gbp-oauth'
import { validateGBPOAuthState } from '@/lib/integrations/gbp-oauth-state'
import { storeGBPTokens } from '@/lib/integrations/gbp-tokens'
import { getRedirectUri } from '@/lib/integrations/gbp-redirect-uri'

/**
 * Callback Route - Maneja el callback de OAuth de Google Business Profile
 *
 * Este endpoint:
 * 1. Valida el state parameter (CSRF protection)
 * 2. Intercambia el código de autorización por tokens
 * 3. Almacena los tokens de forma segura
 * 4. Redirige al usuario a la página de integraciones
 *
 * Best Practices:
 * - Validación de state (CSRF protection)
 * - Manejo de errores robusto
 * - Almacenamiento seguro de tokens
 * - Logging para debugging
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  try {
    // Verificar autenticación
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      const errorUrl = new URL(`${origin}/account/integrations`)
      errorUrl.searchParams.set('error', 'unauthorized')
      errorUrl.searchParams.set('message', 'Please log in first')
      return NextResponse.redirect(errorUrl)
    }

    // Manejar errores del proveedor OAuth
    if (error) {
      console.error('[GBP OAuth] Provider error:', {
        error,
        errorDescription,
        userId: user.id,
      })

      const errorUrl = new URL(`${origin}/account/integrations`)
      errorUrl.searchParams.set('error', 'oauth_error')
      errorUrl.searchParams.set(
        'message',
        errorDescription || error || 'OAuth authorization failed'
      )
      return NextResponse.redirect(errorUrl)
    }

    // Validar código
    if (!code) {
      console.error('[GBP OAuth] Missing code parameter')
      const errorUrl = new URL(`${origin}/account/integrations`)
      errorUrl.searchParams.set('error', 'missing_code')
      errorUrl.searchParams.set('message', 'Authorization code not received')
      return NextResponse.redirect(errorUrl)
    }

    // Validar state (CSRF protection)
    if (!state || !(await validateGBPOAuthState(state))) {
      console.error('[GBP OAuth] Invalid or missing state parameter')
      const errorUrl = new URL(`${origin}/account/integrations`)
      errorUrl.searchParams.set('error', 'invalid_state')
      errorUrl.searchParams.set(
        'message',
        'Security validation failed. Please try again.'
      )
      return NextResponse.redirect(errorUrl)
    }

    // Obtener variables de entorno
    const clientId = process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('[GBP OAuth] Missing environment variables:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
      })
      const errorUrl = new URL(`${origin}/account/integrations`)
      errorUrl.searchParams.set('error', 'server_error')
      errorUrl.searchParams.set(
        'message',
        'Server configuration error. Please contact support.'
      )
      return NextResponse.redirect(errorUrl)
    }

    // Construir redirect URI dinámicamente (debe coincidir con el usado en /connect)
    const redirectUri = getRedirectUri(request)

    console.log('[GBP OAuth] Using redirect URI:', redirectUri)

    // Intercambiar código por tokens
    console.log('[GBP OAuth] Exchanging code for tokens...', {
      userId: user.id,
      codeLength: code.length,
    })

    const tokens = await exchangeCodeForTokens(
      code,
      clientId,
      clientSecret,
      redirectUri
    )

    // Log detallado de los tokens recibidos (sin exponer valores completos por seguridad)
    console.log('[GBP OAuth] Tokens received from Google:', {
      hasAccessToken: !!tokens.access_token,
      accessTokenLength: tokens.access_token?.length || 0,
      hasRefreshToken: !!tokens.refresh_token,
      refreshTokenLength: tokens.refresh_token?.length || 0,
      expiresIn: tokens.expires_in,
      tokenType: tokens.token_type,
      scope: tokens.scope,
    })

    // Verificar que se obtuvo el refresh_token
    if (!tokens.refresh_token) {
      console.warn('[GBP OAuth] WARNING: No refresh_token received from Google')
      console.warn('[GBP OAuth] This can happen if the user already authorized the app before')
      console.warn('[GBP OAuth] Solution: User needs to revoke access and re-authorize, or use prompt=consent')
    }

    // Calcular fecha de expiración
    const expiresAt = Date.now() + tokens.expires_in * 1000

    // Almacenar tokens
    await storeGBPTokens(user.id, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || '', // Puede estar vacío si no se recibió
      expires_at: expiresAt,
      token_type: tokens.token_type,
      scope: tokens.scope,
    })

    console.log('[GBP OAuth] Tokens stored successfully', {
      userId: user.id,
      hasRefreshToken: !!tokens.refresh_token,
      expiresAt: new Date(expiresAt).toISOString(),
    })

    // Redirigir a página de integraciones con éxito
    const successUrl = new URL(`${origin}/account/integrations`)
    successUrl.searchParams.set('success', 'true')
    successUrl.searchParams.set(
      'message',
      'Google Business Profile connected successfully!'
    )
    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error('[GBP OAuth] Error in callback route:', error)

    const errorUrl = new URL(`${origin}/account/integrations`)
    errorUrl.searchParams.set('error', 'internal_error')
    errorUrl.searchParams.set(
      'message',
      error instanceof Error ? error.message : 'An unexpected error occurred'
    )
    return NextResponse.redirect(errorUrl)
  }
}
