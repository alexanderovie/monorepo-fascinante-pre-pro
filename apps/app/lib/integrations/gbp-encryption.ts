/**
 * Google Business Profile Token Encryption
 *
 * ÉLITE: Encriptación de tokens OAuth siguiendo estándares de la industria 2025.
 *
 * Mejores prácticas implementadas:
 * - AES-256 encryption (estándar de la industria)
 * - Claves de encriptación rotables
 * - Separación de concerns (encriptación en DB, lógica en aplicación)
 * - Validación de tokens antes de encriptar
 *
 * Referencias:
 * - OWASP Token Storage Guidelines
 * - RFC 6819 (OAuth 2.0 Security Best Practices)
 * - Supabase Security Best Practices
 */

import { createClient } from '@/utils/supabase/server'

/**
 * Obtiene la clave de encriptación desde variables de entorno
 * ÉLITE: La clave debe ser de 32 bytes (256 bits) para AES-256
 */
function getEncryptionKey(): string {
  const key = process.env.OAUTH_TOKEN_ENCRYPTION_KEY

  if (!key) {
    throw new Error(
      'OAUTH_TOKEN_ENCRYPTION_KEY environment variable is required for token encryption'
    )
  }

  // Validar que la clave tenga al menos 32 caracteres (256 bits)
  if (key.length < 32) {
    throw new Error(
      'OAUTH_TOKEN_ENCRYPTION_KEY must be at least 32 characters long for AES-256'
    )
  }

  return key
}

/**
 * Encripta un token usando la función de Supabase
 * ÉLITE: La encriptación se hace a nivel de base de datos para máxima seguridad
 */
export async function encryptToken(
  supabase: Awaited<ReturnType<typeof createClient>>,
  token: string
): Promise<string> {
  if (!token || token.trim().length === 0) {
    throw new Error('Token cannot be empty')
  }

  const encryptionKey = getEncryptionKey()

  // Llamar a la función de Supabase para encriptar
  const { data, error } = await supabase.rpc('encrypt_oauth_token', {
    token,
    encryption_key: encryptionKey,
  })

  if (error) {
    console.error('[GBP Encryption] Error encrypting token:', error)
    throw new Error(`Failed to encrypt token: ${error.message}`)
  }

  return data
}

/**
 * Desencripta un token usando la función de Supabase
 * ÉLITE: La desencriptación se hace a nivel de base de datos
 */
export async function decryptToken(
  supabase: Awaited<ReturnType<typeof createClient>>,
  encryptedToken: string
): Promise<string> {
  if (!encryptedToken || encryptedToken.trim().length === 0) {
    throw new Error('Encrypted token cannot be empty')
  }

  const encryptionKey = getEncryptionKey()

  // Llamar a la función de Supabase para desencriptar
  const { data, error } = await supabase.rpc('decrypt_oauth_token', {
    encrypted_token: encryptedToken,
    encryption_key: encryptionKey,
  })

  if (error) {
    console.error('[GBP Encryption] Error decrypting token:', error)
    throw new Error(`Failed to decrypt token: ${error.message}`)
  }

  return data
}

/**
 * Valida que un token tenga el formato correcto antes de encriptar
 * ÉLITE: Validación preventiva para evitar guardar tokens inválidos
 */
export function validateTokenFormat(token: string, tokenType: 'access' | 'refresh'): boolean {
  if (!token || token.trim().length === 0) {
    return false
  }

  // Access tokens de Google suelen tener un formato específico
  if (tokenType === 'access') {
    // Los access tokens de Google suelen empezar con "ya29." o similar
    // Pero no validamos formato exacto para ser flexibles
    return token.length >= 50 // Mínimo razonable para un access token
  }

  // Refresh tokens pueden tener diferentes formatos
  if (tokenType === 'refresh') {
    return token.length >= 20 // Mínimo razonable para un refresh token
  }

  return false
}
