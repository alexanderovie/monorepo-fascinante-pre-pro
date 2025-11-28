'use client';

import type { PricingPlan } from '../lib/pricing-data';

interface PricingCardProps {
  plan: PricingPlan;
  billingPeriod?: 'monthly' | 'yearly';
  className?: string;
}

const CheckIcon = () => (
  <svg
    className="shrink-0 size-4 text-blue-600 dark:text-blue-500"
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

const XIcon = () => (
  <svg
    className="shrink-0 size-4 text-gray-400 dark:text-neutral-500"
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function PricingCard({
  plan,
  billingPeriod = 'monthly',
  className = '',
}: PricingCardProps) {
  const price = billingPeriod === 'yearly' && plan.price.yearly
    ? plan.price.yearly
    : plan.price.monthly;

  return (
    <div
      className={`relative flex flex-col p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow dark:bg-neutral-900 dark:border-neutral-700 ${
        plan.popular
          ? 'ring-2 ring-blue-600 dark:ring-blue-500'
          : ''
      } ${className}`}
    >
      {plan.popular && plan.badge && (
        <span className="absolute top-0 start-0 -translate-y-1/2 translate-x-1/2 py-1.5 px-3 inline-flex items-center gap-x-1 text-xs font-semibold rounded-full border border-blue-600 bg-blue-600 text-white dark:bg-blue-500 dark:border-blue-500">
          {plan.badge}
        </span>
      )}

      <div className="mb-5">
        <h3 className="mb-1 text-xl font-semibold text-gray-800 dark:text-neutral-200">
          {plan.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-neutral-500">
          {plan.description}
        </p>
      </div>

      <div className="mb-5">
        <div className="flex items-baseline gap-x-1">
          <span className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-neutral-200">
            {price}
          </span>
          {plan.price.period && (
            <span className="text-lg text-gray-500 dark:text-neutral-500">
              {plan.price.period}
            </span>
          )}
        </div>
        {billingPeriod === 'yearly' && plan.price.yearly && (
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
            Billed annually
          </p>
        )}
      </div>

      <ul className="space-y-2.5 mb-8">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex gap-x-2">
            {feature.included ? (
              <CheckIcon />
            ) : (
              <XIcon />
            )}
            <span
              className={`text-sm ${
                feature.included
                  ? 'text-gray-800 dark:text-neutral-200'
                  : 'text-gray-400 dark:text-neutral-500 line-through'
              }`}
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <a
        className={`py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border transition-colors focus:outline-hidden ${
          plan.cta.variant === 'primary'
            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-gray-600'
            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-gray-600'
        }`}
        href={plan.cta.href}
      >
        {plan.cta.label}
      </a>
    </div>
  );
}

