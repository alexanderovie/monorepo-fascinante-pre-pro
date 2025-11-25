'use client';

import React from 'react';
import Image from 'next/image';
import type { FloatingCard } from '../lib/features-hero-cards-data';

interface FeaturesHeroProps {
  badge?: string;
  title: string;
  description?: string;
  cards?: FloatingCard[];
  className?: string;
}

// Badge component
const Badge = ({
  label,
  variant,
}: {
  label: string;
  variant: 'yellow' | 'gray' | 'indigo' | 'purple' | 'green';
}) => {
  const variantClasses = {
    yellow:
      'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-500',
    gray: 'border-gray-200 bg-white text-gray-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200',
    indigo: 'border-indigo-200 bg-indigo-100 text-indigo-800 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-500',
    purple: 'border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-500',
    green: 'bg-linear-to-tr from-lime-500 to-teal-500 text-white',
  };

  return (
    <span
      className={`py-0.5 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full border ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
};

// Render card based on type
const renderCard = (card: FloatingCard) => {
  const positionClasses = [
    card.position.top || '',
    card.position.bottom || '',
    card.position.start || '',
    card.position.end || '',
    card.position.hidden || '',
    card.scale || '',
    card.blur ? 'blur-xs' : '',
    card.opacity || '',
    '-z-1',
  ]
    .filter(Boolean)
    .join(' ');

  switch (card.type) {
    case 'datatables':
      return (
        <div
          key={card.id}
          className={`absolute ${positionClasses} p-2.5 w-64 flex flex-col gap-y-2.5 bg-white ring-6 ring-white/50 rounded-2xl shadow-lg dark:bg-neutral-900 dark:ring-black/30`}
        >
          <span className="block font-medium text-sm text-gray-800 dark:text-neutral-200">
            {card.content.title}
          </span>

          {card.content.avatar && (
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-x-1">
                <Image
                  className="shrink-0 size-5 rounded-full"
                  src={card.content.avatar.src}
                  alt={card.content.avatar.alt}
                  width={20}
                  height={20}
                />
                <div className="grow">
                  <span className="block text-[13px] text-gray-800 dark:text-neutral-200">
                    {card.content.avatar.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {card.content.badges && (
            <div className="flex flex-wrap gap-1">
              {card.content.badges.map((badge, idx) => (
                <Badge key={idx} label={badge.label} variant={badge.variant} />
              ))}
            </div>
          )}

          {/* Footer with stats and progress */}
          <div className="flex items-center">
            {card.content.stats && card.content.stats.map((stat, idx) => (
              <div key={idx} className={idx > 0 ? 'relative ms-2.5 ps-2.5 before:absolute before:top-1/2 before:-start-px before:w-px before:h-3 before:bg-gray-300 before:-translate-y-1/2 dark:before:bg-neutral-700' : ''}>
                <span className="flex justify-center items-center gap-x-1 text-xs text-gray-500 dark:text-neutral-500">
                  {stat.icon}
                  {stat.value}
                </span>
              </div>
            ))}

            {card.content.progress && (
              <div className="ms-auto w-1/2 flex items-center gap-x-1 whitespace-nowrap">
                <div
                  className="flex w-full h-1 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
                  role="progressbar"
                  aria-valuenow={card.content.progress.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="flex flex-col justify-center rounded-full overflow-hidden bg-green-500 text-xs text-white text-center whitespace-nowrap transition duration-500"
                    style={{ width: `${card.content.progress.value}%` }}
                  ></div>
                </div>
                <div className="w-10 text-end -mt-0.5">
                  <span className="text-xs text-gray-500 dark:text-neutral-500">
                    {card.content.progress.label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'users':
      return (
        <div
          key={card.id}
          className={`absolute ${positionClasses} relative w-64 overflow-hidden p-4 sm:p-5 bg-white ring-6 ring-white/50 rounded-2xl shadow-lg before:absolute before:top-0 before:end-0 before:size-full before:bg-linear-to-br before:from-purple-100 before:via-transparent before:blur-xl dark:bg-neutral-800 dark:ring-black/30 dark:before:from-purple-800/30 dark:before:via-transparent`}
        >
          <div className="relative z-10">
            <div className="flex justify-between gap-x-3">
              <span className="mb-3 inline-flex justify-center items-center size-8 md:size-10 rounded-lg bg-white text-gray-700 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                <svg
                  className="shrink-0 size-4 md:size-5 text-purple-500"
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
              </span>
            </div>

            <h2 className="text-sm md:text-base text-gray-800 dark:text-neutral-200">
              {card.content.title}
            </h2>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3">
              <h3 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
                {card.content.value}
              </h3>

              <div className="flex items-center -space-x-2">
                {card.content.avatars?.map((avatar, idx) => (
                  <div key={idx} className="hs-tooltip hidden sm:inline-block hover:z-10">
                    {avatar.src ? (
                      <Image
                        className="hs-tooltip-toggle shrink-0 size-7 border-2 border-white rounded-full dark:border-neutral-800"
                        src={avatar.src}
                        alt={avatar.alt}
                        width={28}
                        height={28}
                      />
                    ) : (
                      <span className="hs-tooltip-toggle flex shrink-0 justify-center items-center size-7 bg-gray-200 border-2 border-white text-gray-700 text-xs font-medium uppercase rounded-full dark:bg-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
                        {avatar.initial}
                      </span>
                    )}
                    <span
                      className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700"
                      role="tooltip"
                    >
                      {avatar.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 'dropbox':
      return (
        <div
          key={card.id}
          className={`absolute ${positionClasses} relative w-48 overflow-hidden p-4 bg-indigo-200 ring-6 ring-white/50 rounded-2xl shadow-lg dark:bg-indigo-900 dark:ring-black/30`}
        >
          <div className="relative z-10">
            <svg
              className="mb-2 shrink-0 size-8 text-indigo-700 dark:text-white"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2L0 7.27424L8 12.471L15.9999 7.27424L8 2ZM23.9999 2L15.9999 7.27424L23.9999 12.471L31.9998 7.27424L23.9999 2ZM0 17.7451L8 23.0194L15.9999 17.7451L8 12.471L0 17.7451ZM23.9999 12.471L15.9999 17.7451L23.9999 23.0194L31.9998 17.7451L23.9999 12.471ZM8 24.7258L15.9999 30L23.9999 24.7258L15.9999 19.5291L8 24.7258Z"
                fill="currentColor"
              />
            </svg>

            <h3 className="font-semibold text-sm text-gray-800 dark:text-indigo-100">
              {card.content.title}
            </h3>

            <div className="mt-5">
              <p className="font-semibold text-xl text-gray-800 dark:text-white">
                {card.content.value}{' '}
                <span className="font-normal text-sm text-indigo-900 dark:text-indigo-100/50">
                  {card.content.valueSuffix}
                </span>
              </p>
              <p className="text-xs text-indigo-900 dark:text-indigo-100/50">
                {card.content.description}
              </p>
              {card.content.button && (
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-indigo-800 hover:text-indigo-600 disabled:opacity-50 disabled:pointer-events-none decoration-2 focus:outline-hidden focus:underline dark:text-indigo-100/50 dark:hover:text-indigo-100"
                  >
                    {card.content.button.label}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="z-9 absolute top-0 end-0">
            <svg
              className="w-48 h-56"
              width="806"
              height="511"
              viewBox="0 0 806 511"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M544.8 -1147.08L1098.08 484L714.167 614.228C692.688 577.817 658.308 547.748 620.707 527.375C561.271 495.163 493.688 482.213 428.253 465.21C391.41 455.641 349.053 438.735 340.625 401.621C335.248 377.942 346.056 354.034 351.234 330.304C364.887 267.777 335.093 198.172 280.434 164.889C266.851 156.619 251.423 149.934 242.315 136.897C214.215 96.6599 268.253 45.1471 263.125 -3.66296C261.266 -21.3099 251.617 -37.124 241.172 -51.463C126.21 -209.336 -87.5388 -248.663 -263.351 -333.763C-314.682 -358.613 -364.939 -389.135 -400.106 -434.021C-435.273 -478.907 -453.106 -540.621 -434.096 -594.389C-408.119 -667.874 -325.246 -703.948 -248.613 -718.248C-171.98 -732.548 -90.1128 -734.502 -23.1788 -774.468C49.5632 -817.9 90.8002 -897.847 147.393 -960.879C175.737 -992.458 208.024 -1019.8 242.465 -1044.52L544.8 -1147.08Z"
                fill="currentColor"
                className="fill-indigo-300/40 dark:fill-indigo-700/40"
              />
              <path
                d="M726.923 -1341.99L1280.23 288.8L896.3 419.008C874.821 382.608 840.438 352.54 802.834 332.171C743.394 299.964 675.808 287.017 610.369 270.017C573.523 260.45 531.162 243.546 522.736 206.439C517.358 182.765 528.167 158.861 533.345 135.139C547 72.6228 517.203 3.03076 462.545 -30.2462C448.963 -38.5142 433.533 -45.1982 424.425 -58.2323C396.325 -98.4623 450.366 -149.965 445.237 -198.767C443.377 -216.411 433.727 -232.222 423.283 -246.567C308.3 -404.412 94.5421 -443.732 -81.2789 -528.817C-132.615 -553.663 -182.874 -584.179 -218.044 -629.057C-253.214 -673.935 -271.044 -735.64 -252.036 -789.397C-226.058 -862.869 -143.178 -898.936 -66.543 -913.234C10.092 -927.532 91.9721 -929.485 158.905 -969.444C231.652 -1012.86 272.9 -1092.8 329.489 -1155.82C357.834 -1187.39 390.124 -1214.73 424.565 -1239.45L726.923 -1341.99Z"
                fill="currentColor"
                className="fill-indigo-400/20 dark:fill-indigo-600/30"
              />
            </svg>
          </div>
        </div>
      );

    case 'profile':
      return (
        <div
          key={card.id}
          className={`absolute ${positionClasses} py-4 px-3 w-32 flex flex-col items-center gap-x-3 bg-white ring-6 ring-white/50 rounded-2xl shadow-lg dark:bg-neutral-900 dark:ring-black/30`}
        >
          {card.content.avatar && (
            <span className="mb-3 shrink-0 relative">
              <Image
                className="shrink-0 size-11 rounded-full"
                src={card.content.avatar.src}
                alt={card.content.avatar.alt}
                width={44}
                height={44}
              />
              <span className="absolute flex shrink-0 justify-center items-center size-5 overflow-hidden -bottom-1 -end-1 bg-white dark:bg-neutral-900 rounded-full">
                <svg
                  className="shrink-0 w-3 h-auto"
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.0835 3.23358C9.88316 3.23358 3.23548 9.8771 3.23548 18.0723V35.5832H0.583496V18.0723C0.583496 8.41337 8.41851 0.583252 18.0835 0.583252C27.7485 0.583252 35.5835 8.41337 35.5835 18.0723C35.5835 27.7312 27.7485 35.5614 18.0835 35.5614H16.7357V32.911H18.0835C26.2838 32.911 32.9315 26.2675 32.9315 18.0723C32.9315 9.8771 26.2838 3.23358 18.0835 3.23358Z"
                    className="fill-purple-600 dark:fill-purple-500"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.0833 8.62162C12.8852 8.62162 8.62666 12.9245 8.62666 18.2879V35.5833H5.97468V18.2879C5.97468 11.5105 11.3713 5.97129 18.0833 5.97129C24.7954 5.97129 30.192 11.5105 30.192 18.2879C30.192 25.0653 24.7954 30.6045 18.0833 30.6045H16.7355V27.9542H18.0833C23.2815 27.9542 27.54 23.6513 27.54 18.2879C27.54 12.9245 23.2815 8.62162 18.0833 8.62162Z"
                    className="fill-purple-600 dark:fill-purple-500"
                    fill="currentColor"
                  />
                  <path
                    d="M24.8225 18.1012C24.8225 21.8208 21.8053 24.8361 18.0833 24.8361C14.3614 24.8361 11.3442 21.8208 11.3442 18.1012C11.3442 14.3815 14.3614 11.3662 18.0833 11.3662C21.8053 11.3662 24.8225 14.3815 24.8225 18.1012Z"
                    className="fill-purple-600 dark:fill-purple-500"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </span>
          )}

          <div className="text-center">
            <h4 className="font-medium text-gray-800 dark:text-neutral-200">
              {card.content.title}
            </h4>
            {card.content.subtitle && (
              <p className="text-[13px] text-gray-500 dark:text-neutral-500">
                {card.content.subtitle}
              </p>
            )}
          </div>
        </div>
      );

    case 'slack':
      return (
        <div
          key={card.id}
          className={`absolute ${positionClasses} p-5 w-80 space-y-4 flex flex-col bg-white ring-6 ring-white/50 rounded-2xl shadow-lg dark:bg-neutral-900 dark:ring-black/30`}
        >
          <div className="flex justify-between">
            <div className="flex flex-col justify-center items-center size-9.5 border border-gray-200 rounded-lg dark:border-neutral-700">
              <svg
                className="shrink-0 size-5 text-gray-500 dark:text-neutral-500"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                  fill="#36C5F0"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                  fill="#2EB67D"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                  fill="#ECB22E"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                  fill="#E01E5A"
                />
              </svg>
            </div>

            <div>
              <label
                htmlFor="hs-pro-daicn1"
                className="relative py-2 px-2.5 w-full sm:w-auto block text-center sm:text-start rounded-lg cursor-pointer text-xs font-medium focus:outline-hidden"
              >
                <input
                  type="checkbox"
                  id="hs-pro-daicn1"
                  className="peer absolute top-0 start-0 size-full bg-transparent border border-gray-200 text-transparent rounded-lg cursor-pointer focus:ring-white after:block after:size-full after:rounded-md checked:after:bg-gray-200 checked:text-transparent checked:border-gray-200 checked:hover:border-gray-200 checked:focus:border-gray-200 checked:bg-none focus:bg-gray-100 checked:focus:after:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:checked:after:bg-neutral-600 dark:checked:border-neutral-700 dark:focus:ring-0 dark:focus:ring-offset-0 dark:focus:bg-neutral-700 dark:checked:focus:after:bg-neutral-700"
                  defaultChecked
                />
                <span className="relative z-10 peer-checked:hidden text-gray-800 dark:text-white">
                  Connect
                </span>
                <span className="relative z-10 justify-center items-center gap-x-1.5 hidden peer-checked:flex peer-checked:text-gray-800 text-gray-200 dark:text-white dark:peer-checked:text-white">
                  <svg
                    className="shrink-0 size-3.5 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Connected
                </span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 dark:text-neutral-200">
              {card.content.title}
            </h3>
            {card.content.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                {card.content.description}
              </p>
            )}
          </div>

          {card.content.button && (
            <button
              type="button"
              className="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              {card.content.button.label}
            </button>
          )}
        </div>
      );

    case 'product':
      return (
        <div
          key={card.id}
          className={`absolute ${positionClasses} p-2.5 w-64 flex flex-col gap-y-2.5 bg-white ring-6 ring-white/50 rounded-2xl shadow-lg dark:bg-neutral-900 dark:ring-black/30`}
        >
          <div className="h-full flex gap-x-3">
            <div className="grow h-full flex flex-col">
              <div>
                <h4 className="font-medium text-sm text-gray-800 dark:text-neutral-200">
                  {card.content.title}
                </h4>
                {card.content.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    {card.content.description}
                  </p>
                )}
              </div>
              {card.content.button && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="py-2 px-2.5 flex items-center text-sm text-start bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600"
                  >
                    {card.content.button.label}
                  </button>
                </div>
              )}
            </div>
            {card.content.image && (
              <Image
                className="shrink-0 w-20 h-24 object-cover bg-gray-100 rounded-xl dark:bg-neutral-800"
                src={card.content.image.src}
                alt={card.content.image.alt}
                width={80}
                height={96}
              />
            )}
          </div>
        </div>
      );

    case 'user-profile':
      return (
        <div
          key={card.id}
          className={`absolute ${positionClasses} w-96 flex flex-col bg-white ring-6 ring-white/50 rounded-2xl shadow-lg dark:bg-neutral-900 dark:ring-black/30`}
        >
          <figure className="shrink-0 relative h-24 overflow-hidden rounded-t-xl">
            <svg
              className="w-full h-24 rounded-t-xl"
              preserveAspectRatio="xMidYMid slice"
              width="576"
              height="120"
              viewBox="0 0 576 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_666_273469a21332)">
                <rect width="576" height="120" fill="#B2E7FE"></rect>
                <rect
                  x="289.678"
                  y="-90.3"
                  width="102.634"
                  height="391.586"
                  transform="rotate(59.5798 289.678 -90.3)"
                  fill="#FF8F5D"
                ></rect>
                <rect
                  x="41.3926"
                  y="-0.996094"
                  width="102.634"
                  height="209.864"
                  transform="rotate(-31.6412 41.3926 -0.996094)"
                  fill="#3ECEED"
                ></rect>
                <rect
                  x="66.9512"
                  y="40.4817"
                  width="102.634"
                  height="104.844"
                  transform="rotate(-31.6412 66.9512 40.4817)"
                  fill="#4C48FF"
                ></rect>
              </g>
              <defs>
                <clipPath id="clip0_666_273469a21332">
                  <rect width="576" height="120" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
          </figure>

          {card.content.avatar && (
            <div className="-mt-8 px-4 mb-3">
              <div className="relative flex items-center gap-x-3">
                <div className="relative w-20">
                  <Image
                    className="shrink-0 size-20 ring-4 ring-white rounded-3xl dark:ring-neutral-800"
                    src={card.content.avatar.src}
                    alt={card.content.avatar.alt}
                    width={80}
                    height={80}
                  />
                  {card.content.badges && card.content.badges.length > 0 && (
                    <div className="absolute -bottom-3 inset-x-0 text-center">
                      <span className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-semibold uppercase rounded-md bg-linear-to-tr from-lime-500 to-teal-500 text-white">
                        {card.content.badges[0].label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-2 end-0">
                  <div className="h-full flex justify-end items-end gap-x-2">
                    <button
                      type="button"
                      className="hs-tooltip flex justify-center items-center gap-x-3 size-7 text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                    >
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
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="sr-only">Add to favorites</span>
                      <span
                        className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700"
                        role="tooltip"
                        data-popper-placement="top"
                      >
                        Add to favorites
                      </span>
                    </button>

                    <button
                      type="button"
                      className="flex justify-center items-center gap-x-3 size-7 text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                    >
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
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 h-full">
            <h2 className="mb-2 font-medium text-gray-800 dark:text-neutral-300">
              {card.content.title}
            </h2>

            {card.content.fields && (
              <dl className="grid grid-cols-2 gap-x-2">
                {card.content.fields.map((field, idx) => (
                  <React.Fragment key={idx}>
                    <dt className="py-1 text-sm text-gray-500 dark:text-neutral-500">
                      {field.label}
                    </dt>
                    <dd className="py-1 inline-flex justify-end items-center gap-x-2 text-end font-medium text-sm text-gray-800 dark:text-neutral-200">
                      {field.value}
                    </dd>
                  </React.Fragment>
                ))}
              </dl>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default function FeaturesHero({
  badge = 'Preline Build',
  title,
  description,
  cards = [],
  className = '',
}: FeaturesHeroProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-100 before:absolute before:inset-0 before:size-full before:bg-[radial-gradient(var(--color-gray-300)_1px,transparent_1px)] dark:before:bg-[radial-gradient(var(--color-neutral-700)_1px,transparent_1px)] before:bg-[size:20px_20px] dark:bg-neutral-800 ${className}`}
    >
      <div className="relative z-10 min-h-150 lg:min-h-[800px] flex flex-col justify-center">
        <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
          {/* Content */}
          <div className="max-w-sm md:max-w-xl mx-auto text-center">
            <p className="mb-3 md:mb-4 font-mono text-sm text-gray-500 dark:text-neutral-400">
              {badge}
            </p>

            <h1 className="font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-white">
              {title}
            </h1>

            {description && (
              <p className="mt-5 text-sm md:text-lg text-gray-800 dark:text-gray-200">
                {description}
              </p>
            )}
          </div>
          {/* End Content */}

          {/* Floating Cards */}
          {cards.map((card) => renderCard(card))}
        </div>
      </div>
    </div>
  );
}
