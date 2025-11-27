'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Integration } from '@/lib/integrations/types'

interface IntegrationCardProps {
  integration: Integration
  onConnect: (integrationId: string) => void
  onDisconnect: (integrationId: string) => void
  onViewSettings: (integrationId: string) => void
}

/**
 * Integration Card Component
 *
 * Tarjeta reutilizable para mostrar una integración.
 * Maneja estados: disconnected, connected, pending, error
 * Client Component - Requiere interactividad.
 */
export default function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onViewSettings,
}: IntegrationCardProps) {
  const isConnected = integration.status === 'connected'
  const isPending = integration.status === 'pending'
  const hasError = integration.status === 'error'

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-x-3 mb-3">
          {/* Icon */}
          <div className="shrink-0">
            <div className="size-10 flex items-center justify-center bg-gray-100 rounded-lg dark:bg-neutral-700">
              {integration.icon ? (
                <Image
                  src={integration.icon}
                  alt={`${integration.name} icon`}
                  width={24}
                  height={24}
                  className="size-6"
                  unoptimized
                />
              ) : (
                <svg
                  className="size-6 text-gray-400 dark:text-neutral-500"
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
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <path d="M12 8v8" />
                  <path d="m8 12 4-4 4 4" />
                </svg>
              )}
            </div>
          </div>
          {/* End Icon */}

          {/* Status Badge */}
          <div className="shrink-0 flex items-start gap-x-2">
            {integration.isNew && (
              <span className="py-0.5 px-1.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
                New
              </span>
            )}
            {integration.isPopular && (
              <span className="py-0.5 px-1.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                Popular
              </span>
            )}
            {isConnected && (
              <span className="py-0.5 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                <svg
                  className="shrink-0 size-2.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
                    fill="currentColor"
                  />
                </svg>
                Connected
              </span>
            )}
            {isPending && (
              <span className="py-0.5 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                <svg
                  className="shrink-0 size-2.5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 0a8 8 0 1 0 8 8A8.009 8.009 0 0 0 8 0zm0 14a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6z"
                    fill="currentColor"
                    opacity="0.4"
                  />
                  <path
                    d="M8 0a8 8 0 0 1 8 8h-2a6 6 0 0 0-6-6V0z"
                    fill="currentColor"
                  />
                </svg>
                Connecting...
              </span>
            )}
            {hasError && (
              <span className="py-0.5 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500">
                <svg
                  className="shrink-0 size-2.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
                    fill="currentColor"
                  />
                </svg>
                Error
              </span>
            )}
          </div>
          {/* End Status Badge */}
        </div>

        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 mb-1">
            {integration.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            {integration.description}
          </p>
        </div>
        {/* End Title and Description */}
      </div>
      {/* End Header */}

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-x-2 pt-3 border-t border-gray-200 dark:border-neutral-700">
        {integration.documentationUrl && (
          <Link
            href={integration.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Documentation
          </Link>
        )}

        {isConnected ? (
          <button
            type="button"
            onClick={() => onViewSettings(integration.id)}
            className="py-2 px-3 inline-flex items-center gap-x-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            View integration
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onConnect(integration.id)}
            disabled={isPending}
            className="py-2 px-3 inline-flex items-center gap-x-1.5 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
      {/* End Footer Actions */}
    </div>
  )
}
