'use client';

import type { FeatureItem } from '../lib/features-data';

interface FeaturesProps {
  badge?: string;
  title: string;
  items: FeatureItem[];
  className?: string;
}

export default function Features({
  badge = 'What we do',
  title,
  items,
  className = '',
}: FeaturesProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`lg:pt-10 pb-20 ${className}`}>
      <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Heading */}
        <div className="mb-8 md:mb-16 max-w-xl mx-auto text-center">
          <p className="mb-2 font-mono text-sm text-gray-500 dark:text-neutral-400">
            {badge}
          </p>
          <h2 className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
            {title}
          </h2>
        </div>
        {/* End Heading */}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 sm:gap-x-10 lg:gap-y-12 lg:gap-x-16">
          {items.map((item) => (
            <div key={item.id} className="flex gap-5">
              {item.icon}
              <div className="grow">
                <h4 className="font-medium text-gray-800 dark:text-neutral-200">
                  {item.title}
                </h4>
                <p className="mt-1 text-gray-500 dark:text-neutral-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* End Grid */}
      </div>
    </div>
  );
}
