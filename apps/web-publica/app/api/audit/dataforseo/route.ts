/**
 * API Route: DataForSEO Business Data
 * Endpoint para obtener datos de DataForSEO desde el servidor
 *
 * Las credenciales de DataForSEO solo están disponibles en el servidor,
 * por lo que necesitamos este endpoint para que el cliente pueda obtener los datos
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGoogleMyBusinessInfo } from '@/lib/dataforseo';

/**
 * GET /api/audit/dataforseo?placeId=PLACE_ID
 *
 * Obtiene información de Google My Business usando DataForSEO API
 *
 * Query Parameters:
 * - placeId: string (requerido, ID del lugar obtenido de Google Places)
 * - locationCode?: number (opcional, código de ubicación, default: 2840 para US)
 * - languageCode?: string (opcional, código de idioma, default: "en")
 *
 * Response:
 * - 200: { placeId, name, address, phone, website, rating, reviewsCount, categories, hours, ... }
 * - 400: { error: string }
 * - 500: { error: string }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const locationCode = searchParams.get('locationCode')
      ? parseInt(searchParams.get('locationCode')!, 10)
      : 2840; // US por defecto
    const languageCode = searchParams.get('languageCode') || 'en';

    if (!placeId) {
      return NextResponse.json(
        { success: false, error: 'placeId es requerido' },
        { status: 400 }
      );
    }

    // Obtener datos de DataForSEO (esto se ejecuta en el servidor donde las credenciales están disponibles)
    const businessInfo = await getGoogleMyBusinessInfo({
      placeId,
      locationCode,
      languageCode,
    });

    return NextResponse.json(businessInfo, { status: 200 });
  } catch (error) {
    console.error('[API] Error obteniendo datos de DataForSEO:', error);

    // Procesar error para devolver un mensaje útil
    const errorMessage = error instanceof Error
      ? error.message
      : 'Error desconocido al obtener datos de DataForSEO';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
