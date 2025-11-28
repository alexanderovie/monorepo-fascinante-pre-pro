'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FormInput, FormButton, FormContainer, FormCard } from './forms';

/**
 * Audit Form Section Component
 * Formulario simplificado para solicitar auditoría gratuita de visibilidad
 *
 * Refactorizado con componentes base reutilizables (Nov 2025)
 * - FormInput: Componente base (preparado para extensión futura con autocompletado)
 * - FormButton: Botón reutilizable
 * - FormContainer: Layout centrado
 * - FormCard: Card con padding optimizado
 *
 * FUTURE: Para integrar Google Places Autocomplete:
 * - Crear FormInputAutocomplete que use useController de react-hook-form
 * - Envolver FormInput interno con PlaceAutocompleteElement de Google Maps
 * - Manejar session tokens para optimizar costo
 * - Ver: /components/forms/FormInput.tsx para estructura base
 */
export default function AuditFormSection() {
  const t = useTranslations('audit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (en producción, esto iría a un API endpoint)
    // TODO: Procesar businessName con Google Places API para obtener detalles del negocio
    // const formData = new FormData(e.currentTarget);
    // const businessName = formData.get('businessName');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    // Aquí podrías agregar lógica para mostrar mensaje de éxito
  };

  return (
    <section className="relative pt-0 pb-16 md:pb-24 lg:pt-16 lg:pb-32">
      <FormContainer layout="centered" formClassName="space-y-5">
        <form onSubmit={handleSubmit} className="w-full">
          <FormCard variant="compact">
            {/* Nombre del negocio - Campo único simplificado */}
            <FormInput
              id="businessName"
              name="businessName"
              type="text"
              label={t('form.businessName')}
              placeholder="Mi Negocio S.L."
              required
              autoComplete="organization"
            />

            {/* Botón de envío */}
            <div className="flex w-full flex-col justify-end space-y-3 pt-2">
              <FormButton
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                loadingText={t('form.submitting')}
                className="w-full"
              >
                {t('form.submit')}
              </FormButton>
              <div className="text-xs text-gray-500 dark:text-neutral-500">
                {t('form.privacy')}{' '}
                <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-neutral-300">
                  {t('form.privacyLink')}
                </Link>
                {t('form.privacyNote')}
              </div>
            </div>
          </FormCard>
        </form>
      </FormContainer>
    </section>
  );
}
