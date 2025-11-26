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
 * URLs dinámicas - Solución moderna para noviembre 2025
 *
 * Estrategia híbrida:
 * 1. En Server Components: usa detección automática de subdominio (url-builder.ts)
 * 2. En Client Components: usa variables de entorno como fallback
 *
 * Variables de entorno (opcionales, para override manual):
 * - NEXT_PUBLIC_APP_BASE_URL: URL base del dashboard/app (ej: https://app.fascinantedigital.com)
 * - NEXT_PUBLIC_TRY_IT_FREE_URL: Override específico para "Try it free"
 * - NEXT_PUBLIC_GET_DEMO_URL: Override específico para "Get a demo"
 * - NEXT_PUBLIC_LOGIN_URL: Override específico para "Log in"
 *
 * Si no se definen, el sistema detecta automáticamente el subdominio:
 * - web.fascinantedigital.com → app.fascinantedigital.com
 * - www.fascinantedigital.com → app.fascinantedigital.com
 *
 * Para usar en Server Components, importa desde url-builder.ts:
 * ```tsx
 * import { DYNAMIC_URLS } from '@/lib/url-builder';
 * ```
 */
export const URLS = {
  // URLs con detección automática de subdominio (Server Components)
  // En Client Components, estas usan variables de entorno como fallback
  tryItFree: process.env.NEXT_PUBLIC_TRY_IT_FREE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/signup` : '#',
  getDemo: process.env.NEXT_PUBLIC_GET_DEMO_URL || process.env.NEXT_PUBLIC_APP_BASE_URL ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/demo` : '#',
  login: process.env.NEXT_PUBLIC_LOGIN_URL || process.env.NEXT_PUBLIC_APP_BASE_URL ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/login` : '#',
} as const;
