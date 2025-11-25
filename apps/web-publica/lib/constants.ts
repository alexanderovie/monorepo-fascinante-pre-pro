/**
 * Constantes centralizadas para assets y configuración
 * Evita hardcodear rutas y facilita el mantenimiento
 */

export const ASSETS = {
  logo: '/assets/logo-fascinante.svg',
} as const;

export const BRAND = {
  name: 'Fascinante Digital',
  tagline: 'Fascinante Digital - Web Pública',
} as const;

/**
 * URLs dinámicas configurables mediante variables de entorno
 * Permite cambiar las URLs según el subdominio o entorno sin modificar código
 *
 * Variables de entorno requeridas:
 * - NEXT_PUBLIC_TRY_IT_FREE_URL: URL del botón "Try it free" (ej: https://app.tudominio.com/signup)
 * - NEXT_PUBLIC_GET_DEMO_URL: URL del botón "Get a demo" (ej: https://app.tudominio.com/demo)
 *
 * Si no se definen, se usa '#' como fallback
 */
export const URLS = {
  tryItFree: process.env.NEXT_PUBLIC_TRY_IT_FREE_URL || '#',
  getDemo: process.env.NEXT_PUBLIC_GET_DEMO_URL || '#',
} as const;
