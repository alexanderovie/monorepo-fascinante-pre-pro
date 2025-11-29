'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ExternalImage from '../../components/ExternalImage';

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
            <div id="hs-pro-asdwrb" className="min-h-[223px] mx-auto"></div>

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
        {/* End Card */}

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
