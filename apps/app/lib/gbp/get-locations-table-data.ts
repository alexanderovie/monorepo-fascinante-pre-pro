/**
 * Get Locations Table Data
 *
 * ÉLITE: Obtiene y formatea los datos para la tabla de ubicaciones
 * siguiendo las mejores prácticas de 2025.
 *
 * Características:
 * - Optimización de llamadas con readMask
 * - Manejo robusto de errores
 * - Respeto a límites de cuota (300 QPM)
 * - Cálculo de progreso y health score
 */

import { createGBPClient } from '@/lib/integrations/gbp-client'
import { cookies } from 'next/headers'
import type { GBPLocation, LocationTableRow, HealthScore } from './types'
import { calculateLocationProgress } from './calculate-location-progress'
import { calculateHealthScore } from './calculate-health-score'
import { LOCATION_DEFAULTS } from './constants'

// ÉLITE: En Next.js 15, ReadonlyRequestCookies no se exporta directamente
// Usamos el tipo inferido de cookies()
type ReadonlyRequestCookies = Awaited<ReturnType<typeof cookies>>

interface GetLocationsTableDataParams {
  accountId: string
  includeHealthScore?: boolean
  cookieStore?: ReadonlyRequestCookies
  userId?: string
}

/**
 * Obtiene los datos formateados para la tabla de ubicaciones
 * ÉLITE: Optimizado para rendimiento y respeto de cuotas
 *
 * @param accountId - ID de la cuenta de GBP
 * @param includeHealthScore - Si incluir health score
 * @param cookieStore - Opcional: cookies obtenidas fuera de función cacheada (para uso con unstable_cache)
 * @param userId - Opcional: ID del usuario (requerido si se proporciona cookieStore)
 */
export async function getLocationsTableData({
  accountId,
  includeHealthScore = false,
  cookieStore,
  userId,
}: GetLocationsTableDataParams): Promise<LocationTableRow[]> {
  // ÉLITE: Si se proporciona cookieStore, también debe proporcionarse userId
  // para cumplir con restricciones de unstable_cache
  const client = await createGBPClient(userId, cookieStore)

  // 1. Obtener lista de ubicaciones
  // ÉLITE: readMask es REQUERIDO según la API de Google
  // Incluir categories para obtener primaryCategory desde el inicio
  // Campos válidos según: https://developers.google.com/my-business/reference/businessinformation/rest/v1/locations
  const locationsResponse = await client.listLocations(accountId, {
    readMask: 'name,title,categories',
  })

  const locations = locationsResponse.locations || []
  const tableRows: LocationTableRow[] = []

  // 2. Para cada ubicación, obtener datos necesarios
  for (const location of locations) {
    const locationId = location.name.replace('locations/', '')

    try {
      // Obtener detalles completos si no vienen en la lista inicial
      let fullLocation: GBPLocation = location

      // ÉLITE: Obtener datos completos según documentación oficial
      // Referencia: https://developers.google.com/my-business/content/location-data#get_a_location_by_name
      // IMPORTANTE: Según documentación oficial, categories puede no venir en listLocations
      // aunque esté en readMask. Por seguridad, SIEMPRE hacer getLocation completo
      // para asegurar que tenemos categories y todos los datos necesarios
      const hasCategories = !!location.categories?.primaryCategory
      const needsFullData = !hasCategories
        || !location.title
        || !location.storefrontAddress
        || !location.phoneNumbers

      if (needsFullData) {
        // ÉLITE: readMask según documentación oficial - campos válidos de Location resource
        // IMPORTANTE: Incluir 'categories' explícitamente según documentación
        // Referencia: https://developers.google.com/my-business/content/location-data#get_a_location_by_name
        fullLocation = await client.getLocation(
          locationId,
          'name,title,categories,openInfo,storefrontAddress,phoneNumbers,websiteUri,regularHours,metadata'
        )
      }

      // ÉLITE: Verificación final - asegurar que tenemos categories
      // Si aún no tenemos categories después de getLocation, es un problema de la API
      if (!fullLocation.categories?.primaryCategory) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[GBP Locations] ⚠️ Categories missing after getLocation - API may not be returning categories:', {
            locationId,
            locationName: fullLocation.title,
            hasCategories: !!fullLocation.categories,
            hasPrimaryCategory: !!fullLocation.categories?.primaryCategory,
          })
        }
      } else if (process.env.NODE_ENV === 'development') {
        // Log exitoso solo en desarrollo para confirmar que funciona
        console.log('[GBP Locations] ✅ Category found:', {
          locationId,
          locationName: fullLocation.title,
          category: fullLocation.categories.primaryCategory.displayName || fullLocation.categories.primaryCategory.name,
        })
      }

      // Calcular progreso
      const progress = calculateLocationProgress(fullLocation)

      // Calcular health score (opcional, requiere datos adicionales)
      let healthScore: HealthScore | undefined
      if (includeHealthScore) {
        // Por ahora, usar datos básicos (en el futuro se pueden agregar llamadas adicionales)
        healthScore = calculateHealthScore({
          location: fullLocation,
          attributesCount: 0, // Se puede obtener con llamada adicional
          hasPendingUpdates: fullLocation.metadata?.hasGoogleUpdated || false,
          isVerified: fullLocation.metadata?.canOperateGoogleUpdate || false,
        })

        // Respetar límite de 300 QPM (pausa de 200ms)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // ÉLITE: Formatear categorías según documentación oficial de Google Business Profile API
      // Referencia: https://developers.google.com/my-business/reference/businessinformation/rest/v1/locations#Categories
      // primaryCategory tiene displayName (legible) y name (formato "gcid:xxx")
      // Prioridad: displayName > name (sin prefijo gcid:) > constante por defecto
      // IMPORTANTE: Verificar que categories esté en readMask para obtener estos datos
      const primaryCategory = fullLocation.categories?.primaryCategory?.displayName
        || (fullLocation.categories?.primaryCategory?.name
          ? fullLocation.categories.primaryCategory.name.replace(/^gcid:/, '')
          : null)
        || LOCATION_DEFAULTS.NO_CATEGORY

      // ÉLITE: Logging para debugging (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        if (!fullLocation.categories?.primaryCategory) {
          console.warn('[GBP Locations] ⚠️ No categories found for location:', {
            locationId,
            locationName: fullLocation.title,
            hasCategories: !!fullLocation.categories,
            hasPrimaryCategory: !!fullLocation.categories?.primaryCategory,
            readMaskUsed: needsFullData ? 'full' : 'list',
          })
        } else {
          // Log exitoso para confirmar que funciona
          console.log('[GBP Locations] ✅ Category found:', {
            locationId,
            locationName: fullLocation.title,
            category: primaryCategory,
            displayName: fullLocation.categories.primaryCategory.displayName,
            name: fullLocation.categories.primaryCategory.name,
          })
        }
      }
      const additionalCategories =
        fullLocation.categories?.additionalCategories
          ?.map((cat) => cat.displayName)
          .filter((name): name is string => !!name) || []

      // Determinar status
      // ÉLITE: metadata puede no estar disponible en listLocations, usar solo openInfo
      let status: 'Active' | 'Pending' | 'Needs Review' | 'Closed' = 'Active'
      if (fullLocation.openInfo?.status === 'CLOSED_PERMANENTLY') {
        status = 'Closed'
      } else if (fullLocation.openInfo?.status === 'CLOSED_TEMPORARILY') {
        status = 'Pending'
      } else if (fullLocation.metadata?.hasPendingEdits) {
        // metadata solo disponible si se obtuvo con getLocation()
        status = 'Needs Review'
      }

      // Formatear fecha
      // ÉLITE: updateTime puede estar disponible en la respuesta sin incluirlo en readMask
      // Si no está disponible, usar constante (preparado para i18n)
      // NOTA: Formatear en servidor para evitar problemas de hidratación
      // TODO: Usar i18n para formateo de fechas cuando esté disponible
      const lastUpdated = fullLocation.updateTime
        ? new Date(fullLocation.updateTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : LOCATION_DEFAULTS.NO_DATE

      // ÉLITE: Construir objeto de fila con todos los datos
      const tableRow: LocationTableRow = {
        locationId,
        name: fullLocation.title || LOCATION_DEFAULTS.UNNAMED_LOCATION,
        category: primaryCategory, // ✅ Categoría principal extraída correctamente
        // ÉLITE: No incluir additionalCategories - solo mostrar primary category
        additionalCategories: undefined,
        status,
        progress,
        lastUpdated,
        healthScore,
        location: fullLocation,
      }

      // ÉLITE: Logging para verificar que category se asigna correctamente
      if (process.env.NODE_ENV === 'development') {
        console.log('[GBP Locations] 📊 Table row created:', {
          locationId,
          name: tableRow.name,
          category: tableRow.category,
          categoryType: typeof tableRow.category,
          categoryLength: tableRow.category?.length,
        })
      }

      tableRows.push(tableRow)

      // Respetar límite de 300 QPM (pausa de 200ms entre ubicaciones)
      await new Promise((resolve) => setTimeout(resolve, 200))
    } catch (error) {
      console.error(`[GBP Locations] Error al procesar ubicación ${locationId}:`, error)
      // Continuar con la siguiente ubicación
    }
  }

  return tableRows
}
