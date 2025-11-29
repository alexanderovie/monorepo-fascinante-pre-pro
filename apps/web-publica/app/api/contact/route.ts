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
import { contactFormSchemaV2, type ContactFormDataV2 } from '@/app/[locale]/lib/validations/contact-schema-v2';

/**
 * POST /api/contact
 *
 * Procesa el envío del formulario de contacto
 *
 * Soporta dos versiones del formulario:
 * - V1: fullName, company, phone, email, country, companySize, referral
 * - V2: firstName, lastName, email, phone, message
 *
 * Response:
 * - 200: { success: true, message: string, data: ContactFormData | ContactFormDataV2 }
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

    // Detectar qué versión del schema usar basándose en los campos presentes
    const bodyObj = body as Record<string, unknown>;
    const isV2 = 'firstName' in bodyObj || 'lastName' in bodyObj || 'message' in bodyObj;
    const isV1 = 'fullName' in bodyObj;

    // Validar con Zod (validación del servidor)
    let validationResult;
    if (isV2) {
      validationResult = contactFormSchemaV2.safeParse(body);
    } else if (isV1) {
      validationResult = contactFormSchema.safeParse(body);
    } else {
      // Si no tiene campos reconocibles, intentar con V2 (más reciente)
      validationResult = contactFormSchemaV2.safeParse(body);
    }

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
    const data = validationResult.data as ContactFormData | ContactFormDataV2;

    // TODO: Aquí iría la lógica de negocio:
    // - Guardar en base de datos (Supabase, PostgreSQL, etc.)
    // - Enviar email de confirmación al usuario
    // - Enviar notificación al equipo de ventas
    // - Crear lead en CRM (HubSpot, Salesforce, etc.)
    // - Integrar con sistema de calendario para agendar demo
    // - Rate limiting (prevenir spam)
    // - etc.

    // Por ahora, solo logueamos (en producción, esto iría a un servicio)
    if (isV2) {
      const v2Data = data as ContactFormDataV2;
      // eslint-disable-next-line no-console
      console.log('[API] Contact form submission (V2):', {
        firstName: v2Data.firstName,
        lastName: v2Data.lastName,
        email: v2Data.email,
        phone: v2Data.phone || 'N/A',
        messageLength: v2Data.message.length,
        timestamp: new Date().toISOString(),
      });
    } else {
      const v1Data = data as ContactFormData;
      // eslint-disable-next-line no-console
      console.log('[API] Contact form submission (V1):', {
        fullName: v1Data.fullName,
        email: v1Data.email,
        company: v1Data.company || 'N/A',
        country: v1Data.country || 'N/A',
        timestamp: new Date().toISOString(),
      });
    }

    // Simular procesamiento (en producción, esto sería real)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: 'Formulario enviado correctamente. Te contactaremos pronto.',
        data: isV2
          ? {
              firstName: (data as ContactFormDataV2).firstName,
              lastName: (data as ContactFormDataV2).lastName,
              email: (data as ContactFormDataV2).email,
            }
          : {
              fullName: (data as ContactFormData).fullName,
              email: (data as ContactFormData).email,
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
