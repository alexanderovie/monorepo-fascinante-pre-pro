import type { QuotaUsage } from '@/lib/gbp/types'

interface QuotaUsageCardProps {
  quotaUsage: QuotaUsage
}

/**
 * Quota Usage Card Component
 *
 * Muestra el uso de cuota de la API de Google Business Profile.
 * Alerta cuando el uso está por encima del 80%.
 * Server Component - Datos estáticos.
 */
export default function QuotaUsageCard({ quotaUsage }: QuotaUsageCardProps) {
  const isHighUsage = quotaUsage.percentageUsed > 80
  const isWarning = quotaUsage.percentageUsed > 60

  const getQuotaColor = () => {
    if (isHighUsage) return 'text-red-600 dark:text-red-500'
    if (isWarning) return 'text-yellow-600 dark:text-yellow-500'
    return 'text-green-600 dark:text-green-500'
  }

  const getQuotaBgColor = () => {
    if (isHighUsage) return 'bg-red-100 dark:bg-red-900/20'
    if (isWarning) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-green-100 dark:bg-green-900/20'
  }

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="p-5 pb-3 flex justify-between items-center">
        <h2 className="ms-1 inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
          Quota Usage
        </h2>
        {isHighUsage && (
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
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            Alto uso
          </span>
        )}
      </div>
      {/* End Header */}

      {/* Body */}
      <div className="flex flex-col justify-between h-full pb-5 px-5">
        {/* Main Metric */}
        <div>
          <h4 className={`text-4xl md:text-5xl font-medium ${getQuotaColor()}`}>
            {quotaUsage.percentageUsed.toFixed(1)}%
          </h4>
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-500">
            {quotaUsage.currentQPM} / {quotaUsage.maxQPM} QPM
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-neutral-400">
              Queries Per Minute
            </span>
            <span className={`text-xs font-medium ${getQuotaColor()}`}>
              {quotaUsage.maxQPM - quotaUsage.currentQPM} restantes
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
            <div
              className={`h-full transition-all ${getQuotaBgColor()} ${
                isHighUsage
                  ? 'bg-red-600 dark:bg-red-500'
                  : isWarning
                    ? 'bg-yellow-600 dark:bg-yellow-500'
                    : 'bg-green-600 dark:bg-green-500'
              }`}
              style={{ width: `${quotaUsage.percentageUsed}%` }}
            />
          </div>
        </div>

        {/* Edits Per Minute */}
        <div className="mt-6 p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-neutral-400">
              Ediciones por minuto
            </span>
            <span className="text-xs font-medium text-gray-800 dark:text-neutral-200">
              {quotaUsage.remainingEditsPerMinute} / {quotaUsage.maxEditsPerMinute}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500"
              style={{
                width: `${(quotaUsage.remainingEditsPerMinute / quotaUsage.maxEditsPerMinute) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-xs text-gray-500 dark:text-neutral-400" suppressHydrationWarning>
          Última actualización:{' '}
          {new Date(quotaUsage.lastUpdated).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
      {/* End Body */}
    </div>
  )
}
