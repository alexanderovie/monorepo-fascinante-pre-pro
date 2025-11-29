/**
 * DataForSEO Retry Strategy
 *
 * Estrategia de reintentos con exponential backoff y jitter
 * Basado en mejores prácticas para APIs externas
 *
 * Actualizado: Noviembre 2025
 */

import { DataForSEOError } from './errors';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 segundo
  maxDelayMs: 10000, // 10 segundos máximo
  backoffMultiplier: 2,
  retryableStatusCodes: [429, 500, 502, 503, 504], // Rate limit y errores de servidor
};

/**
 * Calcula el delay para el siguiente reintento con exponential backoff y jitter
 *
 * @param attempt - Número de intento (0-based)
 * @param options - Opciones de retry
 * @returns Delay en milisegundos
 */
function calculateDelay(attempt: number, options: Required<RetryOptions>): number {
  // Exponential backoff: initialDelay * (multiplier ^ attempt)
  const exponentialDelay = options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt);

  // Jitter: agregar variación aleatoria (0-50% del delay)
  const jitter = Math.random() * 0.5 * exponentialDelay;

  const totalDelay = exponentialDelay + jitter;

  // Limitar al máximo permitido
  return Math.min(totalDelay, options.maxDelayMs);
}

/**
 * Verifica si un error es recuperable y debe reintentarse
 */
function isRetryableError(error: unknown, retryableStatusCodes: number[]): boolean {
  if (error instanceof DataForSEOError) {
    // Si el error tiene la flag isRetryable, usarla
    if (error.isRetryable !== undefined) {
      return error.isRetryable;
    }

    // Si tiene HTTP status, verificar si está en la lista de recuperables
    if (error.httpStatus) {
      return retryableStatusCodes.includes(error.httpStatus);
    }
  }

  // Por defecto, no reintentar
  return false;
}

/**
 * Ejecuta una función con reintentos automáticos
 *
 * @param fn - Función async a ejecutar
 * @param options - Opciones de retry
 * @returns Resultado de la función
 * @throws DataForSEOError si todos los reintentos fallan
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Si no es el último intento y el error es recuperable, reintentar
      if (attempt < opts.maxRetries && isRetryableError(error, opts.retryableStatusCodes)) {
        const delay = calculateDelay(attempt, opts);

        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(
            `[DataForSEO Retry] Intento ${attempt + 1}/${opts.maxRetries + 1} falló. Reintentando en ${delay}ms...`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Si no es recuperable o es el último intento, lanzar error
      throw error;
    }
  }

  // Esto no debería ejecutarse, pero TypeScript lo requiere
  throw lastError;
}

/**
 * Wrapper para funciones que retornan Response de fetch
 * Maneja errores HTTP y los convierte a DataForSEOError
 */
export async function fetchWithRetry(
  url: RequestInfo,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, init);

    // Si la respuesta no es exitosa, lanzar error
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response;
  }, options);
}
