/**
 * API Route para probar la conexión con Crisp REST API
 *
 * Endpoints:
 * - GET /api/crisp/test - Verifica la conexión y obtiene información del website
 * - POST /api/crisp/test - Actualiza configuración del chatbox (ejemplo)
 *
 * Uso:
 *   curl http://localhost:3002/api/crisp/test
 *   curl -X POST http://localhost:3002/api/crisp/test -H "Content-Type: application/json" -d '{"color":"blue"}'
 */

import { NextResponse } from 'next/server';
import {
  verifyCrispApiSetup,
  getWebsiteInfo,
} from '@/lib/crisp/api-config';
import { CrispApiError } from '@/lib/crisp/api-client';

/**
 * GET - Verifica la conexión y obtiene información
 */
export async function GET() {
  try {
    // 1. Verificar que todo esté configurado
    await verifyCrispApiSetup();

    // 2. Obtener información del website
    const website = await getWebsiteInfo();

    return NextResponse.json({
      success: true,
      message: '✅ Conexión con Crisp API exitosa',
      data: {
        website: {
          id: website.website_id,
          name: website.name,
          domain: website.domain,
          logo: website.logo || null,
        },
        note: 'La configuración del chatbox no está disponible en la REST API v1. ' +
              'Usa el componente CrispChat.tsx con props dinámicas para cambiar la configuración.',
      },
    });
  } catch (error) {
    console.error('[Crisp API Test] Error:', error);

    if (error instanceof CrispApiError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error de API de Crisp',
          message: error.message,
          details: {
            statusCode: error.statusCode,
            reason: error.reason,
          },
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error desconocido',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST - No disponible
 *
 * La configuración del chatbox no está disponible en la REST API v1.
 * Usa el componente CrispChat.tsx con props dinámicas para cambiar la configuración.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'No disponible',
      message: 'La configuración del chatbox no está disponible en la REST API v1. ' +
                'Usa el componente CrispChat.tsx con props dinámicas para cambiar la configuración. ' +
                'Ejemplo: <CrispChat colorTheme="blue" position="right" />',
    },
    { status: 501 }
  );
}
