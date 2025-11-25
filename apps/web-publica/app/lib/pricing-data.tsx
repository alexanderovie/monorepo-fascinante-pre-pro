export interface PricingFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: string;
    yearly?: string;
    period?: string;
  };
  features: PricingFeature[];
  cta: {
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  };
  popular?: boolean;
  badge?: string;
}

export const defaultPricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals and small teams',
    price: {
      monthly: '$9',
      yearly: '$90',
      period: '/month',
    },
    features: [
      { name: 'Up to 3 projects', included: true },
      { name: '5 team members', included: true },
      { name: '10GB storage', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom integrations', included: false },
    ],
    cta: {
      label: 'Get started',
      href: '#',
      variant: 'secondary',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Best for growing businesses',
    price: {
      monthly: '$29',
      yearly: '$290',
      period: '/month',
    },
    popular: true,
    badge: 'Most popular',
    features: [
      { name: 'Unlimited projects', included: true },
      { name: '20 team members', included: true },
      { name: '100GB storage', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'API access', included: true },
      { name: 'White-label options', included: false },
    ],
    cta: {
      label: 'Start free trial',
      href: '#',
      variant: 'primary',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: {
      monthly: 'Custom',
      period: '',
    },
    features: [
      { name: 'Unlimited projects', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Unlimited storage', included: true },
      { name: 'Advanced analytics', included: true },
      { name: '24/7 priority support', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'API access', included: true },
      { name: 'White-label options', included: true },
    ],
    cta: {
      label: 'Contact sales',
      href: '#',
      variant: 'secondary',
    },
  },
];

