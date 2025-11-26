import type { EngagementMetrics } from '@/lib/gbp/types'

interface EngagementCardProps {
  metrics: Omit<EngagementMetrics, 'locationId'>
}

/**
 * Engagement Card Component
 *
 * Muestra métricas de engagement: Q&A pendientes, verificaciones, publicaciones.
 * Server Component - Datos estáticos.
 */
export default function EngagementCard({ metrics }: EngagementCardProps) {
  const hasAlerts = metrics.pendingQAs > 0 || metrics.pendingVerifications > 0

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="p-5 pb-3 flex justify-between items-center">
        <h2 className="ms-1 inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
          Engagement
        </h2>
        {hasAlerts && (
          <span className="py-1 ps-1.5 pe-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
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
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            Acciones pendientes
          </span>
        )}
      </div>
      {/* End Header */}

      {/* Body */}
      <div className="flex flex-col justify-between h-full pb-5 px-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Q&A Pending */}
          <div
            className={`p-3 rounded-lg ${
              metrics.pendingQAs > 0
                ? 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/20'
                : 'bg-gray-50 dark:bg-neutral-700/50'
            }`}
          >
            <div className="flex items-center gap-x-2 mb-2">
              <svg
                className={`shrink-0 size-4 ${
                  metrics.pendingQAs > 0
                    ? 'text-yellow-600 dark:text-yellow-500'
                    : 'text-gray-400 dark:text-neutral-500'
                }`}
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
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              <span className="text-xs font-medium text-gray-600 dark:text-neutral-400">
                Q&A Pendientes
              </span>
            </div>
            <p
              className={`text-2xl font-semibold ${
                metrics.pendingQAs > 0
                  ? 'text-yellow-800 dark:text-yellow-400'
                  : 'text-gray-800 dark:text-neutral-200'
              }`}
            >
              {metrics.pendingQAs}
            </p>
          </div>

          {/* Verifications Pending */}
          <div
            className={`p-3 rounded-lg ${
              metrics.pendingVerifications > 0
                ? 'bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-900/20'
                : 'bg-gray-50 dark:bg-neutral-700/50'
            }`}
          >
            <div className="flex items-center gap-x-2 mb-2">
              <svg
                className={`shrink-0 size-4 ${
                  metrics.pendingVerifications > 0
                    ? 'text-red-600 dark:text-red-500'
                    : 'text-gray-400 dark:text-neutral-500'
                }`}
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
              <span className="text-xs font-medium text-gray-600 dark:text-neutral-400">
                Verificaciones
              </span>
            </div>
            <p
              className={`text-2xl font-semibold ${
                metrics.pendingVerifications > 0
                  ? 'text-red-800 dark:text-red-400'
                  : 'text-gray-800 dark:text-neutral-200'
              }`}
            >
              {metrics.pendingVerifications}
            </p>
          </div>

          {/* Active Posts */}
          <div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="flex items-center gap-x-2 mb-2">
              <svg
                className="shrink-0 size-4 text-gray-400 dark:text-neutral-500"
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
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <line x1="3" x2="21" y1="9" y2="9" />
                <line x1="9" x2="9" y1="21" y2="9" />
              </svg>
              <span className="text-xs font-medium text-gray-600 dark:text-neutral-400">
                Publicaciones Activas
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
              {metrics.activePosts}
            </p>
          </div>

          {/* Recent Updates */}
          <div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="flex items-center gap-x-2 mb-2">
              <svg
                className="shrink-0 size-4 text-gray-400 dark:text-neutral-500"
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
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-xs font-medium text-gray-600 dark:text-neutral-400">
                Actualizaciones Recientes
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
              {metrics.recentUpdates}
            </p>
          </div>
        </div>
        {/* End Stats Grid */}
      </div>
      {/* End Body */}
    </div>
  )
}

