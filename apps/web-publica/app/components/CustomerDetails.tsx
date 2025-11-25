'use client';

import Image from 'next/image';
import type { Customer } from '../lib/customers-data';

interface CustomerDetailsProps {
  customer: Customer;
  className?: string;
}

const CheckIcon = () => (
  <svg
    className="shrink-0 size-5 text-blue-600 dark:text-blue-500"
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
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function CustomerDetails({ customer, className = '' }: CustomerDetailsProps) {
  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="shrink-0">
          <Image
            src={customer.logo}
            alt={`${customer.name} logo`}
            width={120}
            height={120}
            className="rounded-xl object-cover"
          />
        </div>
        <div className="grow">
          <h1 className="mb-2 font-bold text-3xl sm:text-4xl text-gray-800 dark:text-white">
            {customer.name}
          </h1>
          <p className="mb-2 text-lg text-gray-500 dark:text-neutral-400">
            {customer.industry}
          </p>
          <p className="text-gray-600 dark:text-neutral-300">
            {customer.description}
          </p>
        </div>
      </div>

      {/* Metrics */}
      {customer.metrics && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {customer.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-neutral-900 dark:border-neutral-700"
            >
              <div className="mb-2 font-bold text-2xl text-gray-800 dark:text-white">
                {metric.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-neutral-500">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonial */}
      {customer.testimonial && (
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <blockquote className="mb-4 text-lg text-gray-800 dark:text-neutral-200">
            &ldquo;{customer.testimonial.quote}&rdquo;
          </blockquote>
          <div className="flex items-center gap-x-3">
            <Image
              src={customer.testimonial.avatar}
              alt={customer.testimonial.author}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-800 dark:text-neutral-200">
                {customer.testimonial.author}
              </div>
              <div className="text-sm text-gray-500 dark:text-neutral-500">
                {customer.testimonial.role}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Study */}
      {customer.caseStudy && (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-neutral-900 dark:border-neutral-700">
          <h2 className="mb-4 font-semibold text-2xl text-gray-800 dark:text-neutral-200">
            {customer.caseStudy.title}
          </h2>
          <p className="mb-6 text-gray-600 dark:text-neutral-400">
            {customer.caseStudy.description}
          </p>
          <h3 className="mb-4 font-semibold text-lg text-gray-800 dark:text-neutral-200">
            Key Results:
          </h3>
          <ul className="space-y-3">
            {customer.caseStudy.results.map((result, idx) => (
              <li key={idx} className="flex gap-x-3">
                <CheckIcon />
                <span className="text-gray-600 dark:text-neutral-300">{result}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

