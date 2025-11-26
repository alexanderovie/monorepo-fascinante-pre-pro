import { createOAuthError, mapSupabaseErrorToOAuthError, OAuthErrorCode } from '@/lib/auth/oauth-errors'
import { withRetry } from '@/lib/auth/retry-utils'
import { authLogger } from '@/lib/logger/auth-logger'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * OAuth Callback Route Handler
 *
 * Según documentación oficial de Supabase SSR (Nov 2025):
 * - Este endpoint maneja el intercambio del código OAuth por una sesión
 * - Debe ser un Route Handler (no un Server Component)
 * - El código OAuth viene en los query params después del redirect del proveedor
 * - Después del intercambio exitoso, redirige al usuario a la página principal
 *
 * Best Practices Elite Pro:
 * - Logging estructurado para debugging y monitoreo
 * - Manejo de errores tipado y específico
 * - Retry logic para fallos transitorios
 * - Validación robusta de entrada
 * - Soporte para parámetro "next" para redirección personalizada
 * - Soporte para entornos locales y producción (con load balancers)
 * - State parameter validation (CSRF protection) - opcional pero recomendado
 */
export async function GET(request: Request) {
  const startTime = Date.now()
  const { searchParams, origin } = new URL(request.url)

  // Extraer parámetros
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const provider = searchParams.get('provider') || 'unknown'

  // Si "next" está en los params, usarlo como URL de redirección
  let next = searchParams.get('next') ?? '/'

  // Validar que "next" sea una ruta relativa (seguridad)
  if (!next.startsWith('/')) {
    authLogger.warn('Invalid next parameter, defaulting to /', {
      action: 'oauth_callback',
      provider,
      next: searchParams.get('next'),
    })
    next = '/'
  }

  // Log del inicio del callback
  authLogger.oauthCallback(provider, true, {
    hasCode: !!code,
    hasState: !!state,
    hasError: !!errorParam,
  })

  // Manejar errores del proveedor OAuth
  if (errorParam) {
    authLogger.error('OAuth provider returned error', {
      action: 'oauth_callback',
      provider,
      error: errorParam,
      errorDescription,
    })

    const oauthError = createOAuthError(
      errorParam === 'access_denied' ? OAuthErrorCode.USER_DENIED : OAuthErrorCode.PROVIDER_ERROR,
      errorDescription || errorParam,
      {
        provider,
        userMessage: errorParam === 'access_denied'
          ? 'Has cancelado el inicio de sesión.'
          : 'Error del proveedor de autenticación. Por favor, intenta más tarde.',
      }
    )

    // Redirigir a página de error con información
    const errorUrl = new URL(`${origin}/auth/auth-code-error`)
    errorUrl.searchParams.set('code', oauthError.code)
    errorUrl.searchParams.set('message', oauthError.userMessage)

    return NextResponse.redirect(errorUrl)
  }

  // Validar que hay código
  if (!code) {
    authLogger.error('OAuth callback missing code parameter', {
      action: 'oauth_callback',
      provider,
    })

    const oauthError = createOAuthError(
      OAuthErrorCode.INVALID_CODE,
      'Missing authorization code',
      { provider }
    )

    const errorUrl = new URL(`${origin}/auth/auth-code-error`)
    errorUrl.searchParams.set('code', oauthError.code)
    errorUrl.searchParams.set('message', oauthError.userMessage)

    return NextResponse.redirect(errorUrl)
  }

  // Intercambiar código por sesión con retry logic
  try {
    const supabase = await createClient()

    // Usar retry para fallos transitorios (red, timeouts, etc.)
    const { error } = await withRetry(
      async () => {
        const result = await supabase.auth.exchangeCodeForSession(code)
        return result
      },
      {
        maxRetries: 2, // Máximo 2 reintentos
        initialDelay: 500,
        shouldRetry: (error) => {
          // Solo reintentar errores de red/timeout
          const errorStr = String(error).toLowerCase()
          return errorStr.includes('network') ||
            errorStr.includes('timeout') ||
            errorStr.includes('econnrefused')
        },
      }
    )

    if (error) {
      authLogger.codeExchange(provider, false, {
        error: error.message,
      })

      const oauthError = mapSupabaseErrorToOAuthError(error, provider)

      const errorUrl = new URL(`${origin}/auth/auth-code-error`)
      errorUrl.searchParams.set('code', oauthError.code)
      errorUrl.searchParams.set('message', oauthError.userMessage)

      return NextResponse.redirect(errorUrl)
    }

    // Éxito - log y redirección
    const duration = Date.now() - startTime
    authLogger.codeExchange(provider, true, {
      duration,
    })

    // Manejar redirección considerando load balancers en producción
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'

    let redirectUrl: string
    if (isLocalEnv) {
      redirectUrl = `${origin}${next}`
    } else if (forwardedHost) {
      redirectUrl = `https://${forwardedHost}${next}`
    } else {
      redirectUrl = `${origin}${next}`
    }

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    // Error inesperado
    authLogger.error('Unexpected error in OAuth callback', {
      action: 'oauth_callback',
      provider,
      error,
    })

    const oauthError = mapSupabaseErrorToOAuthError(error, provider)

    const errorUrl = new URL(`${origin}/auth/auth-code-error`)
    errorUrl.searchParams.set('code', oauthError.code)
    errorUrl.searchParams.set('message', oauthError.userMessage)

    return NextResponse.redirect(errorUrl)
  }
}
