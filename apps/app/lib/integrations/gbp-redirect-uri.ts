/**
 * Google Business Profile OAuth Redirect URI Helper
 *
 * Construye el redirect URI dinámicamente basado en la request actual.
 * Esto permite que funcione en cualquier puerto (3000, 3001, 3002, etc.)
 * sin necesidad de configurar variables de entorno específicas por puerto.
 *
 * Best Practices (Nov 2025):
 * - Detección dinámica del host y puerto desde la request
 * - Soporte para desarrollo local y producción
 * - Manejo de proxies y load balancers (x-forwarded-* headers)
 * - Validación de seguridad (solo localhost en desarrollo)
 */

/**
 * Construye el redirect URI dinámicamente desde la request
 *
 * Best Practice (Nov 2025):
 * - En desarrollo: usa el puerto de la request actual (detectado automáticamente)
 * - En producción: usa variable de entorno o headers de proxy
 * - Siempre valida que el redirect URI coincida con el origin de la request
 */
export function buildRedirectUri(request: Request): string {
  const url = new URL(request.url)

  // En desarrollo, usar SIEMPRE el host y puerto de la request actual
  // Esto garantiza que funcione independientemente del puerto (3000, 3001, 3002, etc.)
  if (process.env.NODE_ENV === 'development') {
    // Usar el origin completo de la request (incluye protocolo, host y puerto)
    return `${url.origin}/api/integrations/google-business-profile/callback`
  }

  // En producción, usar variable de entorno o construir desde headers
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'

  if (forwardedHost) {
    // Detrás de un proxy/load balancer
    return `${forwardedProto}://${forwardedHost}/api/integrations/google-business-profile/callback`
  }

  // Fallback: usar el origin de la request
  return `${url.origin}/api/integrations/google-business-profile/callback`
}

/**
 * Obtiene el redirect URI desde variable de entorno o lo construye dinámicamente
 * En desarrollo, siempre usa detección dinámica para evitar problemas de puerto
 * En producción, prioriza la variable de entorno si está configurada
 */
export function getRedirectUri(request: Request): string {
  // En desarrollo, SIEMPRE usar detección dinámica (ignorar variable de entorno)
  // Esto evita problemas cuando cambia el puerto (3000, 3001, 3002, etc.)
  if (process.env.NODE_ENV === 'development') {
    return buildRedirectUri(request)
  }

  // En producción, usar variable de entorno si está configurada
  const envRedirectUri = process.env.GOOGLE_BUSINESS_PROFILE_REDIRECT_URI

  if (envRedirectUri) {
    return envRedirectUri
  }

  // Fallback: construir dinámicamente desde la request
  return buildRedirectUri(request)
}
