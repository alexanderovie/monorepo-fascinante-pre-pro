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
 * - TypeScript con tipos completos del SDK oficial
 * - Manejo robusto de errores
 * - Sigue el patrón "Server-First" de Next.js 15 App Router
 *
 * @see https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/npm/
 *
 * @module components/crisp/CrispChat
 */

import { useEffect, useRef } from 'react';
import { Crisp, ChatboxPosition, ChatboxColors } from 'crisp-sdk-web';
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
  /** Posición del widget usando enum del SDK */
  position?: ChatboxPosition;
  /** Tema de color del widget usando enum del SDK */
  colorTheme?: ChatboxColors;
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
  position = ChatboxPosition.Right,
  colorTheme = ChatboxColors.Blue,
}: CrispChatProps) {
  // Ref para evitar múltiples inicializaciones
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevenir múltiples inicializaciones
    if (isInitialized.current) {
      return;
    }

    // Validar configuración
    let websiteId: string | null = null;
    try {
      validateCrispConfig();
      websiteId = getCrispWebsiteId();
    } catch (error) {
      // En desarrollo, mostrar error; en producción, silenciar
      if (process.env.NODE_ENV === 'development') {
        console.error('[CrispChat] Error de configuración:', error);
      }
      return;
    }

    if (!websiteId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[CrispChat] Website ID no configurado');
      }
      return;
    }

    try {
      // Obtener configuración optimizada
      const config = getCrispConfig(locale, {
        autoload: !lazyLoad, // Si lazyLoad está activo, desactivar autoload
      });

      // Configurar Crisp
      Crisp.configure(websiteId, config);

      // Configuración adicional del widget con manejo de errores
      try {
        if (hideOnMobile) {
          Crisp.setHideOnMobile(true);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[CrispChat] Error al configurar hideOnMobile:', error);
        }
      }

      try {
        Crisp.setPosition(position);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[CrispChat] Error al configurar posición:', error);
        }
      }

      try {
        Crisp.setColorTheme(colorTheme);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[CrispChat] Error al configurar tema de color:', error);
        }
      }

      // Enriquecer datos de usuario si están disponibles
      if (userData) {
        try {
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
            // setCompany requiere siempre 2 argumentos: nombre y objeto de detalles (puede ser vacío)
            const companyDetails: {
              url?: string;
              description?: string;
              employment?: { title: string };
              geolocation?: { city: string; country: string };
            } = {};

            if (userData.company.url) companyDetails.url = userData.company.url;
            if (userData.company.description) companyDetails.description = userData.company.description;
            if (userData.company.employment) companyDetails.employment = userData.company.employment;
            if (userData.company.geolocation) companyDetails.geolocation = userData.company.geolocation;

            Crisp.user.setCompany(userData.company.name, companyDetails);
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[CrispChat] Error al enriquecer datos de usuario:', error);
          }
        }
      }

      // Configurar datos de sesión personalizados
      if (sessionData) {
        try {
          Crisp.session.setData(sessionData);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[CrispChat] Error al configurar datos de sesión:', error);
          }
        }
      }

      // Si lazyLoad está activo, no cargar automáticamente
      // El widget se cargará cuando el usuario interactúe o se llame a Crisp.load()
      if (!lazyLoad) {
        try {
          // Cargar inmediatamente si no es lazy
          Crisp.load();
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[CrispChat] Error al cargar widget:', error);
          }
        }
      }

      // Marcar como inicializado
      isInitialized.current = true;
    } catch (error) {
      // Error general en la inicialización
      if (process.env.NODE_ENV === 'development') {
        console.error('[CrispChat] Error en la inicialización:', error);
      }
      return;
    }

    // Cleanup: No hay cleanup necesario ya que Crisp maneja su propio ciclo de vida
    // El widget persiste entre re-renders del componente
    return () => {
      // Opcional: Resetear sesión si es necesario en el futuro
      // Crisp.session.reset();
    };
  }, [locale, lazyLoad, userData, sessionData, hideOnMobile, position, colorTheme]);

  // Este componente no renderiza nada visible
  // El widget de Crisp se inyecta automáticamente en el DOM
  return null;
}
