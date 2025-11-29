/**
 * Audit Form Validation Schema
 * Schema de validación Zod para el formulario de auditoría
 *
 * Basado en documentación oficial de Zod (Nov 2025)
 * https://zod.dev
 */

import { z } from 'zod';

/**
 * Schema de validación para el formulario de auditoría
 *
 * Validaciones:
 * - businessName: Requerido, mínimo 2 caracteres, máximo 100
 * - placeId: Opcional, identificador de Google Places (obtenido del autocompletado)
 */
export const auditFormSchema = z.object({
  businessName: z
    .string({
      required_error: 'El nombre del negocio es requerido',
    })
    .min(2, {
      message: 'El nombre del negocio debe tener al menos 2 caracteres',
    })
    .max(100, {
      message: 'El nombre del negocio no puede exceder 100 caracteres',
    })
    .trim(),
  placeId: z
    .string()
    .min(1, {
      message: 'Debes seleccionar un negocio de las sugerencias',
    })
    .optional(),
});

/**
 * Tipo TypeScript inferido del schema
 * Útil para tipar las props y respuestas de API
 */
export type AuditFormData = z.infer<typeof auditFormSchema>;
