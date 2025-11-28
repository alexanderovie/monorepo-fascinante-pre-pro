export interface Customer {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
  caseStudy?: {
    title: string;
    description: string;
    results: string[];
  };
}

export const defaultCustomers: Customer[] = [
  {
    id: '1',
    name: 'TechCorp',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3',
    industry: 'Technology',
    description: 'Leading technology company transforming digital experiences.',
    testimonial: {
      quote: 'Preline has revolutionized how we build and deploy applications. The efficiency gains are remarkable.',
      author: 'Sarah Johnson',
      role: 'CTO',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    metrics: [
      { label: 'Users', value: '2.5M+' },
      { label: 'Growth', value: '300%' },
      { label: 'Uptime', value: '99.9%' },
    ],
    caseStudy: {
      title: 'Scaling to Millions of Users',
      description: 'How TechCorp scaled their platform using Preline.',
      results: [
        '300% increase in user base',
        '50% reduction in deployment time',
        '99.9% uptime achieved',
      ],
    },
  },
  {
    id: '2',
    name: 'FinanceHub',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3',
    industry: 'Finance',
    description: 'Modern financial services platform serving millions of customers.',
    testimonial: {
      quote: 'The security and performance of Preline gave us the confidence to scale our financial platform.',
      author: 'Michael Chen',
      role: 'VP Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    metrics: [
      { label: 'Transactions', value: '10M+' },
      { label: 'Security', value: '100%' },
      { label: 'Compliance', value: 'SOC 2' },
    ],
    caseStudy: {
      title: 'Building Secure Financial Infrastructure',
      description: 'FinanceHub leveraged Preline to build a secure, compliant platform.',
      results: [
        'SOC 2 Type II certified',
        'Zero security incidents',
        '10M+ transactions processed',
      ],
    },
  },
  {
    id: '3',
    name: 'HealthCare Plus',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3',
    industry: 'Healthcare',
    description: 'Innovative healthcare solutions improving patient outcomes.',
    testimonial: {
      quote: 'Preline enabled us to build patient-focused applications that truly make a difference.',
      author: 'Dr. Emily Rodriguez',
      role: 'Chief Medical Officer',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    metrics: [
      { label: 'Patients', value: '500K+' },
      { label: 'Hospitals', value: '200+' },
      { label: 'Satisfaction', value: '98%' },
    ],
    caseStudy: {
      title: 'Transforming Patient Care',
      description: 'HealthCare Plus improved patient outcomes with Preline-powered solutions.',
      results: [
        '98% patient satisfaction rate',
        '200+ hospitals connected',
        '30% reduction in wait times',
      ],
    },
  },
  {
    id: '4',
    name: 'EduTech Solutions',
    logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3',
    industry: 'Education',
    description: 'Empowering educators and students with cutting-edge technology.',
    testimonial: {
      quote: 'Preline helped us create an engaging learning platform that students and teachers love.',
      author: 'David Thompson',
      role: 'Director of Technology',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    metrics: [
      { label: 'Students', value: '1M+' },
      { label: 'Schools', value: '5K+' },
      { label: 'Engagement', value: '95%' },
    ],
    caseStudy: {
      title: 'Revolutionizing Online Learning',
      description: 'EduTech Solutions built a comprehensive learning platform with Preline.',
      results: [
        '1M+ students reached',
        '95% engagement rate',
        '5K+ schools onboarded',
      ],
    },
  },
  {
    id: '5',
    name: 'RetailMax',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3',
    industry: 'Retail',
    description: 'Next-generation e-commerce platform driving retail innovation.',
    testimonial: {
      quote: 'Preline\'s performance and scalability allowed us to handle peak shopping seasons seamlessly.',
      author: 'Lisa Anderson',
      role: 'Head of E-commerce',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    metrics: [
      { label: 'Orders', value: '5M+' },
      { label: 'Revenue', value: '$500M+' },
      { label: 'Conversion', value: '4.5%' },
    ],
    caseStudy: {
      title: 'Scaling E-commerce Operations',
      description: 'RetailMax achieved record-breaking sales with Preline.',
      results: [
        '$500M+ in revenue',
        '5M+ orders processed',
        '4.5% conversion rate',
      ],
    },
  },
  {
    id: '6',
    name: 'MediaStream',
    logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3',
    industry: 'Media',
    description: 'Streaming platform delivering premium content to millions of viewers.',
    testimonial: {
      quote: 'Preline enabled us to deliver seamless streaming experiences at scale.',
      author: 'Robert Martinez',
      role: 'VP of Engineering',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    metrics: [
      { label: 'Viewers', value: '10M+' },
      { label: 'Content', value: '50K+' },
      { label: 'Quality', value: '4K' },
    ],
    caseStudy: {
      title: 'Delivering Premium Streaming',
      description: 'MediaStream built a world-class streaming platform with Preline.',
      results: [
        '10M+ active viewers',
        '50K+ content titles',
        '4K streaming quality',
      ],
    },
  },
];


