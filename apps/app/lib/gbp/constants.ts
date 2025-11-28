/**
 * Google Business Profile Constants
 *
 * ÉLITE: Constantes centralizadas para valores por defecto y configuración.
 * Preparado para i18n - todos los textos deben ser reemplazados por traducciones.
 *
 * Características:
 * - Sin hardcodeo de datos
 * - Valores por defecto escalables
 * - Preparado para internacionalización
 * - Reutilizable en toda la aplicación
 */

/**
 * Valores por defecto para campos de ubicación
 * ÉLITE: Estos valores se usan cuando la API no devuelve datos
 * Preparado para i18n - usar claves de traducción en el futuro
 */
export const LOCATION_DEFAULTS = {
  // Textos (preparados para i18n)
  UNNAMED_LOCATION: 'Unnamed Location',
  NO_CATEGORY: 'No Category',
  NO_DATE: 'N/A',

  // Valores numéricos
  DEFAULT_PROGRESS_SCORE: 0,
  DEFAULT_PROGRESS_TOTAL: 5,
  DEFAULT_HEALTH_SCORE: 0,

  // Estados
  DEFAULT_STATUS: 'Active' as const,
} as const

/**
 * Configuración de la tabla de ubicaciones
 */
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_SORT_FIELD: 'name' as const,
  DEFAULT_SORT_DIRECTION: 'asc' as const,
} as const

/**
 * Mensajes de estado (preparados para i18n)
 */
export const EMPTY_STATE_MESSAGES = {
  NO_LOCATIONS: 'No locations found',
  NO_LOCATIONS_DESCRIPTION: 'Connect your Google Business Profile account to see your locations here.',
  LOADING: 'Loading locations...',
  ERROR: 'Failed to load locations',
  ERROR_DESCRIPTION: 'Please try again later or contact support if the problem persists.',
} as const

/**
 * Mensajes para Account Selector (preparados para i18n)
 */
export const ACCOUNT_SELECTOR_MESSAGES = {
  LABEL: 'Select Account',
  LOADING: 'Loading...',
  ERROR: 'Failed to load account',
  RETRY: 'Retry',
  NO_ACCOUNTS: 'No accounts available',
} as const
