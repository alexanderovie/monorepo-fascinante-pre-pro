/**
 * Google Business Profile API Retry Logic
 *
 * ÉLITE: Sistema de retry con exponential backoff y jitter
 * siguiendo las mejores prácticas de la industria 2025.
 *
 * Características:
 * - Exponential backoff con jitter
 * - Rate limiting awareness
 * - Configuración flexible
 * - Logging estructurado
 *
 * Referencias:
 * - Google API Retry Best Practices
 * - Exponential Backoff Algorithm
 * - Circuit Breaker Pattern
 */

import { GBPAPIError, GBPErrorCode, isRetryableError, requiresTokenRefresh } from './gbp-errors'

/**
 * Configuración de retry
 */
export interface RetryConfig {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  jitter?: boolean
}

/**
 * Configuración por defecto (élite)
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 segundo
  maxDelayMs: 30000, // 30 segundos
  backoffMultiplier: 2,
  jitter: true,
}

/**
 * Calcula el delay para el siguiente retry usando exponential backoff
 * ÉLITE: Incluye jitter para evitar thundering herd
 */
function calculateDelay(attempt: number, config: Required<RetryConfig>): number {
  // Exponential backoff: delay = initialDelay * (multiplier ^ attempt)
  const exponentialDelay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1)

  // Aplicar jitter (random entre 0.8 y 1.2 del delay)
  const jitteredDelay = config.jitter
    ? exponentialDelay * (0.8 + Math.random() * 0.4)
    : exponentialDelay

  // Limitar al máximo
  return Math.min(jitteredDelay, config.maxDelayMs)
}

/**
 * Espera un tiempo determinado
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Ejecuta una función con retry logic
 * ÉLITE: Implementa exponential backoff con jitter
 *
 * @param fn - Función a ejecutar
 * @param config - Configuración de retry
 * @returns Resultado de la función
 * @throws GBPAPIError si todos los retries fallan
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: GBPAPIError | null = null

  for (let attempt = 1; attempt <= finalConfig.maxRetries + 1; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const gbpError = GBPAPIError.fromUnknown(error)

      // Si no es retryable, lanzar inmediatamente
      if (!isRetryableError(gbpError)) {
        throw gbpError
      }

      // Si es el último intento, lanzar el error
      if (attempt > finalConfig.maxRetries) {
        throw gbpError
      }

      lastError = gbpError

      // Si hay retry-after específico (rate limiting), usarlo
      const delay = gbpError.retryAfter
        ? gbpError.retryAfter * 1000 // Convertir segundos a ms
        : calculateDelay(attempt, finalConfig)

      console.log(`[GBP Retry] Attempt ${attempt}/${finalConfig.maxRetries + 1} failed, retrying in ${delay}ms...`, {
        error: gbpError.code,
        message: gbpError.message,
      })

      await sleep(delay)
    }
  }

  // Esto no debería ejecutarse nunca, pero TypeScript lo requiere
  throw lastError || new GBPAPIError(GBPErrorCode.UNKNOWN_ERROR, 'Retry failed')
}
