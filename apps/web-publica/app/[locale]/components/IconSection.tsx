'use client';

import type { IconSectionItem } from '../lib/icon-section-data';

interface IconSectionProps {
  badge?: string;
  title: string;
  items: IconSectionItem[];
  className?: string;
}

export default function IconSection({
  badge = 'From beginners to experts',
  title,
  items,
  className = '',
}: IconSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`max-w-6xl py-10 py-20 px-4 sm:px-6 lg:px-8 mx-auto ${className}`}>
      {/* Heading */}
      <div className="mb-8 md:mb-16 max-w-xl mx-auto text-center">
        <p className="mb-2 font-mono text-sm text-gray-500 dark:text-neutral-400">{badge}</p>
        <h2 className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
          {title}
        </h2>
      </div>
      {/* End Heading */}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-x-10 md:gap-y-12 lg:gap-x-16">
        {items.map((item) => (
          <div key={item.id}>
            {item.icon}

            <h4 className="font-medium text-gray-800 dark:text-neutral-200">{item.title}</h4>

            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-neutral-500">{item.description}</p>
            </div>
            {item.learnMoreLink && (
              <div className="mt-3">
                <a
                  className="text-sm text-blue-600 hover:decoration-2 underline underline-offset-4 focus:outline-hidden focus:decoration-2 dark:text-blue-500"
                  href={item.learnMoreLink}
                >
                  Learn more about {item.title}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* End Grid */}
    </div>
  );
}
