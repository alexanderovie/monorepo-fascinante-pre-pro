import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Actualiza la sesión del usuario en el middleware.
 * Esto es necesario porque los Server Components no pueden escribir cookies,
 * pero el middleware sí puede.
 *
 * IMPORTANTE: Evita escribir lógica entre createServerClient y
 * supabase.auth.getUser(). Un simple error podría hacer muy difícil
 * depurar problemas con usuarios siendo desconectados aleatoriamente.
 *
 * IMPORTANTE: No elimines getClaims(). Es necesario para refrescar el token.
 *
 * @param request - Request de Next.js
 * @returns Response con cookies actualizadas
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value }) => supabaseResponse.cookies.set(name, value))
        },
      },
    }
  )

  // IMPORTANTE: Evita escribir cualquier lógica entre createServerClient y
  // supabase.auth.getClaims(). Un simple error podría hacer muy difícil
  // depurar problemas con usuarios siendo desconectados aleatoriamente.

  // IMPORTANTE: No elimines getClaims(). Es necesario para refrescar el token.
  // Según documentación oficial de Supabase SSR (Nov 2025):
  // - getClaims() valida la firma JWT contra las claves públicas del proyecto cada vez
  // - NUNCA uses getSession() en código del servidor (no revalida el token)
  // - Siempre usa getClaims() para proteger páginas y datos de usuario
  const { data } = await supabase.auth.getClaims()

  const user = data?.claims

  // Proteger rutas del dashboard - redirigir a login si no hay usuario
  // Nota: Permitimos '/auth/callback' para que el OAuth callback funcione correctamente
  // El callback route handler maneja el intercambio del código OAuth
  // 
  // IMPORTANTE: También protegemos '/' en el middleware para evitar doble redirect
  // (el Server Component también verifica, pero es mejor hacerlo aquí para evitar
  // renderizado innecesario del Server Component)
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANTE: Debes *devolver* el objeto supabaseResponse tal como está.
  // Si estás creando un nuevo objeto de respuesta con NextResponse.next(),
  // asegúrate de:
  // 1. Pasar el request en él, así: const myNewResponse = NextResponse.next({ request })
  // 2. Copiar las cookies, así: myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Cambiar el objeto myNewResponse para ajustarlo a tus necesidades,
  //    pero evita cambiar las cookies!
  // 4. Finalmente: return myNewResponse
  // Si esto no se hace, puedes causar que el navegador y el servidor se
  // desincronicen y terminen la sesión del usuario prematuramente!

  return supabaseResponse
}
