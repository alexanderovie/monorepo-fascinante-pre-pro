'use client';

import Image from 'next/image';
import type { TeamMember } from '../lib/about-data';

interface TeamGridProps {
  members: TeamMember[];
  className?: string;
}

const LinkedInIcon = () => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TwitterIcon = () => (
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
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const GitHubIcon = () => (
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
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export default function TeamGrid({ members, className = '' }: TeamGridProps) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className={`pt-10 pb-20 ${className}`}>
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center"
            >
              <Image
                className="shrink-0 size-24 sm:size-32 rounded-full"
                src={member.image}
                alt={member.name}
                width={128}
                height={128}
              />
              <h3 className="mt-4 font-semibold text-gray-800 dark:text-neutral-200">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                {member.role}
              </p>
              {member.bio && (
                <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                  {member.bio}
                </p>
              )}
              {member.social && (
                <div className="mt-4 flex items-center gap-x-2">
                  {member.social.linkedin && (
                    <a
                      className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      href={member.social.linkedin}
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      href={member.social.twitter}
                      aria-label="Twitter"
                    >
                      <TwitterIcon />
                    </a>
                  )}
                  {member.social.github && (
                    <a
                      className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      href={member.social.github}
                      aria-label="GitHub"
                    >
                      <GitHubIcon />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

