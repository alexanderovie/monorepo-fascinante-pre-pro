'use client';

import type { StatItem } from '../lib/about-data';

interface StatsGridProps {
  items: StatItem[];
  className?: string;
}

export default function StatsGrid({ items, className = '' }: StatsGridProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`py-10 ${className}`}>
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                  {item.value}
                </span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                  {item.label}
                </span>
              </div>
              {item.description && (
                <p className="text-xs text-gray-500 dark:text-neutral-500">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

