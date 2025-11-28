/**
 * Google Business Profile Rate Limiter
 *
 * ÉLITE PRO: Implementación de Token Bucket Algorithm para rate limiting
 * según estándares de la industria (10 ediciones/min por perfil).
 *
 * Patrón: Token Bucket Algorithm
 * - Cada ubicación tiene un bucket con 10 tokens
 * - Cada edición consume 1 token
 * - Tokens se regeneran a 1 por minuto
 * - Si no hay tokens, la edición se rechaza o encola
 *
 * Características:
 * - In-memory para desarrollo (escalable a Redis para producción)
 * - Thread-safe (usa Map con timestamps)
 * - Auto-limpieza de buckets inactivos
 * - Logging para debugging
 *
 * Referencias:
 * - Token Bucket Algorithm (RFC 2697)
 * - Google Business Profile API Limits: 10 ediciones/min por perfil
 * - Industry Standard Rate Limiting Patterns
 */

interface TokenBucket {
  tokens: number
  lastRefill: number
  locationId: string
}

/**
 * ÉLITE PRO: Rate Limiter usando Token Bucket Algorithm
 *
 * Escalable: In-memory para desarrollo, fácil migración a Redis para producción
 */
class LocationEditRateLimiter {
  // ÉLITE: Map para almacenar buckets por locationId
  // En producción, esto se migraría a Redis
  private buckets = new Map<string, TokenBucket>()

  // Configuración según política de Google
  private readonly MAX_TOKENS = 10 // 10 ediciones por minuto
  private readonly REFILL_RATE = 1 // 1 token por minuto
  private readonly WINDOW_MS = 60000 // 1 minuto en milisegundos

  // Auto-limpieza de buckets inactivos (cada 5 minutos)
  private readonly CLEANUP_INTERVAL = 5 * 60000
  private lastCleanup = Date.now()

  /**
   * Verifica si se puede realizar una edición en una ubicación
   *
   * @param locationId - ID de la ubicación
   * @returns true si hay tokens disponibles, false si no
   */
  async canEdit(locationId: string): Promise<boolean> {
    // Auto-limpieza periódica
    this.cleanupIfNeeded()

    const bucket = this.getOrCreateBucket(locationId)

    // Regenerar tokens basado en tiempo transcurrido
    this.refillTokens(bucket)

    // Verificar si hay tokens disponibles
    if (bucket.tokens >= 1) {
      bucket.tokens--
      this.buckets.set(locationId, bucket)

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Rate Limiter] ✅ Edit allowed for location ${locationId}. Tokens remaining: ${bucket.tokens}`)
      }

      return true
    }

    // No hay tokens disponibles
    if (process.env.NODE_ENV === 'development') {
      const waitTime = this.calculateWaitTime(bucket)
      console.log(`[Rate Limiter] ❌ Edit denied for location ${locationId}. Wait ${waitTime}ms`)
    }

    return false
  }

  /**
   * Obtiene el tiempo de espera hasta el próximo token disponible
   *
   * @param locationId - ID de la ubicación
   * @returns Tiempo en milisegundos hasta el próximo token
   */
  getWaitTime(locationId: string): number {
    const bucket = this.getOrCreateBucket(locationId)
    this.refillTokens(bucket)

    if (bucket.tokens >= 1) {
      return 0
    }

    return this.calculateWaitTime(bucket)
  }

  /**
   * Obtiene el estado actual del rate limiter para una ubicación
   *
   * @param locationId - ID de la ubicación
   * @returns Estado del bucket (tokens disponibles, tiempo hasta próximo token)
   */
  getStatus(locationId: string): {
    tokensAvailable: number
    maxTokens: number
    waitTimeMs: number
    canEdit: boolean
  } {
    const bucket = this.getOrCreateBucket(locationId)
    this.refillTokens(bucket)

    return {
      tokensAvailable: bucket.tokens,
      maxTokens: this.MAX_TOKENS,
      waitTimeMs: this.calculateWaitTime(bucket),
      canEdit: bucket.tokens >= 1,
    }
  }

  /**
   * Obtiene o crea un bucket para una ubicación
   */
  private getOrCreateBucket(locationId: string): TokenBucket {
    let bucket = this.buckets.get(locationId)

    if (!bucket) {
      bucket = {
        tokens: this.MAX_TOKENS,
        lastRefill: Date.now(),
        locationId,
      }
      this.buckets.set(locationId, bucket)
    }

    return bucket
  }

  /**
   * Regenera tokens basado en tiempo transcurrido
   */
  private refillTokens(bucket: TokenBucket): void {
    const now = Date.now()
    const timePassed = now - bucket.lastRefill
    const minutesPassed = timePassed / this.WINDOW_MS

    // Regenerar tokens (1 por minuto)
    const tokensToAdd = minutesPassed * this.REFILL_RATE
    bucket.tokens = Math.min(this.MAX_TOKENS, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now
  }

  /**
   * Calcula el tiempo de espera hasta el próximo token
   */
  private calculateWaitTime(bucket: TokenBucket): number {
    if (bucket.tokens >= 1) {
      return 0
    }

    // Calcular cuánto tiempo falta para el próximo token
    const now = Date.now()
    const timeSinceLastRefill = now - bucket.lastRefill
    const tokensNeeded = 1 - bucket.tokens
    const waitTime = (tokensNeeded * this.WINDOW_MS) - timeSinceLastRefill

    return Math.max(0, waitTime)
  }

  /**
   * Limpia buckets inactivos para prevenir memory leaks
   */
  private cleanupIfNeeded(): void {
    const now = Date.now()

    if (now - this.lastCleanup < this.CLEANUP_INTERVAL) {
      return
    }

    this.lastCleanup = now
    const inactiveThreshold = 10 * 60000 // 10 minutos de inactividad

    for (const [locationId, bucket] of this.buckets.entries()) {
      const timeSinceLastRefill = now - bucket.lastRefill

      // Si el bucket está lleno y ha estado inactivo, eliminarlo
      if (bucket.tokens >= this.MAX_TOKENS && timeSinceLastRefill > inactiveThreshold) {
        this.buckets.delete(locationId)

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Rate Limiter] 🧹 Cleaned up inactive bucket for location ${locationId}`)
        }
      }
    }
  }

  /**
   * Resetea el rate limiter (útil para testing)
   */
  reset(): void {
    this.buckets.clear()
    this.lastCleanup = Date.now()
  }
}

/**
 * ÉLITE PRO: Singleton instance para uso global
 * En producción, esto se reemplazaría con una instancia de Redis
 */
let rateLimiterInstance: LocationEditRateLimiter | null = null

/**
 * Obtiene la instancia singleton del rate limiter
 */
export function getRateLimiter(): LocationEditRateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new LocationEditRateLimiter()
  }
  return rateLimiterInstance
}

/**
 * Verifica si se puede editar una ubicación
 *
 * @param locationId - ID de la ubicación
 * @returns true si se puede editar, false si se excedió el límite
 */
export async function canEditLocation(locationId: string): Promise<boolean> {
  const limiter = getRateLimiter()
  return limiter.canEdit(locationId)
}

/**
 * Obtiene el tiempo de espera hasta poder editar
 *
 * @param locationId - ID de la ubicación
 * @returns Tiempo en milisegundos
 */
export function getEditWaitTime(locationId: string): number {
  const limiter = getRateLimiter()
  return limiter.getWaitTime(locationId)
}

/**
 * Obtiene el estado del rate limiter para una ubicación
 */
export function getRateLimitStatus(locationId: string) {
  const limiter = getRateLimiter()
  return limiter.getStatus(locationId)
}
