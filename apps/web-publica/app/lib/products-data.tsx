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
    id: 'free-audit',
    category: 'Free Audit',
    title: 'Discover if your business is ready to invest in ads or missing key visibility on Google.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img9.webp',
    darkImage: '/assets/img/pro/startup-dark/img9.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1630609083938-3acb39a06392?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Free Audit Card Image',
  },
  {
    id: 'google-performance',
    category: 'Google Performance Tracking',
    title: 'Get real metrics on calls, searches, and reviews from your Google Business Profile.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img7.webp',
    darkImage: '/assets/img/pro/startup-dark/img7.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1629194893765-3a904e9080dd?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Google Performance Tracking Card Image',
  },
  {
    id: 'local-seo',
    category: 'Smart Local SEO',
    title: 'Appear in Google Maps and local searches with automated optimization.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img12.webp',
    darkImage: '/assets/img/pro/startup-dark/img12.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1703587820365-dad81a7c5908?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Smart Local SEO Card Image',
  },
  {
    id: 'reputation',
    category: 'Reputation Management',
    title: 'Collect and respond to your reviews from one simple dashboard.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img8.webp',
    darkImage: '/assets/img/pro/startup-dark/img8.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1629196613836-0a7e2541990a?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Reputation Management Card Image',
  },
  {
    id: 'optimized-websites',
    category: 'Optimized Websites',
    title: 'Modern, fast websites built to attract clients and improve your search ranking.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img13.webp',
    darkImage: '/assets/img/pro/startup-dark/img13.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1630609084037-ddb2b4a3fa67?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Optimized Websites Card Image',
  },
  {
    id: 'digital-automation',
    category: 'Digital Automation',
    title: 'Connect all your business data and let smart systems handle the heavy work.',
    href: '/features',
    lightImage: '/assets/img/pro/startup/img10.webp',
    darkImage: '/assets/img/pro/startup-dark/img10.webp',
    backgroundImage:
      'https://images.unsplash.com/photo-1629654858857-615c2c8be8a8?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Digital Automation Card Image',
  },
];
