import type { StatItem } from '../lib/stats-data';

interface StatsProps {
  items: StatItem[];
  className?: string;
}

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
  </svg>
);

/**
 * Stats Component
 * Actualizado: Noviembre 2025
 * Idéntico a plantilla HTML proporcionada
 */
export default function Stats({ items, className = '' }: StatsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`max-w-[85rem] pt-12 pb-12 px-4 sm:px-6 lg:px-8 mx-auto ${className}`}>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-y-20 gap-x-12">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative px-3 text-center last:before:hidden sm:last:before:block sm:first:before:hidden before:absolute before:top-full sm:before:top-1/2 before:start-1/2 sm:before:-start-6 before:w-px before:h-20 before:bg-gray-200 before:rotate-[60deg] sm:before:rotate-12 before:transform sm:before:-translate-y-1/2 before:-translate-x-1/2 sm:before:-translate-x-0 dark:before:bg-neutral-700"
          >
            <h3 className="font-semibold text-lg sm:text-3xl text-gray-800 dark:text-neutral-200">
              {item.value}
            </h3>

            <div className="mt-3 flex justify-center items-center gap-x-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <StarIcon
                  key={starIndex}
                  className="shrink-0 size-5 text-blue-600 dark:text-blue-500"
                />
              ))}
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                {item.description}
              </p>
            </div>

            {item.logoSvg && (
              <svg
                className="mt-5 shrink-0 w-auto h-6 mx-auto text-gray-800 dark:text-neutral-200"
                width={item.logoWidth || '390'}
                height={item.logoHeight || '87'}
                viewBox={item.logoViewBox || '0 0 390 87'}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={{ __html: item.logoSvg }}
              />
            )}
          </div>
        ))}
      </div>
      {/* End Grid */}
    </div>
  );
}
