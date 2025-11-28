/**
 * Configuración centralizada de Crisp Chat
 *
 * Basado en la documentación oficial de Crisp:
 * https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/npm/
 *
 * @module lib/crisp/config
 */

import type { Options } from 'crisp-sdk-web';
import type { CrispConfigOptions } from './types';

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
 * @returns Configuración completa de Crisp compatible con el SDK
 */
export function getCrispConfig(
  locale: string = 'en',
  options: Partial<CrispConfigOptions> = {}
): Options {
  // Mapeo de locales de next-intl a locales de Crisp
  const crispLocaleMap: Record<string, string> = {
    en: 'en',
    es: 'es',
  };

  const crispLocale = crispLocaleMap[locale] || 'en';

  // Construir configuración base compatible con el tipo Options del SDK
  const baseConfig: Options = {
    autoload: true, // Carga automática por defecto
    locale: crispLocale, // Sincronizado con next-intl
    sessionMerge: false,
    lockMaximized: false,
    lockFullview: false,
    safeMode: false,
  };

  // Aplicar opciones personalizadas, filtrando valores null/undefined
  const mergedConfig: Options = { ...baseConfig };

  // Aplicar opciones válidas (no null, no undefined)
  if (options.autoload !== undefined) mergedConfig.autoload = options.autoload;
  if (options.tokenId !== undefined && options.tokenId !== null) mergedConfig.tokenId = options.tokenId;
  if (options.locale !== undefined && options.locale !== null) mergedConfig.locale = options.locale;
  if (options.sessionMerge !== undefined) mergedConfig.sessionMerge = options.sessionMerge;
  if (options.cookieDomain !== undefined && options.cookieDomain !== null) mergedConfig.cookieDomain = options.cookieDomain;
  if (options.cookieExpire !== undefined && options.cookieExpire !== null) mergedConfig.cookieExpire = options.cookieExpire;
  if (options.lockMaximized !== undefined) mergedConfig.lockMaximized = options.lockMaximized;
  if (options.lockFullview !== undefined) mergedConfig.lockFullview = options.lockFullview;
  if (options.safeMode !== undefined) mergedConfig.safeMode = options.safeMode;
  if (options.clientUrl !== undefined && options.clientUrl !== null) mergedConfig.clientUrl = options.clientUrl;

  return mergedConfig;
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

  // Validar formato básico del Website ID (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(websiteId)) {
    throw new Error(
      'CRISP_WEBSITE_ID tiene un formato inválido. ' +
      'Debe ser un UUID válido (ej: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).'
    );
  }
}
