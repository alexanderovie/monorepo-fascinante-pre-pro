'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

/**
 * Server Action para iniciar sesión con email y contraseña.
 * 
 * @param formData - Datos del formulario con email y password
 */
export async function login(formData: FormData) {
  const supabase = await createClient()

  // En producción, deberías validar estos inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * Server Action para registrarse con email y contraseña.
 * 
 * @param formData - Datos del formulario con email y password
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()

  // En producción, deberías validar estos inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/auth/confirm-email')
}

