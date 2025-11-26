'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * FeaturesAccordion Component - Fully customizable rules
 * Client Component con acordeón sincronizado con imágenes
 */
export default function FeaturesAccordion() {
  return (
    <div className="pb-10 md:pt-10 md:pb-20">
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-y-6">
          <div className="md:ps-[15%] md:order-2">
            <div className="mb-8">
              <h2 className="font-semibold text-3xl text-gray-800 dark:text-neutral-200">
                Fully customizable rules to match your unique needs
              </h2>
            </div>

            {/* Accordion Navs */}
            <div className="hs-accordion-group [--keep-one-open:true] flex flex-col">
              <div
                className="hs-accordion py-5 border-b border-gray-200 last:border-b-0 dark:border-neutral-700 active"
                data-hs-target="#hs-pro-dt-ftat"
              >
                <button
                  className="hs-accordion-toggle w-full flex justify-between gap-x-3 text-start"
                  aria-expanded="true"
                  aria-controls="hs-pro-dt-item-ftat"
                >
                  <span className="grow">
                    <span className="block font-medium text-lg text-gray-800 dark:text-neutral-200">
                      Advanced tools
                    </span>
                  </span>
                  <svg
                    className="hs-accordion-active:rotate-180 shrink-0 size-5 text-gray-800 dark:text-neutral-200"
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
                </button>

                <div
                  id="hs-pro-dt-item-ftat"
                  className="hs-accordion-content overflow-hidden transition-[height] duration-300"
                  style={{ display: 'block' }}
                >
                  <p className="mt-2 text-gray-500 dark:text-neutral-400">
                    Use Preline thoroughly thought and automated libraries to manage your businesses.
                  </p>

                  <ul className="mt-3 space-y-1">
                    <li className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-400">
                      <svg
                        className="shrink-0 size-4"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Automate everything
                    </li>
                    <li className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-400">
                      <svg
                        className="shrink-0 size-4"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Connect any type of data
                    </li>
                    <li className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-400">
                      <svg
                        className="shrink-0 size-4"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Powerful reporting
                    </li>
                  </ul>

                  <div className="mt-3">
                    <Link
                      href="#"
                      className="group inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
                    >
                      Learn more
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
                          className="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition"
                          d="M5 12h14"
                        />
                        <path
                          className="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition"
                          d="m12 5 7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              <div
                className="hs-accordion py-5 border-b border-gray-200 last:border-b-0 dark:border-neutral-700"
                data-hs-target="#hs-pro-dt-ftsd"
              >
                <button
                  className="hs-accordion-toggle w-full flex justify-between gap-x-3 text-start"
                  aria-expanded="false"
                  aria-controls="hs-pro-dt-item-ftsd"
                >
                  <span className="grow">
                    <span className="block font-medium text-lg text-gray-800 dark:text-neutral-200">
                      Smart dashboards
                    </span>
                  </span>
                  <svg
                    className="hs-accordion-active:rotate-180 shrink-0 size-5 text-gray-800 dark:text-neutral-200"
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
                </button>

                <div
                  id="hs-pro-dt-item-ftsd"
                  className="hs-accordion-content overflow-hidden transition-[height] duration-300"
                  style={{ display: 'none' }}
                >
                  <p className="mt-2 text-gray-500 dark:text-neutral-400">
                    Quickly Preline sample components, copy-paste codes, and start right off.
                  </p>

                  <ul className="mt-3 space-y-1">
                    <li className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-400">
                      <svg
                        className="shrink-0 size-4"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Connect work to company goals
                    </li>
                    <li className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-400">
                      <svg
                        className="shrink-0 size-4"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Automate workflows across departments
                    </li>
                    <li className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-400">
                      <svg
                        className="shrink-0 size-4"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Report&nbsp;on progress and address bottlenecks
                    </li>
                  </ul>

                  <div className="block mt-2">
                    <Link
                      href="#"
                      className="group inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
                    >
                      Learn more
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
                          className="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition"
                          d="M5 12h14"
                        />
                        <path
                          className="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition"
                          d="m12 5 7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              <div
                className="hs-accordion py-5 border-b border-gray-200 last:border-b-0 dark:border-neutral-700"
                data-hs-target="#hs-pro-dt-ftpf"
              >
                <button
                  className="hs-accordion-toggle w-full flex justify-between gap-x-3 text-start"
                  aria-expanded="false"
                  aria-controls="hs-pro-dt-item-ftpf"
                >
                  <span className="grow">
                    <span className="block font-medium text-lg text-gray-800 dark:text-neutral-200">
                      Powerful features
                    </span>
                  </span>
                  <svg
                    className="hs-accordion-active:rotate-180 shrink-0 size-5 text-gray-800 dark:text-neutral-200"
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
                </button>

                <div
                  id="hs-pro-dt-item-ftpf"
                  className="hs-accordion-content overflow-hidden transition-[height] duration-300"
                  style={{ display: 'none' }}
                >
                  <p className="mt-2 text-gray-500 dark:text-neutral-400">
                    Reduce time and effort&nbsp;on building modern look design with Preline only.
                  </p>

                  <ul className="mt-3 space-y-1">
                    <li className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-400">
                      <svg
                        className="shrink-0 size-4"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Maximize impact
                    </li>
                    <li className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-400">
                      <svg
                        className="shrink-0 size-4"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Drive clarity and accountability
                    </li>
                    <li className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-400">
                      <svg
                        className="shrink-0 size-4"
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
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Scale with confidence
                    </li>
                  </ul>

                  <div className="block mt-2">
                    <Link
                      href="#"
                      className="group inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
                    >
                      Learn more
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
                          className="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition"
                          d="M5 12h14"
                        />
                        <path
                          className="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition"
                          d="m12 5 7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* End Accordion Navs */}
          </div>
          {/* End Col */}

          {/* Accordion Content */}
          <div className="hs-accordion-outside-group relative h-96 md:h-[600px] w-full">
            {/* Card 1 */}
            <div
              id="hs-pro-dt-ftat"
              className="absolute opacity-0 hs-accordion-outside-active:opacity-100 transition-opacity duration-500 active size-full"
            >
              <Image
                src="https://images.unsplash.com/photo-1665686306574-1ace09918530?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=720&q=80"
                alt="Advanced tools"
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* End Card 1 */}

            {/* Card 2 */}
            <div
              id="hs-pro-dt-ftsd"
              className="absolute opacity-0 hs-accordion-outside-active:opacity-100 transition-opacity duration-500 size-full"
            >
              <Image
                src="https://images.unsplash.com/photo-1598929213452-52d72f63e307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=720&q=80"
                alt="Smart dashboards"
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* End Card 2 */}

            {/* Card 3 */}
            <div
              id="hs-pro-dt-ftpf"
              className="absolute opacity-0 hs-accordion-outside-active:opacity-100 transition-opacity duration-500 size-full"
            >
              <Image
                src="https://images.unsplash.com/photo-1720048171256-38c59a19fd37?q=80&w=560&h=720&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Powerful features"
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* End Card 3 */}
          </div>
          {/* End Accordion Content */}
        </div>
        {/* End Grid */}
      </div>
    </div>
  );
}

