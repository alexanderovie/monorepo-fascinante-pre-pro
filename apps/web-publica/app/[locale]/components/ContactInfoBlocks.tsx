/**
 * ContactInfoBlocks Component
 * Componente para mostrar bloques de información de contacto
 *
 * Basado en el diseño proporcionado con Knowledgebase, FAQ, Developer APIs y Email
 * Usa los SVGs exactos del HTML proporcionado
 */

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export interface ContactInfoBlock {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

/**
 * ContactInfoBlocks - Muestra bloques de información de contacto
 */
export default function ContactInfoBlocks() {
  const t = useTranslations('contact.info');

  const blocks: ContactInfoBlock[] = [
    {
      icon: (
        <svg
          className="shrink-0 size-6 mt-1.5 text-gray-800 dark:text-neutral-200"
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
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      ),
      title: t('knowledgebase.title'),
      description: t('knowledgebase.description'),
      linkText: t('knowledgebase.link'),
      linkHref: '#',
    },
    {
      icon: (
        <svg
          className="shrink-0 size-6 mt-1.5 text-gray-800 dark:text-neutral-200"
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
          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
          <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
        </svg>
      ),
      title: t('faq.title'),
      description: t('faq.description'),
      linkText: t('faq.link'),
      linkHref: '#',
    },
    {
      icon: (
        <svg
          className="shrink-0 size-6 mt-1.5 text-gray-800 dark:text-neutral-200"
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
          <path d="m7 11 2-2-2-2" />
          <path d="M11 13h4" />
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        </svg>
      ),
      title: t('apis.title'),
      description: t('apis.description'),
      linkText: t('apis.link'),
      linkHref: '#',
    },
    {
      icon: (
        <svg
          className="shrink-0 size-6 mt-1.5 text-gray-800 dark:text-neutral-200"
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
          <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
          <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
        </svg>
      ),
      title: t('email.title'),
      description: t('email.description'),
      linkText: t('email.link'),
      linkHref: `mailto:${t('email.address')}`,
    },
  ];

  return (
    <div className="divide-y divide-gray-200 dark:divide-neutral-800">
      {blocks.map((block, index) => (
        <div key={index} className="flex gap-x-7 py-6">
          {block.icon}
          <div className="grow">
            <h3 className="font-semibold text-gray-800 dark:text-neutral-200">{block.title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">{block.description}</p>
            <Link
              href={block.linkHref}
              className="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200 group"
            >
              {block.linkText}
              <svg
                className="shrink-0 size-2.5 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.975821 6.92249C0.43689 6.92249 -3.50468e-07 7.34222 -3.27835e-07 7.85999C-3.05203e-07 8.37775 0.43689 8.79749 0.975821 8.79749L12.7694 8.79748L7.60447 13.7596C7.22339 14.1257 7.22339 14.7193 7.60447 15.0854C7.98555 15.4515 8.60341 15.4515 8.98449 15.0854L15.6427 8.68862C16.1191 8.23098 16.1191 7.48899 15.6427 7.03134L8.98449 0.634573C8.60341 0.268455 7.98555 0.268456 7.60447 0.634573C7.22339 1.00069 7.22339 1.59428 7.60447 1.9604L12.7694 6.92248L0.975821 6.92249Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
