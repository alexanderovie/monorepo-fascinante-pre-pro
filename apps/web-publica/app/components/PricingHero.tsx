'use client';

interface PricingHeroProps {
  badge?: string;
  title: string;
  description?: string;
  billingToggle?: {
    monthly: string;
    yearly: string;
    onToggle: (period: 'monthly' | 'yearly') => void;
    period: 'monthly' | 'yearly';
  };
  className?: string;
}

export default function PricingHero({
  badge = 'Pricing',
  title,
  description,
  billingToggle,
  className = '',
}: PricingHeroProps) {
  return (
    <div className={`pt-10 pb-6 ${className}`}>
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <p className="mb-3 font-mono text-sm text-gray-500 dark:text-neutral-400">
            {badge}
          </p>

          <h1 className="font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-white">
            {title}
          </h1>

          {description && (
            <p className="mt-5 text-sm md:text-lg text-gray-800 dark:text-gray-200">
              {description}
            </p>
          )}

          {billingToggle && (
            <div className="mt-8 flex justify-center">
              <div className="relative inline-flex gap-x-1 p-1 bg-gray-100 border border-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => billingToggle.onToggle('monthly')}
                  className={`py-2 px-4 text-sm font-medium rounded-md transition-colors focus:outline-hidden ${
                    billingToggle.period === 'monthly'
                      ? 'bg-white text-gray-800 shadow-sm dark:bg-neutral-700 dark:text-neutral-200'
                      : 'text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  {billingToggle.monthly}
                </button>
                <button
                  type="button"
                  onClick={() => billingToggle.onToggle('yearly')}
                  className={`py-2 px-4 text-sm font-medium rounded-md transition-colors focus:outline-hidden ${
                    billingToggle.period === 'yearly'
                      ? 'bg-white text-gray-800 shadow-sm dark:bg-neutral-700 dark:text-neutral-200'
                      : 'text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  {billingToggle.yearly}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

