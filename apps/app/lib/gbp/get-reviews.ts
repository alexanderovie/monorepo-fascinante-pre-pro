/**
 * Get Reviews
 *
 * ÉLITE PRO: Obtiene reviews de una ubicación de Google Business Profile
 * según estándares de la industria.
 *
 * Características:
 * - Server Component compatible
 * - Cache con unstable_cache
 * - Manejo robusto de errores
 * - Type-safe
 */

import { unstable_cache } from 'next/cache'
import { createGBPClient } from '../integrations/gbp-client'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import type { GBPReviewsResponse, ReviewMetrics, GBPReview } from './types'
import type { ReadonlyRequestCookies } from '@/utils/supabase/server'

export interface GetReviewsParams {
  accountId: string
  locationId: string
  pageSize?: number
  pageToken?: string
  orderBy?: string
}

export interface GetReviewsResult {
  reviews: GBPReviewsResponse | null
  metrics: ReviewMetrics | null
  error?: string
}

/**
 * Función interna que obtiene los reviews
 * ÉLITE: Separada para poder cachearla
 */
async function _getReviewsInternal(
  accountId: string,
  locationId: string,
  userId: string,
  cookieStore: ReadonlyRequestCookies,
  options?: {
    pageSize?: number
    pageToken?: string
    orderBy?: string
  }
): Promise<GetReviewsResult> {
  try {
    const client = await createGBPClient(userId, cookieStore)

    // ÉLITE: Obtener reviews
    const reviewsResponse = await client.listReviews(accountId, locationId, {
      pageSize: options?.pageSize || 50,
      pageToken: options?.pageToken,
      orderBy: options?.orderBy || 'updateTime desc',
    })

    // ÉLITE: Calcular métricas de reviews
    // ÉLITE PRO: Type assertion basado en documentación oficial
    // Referencia: https://developers.google.com/my-business/content/review-data
    const reviewsResponseTyped = reviewsResponse as GBPReviewsResponse
    const reviews = reviewsResponseTyped.reviews || []
    const totalReviews = reviews.length
    const unansweredReviews = reviews.filter((r) => !r.reviewReply).length

    // Calcular promedio de ratings
    const ratingValues: Record<string, number> = {
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
    }
    const totalRating = reviews.reduce((sum, review) => {
      return sum + (ratingValues[review.starRating] || 0)
    }, 0)
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0

    // Distribución de ratings
    const ratingDistribution = {
      five: reviews.filter((r) => r.starRating === 'FIVE').length,
      four: reviews.filter((r) => r.starRating === 'FOUR').length,
      three: reviews.filter((r) => r.starRating === 'THREE').length,
      two: reviews.filter((r) => r.starRating === 'TWO').length,
      one: reviews.filter((r) => r.starRating === 'ONE').length,
    }

    // Reviews de los últimos 7 días
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const newReviewsLast7Days = reviews.filter((review) => {
      const reviewDate = new Date(review.createTime)
      return reviewDate >= sevenDaysAgo
    }).length

    const metrics: ReviewMetrics = {
      locationId,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Redondear a 1 decimal
      newReviewsLast7Days,
      unansweredReviews,
      ratingDistribution,
    }

    return {
      reviews: reviewsResponse,
      metrics,
    }
  } catch (error) {
    console.error(`[GBP getReviews] Error fetching reviews for location ${locationId}:`, error)
    return {
      reviews: null,
      metrics: null,
      error: error instanceof Error ? error.message : 'Failed to fetch reviews',
    }
  }
}

/**
 * Obtiene reviews de una ubicación
 *
 * @param params - Parámetros para obtener reviews
 * @returns Reviews y métricas o error
 */
export async function getReviews(params: GetReviewsParams): Promise<GetReviewsResult> {
  // ÉLITE: Obtener cookies FUERA de unstable_cache (requisito de Next.js 15)
  const cookieStore = await cookies()

  const supabase = await createClient(cookieStore)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { reviews: null, metrics: null, error: 'User not authenticated' }
  }

  // ÉLITE: Cache con revalidate de 5 minutos (300 segundos)
  // Tags para invalidación on-demand
  const getCachedReviews = unstable_cache(
    async (
      accountId: string,
      locationId: string,
      userId: string,
      cookies: ReadonlyRequestCookies,
      options?: { pageSize?: number; pageToken?: string; orderBy?: string }
    ) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GBP Cache] Fetching reviews for location: ${locationId} (cache miss)`)
      }
      return _getReviewsInternal(accountId, locationId, userId, cookies, options)
    },
    [`gbp-reviews-${params.accountId}-${params.locationId}-${params.pageToken || 'first'}-${user.id}`],
    {
      revalidate: 300, // 5 minutos
      tags: [
        'gbp-reviews',
        `gbp-reviews-${params.accountId}`,
        `gbp-reviews-${params.locationId}`,
        `gbp-reviews-user-${user.id}`,
      ],
    }
  )

  return getCachedReviews(
    params.accountId,
    params.locationId,
    user.id,
    cookieStore,
    {
      pageSize: params.pageSize,
      pageToken: params.pageToken,
      orderBy: params.orderBy,
    }
  )
}

// ÉLITE: replyToReview movido a actions.ts para evitar importar cookies() en Client Components
