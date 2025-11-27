'use client'

import { useState } from 'react'

/**
 * Invite Friends Modal Component
 *
 * Modal para invitar amigos/colaboradores.
 * Basado en el template de Preline.
 * Usa Preline UI para manejar el estado del modal automáticamente.
 */
export default function InviteFriendsModal() {
  const [teamName, setTeamName] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('pro')

  return (
    <>
      {/* Invite Friends Modal */}
      <div
        id="hs-invite-friends-modal"
        className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto [--close-when-click-inside:true] pointer-events-none"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-invite-friends-modal-label"
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-56px)] min-h-[calc(100%-56px)] flex items-center">
          <div
            className="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-xl dark:bg-neutral-800 dark:border dark:border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="py-2.5 px-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
              <h3 id="hs-invite-friends-modal-label" className="font-medium text-gray-800 dark:text-neutral-200">
                Add team account
              </h3>
              <button
                type="button"
                className="size-8 shrink-0 flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                aria-label="Close"
                data-hs-overlay="#hs-invite-friends-modal"
              >
              <span className="sr-only">Close</span>
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          {/* End Header */}

            {/* Body */}
            <div className="p-4 overflow-y-auto">
            <form>
              {/* Team Name */}
              <div className="mb-4">
                <label htmlFor="team-name" className="block text-sm font-medium mb-2 dark:text-white">
                  Team name
                </label>
                <input
                  type="text"
                  id="team-name"
                  name="team-name"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              {/* Subscription Plan */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Subscription plan
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="plan"
                      value="pro"
                      checked={selectedPlan === 'pro'}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    />
                    <span className="ms-3 text-sm text-gray-600 dark:text-neutral-400">
                      Pro (Monthly - $59 / user / month)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="plan"
                      value="free"
                      checked={selectedPlan === 'free'}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    />
                    <span className="ms-3 text-sm text-gray-600 dark:text-neutral-400">
                      Free - (Free forever)
                    </span>
                  </label>
                </div>
              </div>
            </form>
          </div>
          {/* End Body */}

            {/* Footer */}
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                data-hs-overlay="#hs-invite-friends-modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600"
                data-hs-overlay="#hs-invite-friends-modal"
              >
                Create team
              </button>
            </div>
            {/* End Footer */}
          </div>
        </div>
      </div>
    </>
  )
}

