import Link from 'next/link';
import type { CaseStudyItem } from '../lib/case-study-data';

interface CaseStudyProps {
  title?: string;
  description?: string;
  items: CaseStudyItem[];
}

/**
 * Case Study Component - Success Stories
 * Server Component para mostrar casos de éxito con métricas
 */
export default function CaseStudy({
  title = 'Success stories',
  description = 'Global brands see measurable success when they collaborate with us. From higher conversion and payment approval rates to faster processing speeds. Discover their stories here.',
  items,
}: CaseStudyProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="md:-mx-4 xl:-mx-20 p-4 pt-6 xl:p-20 bg-gradient-to-b from-gray-100 to-transparent rounded-2xl dark:from-neutral-800">
        {/* Heading */}
        <div className="mb-8 md:mb-16 max-w-xl mx-auto text-center">
          <h2 className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
            {title}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-neutral-400">{description}</p>
        </div>
        {/* End Heading */}

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 items-center">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative z-10 h-full p-4 md:p-6 hover:shadow-sm focus:shadow-sm flex flex-col bg-white focus:outline-hidden rounded-xl transition duration-200 dark:bg-neutral-900"
            >
              <div className="mb-3 md:mb-5 flex items-center gap-x-3">
                {item.icon}
                <div className="grow">
                  <p className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
                    {item.metric}
                  </p>
                </div>
                <div>
                  <span className="flex justify-center items-center size-10 bg-white border border-gray-100 text-gray-800 rounded-full group-hover:bg-blue-100 group-hover:border-blue-100 group-hover:text-blue-600 group-focus:bg-blue-100 group-focus:border-blue-100 group-focus:text-blue-600 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:group-hover:bg-blue-800/50 dark:group-hover:border-blue-800/10 dark:group-hover:text-blue-500 dark:group-focus:bg-blue-800/10 dark:group-focus:border-blue-800/50 dark:group-focus:text-blue-500">
                    <span className="sr-only">Learn more</span>
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
                      <path
                        className="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition lg:duration-200"
                        d="M5 12h14"
                      />
                      <path
                        className="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition lg:duration-200"
                        d="m12 5 7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-5">
                <h3 className="font-medium text-lg text-gray-800 dark:text-neutral-200">
                  {item.title}
                </h3>
                <p className="mt-1 text-gray-500 dark:text-neutral-500">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
        {/* End Card Grid */}
      </div>
    </div>
  );
}
