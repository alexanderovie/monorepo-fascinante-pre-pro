'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput, FormButton, FormContainer, FormCard, FormSelect, FormWrapper } from './forms';
import { contactFormSchema, type ContactFormData } from '../lib/validations/contact-schema';
import { useToast } from '../lib/hooks/use-toast';
import {
  countryOptions,
  getTranslatedCompanySizeOptions,
  getTranslatedReferralOptions,
} from '../lib/form-options/contact-options';

/**
 * Contact Section Component
 * Formulario de contacto con layout de dos columnas
 *
 * Actualizado: Enero 2025
 * - Integración con react-hook-form + zod para validación robusta
 * - API route para procesar envíos
 * - Manejo de errores robusto y escalable
 * - Feedback visual con toasts
 * - Type-safe con TypeScript
 *
 * Basado en estándares de la industria (Nov 2025):
 * - React Hook Form: https://react-hook-form.com
 * - Zod: https://zod.dev
 * - Next.js 15 Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
export default function ContactSection() {
  const t = useTranslations('contact');
  const toast = useToast('contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur', // Validar al perder el foco
    defaultValues: {
      fullName: '',
      company: '',
      phone: '',
      email: '',
      country: undefined,
      companySize: undefined,
      referral: undefined,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Error del servidor (validación o error interno)
        const errorMessage = result.error || t('form.error') || 'Error al enviar el formulario. Por favor, intenta de nuevo.';

        // Mostrar toast de error
        // Los errores de validación del cliente ya se muestran en los campos
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
      console.error('Error submitting contact form:', error);
      toast.error('error', {
        description: t('form.errorConnection') || 'Error de conexión. Por favor, verifica tu internet e intenta de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative pt-0 pb-16 md:pb-24 lg:pt-16 lg:pb-32">
      <FormContainer layout="two-column" showGradients={true}>
        {/* Columna izquierda - Información */}
        <div className="w-full pb-10 md:space-y-10 md:pb-0 max-[480px]:hidden order-1 md:order-2 lg:order-1 md:flex md:justify-center">
          {/* Sección de beneficios - Solo visible en desktop */}
          <div className="hidden md:block">
            <div className="space-y-16 pb-20 lg:pb-0">
              <div className="space-y-6 md:text-center lg:text-left">
                <div className="mt-8 flex overflow-hidden md:justify-center lg:justify-start">
                  {/* Avatares simplificados */}
                  <div className="flex size-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <span className="text-sm font-semibold">FD</span>
                  </div>
                  <div className="-ml-4 flex size-11 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400">
                    <span className="text-sm font-semibold">CS</span>
                  </div>
                  <div className="-ml-4 flex size-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <span className="text-sm font-semibold">ES</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {t('benefits.title')}
                  </p>
                  <div className="flex items-center space-x-2.5 md:justify-center lg:justify-start">
                    <Check className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {t('benefits.presentation')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2.5 md:justify-center lg:justify-start">
                    <Check className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {t('benefits.consulting')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2.5 md:justify-center lg:justify-start">
                    <Check className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {t('benefits.answers')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Formulario */}
        <FormWrapper>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
            <FormCard variant="default">
              {/* Nombre completo */}
              <FormInput
                id="fullName"
                type="text"
                label={t('form.fullName')}
                placeholder="Juan Pérez"
                autoComplete="name"
                error={errors.fullName?.message}
                {...register('fullName')}
              />

              {/* Empresa */}
              <FormInput
                id="company"
                type="text"
                label={t('form.company')}
                placeholder="Mi Empresa S.L."
                autoComplete="organization"
                error={errors.company?.message}
                {...register('company')}
              />

              {/* Teléfono */}
              <FormInput
                id="phone"
                type="tel"
                label={t('form.phone')}
                placeholder="+1 234 567 8900"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register('phone')}
              />

              {/* Email */}
              <FormInput
                id="email"
                type="email"
                label={t('form.email')}
                placeholder="nombre@empresa.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              {/* País */}
              <FormSelect
                id="country"
                label={t('form.country')}
                options={countryOptions}
                error={errors.country?.message}
                {...register('country')}
              />

              {/* Tamaño de empresa */}
              <FormSelect
                id="companySize"
                label={t('form.companySize')}
                options={getTranslatedCompanySizeOptions(t)}
                error={errors.companySize?.message}
                {...register('companySize')}
              />

              {/* ¿Cómo nos conociste? */}
              <FormSelect
                id="referral"
                label={
                  <>
                    {t('form.referral')}{' '}
                    <span className="text-gray-500 dark:text-neutral-500 font-normal">
                      {t('form.referralOptional')}
                    </span>
                  </>
                }
                options={getTranslatedReferralOptions(t)}
                error={errors.referral?.message}
                {...register('referral')}
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
        </FormWrapper>
      </FormContainer>
    </section>
  );
}
