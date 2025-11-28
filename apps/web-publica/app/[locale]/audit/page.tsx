import AuditFormSection from '../components/AuditFormSection';
import Hero from '../components/Hero';
import { resolveHeroPreset, resolveToHeroProps, HeroPresetError } from '../lib/hero-presets';
import { notFound } from 'next/navigation';

/**
 * Audit Page - Página de auditoría gratuita
 * Hero + Formulario para solicitar auditoría de visibilidad en Google
 *
 * Layout igual que Contact Page: Hero (sin background, sin botones) + FormSection
 *
 * Manejo robusto de errores según mejores prácticas Next.js 15:
 * - Try-catch para errores de preset
 * - notFound() para errores de configuración
 */
export default async function AuditPage() {
  try {
    const heroData = await resolveHeroPreset('audit');
    const heroProps = resolveToHeroProps(heroData);

    return (
      <>
        <Hero {...heroProps} />
        <AuditFormSection />
      </>
    );
  } catch (error) {
    // Log error en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('Error resolving hero preset for audit page:', error);
    }

    // Si es un error de preset (configuración), mostrar 404
    if (error instanceof HeroPresetError) {
      notFound();
    }

    // Re-lanzar otros errores para que Next.js los maneje
    throw error;
  }
}
