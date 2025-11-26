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
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')
  const provider = searchParams.get('provider') || 'unknown'

  // Log detallado de TODOS los parámetros recibidos
  authLogger.debug('OAuth callback received', {
    action: 'oauth_callback_received',
    provider,
    hasCode: !!code,
    codeLength: code?.length || 0,
    hasState: !!state,
    stateValue: state ? `${state.substring(0, 8)}...` : null, // Solo primeros 8 chars
    stateLength: state?.length || 0,
    hasError: !!errorParam,
    errorCode,
    errorDescription,
    allParams: Object.fromEntries(searchParams.entries()), // Todos los params para debugging
    url: request.url,
    timestamp: Date.now(),
  })

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
    errorCode,
  })

  // Manejar errores del proveedor OAuth
  if (errorParam) {
    // Log detallado del error del proveedor
    authLogger.error('OAuth provider returned error', {
      action: 'oauth_provider_error',
      provider,
      error: errorParam,
      errorCode,
      errorDescription,
      hasState: !!state,
      stateValue: state ? `${state.substring(0, 8)}...` : null,
      allParams: Object.fromEntries(searchParams.entries()),
      timestamp: Date.now(),
    })

    // Detectar específicamente bad_oauth_state
    const isStateError = errorCode === 'bad_oauth_state' || 
                        errorParam === 'invalid_request' && errorCode === 'bad_oauth_state'

    const oauthError = createOAuthError(
      isStateError 
        ? OAuthErrorCode.STATE_MISMATCH
        : errorParam === 'access_denied' 
          ? OAuthErrorCode.USER_DENIED 
          : OAuthErrorCode.PROVIDER_ERROR,
      errorDescription || errorParam,
      {
        provider,
        userMessage: isStateError
          ? 'Error de seguridad en la autenticación. Por favor, intenta nuevamente.'
          : errorParam === 'access_denied'
            ? 'Has cancelado el inicio de sesión.'
            : 'Error del proveedor de autenticación. Por favor, intenta más tarde.',
      }
    )

    // Redirigir a página de error con información
    const errorUrl = new URL(`${origin}/auth/auth-code-error`)
    errorUrl.searchParams.set('code', oauthError.code)
    errorUrl.searchParams.set('message', oauthError.userMessage)
    // Preservar información de debugging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      errorUrl.searchParams.set('debug_error', errorParam)
      errorUrl.searchParams.set('debug_code', errorCode || '')
      errorUrl.searchParams.set('debug_description', errorDescription || '')
    }

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

    // Log ANTES de exchangeCodeForSession
    authLogger.debug('About to exchange code for session', {
      action: 'oauth_code_exchange_start',
      provider,
      codeLength: code.length,
      codePrefix: code.substring(0, 8) + '...', // Solo primeros 8 chars
      hasState: !!state,
      stateValue: state ? `${state.substring(0, 8)}...` : null,
      timestamp: Date.now(),
    })

    // Usar retry para fallos transitorios (red, timeouts, etc.)
    const { data: sessionData, error } = await withRetry(
      async () => {
        const result = await supabase.auth.exchangeCodeForSession(code)
        
        // Log del resultado inmediato
        authLogger.debug('exchangeCodeForSession result', {
          action: 'oauth_code_exchange_result',
          provider,
          hasError: !!result.error,
          errorMessage: result.error?.message,
          errorStatus: result.error?.status,
          hasSession: !!result.data?.session,
          hasUser: !!result.data?.user,
          timestamp: Date.now(),
        })
        
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
      // Log detallado del error
      authLogger.error('Code exchange failed with detailed error', {
        action: 'oauth_code_exchange_error',
        provider,
        errorMessage: error.message,
        errorStatus: error.status,
        errorName: error.name,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        codeLength: code.length,
        hasState: !!state,
        timestamp: Date.now(),
      })

      authLogger.codeExchange(provider, false, {
        error: error.message,
        errorStatus: error.status,
      })

      const oauthError = mapSupabaseErrorToOAuthError(error, provider)

      const errorUrl = new URL(`${origin}/auth/auth-code-error`)
      errorUrl.searchParams.set('code', oauthError.code)
      errorUrl.searchParams.set('message', oauthError.userMessage)

      return NextResponse.redirect(errorUrl)
    }

    // Éxito - log detallado y redirección
    const duration = Date.now() - startTime
    authLogger.debug('Code exchange successful', {
      action: 'oauth_code_exchange_success',
      provider,
      duration,
      hasSession: !!sessionData?.session,
      hasUser: !!sessionData?.user,
      userId: sessionData?.user?.id,
      timestamp: Date.now(),
    })
    
    authLogger.codeExchange(provider, true, {
      duration,
      userId: sessionData?.user?.id,
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
