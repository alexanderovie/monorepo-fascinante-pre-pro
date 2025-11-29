/**
 * Audit Results Page
 * Página de resultados de la auditoría
 *
 * Muestra datos combinados de:
 * - Google Places API (New) - NAP básico
 * - DataForSEO - Rating, reviews, categorías, etc.
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AuditResultsSection from '../components/AuditResultsSection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('audit.results');

  return {
    title: t('title') || 'Resultados de Auditoría - Fascinante Digital',
    description: t('description') || 'Resultados completos de tu auditoría de visibilidad online',
  };
}

export default function AuditResultsPage() {
  return <AuditResultsSection />;
}
