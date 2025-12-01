/**
 * Toaster Component
 * Componente wrapper para Sonner Toaster con configuración optimizada
 *
 * Basado en estándares de la industria (Enero 2025)
 * - Configuración consistente en toda la app
 * - Optimizado para UX (posición, duración, etc.)
 * - Accesible y responsive
 * - Compatible con Preline UI y dark mode
 */

'use client';

import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toaster Component
 *
 * Configuración recomendada para proyectos elite:
 * - position: bottom-right (estándar de la industria)
 * - richColors: Colores más vibrantes y claros
 * - closeButton: Permite cerrar manualmente
 * - duration: 4 segundos (balance entre UX y no ser intrusivo)
 * - expand: Mostrar mensajes largos completamente
 * - toastOptions: Estilos consistentes con Preline/Tailwind
 */
export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      expand={true}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-neutral-800 dark:group-[.toaster]:text-neutral-50 dark:group-[.toaster]:border-neutral-700',
          description: 'group-[.toast]:text-gray-500 dark:group-[.toast]:text-neutral-400',
          actionButton:
            'group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50 dark:group-[.toast]:bg-gray-50 dark:group-[.toast]:text-gray-900',
          cancelButton:
            'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 dark:group-[.toast]:bg-neutral-700 dark:group-[.toast]:text-neutral-400',
        },
      }}
    />
  );
}

