import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * Ruta de callback para confirmar el email y otros flujos OTP.
 * 
 * Intercambia el token_hash recibido por email por una sesión válida.
 * Este endpoint es necesario para el flujo de autenticación server-side.
 * 
 * @param request - Request de Next.js con los query params token_hash y type
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Crear URL de redirección sin los parámetros secretos
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }
  }

  // Si hay error, redirigir a página de error
  redirectTo.pathname = '/error'
  redirectTo.searchParams.set(
    'message',
    'No se pudo verificar el token. Por favor, intenta nuevamente.'
  )
  return NextResponse.redirect(redirectTo)
}

