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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Evita escribir cualquier lógica entre createServerClient y
  // supabase.auth.getClaims(). Un simple error podría hacer muy difícil
  // depurar problemas con usuarios siendo desconectados aleatoriamente.

  // IMPORTANTE: No elimines getClaims()
  const { data } = await supabase.auth.getClaims()

  const user = data?.claims

  // Proteger rutas del dashboard - redirigir a login si no hay usuario
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
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
