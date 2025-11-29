/**
 * API Route: Audit Form Submission
 * Endpoint para procesar el formulario de auditoría
 *
 * Basado en Next.js 15 Route Handlers (Nov 2025)
 * https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */

import { NextRequest, NextResponse } from 'next/server';
import { auditFormSchema, type AuditFormData } from '@/app/[locale]/lib/validations/audit-schema';

/**
 * POST /api/audit
 *
 * Procesa el envío del formulario de auditoría
 *
 * Request Body:
 * - businessName: string (requerido, 2-100 caracteres)
 *
 * Response:
 * - 200: { success: true, message: string }
 * - 400: { success: false, error: string, errors?: Record<string, string> }
 * - 500: { success: false, error: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear el body JSON
    const body = await request.json();

    // Validar con Zod (validación del servidor)
    const validationResult = auditFormSchema.safeParse(body);

    if (!validationResult.success) {
      // Mapear errores de Zod a formato amigable
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Error de validación',
          errors,
        },
        { status: 400 }
      );
    }

    // Datos validados
    const data: AuditFormData = validationResult.data;

    // Obtener datos de Google Places si tenemos place_id
    let googlePlacesData = null;
    if (data.placeId) {
      try {
        // Usar fetch interno (Next.js maneja esto correctamente)
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
        const placesResponse = await fetch(
          `${baseUrl}/api/places/details?placeId=${data.placeId}&languageCode=es`,
          {
            // Usar fetch interno de Next.js
            cache: 'no-store',
          }
        );
        if (placesResponse.ok) {
          googlePlacesData = await placesResponse.json();
        }
      } catch (error) {
        console.error('[API] Error obteniendo datos de Google Places:', error);
        // Continuar sin datos de Google Places (no es crítico)
      }
    }

    // Obtener datos de DataForSEO si tenemos place_id
    let dataForSEOData = null;
    if (data.placeId) {
      try {
        // Importar dinámicamente para evitar errores si no está configurado
        const { getGoogleMyBusinessInfo } = await import('@/lib/dataforseo');
        dataForSEOData = await getGoogleMyBusinessInfo({
          placeId: data.placeId,
          locationCode: 2840, // US (puede mejorarse detectando desde address)
          languageCode: 'en',
        });
      } catch (error) {
        console.error('[API] Error obteniendo datos de DataForSEO:', error);
        // Continuar sin datos de DataForSEO (no es crítico)
      }
    }

    // TODO: Aquí iría la lógica de negocio:
    // - Guardar en base de datos (con datos combinados de Google Places + DataForSEO)
    // - Enviar email de confirmación
    // - Crear lead en CRM
    // - Generar reporte de auditoría
    // - etc.

    // Log para debugging (en producción, esto iría a un servicio de logging)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[API] Audit form submission:', {
        businessName: data.businessName,
        placeId: data.placeId,
        googlePlaces: googlePlacesData ? '✅' : '❌',
        dataForSEO: dataForSEOData ? '✅' : '❌',
        timestamp: new Date().toISOString(),
      });
    }

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: 'Auditoría solicitada correctamente. Te contactaremos pronto.',
        data: {
          businessName: data.businessName,
          placeId: data.placeId,
          // Incluir datos obtenidos (opcional, para debugging)
          ...(process.env.NODE_ENV === 'development' && {
            _debug: {
              googlePlaces: googlePlacesData ? 'Data available' : 'No data',
              dataForSEO: dataForSEOData ? 'Data available' : 'No data',
            },
          }),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Manejo de errores inesperados
    console.error('[API] Error processing audit form:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/audit
 *
 * Método no permitido (solo POST)
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST.',
    },
    { status: 405 }
  );
}
