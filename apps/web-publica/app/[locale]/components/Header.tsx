'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import { useMemo } from 'react';
import { ASSETS, BRAND } from '../../../lib/constants';
import { getUrl } from '../../../lib/url-builder';

/**
 * Header Component - Navegación con i18n
 * Estructura: Home | How It Works | Solutions ▼ | Results | About | Contact
 */
export default function Header() {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  // URLs dinámicas basadas en subdominio (cacheadas con useMemo)
  const urls = useMemo(() => ({
    login: getUrl('login'),
    freeAudit: '/audit', // Ruta interna con locale
  }), []);

  // Dropdown de Solutions
  const solutionsLinks = [
    { href: '/audit', label: t('solutionsDropdown.freeAudit') },
    { href: '/features', label: t('solutionsDropdown.localSeo') },
    { href: '/features', label: t('solutionsDropdown.reputationManagement') },
    { href: '/features', label: t('solutionsDropdown.digitalAutomation') },
  ];

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white dark:bg-neutral-900">
      <nav className="max-w-6xl lg:max-w-7xl xl:max-w-7xl basis-full w-full py-4 px-4 sm:px-6 lg:px-8 lg:mx-auto">
        <div className="flex flex-wrap lg:flex-nowrap basis-full justify-between gap-x-2 lg:gap-x-20 w-full">
          {/* Logo */}
          <div className="flex items-center gap-x-1">
            <Link
              href="/"
              className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
              aria-label={BRAND.name}
            >
              <img
                className="w-[134px] h-auto dark:invert"
                src={ASSETS.logo}
                alt={`${BRAND.name} Logo`}
              />
            </Link>
          </div>

          {/* Button Group */}
          <div className="lg:order-3 flex gap-x-1 lg:gap-x-0.5">
            <Link
              href={urls.login}
              className="py-2 px-2.5 flex items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm text-start text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              {t('cta.login')}
            </Link>

            <Link
              href={urls.freeAudit}
              className="py-2 px-2.5 inline-flex items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:shadow-none focus:outline-hidden focus:bg-blue-700 focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
            >
              {t('cta.getFreeAudit')}
            </Link>

            {/* Collapse Button Trigger */}
            <button
              type="button"
              className="hs-collapse-toggle lg:hidden flex justify-center items-center size-9 rounded-lg shadow-2xs bg-white border border-gray-200 text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-neutral-300 dark:focus:bg-neutral-800"
              id="hs-pro-dmh-collapse"
              aria-expanded="false"
              aria-controls="hs-pro-dmh"
              aria-label="Toggle navigation"
              data-hs-collapse="#hs-pro-dmh"
            >
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
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>

          {/* Collapse Menu */}
          <div
            id="hs-pro-dmh"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block bg-white dark:bg-neutral-900"
            aria-labelledby="hs-pro-dmh-collapse"
          >
            <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-thumb]:bg-white/30 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              {/* Nav */}
              <div className="flex flex-col lg:flex-row lg:gap-y-0 lg:gap-x-0.5 py-2 lg:p-0">
                {/* Home */}
                <Link
                  href="/"
                  className={`py-2 px-2.5 lg:px-2 flex items-center gap-x-1.5 text-sm whitespace-nowrap text-start text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 ${
                    pathname === '/' || pathname.endsWith('/') ? 'bg-gray-100 dark:bg-neutral-800' : ''
                  }`}
                >
                  {t('home')}
                </Link>

                {/* How It Works */}
                <Link
                  href="/features"
                  className={`py-2 px-2.5 lg:px-2 flex items-center gap-x-1.5 text-sm whitespace-nowrap text-start text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 ${
                    pathname.includes('/features') ? 'bg-gray-100 dark:bg-neutral-800' : ''
                  }`}
                >
                  {t('howItWorks')}
                </Link>

                {/* Solutions Dropdown */}
                <div className="hs-dropdown [--strategy:static] lg:[--strategy:fixed] [--adaptive:none] lg:[--adaptive:adaptive] lg:[--trigger:hover] lg:inline-block">
                  <button
                    id="hs-pro-solutions-dropdown"
                    type="button"
                    className="hs-dropdown-toggle py-2 px-2.5 lg:px-2 w-full lg:w-auto flex items-center gap-x-1.5 text-sm whitespace-nowrap text-start text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    aria-label={t('solutions')}
                  >
                    {t('solutions')}
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] lg:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 relative w-full lg:w-52 hidden z-10 top-full bg-white lg:rounded-lg lg:shadow-xl shadow-stone-200 ps-6 lg:ps-0 before:absolute before:-top-4 before:start-0 before:w-full before:h-5 lg:after:hidden after:absolute after:top-1 after:start-4.5 after:w-0.5 after:h-[calc(100%-4px)] after:bg-stone-100 dark:bg-neutral-900 dark:shadow-neutral-900 dark:after:bg-neutral-700"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-pro-solutions-dropdown"
                  >
                    <div className="p-1 space-y-0.5">
                      {solutionsLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="relative group py-2 px-3 flex items-center gap-x-3 text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <Link
                  href="/customers"
                  className={`py-2 px-2.5 lg:px-2 flex items-center gap-x-1.5 text-sm whitespace-nowrap text-start text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 ${
                    pathname.includes('/customers') ? 'bg-gray-100 dark:bg-neutral-800' : ''
                  }`}
                >
                  {t('results')}
                </Link>

                {/* About */}
                <Link
                  href="/about"
                  className={`py-2 px-2.5 lg:px-2 flex items-center gap-x-1.5 text-sm whitespace-nowrap text-start text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 ${
                    pathname.includes('/about') ? 'bg-gray-100 dark:bg-neutral-800' : ''
                  }`}
                >
                  {t('about')}
                </Link>

                {/* Contact */}
                <Link
                  href="/contact"
                  className={`py-2 px-2.5 lg:px-2 flex items-center gap-x-1.5 text-sm whitespace-nowrap text-start text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 ${
                    pathname.includes('/contact') ? 'bg-gray-100 dark:bg-neutral-800' : ''
                  }`}
                >
                  {t('contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
