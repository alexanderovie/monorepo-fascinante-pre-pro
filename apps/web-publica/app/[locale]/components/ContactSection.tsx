'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

/**
 * Contact Section Component
 * Formulario de contacto con layout de dos columnas
 * Adaptado para usar inputs nativos y estilos consistentes con el sitio
 */
export default function ContactSection() {
  const t = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (en producción, esto iría a un API endpoint)
    // const formData = new FormData(e.currentTarget);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    // Aquí podrías agregar lógica para mostrar mensaje de éxito
  };

  return (
    <section className="relative pt-0 pb-16 md:py-24 lg:py-32">
      {/* Background gradients sutiles usando colores del sitio */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-20 bg-[radial-gradient(ellipse_35%_15%_at_40%_55%,rgba(37,99,235,0.1)_0%,transparent_100%)] lg:bg-[radial-gradient(ellipse_12%_20%_at_60%_45%,rgba(37,99,235,0.1)_0%,transparent_100%)]"></div>
      <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-20 bg-[radial-gradient(ellipse_35%_20%_at_70%_75%,rgba(37,99,235,0.08)_0%,transparent_80%)] lg:bg-[radial-gradient(ellipse_15%_30%_at_70%_65%,rgba(37,99,235,0.08)_0%,transparent_80%)]"></div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-[480px]:px-0 max-[480px]:max-w-full max-[480px]:w-full">
        <div className="grid w-full grid-cols-1 gap-x-8 lg:grid-cols-2 lg:gap-x-16 max-[480px]:gap-0">
          {/* Columna izquierda - Información */}
          <div className="w-full pb-10 md:space-y-10 md:pb-0 max-[480px]:hidden">
            {/* Sección de beneficios - Solo visible en desktop */}
            <div className="hidden md:block">
              <div className="space-y-16 pb-20 lg:pb-0">
                <div className="space-y-6">
                  <div className="mt-8 flex overflow-hidden">
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
                    <div className="flex items-center space-x-2.5">
                      <Check className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        {t('benefits.presentation')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        {t('benefits.consulting')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2.5">
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
          <div className="flex w-full justify-center lg:mt-2.5 max-[480px]:col-span-1 max-[480px]:w-full">
            <div className="relative flex w-full min-w-[20rem] max-w-[30rem] flex-col items-center overflow-visible md:min-w-[24rem] max-[480px]:max-w-none max-[480px]:min-w-0 max-[480px]:w-full">
              <form onSubmit={handleSubmit} className="z-10 w-full space-y-6 max-[480px]:w-full">
                <div className="w-full space-y-6 rounded-xl border border-gray-200 bg-white px-6 py-10 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 max-[480px]:border-0 max-[480px]:rounded-none max-[480px]:px-4 max-[480px]:w-full">
                  {/* Nombre completo */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="fullName">{t('form.fullName')}</label>
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Juan Pérez"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                    />
                  </div>

                  {/* Empresa */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="company">{t('form.company')}</label>
                    </div>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Mi Empresa S.L."
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="phone">{t('form.phone')}</label>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="email">{t('form.email')}</label>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nombre@empresa.com"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                    />
                  </div>

                  {/* País */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="country">{t('form.country')}</label>
                    </div>
                    <select
                      id="country"
                      name="country"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-600"
                    >
                      <option value="">{t('form.selectCountry')}</option>
                      {/* Países principales al inicio */}
                      <option value="us">Estados Unidos</option>
                      <option value="ve">Venezuela</option>
                      <option value="co">Colombia</option>
                      <option value="mx">México</option>
                      {/* Separador visual */}
                      <option disabled>──────────</option>
                      {/* Resto de países de Latinoamérica en orden alfabético */}
                      <option value="ar">Argentina</option>
                      <option value="bo">Bolivia</option>
                      <option value="br">Brasil</option>
                      <option value="cl">Chile</option>
                      <option value="cr">Costa Rica</option>
                      <option value="cu">Cuba</option>
                      <option value="do">República Dominicana</option>
                      <option value="ec">Ecuador</option>
                      <option value="sv">El Salvador</option>
                      <option value="gt">Guatemala</option>
                      <option value="hn">Honduras</option>
                      <option value="ni">Nicaragua</option>
                      <option value="pa">Panamá</option>
                      <option value="py">Paraguay</option>
                      <option value="pe">Perú</option>
                      <option value="pr">Puerto Rico</option>
                      <option value="uy">Uruguay</option>
                      {/* Otro al final */}
                      <option disabled>──────────</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  {/* Tamaño de empresa */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="companySize">{t('form.companySize')}</label>
                    </div>
                    <select
                      id="companySize"
                      name="companySize"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-600"
                    >
                      <option value="">{t('form.selectSize')}</option>
                      <option value="1-10">{t('form.companySizes.1-10')}</option>
                      <option value="11-50">{t('form.companySizes.11-50')}</option>
                      <option value="51-200">{t('form.companySizes.51-200')}</option>
                      <option value="200+">{t('form.companySizes.200+')}</option>
                    </select>
                  </div>

                  {/* ¿Cómo nos conociste? */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="referral">
                        {t('form.referral')}{' '}
                        <span className="text-gray-500 dark:text-neutral-500">{t('form.referralOptional')}</span>
                      </label>
                    </div>
                    <select
                      id="referral"
                      name="referral"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-600"
                    >
                      <option value="">{t('form.selectSize')}</option>
                      <option value="search">{t('form.referralOptions.search')}</option>
                      <option value="social">{t('form.referralOptions.social')}</option>
                      <option value="referral">{t('form.referralOptions.referral')}</option>
                      <option value="other">{t('form.referralOptions.other')}</option>
                    </select>
                  </div>

                  {/* Botón de envío */}
                  <div className="flex w-full flex-col justify-end space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      {isSubmitting ? t('form.submitting') : t('form.submit')}
                    </button>
                    <div className="text-xs text-gray-500 dark:text-neutral-500">
                      {t('form.privacy')}{' '}
                      <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-neutral-300">
                        {t('form.privacyLink')}
                      </Link>
                      {t('form.privacyNote')}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
