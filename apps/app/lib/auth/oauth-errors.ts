/**
 * OAuth Error Types
 *
 * Tipos de errores específicos para flujos OAuth.
 * Facilita el manejo de errores y el debugging.
 *
 * Best Practices:
 * - Errores tipados y específicos
 * - Mensajes de usuario amigables
 * - Códigos de error para tracking
 */

export enum OAuthErrorCode {
  // Errores de configuración
  PROVIDER_NOT_ENABLED = 'PROVIDER_NOT_ENABLED',
  INVALID_REDIRECT_URI = 'INVALID_REDIRECT_URI',

  // Errores de flujo
  CODE_EXCHANGE_FAILED = 'CODE_EXCHANGE_FAILED',
  INVALID_CODE = 'INVALID_CODE',
  CODE_EXPIRED = 'CODE_EXPIRED',
  STATE_MISMATCH = 'STATE_MISMATCH',

  // Errores de red
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Errores del proveedor
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  USER_DENIED = 'USER_DENIED',
  ACCESS_DENIED = 'ACCESS_DENIED',

  // Errores desconocidos
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface OAuthError {
  code: OAuthErrorCode
  message: string
  userMessage: string // Mensaje amigable para el usuario
  originalError?: Error | unknown
  provider?: string
  timestamp: Date
}

/**
 * Crea un error OAuth tipado
 */
export function createOAuthError(
  code: OAuthErrorCode,
  message: string,
  options?: {
    userMessage?: string
    originalError?: Error | unknown
    provider?: string
  }
): OAuthError {
  return {
    code,
    message,
    userMessage: options?.userMessage ?? getDefaultUserMessage(code),
    originalError: options?.originalError,
    provider: options?.provider,
    timestamp: new Date(),
  }
}

/**
 * Obtiene un mensaje amigable por defecto según el código de error
 */
function getDefaultUserMessage(code: OAuthErrorCode): string {
  const messages: Record<OAuthErrorCode, string> = {
    [OAuthErrorCode.PROVIDER_NOT_ENABLED]: 'Este método de inicio de sesión no está disponible.',
    [OAuthErrorCode.INVALID_REDIRECT_URI]: 'Error de configuración. Por favor, contacta al soporte.',
    [OAuthErrorCode.CODE_EXCHANGE_FAILED]: 'No se pudo completar el inicio de sesión. Por favor, intenta nuevamente.',
    [OAuthErrorCode.INVALID_CODE]: 'El código de autenticación es inválido. Por favor, intenta nuevamente.',
    [OAuthErrorCode.CODE_EXPIRED]: 'El código de autenticación ha expirado. Por favor, intenta nuevamente.',
    [OAuthErrorCode.STATE_MISMATCH]: 'Error de seguridad detectado. Por favor, intenta nuevamente.',
    [OAuthErrorCode.NETWORK_ERROR]: 'Error de conexión. Por favor, verifica tu internet e intenta nuevamente.',
    [OAuthErrorCode.TIMEOUT]: 'La solicitud tardó demasiado. Por favor, intenta nuevamente.',
    [OAuthErrorCode.PROVIDER_ERROR]: 'Error del proveedor de autenticación. Por favor, intenta más tarde.',
    [OAuthErrorCode.USER_DENIED]: 'Has cancelado el inicio de sesión.',
    [OAuthErrorCode.ACCESS_DENIED]: 'No se pudo obtener acceso. Por favor, verifica los permisos.',
    [OAuthErrorCode.UNKNOWN_ERROR]: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
  }

  return messages[code] ?? messages[OAuthErrorCode.UNKNOWN_ERROR]
}

/**
 * Convierte un error de Supabase a OAuthError
 */
export function mapSupabaseErrorToOAuthError(
  error: unknown,
  provider?: string
): OAuthError {
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = String(error.message).toLowerCase()

    // Detectar tipos de error comunes
    if (errorMessage.includes('expired') || errorMessage.includes('expira')) {
      return createOAuthError(OAuthErrorCode.CODE_EXPIRED, String(error.message), {
        originalError: error,
        provider,
      })
    }

    // Detectar específicamente bad_oauth_state
    if (
      errorMessage.includes('bad_oauth_state') ||
      errorMessage.includes('invalid state') ||
      errorMessage.includes('state mismatch') ||
      errorMessage.includes('oauth state')
    ) {
      return createOAuthError(OAuthErrorCode.STATE_MISMATCH, String(error.message), {
        originalError: error,
        provider,
        userMessage: 'Error de seguridad en la autenticación. Por favor, intenta nuevamente.',
      })
    }

    if (errorMessage.includes('invalid') || errorMessage.includes('inválido')) {
      return createOAuthError(OAuthErrorCode.INVALID_CODE, String(error.message), {
        originalError: error,
        provider,
      })
    }

    if (errorMessage.includes('network') || errorMessage.includes('red')) {
      return createOAuthError(OAuthErrorCode.NETWORK_ERROR, String(error.message), {
        originalError: error,
        provider,
      })
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('tiempo')) {
      return createOAuthError(OAuthErrorCode.TIMEOUT, String(error.message), {
        originalError: error,
        provider,
      })
    }
  }

  return createOAuthError(OAuthErrorCode.UNKNOWN_ERROR, String(error), {
    originalError: error,
    provider,
  })
}
