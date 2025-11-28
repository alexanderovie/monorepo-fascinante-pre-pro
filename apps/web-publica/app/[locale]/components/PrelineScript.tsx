'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Preline UI
async function loadPreline() {
  return import('preline/dist/index.js');
}

// Vanilla Calendar Pro (requerido para Advanced Datepicker)
async function loadVanillaCalendar() {
  // Verificar si lodash está disponible (requerido por vanilla-calendar-pro)
  if (typeof window !== 'undefined' && !window._) {
    try {
      // Cargar lodash primero
      await import('lodash');
      // Cargar vanilla-calendar-pro
      await import('vanilla-calendar-pro');
    } catch (error) {
      console.warn('Error loading Vanilla Calendar Pro:', error);
    }
  }
}

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    const initPreline = async () => {
      // Cargar Vanilla Calendar Pro antes de Preline
      await loadVanillaCalendar();
      // Cargar Preline UI
      await loadPreline();
    };

    initPreline();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [path]);

  return null;
}
