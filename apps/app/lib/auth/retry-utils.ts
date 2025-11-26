/**
 * Retry Utilities
 *
 * Utilidades para reintentos en operaciones que pueden fallar transitoriamente.
 *
 * Best Practices:
 * - Exponential backoff
 * - Jitter para evitar thundering herd
 * - Timeout máximo
 * - Tipos de error que justifican retry
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  shouldRetry?: (error: unknown) => boolean
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'shouldRetry'>> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 segundo
  maxDelay: 10000, // 10 segundos
  backoffMultiplier: 2,
}

/**
 * Determina si un error es retryable
 */
function isRetryableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const errorMessage = String(error).toLowerCase()
  
  // Errores de red que son retryables
  const retryablePatterns = [
    'network',
    'timeout',
    'econnrefused',
    'etimedout',
    'eai_again',
    'temporary',
    'rate limit',
    'too many requests',
    '503',
    '502',
    '504',
  ]

  return retryablePatterns.some((pattern) => errorMessage.includes(pattern))
}

/**
 * Calcula el delay con exponential backoff y jitter
 */
function calculateDelay(attempt: number, options: Required<Omit<RetryOptions, 'shouldRetry'>>): number {
  const exponentialDelay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt)
  const delay = Math.min(exponentialDelay, options.maxDelay)
  
  // Agregar jitter (variación aleatoria) para evitar thundering herd
  const jitter = Math.random() * 0.3 * delay // 0-30% de variación
  
  return Math.floor(delay + jitter)
}

/**
 * Ejecuta una función con retry automático
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options,
    shouldRetry: options.shouldRetry ?? isRetryableError,
  }

  let lastError: unknown

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Si no es el último intento y el error es retryable, reintentar
      if (attempt < opts.maxRetries && opts.shouldRetry(error)) {
        const delay = calculateDelay(attempt, opts)
        
        // En desarrollo, log del retry
        if (process.env.NODE_ENV === 'development') {
          console.log(`Retry attempt ${attempt + 1}/${opts.maxRetries} after ${delay}ms`, error)
        }
        
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // Si no es retryable o se agotaron los intentos, lanzar el error
      throw error
    }
  }

  // Esto nunca debería ejecutarse, pero TypeScript lo requiere
  throw lastError
}

