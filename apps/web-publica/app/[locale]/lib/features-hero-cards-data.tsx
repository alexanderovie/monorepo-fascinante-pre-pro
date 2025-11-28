export interface FloatingCard {
  id: string;
  type: 'datatables' | 'users' | 'dropbox' | 'profile' | 'slack' | 'product' | 'user-profile';
  position: {
    top?: string;
    bottom?: string;
    start?: string;
    end?: string;
    hidden?: string;
  };
  scale?: string;
  blur?: boolean;
  opacity?: string;
  content: {
    title?: string;
    subtitle?: string;
    value?: string;
    valueSuffix?: string;
    description?: string;
    avatar?: {
      src: string;
      alt: string;
      name?: string;
    };
    avatars?: Array<{
      src?: string;
      alt: string;
      name: string;
      initial?: string;
    }>;
    badges?: Array<{
      label: string;
      variant: 'yellow' | 'gray' | 'indigo' | 'purple' | 'green';
    }>;
    stats?: Array<{
      icon: React.ReactNode;
      value: string;
    }>;
    progress?: {
      value: number;
      label: string;
    };
    button?: {
      label: string;
      href?: string;
    };
    fields?: Array<{
      label: string;
      value: string;
    }>;
    image?: {
      src: string;
      alt: string;
    };
  };
}

// Icon components
const CommentIcon = () => (
  <svg
    className="shrink-0 size-3"
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
    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z"></path>
    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
  </svg>
);

const LinkIcon = () => (
  <svg
    className="shrink-0 size-3"
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
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);


export const defaultFloatingCards: FloatingCard[] = [
  {
    id: 'datatables',
    type: 'datatables',
    position: {
      top: 'top-[2%]',
      start: 'start-[4%] sm:start-[20%] lg:start-[33%]',
      hidden: 'hidden lg:block',
    },
    scale: 'scale-75 lg:scale-100',
    content: {
      title: 'Datatables Integration',
      avatar: {
        src: 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80',
        alt: 'Avatar',
        name: 'Daniel Hobbs',
      },
      badges: [
        { label: 'Medium 🌟', variant: 'yellow' },
        { label: 'Feature ⚡️', variant: 'gray' },
        { label: 'Docs 📄', variant: 'gray' },
      ],
      stats: [
        { icon: <CommentIcon />, value: '24' },
        { icon: <LinkIcon />, value: '8' },
      ],
      progress: {
        value: 100,
        label: '100%',
      },
    },
  },
  {
    id: 'users',
    type: 'users',
    position: {
      top: 'top-[15%] lg:top-[25%]',
      start: 'start-0 md:start-[5%] xl:start-[14%]',
    },
    scale: 'scale-75 lg:scale-100',
    content: {
      title: 'Total Users',
      value: '356',
      avatars: [
        {
          src: 'https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80',
          alt: 'Avatar',
          name: 'Lewis Clarke',
        },
        {
          initial: 'L',
          alt: 'Avatar',
          name: 'Lori Hunter',
        },
        {
          src: 'https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80',
          alt: 'Avatar',
          name: 'Ella Lauda',
        },
      ],
    },
  },
  {
    id: 'dropbox',
    type: 'dropbox',
    position: {
      bottom: 'bottom-0 lg:bottom-[15%]',
      start: 'start-[10%] lg:start-[12%]',
    },
    scale: 'scale-75 xl:scale-100',
    blur: true,
    content: {
      title: 'Dropbox',
      value: '119.88',
      valueSuffix: '/ yr',
      description: 'Due Nov 2',
      button: {
        label: 'Cancel',
      },
    },
  },
  {
    id: 'isabella',
    type: 'profile',
    position: {
      top: 'top-0 lg:top-[5%]',
      end: 'end-[15%] lg:end-[25%]',
    },
    scale: 'scale-75 lg:scale-100',
    content: {
      title: 'Isabella Cruz',
      subtitle: 'Preline account',
      avatar: {
        src: 'https://images.unsplash.com/photo-1724037231939-c4fa9bd69a84?q=80&w=180&h=180&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Avatar',
      },
    },
  },
  {
    id: 'slack',
    type: 'slack',
    position: {
      top: 'top-[35%]',
      end: 'end-0 xl:end-[5%]',
      hidden: 'hidden md:block',
    },
    scale: 'scale-75 xl:scale-100',
    content: {
      title: 'Slack',
      description: 'Connect a slack workspace in order to setup automated notifications.',
      button: {
        label: 'View integration',
      },
    },
  },
  {
    id: 'windrunner',
    type: 'product',
    position: {
      bottom: 'bottom-[10%] lg:bottom-[20%]',
      end: 'end-[2%]',
    },
    scale: 'scale-75 xl:scale-100',
    blur: true,
    opacity: 'opacity-50',
    content: {
      title: 'Windrunner',
      description: 'Color: White, Size: M',
      button: {
        label: 'Rate product',
      },
      image: {
        src: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Product Image',
      },
    },
  },
  {
    id: 'daniel',
    type: 'user-profile',
    position: {
      bottom: 'bottom-[15%]',
      end: 'end-[35%] xl:end-[40%]',
      hidden: 'hidden lg:block',
    },
    scale: 'scale-75 xl:scale-100',
    blur: true,
    content: {
      title: 'Daniel Hobbs',
      avatar: {
        src: 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80',
        alt: 'Avatar',
      },
      badges: [{ label: 'Pro', variant: 'green' }],
      fields: [
        { label: 'Role:', value: 'Front-End Developer' },
        { label: 'Phone:', value: '-' },
        { label: 'Email:', value: 'daniel@email.com' },
        { label: 'Hourly price:', value: '$120-$160' },
      ],
    },
  },
];

