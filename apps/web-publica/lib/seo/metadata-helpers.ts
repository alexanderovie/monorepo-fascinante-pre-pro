/**
 * SEO Metadata Helpers
 *
 * Helpers centralizados para generar URLs canónicas y alternates (hreflang)
 * siguiendo mejores prácticas de Next.js 15 y SEO (Diciembre 2025)
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#alternates
 */

const BASE_URL = 'https://fascinantedigital.com';

/**
 * Genera la URL canónica para una página específica
 *
 * @param path - Ruta de la página (ej: '/features', '/audit')
 * @param locale - Locale actual (ej: 'en', 'es')
 * @returns URL canónica completa
 *
 * @example
 * getCanonicalUrl('/features', 'es') // 'https://fascinantedigital.com/es/features'
 */
export function getCanonicalUrl(path: string, locale: string): string {
  // Normalizar path (remover trailing slash, agregar leading slash si falta)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const cleanPath = normalizedPath === '/' ? '' : normalizedPath.replace(/\/$/, '');

  return `${BASE_URL}/${locale}${cleanPath}`;
}

/**
 * Genera el objeto alternates completo con canonical y hreflang
 *
 * @param path - Ruta de la página (ej: '/features', '/audit')
 * @param locale - Locale actual (ej: 'en', 'es')
 * @returns Objeto alternates con canonical y languages
 *
 * @example
 * getAlternatesUrls('/features', 'es')
 * // {
 * //   canonical: 'https://fascinantedigital.com/es/features',
 * //   languages: {
 * //     'en': 'https://fascinantedigital.com/en/features',
 * //     'es': 'https://fascinantedigital.com/es/features'
 * //   }
 * // }
 */
export function getAlternatesUrls(path: string, locale: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const cleanPath = normalizedPath === '/' ? '' : normalizedPath.replace(/\/$/, '');

  return {
    canonical: `${BASE_URL}/${locale}${cleanPath}`,
    languages: {
      'en': `${BASE_URL}/en${cleanPath}`,
      'es': `${BASE_URL}/es${cleanPath}`,
    },
  };
}

/**
 * Obtiene el pathname desde una URL completa
 * Útil para extraer la ruta desde request.url en generateMetadata
 *
 * @param url - URL completa (ej: 'https://fascinantedigital.com/es/features')
 * @returns Pathname (ej: '/features')
 */
export function getPathnameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return '/';
  }
}

/**
 * Extrae el locale desde un pathname
 *
 * @param pathname - Pathname (ej: '/es/features', '/en/audit')
 * @returns Locale ('en' | 'es') o null si no se encuentra
 */
export function extractLocaleFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/(en|es)(\/|$)/);
  return match ? match[1] : null;
}
