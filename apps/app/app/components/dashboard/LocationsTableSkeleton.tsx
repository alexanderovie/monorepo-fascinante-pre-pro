/**
 * Locations Table Skeleton Component
 *
 * Skeleton loader para la tabla de locations durante streaming.
 * Mantiene la misma estructura visual que la tabla real para evitar layout shift.
 */

export default function LocationsTableSkeleton() {
  return (
    <div className="p-5 space-y-4 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center gap-x-5">
        <div className="h-6 w-48 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
        <div className="h-9 w-32 bg-gray-200 rounded-lg dark:bg-neutral-700 animate-pulse"></div>
      </div>

      {/* Filter Group Skeleton */}
      <div className="grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-5">
        <div className="h-10 bg-gray-200 rounded-lg dark:bg-neutral-700 animate-pulse"></div>
        <div className="flex md:justify-end items-center gap-x-2">
          <div className="h-10 w-32 bg-gray-200 rounded-lg dark:bg-neutral-700 animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-lg dark:bg-neutral-700 animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead>
              <tr className="border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <th key={i} scope="col" className="px-3 py-2.5">
                    <div className="h-4 w-20 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="divide-x divide-gray-200 dark:divide-neutral-700">
                  {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                    <td key={cell} className="size-px whitespace-nowrap">
                      <div className="px-5 py-2">
                        <div className="h-4 w-24 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="grid grid-cols-2 items-center gap-y-2 sm:gap-y-0 sm:gap-x-5">
        <div className="h-5 w-32 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
        <div className="flex justify-end items-center gap-x-1">
          <div className="h-9 w-9 bg-gray-200 rounded-lg dark:bg-neutral-700 animate-pulse"></div>
          <div className="h-9 w-16 bg-gray-200 rounded-lg dark:bg-neutral-700 animate-pulse"></div>
          <div className="h-9 w-9 bg-gray-200 rounded-lg dark:bg-neutral-700 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

