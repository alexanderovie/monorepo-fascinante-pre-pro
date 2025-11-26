/**
 * OAuth State Management
 *
 * Manejo del parámetro "state" para protección CSRF en OAuth flows.
 *
 * Best Practices:
 * - Generación de state único y aleatorio
 * - Validación de state en callback
 * - Expiración de state (timeout)
 * - Almacenamiento seguro (sessionStorage en cliente, cookies en servidor)
 *
 * Security:
 * - Previene ataques CSRF
 * - Valida que el callback viene del mismo usuario que inició el flujo
 */

/**
 * Genera un state único para OAuth flow
 */
export function generateOAuthState(): string {
  // Generar un string aleatorio seguro
  const array = new Uint8Array(32)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    // Fallback para entornos sin crypto (muy raro en navegadores modernos)
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }

  // Convertir a base64url (URL-safe)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Almacena el state en sessionStorage (cliente)
 */
export function storeOAuthState(provider: string, state: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const key = `oauth_state_${provider}`
    const value = JSON.stringify({
      state,
      timestamp: Date.now(),
      provider,
    })
    sessionStorage.setItem(key, value)
  } catch (error) {
    console.error('Error storing OAuth state:', error)
  }
}

/**
 * Valida y obtiene el state almacenado
 */
export function getStoredOAuthState(provider: string): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const key = `oauth_state_${provider}`
    const stored = sessionStorage.getItem(key)

    if (!stored) {
      return null
    }

    const parsed = JSON.parse(stored)

    // Validar que el state no haya expirado (10 minutos)
    const STATE_TIMEOUT = 10 * 60 * 1000 // 10 minutos
    const isExpired = Date.now() - parsed.timestamp > STATE_TIMEOUT

    if (isExpired) {
      sessionStorage.removeItem(key)
      return null
    }

    // Validar que el provider coincida
    if (parsed.provider !== provider) {
      return null
    }

    return parsed.state
  } catch (error) {
    console.error('Error getting OAuth state:', error)
    return null
  }
}

/**
 * Valida el state recibido contra el almacenado
 */
export function validateOAuthState(provider: string, receivedState: string): boolean {
  const storedState = getStoredOAuthState(provider)

  if (!storedState) {
    return false
  }

  // Comparación segura (timing-safe)
  if (storedState.length !== receivedState.length) {
    return false
  }

  let isValid = true
  for (let i = 0; i < storedState.length; i++) {
    if (storedState[i] !== receivedState[i]) {
      isValid = false
    }
  }

  // Limpiar el state después de validar (one-time use)
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(`oauth_state_${provider}`)
  }

  return isValid
}

/**
 * Limpia el state almacenado (útil para cleanup)
 */
export function clearOAuthState(provider: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    sessionStorage.removeItem(`oauth_state_${provider}`)
  } catch (error) {
    console.error('Error clearing OAuth state:', error)
  }
}
