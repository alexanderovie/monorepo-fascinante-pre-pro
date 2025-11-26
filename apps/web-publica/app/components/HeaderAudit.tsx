'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ASSETS, BRAND } from '../../lib/constants';
import { getUrl } from '../../lib/url-builder';
import RequestCallModal from './RequestCallModal';

/**
 * Header Component - Página de Auditoría
 * Header minimalista sin menú principal para mantener enfoque en la auditoría
 * Solo incluye: Logo, Get Demo, Login, y Solicitar Llamada (modal)
 */
export default function HeaderAudit() {
  // URLs dinámicas basadas en subdominio (cacheadas con useMemo)
  const urls = useMemo(() => ({
    login: getUrl('login'),
    getDemo: getUrl('demo'),
  }), []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
        <nav className="max-w-6xl basis-full w-full py-4 px-4 sm:px-6 lg:px-8 lg:mx-auto">
          <div className="flex items-center justify-between gap-x-4 w-full">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
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
            </div>

            {/* Button Group */}
            <div className="flex items-center gap-x-2">
              <Link
                href={urls.getDemo}
                className="py-2 px-3 hidden sm:flex items-center gap-x-1.5 text-sm whitespace-nowrap text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                Get a demo
              </Link>

              <Link
                href={urls.login}
                className="py-2 px-3 flex items-center gap-x-1.5 whitespace-nowrap text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                Log in
              </Link>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="py-2 px-3 inline-flex items-center gap-x-1.5 whitespace-nowrap text-sm rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:shadow-none focus:outline-hidden focus:bg-blue-700 focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Solicitar llamada
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Modal para solicitar llamada */}
      <RequestCallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
