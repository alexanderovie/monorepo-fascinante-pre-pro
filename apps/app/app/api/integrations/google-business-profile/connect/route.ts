import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { generateGBPOAuthUrl } from '@/lib/integrations/gbp-oauth'
import {
  generateGBPOAuthState,
  storeGBPOAuthState,
} from '@/lib/integrations/gbp-oauth-state'
import { getRedirectUri } from '@/lib/integrations/gbp-redirect-uri'

/**
 * Connect Route - Inicia el flujo OAuth de Google Business Profile
 *
 * Este endpoint:
 * 1. Verifica que el usuario esté autenticado
 * 2. Genera un state único para CSRF protection
 * 3. Construye la URL de autorización de Google
 * 4. Redirige al usuario a Google para consentimiento
 *
 * Best Practices:
 * - Verificación de autenticación
 * - CSRF protection con state parameter
 * - Manejo de errores robusto
 * - Logging para debugging
 */
export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      )
    }

    // Obtener variables de entorno
    const clientId = process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_ID

    if (!clientId) {
      console.error('[GBP OAuth] Missing GOOGLE_BUSINESS_PROFILE_CLIENT_ID')
      return NextResponse.json(
        {
          error: 'Server configuration error. Please contact support.',
        },
        { status: 500 }
      )
    }

    // Construir redirect URI dinámicamente (detecta el puerto automáticamente)
    const redirectUri = getRedirectUri(request)

    console.log('[GBP OAuth] Using redirect URI:', redirectUri)

    // Generar state único para CSRF protection
    const state = generateGBPOAuthState()
    await storeGBPOAuthState(state)

    // Construir URL de autorización
    const authUrl = generateGBPOAuthUrl(clientId, redirectUri, state)

    console.log('[GBP OAuth] Redirecting user to Google:', {
      userId: user.id,
      state: state.substring(0, 8) + '...',
    })

    // Redirigir a Google
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('[GBP OAuth] Error in connect route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
