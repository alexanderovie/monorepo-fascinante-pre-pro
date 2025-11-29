/**
 * Contact Form Validation Schema V2
 * Schema de validación Zod para el formulario de contacto (versión simplificada)
 *
 * Basado en documentación oficial de Zod (Noviembre 2025)
 * https://zod.dev
 *
 * Esta versión usa firstName, lastName y message en lugar de fullName
 * para coincidir con el diseño proporcionado
 */

import { z } from 'zod';

/**
 * Schema de validación para el formulario de contacto (versión simplificada)
 *
 * Validaciones:
 * - firstName: Requerido, mínimo 2 caracteres, máximo 50
 * - lastName: Requerido, mínimo 2 caracteres, máximo 50
 * - email: Requerido, formato email válido
 * - phone: Opcional, formato básico de teléfono
 * - message: Requerido, mínimo 10 caracteres, máximo 1000
 */
export const contactFormSchemaV2 = z.object({
  firstName: z
    .string({
      required_error: 'El nombre es requerido',
    })
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres',
    })
    .max(50, {
      message: 'El nombre no puede exceder 50 caracteres',
    })
    .trim(),

  lastName: z
    .string({
      required_error: 'El apellido es requerido',
    })
    .min(2, {
      message: 'El apellido debe tener al menos 2 caracteres',
    })
    .max(50, {
      message: 'El apellido no puede exceder 50 caracteres',
    })
    .trim(),

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

  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true; // Opcional
        // Remover espacios y caracteres especiales para contar solo dígitos
        const digitsOnly = val.replace(/\D/g, '');
        // Debe tener entre 10 y 15 dígitos (estándar internacional)
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      {
        message: 'El teléfono debe tener entre 10 y 15 dígitos',
      }
    ),

  message: z
    .string({
      required_error: 'El mensaje es requerido',
    })
    .min(10, {
      message: 'El mensaje debe tener al menos 10 caracteres',
    })
    .max(1000, {
      message: 'El mensaje no puede exceder 1000 caracteres',
    })
    .trim(),
});

/**
 * Tipo TypeScript inferido del schema
 * Útil para tipar las props y respuestas de API
 */
export type ContactFormDataV2 = z.infer<typeof contactFormSchemaV2>;

/**
 * Helper para validar datos parciales (útil para validación progresiva)
 */
export const contactFormPartialSchemaV2 = contactFormSchemaV2.partial();
