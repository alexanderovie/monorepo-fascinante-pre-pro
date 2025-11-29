/**
 * useToast Hook
 * Hook personalizado que integra Sonner con next-intl para toasts internacionalizados
 *
 * Basado en estándares de la industria (Enero 2025)
 * - Integración con next-intl para traducciones
 * - Type-safe con TypeScript
 * - API simple y consistente
 * - Escalable para futuras extensiones
 *
 * @example
 * ```tsx
 * const toast = useToast();
 * toast.success('form.success');
 * toast.error('form.error');
 * ```
 */

'use client';

import { toast as sonnerToast } from 'sonner';
import { useTranslations } from 'next-intl';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface UseToastReturn {
  /**
   * Muestra un toast de éxito
   * @param messageKey - Clave de traducción (namespace opcional)
   * @param options - Opciones adicionales de Sonner
   */
  success: (messageKey: string, options?: Parameters<typeof sonnerToast.success>[1]) => void;

  /**
   * Muestra un toast de error
   * @param messageKey - Clave de traducción (namespace opcional)
   * @param options - Opciones adicionales de Sonner
   */
  error: (messageKey: string, options?: Parameters<typeof sonnerToast.error>[1]) => void;

  /**
   * Muestra un toast informativo
   * @param messageKey - Clave de traducción (namespace opcional)
   * @param options - Opciones adicionales de Sonner
   */
  info: (messageKey: string, options?: Parameters<typeof sonnerToast.info>[1]) => void;

  /**
   * Muestra un toast de advertencia
   * @param messageKey - Clave de traducción (namespace opcional)
   * @param options - Opciones adicionales de Sonner
   */
  warning: (messageKey: string, options?: Parameters<typeof sonnerToast.warning>[1]) => void;

  /**
   * Muestra un toast personalizado
   * @param messageKey - Clave de traducción (namespace opcional)
   * @param type - Tipo de toast
   * @param options - Opciones adicionales de Sonner
   */
  toast: (messageKey: string, type: ToastType, options?: Parameters<typeof sonnerToast.custom>[1]) => void;
}

/**
 * Hook personalizado para mostrar toasts internacionalizados
 *
 * Automáticamente resuelve las traducciones usando next-intl
 * y las muestra usando Sonner
 *
 * @param namespace - Namespace opcional para las traducciones (default: 'common')
 * @returns Objeto con métodos para mostrar toasts
 */
export function useToast(namespace: string = 'common'): UseToastReturn {
  const t = useTranslations(namespace);

  /**
   * Resuelve la clave de traducción
   * Soporta formato "namespace.key" o solo "key" (usa namespace por defecto)
   *
   * NOTA: Si necesitas usar otro namespace, pásalo directamente al hook:
   * const toast = useToast('audit.form');
   */
  const resolveMessage = (messageKey: string): string => {
    // Si la clave contiene un punto, intenta resolverla como "namespace.key"
    // pero solo si el namespace actual no la resuelve
    if (messageKey.includes('.')) {
      const [ns, key] = messageKey.split('.', 2);
      // Si el namespace coincide, usa la clave directamente
      if (ns === namespace) {
        return t(key);
      }
      // Si no, intenta con el namespace completo
      try {
        return t(messageKey);
      } catch {
        // Si falla, devuelve la clave como está (fallback)
        return messageKey;
      }
    }
    // Si no tiene punto, usa el namespace por defecto
    return t(messageKey);
  };

  return {
    success: (messageKey: string, options?) => {
      sonnerToast.success(resolveMessage(messageKey), options);
    },
    error: (messageKey: string, options?) => {
      sonnerToast.error(resolveMessage(messageKey), options);
    },
    info: (messageKey: string, options?) => {
      sonnerToast.info(resolveMessage(messageKey), options);
    },
    warning: (messageKey: string, options?) => {
      sonnerToast.warning(resolveMessage(messageKey), options);
    },
    toast: (messageKey: string, type: ToastType, options?) => {
      const message = resolveMessage(messageKey);
      switch (type) {
        case 'success':
          sonnerToast.success(message, options);
          break;
        case 'error':
          sonnerToast.error(message, options);
          break;
        case 'info':
          sonnerToast.info(message, options);
          break;
        case 'warning':
          sonnerToast.warning(message, options);
          break;
      }
    },
  };
}
