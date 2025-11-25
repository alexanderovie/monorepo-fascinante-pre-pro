'use client';

import type { ContactInfo } from '../lib/contact-data';

interface ContactInfoProps {
  items: ContactInfo[];
  className?: string;
}

export default function ContactInfo({ items, className = '' }: ContactInfoProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-x-4">
            <div className="flex-shrink-0 w-12 h-12 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
              {item.icon}
            </div>
            <div className="grow">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                {item.label}
              </h3>
              {item.href ? (
                <a
                  href={item.href}
                  className="mt-1 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

