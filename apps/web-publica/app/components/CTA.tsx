'use client';

import React from 'react';

interface CTAProps {
  badge?: string;
  title: string | React.ReactNode;
  primaryButton?: {
    label: string;
    href: string;
  };
  secondaryButton?: {
    label: string;
    href: string;
  };
  className?: string;
}

export default function CTA({
  badge = 'Get started',
  title,
  primaryButton = { label: 'Try it free', href: '#' },
  secondaryButton = { label: 'Get a demo', href: '#' },
  className = '',
}: CTAProps) {
  return (
    <div className={`max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto ${className}`}>
      <div className="md:-mx-4 xl:-mx-20 px-4 py-6 md:py-12 xl:p-20 bg-linear-to-b from-gray-100 to-transparent rounded-2xl dark:from-neutral-800">
        <div className="mb-4 sm:mb-8 text-center">
          <p className="mb-2 font-mono text-sm text-gray-500 dark:text-neutral-400">
            {badge}
          </p>
          <h2 className="font-semibold text-2xl sm:text-4xl text-gray-800 dark:text-neutral-200">
            {title}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2">
          {primaryButton && (
            <a
              className="py-2 px-3 md:py-2.5 md:px-4 inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:shadow-none focus:outline-hidden focus:bg-blue-700 focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
              href={primaryButton.href}
            >
              {primaryButton.label}
            </a>
          )}
          {secondaryButton && (
            <a
              className="group py-2 px-3 md:py-2.5 md:px-4 inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg border border-transparent text-gray-800 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden dark:text-neutral-200"
              href={secondaryButton.href}
            >
              {secondaryButton.label}
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  className="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition"
                  d="M5 12h14"
                />
                <path
                  className="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition"
                  d="m12 5 7 7-7 7"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
