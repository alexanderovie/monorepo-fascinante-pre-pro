/**
 * Hero Preset Types
 * Tipos para el sistema de configuración de Hero presets
 *
 * Actualizado: Noviembre 2025
 * Compatible con: Next.js 15.5.6, next-intl 4.5.6, React 19
 */

export type HeroPresetType = 'homepage' | 'contact' | 'audit';

export interface TranslationKey {
  key: string;
  namespace: string;
}

export interface SplitTitleConfig {
  key: string;
  keyOn: string;
  namespace: string;
  format: 'split';
}

export interface SimpleTitleConfig {
  key: string;
  namespace: string;
  format: 'simple';
}

export type TitleConfig = SplitTitleConfig | SimpleTitleConfig;

export interface ButtonConfig {
  labelKey: string;
  href: string;
}

export interface HeroPresetConfig {
  id: HeroPresetType;
  badge: TranslationKey;
  title: TitleConfig;
  description: TranslationKey;
  tabs: 'default' | 'none';
  background: boolean;
  buttons: {
    primary: ButtonConfig | null;
    secondary: ButtonConfig | null;
  } | null;
  downloadSection: boolean;
}

// ResolvedHeroData se exporta directamente desde helpers.ts
// No se re-exporta aquí para evitar dependencias circulares
