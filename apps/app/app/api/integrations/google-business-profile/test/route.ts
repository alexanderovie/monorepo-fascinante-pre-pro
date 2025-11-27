/**
 * Test Endpoint - Google Business Profile Token Retrieval
 *
 * ÉLITE: Endpoint de prueba para verificar que los tokens se pueden recuperar
 * y desencriptar correctamente. Solo para desarrollo/testing.
 *
 * GET /api/integrations/google-business-profile/test
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getGBPTokens, isTokenExpired } from '@/lib/integrations/gbp-tokens'

export async function GET() {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Recuperar tokens (se desencriptan automáticamente)
    const tokens = await getGBPTokens(user.id)

    if (!tokens) {
      return NextResponse.json(
        {
          error: 'No tokens found',
          message: 'Please connect Google Business Profile first',
        },
        { status: 404 }
      )
    }

    // Verificar expiración
    const expired = isTokenExpired(tokens.expires_at)
    const expiresIn = Math.max(0, tokens.expires_at - Date.now())
    const expiresInMinutes = Math.floor(expiresIn / 60000)

    return NextResponse.json({
      success: true,
      tokenInfo: {
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        accessTokenLength: tokens.access_token?.length || 0,
        refreshTokenLength: tokens.refresh_token?.length || 0,
        tokenType: tokens.token_type,
        scope: tokens.scope,
        expiresAt: new Date(tokens.expires_at).toISOString(),
        isExpired: expired,
        expiresInMinutes: expiresInMinutes,
        expiresInMs: expiresIn,
      },
      // NO exponer los tokens completos en producción
      // Solo mostrar primeros y últimos caracteres para verificación
      tokenPreview: {
        accessToken: tokens.access_token
          ? `${tokens.access_token.substring(0, 10)}...${tokens.access_token.substring(tokens.access_token.length - 10)}`
          : null,
        refreshToken: tokens.refresh_token
          ? `${tokens.refresh_token.substring(0, 10)}...${tokens.refresh_token.substring(tokens.refresh_token.length - 10)}`
          : null,
      },
    })
  } catch (error) {
    console.error('[GBP Test] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
