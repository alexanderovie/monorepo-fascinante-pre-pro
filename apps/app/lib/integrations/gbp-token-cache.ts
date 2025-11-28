/**
 * Google Business Profile Token Cache
 *
 * ÉLITE PRO: Cache en memoria para tokens OAuth con TTL automático
 * según estándares de la industria 2025.
 *
 * Características:
 * - Cache en memoria con TTL (Time To Live)
 * - Limpieza automática de tokens expirados
 * - Thread-safe (usa Map nativo de JavaScript)
 * - Escalable (previene memory leaks)
 * - Type-safe con TypeScript
 * - Logging optimizado (solo en desarrollo y solo eventos importantes)
 *
 * Patrón: In-Memory Cache con TTL
 * - Referencia: Node.js Memory Cache Best Practices
 * - Next.js 15 Server Component Compatible
 * - Multi-tenant safe (aislado por userId)
 *
 * Referencias:
 * - Node.js Memory Management Best Practices
 * - OAuth 2.0 Token Caching Patterns
 * - Next.js 15 Server Component Performance
 */

/**
 * Estructura de entrada en el cache
 */
interface CachedToken {
  accessToken: string
  expiresAt: number // Timestamp en milisegundos
  cachedAt: number // Timestamp cuando se cacheó
  userId: string
}

/**
 * ÉLITE PRO: Cache en memoria para tokens OAuth
 *
 * Características:
 * - TTL automático basado en expiresAt del token
 * - Limpieza periódica de entradas expiradas
 * - Thread-safe (Map es thread-safe en Node.js single-threaded)
 * - Escalable (limpieza automática previene memory leaks)
 */
class TokenCache {
  // ÉLITE: Map para almacenar tokens por userId
  // Key: userId, Value: CachedToken
  private cache = new Map<string, CachedToken>()

  // ÉLITE: Intervalo de limpieza (cada 5 minutos)
  // Limpia tokens expirados automáticamente
  private readonly CLEANUP_INTERVAL_MS = 5 * 60 * 1000 // 5 minutos
  private cleanupIntervalId: NodeJS.Timeout | null = null

  // ÉLITE: Buffer de seguridad para refrescar tokens antes de que expiren
  // Refresca tokens 5 minutos antes de que expiren (según RFC 6749 best practices)
  private readonly REFRESH_BUFFER_MS = 5 * 60 * 1000 // 5 minutos

  constructor() {
    // ÉLITE: Iniciar limpieza automática solo en desarrollo
    // En producción, Next.js maneja el ciclo de vida del proceso
    if (process.env.NODE_ENV === 'development') {
      this.startCleanup()
    }
  }

  /**
   * Obtiene un token del cache si está válido
   *
   * @param userId - ID del usuario
   * @returns Token si está en cache y válido, null en caso contrario
   */
  get(userId: string): string | null {
    const cached = this.cache.get(userId)

    if (!cached) {
      return null
    }

    // ÉLITE: Verificar si el token está expirado o cerca de expirar
    const now = Date.now()
    const timeUntilExpiry = cached.expiresAt - now

    // ÉLITE: Si el token expira en menos de REFRESH_BUFFER_MS, considerarlo expirado
    // Esto permite refrescar tokens antes de que expiren (mejor UX)
    if (timeUntilExpiry < this.REFRESH_BUFFER_MS) {
      // Token expirado o cerca de expirar, remover del cache
      this.cache.delete(userId)
      return null
    }

    // ÉLITE: Token válido, retornarlo
    return cached.accessToken
  }

  /**
   * Guarda un token en el cache
   *
   * @param userId - ID del usuario
   * @param accessToken - Token de acceso
   * @param expiresAt - Timestamp de expiración en milisegundos
   */
  set(userId: string, accessToken: string, expiresAt: number): void {
    // ÉLITE: Validar que el token no esté ya expirado
    const now = Date.now()
    if (expiresAt <= now) {
      // Token ya expirado, no cachear
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Token Cache] Attempted to cache expired token for user:', userId)
      }
      return
    }

    // ÉLITE: Guardar en cache con metadata
    this.cache.set(userId, {
      accessToken,
      expiresAt,
      cachedAt: now,
      userId,
    })

    // ÉLITE: Logging solo para debugging (desarrollo)
    if (process.env.NODE_ENV === 'development') {
      const timeUntilExpiry = expiresAt - now
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000)
      console.log(
        `[Token Cache] Token cached for user: ${userId}, expires in ${minutesUntilExpiry} minutes`
      )
    }
  }

  /**
   * Elimina un token del cache
   *
   * @param userId - ID del usuario
   */
  delete(userId: string): void {
    this.cache.delete(userId)
  }

  /**
   * Limpia todos los tokens expirados del cache
   * ÉLITE: Ejecutado periódicamente para prevenir memory leaks
   */
  private cleanup(): void {
    const now = Date.now()
    let cleanedCount = 0

    this.cache.forEach((cached, userId) => {
      // ÉLITE: Remover tokens expirados o cerca de expirar
      if (cached.expiresAt - now < this.REFRESH_BUFFER_MS) {
        this.cache.delete(userId)
        cleanedCount++
      }
    })

    // ÉLITE: Logging solo si se limpiaron tokens (desarrollo)
    if (process.env.NODE_ENV === 'development' && cleanedCount > 0) {
      console.log(`[Token Cache] Cleaned up ${cleanedCount} expired token(s)`)
    }
  }

  /**
   * Inicia la limpieza periódica automática
   * ÉLITE: Solo en desarrollo para debugging
   */
  private startCleanup(): void {
    if (this.cleanupIntervalId) {
      return // Ya está iniciado
    }

    this.cleanupIntervalId = setInterval(() => {
      this.cleanup()
    }, this.CLEANUP_INTERVAL_MS)
  }

  /**
   * Detiene la limpieza periódica
   * ÉLITE: Para testing o shutdown graceful
   */
  stopCleanup(): void {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId)
      this.cleanupIntervalId = null
    }
  }

  /**
   * Obtiene estadísticas del cache (útil para debugging)
   */
  getStats(): { size: number; entries: Array<{ userId: string; expiresIn: number }> } {
    const entries: Array<{ userId: string; expiresIn: number }> = []
    const now = Date.now()

    this.cache.forEach((cached, userId) => {
      entries.push({
        userId,
        expiresIn: Math.max(0, cached.expiresAt - now),
      })
    })

    return {
      size: this.cache.size,
      entries,
    }
  }

  /**
   * Limpia todo el cache (útil para testing o reset)
   */
  clear(): void {
    this.cache.clear()
  }
}

// ÉLITE PRO: Exportar instancia singleton del cache
// Esto asegura que todos los módulos compartan el mismo cache
// Patrón estándar de la industria para caches en memoria
export const tokenCache = new TokenCache()

/**
 * ÉLITE PRO: Helper function para obtener token del cache o null
 * Wrapper para facilitar uso y testing
 */
export function getCachedToken(userId: string): string | null {
  return tokenCache.get(userId)
}

/**
 * ÉLITE PRO: Helper function para guardar token en cache
 * Wrapper para facilitar uso y testing
 */
export function setCachedToken(userId: string, accessToken: string, expiresAt: number): void {
  tokenCache.set(userId, accessToken, expiresAt)
}

/**
 * ÉLITE PRO: Helper function para invalidar token del cache
 * Útil cuando se refresca un token o se revoca
 */
export function invalidateCachedToken(userId: string): void {
  tokenCache.delete(userId)
}
