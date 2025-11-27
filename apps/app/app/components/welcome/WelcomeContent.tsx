'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import InviteFriendsModal from './InviteFriendsModal'

/**
 * Welcome Content Component
 *
 * Componente principal de la página de bienvenida.
 * Basado en el template de Preline: https://preline.co/pro/dashboard/welcome-page.html
 */
export default function WelcomeContent() {
  useEffect(() => {
    // Inicializar Preline UI
    if (typeof window !== 'undefined' && (window as any).HSStaticMethods) {
      ;(window as any).HSStaticMethods.autoInit()
    }
  }, [])

  return (
    <>
      <div className="max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl dark:text-neutral-200">
            Welcome
          </h1>
          <p className="mt-3 text-gray-600 dark:text-neutral-400">
            Watch intro
          </p>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Book a demo
          </p>
        </div>

        {/* Welcome Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Explore Templates Card */}
          <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-800 dark:border-neutral-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600">
            <div className="h-52 flex flex-col justify-center items-center bg-gray-50 rounded-t-xl dark:bg-neutral-700">
              <svg
                className="w-32 h-32 text-gray-400 dark:text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                Explore the most popular Preline dashboard templates
              </h3>
              <p className="mt-3 text-gray-500 dark:text-neutral-500">
                Grab the ones that fit your marketing strategy
              </p>
            </div>
            <div className="mt-auto p-4 md:p-6 pt-0">
              <Link
                className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline hover:decoration-blue-600 dark:text-blue-500"
                href="#"
              >
                Explore templates
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
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Documentation Card */}
          <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-800 dark:border-neutral-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600">
            <div className="h-52 flex flex-col justify-center items-center bg-gray-50 rounded-t-xl dark:bg-neutral-700">
              <svg
                className="w-32 h-32 text-gray-400 dark:text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                Documentation
              </h3>
              <p className="mt-3 text-gray-500 dark:text-neutral-500">
                Whether you&apos;re a startup or a global enterprise, learn how to integrate with Preline.
              </p>
            </div>
            <div className="mt-auto p-4 md:p-6 pt-0">
              <Link
                className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline hover:decoration-blue-600 dark:text-blue-500"
                href="#"
              >
                Learn more
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
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Invite Friends Card */}
          <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-800 dark:border-neutral-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600">
            <div className="h-52 flex flex-col justify-center items-center bg-gray-50 rounded-t-xl dark:bg-neutral-700">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Image
                    key={i}
                    src={`https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80`}
                    alt={`Avatar ${i}`}
                    width={40}
                    height={40}
                    className="inline-block size-10 rounded-full ring-2 ring-white dark:ring-neutral-800"
                    unoptimized
                  />
                ))}
              </div>
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                Invite friends
              </h3>
              <p className="mt-3 text-gray-500 dark:text-neutral-500">
                Invite teammates to collaborate in Preline
              </p>
            </div>
            <div className="mt-auto p-4 md:p-6 pt-0">
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline hover:decoration-blue-600 dark:text-blue-500"
                data-hs-overlay="#hs-invite-friends-modal"
              >
                Send an invite
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
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* End Welcome Cards Grid */}
      </div>

      {/* Invite Friends Modal */}
      <InviteFriendsModal />
    </>
  )
}
