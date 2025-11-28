/**
 * Countries Options
 * Lista de países para formularios (reutilizable)
 *
 * Actualizado: Noviembre 2025
 */

import type { FormSelectOption } from '../../components/forms';

/**
 * Opciones de países para formularios
 * Países principales primero, luego resto de Latinoamérica alfabéticamente
 */
export const countryOptions: FormSelectOption[] = [
  // Opción por defecto
  { value: '', label: 'Selecciona un país' },

  // Países principales al inicio
  { value: 'us', label: 'Estados Unidos' },
  { value: 've', label: 'Venezuela' },
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },

  // Separador visual
  { value: 'separator-1', label: '──────────', disabled: true },

  // Resto de países de Latinoamérica en orden alfabético
  { value: 'ar', label: 'Argentina' },
  { value: 'bo', label: 'Bolivia' },
  { value: 'br', label: 'Brasil' },
  { value: 'cl', label: 'Chile' },
  { value: 'cr', label: 'Costa Rica' },
  { value: 'cu', label: 'Cuba' },
  { value: 'do', label: 'República Dominicana' },
  { value: 'ec', label: 'Ecuador' },
  { value: 'sv', label: 'El Salvador' },
  { value: 'gt', label: 'Guatemala' },
  { value: 'hn', label: 'Honduras' },
  { value: 'ni', label: 'Nicaragua' },
  { value: 'pa', label: 'Panamá' },
  { value: 'py', label: 'Paraguay' },
  { value: 'pe', label: 'Perú' },
  { value: 'pr', label: 'Puerto Rico' },
  { value: 'uy', label: 'Uruguay' },

  // Separador visual
  { value: 'separator-2', label: '──────────', disabled: true },

  // Otro al final
  { value: 'other', label: 'Otro' },
];
