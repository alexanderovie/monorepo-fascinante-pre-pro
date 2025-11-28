/**
 * Hero Preset Props Resolver
 * Convierte datos resueltos en props para el componente Hero
 *
 * Actualizado: Noviembre 2025
 * Compatible con: Next.js 15.5.6, next-intl 4.5.6, React 19
 *
 * Este archivo construye el JSX necesario para las props del Hero
 */

import React from 'react';
import type { HeroProps } from '../../components/Hero';
import type { ResolvedHeroData } from './helpers';

/**
 * Convierte datos resueltos de un preset en props del Hero
 *
 * @param data - Datos resueltos del preset
 * @returns Props listas para usar en el componente Hero
 */
export function resolveToHeroProps(data: ResolvedHeroData): HeroProps {
  // Construir title según formato
  let title: string | React.ReactNode;

  if (data.title.format === 'split') {
    title = (
      <>
        {data.title.main}
        <br className="hidden md:block" />
        <span className="md:hidden"> </span>
        {data.title.on || ''}
      </>
    );
  } else {
    title = data.title.main;
  }

  return {
    badge: data.badge,
    title,
    description: data.description,
    tabs: data.tabs,
    showBackground: data.showBackground,
    primaryButton: data.buttons?.primary ?? null,
    secondaryButton: data.buttons?.secondary ?? null,
    downloadSection: data.downloadSection,
  };
}
