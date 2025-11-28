/**
 * Middleware de Next.js
 *
 * Combina:
 * 1. Middleware de next-intl para routing de locales
 * 2. Rate limiting para API routes
 */

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// ============================================
// 1. MIDDLEWARE DE NEXT-INTL
// ============================================
const intlMiddleware = createMiddleware(routing);

// ============================================
// 2. RATE LIMITING PARA API ROUTES
// ============================================

const RATE_LIMIT_CONFIG = {
  maxRequests: 100,
  windowMinutes: 15,
  endpoints: ['/api/availability'],
};

const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();

  return 'unknown';
}

function getWindowStart(windowMinutes: number): number {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  return Math.floor(now / windowMs) * windowMs;
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; resetAt: number } {
  const isProtected = RATE_LIMIT_CONFIG.endpoints.some(endpoint =>
    pathname.startsWith(endpoint)
  );

  if (!isProtected) {
    return { allowed: true, resetAt: 0 };
  }

  const windowStart = getWindowStart(RATE_LIMIT_CONFIG.windowMinutes);
  const cacheKey = `${ip}:${pathname}:${windowStart}`;
  const current = rateLimitCache.get(cacheKey);

  const resetAt = windowStart + (RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000);

  if (!current || current.resetAt !== resetAt) {
    rateLimitCache.set(cacheKey, {
      count: 1,
      resetAt,
    });
    return { allowed: true, resetAt };
  }

  current.count += 1;
  rateLimitCache.set(cacheKey, current);

  const allowed = current.count <= RATE_LIMIT_CONFIG.maxRequests;

  return { allowed, resetAt };
}

function cleanupRateLimitCache() {
  const now = Date.now();
  const maxAge = RATE_LIMIT_CONFIG.windowMinutes * 2 * 60 * 1000;

  for (const [key, value] of rateLimitCache.entries()) {
    if (now - value.resetAt > maxAge) {
      rateLimitCache.delete(key);
    }
  }
}

// ============================================
// 3. MIDDLEWARE COMBINADO
// ============================================

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Primero: aplicar rate limiting a rutas API
  if (pathname.startsWith('/api/')) {
    // Limpiar cache ocasionalmente
    if (Math.random() < 0.1) {
      cleanupRateLimitCache();
    }

    const ip = getClientIP(request);
    const { allowed, resetAt } = checkRateLimit(ip, pathname);

    if (!allowed) {
      const resetAtSeconds = Math.ceil((resetAt - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Maximum ${RATE_LIMIT_CONFIG.maxRequests} requests per ${RATE_LIMIT_CONFIG.windowMinutes} minutes allowed.`,
          retryAfter: resetAtSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': resetAtSeconds.toString(),
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetAt).toISOString(),
          },
        }
      );
    }

    // Agregar headers de rate limit
    const cacheKey = `${ip}:${pathname}:${getWindowStart(RATE_LIMIT_CONFIG.windowMinutes)}`;
    const current = rateLimitCache.get(cacheKey);
    const remaining = current
      ? Math.max(0, RATE_LIMIT_CONFIG.maxRequests - current.count)
      : RATE_LIMIT_CONFIG.maxRequests - 1;

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString());

    return response;
  }

  // Segundo: aplicar middleware de next-intl para routing de locales
  return intlMiddleware(request);
}

export const config = {
  // Aplicar a todas las rutas excepto:
  // - archivos estáticos (_next/static, _next/image, favicon.ico, etc.)
  // - archivos públicos con extensión
  matcher: [
    // Match all pathnames except for:
    // - … if they start with `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
