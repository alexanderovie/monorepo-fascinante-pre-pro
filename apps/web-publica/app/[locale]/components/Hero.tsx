'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface HeroTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  lightImage: string;
  darkImage: string;
  alt: string;
}

export interface HeroButton {
  label: string;
  href: string;
}

export interface HeroProps {
  badge?: string;
  title: string | React.ReactNode;
  description: string;
  primaryButton?: HeroButton | null;
  secondaryButton?: HeroButton | null;
  downloadSection?: {
    title: string;
    apps: Array<{
      name: string;
      icon: React.ReactNode;
      rating: string;
      reviews: string;
      href: string;
    }>;
  };
  tabs?: HeroTab[];
  backgroundImage?: {
    light: string;
    dark: string;
  };
  showBackground?: boolean;
}

const DEFAULT_BACKGROUND_IMAGE = {
  light: '/assets/img/pro/startup/img11.webp',
  dark: '/assets/img/pro/startup-dark/img11.webp',
};

const DEFAULT_PRIMARY_BUTTON: HeroButton = {
  label: 'Try it free',
  href: '#',
};

const DEFAULT_SECONDARY_BUTTON: HeroButton = {
  label: 'Get a demo',
  href: '#',
};

export const defaultTabs: HeroTab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
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
        <path d="M12 16v5" />
        <path d="M16 14v7" />
        <path d="M20 10v11" />
        <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
        <path d="M4 18v3" />
        <path d="M8 14v7" />
      </svg>
    ),
    lightImage: '/assets/img/pro/startup/dashboard-fascinante.webp',
    darkImage: '/assets/img/pro/startup-dark/dashboard-fascinante.webp',
    alt: 'Dashboard Hero Image',
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: (
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
        <path d="M12 12h.01" />
        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <path d="M22 13a18.15 18.15 0 0 1-20 0" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </svg>
    ),
    lightImage: '/assets/img/pro/startup/img2.webp',
    darkImage: '/assets/img/pro/startup-dark/img2.webp',
    alt: 'Workspace Hero Image',
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: (
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
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      </svg>
    ),
    lightImage: '/assets/img/pro/startup/img3.webp',
    darkImage: '/assets/img/pro/startup-dark/img3.webp',
    alt: 'Payment Hero Image',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
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
        <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      </svg>
    ),
    lightImage: '/assets/img/pro/startup/img4.webp',
    darkImage: '/assets/img/pro/startup-dark/img4.webp',
    alt: 'Analytics Hero Image',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: (
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
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
      </svg>
    ),
    lightImage: '/assets/img/pro/startup/img5.webp',
    darkImage: '/assets/img/pro/startup-dark/img5.webp',
    alt: 'Chat Hero Image',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    icon: (
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
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    lightImage: '/assets/img/pro/startup/img6.webp',
    darkImage: '/assets/img/pro/startup-dark/img6.webp',
    alt: 'E-commerce Hero Image',
  },
];

export default function Hero({
  badge = 'Web App',
  title,
  description,
  primaryButton,
  secondaryButton,
  downloadSection,
  tabs = defaultTabs,
  backgroundImage = DEFAULT_BACKGROUND_IMAGE,
  showBackground = true,
}: HeroProps) {
  // Resolver botones: usar valores por defecto solo si no se pasan explícitamente
  // null significa ocultar explícitamente, undefined significa usar valor por defecto
  const resolvedPrimaryButton = primaryButton === null ? null : primaryButton ?? DEFAULT_PRIMARY_BUTTON;
  const resolvedSecondaryButton = secondaryButton === null ? null : secondaryButton ?? DEFAULT_SECONDARY_BUTTON;
  const hasButtons = resolvedPrimaryButton !== null || resolvedSecondaryButton !== null;

  useEffect(() => {
    const initHeroTabs = () => {
      if (
        typeof window === 'undefined' ||
        !window.HSStaticMethods ||
        !window.HSTabs ||
        !window.HSScrollNav ||
        !window._
      ) {
        return;
      }

      const tabsId = 'hs-pro-hero-tabs';
      const tabsElement = document.querySelector(`#${tabsId}`);
      const scrollNavElement = document.querySelector('#hs-pro-hero-tabs-scroll');

      if (!tabsElement || !scrollNavElement) {
        return;
      }

      const tabs = window.HSTabs.getInstance(`#${tabsId}`, true);
      const scrollNav = window.HSScrollNav.getInstance('#hs-pro-hero-tabs-scroll', true);

      if (!tabs || !scrollNav) {
        return;
      }

      tabs.element.on('change', ({ el }: { el: HTMLElement }) => {
        scrollNav.element.centerElement(el);
      });

      const handleResize = window._.debounce(() => {
        scrollNav.element.centerElement(tabs.element.current);
      }, 100);

      window.addEventListener('resize', handleResize);

      const handleTabChange = ({ detail }: CustomEvent) => {
        if (detail?.payload?.tabsId !== tabsId) {
          return;
        }

        const tabsContainer = document.querySelector('#hs-pro-hero-tabs-scroll');
        if (tabsContainer) {
          window.scrollTo({
            top: (tabsContainer as HTMLElement).offsetTop,
            behavior: 'smooth',
          });
        }
      };

      window.addEventListener('change.hs.tab', handleTabChange as EventListener);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('change.hs.tab', handleTabChange as EventListener);
      };
    };

    // Wait for Preline UI to be ready
    const timer = setTimeout(() => {
      initHeroTabs();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative bg-no-repeat bg-cover bg-top">
      {/* Background Image Light - LCP Optimized */}
      {showBackground && (
        <>
          <div className="absolute top-16 left-0 right-0 bottom-0 dark:hidden md:top-0">
            <Image
              src={backgroundImage.light}
              alt="Hero background"
              fill
              priority
              fetchPriority="high"
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              quality={85}
            />
          </div>
          {/* Background Image Dark */}
          <div className="absolute top-16 left-0 right-0 bottom-0 hidden dark:block md:top-0">
            <Image
              src={backgroundImage.dark}
              alt="Hero background dark"
              fill
              priority
              fetchPriority="high"
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              quality={85}
            />
          </div>
        </>
      )}
      <div className="pt-10 md:pt-20 pb-0 relative z-10">
        <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
          {/* Grid */}
          <div className="mb-4 md:mb-8 grid md:grid-cols-12 items-center gap-y-12 gap-x-5 lg:gap-x-8">
            <div className="md:col-span-8 md:col-start-3 lg:col-span-8 lg:col-start-3 text-left md:text-center">
              <p className="mb-3 md:mb-4 font-mono text-sm text-gray-500 dark:text-neutral-400">
                {badge}
              </p>

              <h1 className="font-bold text-gray-800 text-4xl md:text-5xl lg:text-5xl dark:text-white">
                {title}
              </h1>

              <p className="mt-5 text-sm md:text-lg text-gray-800 dark:text-gray-200">
                {description}
              </p>

              {hasButtons && (
                <div className="mt-5 flex flex-wrap items-center gap-2 md:justify-center">
                  {resolvedPrimaryButton && (
                    <a
                      className="py-2 px-3 md:py-2.5 md:px-4 inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:shadow-none focus:outline-hidden focus:bg-blue-700 focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
                      href={resolvedPrimaryButton.href}
                    >
                      {resolvedPrimaryButton.label}
                    </a>
                  )}
                  {resolvedSecondaryButton && (
                    <a
                      className="group py-2 px-3 md:py-2.5 md:px-4 inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm font-semibold rounded-lg border border-transparent text-gray-800 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden dark:text-neutral-200"
                      href={resolvedSecondaryButton.href}
                    >
                      {resolvedSecondaryButton.label}
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
                    </a>
                  )}
                </div>
              )}
            </div>
            {/* End Col */}

            {downloadSection && (
              <div className="hidden">
                <div className="max-w-xs w-full md:ms-auto">
                  <p className="mb-2 font-mono text-sm text-gray-500 dark:text-neutral-400">
                    {downloadSection.title}
                  </p>

                  {/* Card List Group */}
                  <div className="flex flex-col -space-y-px">
                    {downloadSection.apps.map((app) => (
                      <a
                        key={app.name}
                        className="p-3 sm:p-4 flex items-center gap-x-2 bg-white border border-gray-200 first:rounded-t-xl last:rounded-b-xl hover:border-gray-300 focus:outline-hidden focus:border-gray-300 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-700 dark:focus:border-neutral-700"
                        href={app.href}
                      >
                        <div className="shrink-0 size-4">{app.icon}</div>

                        <div className="grow">
                          <ul className="flex flex-wrap items-center gap-1">
                            <li className="inline-flex items-center gap-x-1">
                              <span className="font-medium text-sm text-gray-800 dark:text-neutral-200">
                                {app.name}
                              </span>
                            </li>

                            <li className="ms-auto inline-flex items-center gap-x-0.5">
                              <svg
                                className="shrink-0 size-3 text-gray-800 dark:text-neutral-200"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                              </svg>

                              <span className="font-medium text-xs text-gray-800 dark:text-neutral-200">
                                {app.rating}
                              </span>
                            </li>

                            <li className="inline-flex items-center gap-x-1">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                {app.reviews}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </a>
                    ))}
                  </div>
                  {/* End Card List Group */}
                </div>
              </div>
            )}
            {/* End Col */}
          </div>
          {/* End Grid */}

          {tabs.length > 0 && (
            <div className="space-y-2">
              <div
                id="hs-pro-hero-tabs-scroll"
                className="relative pt-4 md:pt-6 overflow-hidden"
                data-hs-scroll-nav
              >
                {/* Nav Tab */}
                <nav
                  id="hs-pro-hero-tabs"
                  className="hs-scroll-nav-body flex gap-1 snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:h-0 p-0.5"
                  aria-label="Tabs"
                  role="tablist"
                  aria-orientation="horizontal"
                >
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`hs-tab-active:bg-gray-200 snap-start p-2 md:px-3 inline-flex justify-center items-center gap-x-2 border border-transparent text-xs sm:text-[13px] whitespace-nowrap text-gray-800 rounded-full hover:bg-gray-100 focus:bg-gray-100 dark:hs-tab-active:bg-neutral-800 dark:hs-tab-active:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden ${
                        index === 0 ? 'active' : ''
                      }`}
                      id={`hs-pro-tabs-dth-item-${tab.id}`}
                      aria-selected={index === 0}
                      data-hs-tab={`#hs-pro-tabs-dth-${tab.id}`}
                      aria-controls={`hs-pro-tabs-dth-${tab.id}`}
                      role="tab"
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
                {/* End Nav Tab */}
              </div>

              {/* Browser */}
              <div className="p-1.5 md:p-3 bg-white/40 border border-white/50 rounded-xl shadow-lg dark:bg-white/[.05] dark:border-white/10">
                {/* Header */}
                <div className="mb-1 h-4 md:h-6 flex items-center">
                  {/* Dots */}
                  <div className="flex gap-x-1.5 md:gap-x-2 px-2.5 md:px-3.5">
                    <span className="size-2.5 md:size-3 bg-red-400 border border-red-500 rounded-full shadow-inner dark:bg-red-600 dark:border-red-600"></span>
                    <span className="size-2.5 md:size-3 bg-yellow-400 border border-yellow-500 rounded-full shadow-inner dark:bg-yellow-600 dark:border-yellow-600"></span>
                    <span className="size-2.5 md:size-3 bg-green-400 border border-green-500 rounded-full shadow-inner dark:bg-green-600 dark:border-green-600"></span>
                  </div>
                  {/* End Dots */}
                </div>
                {/* End Header */}

                {/* Tab Content */}
                {tabs.map((tab, index) => (
                  <div
                    key={tab.id}
                    id={`hs-pro-tabs-dth-${tab.id}`}
                    role="tabpanel"
                    aria-labelledby={`hs-pro-tabs-dth-item-${tab.id}`}
                    className={index === 0 ? '' : 'hidden'}
                  >
                    <img
                      className="dark:hidden rounded-lg w-full h-auto"
                      src={tab.lightImage}
                      alt={tab.alt}
                    />
                    <img
                      className="dark:block hidden rounded-lg w-full h-auto"
                      src={tab.darkImage}
                      alt={tab.alt}
                    />
                  </div>
                ))}
                {/* End Tab Content */}
              </div>
              {/* End Browser */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
