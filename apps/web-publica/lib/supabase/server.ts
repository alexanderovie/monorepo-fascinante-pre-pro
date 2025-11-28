import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Crea un cliente de Supabase para uso en Server Components de la web pública.
 * Este cliente usa la anon key y NO requiere autenticación (para reservas públicas).
 *
 * @returns Cliente de Supabase configurado para lectura pública
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
