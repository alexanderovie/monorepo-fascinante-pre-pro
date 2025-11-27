/**
 * Google Business Profile API Error Handling
 *
 * ÉLITE: Sistema de manejo de errores robusto y escalable
 * siguiendo las mejores prácticas de la industria 2025.
 *
 * Características:
 * - Tipos de error específicos
 * - Categorización de errores
 * - Retry logic inteligente
 * - Rate limiting awareness
 * - Logging estructurado
 *
 * Referencias:
 * - Google API Error Handling Best Practices
 * - RFC 7807 (Problem Details for HTTP APIs)
 * - OWASP Error Handling Guidelines
 */

/**
 * Códigos de error específicos de Google Business Profile API
 * Basados en la documentación oficial y códigos HTTP estándar
 */
export enum GBPErrorCode {
  // Errores de autenticación
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Errores de recursos
  NOT_FOUND = 'NOT_FOUND',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  LOCATION_NOT_FOUND = 'LOCATION_NOT_FOUND',

  // Errores de rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  // Errores de servidor
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',

  // Errores de validación
  INVALID_REQUEST = 'INVALID_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Errores desconocidos
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Categorías de errores para retry logic
 */
export enum ErrorCategory {
  RETRYABLE = 'RETRYABLE', // Errores que se pueden reintentar
  NON_RETRYABLE = 'NON_RETRYABLE', // Errores que NO se deben reintentar
  AUTH_ERROR = 'AUTH_ERROR', // Errores de autenticación (requieren refresh token)
}

/**
 * Error personalizado para Google Business Profile API
 * ÉLITE: Extiende Error con información estructurada
 */
export class GBPAPIError extends Error {
  public readonly code: GBPErrorCode
  public readonly category: ErrorCategory
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly retryAfter?: number // Segundos hasta el próximo retry (rate limiting)
  public readonly originalError?: unknown

  constructor(
    code: GBPErrorCode,
    message: string,
    options: {
      statusCode?: number
      category?: ErrorCategory
      retryable?: boolean
      retryAfter?: number
      originalError?: unknown
    } = {}
  ) {
    super(message)
    this.name = 'GBPAPIError'
    this.code = code
    this.statusCode = options.statusCode
    this.category = options.category || ErrorCategory.NON_RETRYABLE
    this.retryable = options.retryable ?? false
    this.retryAfter = options.retryAfter
    this.originalError = options.originalError

    // Mantener el stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GBPAPIError)
    }
  }

  /**
   * Crea un error desde una respuesta HTTP de Google API
   */
  static fromResponse(status: number, errorText: string, originalError?: unknown): GBPAPIError {
    // Parsear error de Google si es JSON
    let errorData: { error?: { message?: string; code?: number; status?: string } } = {}
    try {
      errorData = JSON.parse(errorText)
    } catch {
      // Si no es JSON, usar el texto como está
    }

    const message = errorData.error?.message || errorText || 'Unknown error'

    // Mapear códigos HTTP a códigos de error específicos
    switch (status) {
      case 401:
        return new GBPAPIError(GBPErrorCode.UNAUTHORIZED, message, {
          statusCode: 401,
          category: ErrorCategory.AUTH_ERROR,
          retryable: true, // Se puede retry después de refresh token
          originalError,
        })

      case 403:
        return new GBPAPIError(GBPErrorCode.INSUFFICIENT_PERMISSIONS, message, {
          statusCode: 403,
          category: ErrorCategory.NON_RETRYABLE,
          retryable: false,
          originalError,
        })

      case 404:
        return new GBPAPIError(GBPErrorCode.NOT_FOUND, message, {
          statusCode: 404,
          category: ErrorCategory.NON_RETRYABLE,
          retryable: false,
          originalError,
        })

      case 429:
        // Rate limiting - extraer retry-after si está disponible
        const retryAfter = extractRetryAfter(errorText)
        return new GBPAPIError(GBPErrorCode.RATE_LIMIT_EXCEEDED, message, {
          statusCode: 429,
          category: ErrorCategory.RETRYABLE,
          retryable: true,
          retryAfter,
          originalError,
        })

      case 500:
      case 502:
      case 503:
        return new GBPAPIError(GBPErrorCode.SERVICE_UNAVAILABLE, message, {
          statusCode: status,
          category: ErrorCategory.RETRYABLE,
          retryable: true,
          originalError,
        })

      case 504:
        return new GBPAPIError(GBPErrorCode.TIMEOUT, message, {
          statusCode: 504,
          category: ErrorCategory.RETRYABLE,
          retryable: true,
          originalError,
        })

      case 400:
        return new GBPAPIError(GBPErrorCode.INVALID_REQUEST, message, {
          statusCode: 400,
          category: ErrorCategory.NON_RETRYABLE,
          retryable: false,
          originalError,
        })

      default:
        return new GBPAPIError(GBPErrorCode.UNKNOWN_ERROR, message, {
          statusCode: status,
          category: ErrorCategory.NON_RETRYABLE,
          retryable: false,
          originalError,
        })
    }
  }

  /**
   * Crea un error desde una excepción desconocida
   */
  static fromUnknown(error: unknown): GBPAPIError {
    if (error instanceof GBPAPIError) {
      return error
    }

    if (error instanceof Error) {
      return new GBPAPIError(GBPErrorCode.UNKNOWN_ERROR, error.message, {
        originalError: error,
      })
    }

    return new GBPAPIError(GBPErrorCode.UNKNOWN_ERROR, 'Unknown error occurred', {
      originalError: error,
    })
  }
}

/**
 * Extrae el valor de retry-after de un error de rate limiting
 */
function extractRetryAfter(errorText: string): number | undefined {
  try {
    const errorData = JSON.parse(errorText)
    // Google API puede incluir información de retry en diferentes formatos
    if (errorData.error?.details) {
      for (const detail of errorData.error.details) {
        if (detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo') {
          return detail.retryDelay?.seconds
        }
      }
    }
  } catch {
    // Si no se puede parsear, retornar undefined
  }
  return undefined
}

/**
 * Determina si un error es retryable
 */
export function isRetryableError(error: GBPAPIError): boolean {
  return error.retryable && error.category === ErrorCategory.RETRYABLE
}

/**
 * Determina si un error requiere refresh de token
 */
export function requiresTokenRefresh(error: GBPAPIError): boolean {
  return error.category === ErrorCategory.AUTH_ERROR
}

