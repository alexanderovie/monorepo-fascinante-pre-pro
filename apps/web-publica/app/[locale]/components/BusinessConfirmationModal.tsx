'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

/**
 * Business Confirmation Modal
 * Modal de Preline para confirmar los datos NAP del negocio seleccionado
 *
 * Muestra:
 * - Nombre (Name)
 * - Dirección (Address)
 * - Teléfono (Phone)
 * - Website (si está disponible)
 *
 * Después de confirmar, redirige a la página de resultados
 */
export interface BusinessNAP {
  place_id: string;
  name: string;
  formatted_address?: string;
  national_phone_number?: string;
  website_uri?: string;
}

interface BusinessConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessNAP | null;
}

export default function BusinessConfirmationModal({
  isOpen,
  onClose,
  business,
}: BusinessConfirmationModalProps) {
  const router = useRouter();
  const t = useTranslations('audit.confirmation');

  // Agregar/remover clase hs-overlay-open al body para Preline
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('hs-overlay-open');
    } else {
      document.body.classList.remove('hs-overlay-open');
    }
    return () => {
      document.body.classList.remove('hs-overlay-open');
    };
  }, [isOpen]);

  const handleConfirm = () => {
    if (!business) return;
    // Redirigir a la página de resultados con el place_id como query param
    router.push(`/audit/results?placeId=${encodeURIComponent(business.place_id)}`);
  };

  if (!isOpen || !business) return null;

  return (
    <>
      {/* Backdrop - Debe ir primero para estar detrás */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity z-[59]"
        onClick={onClose}
      />

      {/* Overlay */}
      <div
        className="hs-overlay fixed inset-0 z-[60] overflow-x-hidden overflow-y-auto transition-all duration-300"
        onClick={onClose}
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-7 opacity-100 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div
            className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                {t('title') || 'Confirma tu negocio'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                aria-label="Cerrar"
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 6-12 12" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto">
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
                {t('description') || 'Por favor, confirma que estos son los datos correctos de tu negocio:'}
              </p>

              {/* NAP Information */}
              <div className="space-y-4">
                {/* Nombre */}
                <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="size-5 text-gray-500 dark:text-neutral-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                        {t('nameLabel') || 'Nombre'}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {business.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                {business.formatted_address && (
                  <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="size-5 text-gray-500 dark:text-neutral-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                          {t('addressLabel') || 'Dirección'}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {business.formatted_address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Teléfono */}
                {business.national_phone_number && (
                  <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="size-5 text-gray-500 dark:text-neutral-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                          {t('phoneLabel') || 'Teléfono'}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          <a
                            href={`tel:${business.national_phone_number}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {business.national_phone_number}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Website */}
                {business.website_uri && (
                  <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="size-5 text-gray-500 dark:text-neutral-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                          {t('websiteLabel') || 'Sitio Web'}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          <a
                            href={business.website_uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors break-all"
                          >
                            {business.website_uri}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
              >
                {t('cancel') || 'Cancelar'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {t('confirm') || 'Confirmar y continuar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
