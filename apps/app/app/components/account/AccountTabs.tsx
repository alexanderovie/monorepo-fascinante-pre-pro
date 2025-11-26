'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

/**
 * Account Tabs Component
 *
 * Sistema de tabs horizontales para las páginas de Account.
 * Basado en la plantilla Preline Pro account-*.html
 *
 * Tabs según plantilla:
 * - Profile
 * - Notifications
 * - Integrations
 * - Preferences
 * - Workspace
 * - Plan & Billing
 * - Members
 */

interface Tab {
  id: string
  label: string
  href: string
}

const tabs: Tab[] = [
  { id: 'profile', label: 'Profile', href: '/account/profile' },
  { id: 'notifications', label: 'Notifications', href: '/account/notifications' },
  { id: 'integrations', label: 'Integrations', href: '/account/integrations' },
  { id: 'preferences', label: 'Preferences', href: '/account/preferences' },
  { id: 'workspace', label: 'Workspace', href: '/account/workspace' },
  { id: 'plan-and-billing', label: 'Plan & Billing', href: '/account/plan-and-billing' },
  { id: 'members', label: 'Members', href: '/account/members' },
]

export default function AccountTabs() {
  const pathname = usePathname()

  // Determinar el tab activo basado en la ruta
  const activeTabId = tabs.find((tab) => pathname === tab.href || pathname.startsWith(tab.href + '/'))?.id || 'profile'

  return (
    <div className="border-b border-gray-200 dark:border-neutral-700">
      <nav className="flex -mb-px overflow-x-auto overflow-y-hidden" aria-label="Account tabs">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`shrink-0 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hover:border-neutral-600'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

