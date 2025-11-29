'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import ExternalImage from '../../components/ExternalImage';

// Importar ApexCharts dinámicamente para evitar problemas de SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * Helper functions para validación robusta y escalable
 * Estas funciones previenen errores en runtime y hacen el código más mantenible
 */

/**
 * Valida y formatea un número de rating de forma segura
 * @param value - Valor numérico que puede ser null, undefined o number
 * @param decimals - Número de decimales (default: 1)
 * @returns String formateado o null si el valor no es válido
 */
function formatRating(value: number | null | undefined, decimals: number = 1): string | null {
  if (value === null || value === undefined || typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return null;
  }
  return value.toFixed(decimals);
}

/**
 * Valida que un valor sea un número válido
 * @param value - Valor a validar
 * @returns true si es un número válido, false en caso contrario
 */
function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Extrae un string de forma segura de un valor desconocido
 * @param value - Valor a extraer
 * @param fallback - Valor por defecto si no es válido
 * @returns String válido
 */
function safeString(value: unknown, fallback: string = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return fallback;
  }
  return String(value);
}

/**
 * Extrae un número de forma segura de un objeto con rating
 * @param rating - Objeto que puede contener rating
 * @returns Número válido o null
 */
function safeRatingValue(rating: unknown): number | null {
  if (!rating || typeof rating !== 'object') {
    return null;
  }
  const ratingObj = rating as { value?: unknown };
  if (isValidNumber(ratingObj.value)) {
    return ratingObj.value;
  }
  return null;
}

/**
 * Extrae votes_count de forma segura
 * @param rating - Objeto que puede contener rating
 * @returns Número válido o null
 */
function safeVotesCount(rating: unknown): number | null {
  if (!rating || typeof rating !== 'object') {
    return null;
  }
  const ratingObj = rating as { votes_count?: unknown };
  if (isValidNumber(ratingObj.votes_count)) {
    return ratingObj.votes_count;
  }
  return null;
}

/**
 * Audit Results Section
 *
 * Muestra resultados combinados de:
 * - Google Places API (New) - NAP
 * - DataForSEO - Rating, reviews, categorías, etc.
 *
 * Características:
 * - Validación robusta de todos los datos
 * - Manejo de errores completo
 * - Código escalable y mantenible
 */
export default function AuditResultsSection() {
  const t = useTranslations('audit.results');
  const router = useRouter();
  const searchParams = useSearchParams();
  const placeId = searchParams.get('placeId');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [googlePlacesData, setGooglePlacesData] = useState<Record<string, unknown> | null>(null);
  const [_googlePlacesError, setGooglePlacesError] = useState<string | null>(null);
  const [dataForSEOData, setDataForSEOData] = useState<{
    placeId: string;
    rawData?: {
      items?: Array<{
        title?: string;
        category?: string;
        rating?: { value?: number; votes_count?: number };
        description?: string;
        logo?: string;
        main_image?: string;
        work_time?: {
          work_hours?: {
            current_status?: string;
            timetable?: Record<string, unknown>;
          };
        };
        is_claimed?: boolean;
        people_also_search?: Array<{
          title?: string;
          rating?: { value?: number; votes_count?: number };
        }>;
      }>;
    };
    item?: {
      title?: string;
      category?: string;
      rating?: { value?: number; votes_count?: number };
      description?: string;
      logo?: string;
      main_image?: string;
      work_time?: {
        work_hours?: {
          current_status?: string;
          timetable?: Record<string, unknown>;
        };
      };
      is_claimed?: boolean;
      people_also_search?: Array<{
        title?: string;
        rating?: { value?: number; votes_count?: number };
      }>;
    };
  } | null>(null);
  const [_dataForSEOError, setDataForSEOError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) {
      setError('No se proporcionó un ID de negocio válido');
      setIsLoading(false);
      return;
    }

    const fetchAuditData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Obtener datos de Google Places API (New)
        try {
          const placesResponse = await fetch(`/api/places/details?placeId=${placeId}&languageCode=es`);
          if (placesResponse.ok) {
            const placesData = await placesResponse.json();
            setGooglePlacesData(placesData);
            setGooglePlacesError(null);
          } else {
            const errorData = await placesResponse.json().catch(() => ({ error: 'Unknown error' }));
            setGooglePlacesError(`HTTP ${placesResponse.status}: ${JSON.stringify(errorData, null, 2)}`);
            setGooglePlacesData(null);
          }
        } catch (placesErr) {
          console.error('[AuditResults] Error obteniendo datos de Google Places:', placesErr);
          setGooglePlacesError(placesErr instanceof Error ? placesErr.message : 'Error desconocido');
          setGooglePlacesData(null);
        }

        // 2. Obtener datos de DataForSEO (desde API route del servidor)
        try {
          const dataForSEOResponse = await fetch(
            `/api/audit/dataforseo?placeId=${placeId}&locationCode=2840&languageCode=en`
          );
          if (dataForSEOResponse.ok) {
            const dataForSEOInfo = await dataForSEOResponse.json();
            setDataForSEOData(dataForSEOInfo);
            setDataForSEOError(null);
          } else {
            const errorData = await dataForSEOResponse.json().catch(() => ({ error: 'Unknown error' }));
            setDataForSEOError(`HTTP ${dataForSEOResponse.status}: ${JSON.stringify(errorData, null, 2)}`);
            setDataForSEOData(null);
          }
        } catch (dataForSEOErr) {
          console.error('[AuditResults] Error obteniendo datos de DataForSEO:', dataForSEOErr);
          setDataForSEOError(dataForSEOErr instanceof Error ? dataForSEOErr.message : 'Error desconocido');
          setDataForSEOData(null);
        }
      } catch (err) {
        console.error('[AuditResults] Error general:', err);
        setError('Error al obtener los datos de auditoría. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditData();
  }, [placeId]);

  if (isLoading) {
    return (
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-neutral-400">
              {t('loading') || 'Cargando resultados de auditoría...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <svg
                className="size-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
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
                <path d="m12 8 0 4" />
                <path d="m12 16 0.01 0" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  {t('errorTitle') || 'Error'}
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
                <button
                  onClick={() => router.push('/audit')}
                  className="mt-4 text-sm font-medium text-red-800 dark:text-red-200 hover:underline"
                >
                  {t('backToAudit') || 'Volver a solicitar auditoría'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Extraer datos para facilitar el acceso
  const businessName =
    (typeof googlePlacesData?.displayName === 'string' ? googlePlacesData.displayName : undefined) ||
    (typeof googlePlacesData?.name === 'string' ? googlePlacesData.name : undefined) ||
    (typeof dataForSEOData?.item?.title === 'string' ? dataForSEOData.item.title : undefined) ||
    (typeof dataForSEOData?.rawData?.items?.[0]?.title === 'string' ? dataForSEOData.rawData.items[0].title : undefined) ||
    'Negocio Desconocido';
  const businessAddress =
    (typeof googlePlacesData?.formattedAddress === 'string' ? googlePlacesData.formattedAddress : undefined) ||
    (typeof googlePlacesData?.formatted_address === 'string' ? googlePlacesData.formatted_address : undefined);
  const businessPhone =
    (typeof googlePlacesData?.nationalPhoneNumber === 'string' ? googlePlacesData.nationalPhoneNumber : undefined) ||
    (typeof googlePlacesData?.national_phone_number === 'string' ? googlePlacesData.national_phone_number : undefined);
  const businessWebsite: string | undefined =
    (typeof googlePlacesData?.websiteUri === 'string' ? googlePlacesData.websiteUri : undefined) ||
    (typeof googlePlacesData?.website_uri === 'string' ? googlePlacesData.website_uri : undefined);

  // Datos de DataForSEO (usar item directamente si está disponible, sino usar rawData.items[0])
  const dataForSEOItem = dataForSEOData?.item || dataForSEOData?.rawData?.items?.[0];
  const rating = dataForSEOItem && typeof dataForSEOItem === 'object' && 'rating' in dataForSEOItem
    ? (dataForSEOItem.rating as { value?: number; votes_count?: number })?.value
    : undefined;
  const reviewsCount = dataForSEOItem && typeof dataForSEOItem === 'object' && 'rating' in dataForSEOItem
    ? (dataForSEOItem.rating as { value?: number; votes_count?: number })?.votes_count
    : undefined;
  const category = dataForSEOItem && typeof dataForSEOItem === 'object' && 'category' in dataForSEOItem
    ? String(dataForSEOItem.category)
    : undefined;
  const description: string | undefined = dataForSEOItem && typeof dataForSEOItem === 'object' && 'description' in dataForSEOItem
    ? (typeof dataForSEOItem.description === 'string' ? dataForSEOItem.description : String(dataForSEOItem.description))
    : undefined;
  const logo = dataForSEOItem && typeof dataForSEOItem === 'object' && 'logo' in dataForSEOItem
    ? String(dataForSEOItem.logo)
    : undefined;
  const mainImage = dataForSEOItem && typeof dataForSEOItem === 'object' && 'main_image' in dataForSEOItem
    ? String(dataForSEOItem.main_image)
    : undefined;
  const workHours = dataForSEOItem && typeof dataForSEOItem === 'object' && 'work_time' in dataForSEOItem
    ? (dataForSEOItem.work_time as { work_hours?: { current_status?: string; timetable?: Record<string, unknown> } })?.work_hours
    : undefined;
  const isClaimed = dataForSEOItem && typeof dataForSEOItem === 'object' && 'is_claimed' in dataForSEOItem
    ? Boolean(dataForSEOItem.is_claimed)
    : undefined;
  const competitors = dataForSEOItem && typeof dataForSEOItem === 'object' && 'people_also_search' in dataForSEOItem
    ? (Array.isArray(dataForSEOItem.people_also_search) ? dataForSEOItem.people_also_search : [])
    : [];

  return (
    <section className="relative py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-x-2 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500 mb-4">
            <svg
              className="shrink-0 size-3.5"
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Auditoría completada
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title') || 'Resultados de Auditoría'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-3xl mx-auto">
            {t('subtitle') || 'Análisis completo de tu visibilidad online'}
          </p>
        </div>

        {/* Business Overview Card */}
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo/Image */}
            {(logo || mainImage) && (
              <div className="flex-shrink-0">
                <ExternalImage
                  src={mainImage || logo || ''}
                  alt={`${businessName} - Logo`}
                  width={120}
                  height={120}
                  className="rounded-lg"
                  objectFit="cover"
                />
              </div>
            )}

            {/* Business Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {businessName}
                  </h2>
                  {category && (
                    <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-4">
                      {category}
                    </p>
                  )}
                </div>
                {isClaimed && (
                  <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                    <svg
                      className="shrink-0 size-3.5"
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
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Verificado
                  </span>
                )}
              </div>

              {/* NAP Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessAddress && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="shrink-0 size-5 text-gray-400 dark:text-neutral-500 mt-0.5"
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
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                        Dirección
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">{businessAddress}</p>
                    </div>
                  </div>
                )}

                {businessPhone && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="shrink-0 size-5 text-gray-400 dark:text-neutral-500 mt-0.5"
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
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                        Teléfono
                      </p>
                      <a
                        href={`tel:${businessPhone}`}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        {businessPhone}
                      </a>
                    </div>
                  </div>
                )}

                {businessWebsite && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <svg
                      className="shrink-0 size-5 text-gray-400 dark:text-neutral-500 mt-0.5"
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
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                        Sitio Web
                      </p>
                      <a
                        href={businessWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors break-all"
                      >
                        {businessWebsite}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid - Preline Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Rating Card - Preline Style */}
          {rating !== undefined && rating !== null && isValidNumber(rating) && (
            <div className="p-5 flex flex-col bg-white border border-gray-200 shadow-xs rounded-xl overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
              {/* Header */}
              <div className="flex gap-3">
                <div className="mt-0.5 flex shrink-0 justify-center items-center size-8 bg-yellow-100 text-yellow-800 rounded-md dark:bg-yellow-900/30 dark:text-yellow-400">
                  <svg
                    className="shrink-0 size-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                <div className="grow">
                  <h2 className="font-medium text-sm sm:text-base text-gray-800 dark:text-neutral-200">
                    Calificación
                  </h2>

                  {/* List */}
                  <ul className="flex flex-wrap items-center whitespace-nowrap gap-1.5 mt-1">
                    {reviewsCount !== undefined && reviewsCount !== null && (
                      <li className="inline-flex items-center relative text-xs text-gray-500 pe-2 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600">
                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                          {reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'}
                        </p>
                      </li>
                    )}
                    <li className="inline-flex items-center relative text-xs text-gray-500 pe-2 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600">
                      <p className="text-xs text-gray-500 dark:text-neutral-500">
                        Google My Business
                      </p>
                    </li>
                  </ul>
                  {/* End List */}
                </div>
              </div>
              {/* End Header */}

              {/* Content */}
              <div className="mt-5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatRating(rating) || 'N/A'}
                  </span>
                  <svg
                    className="size-8 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              {/* End Content */}
            </div>
          )}

          {/* Status Card - Preline Style */}
          {workHours && (
            <div className="p-5 flex flex-col bg-white border border-gray-200 shadow-xs rounded-xl overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
              {/* Header */}
              <div className="flex gap-3">
                <div className={`mt-0.5 flex shrink-0 justify-center items-center size-8 rounded-md ${
                  workHours.current_status === 'open'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200'
                }`}>
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>

                <div className="grow">
                  <h2 className="font-medium text-sm sm:text-base text-gray-800 dark:text-neutral-200">
                    Estado del Negocio
                  </h2>

                  {/* List */}
                  <ul className="flex flex-wrap items-center whitespace-nowrap gap-1.5 mt-1">
                    <li className="inline-flex items-center relative text-xs text-gray-500 pe-2 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600">
                      <p className="text-xs text-gray-500 dark:text-neutral-500">
                        Tiempo real
                      </p>
                    </li>
                  </ul>
                  {/* End List */}
                </div>
              </div>
              {/* End Header */}

              {/* Content */}
              <div className="mt-5 text-center">
                {workHours.current_status === 'open' ? (
                  <span className="inline-flex items-center gap-x-1.5 py-2 px-4 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                    <span className="size-2 bg-green-500 rounded-full"></span>
                    Abierto ahora
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-x-1.5 py-2 px-4 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    <span className="size-2 bg-gray-500 rounded-full"></span>
                    Cerrado
                  </span>
                )}
              </div>
              {/* End Content */}
            </div>
          )}

          {/* Category Card - Preline Style */}
          {category && (
            <div className="p-5 flex flex-col bg-white border border-gray-200 shadow-xs rounded-xl overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
              {/* Header */}
              <div className="flex gap-3">
                <div className="mt-0.5 flex shrink-0 justify-center items-center size-8 bg-blue-100 text-blue-800 rounded-md dark:bg-blue-900/30 dark:text-blue-400">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>

                <div className="grow">
                  <h2 className="font-medium text-sm sm:text-base text-gray-800 dark:text-neutral-200">
                    Categoría Principal
                  </h2>

                  {/* List */}
                  <ul className="flex flex-wrap items-center whitespace-nowrap gap-1.5 mt-1">
                    <li className="inline-flex items-center relative text-xs text-gray-500 pe-2 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600">
                      <p className="text-xs text-gray-500 dark:text-neutral-500">
                        Google My Business
                      </p>
                    </li>
                  </ul>
                  {/* End List */}
                </div>
              </div>
              {/* End Header */}

              {/* Content */}
              <div className="mt-5 text-center">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {category}
                </span>
              </div>
              {/* End Content */}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Descripción</h3>
            <p className="text-gray-600 dark:text-neutral-400 whitespace-pre-line leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Competitors Section */}
        {competitors.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              También buscan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitors.slice(0, 4).map((competitor: Record<string, unknown>, index: number) => {
                const title = safeString(competitor.title);
                const ratingValue = safeRatingValue(competitor.rating);
                const votesCount = safeVotesCount(competitor.rating);
                const formattedRating = formatRating(ratingValue);

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {title || 'Sin nombre'}
                      </p>
                      {formattedRating !== null && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-600 dark:text-neutral-400">
                            {formattedRating}
                          </span>
                          <svg
                            className="size-3 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {votesCount !== null && (
                            <span className="text-xs text-gray-500 dark:text-neutral-500">
                              ({votesCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Preline Cards Grid - Desktop: side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Preline Chart Card - Mockup Data */}
          <div className="p-5 flex flex-col bg-white border border-gray-200 shadow-xs rounded-xl overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
          {/* Header */}
          <div className="flex gap-3">
            <div className="mt-0.5 flex shrink-0 justify-center items-center size-8 bg-gray-100 text-gray-800 rounded-md dark:bg-neutral-700 dark:text-neutral-200">
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="6" height="6" rx="1" />
                <path d="m3 17 2 2 4-4" />
                <path d="M13 6h8" />
                <path d="M13 12h8" />
                <path d="M13 18h8" />
              </svg>
            </div>

            <div className="grow">
              <h2 className="font-medium text-sm sm:text-base text-gray-800 dark:text-neutral-200">
                Which CSS framework do you use the most?
              </h2>

              {/* List */}
              <ul className="flex flex-wrap items-center whitespace-nowrap gap-1.5">
                <li className="inline-flex items-center relative text-xs text-gray-500 pe-2 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600">
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    Multiple choice
                  </p>
                </li>
                <li className="inline-flex items-center relative text-xs text-gray-500 pe-2 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600">
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    75 responses
                  </p>
                </li>
              </ul>
              {/* End List */}
            </div>
          </div>
          {/* End Header */}

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 sm:items-center gap-3">
            {/* Apex Radial Bar Chart */}
            <div id="hs-pro-asdwrb" className="min-h-[223px] mx-auto w-full">
              <Chart
                type="radialBar"
                height={223}
                series={[60, 30, 10]}
                options={{
                  chart: {
                    type: 'radialBar',
                    height: 223,
                    sparkline: {
                      enabled: false,
                    },
                    toolbar: {
                      show: false,
                    },
                  },
                  plotOptions: {
                    radialBar: {
                      track: {
                        background: '#E5E7EB',
                        strokeWidth: '100%',
                        margin: 0,
                      },
                      dataLabels: {
                        show: false,
                      },
                      hollow: {
                        size: '35%',
                      },
                      startAngle: -90,
                      endAngle: 90,
                    },
                  },
                  colors: ['#4F46E5', '#22D3EE', '#E5E7EB'], // indigo-600, cyan-400, gray-200
                  labels: ['Tailwind CSS', 'Bootstrap', 'Other'],
                  stroke: {
                    lineCap: 'round',
                  },
                  legend: {
                    show: false,
                  },
                  tooltip: {
                    enabled: false,
                  },
                  grid: {
                    padding: {
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    },
                  },
                }}
              />
            </div>

            <div className="flex flex-col gap-3 sm:gap-5">
              {/* Legend Indicator */}
              <div className="flex gap-2">
                <span className="shrink-0 size-2.5 inline-block bg-indigo-600 rounded-full mt-2"></span>
                <div className="grow">
                  <div>
                    <span className="font-semibold text-sm text-gray-800 dark:text-neutral-200">
                      60%
                    </span>
                    <span className="text-sm text-gray-800 dark:text-neutral-200">
                      {' '}- Tailwind CSS
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    39 response
                  </p>
                </div>
              </div>
              {/* End Legend Indicator */}

              {/* Legend Indicator */}
              <div className="flex gap-2">
                <span className="shrink-0 size-2.5 inline-block bg-cyan-400 rounded-full mt-2"></span>
                <div className="grow">
                  <div>
                    <span className="font-semibold text-sm text-gray-800 dark:text-neutral-200">
                      30%
                    </span>
                    <span className="text-sm text-gray-800 dark:text-neutral-200">
                      {' '}- Bootstrap
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    27 response
                  </p>
                </div>
              </div>
              {/* End Legend Indicator */}

              {/* Legend Indicator */}
              <div className="flex gap-2">
                <span className="shrink-0 size-2.5 inline-block bg-gray-200 rounded-full mt-2 dark:bg-neutral-600"></span>
                <div className="grow">
                  <div>
                    <span className="font-semibold text-sm text-gray-800 dark:text-neutral-200">
                      10%
                    </span>
                    <span className="text-sm text-gray-800 dark:text-neutral-200">
                      {' '}- Other
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    9 response
                  </p>
                </div>
              </div>
              {/* End Legend Indicator */}
            </div>
          </div>
          </div>
          {/* End Chart Card */}

          {/* Preline Ratings Breakdown Card - Mockup Data */}
          <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-2xs dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex flex-col sm:flex-row gap-5 md:gap-10">
              <div>
                <svg
                  className="w-20 h-auto mb-2"
                  width="728"
                  height="398"
                  viewBox="0 0 728 398"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M65.4113 139.994C63.8882 135.396 69.1386 131.535 73.0734 134.36L101.888 155.043C103.647 156.307 106.02 156.293 107.765 155.01L136.341 133.997C140.243 131.128 145.538 134.928 144.067 139.543L133.3 173.339C132.642 175.403 133.388 177.656 135.148 178.919L163.963 199.603C167.897 202.427 165.919 208.637 161.075 208.664L125.606 208.867C123.44 208.88 121.529 210.286 120.871 212.35L110.104 246.145C108.633 250.76 102.116 250.798 100.593 246.2L89.4396 212.529C88.7585 210.473 86.8307 209.089 84.6646 209.102L49.1956 209.305C44.3521 209.333 42.3028 203.146 46.205 200.277L74.7806 179.264C76.5257 177.981 77.2461 175.72 76.5649 173.664L65.4113 139.994Z"
                    className="fill-stone-800 dark:fill-neutral-200"
                    fill="currentColor"
                  />
                  <path
                    d="M208.372 57.4387C208.309 52.5955 214.481 50.5016 217.378 54.3831L238.596 82.8067C239.892 84.5425 242.158 85.2465 244.209 84.5506L277.798 73.1547C282.385 71.5986 286.284 76.821 283.487 80.7761L263.012 109.739C261.761 111.507 261.792 113.88 263.088 115.616L284.305 144.04C287.203 147.921 283.441 153.242 278.815 151.805L244.943 141.282C242.874 140.639 240.627 141.401 239.376 143.17L218.901 172.133C216.104 176.088 209.881 174.154 209.818 169.311L209.36 133.844C209.332 131.678 207.912 129.777 205.844 129.134L171.971 118.61C167.346 117.173 167.262 110.657 171.848 109.101L205.437 97.7048C207.489 97.0089 208.859 95.0712 208.831 92.9053L208.372 57.4387Z"
                    className="fill-stone-800 dark:fill-neutral-200"
                    fill="currentColor"
                  />
                  <path
                    d="M368.522 20.3786C370.332 15.8857 376.834 16.3331 378.011 21.0316L386.629 55.4381C387.156 57.5393 388.975 59.0626 391.136 59.2113L426.522 61.6465C431.354 61.9791 432.938 68.3008 428.833 70.8721L398.774 89.7012C396.938 90.8511 396.052 93.0523 396.578 95.1535L405.197 129.56C406.374 134.258 400.851 137.718 397.137 134.609L369.941 111.839C368.28 110.449 365.912 110.286 364.077 111.436L334.017 130.265C329.913 132.836 324.916 128.652 326.725 124.16L339.976 91.2582C340.785 89.2489 340.209 86.947 338.548 85.5565L311.351 62.787C307.638 59.6777 310.072 53.6325 314.904 53.9651L350.29 56.4003C352.451 56.549 354.462 55.2893 355.272 53.28L368.522 20.3786Z"
                    className="fill-stone-800 dark:fill-neutral-200"
                    fill="currentColor"
                  />
                  <path
                    d="M671.036 131.221L659.902 164.898C658.882 167.983 659.964 171.374 662.583 173.297L691.171 194.293C693.123 195.727 692.1 198.82 689.678 198.808L654.209 198.625C650.96 198.609 648.069 200.686 647.049 203.771L635.915 237.448C635.155 239.747 631.897 239.73 631.16 237.423L620.373 203.634C619.385 200.539 616.516 198.432 613.267 198.415L577.798 198.232C575.376 198.22 574.385 195.116 576.352 193.702L605.154 173.002C607.792 171.105 608.91 167.726 607.922 164.631L597.135 130.841C596.398 128.534 599.044 126.632 600.996 128.066L629.584 149.062C632.203 150.985 635.762 151.003 638.401 149.107L667.203 128.406C669.17 126.993 671.796 128.922 671.036 131.221Z"
                    className="stroke-stone-800 dark:stroke-neutral-200"
                    stroke="currentColor"
                    strokeWidth="5"
                  />
                  <path
                    d="M530.478 51.8783L527.379 87.2122C527.096 90.449 528.928 93.5004 531.919 94.7706L564.566 108.636C566.795 109.583 566.51 112.829 564.151 113.373L529.588 121.345C526.422 122.076 524.087 124.761 523.803 127.998L520.704 163.332C520.493 165.745 517.318 166.477 516.071 164.401L497.809 133.994C496.136 131.208 492.859 129.817 489.693 130.547L455.131 138.519C452.771 139.063 451.094 136.27 452.683 134.443L475.959 107.678C478.091 105.226 478.402 101.68 476.729 98.895L458.467 68.488C457.22 66.4118 459.358 63.953 461.587 64.8998L494.234 78.7654C497.225 80.0356 500.693 79.2356 502.826 76.7838L526.101 50.0193C527.69 48.1919 530.69 49.4657 530.478 51.8783Z"
                    className="stroke-stone-800 dark:stroke-neutral-200"
                    stroke="currentColor"
                    strokeWidth="5"
                  />
                  <path
                    d="M523.194 163.551L526.468 126.217C526.561 125.165 526.318 124.111 525.774 123.205L499.391 79.2776C498.848 78.3724 498.032 77.6625 497.06 77.2498L462.564 62.5991C458.106 60.7056 453.83 65.6232 456.323 69.7755L474.585 100.183C475.701 102.04 475.493 104.403 474.072 106.038L450.796 132.802C447.618 136.457 450.973 142.044 455.693 140.956L490.255 132.984C492.366 132.497 494.55 133.425 495.665 135.281L513.927 165.689C516.421 169.841 522.771 168.376 523.194 163.551Z"
                    className="fill-stone-800 dark:fill-neutral-200"
                    fill="currentColor"
                  />
                  <path
                    d="M352.089 394.479L369.162 349.69"
                    className="stroke-stone-800 dark:stroke-neutral-200"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M369.161 349.692C355.075 340.09 313.524 320.14 259.036 315.506"
                    className="stroke-stone-800 dark:stroke-neutral-200"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M258.927 316.314C255.341 333.101 244.966 370.853 232.149 387.568"
                    className="stroke-stone-800 dark:stroke-neutral-200"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M355.802 338.448C368.802 322.448 392.302 297.448 401.802 279.948L417.302 253.448C427.802 236.579 432.296 222.826 436.308 215.37C438.092 212.055 439.202 209.538 441.672 204.613C443.913 200.141 445.886 195.626 444.321 191.923C443.123 189.087 438.124 184.123 427.715 186.956C417.306 189.79 410.207 198.581 407.959 202.622C405.707 205.97 395.931 218.103 393.254 220.766C387.032 226.953 356.38 252.611 337.264 237.579M333.544 212.733C349.412 204.344 380.237 189.219 390.975 178.835C402.003 176.7 429.236 180.268 426.488 165.645C425.916 162.598 416.327 155.042 402.073 152.477C391.815 150.632 384.378 149.911 375.857 154.49C371.026 157.086 369.109 158.008 362.872 162.151M332.954 184.462C341.183 176.698 347.066 172.26 351.127 169.468C355.081 166.751 358.03 164.284 362.872 162.151M362.872 162.151C360.284 160.743 349.1 160.834 335.915 167.365C321.512 174.498 319.052 177.199 313.475 180.879C307.898 184.558 296.743 191.918 292.377 195.469C284.651 201.751 277.61 208.831 274.83 212.403C269.936 219.961 272.664 225.679 280.02 239.752M284.43 265.881C284.43 275.25 282.302 297.448 275.802 315.948"
                    className="stroke-stone-800 dark:stroke-neutral-200"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M413.372 195.473L287.926 264.014C272.77 269.943 262.227 249.168 278.13 242.154L333.458 212.656M430.821 185.701L454.02 173.158L443.034 155.591L427.329 163.524"
                    className="stroke-stone-800 dark:stroke-neutral-200"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M457.149 171.455L470.229 152.098"
                    className="stroke-stone-800 dark:stroke-neutral-200"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M446.149 153.955L470.229 152.098"
                    className="stroke-stone-800 dark:stroke-neutral-200"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>

                <p className="font-semibold text-4xl text-stone-800 dark:text-neutral-200">4.24</p>

                <p className="text-sm text-stone-500 dark:text-neutral-500">
                  — of 12 reviews
                  <span className="ms-0.5 py-1 px-2 bg-stone-200 text-stone-800 font-medium text-xs rounded-full dark:bg-neutral-700 dark:text-neutral-200">
                    +1 this week
                  </span>
                </p>
              </div>

              <div className="grow">
                <div className="space-y-1">
                  {/* Rating Group - 5 stars */}
                  <div className="flex items-center gap-5 md:gap-10">
                    {/* Rating */}
                    <div className="flex gap-x-1">
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                    </div>
                    {/* End Rating */}

                    {/* Progress */}
                    <div className="grow">
                      <div className="flex items-center gap-x-5">
                        <div
                          className="flex w-full h-2 bg-stone-200 rounded-full overflow-hidden dark:bg-neutral-700"
                          role="progressbar"
                          aria-valuenow={60}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-green-600 text-xs text-white text-center rounded-full whitespace-nowrap"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <span className="min-w-4 text-sm text-stone-500 dark:text-neutral-500">6</span>
                      </div>
                    </div>
                    {/* End Progress */}
                  </div>
                  {/* Rating Group */}

                  {/* Rating Group - 4 stars */}
                  <div className="flex items-center gap-5 md:gap-10">
                    {/* Rating */}
                    <div className="flex gap-x-1">
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                    </div>
                    {/* End Rating */}

                    {/* Progress */}
                    <div className="grow">
                      <div className="flex items-center gap-x-5">
                        <div
                          className="flex w-full h-2 bg-stone-200 rounded-full overflow-hidden dark:bg-neutral-700"
                          role="progressbar"
                          aria-valuenow={40}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-green-600 text-xs text-white text-center rounded-full whitespace-nowrap"
                            style={{ width: '40%' }}
                          ></div>
                        </div>
                        <span className="min-w-4 text-sm text-stone-500 dark:text-neutral-500">4</span>
                      </div>
                    </div>
                    {/* End Progress */}
                  </div>
                  {/* Rating Group */}

                  {/* Rating Group - 3 stars */}
                  <div className="flex items-center gap-5 md:gap-10">
                    {/* Rating */}
                    <div className="flex gap-x-1">
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                    </div>
                    {/* End Rating */}

                    {/* Progress */}
                    <div className="grow">
                      <div className="flex items-center gap-x-5">
                        <div
                          className="flex w-full h-2 bg-stone-200 rounded-full overflow-hidden dark:bg-neutral-700"
                          role="progressbar"
                          aria-valuenow={20}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-green-600 text-xs text-white text-center rounded-full whitespace-nowrap"
                            style={{ width: '20%' }}
                          ></div>
                        </div>
                        <span className="min-w-4 text-sm text-stone-500 dark:text-neutral-500">2</span>
                      </div>
                    </div>
                    {/* End Progress */}
                  </div>
                  {/* Rating Group */}

                  {/* Rating Group - 2 stars */}
                  <div className="flex items-center gap-5 md:gap-10">
                    {/* Rating */}
                    <div className="flex gap-x-1">
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                    </div>
                    {/* End Rating */}

                    {/* Progress */}
                    <div className="grow">
                      <div className="flex items-center gap-x-5">
                        <div
                          className="flex w-full h-2 bg-stone-200 rounded-full overflow-hidden dark:bg-neutral-700"
                          role="progressbar"
                          aria-valuenow={0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-green-600 text-xs text-white text-center rounded-full whitespace-nowrap"
                            style={{ width: '0%' }}
                          ></div>
                        </div>
                        <span className="min-w-4 text-sm text-stone-500 dark:text-neutral-500">0</span>
                      </div>
                    </div>
                    {/* End Progress */}
                  </div>
                  {/* Rating Group */}

                  {/* Rating Group - 1 star */}
                  <div className="flex items-center gap-5 md:gap-10">
                    {/* Rating */}
                    <div className="flex gap-x-1">
                      <svg
                        className="shrink-0 size-3.5 text-green-600 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        className="shrink-0 size-3.5 text-stone-300 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                    </div>
                    {/* End Rating */}

                    {/* Progress */}
                    <div className="grow">
                      <div className="flex items-center gap-x-5">
                        <div
                          className="flex w-full h-2 bg-stone-200 rounded-full overflow-hidden dark:bg-neutral-700"
                          role="progressbar"
                          aria-valuenow={0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-green-600 text-xs text-white text-center rounded-full whitespace-nowrap"
                            style={{ width: '0%' }}
                          ></div>
                        </div>
                        <span className="min-w-4 text-sm text-stone-500 dark:text-neutral-500">0</span>
                      </div>
                    </div>
                    {/* End Progress */}
                  </div>
                  {/* Rating Group */}
                </div>

                {/* Overall Performance */}
                <div className="mt-2 flex justify-end items-center gap-x-2">
                  <span className="text-sm text-stone-500 dark:text-neutral-200">Overall performance</span>
                  <span className="py-1 px-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
                    Average
                  </span>
                </div>
                {/* End Overall Performance */}
              </div>
            </div>
          </div>
          {/* End Ratings Breakdown Card */}
        </div>
        {/* End Cards Grid */}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => router.push('/audit')}
            className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
          >
            {t('newAudit') || 'Nueva Auditoría'}
          </button>
          <button
            onClick={() => router.push('/contact')}
            className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
          >
            {t('contactUs') || 'Contactar'}
          </button>
        </div>
      </div>
    </section>
  );
}
