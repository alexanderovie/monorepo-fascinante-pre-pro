'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { ProductItem } from '../lib/products-data';

interface ProductsCarouselProps {
  title?: string;
  items: ProductItem[];
  carouselId?: string;
  className?: string;
}

export default function ProductsCarousel({
  title = 'Products',
  items,
  carouselId = 'hs-products-carousel',
  className = '',
}: ProductsCarouselProps) {
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;

    const initCarousel = () => {
      if (typeof window === 'undefined') {
        return false;
      }

      const carouselElement = document.querySelector(`#${carouselId}`);
      if (!carouselElement) {
        return false;
      }

      // Check if Preline is loaded
      if (!window.HSStaticMethods) {
        return false;
      }

      // Use autoInit which is safer and handles initialization properly
      if (typeof window.HSStaticMethods.autoInit === 'function') {
        try {
          window.HSStaticMethods.autoInit();
          return true;
        } catch (error) {
          console.error(`Error in autoInit for carousel: ${carouselId}`, error);
          return false;
        }
      }

      // Fallback: try direct initialization if autoInit is not available
      if (
        window.HSCarousel &&
        typeof window.HSCarousel.getInstance === 'function'
      ) {
        try {
          const instance = window.HSCarousel.getInstance(`#${carouselId}`, true);
          if (instance && instance.element) {
            return true;
          }
        } catch (error) {
          console.error(`Error initializing carousel: ${carouselId}`, error);
        }
      }

      return false;
    };

    // Wait for Preline to be fully loaded with retry logic
    const checkAndInit = () => {
      const success = initCarousel();

      if (!success && retryCount < maxRetries) {
        retryCount++;
        setTimeout(checkAndInit, 150);
      } else if (!success) {
        console.warn(
          `Failed to initialize carousel after ${maxRetries} attempts: ${carouselId}`
        );
      }
    };

    // Start initialization after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      checkAndInit();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [carouselId]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`pt-10 pb-20 overflow-hidden ${className}`}>
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div
          id={carouselId}
          data-hs-carousel={`{"loadingClasses": "opacity-0", "slidesQty": {"xs": 1, "sm": 2, "lg": 3}, "isDraggable": true}`}
          className="relative"
        >
          {/* Heading */}
          <div className="mb-5 md:mb-8 grid grid-cols-2 items-center gap-3">
            <div className="grow">
              <h2 className="font-semibold text-xl md:text-2xl text-gray-800 dark:text-neutral-200">
                {title}
              </h2>
            </div>

            {/* Nav */}
            <div className="ms-auto flex justify-center items-center gap-x-2">
              <button
                type="button"
                className="hs-carousel-prev hs-carousel-disabled:opacity-50 hs-carousel-disabled:cursor-default hs-carousel-disabled:hover:bg-white dark:hs-carousel-disabled:hover:bg-neutral-900 inline-flex justify-center items-center size-8 sm:size-10 bg-white border border-gray-100 text-gray-800 rounded-full shadow-2xs hover:bg-gray-100 focus:outline-hidden dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                <span className="text-2xl" aria-hidden="true">
                  <svg
                    className="shrink-0 size-5"
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
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </span>
                <span className="sr-only">Previous</span>
              </button>
              <button
                type="button"
                className="hs-carousel-next hs-carousel-disabled:opacity-50 hs-carousel-disabled:cursor-default hs-carousel-disabled:hover:bg-white dark:hs-carousel-disabled:hover:bg-neutral-900 inline-flex justify-center items-center size-8 sm:size-10 bg-white border border-gray-100 text-gray-800 rounded-full shadow-2xs hover:bg-gray-100 focus:outline-hidden dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                <span className="sr-only">Next</span>
                <span className="text-2xl" aria-hidden="true">
                  <svg
                    className="shrink-0 size-5"
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
                </span>
              </button>
            </div>
            {/* End Nav */}
          </div>
          {/* End Heading */}

          {/* Carousel */}
          <div className="hs-carousel w-full">
            <div className="hs-carousel-body flex flex-nowrap gap-3 md:gap-5 opacity-0 transition-transform duration-700 cursor-grab hs-carousel-dragging:transition-none hs-carousel-dragging:cursor-grabbing">
              {items.map((item) => (
                <div key={item.id} className="hs-carousel-slide">
                  {/* Card */}
                  <a
                    className="group overflow-hidden size-full flex flex-col focus:outline-hidden"
                    href={item.href}
                  >
                    <div className="relative">
                      <div className="pt-6 ps-6 sm:pt-10 sm:ps-10 relative z-10 overflow-hidden ms-auto">
                        <Image
                          className="dark:hidden translate-x-2 group-hover:translate-x-0.5 group-focus:translate-x-0.5 transition-transform duration-300 border-t-10 border-s-10 border-white/50 rounded-tl-2xl shadow-xl dark:border-black/50"
                          src={item.lightImage}
                          alt={item.alt}
                          width={588}
                          height={530}
                          sizes="(max-width: 640px) 336px, (max-width: 768px) 588px, 296px"
                          quality={75}
                        />
                        <Image
                          className="hidden dark:block translate-x-2 group-hover:translate-x-0.5 group-focus:translate-x-0.5 transition-transform duration-300 border-t-10 border-s-10 border-white/50 rounded-tl-2xl shadow-xl dark:border-black/50"
                          src={item.darkImage}
                          alt={item.alt}
                          width={588}
                          height={530}
                          sizes="(max-width: 640px) 336px, (max-width: 768px) 588px, 296px"
                          quality={75}
                        />
                      </div>

                      <div className="size-full absolute inset-0 size-full rounded-xl">
                        <Image
                          className="size-full object-cover object-center rounded-xl opacity-40"
                          src={item.backgroundImage}
                          alt="Background Image"
                          fill
                          sizes="(max-width: 768px) 100vw, 480px"
                          quality={75}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-x-5">
                      <div className="grow">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-500">
                          {item.category}
                        </p>

                        <h4 className="mt-2 text-sm sm:text-base text-gray-800 dark:text-neutral-200">
                          {item.title}
                        </h4>
                      </div>

                      <div>
                        <span className="flex shrink-0 justify-center items-center size-10 bg-white border border-gray-100 text-gray-800 rounded-full group-hover:bg-blue-100 group-hover:border-blue-100 group-hover:text-blue-600 group-focus:bg-blue-100 group-focus:border-blue-100 group-focus:text-blue-600 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:group-hover:bg-blue-800/50 dark:group-hover:border-blue-800/10 dark:group-hover:text-blue-500 dark:group-focus:bg-blue-800/10 dark:group-focus:border-blue-800/50 dark:group-focus:text-blue-500">
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
                  </a>
                  {/* End Card */}
                </div>
              ))}
            </div>
          </div>
          {/* End Carousel */}
        </div>
      </div>
    </div>
  );
}
