'use client'

/**
 * Import Locations Modal Component
 *
 * Modal para importar ubicaciones desde diferentes fuentes (Gmail, Notion, Word, CSV).
 * Basado en la plantilla original de Preline.
 */
export default function ImportLocationsModal() {
  return (
    <>
      {/* Import Locations Modal */}
      <div
        id="hs-pro-dicm"
        className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto [--close-when-click-inside:true] pointer-events-none"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-pro-dicm-label"
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-56px)] min-h-[calc(100%-56px)] flex items-center">
          <div className="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-xl dark:bg-neutral-800">
            {/* Header */}
            <div className="py-2.5 px-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
              <h3 id="hs-pro-dicm-label" className="font-medium text-gray-800 dark:text-neutral-200">
                Import locations
              </h3>
              <button
                type="button"
                className="size-8 shrink-0 flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                aria-label="Close"
                data-hs-overlay="#hs-pro-dicm"
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
            <div className="p-4 space-y-4">
              {/* Gmail */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200">
                  Gmail account
                </label>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-3">
                  Import your Gmail account contacts.
                </p>
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  Connect
                </button>
              </div>

              {/* Notion */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200">
                  Notion
                </label>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-3">
                  Add your locations to a Notion file and upload it here.
                </p>
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  Connect
                </button>
              </div>

              {/* Word file */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200">
                  Word file
                </label>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-3">
                  Add your locations to a Word file and upload it here.
                </p>
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  Connect
                </button>
              </div>

              {/* Upload file */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200">
                  Upload file
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-neutral-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-3m-1 1l-3 3m0 0l3 3m-3-3v6"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-neutral-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">CSV, XLS, DOCX</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" accept=".csv,.xls,.xlsx,.docx" />
                  </label>
                </div>
              </div>
            </div>
            {/* End Body */}
          </div>
        </div>
      </div>
      {/* End Import Locations Modal */}
    </>
  )
}
