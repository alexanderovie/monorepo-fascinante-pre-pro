'use client'

import { useEffect } from 'react'
import type { IntegrationCategory } from '@/lib/integrations/types'

interface IntegrationsFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: IntegrationCategory | 'all'
  onCategoryChange: (category: IntegrationCategory | 'all') => void
  showOnlyPopular: boolean
  onShowOnlyPopularChange: (show: boolean) => void
  totalIntegrations: number
}

/**
 * Integrations Filters Component
 *
 * Filtros y búsqueda para las integraciones.
 * Client Component - Requiere interactividad.
 */
export default function IntegrationsFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showOnlyPopular,
  onShowOnlyPopularChange,
  totalIntegrations,
}: IntegrationsFiltersProps) {
  useEffect(() => {
    // Inicializar Preline UI para el dropdown
    if (typeof window !== 'undefined' && window.HSStaticMethods) {
      window.HSStaticMethods.autoInit()
    }
  }, [])

  const categories: Array<{ value: IntegrationCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Categories' },
    { value: 'communication', label: 'Communication' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'development', label: 'Development' },
    { value: 'storage', label: 'Storage' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'monitoring', label: 'Monitoring' },
    { value: 'automation', label: 'Automation' },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full sm:max-w-md">
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
          <svg
            className="shrink-0 size-4 text-gray-400 dark:text-white/60"
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="py-2 ps-10 pe-4 block w-full bg-white border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
          placeholder="Search integrations..."
        />
      </div>
      {/* End Search Input */}

      {/* Category Dropdown */}
      <div className="hs-dropdown [--placement:bottom-left] relative inline-flex">
        <button
          id="hs-integrations-category"
          type="button"
          className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        >
          {categories.find((c) => c.value === selectedCategory)?.label || 'All Categories'}
          <svg
            className="hs-dropdown-open:rotate-180 size-4 transition"
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

        <div
          className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-48 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-xl dark:bg-neutral-900"
          aria-labelledby="hs-integrations-category"
        >
          <div className="p-1">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 w-full text-start"
              >
                {category.label}
                {selectedCategory === category.value && (
                  <svg
                    className="shrink-0 size-4 text-blue-600 dark:text-blue-500 ms-auto"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* End Category Dropdown */}

      {/* Popular Toggle and Count */}
      <div className="flex items-center gap-x-3">
        <label className="flex items-center gap-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyPopular}
            onChange={(e) => onShowOnlyPopularChange(e.target.checked)}
            className="shrink-0 size-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
          />
          <span className="text-sm text-gray-600 dark:text-neutral-400">Popular only</span>
        </label>

        <span className="text-sm text-gray-500 dark:text-neutral-500">
          {totalIntegrations} {totalIntegrations === 1 ? 'integration' : 'integrations'}
        </span>
      </div>
    </div>
  )
}

