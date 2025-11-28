/**
 * Hero Presets - Public API
 * Exporta las funciones y tipos públicos del sistema de presets
 *
 * Actualizado: Noviembre 2025
 */

export { resolveHeroPreset, HeroPresetError } from './helpers';
export type { ResolvedHeroData } from './helpers';
export { resolveToHeroProps } from './resolve-to-props';
export { heroPresets } from './config';
export type { HeroPresetType, HeroPresetConfig } from './types';
