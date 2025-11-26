import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * OAuth Callback Route Handler
 *
 * Según documentación oficial de Supabase SSR (Nov 2025):
 * - Este endpoint maneja el intercambio del código OAuth por una sesión
 * - Debe ser un Route Handler (no un Server Component)
 * - El código OAuth viene en los query params después del redirect del proveedor
 * - Después del intercambio exitoso, redirige al usuario a la página principal
 *
 * Best Practices:
 * - Manejo de errores robusto
 * - Soporte para parámetro "next" para redirección personalizada
 * - Soporte para entornos locales y producción (con load balancers)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Si "next" está en los params, usarlo como URL de redirección
  let next = searchParams.get('next') ?? '/'

  // Validar que "next" sea una ruta relativa (seguridad)
  if (!next.startsWith('/')) {
    next = '/'
  }

  if (code) {
    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Manejar redirección considerando load balancers en producción
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin antes del load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // En desarrollo, no hay load balancer, usar origin directamente
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // En producción con load balancer, usar el host original
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        // Fallback a origin
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Si hay error o no hay código, redirigir a página de error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

