export interface FeatureGridItem {
  id: string;
  title: string;
  description: string;
  lightImage: string;
  darkImage: string;
  alt: string;
}

export const defaultFeaturesGridData: FeatureGridItem[] = [
  {
    id: 'calendars',
    title: 'Calendars',
    description: 'Discover user-friendly calendar UIs designed for both dashboard and admin interfaces.',
    lightImage: '/assets/img/pro/startup/img9.webp',
    darkImage: '/assets/img/pro/startup-dark/img9.webp',
    alt: 'Calendars Card Image',
  },
  {
    id: 'modals',
    title: 'Modals',
    description: 'Modals provide a clean way to present filter options inside modal windows.',
    lightImage: '/assets/img/pro/startup/img7.webp',
    darkImage: '/assets/img/pro/startup-dark/img7.webp',
    alt: 'Modals Card Image',
  },
  {
    id: 'checkout-forms',
    title: 'Checkout Forms',
    description:
      'Simplified checkout process with intuitive forms to ensure a smooth and quick transaction completion.',
    lightImage: '/assets/img/pro/startup/img12.webp',
    darkImage: '/assets/img/pro/startup-dark/img12.webp',
    alt: 'Checkout Forms Card Image',
  },
  {
    id: 'forms',
    title: 'Forms',
    description: 'Create customizable review forms with pre-set questions to guide reviewers.',
    lightImage: '/assets/img/pro/startup/img8.webp',
    darkImage: '/assets/img/pro/startup-dark/img8.webp',
    alt: 'Forms Card Image',
  },
  {
    id: 'referrals',
    title: 'Referrals',
    description: 'Powerful e-commerce admin pages with product & order lists, referrals and more.',
    lightImage: '/assets/img/pro/startup/img13.webp',
    darkImage: '/assets/img/pro/startup-dark/img13.webp',
    alt: 'Referrals Card Image',
  },
  {
    id: 'data-maps',
    title: 'Data Maps',
    description:
      'Dive deeper with data maps, customizable tabs and insightful tables, all in one centralized dashboard.',
    lightImage: '/assets/img/pro/startup/img10.webp',
    darkImage: '/assets/img/pro/startup-dark/img10.webp',
    alt: 'Data Maps Card Image',
  },
];
