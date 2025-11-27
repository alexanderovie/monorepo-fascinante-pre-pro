/**
 * Calculate Health Score
 *
 * ÉLITE: Calcula el health score de una ubicación de Google Business Profile
 * basado en múltiples factores.
 *
 * Características:
 * - Score de 0-5 basado en 4 factores
 * - Porcentaje de 0-100
 * - Breakdown detallado por factor
 *
 * Factores evaluados:
 * 1. Completitud del perfil (40%)
 * 2. Atributos configurados (20%)
 * 3. Actualizaciones sugeridas pendientes (20%)
 * 4. Estado de verificación (20%)
 */

import type { GBPLocation, HealthScore } from './types'
import { calculateLocationProgress } from './calculate-location-progress'

interface CalculateHealthScoreParams {
  location: GBPLocation
  attributesCount?: number
  hasPendingUpdates?: boolean
  isVerified?: boolean
}

/**
 * Calcula el health score de una ubicación
 * ÉLITE: Basado en 4 factores ponderados
 */
export function calculateHealthScore({
  location,
  attributesCount = 0,
  hasPendingUpdates = false,
  isVerified = false,
}: CalculateHealthScoreParams): HealthScore {
  // 1. Completitud del perfil (40%)
  const progress = calculateLocationProgress(location)
  const completenessScore = (progress.percentage / 100) * 40

  // 2. Atributos configurados (20%)
  // Máximo 10 atributos = 20 puntos
  const attributesScore = Math.min((attributesCount / 10) * 20, 20)

  // 3. Actualizaciones sugeridas pendientes (20%)
  // Si hay actualizaciones sugeridas, penalizar
  const updatesScore = hasPendingUpdates ? 0 : 20

  // 4. Estado de verificación (20%)
  const verificationScore = isVerified ? 20 : 0

  // Calcular score total
  const totalScore = completenessScore + attributesScore + updatesScore + verificationScore
  const percentage = Math.round(totalScore)
  const score = Math.round((totalScore / 100) * 5) // Convertir a 0-5

  return {
    score,
    percentage,
    breakdown: {
      completeness: Math.round(completenessScore),
      attributes: Math.round(attributesScore),
      updates: Math.round(updatesScore),
      verification: Math.round(verificationScore),
    },
  }
}
