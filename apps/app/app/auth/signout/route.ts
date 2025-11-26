import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Ruta para cerrar sesión.
 * 
 * Elimina la sesión del usuario y redirige al login.
 * 
 * @param req - Request de Next.js
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Verificar si hay un usuario logueado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}

