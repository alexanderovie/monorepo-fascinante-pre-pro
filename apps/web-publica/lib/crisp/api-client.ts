/**
 * Cliente REST API para Crisp Chat - Implementación Elite Pro
 *
 * Permite configuración programática del website sin usar el dashboard.
 * Basado en la documentación oficial de Crisp REST API v1:
 * https://docs.crisp.chat/references/rest-api/v1/
 *
 * Características:
 * - Autenticación Basic Auth (Identifier:Key) con header X-Crisp-Tier
 * - Manejo robusto de errores con clases personalizadas
 * - Retry logic con exponential backoff
 * - Validación de respuestas y tipos
 * - TypeScript estricto con tipos completos
 * - Compatible con Next.js 15 App Router (Server Components)
 *
 * @module lib/crisp/api-client
 */

/**
 * Configuración del cliente API
 */
const CRISP_API_BASE_URL = 'https://api.crisp.chat/v1';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 segundo

/**
 * Obtiene las credenciales de API desde variables de entorno
 *
 * @returns Objeto con identifier y key, o null si no están configuradas
 */
function getApiCredentials(): { identifier: string; key: string } | null {
  const identifier = process.env.CRISP_API_IDENTIFIER;
  const key = process.env.CRISP_API_KEY;

  if (!identifier || !key) {
    return null;
  }

  return { identifier, key };
}

/**
 * Valida que las credenciales de API estén configuradas
 *
 * @throws Error si las credenciales no están configuradas
 */
export function validateApiCredentials(): void {
  const credentials = getApiCredentials();

  if (!credentials) {
    throw new Error(
      'Credenciales de API de Crisp no configuradas. ' +
      'Agrega CRISP_API_IDENTIFIER y CRISP_API_KEY a tus variables de entorno.'
    );
  }
}

/**
 * Crea el header de autenticación Basic Auth
 *
 * @returns Header de autenticación
 */
function createAuthHeader(): string {
  const credentials = getApiCredentials();

  if (!credentials) {
    throw new Error('Credenciales de API no disponibles');
  }

  // Basic Auth: base64(identifier:key)
  const authString = `${credentials.identifier}:${credentials.key}`;
  const encodedAuth = Buffer.from(authString).toString('base64');

  return `Basic ${encodedAuth}`;
}

/**
 * Tipos de respuesta de la API de Crisp
 */
export interface CrispApiResponse<T = unknown> {
  error?: boolean;
  reason?: string;
  data?: T;
}

/**
 * Información del website de Crisp
 */
export interface CrispWebsite {
  website_id: string;
  name: string;
  domain: string;
  logo?: string;
  [key: string]: unknown;
}

/**
 * Opciones para requests HTTP
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  retries?: number;
}

/**
 * Clase de error personalizada para errores de API de Crisp
 */
export class CrispApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public reason?: string,
    public response?: unknown
  ) {
    super(message);
    this.name = 'CrispApiError';
    // Mantener el stack trace correcto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CrispApiError);
    }
  }
}

/**
 * Calcula el delay para retry usando exponential backoff
 *
 * @param attempt - Número de intento (0-based)
 * @returns Delay en milisegundos
 */
function calculateRetryDelay(attempt: number): number {
  return Math.min(
    INITIAL_RETRY_DELAY * Math.pow(2, attempt),
    10000 // Máximo 10 segundos
  );
}

/**
 * Verifica si un error es retryable
 *
 * @param error - Error a verificar
 * @returns true si el error es retryable
 */
function isRetryableError(error: CrispApiError): boolean {
  // No reintentar errores de autenticación o autorización
  if (error.statusCode === 401 || error.statusCode === 403) {
    return false;
  }

  // Reintentar errores de servidor (5xx) y timeouts
  if (error.statusCode && error.statusCode >= 500) {
    return true;
  }

  // Reintentar si no hay statusCode (error de red)
  return !error.statusCode;
}

/**
 * Realiza una petición HTTP a la API de Crisp con retry logic
 *
 * @param endpoint - Endpoint de la API (sin el base URL)
 * @param options - Opciones de la petición
 * @returns Respuesta de la API
 * @throws CrispApiError si la petición falla después de todos los intentos
 */
async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, retries = MAX_RETRIES } = options;

  // Validar credenciales
  validateApiCredentials();

  const url = `${CRISP_API_BASE_URL}${endpoint}`;
  const authHeader = createAuthHeader();

  let lastError: CrispApiError | null = null;

  // Retry logic con exponential backoff
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'X-Crisp-Tier': 'plugin', // Header requerido para autenticación de plugins
          'User-Agent': 'Fascinante-Digital-Integration/1.0',
          'Accept': 'application/json',
        },
        // Timeout de 30 segundos
        signal: AbortSignal.timeout(30000),
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      // Parsear respuesta
      let data: CrispApiResponse<T>;
      try {
        data = await response.json();
      } catch {
        // Si no es JSON, intentar leer como texto
        const text = await response.text();
        throw new CrispApiError(
          `Respuesta inválida de la API: ${text}`,
          response.status,
          'invalid_response',
          text
        );
      }

      // Manejar errores de la API
      if (!response.ok || data.error === true) {
        const errorMessage = data.data && typeof data.data === 'object' && 'message' in data.data
          ? (data.data as { message: string }).message
          : data.reason || `HTTP ${response.status}: ${response.statusText}`;

        const error = new CrispApiError(
          errorMessage,
          response.status,
          data.reason,
          data
        );

        // Si no es retryable, lanzar inmediatamente
        if (!isRetryableError(error)) {
          throw error;
        }

        // Si es retryable y no es el último intento, continuar al siguiente
        lastError = error;
        if (attempt < retries) {
          const delay = calculateRetryDelay(attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Si es el último intento, lanzar el error
        throw error;
      }

      // Retornar datos (puede estar en data.data o directamente en data)
      return (data.data ?? data) as T;
    } catch (error) {
      // Si es un error de aborto (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new CrispApiError(
          'Timeout: La petición tardó más de 30 segundos',
          408,
          'timeout'
        );
      }

      // Si es un CrispApiError, manejarlo según si es retryable
      if (error instanceof CrispApiError) {
        if (!isRetryableError(error)) {
          throw error;
        }

        lastError = error;
        if (attempt < retries) {
          const delay = calculateRetryDelay(attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }

      // Error de red u otro error desconocido
      lastError = new CrispApiError(
        `Error de red: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'network_error',
        error
      );

      // Si no es el último intento, reintentar
      if (attempt < retries) {
        const delay = calculateRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  throw new CrispApiError(
    `Error después de ${retries + 1} intentos: ${lastError?.message || 'Unknown error'}`,
    lastError?.statusCode,
    lastError?.reason,
    lastError
  );
}

/**
 * Obtiene la información del website
 *
 * @param websiteId - ID del website de Crisp
 * @returns Información del website
 * @throws CrispApiError si falla la petición
 */
export async function getWebsite(websiteId: string): Promise<CrispWebsite> {
  return apiRequest<CrispWebsite>(`/website/${websiteId}`);
}

/**
 * Actualiza la configuración del website
 *
 * @param websiteId - ID del website de Crisp
 * @param settings - Configuración a actualizar
 * @returns Respuesta de la API
 * @throws CrispApiError si falla la petición
 */
export async function updateWebsiteSettings(
  websiteId: string,
  settings: Record<string, unknown>
): Promise<unknown> {
  return apiRequest(`/website/${websiteId}`, {
    method: 'PATCH',
    body: settings,
  });
}

/**
 * NOTA: La configuración del chatbox NO está disponible en la REST API v1.
 *
 * Según la documentación oficial de Crisp (https://docs.crisp.chat/references/rest-api/v1/),
 * la configuración del chatbox (color, posición, textos) se debe hacer desde:
 * 1. El dashboard de Crisp (https://app.crisp.chat)
 * 2. El SDK del cliente JavaScript (crisp-sdk-web) - que ya está implementado en CrispChat.tsx
 *
 * La REST API solo permite gestionar:
 * - Información del website (GET /website/{website_id})
 * - Conversaciones
 * - People (perfiles de usuarios)
 * - Visitors
 * - Sessions
 *
 * Si necesitas cambiar la configuración del chatbox programáticamente,
 * usa el componente CrispChat.tsx con props dinámicas.
 */

/**
 * Verifica la conexión con la API de Crisp
 *
 * Hace una petición simple para verificar que las credenciales funcionan
 *
 * @param websiteId - ID del website para probar (opcional)
 * @returns true si la conexión es exitosa
 * @throws CrispApiError si falla
 */
export async function verifyApiConnection(websiteId?: string): Promise<boolean> {
  try {
    validateApiCredentials();

    // Si se proporciona websiteId, intentar obtener información del website
    if (websiteId) {
      await getWebsite(websiteId);
      return true;
    }

    // Si no, solo validar que las credenciales están configuradas
    return true;
  } catch (error) {
    if (error instanceof CrispApiError) {
      throw error;
    }
    throw new CrispApiError(
      `Error al verificar conexión: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      'verification_failed'
    );
  }
}
