/**
 * Location Detail Skeleton
 *
 * ÉLITE: Loading skeleton para página de detalle de ubicación
 * Mejora UX durante carga de datos
 */

export default function LocationDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 dark:bg-neutral-700"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-neutral-700"></div>
      </div>

      {/* Info Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700"
          >
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-3 dark:bg-neutral-700"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-neutral-700"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
