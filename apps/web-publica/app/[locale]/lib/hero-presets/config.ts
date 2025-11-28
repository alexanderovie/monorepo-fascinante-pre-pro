/**
 * Hero Preset Configuration
 * Configuración centralizada de presets para el componente Hero
 *
 * Actualizado: Noviembre 2025
 * Compatible con: Next.js 15.5.6, next-intl 4.5.6
 */

import { HeroPresetConfig } from './types';
import { URLS } from '../../../../lib/constants';

export const heroPresets: Record<string, HeroPresetConfig> = {
  homepage: {
    id: 'homepage',
    badge: { key: 'badge', namespace: 'hero' },
    title: {
      key: 'title',
      keyOn: 'titleOn',
      namespace: 'hero',
      format: 'split',
    },
    description: { key: 'description', namespace: 'hero' },
    tabs: 'default',
    background: true,
    buttons: {
      primary: { labelKey: 'primaryButton', href: URLS.tryItFree },
      secondary: { labelKey: 'secondaryButton', href: URLS.getDemo },
    },
    downloadSection: true,
  },
  contact: {
    id: 'contact',
    badge: { key: 'badge', namespace: 'hero.contact' },
    title: {
      key: 'title',
      namespace: 'hero.contact',
      format: 'simple',
    },
    description: { key: 'description', namespace: 'hero.contact' },
    tabs: 'none',
    background: false,
    buttons: null,
    downloadSection: false,
  },
  audit: {
    id: 'audit',
    badge: { key: 'badge', namespace: 'hero' },
    title: {
      key: 'title',
      namespace: 'hero',
      format: 'simple',
    },
    description: { key: 'description', namespace: 'hero' },
    tabs: 'none',
    background: false,
    buttons: null,
    downloadSection: false,
  },
};
