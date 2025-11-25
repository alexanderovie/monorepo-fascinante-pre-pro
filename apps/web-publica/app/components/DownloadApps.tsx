'use client';

import type { DownloadAppItem } from '../lib/download-apps-data';

interface DownloadAppsProps {
  badge?: string;
  title: string;
  items: DownloadAppItem[];
  className?: string;
}

export default function DownloadApps({
  badge = 'Preline Apps',
  title,
  items,
  className = '',
}: DownloadAppsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-100 dark:bg-neutral-800 ${className}`}>
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="py-14 lg:py-20">
          {/* Heading */}
          <div className="mb-8 md:mb-16 max-w-xl mx-auto text-center">
            <p className="mb-2 font-mono text-sm text-gray-500 dark:text-neutral-400">{badge}</p>
            <h2 className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
              {title}
            </h2>
          </div>
          {/* End Heading */}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-8 bg-white flex flex-col text-center rounded-xl dark:bg-neutral-900"
              >
                <div className="mb-5">{item.icon}</div>
                <h3 className="font-medium text-gray-800 dark:text-neutral-200">{item.name}</h3>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                    {item.description}
                  </p>
                )}
                <a
                  className="mt-4 py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
                  href={item.href}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
          {/* End Grid */}
        </div>
      </div>
    </div>
  );
}
