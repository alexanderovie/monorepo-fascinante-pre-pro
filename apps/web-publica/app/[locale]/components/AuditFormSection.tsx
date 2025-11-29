'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput, FormButton, FormContainer, FormCard } from './forms';
import { auditFormSchema, type AuditFormData } from '../lib/validations/audit-schema';
import { useToast } from '../lib/hooks/use-toast';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    mode: 'onBlur', // Validar al perder el foco
    defaultValues: {
      businessName: '',
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
            {/* Nombre del negocio - Campo único simplificado */}
            <FormInput
              id="businessName"
              type="text"
              label={t('form.businessName')}
              placeholder="Mi Negocio S.L."
              autoComplete="organization"
              error={errors.businessName?.message}
              {...register('businessName')}
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
