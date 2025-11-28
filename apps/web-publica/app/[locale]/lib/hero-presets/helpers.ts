/**
 * Hero Preset Helpers
 * Funciones helper para resolver presets de Hero
 *
 * Actualizado: Noviembre 2025
 * Compatible con: Next.js 15.5.6, next-intl 4.5.6, React 19
 *
 * Mejores Prácticas:
 * - Helpers retornan datos planos (strings, objetos), NO JSX
 * - JSX se construye en componentes
 * - Manejo robusto de errores con try-catch
 * - Type-safe con TypeScript
 *
 * Referencias:
 * - https://next-intl-docs.vercel.app/docs/environments/server-client-components
 * - https://nextjs.org/docs/app/building-your-application/data-fetching/error-handling
 */

import { getTranslations } from 'next-intl/server';
import { heroPresets } from './config';
import { HeroPresetType, HeroPresetConfig } from './types';
import { defaultHeroDownloadData } from '../hero-download-data';
import { defaultTabs } from '../../components/Hero';
import type { HeroButton } from '../../components/Hero';

/**
 * Datos resueltos de un preset (sin JSX)
 * Estos datos se usan para construir las props del Hero
 * Separado de JSX para mantener helpers puros (data-only)
 */
export interface ResolvedHeroData {
  badge: string;
  title: {
    format: 'simple' | 'split';
    main: string;
    on?: string; // Para formato split
  };
  description: string;
  tabs: typeof defaultTabs | [];
  showBackground: boolean;
  buttons: {
    primary: HeroButton | null;
    secondary: HeroButton | null;
  } | null;
  downloadSection: typeof defaultHeroDownloadData | undefined;
}

/**
 * Error personalizado para presets de Hero
 */
export class HeroPresetError extends Error {
  constructor(
    message: string,
    public readonly presetType?: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'HeroPresetError';
  }
}

/**
 * Resuelve un preset de Hero y devuelve datos estructurados (sin JSX)
 *
 * @param presetType - Tipo de preset a resolver ('homepage' | 'contact' | 'audit')
 * @returns Datos resueltos para construir las props del Hero
 *
 * @throws HeroPresetError si el preset no existe o hay error en traducciones
 */
export async function resolveHeroPreset(
  presetType: HeroPresetType
): Promise<ResolvedHeroData> {
  try {
    const preset = heroPresets[presetType];

    if (!preset) {
      const availablePresets = Object.keys(heroPresets).join(', ');
      throw new HeroPresetError(
        `Hero preset "${presetType}" not found. Available presets: ${availablePresets}`,
        presetType
      );
    }

    return await resolvePresetConfig(preset);
  } catch (error) {
    // Si ya es HeroPresetError, re-lanzar
    if (error instanceof HeroPresetError) {
      throw error;
    }

    // Envolver otros errores
    throw new HeroPresetError(
      `Failed to resolve hero preset "${presetType}": ${error instanceof Error ? error.message : 'Unknown error'}`,
      presetType,
      error
    );
  }
}

/**
 * Resuelve la configuración de un preset individual
 * Función interna con manejo robusto de errores
 */
async function resolvePresetConfig(
  preset: HeroPresetConfig
): Promise<ResolvedHeroData> {
  try {
    // Resolver badge con manejo de error
    const badgeT = await getTranslations(preset.badge.namespace);
    const badge = badgeT(preset.badge.key);

    if (!badge) {
      throw new Error(
        `Badge translation missing: ${preset.badge.namespace}.${preset.badge.key}`
      );
    }

    // Resolver title según formato
    const titleT = await getTranslations(preset.title.namespace);
    const titleMain = titleT(preset.title.key);

    if (!titleMain) {
      throw new Error(
        `Title translation missing: ${preset.title.namespace}.${preset.title.key}`
      );
    }

    const title: ResolvedHeroData['title'] =
      preset.title.format === 'split'
        ? {
            format: 'split',
            main: titleMain,
            on: titleT(preset.title.keyOn || ''),
          }
        : {
            format: 'simple',
            main: titleMain,
          };

    // Resolver description con manejo de error
    const descT = await getTranslations(preset.description.namespace);
    const description = descT(preset.description.key);

    if (!description) {
      throw new Error(
        `Description translation missing: ${preset.description.namespace}.${preset.description.key}`
      );
    }

    // Resolver tabs
    const tabs = preset.tabs === 'default' ? defaultTabs : [];

    // Resolver background
    const showBackground = preset.background === true;

    // Resolver buttons con manejo de errores
    let primaryButton: HeroButton | null = null;
    let secondaryButton: HeroButton | null = null;

    if (preset.buttons) {
      if (preset.buttons.primary) {
        try {
          const buttonT = await getTranslations('hero');
          const label = buttonT(preset.buttons.primary.labelKey);

          if (!label) {
            console.warn(
              `Button label missing: hero.${preset.buttons.primary.labelKey}`
            );
          } else {
            primaryButton = {
              label,
              href: preset.buttons.primary.href,
            };
          }
        } catch (error) {
          console.error('Error resolving primary button:', error);
          // Continuar sin botón en lugar de fallar
        }
      }

      if (preset.buttons.secondary) {
        try {
          const buttonT = await getTranslations('hero');
          const label = buttonT(preset.buttons.secondary.labelKey);

          if (!label) {
            console.warn(
              `Button label missing: hero.${preset.buttons.secondary.labelKey}`
            );
          } else {
            secondaryButton = {
              label,
              href: preset.buttons.secondary.href,
            };
          }
        } catch (error) {
          console.error('Error resolving secondary button:', error);
          // Continuar sin botón en lugar de fallar
        }
      }
    }

    // Resolver downloadSection
    const downloadSection = preset.downloadSection
      ? defaultHeroDownloadData
      : undefined;

    return {
      badge,
      title,
      description,
      tabs,
      showBackground,
      buttons: {
        primary: primaryButton,
        secondary: secondaryButton,
      },
      downloadSection,
    };
  } catch (error) {
    // Envolver error con contexto
    throw new HeroPresetError(
      `Failed to resolve preset config: ${error instanceof Error ? error.message : 'Unknown error'}`,
      preset.id,
      error
    );
  }
}
