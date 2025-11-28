import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ÉLITE: En Next.js 15, ReadonlyRequestCookies no se exporta directamente
// Usamos el tipo inferido de cookies()
// Exportado para uso en funciones que reciben cookies como parámetro (unstable_cache)
export type ReadonlyRequestCookies = Awaited<ReturnType<typeof cookies>>

/**
 * Crea un cliente de Supabase para usar en Server Components, Server Actions,
 * y Route Handlers. Este cliente se ejecuta en el servidor y lee/escribe
 * cookies para mantener la sesión del usuario.
 *
 * IMPORTANTE: Siempre usa `supabase.auth.getUser()` en el servidor,
 * nunca `getSession()`, ya que `getUser()` valida el token con el servidor de Auth.
 *
 * ÉLITE: Para usar dentro de funciones cacheadas con `unstable_cache`,
 * pasa las cookies como parámetro usando `createClientWithCookies()`.
 *
 * @param cookieStore - Opcional: cookies obtenidas fuera de la función cacheada
 * @returns Cliente de Supabase configurado para el servidor
 */
export async function createClient(cookieStore?: ReadonlyRequestCookies) {
  // Si no se proporcionan cookies, obtenerlas (uso normal fuera de cache)
  const cookiesToUse = cookieStore || (await cookies())

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookiesToUse.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) => cookiesToUse.set(name, value))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
