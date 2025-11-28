'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

/**
 * Audit Form Section Component
 * Formulario para solicitar auditoría gratuita de visibilidad
 * Más simple y enfocado que el formulario de contacto
 */
export default function AuditFormSection() {
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
    <section className="relative py-16 md:py-24 lg:py-32">
      {/* Background gradients sutiles usando colores del sitio */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-20 bg-[radial-gradient(ellipse_35%_15%_at_40%_55%,rgba(37,99,235,0.1)_0%,transparent_100%)] lg:bg-[radial-gradient(ellipse_12%_20%_at_60%_45%,rgba(37,99,235,0.1)_0%,transparent_100%)]"></div>
      <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-20 bg-[radial-gradient(ellipse_35%_20%_at_70%_75%,rgba(37,99,235,0.08)_0%,transparent_80%)] lg:bg-[radial-gradient(ellipse_15%_30%_at_70%_65%,rgba(37,99,235,0.08)_0%,transparent_80%)]"></div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 gap-x-8 lg:grid-cols-2 lg:gap-x-16">
          {/* Columna izquierda - Información */}
          <div className="w-full pb-10 md:space-y-10 md:pb-0">
            <div className="space-y-4 md:max-w-[40rem]">
              <h1 className="text-4xl font-semibold text-gray-800 dark:text-white sm:text-5xl lg:text-6xl">
                Obtén tu auditoría gratuita
              </h1>
              <div className="text-base text-gray-600 dark:text-neutral-400 md:text-lg lg:leading-7">
                Antes de gastar en anuncios, descubre si tu negocio está listo para atraer clientes reales.
                Fascinante Digital te ofrece una auditoría gratuita que muestra cómo apareces en Google y qué te falta.
              </div>
            </div>

            {/* Sección de beneficios - Solo visible en desktop */}
            <div className="hidden md:block">
              <div className="space-y-16 pb-20 lg:pb-0">
                <div className="space-y-6">
                  <div className="mt-16 flex overflow-hidden">
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
                      Lo que recibirás:
                    </p>
                    <div className="flex items-center space-x-2.5">
                      <Check className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        Análisis completo de tu visibilidad en Google
                      </p>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        Identificación de información faltante en tu perfil
                      </p>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        Recomendaciones personalizadas para mejorar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="flex w-full justify-center lg:mt-2.5">
            <div className="relative flex w-full min-w-[20rem] max-w-[30rem] flex-col items-center overflow-visible md:min-w-[24rem]">
              <form onSubmit={handleSubmit} className="z-10 w-full space-y-6">
                <div className="w-full space-y-6 rounded-xl border border-gray-200 bg-white px-6 py-10 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                  {/* Nombre completo */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="fullName">Nombre completo</label>
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Juan Pérez"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="email">Email</label>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nombre@empresa.com"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="phone">Número de teléfono</label>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>

                  {/* Nombre del negocio */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="businessName">Nombre del negocio</label>
                    </div>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="Mi Negocio S.L."
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                    />
                  </div>

                  {/* País */}
                  <div>
                    <div className="mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      <label htmlFor="country">País</label>
                    </div>
                    <select
                      id="country"
                      name="country"
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-600"
                      required
                    >
                      <option value="">Selecciona un país</option>
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

                  {/* Botón de envío */}
                  <div className="flex w-full flex-col justify-end space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      {isSubmitting ? 'Enviando...' : 'Obtener auditoría gratuita'}
                    </button>
                    <div className="text-xs text-gray-500 dark:text-neutral-500">
                      Al enviar este formulario, aceptas nuestra{' '}
                      <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-neutral-300">
                        política de privacidad
                      </Link>
                      . Tu información está segura y no será compartida.
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
