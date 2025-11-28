/**
 * URL Builder - Detección dinámica de subdominio
 *
 * Solución simple y efectiva para Client Components.
 * Detecta automáticamente el subdominio desde window.location
 * y construye URLs dinámicas.
 *
 * Estrategia:
 * 1. Usa window.location.host (solo Client Components)
 * 2. Fallback a variables de entorno si no se puede detectar
 *
 * Ejemplo:
 * - web.fascinantedigital.com → app.fascinantedigital.com/login
 * - www.fascinantedigital.com → app.fascinantedigital.com/login
 * - localhost:3000 → usa NEXT_PUBLIC_* o fallback a '#'
 */

type SubdomainMapping = {
  [key: string]: string;
};

/**
 * Mapeo de subdominios a URLs base del dashboard/app
 * Se puede extender fácilmente para múltiples subdominios
 */
const SUBDOMAIN_MAPPING: SubdomainMapping = {
  'web': 'app',
  'www': 'app',
  '': 'app', // dominio raíz también apunta a app
};

/**
 * Extrae el subdominio del host
 * Ejemplo: "web.fascinantedigital.com" → "web"
 */
function extractSubdomain(host: string): string {
  const parts = host.split('.');

  // Si tiene más de 2 partes, el primero es el subdominio
  // Ejemplo: web.fascinantedigital.com → web
  if (parts.length > 2) {
    return parts[0];
  }

  // Si es localhost o IP, retorna string vacío
  if (host.includes('localhost') || host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return '';
  }

  // Dominio raíz sin subdominio
  return '';
}

/**
 * Construye la URL base del dashboard/app basándose en el subdominio
 */
function buildAppBaseUrl(subdomain: string, host: string): string {
  const appSubdomain = SUBDOMAIN_MAPPING[subdomain] || 'app';

  // Si es localhost, usa el puerto actual
  if (host.includes('localhost')) {
    const port = host.split(':')[1] || '3000';
    return `http://localhost:${port}`;
  }

  // Reemplaza el subdominio actual por el subdominio del app
  const domain = host.split('.').slice(-2).join('.'); // Obtiene "fascinantedigital.com"
  return `https://${appSubdomain}.${domain}`;
}

/**
 * Construye una URL completa para una ruta específica
 */
function buildUrl(route: string, baseUrl: string | null): string {
  if (!baseUrl || baseUrl === '#') {
    return '#';
  }

  // Si la ruta ya es una URL completa, retórnala tal cual
  if (route.startsWith('http://') || route.startsWith('https://')) {
    return route;
  }

  // Asegura que la ruta empiece con /
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;

  return `${baseUrl}${cleanRoute}`;
}


/**
 * Obtiene el host desde window.location
 * Solo funciona en Client Components
 */
function getHost(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.location.host;
}

/**
 * URLs por defecto (valores de producción)
 * Se pueden sobrescribir con variables de entorno
 *
 * Nota: Las rutas relativas (como '/audit') funcionan en cualquier entorno
 * y son preferibles para rutas internas de la aplicación.
 */
const DEFAULT_URLS = {
  login: 'https://app.fascinantedigital.com/',
  signup: '/audit', // Ruta interna - página de audit
  demo: '/book', // Página de agendar cita en lugar de Cal.com
} as const;

/**
 * Construye URLs dinámicas basadas en el subdominio actual
 *
 * Prioridad:
 * 1. Variables de entorno específicas (NEXT_PUBLIC_LOGIN_URL, etc.)
 * 2. Detección automática de subdominio (si está habilitada)
 * 3. URLs por defecto de producción
 *
 * Solo funciona en Client Components (usa window.location)
 *
 * Uso:
 * ```tsx
 * 'use client';
 * import { getUrl } from '@/lib/url-builder';
 * const loginUrl = getUrl('login');
 * ```
 */
export function getUrl(route: 'login' | 'signup' | 'demo'): string {
  // 1. Prioridad: Variables de entorno específicas
  const envUrls = {
    login: process.env.NEXT_PUBLIC_LOGIN_URL,
    signup: process.env.NEXT_PUBLIC_TRY_IT_FREE_URL,
    demo: process.env.NEXT_PUBLIC_GET_DEMO_URL,
  };

  if (envUrls[route]) {
    return envUrls[route]!;
  }

  // 2. Rutas internas: retornar directamente sin detección de subdominio
  // 'signup' siempre apunta a /audit (ruta interna del mismo dominio)
  if (route === 'signup') {
    return '/audit';
  }

  // 'demo' siempre apunta a /book (página de agendar cita - ruta interna)
  if (route === 'demo') {
    return '/book';
  }

  // 3. Rutas externas: usar detección de subdominio o DEFAULT_URLS
  // 'login' puede usar detección de subdominio

  if (route === 'login') {
    // Detección automática de subdominio para 'login'
    const host = getHost();
    if (host && !host.includes('localhost')) {
      const subdomain = extractSubdomain(host);
      const baseUrl = buildAppBaseUrl(subdomain, host);
      const dynamicUrl = buildUrl('/', baseUrl);
      // Solo usa detección dinámica si no es localhost
      if (dynamicUrl !== '#') {
        return dynamicUrl;
      }
    }
  }

  // 4. URLs por defecto de producción (para 'login' y 'demo')
  return DEFAULT_URLS[route];
}
