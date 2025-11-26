/**
 * Auth Logger
 *
 * Logger estructurado para flujos de autenticación.
 * Facilita debugging, monitoreo y análisis de métricas.
 *
 * Best Practices:
 * - Logging estructurado (JSON)
 * - Niveles de log apropiados
 * - Información contextual sin datos sensibles
 * - Preparado para integración con servicios de monitoreo
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface AuthLogContext {
  userId?: string
  provider?: string
  action: string
  [key: string]: unknown
}

/**
 * Logger estructurado para autenticación
 *
 * En producción, estos logs pueden ser enviados a:
 * - Datadog, Sentry, LogRocket, etc.
 * - Analytics (Google Analytics, Mixpanel, etc.)
 * - Monitoring (Grafana, CloudWatch, etc.)
 */
class AuthLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Log estructurado
   */
  private log(level: LogLevel, message: string, context?: AuthLogContext) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
      // En producción, agregar metadata adicional:
      // environment: process.env.NODE_ENV,
      // version: process.env.APP_VERSION,
      // requestId: context?.requestId,
    }

    // En desarrollo, mostrar en consola con formato legible
    if (this.isDevelopment) {
      const emoji = {
        [LogLevel.DEBUG]: '🔍',
        [LogLevel.INFO]: 'ℹ️',
        [LogLevel.WARN]: '⚠️',
        [LogLevel.ERROR]: '❌',
      }[level]

      console.log(`${emoji} [${level.toUpperCase()}] ${message}`, context)
    } else {
      // En producción, enviar a servicio de logging
      // Ejemplo: sendToLoggingService(logEntry)
      console.log(JSON.stringify(logEntry))
    }
  }

  debug(message: string, context?: AuthLogContext) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: AuthLogContext) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: AuthLogContext) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, context?: AuthLogContext & { error?: unknown }) {
    this.log(LogLevel.ERROR, message, context)
    
    // En producción, también enviar a servicio de error tracking
    // Ejemplo: Sentry.captureException(context?.error)
  }

  /**
   * Log específico para inicio de OAuth
   */
  oauthStart(provider: string, context?: Omit<AuthLogContext, 'action' | 'provider'>) {
    this.info(`OAuth flow started: ${provider}`, {
      action: 'oauth_start',
      provider,
      ...context,
    })
  }

  /**
   * Log específico para callback OAuth
   */
  oauthCallback(provider: string, success: boolean, context?: Omit<AuthLogContext, 'action' | 'provider'>) {
    if (success) {
      this.info(`OAuth callback successful: ${provider}`, {
        action: 'oauth_callback_success',
        provider,
        ...context,
      })
    } else {
      this.error(`OAuth callback failed: ${provider}`, {
        action: 'oauth_callback_error',
        provider,
        ...context,
      })
    }
  }

  /**
   * Log específico para intercambio de código
   */
  codeExchange(provider: string, success: boolean, context?: Omit<AuthLogContext, 'action' | 'provider'>) {
    if (success) {
      this.info(`Code exchange successful: ${provider}`, {
        action: 'code_exchange_success',
        provider,
        ...context,
      })
    } else {
      this.error(`Code exchange failed: ${provider}`, {
        action: 'code_exchange_error',
        provider,
        ...context,
      })
    }
  }
}

// Singleton instance
export const authLogger = new AuthLogger()

