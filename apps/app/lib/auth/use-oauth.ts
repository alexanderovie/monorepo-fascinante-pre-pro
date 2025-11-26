/**
 * useOAuth Hook
 *
 * Hook personalizado para manejar flujos OAuth de forma consistente.
 * Centraliza la lógica de OAuth y facilita su uso en componentes.
 *
 * Best Practices:
 * - Loading states
 * - Error handling
 * - Logging
 * - State management (CSRF protection)
 * - Type safety
 */

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { authLogger } from '@/lib/logger/auth-logger'
import { createOAuthError, OAuthErrorCode } from '@/lib/auth/oauth-errors'
import { generateOAuthState, storeOAuthState } from '@/lib/auth/oauth-state'
import { isProviderEnabled, type OAuthProvider } from '@/lib/auth/oauth-config'

export interface UseOAuthReturn {
  signIn: (provider: OAuthProvider) => Promise<void>
  isLoading: boolean
  error: string | null
}

/**
 * Hook para manejar OAuth flows
 */
export function useOAuth(): UseOAuthReturn {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = useCallback(async (provider: OAuthProvider) => {
    // Resetear error
    setError(null)
    setIsLoading(true)

    try {
      // Validar que el proveedor esté habilitado
      if (!isProviderEnabled(provider)) {
        const oauthError = createOAuthError(
          OAuthErrorCode.PROVIDER_NOT_ENABLED,
          `Provider ${provider} is not enabled`,
          { provider }
        )
        
        setError(oauthError.userMessage)
        authLogger.error('OAuth provider not enabled', {
          action: 'oauth_start',
          provider,
        })
        return
      }

      // Generar y almacenar state para CSRF protection
      const state = generateOAuthState()
      storeOAuthState(provider, state)

      // Log del inicio
      authLogger.oauthStart(provider)

      // Crear cliente Supabase
      const supabase = createClient()

      // Iniciar flujo OAuth
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?provider=${provider}`,
          queryParams: {
            // Agregar state para validación CSRF (opcional pero recomendado)
            // Nota: Supabase puede manejar esto automáticamente, pero es buena práctica
            state,
          },
        },
      })

      if (oauthError) {
        const error = mapSupabaseErrorToOAuthError(oauthError, provider)
        setError(error.userMessage)
        
        authLogger.error('OAuth sign in failed', {
          action: 'oauth_start',
          provider,
          error: oauthError,
        })
        
        // Redirigir a página de error
        router.push(`/auth/auth-code-error?code=${error.code}&message=${encodeURIComponent(error.userMessage)}`)
        return
      }

      // Redirigir a la URL de OAuth si está disponible
      if (data?.url) {
        window.location.href = data.url
      } else {
        // Si no hay URL, algo salió mal
        const error = createOAuthError(
          OAuthErrorCode.UNKNOWN_ERROR,
          'No OAuth URL returned',
          { provider }
        )
        setError(error.userMessage)
      }
    } catch (err) {
      const error = mapSupabaseErrorToOAuthError(err, provider)
      setError(error.userMessage)
      
      authLogger.error('Unexpected error in OAuth sign in', {
        action: 'oauth_start',
        provider,
        error: err,
      })
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return {
    signIn,
    isLoading,
    error,
  }
}

/**
 * Helper para mapear errores de Supabase a OAuthError
 */
function mapSupabaseErrorToOAuthError(
  error: unknown,
  provider: string
): ReturnType<typeof createOAuthError> {
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = String(error.message).toLowerCase()
    
    if (errorMessage.includes('network') || errorMessage.includes('red')) {
      return createOAuthError(OAuthErrorCode.NETWORK_ERROR, String(error), { provider, originalError: error })
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('tiempo')) {
      return createOAuthError(OAuthErrorCode.TIMEOUT, String(error), { provider, originalError: error })
    }
  }
  
  return createOAuthError(OAuthErrorCode.UNKNOWN_ERROR, String(error), { provider, originalError: error })
}

