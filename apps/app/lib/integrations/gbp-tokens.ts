/**
 * Google Business Profile Token Storage
 *
 * ÉLITE: Almacenamiento seguro de tokens OAuth siguiendo estándares de la industria 2025.
 *
 * Características:
 * - Encriptación AES-256 a nivel de base de datos
 * - Validación de tokens antes de guardar
 * - Manejo robusto de errores
 * - Rotación automática de access tokens
 * - Logging detallado para auditoría
 *
 * Referencias:
 * - OWASP Token Storage Guidelines
 * - RFC 6819 (OAuth 2.0 Security Best Practices)
 * - Supabase Security Best Practices
 */

import { createClient } from '@/utils/supabase/server'
import { encryptToken, decryptToken, validateTokenFormat } from './gbp-encryption'

export interface GBPTokens {
  access_token: string
  refresh_token: string
  expires_at: number // Timestamp en milisegundos
  token_type: string
  scope: string
  user_id: string // ID del usuario de Supabase
}

/**
 * Almacena los tokens de GBP para un usuario
 * ÉLITE: Encripta los tokens usando AES-256 antes de guardarlos en Supabase.
 *
 * Mejores prácticas implementadas:
 * - Validación de formato de tokens
 * - Encriptación AES-256 a nivel de base de datos
 * - Manejo robusto de errores
 * - Logging para auditoría (sin exponer valores sensibles)
 */
/**
 * Almacena los tokens de GBP para un usuario en Supabase
 * ÉLITE: Encripta los tokens automáticamente antes de guardarlos.
 *
 * @param userId - ID del usuario
 * @param tokens - Tokens a almacenar (sin user_id)
 * @param cookieStore - Opcional: cookies obtenidas fuera de función cacheada (para uso con unstable_cache)
 */
export async function storeGBPTokens(
  userId: string,
  tokens: Omit<GBPTokens, 'user_id'>,
  cookieStore?: Parameters<typeof createClient>[0]
): Promise<void> {
  // Validar formato de tokens antes de guardar
  if (!validateTokenFormat(tokens.access_token, 'access')) {
    throw new Error('Invalid access token format')
  }

  if (!validateTokenFormat(tokens.refresh_token, 'refresh')) {
    throw new Error('Invalid refresh token format')
  }

  // Log detallado (sin exponer valores completos)
  console.log('[GBP OAuth] Storing tokens for user:', userId)
  console.log('[GBP OAuth] Tokens expire at:', new Date(tokens.expires_at).toISOString())
  console.log('[GBP OAuth] Has refresh_token:', !!tokens.refresh_token)
  console.log('[GBP OAuth] Refresh token length:', tokens.refresh_token?.length || 0)
  console.log('[GBP OAuth] Access token length:', tokens.access_token?.length || 0)

  // ÉLITE: Pasar cookieStore para cumplir con restricciones de unstable_cache
  const supabase = await createClient(cookieStore)

  // Verificar que el usuario esté autenticado antes de intentar guardar
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser || authUser.id !== userId) {
    console.error('[GBP OAuth] User authentication mismatch:', {
      requestedUserId: userId,
      authenticatedUserId: authUser?.id || 'null',
    })
    throw new Error('User authentication failed or user ID mismatch')
  }

  console.log('[GBP OAuth] User authenticated, proceeding with token encryption')

  try {
    // ÉLITE: Encriptar tokens antes de guardar
    // Nota: Las funciones de encriptación esperan el cliente ya resuelto
    console.log('[GBP OAuth] Encrypting access token...')
    const encryptedAccessToken = await encryptToken(supabase, tokens.access_token)
    console.log('[GBP OAuth] Access token encrypted successfully')

    console.log('[GBP OAuth] Encrypting refresh token...')
    const encryptedRefreshToken = await encryptToken(supabase, tokens.refresh_token)
    console.log('[GBP OAuth] Refresh token encrypted successfully')

    console.log('[GBP OAuth] Attempting to upsert tokens to database...')
    console.log('[GBP OAuth] User ID for upsert:', userId)
    console.log('[GBP OAuth] Authenticated user ID:', authUser.id)

    // ÉLITE PRO: Según documentación oficial de Supabase (2025)
    // El upsert con onConflict puede tener problemas con RLS en algunos casos.
    // La solución moderna y escalable es verificar existencia primero,
    // luego hacer INSERT o UPDATE según corresponda.
    // Esto garantiza que las políticas RLS se evalúen correctamente.
    // Referencia: https://supabase.com/docs/guides/database/postgres/row-level-security

    const { data: existingData, error: selectError } = await supabase
      .from('user_integrations')
      .select('id, user_id')
      .eq('user_id', userId)
      .eq('integration_id', 'google-business-profile')
      .maybeSingle() // Usar maybeSingle() en lugar de single() para evitar error si no existe

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (esperado si no existe)
      console.error('[GBP OAuth] Error checking existing record:', selectError)
      throw new Error(`Failed to check existing record: ${selectError.message}`)
    }

    const recordExists = !!existingData
    console.log('[GBP OAuth] Record exists:', recordExists)

    const tokenData = {
      access_token: encryptedAccessToken,
      refresh_token: encryptedRefreshToken,
      expires_at: new Date(tokens.expires_at).toISOString(),
      token_type: tokens.token_type,
      scope: tokens.scope,
    }

    let data, error
    if (recordExists) {
      // Actualizar registro existente
      // Las políticas RLS UPDATE verifican: auth.uid() = user_id
      console.log('[GBP OAuth] Updating existing record...')
      const result = await supabase
        .from('user_integrations')
        .update(tokenData)
        .eq('user_id', userId)
        .eq('integration_id', 'google-business-profile')
        .select()
      data = result.data
      error = result.error
    } else {
      // Insertar nuevo registro
      // Las políticas RLS INSERT verifican: auth.uid() = user_id (en with_check)
      console.log('[GBP OAuth] Inserting new record...')
      const result = await supabase
        .from('user_integrations')
        .insert({
          user_id: userId,
          integration_id: 'google-business-profile',
          ...tokenData,
        })
        .select()
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('[GBP OAuth] Error storing tokens:', error)
      console.error('[GBP OAuth] Error code:', error.code)
      console.error('[GBP OAuth] Error message:', error.message)
      console.error('[GBP OAuth] Error details:', JSON.stringify(error, null, 2))
      throw new Error(`Failed to store tokens: ${error.message}`)
    }

    console.log('[GBP OAuth] Tokens stored successfully in Supabase (encrypted)')
    console.log('[GBP OAuth] Stored record ID:', data?.[0]?.id || 'N/A')
  } catch (error) {
    // Log detallado del error sin exponer información sensible
    console.error('[GBP OAuth] Failed to store tokens:', error instanceof Error ? error.message : 'Unknown error')
    throw error
  }
}

/**
 * Recupera los tokens de GBP para un usuario desde Supabase
 * ÉLITE: Desencripta los tokens automáticamente al recuperarlos.
 *
 * Mejores prácticas:
 * - Desencriptación segura a nivel de base de datos
 * - Validación de tokens después de desencriptar
 * - Manejo robusto de errores
 *
 * @param userId - ID del usuario
 * @param cookieStore - Opcional: cookies obtenidas fuera de función cacheada (para uso con unstable_cache)
 */
export async function getGBPTokens(
  userId: string,
  cookieStore?: Parameters<typeof createClient>[0]
): Promise<GBPTokens | null> {
  // ÉLITE PRO: Logging optimizado - solo eventos importantes
  // No loguear cada llamada a getGBPTokens (ruido innecesario)
  // Solo loguear en casos de error o debugging específico

  const supabase = await createClient(cookieStore)
  const { data, error } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('integration_id', 'google-business-profile')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No se encontró el registro (código 116 = no rows returned)
      console.log('[GBP OAuth] No tokens found for user')
      return null
    }
    console.error('[GBP OAuth] Error getting tokens:', error)
    throw new Error(`Failed to get tokens: ${error.message}`)
  }

  if (!data) {
    return null
  }

  try {
    // ÉLITE: Desencriptar tokens al recuperarlos
    const decryptedAccessToken = await decryptToken(supabase, data.access_token)
    const decryptedRefreshToken = await decryptToken(supabase, data.refresh_token)

    // Validar que los tokens desencriptados sean válidos
    if (!validateTokenFormat(decryptedAccessToken, 'access')) {
      console.error('[GBP OAuth] Decrypted access token has invalid format')
      throw new Error('Invalid decrypted access token format')
    }

    if (!validateTokenFormat(decryptedRefreshToken, 'refresh')) {
      console.error('[GBP OAuth] Decrypted refresh token has invalid format')
      throw new Error('Invalid decrypted refresh token format')
    }

    return {
      access_token: decryptedAccessToken,
      refresh_token: decryptedRefreshToken,
      expires_at: new Date(data.expires_at).getTime(),
      token_type: data.token_type || 'Bearer',
      scope: data.scope || '',
      user_id: userId,
    }
  } catch (error) {
    console.error('[GBP OAuth] Error decrypting tokens:', error instanceof Error ? error.message : 'Unknown error')
    throw new Error(`Failed to decrypt tokens: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Verifica si los tokens están expirados
 */
export function isTokenExpired(expiresAt: number): boolean {
  // Agregar margen de 5 minutos antes de la expiración
  const MARGIN_MS = 5 * 60 * 1000
  return Date.now() >= expiresAt - MARGIN_MS
}
