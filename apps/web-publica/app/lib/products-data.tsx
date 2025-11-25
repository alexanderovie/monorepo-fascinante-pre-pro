export interface ProductItem {
  id: string;
  category: string;
  title: string;
  href: string;
  lightImage: string;
  darkImage: string;
  backgroundImage: string;
  alt: string;
}

export const defaultProductsData: ProductItem[] = [
  {
    id: 'calendars',
    category: 'Calendars',
    title: 'Discover user-friendly calendar UIs designed for both dashboard and admin interfaces.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img9.webp',
    darkImage: '/assets/img/pro/startup-dark/img9.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1630609083938-3acb39a06392?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Calendars Card Image',
  },
  {
    id: 'modals',
    category: 'Modals',
    title: 'Modals provide a clean way to present filter options inside modal windows.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img7.webp',
    darkImage: '/assets/img/pro/startup-dark/img7.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1629194893765-3a904e9080dd?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Modals Card Image',
  },
  {
    id: 'checkout-forms',
    category: 'Checkout Forms',
    title: 'Simplified checkout process with intuitive forms to ensure a smooth and quick transaction completion.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img12.webp',
    darkImage: '/assets/img/pro/startup-dark/img12.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1703587820365-dad81a7c5908?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Checkout Forms Card Image',
  },
  {
    id: 'forms',
    category: 'Forms',
    title: 'Create customizable review forms with pre-set questions to guide reviewers.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img8.webp',
    darkImage: '/assets/img/pro/startup-dark/img8.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1629196613836-0a7e2541990a?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Forms Card Image',
  },
  {
    id: 'referrals',
    category: 'Referrals',
    title: 'Powerful e-commerce admin pages with product & order lists, referrals and more.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img13.webp',
    darkImage: '/assets/img/pro/startup-dark/img13.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1630609084037-ddb2b4a3fa67?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Referrals Card Image',
  },
  {
    id: 'data-maps',
    category: 'Data Maps',
    title: 'Dive deeper with data maps, customizable tabs and insightful tables, all in one centralized dashboard.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img10.webp',
    darkImage: '/assets/img/pro/startup-dark/img10.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1629654858857-615c2c8be8a8?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Data Maps Card Image',
  },
];
