'use client';

import type { TestimonialData } from '../lib/testimonial-data';

interface TestimonialProps {
  data: TestimonialData;
  className?: string;
}

export default function Testimonial({ data, className = '' }: TestimonialProps) {
  if (!data) {
    return null;
  }

  return (
    <div className={`mt-10 md:mt-20 ${className}`}>
      {/* Blockquote */}
      <blockquote className="max-w-xl mx-auto text-center">
        {data.logo && (
          <div className="mb-3 py-3 flex items-center text-sm text-gray-800 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:before:border-neutral-700 dark:after:border-neutral-700">
            {data.logo}
          </div>
        )}

        <p className="text-gray-800 dark:text-neutral-200">{data.quote}</p>

        <footer className="mt-4 text-sm text-gray-800 dark:text-neutral-200">
          {data.author}
          {data.authorRole && <span className="opacity-70">, {data.authorRole}</span>}
        </footer>
      </blockquote>
      {/* End Blockquote */}
    </div>
  );
}
