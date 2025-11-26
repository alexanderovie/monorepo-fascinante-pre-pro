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
      <div className="p-5 pb-3 flex items-start justify-between gap-x-3">
        <div className="flex items-start gap-x-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="shrink-0">
            <div className="size-12 flex items-center justify-center bg-gray-100 rounded-lg dark:bg-neutral-700">
              {integration.icon ? (
                <Image
                  src={integration.icon}
                  alt={`${integration.name} icon`}
                  width={32}
                  height={32}
                  className="size-8"
                  unoptimized
                />
              ) : (
                <svg
                  className="size-8 text-gray-400 dark:text-neutral-500"
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

          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                {integration.name}
              </h3>
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
            </div>
            <p className="text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">
              {integration.description}
            </p>
          </div>
          {/* End Title and Description */}
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          {isConnected && (
            <span className="py-1 ps-1.5 pe-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
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
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Connected
            </span>
          )}
          {isPending && (
            <span className="py-1 ps-1.5 pe-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
              <svg
                className="shrink-0 size-3 animate-spin"
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
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Connecting...
            </span>
          )}
          {hasError && (
            <span className="py-1 ps-1.5 pe-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500">
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
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
              Error
            </span>
          )}
        </div>
        {/* End Status Badge */}
      </div>
      {/* End Header */}

      {/* Features */}
      {integration.features.length > 0 && (
        <div className="px-5 pb-3">
          <ul className="flex flex-wrap gap-2">
            {integration.features.slice(0, 3).map((feature, index) => (
              <li
                key={index}
                className="py-0.5 px-2 text-xs text-gray-600 bg-gray-100 rounded-md dark:bg-neutral-700 dark:text-neutral-400"
              >
                {feature}
              </li>
            ))}
            {integration.features.length > 3 && (
              <li className="py-0.5 px-2 text-xs text-gray-500 dark:text-neutral-500">
                +{integration.features.length - 3} more
              </li>
            )}
          </ul>
        </div>
      )}
      {/* End Features */}

      {/* Footer Actions */}
      <div className="p-5 pt-3 flex items-center justify-between gap-x-2 border-t border-gray-200 dark:border-neutral-700">
        <div className="flex items-center gap-x-2">
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
        </div>

        <div className="flex items-center gap-x-2">
          {isConnected ? (
            <>
              <button
                type="button"
                onClick={() => onViewSettings(integration.id)}
                className="py-2 px-3 inline-flex items-center gap-x-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                View integration
              </button>
              <button
                type="button"
                onClick={() => onDisconnect(integration.id)}
                className="py-2 px-3 inline-flex items-center gap-x-1.5 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                Disconnect
              </button>
            </>
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
      </div>
      {/* End Footer Actions */}
    </div>
  )
}

