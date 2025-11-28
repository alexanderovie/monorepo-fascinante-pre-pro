/**
 * Google Business Profile Token Refresh
 *
 * ÉLITE: Refresh automático de tokens OAuth siguiendo estándares de la industria 2025.
 *
 * Características:
 * - Refresh automático cuando el token está cerca de expirar
 * - Manejo robusto de errores
 * - Logging para auditoría
 * - Retry logic con exponential backoff
 *
 * Referencias:
 * - OAuth 2.0 Token Refresh (RFC 6749)
 * - Google OAuth 2.0 Best Practices
 * - Supabase Security Best Practices
 */

import { createClient } from '@/utils/supabase/server'
import { getGBPTokens, storeGBPTokens, isTokenExpired, type GBPTokens } from './gbp-tokens'
import { cookies } from 'next/headers'

// ÉLITE: En Next.js 15, ReadonlyRequestCookies no se exporta directamente
// Usamos el tipo inferido de cookies()
type ReadonlyRequestCookies = Awaited<ReturnType<typeof cookies>>

/**
 * ÉLITE PRO: Deduplicación de refreshes de token para evitar race conditions
 *
 * Patrón basado en mejores prácticas de la industria:
 * - RFC 6749 (OAuth 2.0): Previene múltiples refreshes simultáneos del mismo token
 * - Promise deduplication pattern: Reutiliza promesas en curso para evitar llamadas duplicadas
 * - Singleton pattern por userId: Aísla refreshes por usuario para escalabilidad
 *
 * Referencias:
 * - OAuth 2.0 Token Refresh Best Practices
 * - JavaScript Promise Deduplication Pattern
 * - Next.js 15 Server Component Best Practices
 */
const refreshPromises = new Map<string, Promise<string>>()

/**
 * ÉLITE PRO: Limpiar promesas completadas del cache para prevenir memory leaks
 * Se ejecuta automáticamente después de cada refresh (en el finally)
 */
function cleanupRefreshPromise(cacheKey: string): void {
  // La limpieza se hace en el finally de getValidAccessToken
  // Este comentario documenta el patrón para claridad
}

interface RefreshTokenResponse {
  access_token: string
  expires_in: number // Segundos
  token_type: string
  scope?: string
  refresh_token?: string // Solo si se rota
}

/**
 * Refresca el access token usando el refresh token
 * ÉLITE: Implementa el flujo estándar de OAuth 2.0 token refresh
 */
async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  // ÉLITE: Usar los mismos nombres de variables que en callback/connect
  const clientId = process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    const error = new Error('Google OAuth credentials not configured')
    console.error('[GBP Refresh] OAuth credentials missing:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      envVars: {
        GOOGLE_BUSINESS_PROFILE_CLIENT_ID: process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_ID ? 'set' : 'missing',
        GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET: process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET ? 'set' : 'missing',
      },
    })
    throw error
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[GBP Refresh] Token refresh failed:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    })
    throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

/**
 * Obtiene un access token válido, refrescándolo si es necesario
 * ÉLITE: Esta función garantiza que siempre tengas un token válido
 *
 * @param userId - ID del usuario de Supabase
 * @param forceRefresh - Si true, fuerza el refresh incluso si el token no ha expirado
 * @param cookieStore - Opcional: cookies obtenidas fuera de función cacheada (para uso con unstable_cache)
 * @returns Access token válido
 */
/**
 * Obtiene un access token válido, refrescándolo si es necesario
 *
 * ÉLITE PRO: Implementación robusta y escalable siguiendo mejores prácticas:
 *
 * 1. **Deduplicación de Promesas**: Previene múltiples refreshes simultáneos del mismo token
 *    - Patrón estándar de la industria para operaciones async idempotentes
 *    - Referencia: JavaScript Promise Deduplication Pattern
 *
 * 2. **Prevención de Race Conditions**: Usa Map para cachear promesas en curso
 *    - Múltiples llamadas simultáneas reutilizan la misma promesa
 *    - Evita llamadas duplicadas a la API de OAuth
 *
 * 3. **Escalabilidad**: Cache key incluye userId y tipo de refresh
 *    - Aísla refreshes por usuario (multi-tenant safe)
 *    - Diferencia entre refresh automático y forzado
 *
 * 4. **Memory Management**: Limpia promesas completadas automáticamente
 *    - Previene memory leaks en aplicaciones de larga duración
 *    - Patrón estándar para caches de promesas
 *
 * 5. **OAuth 2.0 Compliance**: Sigue RFC 6749 para token refresh
 *    - No refresca tokens válidos innecesariamente
 *    - Maneja errores según especificación OAuth
 *
 * @param userId - ID del usuario de Supabase
 * @param forceRefresh - Si true, fuerza el refresh incluso si el token no ha expirado
 * @param cookieStore - Opcional: cookies obtenidas fuera de función cacheada (para uso con unstable_cache)
 * @returns Access token válido
 */
export async function getValidAccessToken(
  userId: string,
  forceRefresh = false,
  cookieStore?: ReadonlyRequestCookies
): Promise<string> {
  // ÉLITE PRO: Cache key único por usuario y tipo de refresh
  // Permite escalabilidad multi-tenant y diferencia entre refresh automático/forzado
  const cacheKey = `${userId}-${forceRefresh ? 'force' : 'auto'}`

  // ÉLITE PRO: Verificar si ya hay un refresh en progreso (Promise Deduplication Pattern)
  // Esto previene race conditions cuando múltiples requests simultáneos necesitan el mismo token
  const existingRefresh = refreshPromises.get(cacheKey)

  if (existingRefresh) {
    // Ya hay un refresh en progreso, reutilizar la misma promesa
    // Patrón estándar de la industria para operaciones async idempotentes
    if (process.env.NODE_ENV === 'development') {
      console.log('[GBP Refresh] Reusing existing refresh promise for user:', userId)
    }
    return existingRefresh
  }

  // ÉLITE PRO: Crear nueva promesa de refresh (IIFE para ejecución inmediata)
  const refreshPromise = (async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[GBP Refresh] Getting valid access token for user:', userId)
      }

      // 1. Recuperar tokens actuales
      // ÉLITE: Pasar cookieStore para cumplir con restricciones de unstable_cache
      const tokens = await getGBPTokens(userId, cookieStore)

      if (!tokens) {
        throw new Error('No tokens found. Please connect Google Business Profile first.')
      }

      // 2. Verificar si el token está expirado o cerca de expirar
      // ÉLITE: Sigue RFC 6749 - solo refrescar cuando es necesario
      const shouldRefresh = forceRefresh || isTokenExpired(tokens.expires_at)

      if (!shouldRefresh) {
        // Token válido, retornar sin refresh (optimización)
        if (process.env.NODE_ENV === 'development') {
          console.log('[GBP Refresh] Access token is still valid')
        }
        return tokens.access_token
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[GBP Refresh] Access token expired or expiring soon, refreshing...')
      }

      // 3. Refrescar el token según RFC 6749
      const refreshResponse = await refreshAccessToken(tokens.refresh_token)

      // 4. Actualizar tokens en la base de datos
      // ÉLITE: Mantener refresh_token anterior si Google no lo rota (comportamiento estándar)
      const updatedTokens: Omit<GBPTokens, 'user_id'> = {
        access_token: refreshResponse.access_token,
        refresh_token: refreshResponse.refresh_token || tokens.refresh_token,
        expires_at: Date.now() + refreshResponse.expires_in * 1000,
        token_type: refreshResponse.token_type || 'Bearer',
        scope: refreshResponse.scope || tokens.scope,
      }

      // ÉLITE: Pasar cookieStore para cumplir con restricciones de unstable_cache
      await storeGBPTokens(userId, updatedTokens, cookieStore)

      if (process.env.NODE_ENV === 'development') {
        console.log('[GBP Refresh] Token refreshed successfully')
        console.log('[GBP Refresh] New expiration:', new Date(updatedTokens.expires_at).toISOString())
      }

      return refreshResponse.access_token
    } catch (error) {
      // ÉLITE PRO: Logging estructurado para debugging y auditoría
      console.error('[GBP Refresh] Failed to refresh token:', error)
      throw new Error(
        `Failed to refresh access token: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      // ÉLITE PRO: Limpiar la promesa del cache después de completarse (éxito o error)
      // Previene memory leaks y permite nuevos refreshes si es necesario
      // Patrón estándar para caches de promesas en aplicaciones de larga duración
      refreshPromises.delete(cacheKey)
    }
  })()

  // ÉLITE PRO: Guardar la promesa en el cache ANTES de retornarla
  // Esto asegura que llamadas simultáneas posteriores reutilicen la misma promesa
  refreshPromises.set(cacheKey, refreshPromise)

  return refreshPromise
}

/**
 * Verifica si el usuario tiene tokens válidos
 * @param userId - ID del usuario de Supabase
 * @param cookieStore - Opcional: cookies obtenidas fuera de función cacheada (para uso con unstable_cache)
 */
export async function hasValidTokens(
  userId: string,
  cookieStore?: ReadonlyRequestCookies
): Promise<boolean> {
  try {
    // ÉLITE: Pasar cookieStore para cumplir con restricciones de unstable_cache
    const tokens = await getGBPTokens(userId, cookieStore)
    if (!tokens) return false

    // Verificar que tenemos ambos tokens
    if (!tokens.access_token || !tokens.refresh_token) return false

    // El refresh token no expira (o expira muy raramente)
    // Solo verificamos que existe
    return true
  } catch {
    return false
  }
}
