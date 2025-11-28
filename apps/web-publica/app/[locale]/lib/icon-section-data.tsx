import React from 'react';

export interface IconSectionItem {
  id: string;
  title: string;
  description: string;
  learnMoreLink?: string;
  icon: React.ReactNode;
}

// Icon components
const MoreCreativityIcon = () => (
  <svg
    className="shrink-0 size-8 mb-5 text-gray-800 dark:text-neutral-200"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3v12" />
    <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M15 6a9 9 0 0 0-9 9" />
    <path d="M18 15v6" />
    <path d="M21 18h-6" />
  </svg>
);

const ScaleBudgetsIcon = () => (
  <svg
    className="shrink-0 size-8 mb-5 text-gray-800 dark:text-neutral-200"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
    <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
    <path d="m2 16 6 6" />
    <circle cx="16" cy="9" r="2.9" />
    <circle cx="6" cy="5" r="3" />
  </svg>
);

const SmartDashboardsIcon = () => (
  <svg
    className="shrink-0 size-8 mb-5 text-gray-800 dark:text-neutral-200"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
  </svg>
);

const ControlCenterIcon = () => (
  <svg
    className="shrink-0 size-8 mb-5 text-gray-800 dark:text-neutral-200"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 17v4" />
    <path d="m15.2 4.9-.9-.4" />
    <path d="m15.2 7.1-.9.4" />
    <path d="m16.9 3.2-.4-.9" />
    <path d="m16.9 8.8-.4.9" />
    <path d="m19.5 2.3-.4.9" />
    <path d="m19.5 9.7-.4-.9" />
    <path d="m21.7 4.5-.9.4" />
    <path d="m21.7 7.5-.9-.4" />
    <path d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
    <path d="M8 21h8" />
    <circle cx="18" cy="6" r="3" />
  </svg>
);

const EmailReportsIcon = () => (
  <svg
    className="shrink-0 size-8 mb-5 text-gray-800 dark:text-neutral-200"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="13" x="6" y="4" rx="2" />
    <path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7" />
    <path d="M2 8v11c0 1.1.9 2 2 2h14" />
  </svg>
);

const ForecastingIcon = () => (
  <svg
    className="shrink-0 size-8 mb-5 text-gray-800 dark:text-neutral-200"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.828 14.828 21 21" />
    <path d="M21 16v5h-5" />
    <path d="m21 3-9 9-4-4-6 6" />
    <path d="M21 8V3h-5" />
  </svg>
);

export const defaultIconSectionData: IconSectionItem[] = [
  {
    id: 'more-creativity',
    title: 'More creativity',
    description:
      "This is where we really begin to visualize your napkin sketches and make them into beautiful pixels.",
    learnMoreLink: '#',
    icon: <MoreCreativityIcon />,
  },
  {
    id: 'scale-budgets',
    title: 'Scale budgets efficiently',
    description: "Now that we've aligned the details, it's time to get things mapped out and organized.",
    learnMoreLink: '#',
    icon: <ScaleBudgetsIcon />,
  },
  {
    id: 'smart-dashboards',
    title: 'Smart Dashboards',
    description:
      "This is where we really begin to visualize your napkin sketches and make them into beautiful pixels.",
    learnMoreLink: '#',
    icon: <SmartDashboardsIcon />,
  },
  {
    id: 'control-center',
    title: 'Control Center',
    description: "Now that we've aligned the details, it's time to get things mapped out and organized.",
    learnMoreLink: '#',
    icon: <ControlCenterIcon />,
  },
  {
    id: 'email-reports',
    title: 'Email Reports',
    description:
      'We strive to embrace and drive change in our industry which allows us to keep our clients relevant.',
    learnMoreLink: '#',
    icon: <EmailReportsIcon />,
  },
  {
    id: 'forecasting',
    title: 'Forecasting',
    description:
      'Staying focused allows us to turn every project we complete into something we love.',
    learnMoreLink: '#',
    icon: <ForecastingIcon />,
  },
];
