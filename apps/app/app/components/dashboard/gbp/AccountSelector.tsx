'use client'

import { useState } from 'react'
import type { GBPAccount } from '@/lib/gbp/types'

interface AccountSelectorProps {
  accounts: GBPAccount[]
  selectedAccount: GBPAccount | null
  onAccountChange: (account: GBPAccount) => void
}

/**
 * Account Selector Component
 *
 * Selector de cuenta/organización para Google Business Profile.
 * Permite cambiar entre diferentes cuentas y ver sus ubicaciones.
 * Client Component - Requiere interactividad.
 */
export default function AccountSelector({
  accounts,
  selectedAccount,
  onAccountChange,
}: AccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (account: GBPAccount) => {
    onAccountChange(account)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Button */}
      <button
        type="button"
        className="w-full sm:w-auto py-2.5 px-3 inline-flex items-center justify-center sm:justify-start gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
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
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="text-gray-800 dark:text-neutral-200">
          {selectedAccount?.accountName || 'Seleccionar cuenta'}
        </span>
        {selectedAccount && (
          <span className="py-0.5 px-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full dark:bg-neutral-700 dark:text-neutral-400">
            {selectedAccount.locationCount} ubicaciones
          </span>
        )}
        <svg
          className={`shrink-0 size-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {/* End Button */}

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          {/* End Overlay */}

          <div className="absolute z-20 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase dark:text-neutral-400">
                Cuentas disponibles
              </div>
              {accounts.map((account) => (
                <button
                  key={account.accountId}
                  type="button"
                  className={`w-full text-left py-2 px-3 rounded-lg text-sm ${
                    selectedAccount?.accountId === account.accountId
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500'
                      : 'text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                  onClick={() => handleSelect(account)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{account.accountName}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {account.accountType === 'organization' ? 'Organización' : 'Personal'} •{' '}
                        {account.locationCount} ubicaciones
                      </div>
                    </div>
                    {selectedAccount?.accountId === account.accountId && (
                      <svg
                        className="shrink-0 size-4 text-blue-600 dark:text-blue-500"
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
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {/* End Dropdown */}
    </div>
  )
}
