'use client';

import type { ValueItem } from '../lib/about-data';

interface ValuesGridProps {
  items: ValueItem[];
  className?: string;
}

export default function ValuesGrid({ items, className = '' }: ValuesGridProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`py-10 ${className}`}>
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="mb-2 font-semibold text-gray-800 dark:text-neutral-200">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

