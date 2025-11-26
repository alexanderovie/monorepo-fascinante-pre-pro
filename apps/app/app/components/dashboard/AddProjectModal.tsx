'use client';

/**
 * Add Location Modal Component
 *
 * Modal para agregar una nueva ubicación de negocio con formulario de nombre, dirección y logo.
 * Client Component - Requiere Preline UI para funcionar.
 */
export default function AddProjectModal() {
  return (
    <>
      {/* Add Project Modal */}
      <div
        id="hs-pro-dasadpm"
        className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto [--close-when-click-inside:true] pointer-events-none"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-pro-dasadpm-label"
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-56px)] min-h-[calc(100%-56px)] flex items-center">
          <div className="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-xl dark:bg-neutral-800">
            {/* Header */}
            <div className="py-2.5 px-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
              <h3 id="hs-pro-dasadpm-label" className="font-medium text-gray-800 dark:text-neutral-200">
                Add Location
              </h3>
              <button
                type="button"
                className="size-8 shrink-0 flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                aria-label="Close"
                data-hs-overlay="#hs-pro-dasadpm"
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

            <form>
              {/* Body */}
              <div className="p-4 space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200">
                    Business logo
                  </label>

                  {/* Logo Upload Group */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                    <span className="flex shrink-0 justify-center items-center size-20 border-2 border-dotted border-gray-300 text-gray-400 rounded-full dark:border-neutral-700 dark:text-neutral-600">
                      <svg
                        className="shrink-0 size-7"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </span>

                    <div className="grow">
                      <div className="flex items-center gap-x-2">
                        <button
                          type="button"
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                          </svg>
                          Upload photo
                        </button>

                        <button
                          type="button"
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-red-500 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-red-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                          disabled
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* End Logo Upload Group */}
                </div>

                <div>
                  <label htmlFor="hs-pro-dalpn" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">
                    Business name
                  </label>

                  <input
                    type="text"
                    id="hs-pro-dalpn"
                    className="py-2 sm:py-2.5 px-3 block w-full border-gray-200 rounded-lg sm:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                    placeholder="Downtown Restaurant"
                  />
                </div>

                <div>
                  <label htmlFor="hs-pro-dalsd" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">
                    Business address
                  </label>

                  <input
                    type="text"
                    id="hs-pro-dalsd"
                    className="py-2 sm:py-2.5 px-3 block w-full border-gray-200 rounded-lg sm:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                    placeholder="123 Main Street, City, State ZIP"
                  />
                </div>
              </div>
              {/* End Body */}

              {/* Footer */}
              <div className="p-4 flex justify-end gap-x-2">
                <div className="flex-1 flex justify-end items-center gap-2">
                  <button
                    type="button"
                    className="py-2 px-3 text-nowrap inline-flex justify-center items-center text-start whitespace-nowrap bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    data-hs-overlay="#hs-pro-dasadpm"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="py-2 px-3 text-nowrap inline-flex justify-center items-center gap-x-2 text-start whitespace-nowrap bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500"
                    data-hs-overlay="#hs-pro-dasadpm"
                  >
                    Save
                  </button>
                </div>
              </div>
              {/* End Footer */}
            </form>
          </div>
        </div>
      </div>
      {/* End Add Project Modal */}
    </>
  );
}
