import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

/**
 * Middleware de Next.js para actualizar la sesión de autenticación.
 * Se ejecuta antes de cada request y refresca los tokens de Auth si es necesario.
 *
 * El matcher excluye archivos estáticos y de imagen para mejorar el rendimiento.
 */
export async function middleware(request: NextRequest) {
  // Actualizar la sesión del usuario
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto las que empiezan con:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imagen)
     * - favicon.ico (archivo favicon)
     * - archivos de imagen (svg, png, jpg, jpeg, gif, webp)
     * Siéntete libre de modificar este patrón para incluir más rutas.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
