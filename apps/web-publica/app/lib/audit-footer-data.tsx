import Image from 'next/image';
import type { FooterData } from './footer-data';

/**
 * Footer data específico para la página de Audit
 * Basado en las opciones del dashboard
 */
export const auditFooterData: FooterData = {
  logo: {
    href: '/',
    ariaLabel: 'Fascinante Digital',
    component: (
      <Image
        src="/assets/logo-fascinante.svg"
        alt="Fascinante Digital Logo"
        width={134}
        height={38}
        className="w-[134px] h-auto dark:invert"
        priority
      />
    ),
  },
  socialLinks: [
    {
      name: 'X (Twitter)',
      href: '#',
      icon: (
        <svg
          className="shrink-0 size-3.5"
          width="48"
          height="50"
          viewBox="0 0 48 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.5665 20.7714L46.4356 0H42.2012L26.6855 18.0355L14.2931 0H0L18.7397 27.2728L0 49.0548H4.23464L20.6196 30.0087L33.7069 49.0548H48L28.5655 20.7714H28.5665ZM22.7666 27.5131L5.76044 3.18778H12.2646L42.2032 46.012H35.699L22.7666 27.5142V27.5131Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
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
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
  ],
  columns: [
    {
      title: 'Get Started',
      links: [
        { label: 'Go to Dashboard', href: 'https://app.fascinantedigital.com/' },
        { label: 'View Plans', href: 'https://app.fascinantedigital.com/plans' },
        { label: 'Create Account', href: 'https://app.fascinantedigital.com/' },
        { label: 'Log In', href: 'https://app.fascinantedigital.com/' },
      ],
    },
    {
      title: 'Features',
      links: [
        { label: 'Google Business Profile', href: 'https://app.fascinantedigital.com/' },
        { label: 'Analytics Dashboard', href: 'https://app.fascinantedigital.com/' },
        { label: 'Business Intelligence', href: 'https://app.fascinantedigital.com/' },
        { label: 'Keyword Research', href: 'https://app.fascinantedigital.com/' },
        { label: 'Competitor Analysis', href: 'https://app.fascinantedigital.com/' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '/contact' },
        { label: 'Contact Support', href: '/contact' },
        { label: 'Documentation', href: 'https://app.fascinantedigital.com/' },
        { label: 'API Access', href: 'https://app.fascinantedigital.com/' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Features', href: '/features' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ],
  appLinks: [],
  bottomLinks: [
    { label: 'FAQ', href: '/faq' },
    { label: 'License', href: '/license' },
  ],
  copyright: '© 2025 Fascinante Digital. All rights reserved.',
};

