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
import type { GBPLocation, LocationTableRow, HealthScore } from './types'
import { calculateLocationProgress } from './calculate-location-progress'
import { calculateHealthScore } from './calculate-health-score'

interface GetLocationsTableDataParams {
  accountId: string
  includeHealthScore?: boolean
}

/**
 * Obtiene los datos formateados para la tabla de ubicaciones
 * ÉLITE: Optimizado para rendimiento y respeto de cuotas
 */
export async function getLocationsTableData({
  accountId,
  includeHealthScore = false,
}: GetLocationsTableDataParams): Promise<LocationTableRow[]> {
  const client = await createGBPClient()

  // 1. Obtener lista de ubicaciones
  // ÉLITE: readMask es REQUERIDO según la API de Google
  // Según documentación oficial y Stack Overflow, 'name,title' es el mínimo que funciona
  // Campos válidos según: https://developers.google.com/my-business/reference/businessinformation/rest/v1/locations
  const locationsResponse = await client.listLocations(accountId, {
    readMask: 'name,title',
  })

  const locations = locationsResponse.locations || []
  const tableRows: LocationTableRow[] = []

  // 2. Para cada ubicación, obtener datos necesarios
  for (const location of locations) {
    const locationId = location.name.replace('locations/', '')

    try {
      // Obtener detalles completos si no vienen en la lista inicial
      let fullLocation: GBPLocation = location

      // Si necesitamos más datos para calcular progreso, obtenerlos
      // ÉLITE: Usar solo campos válidos según documentación oficial
      // updateTime NO es un campo válido del recurso Location
      if (!location.title || !location.storefrontAddress || !location.phoneNumbers) {
        fullLocation = await client.getLocation(
          locationId,
          'name,title,categories,openInfo,storefrontAddress,phoneNumbers,websiteUri,regularHours,metadata'
        )
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

      // Formatear categorías
      const primaryCategory = fullLocation.categories?.primaryCategory?.displayName || 'N/A'
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
      // Si no está disponible, usar 'N/A'
      // NOTA: Formatear en servidor para evitar problemas de hidratación
      const lastUpdated = fullLocation.updateTime
        ? new Date(fullLocation.updateTime).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'N/A'

      tableRows.push({
        locationId,
        name: fullLocation.title || 'Sin nombre',
        category: primaryCategory,
        additionalCategories: additionalCategories.length > 0 ? additionalCategories : undefined,
        status,
        progress,
        lastUpdated,
        healthScore,
        location: fullLocation,
      })

      // Respetar límite de 300 QPM (pausa de 200ms entre ubicaciones)
      await new Promise((resolve) => setTimeout(resolve, 200))
    } catch (error) {
      console.error(`[GBP Locations] Error al procesar ubicación ${locationId}:`, error)
      // Continuar con la siguiente ubicación
    }
  }

  return tableRows
}
