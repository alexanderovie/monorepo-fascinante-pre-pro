/**
 * Booking Confirmation Validation Schema
 * Schema de validación Zod para el formulario de confirmación de booking
 *
 * Basado en documentación oficial de Zod (Nov 2025)
 * https://zod.dev
 *
 * Validaciones robustas y escalables:
 * - Validación de email estricta
 * - Validación de nombre (flexible, permite nombres de una palabra)
 * - Notas opcionales con límite de caracteres
 * - Type-safe con TypeScript
 */

import { z } from 'zod';

/**
 * Schema de validación para el formulario de confirmación de booking
 *
 * Validaciones:
 * - name: Requerido, mínimo 2 caracteres, máximo 100, solo letras, espacios, guiones y apóstrofes
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
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, {
      message: 'El nombre solo puede contener letras, espacios, guiones y apóstrofes',
    }),

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
