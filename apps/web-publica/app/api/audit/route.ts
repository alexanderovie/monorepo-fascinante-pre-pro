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

    // TODO: Aquí iría la lógica de negocio:
    // - Guardar en base de datos
    // - Enviar email de confirmación
    // - Integrar con Google Places API para obtener detalles del negocio
    // - Crear lead en CRM
    // - etc.

    // Por ahora, solo logueamos (en producción, esto iría a un servicio)
    // eslint-disable-next-line no-console
    console.log('[API] Audit form submission:', {
      businessName: data.businessName,
      timestamp: new Date().toISOString(),
    });

    // Simular procesamiento (en producción, esto sería real)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: 'Auditoría solicitada correctamente. Te contactaremos pronto.',
        data: {
          businessName: data.businessName,
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
