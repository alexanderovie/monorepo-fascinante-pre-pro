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
 * URLs dinámicas - Configuración actual
 *
 * Valores por defecto:
 * - login: https://app.fascinantedigital.com/ (URL externa)
 * - tryItFree: /audit (ruta interna)
 * - getDemo: /book (ruta interna - página de agendar cita)
 *
 * Variables de entorno (opcionales, para override):
 * - NEXT_PUBLIC_LOGIN_URL: Override para "Log in"
 * - NEXT_PUBLIC_TRY_IT_FREE_URL: Override para "Try it free"
 * - NEXT_PUBLIC_GET_DEMO_URL: Override para "Get a demo"
 *
 * Nota: En Client Components, usa getUrl() de url-builder.ts que incluye
 * detección automática de subdominio como fallback.
 */
export const URLS = {
  tryItFree: process.env.NEXT_PUBLIC_TRY_IT_FREE_URL || '/audit',
  getDemo: process.env.NEXT_PUBLIC_GET_DEMO_URL || '/book', // Página de agendar cita en lugar de Cal.com
  login: process.env.NEXT_PUBLIC_LOGIN_URL || 'https://app.fascinantedigital.com/',
} as const;
