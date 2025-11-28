import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // Lista de locales soportados
  locales: ['en', 'es'],

  // Locale por defecto (usado cuando no hay match)
  defaultLocale: 'en',
});

