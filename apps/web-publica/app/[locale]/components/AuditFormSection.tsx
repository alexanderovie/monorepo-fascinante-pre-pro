'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputAutocomplete, FormButton, FormContainer, FormCard } from './forms';
import { auditFormSchema, type AuditFormData } from '../lib/validations/audit-schema';
import { useToast } from '../lib/hooks/use-toast';
import BusinessConfirmationModal, { type BusinessNAP } from './BusinessConfirmationModal';

/**
 * Audit Form Section Component
 * Formulario simplificado para solicitar auditoría gratuita de visibilidad
 *
 * Actualizado: Enero 2025
 * - Integración con react-hook-form + zod para validación
 * - API route para procesar envíos
 * - Manejo de errores robusto
 * - Feedback visual al usuario
 *
 * Basado en documentación oficial:
 * - React Hook Form: https://react-hook-form.com
 * - Zod: https://zod.dev
 * - Next.js 15 Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
export default function AuditFormSection() {
  const t = useTranslations('audit');
  const toast = useToast('audit.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessNAP | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors: _errors },
    reset,
    setValue,
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    mode: 'onBlur', // Validar al perder el foco
    defaultValues: {
      businessName: '',
      placeId: undefined,
    },
  });

  const onSubmit = async (data: AuditFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Error del servidor (validación o error interno)
        const errorMessage = result.error || 'Error al enviar el formulario. Por favor, intenta de nuevo.';
        toast.error('error', {
          description: errorMessage,
        });
        return;
      }

      // Éxito
      toast.success('success');
      reset(); // Limpiar el formulario
    } catch (error) {
      // Error de red u otro error inesperado
      console.error('Error submitting audit form:', error);
      toast.error('error', {
        description: t('form.errorConnection') || 'Error de conexión. Por favor, verifica tu internet e intenta de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative pt-0 pb-16 md:pb-24 lg:pt-16 lg:pb-32">
      <FormContainer layout="centered" formClassName="space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
          <FormCard variant="compact">
            {/* Nombre del negocio - Campo único simplificado con autocompletado */}
            <FormInputAutocomplete
              control={control}
              name="businessName"
              label={t('form.businessName')}
              placeholder="Escribe el nombre de tu negocio..."
              autoComplete="organization"
              onPlaceSelect={async (place) => {
                // Guardar place_id en el formulario
                if (place.place_id) {
                  setValue('placeId', place.place_id, { shouldValidate: true });

                  // Obtener detalles completos usando Place Details (New) para mostrar en modal
                  try {
                    const response = await fetch(`/api/places/details?placeId=${place.place_id}&languageCode=es`);
                    if (response.ok) {
                      const details = await response.json();

                      // Preparar datos NAP para el modal (el API devuelve displayName, formattedAddress, etc.)
                      const businessNAP: BusinessNAP = {
                        place_id: details.place_id || details.id,
                        name: details.displayName || details.name || place.name,
                        formatted_address: details.formattedAddress || details.formatted_address,
                        national_phone_number: details.nationalPhoneNumber || details.national_phone_number,
                        website_uri: details.websiteUri || details.website_uri,
                      };

                      // Guardar y mostrar modal
                      setSelectedBusiness(businessNAP);
                      setIsModalOpen(true);
                    } else {
                      // Si falla obtener detalles, usar datos básicos del autocompletado
                      const businessNAP: BusinessNAP = {
                        place_id: place.place_id,
                        name: place.name,
                        formatted_address: place.address,
                      };
                      setSelectedBusiness(businessNAP);
                      setIsModalOpen(true);
                    }
                  } catch (error) {
                    console.error('[AuditForm] Error obteniendo detalles:', error);
                    // Usar datos básicos si falla
                    const businessNAP: BusinessNAP = {
                      place_id: place.place_id,
                      name: place.name,
                      formatted_address: place.address,
                    };
                    setSelectedBusiness(businessNAP);
                    setIsModalOpen(true);
                  }
                }
              }}
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

      {/* Modal de confirmación de negocio */}
      <BusinessConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBusiness(null);
        }}
        business={selectedBusiness}
      />
    </section>
  );
}
