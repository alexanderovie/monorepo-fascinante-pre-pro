/**
 * Contact Form Options
 * Opciones para los campos select del formulario de contacto
 *
 * Centralizado para fácil mantenimiento y escalabilidad
 */

import type { FormSelectOption } from '../../components/forms/FormSelect';

/**
 * Opciones de países para el formulario de contacto
 * Ordenadas por prioridad (países principales primero)
 */
export const countryOptions: FormSelectOption[] = [
  { value: '', label: 'Selecciona un país', disabled: true },
  // Países principales al inicio
  { value: 'us', label: 'Estados Unidos' },
  { value: 've', label: 'Venezuela' },
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },
  // Separador visual
  { value: '', label: '──────────', disabled: true },
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
  // Otro al final
  { value: '', label: '──────────', disabled: true },
  { value: 'other', label: 'Otro' },
];

/**
 * Opciones de tamaño de empresa
 */
export const companySizeOptions: FormSelectOption[] = [
  { value: '', label: 'Selecciona', disabled: true },
  { value: '1-10', label: '1-10 empleados' },
  { value: '11-50', label: '11-50 empleados' },
  { value: '51-200', label: '51-200 empleados' },
  { value: '200+', label: '200+ empleados' },
];

/**
 * Opciones de referencia (cómo nos conocieron)
 */
export const referralOptions: FormSelectOption[] = [
  { value: '', label: 'Selecciona', disabled: true },
  { value: 'search', label: 'Búsqueda en Google' },
  { value: 'social', label: 'Redes sociales' },
  { value: 'referral', label: 'Recomendación' },
  { value: 'other', label: 'Otro' },
];

/**
 * Helper para obtener opciones traducidas
 * Útil cuando las opciones necesitan traducción dinámica
 */
export function getTranslatedCountryOptions(t: (key: string) => string): FormSelectOption[] {
  return countryOptions.map((option) => ({
    ...option,
    label: option.disabled ? option.label : t(`countries.${option.value}`) || option.label,
  }));
}

export function getTranslatedCompanySizeOptions(t: (key: string) => string): FormSelectOption[] {
  return companySizeOptions.map((option, index) => {
    if (index === 0) return option; // Primera opción es placeholder
    return {
      ...option,
      label: t(`form.companySizes.${option.value}`) || option.label,
    };
  });
}

export function getTranslatedReferralOptions(t: (key: string) => string): FormSelectOption[] {
  return referralOptions.map((option, index) => {
    if (index === 0) return option; // Primera opción es placeholder
    return {
      ...option,
      label: t(`form.referralOptions.${option.value}`) || option.label,
    };
  });
}
