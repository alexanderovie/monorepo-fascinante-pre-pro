'use client'

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
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 sm:min-w-64">
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
            <svg
              className="shrink-0 size-4 text-gray-400 dark:text-neutral-500"
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

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as IntegrationCategory | 'all')}
          className="py-2 px-3 pe-9 block w-full sm:w-auto bg-white border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {/* End Category Filter */}
      </div>

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

