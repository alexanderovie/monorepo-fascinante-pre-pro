/**
 * Configuración centralizada de Crisp Chat
 *
 * Basado en la documentación oficial de Crisp:
 * https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/npm/
 *
 * @module lib/crisp/config
 */

/**
 * Opciones de configuración para Crisp Chat
 *
 * @see https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/npm/#configure
 */
export interface CrispConfigOptions {
  /** Autocarga Crisp una vez configurado. Default: true */
  autoload?: boolean;
  /** Token de continuidad de sesión. Default: null */
  tokenId?: string | null;
  /** Establece un locale personalizado (en, es, fr, de, ...). Default: null */
  locale?: string | null;
  /** Habilita merge de sesión. Default: false */
  sessionMerge?: boolean;
  /** Fuerza un dominio personalizado para almacenamiento de cookies. Default: null */
  cookieDomain?: string | null;
  /** Fuerza un tiempo de expiración personalizado para cookies. Default: null */
  cookieExpire?: number | null;
  /** Previene que el chatbox se cierre. Default: false */
  lockMaximized?: boolean;
  /** Fuerza modo pantalla completa del chatbox. Default: false */
  lockFullview?: boolean;
  /** Fuerza modo seguro del chatbox. Default: false */
  safeMode?: boolean;
  /** Usa una URL personalizada para el loader del chatbox. Default: https://client.crisp.chat/l.js */
  clientUrl?: string;
}

/**
 * Obtiene el Website ID de Crisp desde variables de entorno
 *
 * @returns Website ID de Crisp o null si no está configurado
 */
export function getCrispWebsiteId(): string | null {
  return process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || null;
}

/**
 * Obtiene la configuración de Crisp con valores por defecto optimizados
 *
 * @param locale - Locale actual (es/en) para sincronizar con next-intl
 * @param options - Opciones adicionales de configuración
 * @returns Configuración completa de Crisp
 */
export function getCrispConfig(
  locale: string = 'en',
  options: Partial<CrispConfigOptions> = {}
): CrispConfigOptions {
  // Mapeo de locales de next-intl a locales de Crisp
  const crispLocaleMap: Record<string, string> = {
    en: 'en',
    es: 'es',
  };

  const crispLocale = crispLocaleMap[locale] || 'en';

  return {
    autoload: true, // Carga automática por defecto
    locale: crispLocale, // Sincronizado con next-intl
    sessionMerge: false,
    lockMaximized: false,
    lockFullview: false,
    safeMode: false,
    ...options, // Permite override de opciones
  };
}

/**
 * Valida que el Website ID esté configurado
 *
 * @throws Error si el Website ID no está configurado
 */
export function validateCrispConfig(): void {
  const websiteId = getCrispWebsiteId();

  if (!websiteId) {
    throw new Error(
      'CRISP_WEBSITE_ID no está configurado. ' +
      'Agrega NEXT_PUBLIC_CRISP_WEBSITE_ID a tus variables de entorno.'
    );
  }
}
