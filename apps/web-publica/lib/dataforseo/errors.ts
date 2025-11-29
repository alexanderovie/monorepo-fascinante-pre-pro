/**
 * DataForSEO Error Handling
 *
 * Manejo robusto de errores basado en códigos oficiales de DataForSEO API
 * Documentación: https://docs.dataforseo.com/v3/appendix/errors/
 *
 * Actualizado: Noviembre 2025
 */

/**
 * Códigos de error HTTP de DataForSEO
 */
export enum DataForSEOHttpError {
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Códigos de error internos de DataForSEO
 */
export enum DataForSEOInternalError {
  OK = 20000,
  TASK_CREATED = 20100,
  MULTIPLE_TASKS = 40000,
  RATE_LIMIT_EXCEEDED = 40202,
  INTERNAL_ERROR = 50000,
}

/**
 * Clase de error personalizada para DataForSEO
 */
export class DataForSEOError extends Error {
  constructor(
    message: string,
    public readonly httpStatus?: number,
    public readonly internalCode?: number,
    public readonly isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'DataForSEOError';
  }
}

/**
 * Mapea códigos de error HTTP a mensajes y si son recuperables
 */
export function mapHttpErrorToDataForSEOError(
  status: number,
  message?: string
): DataForSEOError {
  switch (status) {
    case DataForSEOHttpError.UNAUTHORIZED:
      return new DataForSEOError(
        message || 'Credenciales de DataForSEO inválidas. Verifica DATAFORSEO_USERNAME y DATAFORSEO_PASSWORD',
        status,
        undefined,
        false // No es recuperable
      );

    case DataForSEOHttpError.PAYMENT_REQUIRED:
      return new DataForSEOError(
        message || 'Saldo insuficiente en cuenta de DataForSEO. Verifica tu plan y créditos',
        status,
        undefined,
        false // No es recuperable
      );

    case DataForSEOHttpError.NOT_FOUND:
      return new DataForSEOError(
        message || 'Endpoint de DataForSEO no encontrado. Verifica la URL del API',
        status,
        undefined,
        false // No es recuperable
      );

    case DataForSEOHttpError.TOO_MANY_REQUESTS:
      return new DataForSEOError(
        message || 'Rate limit excedido. Espera antes de reintentar',
        status,
        DataForSEOInternalError.RATE_LIMIT_EXCEEDED,
        true // Es recuperable (con delay)
      );

    case DataForSEOHttpError.INTERNAL_SERVER_ERROR:
      return new DataForSEOError(
        message || 'Error interno del servidor de DataForSEO. Intenta más tarde',
        status,
        DataForSEOInternalError.INTERNAL_ERROR,
        true // Es recuperable
      );

    default:
      return new DataForSEOError(
        message || `Error HTTP ${status} de DataForSEO`,
        status,
        undefined,
        status >= 500 // Errores 5xx son recuperables
      );
  }
}

/**
 * Mapea códigos de error internos de DataForSEO
 */
export function mapInternalErrorToDataForSEOError(
  code: number,
  message?: string
): DataForSEOError | null {
  switch (code) {
    case DataForSEOInternalError.OK:
      return null; // No es un error

    case DataForSEOInternalError.TASK_CREATED:
      return null; // No es un error

    case DataForSEOInternalError.MULTIPLE_TASKS:
      return new DataForSEOError(
        message || 'Solo se puede especificar una tarea por request',
        undefined,
        code,
        false
      );

    case DataForSEOInternalError.RATE_LIMIT_EXCEEDED:
      return new DataForSEOError(
        message || 'Rate limit excedido. Espera antes de reintentar',
        DataForSEOHttpError.TOO_MANY_REQUESTS,
        code,
        true // Es recuperable
      );

    case DataForSEOInternalError.INTERNAL_ERROR:
      return new DataForSEOError(
        message || 'Error interno de DataForSEO. Intenta más tarde',
        DataForSEOHttpError.INTERNAL_SERVER_ERROR,
        code,
        true // Es recuperable
      );

    default:
      return new DataForSEOError(
        message || `Error interno de DataForSEO: ${code}`,
        undefined,
        code,
        code >= 50000 // Errores 5xxxx son generalmente recuperables
      );
  }
}

/**
 * Procesa errores de respuesta de DataForSEO
 */
export function processDataForSEOError(error: unknown): DataForSEOError {
  // Si ya es un DataForSEOError, retornarlo
  if (error instanceof DataForSEOError) {
    return error;
  }

  // Si es un Error estándar
  if (error instanceof Error) {
    // Intentar extraer información de HTTP status si está en el mensaje
    const httpMatch = error.message.match(/HTTP (\d+)/);
    if (httpMatch) {
      const status = parseInt(httpMatch[1], 10);
      return mapHttpErrorToDataForSEOError(status, error.message);
    }

    return new DataForSEOError(error.message, undefined, undefined, false);
  }

  // Error desconocido
  return new DataForSEOError(
    'Error desconocido al comunicarse con DataForSEO',
    undefined,
    undefined,
    false
  );
}
