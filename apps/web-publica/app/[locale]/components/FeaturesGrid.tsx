'use client';

import Image from 'next/image';
import type { FeatureGridItem } from '../lib/features-grid-data';

interface FeaturesGridProps {
  title: string;
  description?: string;
  items: FeatureGridItem[];
  className?: string;
}

export default function FeaturesGrid({
  title,
  description,
  items,
  className = '',
}: FeaturesGridProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`pb-10 md:pt-10 pb-20 ${className}`}>
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Heading */}
        <div className="mb-8 md:mb-16 max-w-xl mx-auto text-center">
          <h2 className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-gray-500 dark:text-neutral-400">{description}</p>
          )}
        </div>
        {/* End Heading */}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden grid grid-cols-2 items-center gap-6 lg:gap-8"
            >
              <div className="bg-gray-100 dark:bg-neutral-700 rounded-xl">
                <div className="pt-6 ps-6 sm:pt-10 sm:ps-10 relative z-10 overflow-hidden ms-auto">
                  <Image
                    className="dark:hidden rounded-tl-lg shadow-xl"
                    src={item.lightImage}
                    alt={item.alt}
                    width={588}
                    height={530}
                    sizes="(max-width: 768px) 588px, 296px"
                    quality={75}
                  />
                  <Image
                    className="hidden dark:block rounded-tl-lg shadow-xl"
                    src={item.darkImage}
                    alt={item.alt}
                    width={588}
                    height={530}
                    sizes="(max-width: 768px) 588px, 296px"
                    quality={75}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 dark:text-neutral-200">{item.title}</h4>

                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-neutral-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* End Grid */}
      </div>
    </div>
  );
}
