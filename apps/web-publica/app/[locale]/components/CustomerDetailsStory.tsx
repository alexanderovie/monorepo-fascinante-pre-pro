import Link from 'next/link';
import Image from 'next/image';

interface CustomerDetailsStoryProps {
  percentage: string;
  title: string;
  description: string;
  conversationWith: Array<{
    name: string;
    role: string;
    avatar: string;
  }>;
  intro: string;
  challenge: {
    description: string;
    quote?: {
      text: string;
      author: string;
      role: string;
    };
    items: string[];
  };
  solution: {
    items: string[];
  };
  impact: {
    description: string;
    quote?: {
      text: string;
      author: string;
      role: string;
    };
    items: Array<{
      label: string;
      description: string;
    }>;
  };
  lookingAhead: {
    description: string;
    quote?: {
      text: string;
      author: string;
      role?: string;
    };
  };
  companyInfo: {
    name: string;
    website: string;
    industry: string;
    founded: string;
    funding: string;
    ceo: string;
  };
  moreStories: Array<{
    percentage: string;
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
  }>;
}

/**
 * CustomerDetailsStory Component
 * Página de detalles de caso de éxito del cliente
 * Basado en el template de Preline Pro
 */
export default function CustomerDetailsStory({
  percentage,
  title,
  description,
  conversationWith,
  intro,
  challenge,
  solution,
  impact,
  lookingAhead,
  companyInfo,
  moreStories,
}: CustomerDetailsStoryProps) {
  return (
    <div className="pt-10 pb-20">
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Sidebar - Go back button */}
          <div className="lg:w-1/12">
            <div className="sticky top-20">
              <Link
                href="/customers"
                className="group inline-flex items-center gap-x-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-300 dark:hover:text-neutral-200"
              >
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
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Go back
              </Link>
            </div>
          </div>
          {/* End Left Sidebar */}

          {/* Center Content */}
          <div className="lg:w-7/12">
            {/* Heading */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-neutral-700">
              <div className="mb-6 flex items-center gap-x-3">
                {/* Shopify Icon */}
                <svg
                  className="shrink-0 size-8"
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.462 6.28384C27.44 6.12384 27.2998 6.03529 27.184 6.02554C27.0684 6.01589 24.6215 5.83452 24.6215 5.83452C24.6215 5.83452 22.9221 4.1474 22.7355 3.96066C22.5489 3.77403 22.1844 3.8308 22.0429 3.87244C22.0221 3.87858 21.6716 3.98674 21.0919 4.16614C20.5243 2.53261 19.5224 1.03145 17.7599 1.03145C17.7112 1.03145 17.6611 1.03343 17.611 1.03628C17.1098 0.373373 16.4889 0.0853729 15.9525 0.0853729C11.8468 0.0853729 9.88524 5.21798 9.27023 7.82619C7.67483 8.32055 6.54146 8.672 6.39669 8.71748C5.50617 8.99682 5.47801 9.02488 5.36108 9.864C5.27308 10.4993 2.94299 28.5189 2.94299 28.5189L21.0995 31.9208L30.9373 29.7925C30.9373 29.7925 27.4837 6.44384 27.462 6.28384ZM20.0884 4.4765L18.5521 4.952C18.5526 4.84373 18.5532 4.73721 18.5532 4.62072C18.5532 3.60548 18.4123 2.78806 18.1862 2.14006C19.0943 2.25403 19.6992 3.28735 20.0884 4.4765ZM17.0596 2.34137C17.3121 2.97403 17.4763 3.88198 17.4763 5.10718C17.4763 5.16987 17.4757 5.22718 17.4752 5.28515C16.476 5.59463 15.3903 5.93063 14.3022 6.26773C14.9132 3.90981 16.0584 2.77096 17.0596 2.34137ZM15.8398 1.18663C16.017 1.18663 16.1955 1.2468 16.3663 1.36439C15.0505 1.98356 13.6401 3.54302 13.0445 6.65721L10.5364 7.43398C11.2341 5.05863 12.8907 1.18663 15.8398 1.18663Z"
                    fill="#95BF46"
                  />
                  <path
                    d="M27.184 6.02553C27.0684 6.01589 24.6215 5.83452 24.6215 5.83452C24.6215 5.83452 22.9221 4.1474 22.7356 3.96066C22.6658 3.89118 22.5716 3.85556 22.4732 3.84022L21.1004 31.9205L30.9373 29.7925C30.9373 29.7925 27.4837 6.44383 27.462 6.28383C27.44 6.12383 27.2999 6.03529 27.184 6.02553Z"
                    fill="#5E8E3E"
                  />
                  <path
                    d="M17.7599 11.4614L16.5469 15.0697C16.5469 15.0697 15.4841 14.5025 14.1813 14.5025C12.2714 14.5025 12.1753 15.701 12.1753 16.0031C12.1753 17.6511 16.4711 18.2825 16.4711 22.1427C16.4711 25.1797 14.5449 27.1353 11.9476 27.1353C8.83092 27.1353 7.23706 25.1956 7.23706 25.1956L8.07158 22.4384C8.07158 22.4384 9.70994 23.8449 11.0924 23.8449C11.9957 23.8449 12.3632 23.1337 12.3632 22.614C12.3632 20.4643 8.83881 20.3684 8.83881 16.8361C8.83881 13.863 10.9727 10.986 15.2802 10.986C16.94 10.986 17.7599 11.4614 17.7599 11.4614Z"
                    fill="white"
                  />
                </svg>

                <div className="grow">
                  <p className="font-semibold text-3xl text-gray-800 dark:text-neutral-200">
                    {percentage}
                  </p>
                </div>
              </div>

              <h1 className="mb-4 font-semibold text-4xl text-gray-800 dark:text-neutral-200">
                {title}
              </h1>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-neutral-400">{description}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
                  A conversation with
                </p>

                <div className="flex flex-wrap gap-6">
                  {conversationWith.map((person, idx) => (
                    <div key={idx} className="flex items-center gap-x-3">
                      <Image
                        src={person.avatar}
                        alt={person.name}
                        width={40}
                        height={40}
                        className="shrink-0 size-10 rounded-full"
                      />
                      <div className="grow">
                        <span className="block font-semibold text-sm text-gray-800 dark:text-neutral-200">
                          {person.name}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-neutral-500">
                          {person.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* End Heading */}

            {/* Content Sections */}
            <div className="space-y-7 mb-8 pb-8 border-b border-gray-200 dark:border-neutral-700">
              <p className="text-gray-600 dark:text-neutral-400">{intro}</p>

              {/* The Challenge */}
              <div>
                <h4 className="mb-4 font-semibold text-xl text-gray-800 dark:text-neutral-200">
                  The Challenge
                </h4>
                <p className="mb-4 text-gray-600 dark:text-neutral-400">
                  {challenge.description}
                </p>
                <ul className="flex flex-col space-y-2 text-gray-600 dark:text-neutral-400">
                  {challenge.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-x-3">
                      <div className="shrink-0 mt-1.5 size-1.5 rounded-full bg-gray-400 dark:bg-neutral-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                {challenge.quote && (
                  <p className="mt-4 text-gray-600 dark:text-neutral-400">
                    &ldquo;{challenge.quote.text}&rdquo; &mdash; {challenge.quote.author},{' '}
                    {challenge.quote.role}
                  </p>
                )}
              </div>

              {/* The Solution */}
              <div>
                <h4 className="mb-4 font-semibold text-xl text-gray-800 dark:text-neutral-200">
                  The Solution
                </h4>
                <ul className="flex flex-col space-y-2 text-gray-600 dark:text-neutral-400">
                  {solution.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-x-3">
                      <div className="shrink-0 mt-1.5 size-1.5 rounded-full bg-gray-400 dark:bg-neutral-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* The Impact */}
              <div>
                <h4 className="mb-4 font-semibold text-xl text-gray-800 dark:text-neutral-200">
                  The Impact
                </h4>
                <p className="mb-4 text-gray-600 dark:text-neutral-400">
                  {impact.description}
                </p>
                <ul className="flex flex-col space-y-2 text-gray-600 dark:text-neutral-400">
                  {impact.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-x-3">
                      <div className="shrink-0 mt-1.5 size-1.5 rounded-full bg-gray-400 dark:bg-neutral-600" />
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-neutral-200">
                          {item.label}:{' '}
                        </span>
                        {item.description}
                      </div>
                    </li>
                  ))}
                </ul>
                {impact.quote && (
                  <p className="mt-4 text-gray-600 dark:text-neutral-400">
                    &ldquo;{impact.quote.text}&rdquo; &mdash; {impact.quote.author},{' '}
                    {impact.quote.role}
                  </p>
                )}
              </div>

              {/* Looking Ahead */}
              <div>
                <h4 className="mb-4 font-semibold text-xl text-gray-800 dark:text-neutral-200">
                  Looking Ahead
                </h4>
                <p className="mb-4 text-gray-600 dark:text-neutral-400">
                  {lookingAhead.description}
                </p>
                {lookingAhead.quote && (
                  <p className="text-gray-600 dark:text-neutral-400">
                    &ldquo;{lookingAhead.quote.text}&rdquo; &mdash; {lookingAhead.quote.author}
                    {lookingAhead.quote.role && `, ${lookingAhead.quote.role}`}
                  </p>
                )}
              </div>
            </div>
            {/* End Content Sections */}

            {/* More Stories */}
            <div className="mb-8">
              <h4 className="mb-6 font-semibold text-xl text-gray-800 dark:text-neutral-200">
                More stories
              </h4>
              <div className="space-y-5">
                {moreStories.map((story, idx) => (
                  <Link
                    key={idx}
                    href={story.href}
                    className="group flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 focus:outline-hidden focus:border-gray-300 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-600 dark:focus:border-neutral-600"
                  >
                    <div className="mb-4 flex items-center gap-x-3">
                      {story.icon}
                      <div className="grow">
                        <p className="font-semibold text-3xl text-gray-800 dark:text-neutral-200">
                          {story.percentage}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-x-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:bg-blue-100 group-hover:border-blue-100 group-hover:text-blue-600 group-focus:bg-blue-100 group-focus:border-blue-100 group-focus:text-blue-600 py-2 px-3 rounded-lg border border-transparent dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:group-hover:bg-blue-800/50 dark:group-hover:border-blue-800/10 dark:group-hover:text-blue-500 dark:group-focus:bg-blue-800/10 dark:group-focus:border-blue-800/50 dark:group-focus:text-blue-500">
                        <span>Learn more</span>
                        <svg
                          className="shrink-0 size-3.5"
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
                          <path
                            className="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition"
                            d="M5 12h14"
                          />
                          <path
                            className="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition"
                            d="m12 5 7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-xl text-gray-800 dark:text-neutral-200">
                        {story.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        {story.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {/* End More Stories */}
          </div>
          {/* End Center Content */}

          {/* Right Sidebar - Company Info */}
          <div className="lg:w-4/12">
            <div className="sticky top-20 p-6 bg-white border border-gray-200 rounded-xl dark:bg-neutral-900 dark:border-neutral-700">
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 font-semibold text-sm text-gray-800 dark:text-neutral-200">
                    {companyInfo.name}
                  </h4>
                  <a
                    href={companyInfo.website}
                    className="text-sm text-blue-600 hover:text-blue-700 focus:outline-hidden dark:hover:text-blue-500"
                  >
                    {companyInfo.website.replace('https://', '').replace('http://', '')}
                  </a>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-sm text-gray-800 dark:text-neutral-200">
                    Industry
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    {companyInfo.industry}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-sm text-gray-800 dark:text-neutral-200">
                    Founded
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    {companyInfo.founded}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-sm text-gray-800 dark:text-neutral-200">
                    Funding raised
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    {companyInfo.funding}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-sm text-gray-800 dark:text-neutral-200">
                    CEO
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    {companyInfo.ceo}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* End Right Sidebar */}
        </div>
        {/* End Grid */}
      </div>
    </div>
  );
}

