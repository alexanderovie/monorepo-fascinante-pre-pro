/**
 * Google Business Profile OAuth State Management (Server-Side)
 *
 * Manejo del parámetro "state" para protección CSRF en OAuth flows.
 * Usa cookies para almacenamiento en el servidor (Next.js 15.5.6).
 *
 * Best Practices (Nov 2025):
 * - Generación de state único y aleatorio usando crypto
 * - Validación de state en callback usando cookies
 * - Expiración de state (timeout de 10 minutos)
 * - Almacenamiento seguro en cookies httpOnly
 * - Comparación timing-safe para prevenir timing attacks
 *
 * Security:
 * - Previene ataques CSRF
 * - Valida que el callback viene del mismo usuario que inició el flujo
 * - Cookies httpOnly previenen acceso desde JavaScript
 * - SameSite=Lax previene CSRF
 */

import { cookies } from 'next/headers'

const STATE_COOKIE_NAME = 'gbp_oauth_state'
const STATE_TIMEOUT_MS = 10 * 60 * 1000 // 10 minutos

/**
 * Genera un state único para OAuth flow
 * Usa crypto.getRandomValues para seguridad criptográfica
 */
export function generateGBPOAuthState(): string {
  // Generar 32 bytes aleatorios usando crypto (disponible en Node.js 18+)
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)

  // Convertir a base64url (URL-safe)
  return Buffer.from(array)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Almacena el state en una cookie httpOnly
 * Solo accesible desde el servidor (seguridad)
 */
export async function storeGBPOAuthState(state: string): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(STATE_COOKIE_NAME, state, {
    httpOnly: true, // No accesible desde JavaScript
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'lax', // Protección CSRF
    maxAge: STATE_TIMEOUT_MS / 1000, // 10 minutos en segundos
    path: '/',
  })
}

/**
 * Obtiene y valida el state almacenado
 * Retorna null si no existe o expiró
 */
export async function getGBPOAuthState(): Promise<string | null> {
  const cookieStore = await cookies()
  const state = cookieStore.get(STATE_COOKIE_NAME)?.value

  if (!state) {
    return null
  }

  return state
}

/**
 * Valida el state recibido contra el almacenado
 * Usa comparación timing-safe para prevenir timing attacks
 * Limpia la cookie después de validar (one-time use)
 */
export async function validateGBPOAuthState(
  receivedState: string
): Promise<boolean> {
  const storedState = await getGBPOAuthState()

  if (!storedState) {
    return false
  }

  // Comparación timing-safe (previene timing attacks)
  if (storedState.length !== receivedState.length) {
    await clearGBPOAuthState()
    return false
  }

  // Usar crypto.timingSafeEqual si está disponible (Node.js 16.6.0+)
  let isValid = true
  try {
    // Node.js tiene crypto.timingSafeEqual para comparación segura
    const { timingSafeEqual } = await import('crypto')
    const storedBuffer = Buffer.from(storedState)
    const receivedBuffer = Buffer.from(receivedState)

    if (storedBuffer.length !== receivedBuffer.length) {
      isValid = false
    } else {
      isValid = timingSafeEqual(storedBuffer, receivedBuffer)
    }
  } catch {
    // Fallback: comparación manual (menos seguro pero funcional)
    for (let i = 0; i < storedState.length; i++) {
      if (storedState[i] !== receivedState[i]) {
        isValid = false
      }
    }
  }

  // Limpiar la cookie después de validar (one-time use)
  await clearGBPOAuthState()

  return isValid
}

/**
 * Limpia el state almacenado
 */
export async function clearGBPOAuthState(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(STATE_COOKIE_NAME)
}
