'use client';

import { usePathname } from 'next/navigation';
import { Link } from '../../../i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ASSETS, BRAND } from '../../../lib/constants';
import { getUrl } from '../../../lib/url-builder';
import Image from 'next/image';

/**
 * Header Component - Diseño Preline UI
 * Actualizado: Noviembre 2025
 * Estructura idéntica a plantilla HTML proporcionada
 */
export default function Header() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('navigation');

  // URLs dinámicas
  const urls = {
    login: getUrl('login'),
    getStarted: '/audit',
  };

  // Función para cerrar el menú
  const closeMenu = useCallback(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;

    if (button && menu) {
      if (window.HSStaticMethods) {
        const hsCollapse = (window.HSStaticMethods as {
          getInstance?: (element: HTMLElement, type: string) => { hide?: () => void } | null;
        }).getInstance?.(button, 'HSCollapse');

        if (hsCollapse?.hide) {
          hsCollapse.hide();
        }
      }
      setIsMenuOpen(false);
    }
  }, []);

  // Detectar cuando el menú se abre/cierra
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const observer = new MutationObserver(() => {
      const isOpen = !menu.classList.contains('hidden');
      setIsMenuOpen(isOpen);
    });

    observer.observe(menu, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Bloquear scroll del body cuando el menú está abierto (solo móvil)
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Cerrar al hacer click fuera del menú
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen, closeMenu]);

  // Cerrar al hacer click en un link (solo móvil)
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      closeMenu();
    }
  };

  return (
    <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <nav className="relative max-w-[85rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-x-1">
          <Link
            href="/"
            className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white"
            aria-label={BRAND.name}
          >
            <Image
              className="w-[134px] h-auto dark:invert"
              src={ASSETS.logo}
              alt={`${BRAND.name} Logo`}
              width={134}
              height={38}
              priority
            />
          </Link>

          {/* Collapse Button */}
          <button
            ref={buttonRef}
            type="button"
            className="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center font-medium text-sm rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            id="hs-header-base-collapse"
            aria-expanded={isMenuOpen}
            aria-controls="hs-header-base"
            aria-label="Toggle navigation"
            data-hs-collapse="#hs-header-base"
          >
            <svg
              className="hs-collapse-open:hidden size-4"
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
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
            <svg
              className="hs-collapse-open:block shrink-0 hidden size-4"
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span className="sr-only">Toggle navigation</span>
          </button>
          {/* End Collapse Button */}
        </div>

        {/* Collapse */}
        <div
          ref={menuRef}
          id="hs-header-base"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block"
          aria-labelledby="hs-header-base-collapse"
        >
          <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
              <div className="grow">
                <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-0.5 md:gap-1">
                  {/* Landing */}
                  <Link
                    href="/"
                    onClick={handleLinkClick}
                    className={`p-2 flex items-center text-sm rounded-lg focus:outline-hidden ${
                      pathname === '/' || pathname.endsWith('/')
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                        : 'text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                    }`}
                    aria-current={pathname === '/' || pathname.endsWith('/') ? 'page' : undefined}
                  >
                    <svg
                      className="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    Landing
                  </Link>

                  {/* Mega Menu */}
                  <div className="hs-dropdown [--strategy:static] md:[--strategy:fixed] [--adaptive:none] md:[--adaptive:adaptive] [--is-collapse:true] md:[--is-collapse:false]">
                    <button
                      id="hs-header-base-mega-menu-small"
                      type="button"
                      className="hs-dropdown-toggle w-full p-2 flex items-center text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-label="Mega Menu"
                    >
                      <svg
                        className="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Resources
                      <svg
                        className="hs-dropdown-open:-rotate-180 md:hs-dropdown-open:rotate-0 duration-300 shrink-0 size-4 ms-auto md:ms-1"
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
                      className="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] md:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 relative md:w-80 hidden z-10 top-full md:bg-white md:rounded-lg md:shadow-md before:absolute before:-top-4 before:start-0 before:w-full before:h-5 dark:md:bg-neutral-800"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="hs-header-base-mega-menu-small"
                    >
                      <div className="py-1 md:px-1 space-y-0.5">
                        {/* Link - Data */}
                        <Link
                          href="#"
                          onClick={handleLinkClick}
                          className="p-3 flex gap-x-4 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 rounded-lg dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <svg
                            className="shrink-0 size-4 mt-1 text-gray-800 dark:text-neutral-200"
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
                            <line x1="22" x2="2" y1="12" y2="12" />
                            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                            <line x1="6" x2="6.01" y1="16" y2="16" />
                            <line x1="10" x2="10.01" y1="16" y2="16" />
                          </svg>
                          <div className="grow">
                            <span className="block font-semibold text-sm text-gray-800 dark:text-neutral-200">Data</span>
                            <p className="text-sm text-gray-500 dark:text-neutral-500">How you get the most accurate and up-to-date data</p>
                          </div>
                        </Link>
                        {/* End Link */}

                        <div className="my-2 border-t border-gray-100 dark:border-neutral-800"></div>

                        {/* Link - Team */}
                        <Link
                          href="#"
                          onClick={handleLinkClick}
                          className="p-3 flex gap-x-4 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 rounded-lg dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <svg
                            className="shrink-0 size-4 mt-1 text-gray-800 dark:text-neutral-200"
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
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <div className="grow">
                            <span className="block font-semibold text-sm text-gray-800 dark:text-neutral-200">
                              Team <span className="inline ms-1 font-medium text-xs bg-blue-600 text-white py-1 px-2 rounded-full">We&apos;re hiring</span>
                            </span>
                            <p className="text-sm text-gray-500 dark:text-neutral-500">Meet the people building products to help your business grow</p>
                          </div>
                        </Link>
                        {/* End Link */}

                        <div className="my-2 border-t border-gray-100 dark:border-neutral-800"></div>

                        {/* Link - Blog */}
                        <Link
                          href="/blog"
                          onClick={handleLinkClick}
                          className="p-3 flex gap-x-4 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 rounded-lg dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <svg
                            className="shrink-0 size-4 mt-1 text-gray-800 dark:text-neutral-200"
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
                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                            <path d="M18 14h-8" />
                            <path d="M15 18h-5" />
                            <path d="M10 6h8v4h-8V6Z" />
                          </svg>
                          <div className="grow">
                            <span className="block font-semibold text-sm text-gray-800 dark:text-neutral-200">Blog</span>
                            <p className="text-sm text-gray-500 dark:text-neutral-500">The latest news, feature releases, and how to grow with data</p>
                          </div>
                        </Link>
                        {/* End Link */}
                      </div>
                    </div>
                  </div>
                  {/* End Mega Menu */}

                  {/* Account */}
                  <Link
                    href="#"
                    onClick={handleLinkClick}
                    className="p-2 flex items-center text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  >
                    <svg
                      className="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Account
                  </Link>

                  {/* Work */}
                  <Link
                    href="#"
                    onClick={handleLinkClick}
                    className="p-2 flex items-center text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  >
                    <svg
                      className="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                    Work
                  </Link>

                  {/* Contact */}
                  <Link
                    href="/contact"
                    onClick={handleLinkClick}
                    className={`p-2 flex items-center text-sm rounded-lg focus:outline-hidden ${
                      pathname.includes('/contact')
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                        : 'text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                    }`}
                  >
                    <svg
                      className="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {t('contact')}
                  </Link>

                  {/* Blog */}
                  <Link
                    href="/blog"
                    onClick={handleLinkClick}
                    className={`p-2 flex items-center text-sm rounded-lg focus:outline-hidden ${
                      pathname.includes('/blog')
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                        : 'text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                    }`}
                  >
                    <svg
                      className="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                      <path d="M18 14h-8" />
                      <path d="M15 18h-5" />
                      <path d="M10 6h8v4h-8V6Z" />
                    </svg>
                    Blog
                  </Link>
                </div>
              </div>

              {/* Separator */}
              <div className="my-2 md:my-0 md:mx-2">
                <div className="w-full h-px md:w-px md:h-4 bg-gray-100 md:bg-gray-300 dark:bg-neutral-700"></div>
              </div>

              {/* Button Group */}
              <div className="flex flex-wrap items-center gap-x-1.5">
                <Link
                  href={urls.login}
                  className="py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 focus:outline-hidden focus:bg-gray-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  Sign in
                </Link>
                <Link
                  href={urls.getStarted}
                  className="py-2 px-2.5 inline-flex items-center font-medium text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:bg-blue-600"
                >
                  Get started
                </Link>
              </div>
              {/* End Button Group */}
            </div>
          </div>
        </div>
        {/* End Collapse */}
      </nav>
    </header>
  );
}
