'use client';

/**
 * Componente cliente para integración de Crisp Chat
 *
 * Este componente maneja la inicialización y configuración del widget de Crisp
 * de manera programática, minimizando la dependencia del dashboard.
 *
 * Características:
 * - Integración con next-intl para multi-idioma (locale recibido como prop)
 * - Configuración mediante variables de entorno
 * - Lazy loading opcional para mejor rendimiento
 * - TypeScript con tipos completos
 * - Sigue el patrón "Server-First" de Next.js 15 App Router
 *
 * @see https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/npm/
 *
 * @module components/crisp/CrispChat
 */

import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';
import { getCrispWebsiteId, getCrispConfig, validateCrispConfig } from '@/lib/crisp/config';
import type { CrispUserData, CrispSessionData } from '@/lib/crisp/types';

interface CrispChatProps {
  /** Locale actual (es/en) - Recibido desde Server Component */
  locale: string;
  /** Si es true, carga el widget de forma diferida (lazy loading) */
  lazyLoad?: boolean;
  /** Datos del usuario para enriquecer la sesión */
  userData?: CrispUserData;
  /** Datos de sesión personalizados */
  sessionData?: CrispSessionData;
  /** Si es true, oculta el widget en móviles */
  hideOnMobile?: boolean;
  /** Posición del widget: 'left' o 'right' */
  position?: 'left' | 'right';
  /** Tema de color del widget */
  colorTheme?:
    | 'default'
    | 'amber'
    | 'black'
    | 'blue'
    | 'blue_grey'
    | 'light_blue'
    | 'brown'
    | 'cyan'
    | 'green'
    | 'light_green'
    | 'grey'
    | 'indigo'
    | 'orange'
    | 'deep_orange'
    | 'pink'
    | 'purple'
    | 'deep_purple'
    | 'red'
    | 'teal';
}

/**
 * Componente CrispChat - Widget de chat integrado
 *
 * @param props - Propiedades del componente
 * @returns Componente de chat (no renderiza nada visible, solo inicializa el SDK)
 */
export default function CrispChat({
  locale,
  lazyLoad = false,
  userData,
  sessionData,
  hideOnMobile = false,
  position = 'right',
  colorTheme = 'blue',
}: CrispChatProps) {

  useEffect(() => {
    // Validar configuración
    try {
      validateCrispConfig();
    } catch (error) {
      // En desarrollo, mostrar error; en producción, silenciar
      if (process.env.NODE_ENV === 'development') {
        console.error('[CrispChat] Error de configuración:', error);
      }
      return;
    }

    const websiteId = getCrispWebsiteId();
    if (!websiteId) {
      return;
    }

    // Obtener configuración optimizada
    const config = getCrispConfig(locale, {
      autoload: !lazyLoad, // Si lazyLoad está activo, desactivar autoload
    });

    // Configurar Crisp
    Crisp.configure(websiteId, config);

    // Configuración adicional del widget
    if (hideOnMobile) {
      Crisp.setHideOnMobile(true);
    }

    if (position) {
      Crisp.setPosition(position);
    }

    if (colorTheme) {
      Crisp.setColorTheme(colorTheme);
    }

    // Enriquecer datos de usuario si están disponibles
    if (userData) {
      if (userData.email) {
        Crisp.user.setEmail(userData.email);
      }
      if (userData.nickname) {
        Crisp.user.setNickname(userData.nickname);
      }
      if (userData.phone) {
        Crisp.user.setPhone(userData.phone);
      }
      if (userData.avatar) {
        Crisp.user.setAvatar(userData.avatar);
      }
      if (userData.company) {
        // setCompany puede recibir solo el nombre o el nombre + objeto de detalles
        if (userData.company.url || userData.company.description || userData.company.employment || userData.company.geolocation) {
          Crisp.user.setCompany(userData.company.name, {
            url: userData.company.url,
            description: userData.company.description,
            employment: userData.company.employment,
            geolocation: userData.company.geolocation,
          });
        } else {
          Crisp.user.setCompany(userData.company.name);
        }
      }
    }

    // Configurar datos de sesión personalizados
    if (sessionData) {
      Crisp.session.setData(sessionData);
    }

    // Si lazyLoad está activo, no cargar automáticamente
    // El widget se cargará cuando el usuario interactúe o se llame a Crisp.load()
    if (lazyLoad) {
      // Opcional: Cargar después de un delay o interacción
      // Por ahora, se carga cuando el usuario abre el chat
    } else {
      // Cargar inmediatamente si no es lazy
      Crisp.load();
    }

    // Cleanup: No hay cleanup necesario ya que Crisp maneja su propio ciclo de vida
    // Pero podemos resetear en caso de desmontaje si es necesario
    return () => {
      // Opcional: Resetear sesión si es necesario
      // Crisp.session.reset();
    };
  }, [locale, lazyLoad, userData, sessionData, hideOnMobile, position, colorTheme]);

  // Este componente no renderiza nada visible
  // El widget de Crisp se inyecta automáticamente en el DOM
  return null;
}
