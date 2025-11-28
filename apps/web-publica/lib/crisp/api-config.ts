/**
 * Funciones de alto nivel para configuración programática de Crisp
 *
 * Estas funciones utilizan el cliente REST API para configurar
 * el website de Crisp sin necesidad del dashboard.
 *
 * Diseñado para ser usado desde Server Components o API Routes de Next.js 15.
 *
 * @module lib/crisp/api-config
 */

import { getCrispWebsiteId } from './config';
import {
  getWebsite,
  verifyApiConnection,
  CrispApiError,
  type CrispWebsite,
} from './api-client';

/**
 * NOTA IMPORTANTE: La configuración del chatbox NO está disponible en la REST API v1.
 *
 * La REST API de Crisp NO expone endpoints para configurar el chatbox (color, posición, textos).
 * Esta configuración solo se puede hacer desde:
 * 1. El dashboard de Crisp (https://app.crisp.chat)
 * 2. El SDK del cliente JavaScript (crisp-sdk-web) - implementado en CrispChat.tsx
 *
 * Para cambiar la configuración del chatbox programáticamente, usa el componente
 * CrispChat.tsx con props dinámicas basadas en el estado de tu aplicación.
 *
 * @deprecated Esta interfaz se mantiene solo para referencia, pero las funciones
 * que la usan no funcionan porque el endpoint no existe en la API.
 */
export interface ChatboxConfig {
  /** Color del tema del chatbox */
  color?: string;
  /** Posición del chatbox: 'left' | 'right' */
  position?: 'left' | 'right';
  /** Texto personalizado del chatbox */
  text?: {
    welcome?: string;
    offline?: string;
  };
  /** Configuración de notificaciones */
  notifications?: {
    enabled?: boolean;
    sound?: boolean;
  };
  /** Cualquier otra configuración personalizada */
  [key: string]: unknown;
}

/**
 * Obtiene la información completa del website
 *
 * @returns Información del website (nombre, dominio, logo, etc.)
 * @throws Error si no se puede obtener la información
 */
export async function getWebsiteInfo(): Promise<CrispWebsite> {
  const websiteId = getCrispWebsiteId();

  if (!websiteId) {
    throw new Error('Website ID no configurado. Agrega NEXT_PUBLIC_CRISP_WEBSITE_ID a tus variables de entorno.');
  }

  try {
    return await getWebsite(websiteId);
  } catch (error) {
    if (error instanceof CrispApiError) {
      throw new Error(`Error al obtener información del website: ${error.message}`);
    }
    throw error;
  }
}

/**
 * ⚠️ DEPRECATED: Esta función no funciona porque el endpoint no existe en la REST API v1.
 *
 * La configuración del chatbox NO está disponible en la REST API.
 * Usa el componente CrispChat.tsx con props dinámicas en su lugar.
 *
 * @deprecated Use CrispChat component props instead
 */
export async function getChatboxConfig(): Promise<ChatboxConfig> {
  throw new Error(
    'La configuración del chatbox no está disponible en la REST API v1. ' +
    'Usa el componente CrispChat.tsx con props dinámicas para cambiar la configuración.'
  );
}

/**
 * ⚠️ DEPRECATED: Esta función no funciona porque el endpoint no existe en la REST API v1.
 *
 * La configuración del chatbox NO está disponible en la REST API.
 * Usa el componente CrispChat.tsx con props dinámicas en su lugar.
 *
 * @deprecated Use CrispChat component props instead
 */
export async function updateChatboxConfig(_config: ChatboxConfig): Promise<boolean> {
  throw new Error(
    'La configuración del chatbox no está disponible en la REST API v1. ' +
    'Usa el componente CrispChat.tsx con props dinámicas para cambiar la configuración. ' +
    'Ejemplo: <CrispChat colorTheme="blue" position="right" />'
  );
}

/**
 * Verifica que la API de Crisp esté configurada y funcional
 *
 * Esta función es útil para:
 * - Verificar credenciales al iniciar la aplicación
 * - Validar configuración en scripts de setup
 * - Testing de integración
 *
 * @returns true si todo está correcto
 * @throws Error con detalles si algo falla
 */
export async function verifyCrispApiSetup(): Promise<boolean> {
  try {
    // Verificar credenciales
    await verifyApiConnection();

    // Verificar Website ID
    const websiteId = getCrispWebsiteId();
    if (!websiteId) {
      throw new Error('Website ID no configurado. Agrega NEXT_PUBLIC_CRISP_WEBSITE_ID a tus variables de entorno.');
    }

    // Intentar obtener información del website para verificar que todo funciona
    await getWebsite(websiteId);

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al verificar configuración');
  }
}
