/**
 * DataForSEO Business Data Service
 *
 * Servicio para obtener información de Google My Business usando DataForSEO API
 *
 * Basado en:
 * - BusinessDataApi.googleMyBusinessInfoLive()
 * - Documentación: https://docs.dataforseo.com/v3/business_data/google_my_business/info/live/
 *
 * Actualizado: Noviembre 2025
 */

import * as client from 'dataforseo-client';
import type {
  BusinessDataGoogleMyBusinessInfoLiveResponseInfo,
  BusinessDataGoogleMyBusinessInfoLiveTaskInfo,
  BusinessDataGoogleMyBusinessInfoLiveResultInfo,
  ItemsGoogleBusinessInfo,
} from 'dataforseo-client';
import { createBusinessDataApi } from '../client';
import { withRetry } from '../retry';
import {
  DataForSEOError,
  mapHttpErrorToDataForSEOError,
  processDataForSEOError,
} from '../errors';

/**
 * Opciones para obtener información de Google My Business
 */
export interface GoogleMyBusinessInfoOptions {
  /** place_id de Google Places (obtenido de Google Places API) */
  placeId: string;
  /** Código de ubicación (ej: 2840 para US) */
  locationCode?: number;
  /** Nombre de ubicación (ej: "London,England,United Kingdom") */
  locationName?: string;
  /** Coordenadas GPS (formato: "lat,lng,radius") */
  locationCoordinate?: string;
  /** Código de idioma (ej: "en", "es") */
  languageCode?: string;
  /** Nombre de idioma (ej: "English") */
  languageName?: string;
}

/**
 * Resultado de Google My Business Info
 */
export interface GoogleMyBusinessInfoResult {
  placeId: string;
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewsCount?: number;
  categories?: string[];
  hours?: {
    openNow?: boolean;
    weekdayText?: string[];
  };
  photos?: string[];
  // Datos completos de la respuesta (tipo real del cliente)
  rawData?: BusinessDataGoogleMyBusinessInfoLiveResultInfo;
  // Item individual (primer elemento de items)
  item?: ItemsGoogleBusinessInfo;
}

/**
 * Obtiene información de Google My Business usando place_id
 *
 * @param options - Opciones de búsqueda
 * @returns Información del negocio
 * @throws DataForSEOError si hay un error
 */
export async function getGoogleMyBusinessInfo(
  options: GoogleMyBusinessInfoOptions
): Promise<GoogleMyBusinessInfoResult> {
  try {
    const businessDataApi = createBusinessDataApi();

    // Crear request
    const request = new client.BusinessDataGoogleMyBusinessInfoLiveRequestInfo();

    // Usar place_id en el campo keyword (formato: "place_id:ChIJ...")
    request.keyword = `place_id:${options.placeId}`;

    // Configurar ubicación (prioridad: locationCode > locationName > locationCoordinate)
    if (options.locationCode) {
      request.location_code = options.locationCode;
    } else if (options.locationName) {
      request.location_name = options.locationName;
    } else if (options.locationCoordinate) {
      request.location_coordinate = options.locationCoordinate;
    } else {
      // Default: US
      request.location_code = 2840;
    }

    // Configurar idioma (prioridad: languageCode > languageName)
    if (options.languageCode) {
      request.language_code = options.languageCode;
    } else if (options.languageName) {
      request.language_name = options.languageName;
    } else {
      // Default: English
      request.language_code = 'en';
    }

    // Ejecutar con retry
    const response: BusinessDataGoogleMyBusinessInfoLiveResponseInfo | null = await withRetry(
      async () => {
        return await businessDataApi.googleMyBusinessInfoLive([request]);
      },
      {
        maxRetries: 3,
        initialDelayMs: 1000,
      }
    );

    // Verificar respuesta
    if (!response || !response.tasks || response.tasks.length === 0) {
      throw new DataForSEOError(
        'No se recibieron datos de DataForSEO',
        undefined,
        undefined,
        false
      );
    }

    const task: BusinessDataGoogleMyBusinessInfoLiveTaskInfo = response.tasks[0];

    // Verificar si hay error en la respuesta
    if (task.status_code !== 20000) {
      const error = mapHttpErrorToDataForSEOError(
        task.status_code || 500,
        task.status_message
      );
      throw error;
    }

    // Verificar si hay resultado
    if (!task.result || task.result.length === 0) {
      throw new DataForSEOError(
        'No se encontró información del negocio en DataForSEO',
        undefined,
        undefined,
        false
      );
    }

    const result: BusinessDataGoogleMyBusinessInfoLiveResultInfo = task.result[0];

    // Obtener el primer item de la lista (ItemsGoogleBusinessInfo)
    const item: ItemsGoogleBusinessInfo | undefined = result.items?.[0];

    if (!item) {
      throw new DataForSEOError(
        'No se encontró información del negocio en DataForSEO',
        undefined,
        undefined,
        false
      );
    }

    // Extraer datos relevantes del item
    const businessInfo: GoogleMyBusinessInfoResult = {
      placeId: options.placeId,
      name: item.title,
      address: item.address,
      phone: item.phone,
      website: item.url,
      rating: item.rating?.value,
      reviewsCount: item.rating?.votes_count,
      categories: item.category ? [item.category] : undefined,
      hours: item.work_time?.work_hours?.current_status
        ? {
            openNow: item.work_time.work_hours.current_status === 'open',
            weekdayText: undefined, // No disponible directamente en WorkHours
          }
        : undefined,
      photos: undefined, // No disponible directamente en ItemsGoogleBusinessInfo
      rawData: result,
      item,
    };

    return businessInfo;
  } catch (error) {
    // Procesar y relanzar error
    throw processDataForSEOError(error);
  }
}

/**
 * Obtiene información de Google My Business usando nombre del negocio
 * (fallback si no tenemos place_id)
 *
 * @param businessName - Nombre del negocio
 * @param locationCode - Código de ubicación (default: 2840 para US)
 * @param languageCode - Código de idioma (default: "en")
 * @returns Información del negocio
 */
export async function getGoogleMyBusinessInfoByName(
  businessName: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): Promise<GoogleMyBusinessInfoResult | null> {
  try {
    const businessDataApi = createBusinessDataApi();

    const request = new client.BusinessDataGoogleMyBusinessInfoLiveRequestInfo();
    request.keyword = businessName;
    request.location_code = locationCode;
    request.language_code = languageCode;

    const response = await withRetry(
      async () => {
        return await businessDataApi.googleMyBusinessInfoLive([request]);
      },
      {
        maxRetries: 3,
        initialDelayMs: 1000,
      }
    );

    if (!response || !response.tasks || response.tasks.length === 0) {
      return null;
    }

    const task = response.tasks[0];

    if (task.status_code !== 20000 || !task.result || task.result.length === 0) {
      return null;
    }

    const result = task.result[0];

    return {
      placeId: result.place_id || '',
      name: result.title,
      address: result.address,
      phone: result.phone,
      website: result.website,
      rating: result.rating?.value,
      reviewsCount: result.rating?.votes_count,
      categories: result.category,
      rawData: result,
    };
  } catch (error) {
    // Log error pero no lanzar (es un fallback)
    if (process.env.NODE_ENV === 'development') {
      console.error('[DataForSEO] Error obteniendo info por nombre:', error);
    }
    return null;
  }
}
