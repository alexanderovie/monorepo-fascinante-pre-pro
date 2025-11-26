import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Crea un cliente de Supabase para usar en Server Components, Server Actions,
 * y Route Handlers. Este cliente se ejecuta en el servidor y lee/escribe
 * cookies para mantener la sesión del usuario.
 *
 * IMPORTANTE: Siempre usa `supabase.auth.getUser()` en el servidor,
 * nunca `getSession()`, ya que `getUser()` valida el token con el servidor de Auth.
 *
 * @returns Cliente de Supabase configurado para el servidor
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // El `setAll` fue llamado desde un Server Component.
            // Esto se puede ignorar si tienes middleware refrescando
            // las sesiones de usuario.
          }
        },
      },
    }
  )
}

