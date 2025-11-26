'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Account Breadcrumb Component
 *
 * Breadcrumb dinámico que muestra el tab activo.
 * Basado en la plantilla Preline Pro.
 */

interface TabInfo {
  id: string
  label: string
  href: string
}

const tabs: TabInfo[] = [
  { id: 'profile', label: 'Profile', href: '/account/profile' },
  { id: 'notifications', label: 'Notifications', href: '/account/notifications' },
  { id: 'integrations', label: 'Integrations', href: '/account/integrations' },
  { id: 'preferences', label: 'Preferences', href: '/account/preferences' },
  { id: 'workspace', label: 'Workspace', href: '/account/workspace' },
  { id: 'plan-and-billing', label: 'Plan & Billing', href: '/account/plan-and-billing' },
  { id: 'members', label: 'Members', href: '/account/members' },
]

export default function AccountBreadcrumb() {
  const pathname = usePathname()

  // Determinar el tab activo basado en la ruta
  const activeTab = tabs.find((tab) => pathname === tab.href || pathname.startsWith(tab.href + '/')) || tabs[0]

  return (
    <ol className="lg:hidden pt-3 md:pt-5 sm:pb-2 md:pb-0 px-2 sm:px-5 flex items-center whitespace-nowrap">
      <li className="flex items-center text-sm text-gray-600 dark:text-neutral-500">
        <Link href="/" className="hover:text-gray-800 dark:hover:text-neutral-200">
          Dashboard
        </Link>
        <svg
          className="shrink-0 overflow-visible size-4 ms-1.5 text-gray-400 dark:text-neutral-600"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
        </svg>
      </li>
      <li className="ps-1.5 flex items-center text-sm text-gray-600 dark:text-neutral-500">
        Account
        <svg
          className="shrink-0 overflow-visible size-4 ms-1.5 text-gray-400 dark:text-neutral-600"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
        </svg>
      </li>
      <li className="ps-1.5 flex items-center truncate font-semibold text-gray-800 dark:text-neutral-200 text-sm truncate">
        <span className="truncate">{activeTab.label}</span>
      </li>
    </ol>
  )
}

