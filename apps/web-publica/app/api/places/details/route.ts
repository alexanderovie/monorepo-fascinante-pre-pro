/**
 * API Route: Place Details (New)
 * Endpoint para obtener detalles completos de un lugar usando place_id
 *
 * Basado en Next.js 15 Route Handlers (Enero 2025)
 * Usa Places API (New) REST endpoint - Place Details
 *
 * Documentación: https://developers.google.com/maps/documentation/places/web-service/place-details
 */

import { NextRequest, NextResponse } from 'next/server';

const PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

/**
 * GET /api/places/details?placeId=PLACE_ID
 *
 * Obtiene detalles completos de un lugar usando Place Details (New)
 *
 * Query Parameters:
 * - placeId: string (requerido, ID del lugar obtenido de autocompletado)
 * - fields?: string (opcional, campos específicos separados por comas, por defecto: NAP básico)
 * - languageCode?: string (opcional, código de idioma, ej: "es", "en")
 *
 * Response:
 * - 200: { id, displayName, formattedAddress, nationalPhoneNumber, websiteUri, ... }
 * - 400: { error: string }
 * - 500: { error: string }
 */
export async function GET(request: NextRequest) {
  try {
    if (!PLACES_API_KEY) {
      return NextResponse.json(
        {
          error: 'NEXT_PUBLIC_GOOGLE_PLACES_API_KEY no está configurada',
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get('placeId');
    const fields = searchParams.get('fields') || 'id,displayName,formattedAddress,nationalPhoneNumber,websiteUri';
    const languageCode = searchParams.get('languageCode') || 'es';

    if (!placeId) {
      return NextResponse.json(
        {
          error: 'placeId es requerido',
        },
        { status: 400 }
      );
    }

    // Construir URL para Place Details (New)
    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    // Construir headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_API_KEY,
      'X-Goog-FieldMask': fields,
    };

    // Agregar languageCode como query parameter
    const urlWithParams = new URL(url);
    if (languageCode) {
      urlWithParams.searchParams.set('languageCode', languageCode);
    }

    // Llamar a Places API (New) - Place Details
    const response = await fetch(urlWithParams.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Place Details API error:', response.status, errorText);

      return NextResponse.json(
        {
          error: 'Error al obtener detalles del lugar',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transformar respuesta a formato más amigable (compatibilidad con formato legacy)
    const transformedData = {
      place_id: data.id, // Mantener compatibilidad
      id: data.id,
      name: data.displayName?.text || '',
      displayName: data.displayName?.text || '',
      formatted_address: data.formattedAddress || '',
      formattedAddress: data.formattedAddress || '',
      national_phone_number: data.nationalPhoneNumber || '',
      nationalPhoneNumber: data.nationalPhoneNumber || '',
      website: data.websiteUri || '',
      websiteUri: data.websiteUri || '',
      // Campos adicionales si están disponibles
      rating: data.rating,
      userRatingCount: data.userRatingCount,
      businessStatus: data.businessStatus,
      types: data.types,
      // Datos completos de la API
      _raw: data,
    };

    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error('[API] Error processing place details request:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/places/details
 *
 * Alternativa usando POST (útil para campos complejos)
 *
 * Request Body:
 * - placeId: string (requerido)
 * - fields?: string[] (opcional)
 * - languageCode?: string (opcional)
 */
export async function POST(request: NextRequest) {
  try {
    if (!PLACES_API_KEY) {
      return NextResponse.json(
        {
          error: 'NEXT_PUBLIC_GOOGLE_PLACES_API_KEY no está configurada',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { placeId, fields, languageCode } = body;

    if (!placeId) {
      return NextResponse.json(
        {
          error: 'placeId es requerido',
        },
        { status: 400 }
      );
    }

    const defaultFields = 'id,displayName,formattedAddress,nationalPhoneNumber,websiteUri';
    const fieldMask = fields && Array.isArray(fields) ? fields.join(',') : fields || defaultFields;

    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const urlWithParams = new URL(url);
    if (languageCode) {
      urlWithParams.searchParams.set('languageCode', languageCode);
    }

    const response = await fetch(urlWithParams.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': PLACES_API_KEY,
        'X-Goog-FieldMask': fieldMask,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Place Details API error:', response.status, errorText);

      return NextResponse.json(
        {
          error: 'Error al obtener detalles del lugar',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transformar respuesta
    const transformedData = {
      place_id: data.id,
      id: data.id,
      name: data.displayName?.text || '',
      displayName: data.displayName?.text || '',
      formatted_address: data.formattedAddress || '',
      formattedAddress: data.formattedAddress || '',
      national_phone_number: data.nationalPhoneNumber || '',
      nationalPhoneNumber: data.nationalPhoneNumber || '',
      website: data.websiteUri || '',
      websiteUri: data.websiteUri || '',
      rating: data.rating,
      userRatingCount: data.userRatingCount,
      businessStatus: data.businessStatus,
      types: data.types,
      _raw: data,
    };

    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error('[API] Error processing place details request:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}
