import { createBrowserClient } from '@supabase/ssr'

/**
 * Crea un cliente de Supabase para usar en Client Components.
 * Este cliente se ejecuta en el navegador y maneja automáticamente
 * las cookies para mantener la sesión del usuario.
 *
 * @returns Cliente de Supabase configurado para el navegador
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

