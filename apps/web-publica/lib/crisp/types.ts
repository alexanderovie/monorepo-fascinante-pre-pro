/**
 * Tipos TypeScript para integración con Crisp Chat SDK
 *
 * Estos tipos complementan los tipos del paquete crisp-sdk-web
 * para una mejor experiencia de desarrollo con TypeScript.
 *
 * @module lib/crisp/types
 */

/**
 * Datos de usuario para enriquecer la sesión de Crisp
 */
export interface CrispUserData {
  /** Email del usuario */
  email?: string;
  /** Nombre o nickname del usuario */
  nickname?: string;
  /** Teléfono del usuario */
  phone?: string;
  /** URL del avatar del usuario */
  avatar?: string;
  /** Información de la compañía del usuario */
  company?: {
    name: string;
    url?: string;
    description?: string;
    employment?: {
      title: string;
    };
    geolocation?: {
      city: string;
      country: string;
    };
  };
}

/**
 * Datos de sesión personalizados para Crisp
 */
export interface CrispSessionData {
  /** ID de usuario en tu sistema */
  user_id?: string;
  /** Plan del usuario (free, pro, etc.) */
  plan?: string;
  /** Cualquier dato personalizado adicional */
  [key: string]: string | number | boolean | undefined;
}

/**
 * Eventos personalizados que se pueden enviar a Crisp
 */
export type CrispEventName =
  | 'signup'
  | 'purchase'
  | 'page_view'
  | 'button_click'
  | 'form_submit'
  | string; // Permite eventos personalizados

/**
 * Parámetros opcionales para eventos de Crisp
 */
export interface CrispEventParams {
  [key: string]: string | number | boolean;
}
