/**
 * API Route: Availability
 *
 * Endpoint público para obtener disponibilidad de citas.
 * Usa Server Component pattern de Next.js 15.
 *
 * GET /api/availability?month=2025-01-01
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAvailabilityForMonth } from '@/lib/appointments/availability-service';
import { startOfMonth, parseISO, isValid } from 'date-fns';

export const dynamic = 'force-dynamic'; // Siempre ejecutar dinámicamente (no cache)
export const revalidate = 60; // Revalidar cada 60 segundos

/**
 * GET /api/availability?month=YYYY-MM-DD
 *
 * Retorna la disponibilidad para el mes especificado.
 *
 * Query params:
 * - month: Fecha en formato ISO (YYYY-MM-DD) o timestamp. Default: mes actual
 *
 * Response:
 * - 200: { availability: AvailabilityMap, error: null }
 * - 400: { error: string } (mes inválido)
 * - 500: { error: string } (error del servidor)
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetro month de la query string
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get('month');

    // Parsear y validar la fecha
    let month: Date;

    if (monthParam) {
      // Intentar parsear como ISO string o timestamp
      const parsed = parseISO(monthParam);

      if (!isValid(parsed)) {
        // Intentar como timestamp
        const timestamp = parseInt(monthParam, 10);
        if (isNaN(timestamp) || !isValid(new Date(timestamp))) {
          return NextResponse.json(
            {
              error: 'Invalid month parameter. Expected ISO date string (YYYY-MM-DD) or timestamp.',
              availability: {}
            },
            { status: 400 }
          );
        }
        month = new Date(timestamp);
      } else {
        month = parsed;
      }
    } else {
      // Default: mes actual
      month = new Date();
    }

    // Normalizar al inicio del mes
    const monthStart = startOfMonth(month);

    // Obtener disponibilidad
    const result = await getAvailabilityForMonth(monthStart);

    // Retornar respuesta
    if (result.error) {
      // Si hay error pero tenemos datos de fallback, retornarlos con warning
      return NextResponse.json(
        {
          availability: result.availability,
          error: result.error,
          warning: true,
          message: result.message || 'Using fallback availability due to error'
        },
        { status: 200 } // 200 porque tenemos datos, aunque haya warning
      );
    }

    return NextResponse.json({
      availability: result.availability,
      error: null,
      message: result.message || 'Availability retrieved successfully'
    });

  } catch (error) {
    console.error('[API] Error fetching availability:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        availability: {},
        message: 'Failed to fetch availability'
      },
      { status: 500 }
    );
  }
}
