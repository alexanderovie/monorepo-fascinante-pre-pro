'use client';

import { useEffect } from 'react';
import type { FAQItem } from '../lib/faq-data';

interface FAQProps {
  title?: string;
  description?: string;
  items: FAQItem[];
  accordionGroupId?: string;
  className?: string;
}

export default function FAQ({
  title = 'Your questions, answered',
  description = 'Answers to the most frequently asked questions.',
  items,
  accordionGroupId = 'hs-faq-accordion-group',
  className = '',
}: FAQProps) {
  useEffect(() => {
    const initAccordions = () => {
      if (
        typeof window === 'undefined' ||
        !window.HSStaticMethods ||
        !window.HSAccordion
      ) {
        return;
      }

      // Preline UI auto-initializes accordions, but we ensure they're ready
      setTimeout(() => {
        if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
          window.HSStaticMethods.autoInit();
        }
      }, 100);
    };

    initAccordions();
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`pt-10 pb-20 ${className}`}>
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Title */}
        <div className="mb-8 max-w-2xl mx-auto text-center">
          <h2 className="font-semibold text-3xl text-gray-800 dark:text-neutral-200">
            {title}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-neutral-400">{description}</p>
        </div>
        {/* End Title */}

        <div className="max-w-2xl mx-auto">
          {/* Accordion */}
          <div className={accordionGroupId}>
            {items.map((item) => (
              <div
                key={item.id}
                className={`hs-accordion hs-accordion-active:bg-gray-100 p-6 rounded-xl dark:hs-accordion-active:bg-neutral-800 ${
                  item.isOpen ? 'active' : ''
                }`}
                id={`hs-faq-${item.id}`}
              >
                <button
                  className="hs-accordion-toggle group inline-flex items-center justify-between gap-x-3 w-full font-medium text-start text-gray-800 focus:outline-hidden dark:text-neutral-200"
                  aria-expanded={item.isOpen}
                  aria-controls={`hs-faq-content-${item.id}`}
                >
                  {item.question}
                  <svg
                    className="hs-accordion-active:hidden block shrink-0 size-5"
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
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  <svg
                    className="hs-accordion-active:block hidden shrink-0 size-5"
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
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </button>
                <div
                  id={`hs-faq-content-${item.id}`}
                  className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                    item.isOpen ? '' : 'hidden'
                  }`}
                  role="region"
                  aria-labelledby={`hs-faq-${item.id}`}
                >
                  <div className="pt-3">
                    <p className="text-gray-800 dark:text-neutral-200">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* End Accordion */}
        </div>
      </div>
    </div>
  );
}
