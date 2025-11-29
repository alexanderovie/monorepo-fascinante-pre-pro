/**
 * API Route: Places Autocomplete (New)
 * Endpoint para obtener sugerencias de autocompletado usando Places API (New)
 *
 * Basado en Next.js 15 Route Handlers (Enero 2025)
 * Usa Places API (New) REST endpoint
 */

import { NextRequest, NextResponse } from 'next/server';

const PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:autocomplete';

/**
 * POST /api/places/autocomplete
 *
 * Obtiene sugerencias de autocompletado de Places API (New)
 *
 * Request Body:
 * - input: string (requerido, texto de búsqueda)
 * - includedRegionCodes?: string[] (códigos de país, ej: ["US", "ES"])
 * - includedPrimaryTypes?: string[] (tipos de lugares, ej: ["establishment"])
 *
 * Response:
 * - 200: { suggestions: Array<{ placePrediction: {...} }> }
 * - 400: { error: string }
 * - 500: { error: string }
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
    const { input, includedRegionCodes, includedPrimaryTypes } = body;

    if (!input || typeof input !== 'string' || input.length < 2) {
      return NextResponse.json(
        {
          error: 'El input debe tener al menos 2 caracteres',
        },
        { status: 400 }
      );
    }

    // Construir request body para Places API (New)
    const requestBody: {
      input: string;
      includedRegionCodes?: string[];
      includedPrimaryTypes?: string[];
    } = {
      input,
    };

    if (includedRegionCodes && Array.isArray(includedRegionCodes)) {
      requestBody.includedRegionCodes = includedRegionCodes;
    }

    if (includedPrimaryTypes && Array.isArray(includedPrimaryTypes)) {
      requestBody.includedPrimaryTypes = includedPrimaryTypes;
    }

    // Llamar a Places API (New)
    const response = await fetch(PLACES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': PLACES_API_KEY,
        'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Places API error:', response.status, errorText);

      return NextResponse.json(
        {
          error: 'Error al obtener sugerencias de Places API',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[API] Error processing autocomplete request:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/places/autocomplete
 *
 * Método no permitido (solo POST)
 */
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed. Use POST.',
    },
    { status: 405 }
  );
}
