/**
 * Contact Form Validation Schema
 * Schema de validación Zod para el formulario de contacto
 *
 * Basado en documentación oficial de Zod (Nov 2025)
 * https://zod.dev
 *
 * Validaciones robustas y escalables:
 * - Validación de email estricta
 * - Validación de teléfono opcional pero robusta
 * - Enums para selects (type-safe)
 * - Mensajes de error claros y traducibles
 */

import { z } from 'zod';

/**
 * Enum de países válidos
 * Basado en los países disponibles en el formulario
 */
export const countryEnum = z.enum([
  'us',
  've',
  'co',
  'mx',
  'ar',
  'bo',
  'br',
  'cl',
  'cr',
  'cu',
  'do',
  'ec',
  'sv',
  'gt',
  'hn',
  'ni',
  'pa',
  'py',
  'pe',
  'pr',
  'uy',
  'other',
]);

/**
 * Enum de tamaños de empresa
 */
export const companySizeEnum = z.enum(['1-10', '11-50', '51-200', '200+']);

/**
 * Enum de referencias (cómo nos conocieron)
 */
export const referralEnum = z.enum(['search', 'social', 'referral', 'other']);

/**
 * Schema de validación para el formulario de contacto
 *
 * Validaciones:
 * - fullName: Requerido, mínimo 2 caracteres, máximo 100
 * - company: Opcional, máximo 100 caracteres
 * - phone: Opcional, formato básico de teléfono
 * - email: Requerido, formato email válido
 * - country: Opcional, debe ser uno de los valores del enum
 * - companySize: Opcional, debe ser uno de los valores del enum
 * - referral: Opcional, debe ser uno de los valores del enum
 */
export const contactFormSchema = z.object({
  fullName: z
    .string({
      required_error: 'El nombre completo es requerido',
    })
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres',
    })
    .max(100, {
      message: 'El nombre no puede exceder 100 caracteres',
    })
    .trim()
    .refine(
      (val) => val.split(' ').length >= 2,
      {
        message: 'Por favor, ingresa tu nombre completo (nombre y apellido)',
      }
    ),

  company: z
    .string()
    .max(100, {
      message: 'El nombre de la empresa no puede exceder 100 caracteres',
    })
    .trim()
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true; // Opcional
        // Validación básica: debe tener al menos 10 caracteres (números, espacios, +, -, paréntesis)
        const phoneRegex = /^[\d\s\+\-\(\)]{10,20}$/;
        return phoneRegex.test(val);
      },
      {
        message: 'El teléfono debe tener entre 10 y 20 caracteres',
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
    .trim()
    .refine(
      (val) => {
        // Validación adicional: debe ser un email empresarial (opcional pero recomendado)
        // No bloqueamos emails personales, solo validamos formato
        return val.includes('@');
      },
      {
        message: 'Por favor, ingresa un email válido',
      }
    ),

  country: z
    .union([countryEnum, z.literal('')])
    .optional()
    .transform((val) => (val === '' || !val ? undefined : val)),

  companySize: z
    .union([companySizeEnum, z.literal('')])
    .optional()
    .transform((val) => (val === '' || !val ? undefined : val)),

  referral: z
    .union([referralEnum, z.literal('')])
    .optional()
    .transform((val) => (val === '' || !val ? undefined : val)),
});

/**
 * Tipo TypeScript inferido del schema
 * Útil para tipar las props y respuestas de API
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Helper para validar datos parciales (útil para validación progresiva)
 */
export const contactFormPartialSchema = contactFormSchema.partial();
