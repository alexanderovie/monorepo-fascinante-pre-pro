'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput, FormTextarea } from './forms';
import { contactFormSchemaV2, type ContactFormDataV2 } from '../lib/validations/contact-schema-v2';
import { useToast } from '../lib/hooks/use-toast';
import ContactInfoBlocks from './ContactInfoBlocks';

/**
 * Contact Section Component
 * Formulario de contacto con layout de dos columnas (diseño simplificado)
 *
 * Actualizado: Noviembre 2025
 * - Diseño basado en Preline UI
 * - Formulario simplificado con firstName, lastName, email, phone, message
 * - Sección de información de contacto a la derecha
 * - Integración con react-hook-form + zod para validación robusta
 * - API route para procesar envíos
 * - Manejo de errores robusto y escalable
 * - Feedback visual con toasts
 * - Type-safe con TypeScript
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
  } = useForm<ContactFormDataV2>({
    resolver: zodResolver(contactFormSchemaV2),
    mode: 'onBlur', // Validar al perder el foco
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormDataV2) => {
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
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl lg:max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            {t('title')}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            {t('description')}
          </p>
        </div>

        {/* Grid: Formulario + Información */}
        <div className="mt-12 grid items-center lg:grid-cols-2 gap-6 lg:gap-16">
          {/* Card - Formulario */}
          <div className="flex flex-col border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
            <h2 className="mb-8 text-xl font-semibold text-gray-800 dark:text-neutral-200">
              {t('form.title')}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
              <div className="grid gap-4">
                {/* Grid: First Name + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="sr-only">
                      {t('form.firstName')}
                    </label>
                    <FormInput
                      id="firstName"
                      type="text"
                      placeholder={t('form.firstName')}
                      autoComplete="given-name"
                      error={errors.firstName?.message}
                      className="py-2.5 sm:py-3 px-4 dark:text-neutral-400"
                      {...register('firstName')}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="sr-only">
                      {t('form.lastName')}
                    </label>
                    <FormInput
                      id="lastName"
                      type="text"
                      placeholder={t('form.lastName')}
                      autoComplete="family-name"
                      error={errors.lastName?.message}
                      className="py-2.5 sm:py-3 px-4 dark:text-neutral-400"
                      {...register('lastName')}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="sr-only">
                    {t('form.email')}
                  </label>
                  <FormInput
                    id="email"
                    type="email"
                    placeholder={t('form.email')}
                    autoComplete="email"
                    error={errors.email?.message}
                    className="py-2.5 sm:py-3 px-4 dark:text-neutral-400"
                    {...register('email')}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="sr-only">
                    {t('form.phone')}
                  </label>
                  <FormInput
                    id="phone"
                    type="text"
                    placeholder={t('form.phone')}
                    autoComplete="tel"
                    error={errors.phone?.message}
                    className="py-2.5 sm:py-3 px-4 dark:text-neutral-400"
                    {...register('phone')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="sr-only">
                    {t('form.message')}
                  </label>
                  <FormTextarea
                    id="message"
                    rows={4}
                    placeholder={t('form.message')}
                    error={errors.message?.message}
                    className="py-2.5 sm:py-3 px-4 dark:text-neutral-400"
                    {...register('message')}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 grid">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? t('form.submitting') : t('form.submit')}
                </button>
              </div>

              {/* Footer Text */}
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500 dark:text-neutral-500">
                  {t('form.footer')}
                </p>
              </div>
            </form>
          </div>
          {/* End Card */}

          {/* Información de Contacto */}
          <ContactInfoBlocks />
        </div>
      </div>
    </div>
  );
}
