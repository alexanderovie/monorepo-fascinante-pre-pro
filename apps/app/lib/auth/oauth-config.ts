/**
 * OAuth Configuration
 *
 * Configuración centralizada para proveedores OAuth.
 * Facilita agregar nuevos proveedores y mantener consistencia.
 *
 * Best Practices:
 * - Centralización de configuración
 * - Type safety completo
 * - Fácil extensión para nuevos proveedores
 */

export type OAuthProvider = 'google' | 'apple' | 'github' | 'facebook' | 'twitter'

export interface OAuthProviderConfig {
  name: string
  displayName: string
  enabled: boolean
  scopes?: string[]
}

/**
 * Configuración de proveedores OAuth
 *
 * Para agregar un nuevo proveedor:
 * 1. Agregar el tipo en OAuthProvider
 * 2. Agregar la configuración aquí
 * 3. El resto del código se adaptará automáticamente
 */
export const OAUTH_PROVIDERS: Record<OAuthProvider, OAuthProviderConfig> = {
  google: {
    name: 'google',
    displayName: 'Google',
    enabled: true,
    scopes: ['email', 'profile'],
  },
  apple: {
    name: 'apple',
    displayName: 'Apple',
    enabled: true,
    scopes: ['email', 'name'],
  },
  github: {
    name: 'github',
    displayName: 'GitHub',
    enabled: false, // Habilitar cuando se configure
    scopes: ['user:email'],
  },
  facebook: {
    name: 'facebook',
    displayName: 'Facebook',
    enabled: false,
    scopes: ['email', 'public_profile'],
  },
  twitter: {
    name: 'twitter',
    displayName: 'Twitter',
    enabled: false,
    scopes: ['tweet.read', 'users.read'],
  },
}

/**
 * Obtiene la configuración de un proveedor OAuth
 */
export function getOAuthProviderConfig(provider: OAuthProvider): OAuthProviderConfig {
  return OAUTH_PROVIDERS[provider]
}

/**
 * Obtiene todos los proveedores habilitados
 */
export function getEnabledProviders(): OAuthProvider[] {
  return (Object.keys(OAUTH_PROVIDERS) as OAuthProvider[]).filter(
    (provider) => OAUTH_PROVIDERS[provider].enabled
  )
}

/**
 * Valida si un proveedor está habilitado
 */
export function isProviderEnabled(provider: OAuthProvider): boolean {
  return OAUTH_PROVIDERS[provider]?.enabled ?? false
}

