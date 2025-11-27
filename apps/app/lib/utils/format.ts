/**
 * Utilidades para formateo de números
 * Garantiza consistencia entre servidor y cliente para evitar errores de hidratación
 */

/**
 * Formatea un número con separadores de miles usando locale español
 * Garantiza consistencia entre servidor y cliente
 *
 * @param value - Número a formatear
 * @returns String formateado (ej: "15.420" para 15420)
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('es-ES')
}
