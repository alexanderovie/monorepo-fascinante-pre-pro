export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface StatItem {
  value: string;
  label: string;
  description?: string;
}

export interface ValueItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const UsersIcon = () => (
  <svg
    className="shrink-0 size-6 text-blue-600 dark:text-blue-500"
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
);

const GlobeIcon = () => (
  <svg
    className="shrink-0 size-6 text-blue-600 dark:text-blue-500"
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
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const AwardIcon = () => (
  <svg
    className="shrink-0 size-6 text-blue-600 dark:text-blue-500"
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
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const HeartIcon = () => (
  <svg
    className="shrink-0 size-6 text-blue-600 dark:text-blue-500"
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
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const defaultStats: StatItem[] = [
  {
    value: '2.5k+',
    label: 'Companies',
    description: 'Trust us with their business',
  },
  {
    value: '100k+',
    label: 'Products',
    description: 'Launched successfully',
  },
  {
    value: '50+',
    label: 'Countries',
    description: 'Serving customers worldwide',
  },
  {
    value: '99.9%',
    label: 'Uptime',
    description: 'Reliable service guarantee',
  },
];

export const defaultValues: ValueItem[] = [
  {
    title: 'Customer First',
    description: 'We prioritize our customers&apos; success above all else.',
    icon: <UsersIcon />,
  },
  {
    title: 'Global Reach',
    description: 'Serving customers in over 50 countries worldwide.',
    icon: <GlobeIcon />,
  },
  {
    title: 'Excellence',
    description: 'We strive for excellence in everything we do.',
    icon: <AwardIcon />,
  },
  {
    title: 'Innovation',
    description: 'Constantly innovating to deliver the best solutions.',
    icon: <HeartIcon />,
  },
];

export const defaultTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    bio: 'Passionate about building great products.',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    bio: 'Tech enthusiast and problem solver.',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    bio: 'Creating beautiful and functional designs.',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
];

