/**
 * API Route: Contact Form Submission
 * Endpoint para procesar el formulario de contacto
 *
 * Basado en Next.js 15 Route Handlers (Nov 2025)
 * https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 *
 * Manejo robusto de errores:
 * - Validación del servidor con Zod
 * - Respuestas consistentes
 * - Logging estructurado
 * - Rate limiting ready (preparado para implementar)
 */

import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema, type ContactFormData } from '@/app/[locale]/lib/validations/contact-schema';

/**
 * POST /api/contact
 *
 * Procesa el envío del formulario de contacto
 *
 * Request Body:
 * - fullName: string (requerido, 2-100 caracteres)
 * - company?: string (opcional, max 100 caracteres)
 * - phone?: string (opcional, formato teléfono)
 * - email: string (requerido, email válido)
 * - country?: string (opcional, enum)
 * - companySize?: string (opcional, enum)
 * - referral?: string (opcional, enum)
 *
 * Response:
 * - 200: { success: true, message: string, data: ContactFormData }
 * - 400: { success: false, error: string, errors?: Record<string, string> }
 * - 429: { success: false, error: string } (rate limiting - futuro)
 * - 500: { success: false, error: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear el body JSON
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      );
    }

    // Validar con Zod (validación del servidor)
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      // Mapear errores de Zod a formato amigable
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as string;
          // Solo guardar el primer error por campo
          if (!errors[fieldName]) {
            errors[fieldName] = err.message;
          }
        }
      });

      // Log de errores de validación (no crítico, pero útil para debugging)
      // eslint-disable-next-line no-console
      console.warn('[API] Contact form validation errors:', {
        errors,
        timestamp: new Date().toISOString(),
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
    const data: ContactFormData = validationResult.data;

    // TODO: Aquí iría la lógica de negocio:
    // - Guardar en base de datos (Supabase, PostgreSQL, etc.)
    // - Enviar email de confirmación al usuario
    // - Enviar notificación al equipo de ventas
    // - Crear lead en CRM (HubSpot, Salesforce, etc.)
    // - Integrar con sistema de calendario para agendar demo
    // - Rate limiting (prevenir spam)
    // - etc.

    // Por ahora, solo logueamos (en producción, esto iría a un servicio)
    // eslint-disable-next-line no-console
    console.log('[API] Contact form submission:', {
      fullName: data.fullName,
      email: data.email,
      company: data.company || 'N/A',
      country: data.country || 'N/A',
      timestamp: new Date().toISOString(),
    });

    // Simular procesamiento (en producción, esto sería real)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: 'Formulario enviado correctamente. Te contactaremos pronto.',
        data: {
          fullName: data.fullName,
          email: data.email,
          // No devolvemos datos sensibles
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Manejo de errores inesperados
    console.error('[API] Error processing contact form:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // No exponer detalles internos al cliente en producción
    const errorMessage =
      process.env.NODE_ENV === 'development'
        ? error instanceof Error
          ? error.message
          : 'Internal server error'
        : 'Error interno del servidor. Por favor, intenta más tarde.';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
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

/**
 * Rate Limiting (Preparado para futuro)
 *
 * TODO: Implementar rate limiting para prevenir spam
 * Opciones:
 * - Vercel Edge Config
 * - Upstash Redis
 * - Custom middleware
 *
 * Ejemplo de estructura:
 *
 * ```ts
 * const rateLimit = await checkRateLimit(request);
 * if (!rateLimit.allowed) {
 *   return NextResponse.json(
 *     { success: false, error: 'Too many requests' },
 *     { status: 429 }
 *   );
 * }
 * ```
 */
