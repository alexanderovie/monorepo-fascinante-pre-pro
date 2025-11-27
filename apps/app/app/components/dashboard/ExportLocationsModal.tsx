'use client'

/**
 * Export Locations Modal Component
 *
 * Modal para exportar ubicaciones en diferentes formatos (CSV, Google CSV) con opciones de filtrado.
 * Basado en la plantilla original de Preline.
 */
export default function ExportLocationsModal() {
  return (
    <>
      {/* Export Locations Modal */}
      <div
        id="hs-pro-decm"
        className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto [--close-when-click-inside:true] pointer-events-none"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-pro-decm-label"
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-56px)] min-h-[calc(100%-56px)] flex items-center">
          <div className="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-xl dark:bg-neutral-800">
            {/* Header */}
            <div className="py-2.5 px-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
              <h3 id="hs-pro-decm-label" className="font-medium text-gray-800 dark:text-neutral-200">
                Export locations
              </h3>
              <button
                type="button"
                className="size-8 shrink-0 flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                aria-label="Close"
                data-hs-overlay="#hs-pro-decm"
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
            <div className="p-4 space-y-5">
              {/* Choose what to export */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-800 dark:text-neutral-200">
                  Choose what location details want to export:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                      defaultChecked
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Name</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                      defaultChecked
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Category</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                      defaultChecked
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Status</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Address</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Phone</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Health Score</span>
                  </label>
                </div>
              </div>

              {/* Choose format */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-800 dark:text-neutral-200">
                  Choose your format for exporting your locations:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="export-format"
                      value="csv"
                      className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                      defaultChecked
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Regular CSV file</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="export-format"
                      value="google-csv"
                      className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Google CSV file</span>
                  </label>
                </div>
              </div>

              {/* Date range */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-800 dark:text-neutral-200">
                  Date range
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date-range"
                      value="today"
                      className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Today</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date-range"
                      value="last-7-days"
                      className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Last 7 days</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date-range"
                      value="current-month"
                      className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                      defaultChecked
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Current month</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date-range"
                      value="last-month"
                      className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Last month</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date-range"
                      value="all"
                      className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date-range"
                      value="custom"
                      className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500"
                    />
                    <span className="ms-2 text-sm text-gray-800 dark:text-neutral-200">Custom</span>
                  </label>
                </div>
              </div>
            </div>
            {/* End Body */}

            {/* Footer */}
            <div className="p-4 flex justify-end gap-x-2 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                className="py-2 px-3 text-nowrap inline-flex justify-center items-center text-start whitespace-nowrap bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                data-hs-overlay="#hs-pro-decm"
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-3 text-nowrap inline-flex justify-center items-center gap-x-2 text-start whitespace-nowrap bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500"
              >
                Export
              </button>
            </div>
            {/* End Footer */}
          </div>
        </div>
      </div>
      {/* End Export Locations Modal */}
    </>
  )
}
