'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Customer } from '../lib/customers-data';

interface CustomerCardProps {
  customer: Customer;
  className?: string;
}

export default function CustomerCard({ customer, className = '' }: CustomerCardProps) {
  return (
    <div
      className={`group flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow dark:bg-neutral-900 dark:border-neutral-700 ${className}`}
    >
      <div className="flex items-center gap-x-4 mb-4">
        <div className="shrink-0">
          <Image
            src={customer.logo}
            alt={`${customer.name} logo`}
            width={64}
            height={64}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="grow">
          <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
            {customer.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            {customer.industry}
          </p>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600 dark:text-neutral-400">
        {customer.description}
      </p>

      {customer.metrics && (
        <div className="mb-4 grid grid-cols-3 gap-2">
          {customer.metrics.map((metric, idx) => (
            <div key={idx} className="text-center">
              <div className="font-semibold text-gray-800 dark:text-neutral-200">
                {metric.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-neutral-500">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/customer-details?id=${customer.id}`}
        className="mt-auto py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-blue-700 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        View Case Study
        <svg
          className="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}


