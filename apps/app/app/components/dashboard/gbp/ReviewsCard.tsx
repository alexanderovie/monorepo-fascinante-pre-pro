import type { ReviewMetrics } from '@/lib/gbp/types'
import { formatNumber } from '@/lib/utils/format'

interface ReviewsCardProps {
  metrics: Omit<ReviewMetrics, 'locationId'>
}

/**
 * Reviews & Reputation Card Component
 *
 * Muestra métricas de reviews: total, promedio, nuevas y sin responder.
 * Server Component - Datos estáticos.
 */
export default function ReviewsCard({ metrics }: ReviewsCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`shrink-0 size-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-neutral-600'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))
  }

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="p-5 pb-3 flex justify-between items-center">
        <h2 className="ms-1 inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
          Reviews & Reputation
        </h2>
        {metrics.unansweredReviews > 0 && (
          <span className="py-1 ps-1.5 pe-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500">
            <svg
              className="shrink-0 size-3"
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
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            {metrics.unansweredReviews} sin responder
          </span>
        )}
      </div>
      {/* End Header */}

      {/* Body */}
      <div className="flex flex-col justify-between h-full pb-5 px-5">
        {/* Main Rating */}
        <div>
          <div className="flex items-center gap-x-2 mb-2">
            <h4 className="text-4xl md:text-5xl font-medium text-gray-800 dark:text-neutral-200">
              {metrics.averageRating.toFixed(1)}
            </h4>
            <div className="flex items-center">{renderStars(metrics.averageRating)}</div>
          </div>
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            {formatNumber(metrics.totalReviews)} reviews totales
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 space-y-3">
          {/* New Reviews */}
          <div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-neutral-400">
                Nuevas (últimos 7 días)
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                {metrics.newReviewsLast7Days}
              </span>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 dark:text-neutral-400 mb-2">
              Distribución de ratings
            </div>
            <div className="space-y-1.5">
              {[
                { stars: 5, count: metrics.ratingDistribution.five, label: '5 estrellas' },
                { stars: 4, count: metrics.ratingDistribution.four, label: '4 estrellas' },
                { stars: 3, count: metrics.ratingDistribution.three, label: '3 estrellas' },
                { stars: 2, count: metrics.ratingDistribution.two, label: '2 estrellas' },
                { stars: 1, count: metrics.ratingDistribution.one, label: '1 estrella' },
              ].map(({ stars, count, label }) => {
                const percentage = metrics.totalReviews > 0 ? (count / metrics.totalReviews) * 100 : 0
                return (
                  <div key={stars} className="flex items-center gap-x-2">
                    <span className="text-xs text-gray-600 dark:text-neutral-400 w-12">{label}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-800 dark:text-neutral-200 w-8 text-right">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {/* End Stats */}
      </div>
      {/* End Body */}
    </div>
  )
}
