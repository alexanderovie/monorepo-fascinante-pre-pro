/**
 * Booking Confirmation Validation Schema
 * Schema de validación Zod para el formulario de confirmación de booking
 *
 * Basado en documentación oficial de Zod (Nov 2025)
 * https://zod.dev
 *
 * Validaciones robustas y escalables:
 * - Validación de email estricta
 * - Validación de nombre completo
 * - Notas opcionales con límite de caracteres
 * - Type-safe con TypeScript
 */

import { z } from 'zod';

/**
 * Schema de validación para el formulario de confirmación de booking
 *
 * Validaciones:
 * - name: Requerido, mínimo 2 caracteres, máximo 100, debe incluir nombre y apellido
 * - email: Requerido, formato email válido, máximo 255 caracteres
 * - notes: Opcional, máximo 1000 caracteres
 */
export const bookingConfirmationSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre es requerido',
    })
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres',
    })
    .max(100, {
      message: 'El nombre no puede exceder 100 caracteres',
    })
    .trim()
    .refine(
      (val) => val.split(' ').filter(Boolean).length >= 2,
      {
        message: 'Por favor, ingresa tu nombre completo (nombre y apellido)',
      }
    ),

  email: z
    .string({
      required_error: 'El email es requerido',
    })
    .email({
      message: 'Por favor, ingresa un email válido',
    })
    .max(255, {
      message: 'El email no puede exceder 255 caracteres',
    })
    .toLowerCase()
    .trim(),

  notes: z
    .string()
    .max(1000, {
      message: 'Las notas no pueden exceder 1000 caracteres',
    })
    .trim()
    .optional()
    .or(z.literal('')),
});

/**
 * Tipo TypeScript inferido del schema
 * Útil para tipar las props y respuestas de API
 */
export type BookingConfirmationData = z.infer<typeof bookingConfirmationSchema>;

/**
 * Helper para validar datos parciales (útil para validación progresiva)
 */
export const bookingConfirmationPartialSchema = bookingConfirmationSchema.partial();
