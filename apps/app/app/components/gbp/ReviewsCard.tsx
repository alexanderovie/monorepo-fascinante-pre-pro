/**
 * Reviews Card Component
 *
 * ÉLITE PRO: Componente para mostrar reviews y estadísticas de reputación
 * según estándares de la industria.
 *
 * Características:
 * - Muestra lista de reviews
 * - Estadísticas de reputación
 * - Distribución de ratings
 * - Responder a reviews
 * - Responsive y accesible
 */

'use client'

import { useState } from 'react'
import type { GBPReview, ReviewMetrics } from '@/lib/gbp/types'
import { replyToReviewAction } from '@/app/google-business-profile/locations/[locationId]/actions'

interface ReviewsCardProps {
  reviews: GBPReview[]
  metrics: ReviewMetrics | null
  accountId: string
  locationId: string
}

export default function ReviewsCard({ reviews, metrics, accountId, locationId }: ReviewsCardProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)

  // ÉLITE: Función para responder a un review
  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return

    setLoading(true)
    try {
      const result = await replyToReviewAction(accountId, locationId, reviewId, {
        comment: replyText,
      })

      if (result.success) {
        setReplyingTo(null)
        setReplyText('')
        // ÉLITE: Recargar página para mostrar el reply actualizado
        window.location.reload()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error replying to review:', error)
      alert('Error al responder al review')
    } finally {
      setLoading(false)
    }
  }

  // ÉLITE: Función para obtener el color del rating
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'FIVE':
        return 'text-green-600 dark:text-green-400'
      case 'FOUR':
        return 'text-blue-600 dark:text-blue-400'
      case 'THREE':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'TWO':
        return 'text-orange-600 dark:text-orange-400'
      case 'ONE':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-neutral-400'
    }
  }

  // ÉLITE: Función para obtener el número del rating
  const getRatingNumber = (rating: string) => {
    const ratingMap: Record<string, number> = {
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
    }
    return ratingMap[rating] || 0
  }

  // ÉLITE: Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas de Reputación */}
      {metrics && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Estadísticas de Reputación</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Rating Promedio</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {metrics.averageRating.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalReviews}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Sin Responder</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {metrics.unansweredReviews}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Últimos 7 Días</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.newReviewsLast7Days}
              </p>
            </div>
          </div>

          {/* Distribución de Ratings */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Distribución de Ratings</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = metrics.ratingDistribution[rating === 5 ? 'five' : rating === 4 ? 'four' : rating === 3 ? 'three' : rating === 2 ? 'two' : 'one']
                const percentage = metrics.totalReviews > 0 ? (count / metrics.totalReviews) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 w-8">
                      {rating} ⭐
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-neutral-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Reviews */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-neutral-400">No hay reviews disponibles</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {review.reviewer.profilePhotoUrl ? (
                      <img
                        src={review.reviewer.profilePhotoUrl}
                        alt={review.reviewer.displayName}
                        className="size-10 rounded-full"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-gray-300 dark:bg-neutral-600 flex items-center justify-center">
                        <span className="text-gray-600 dark:text-neutral-300 text-sm font-medium">
                          {review.reviewer.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {review.reviewer.displayName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {formatDate(review.createTime)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getRatingColor(review.starRating)}`}>
                    {getRatingNumber(review.starRating)} ⭐
                  </div>
                </div>

                {review.comment && (
                  <p className="text-gray-700 dark:text-neutral-300 mb-3">{review.comment}</p>
                )}

                {/* Reply existente */}
                {review.reviewReply && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 mb-3 rounded">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Tu respuesta:</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{review.reviewReply.comment}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {formatDate(review.reviewReply.updateTime)}
                    </p>
                  </div>
                )}

                {/* Formulario de respuesta */}
                {!review.reviewReply && (
                  <div>
                    {replyingTo === review.reviewId ? (
                      <div className="space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Escribe tu respuesta..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(review.reviewId)}
                            disabled={loading || !replyText.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            {loading ? 'Enviando...' : 'Enviar Respuesta'}
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyText('')
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(review.reviewId)}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Responder
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

