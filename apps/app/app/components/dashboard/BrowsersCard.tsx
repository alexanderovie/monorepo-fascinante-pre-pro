
import Image from 'next/image';

/**
 * Business Health Card Component
 *
 * Muestra el score global de salud del negocio combinando visibilidad en directorios,
 * rendimiento SEO del sitio web y preparación para publicidad pagada.
 * Server Component - No requiere interactividad del cliente.
 */
export default function BrowsersCard() {
  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="p-5 pb-3 flex justify-between items-center">
        <h2 className="ms-1 inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
          Business Health
        </h2>

        <span className="py-1 ps-1.5 pe-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
          <svg className="shrink-0 size-3" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </svg>
          Good
        </span>
      </div>
      {/* End Header */}

      {/* Body */}
      <div className="flex flex-col justify-between h-full pb-5 px-5">
        <div>
          <h4 className="text-5xl md:text-6xl font-medium text-blue-600 dark:text-blue-500">
            <span className="bg-clip-text bg-linear-to-tl from-blue-500 to-violet-500 text-transparent">
              85%
            </span>
          </h4>

          <p className="mt-5 text-gray-500 dark:text-neutral-500">
            Combines business visibility across directories, website SEO performance, and readiness for paid advertising.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-5">
          {/* Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Card */}
            <div className="p-3 bg-gray-100 dark:bg-neutral-700 rounded-lg">
              <Image
                className="shrink-0 size-6 mb-4"
                src="/assets/images/directories-icon.svg"
                alt="Business directories visibility icon - Google Business Profile, Apple Maps, and local listings"
                width={24}
                height={24}
                unoptimized
              />
              <p className="text-sm text-gray-800 dark:text-neutral-200">
                Directories
              </p>
              <p className="font-semibold text-lg text-gray-800 dark:text-neutral-200">
                56%
              </p>
            </div>
            {/* End Card */}

            {/* Card */}
            <div className="p-3 bg-gray-100 dark:bg-neutral-700 rounded-lg">
              <Image
                className="shrink-0 size-6 mb-4"
                src="/assets/images/website-icon.png"
                alt="Website SEO performance icon - Search engine optimization and website visibility metrics"
                width={24}
                height={24}
                unoptimized
              />
              <p className="text-sm text-gray-800 dark:text-neutral-200">
                Website
              </p>
              <p className="font-semibold text-lg text-gray-800 dark:text-neutral-200">
                24%
              </p>
            </div>
            {/* End Card */}

            {/* Card */}
            <div className="p-3 bg-gray-100 dark:bg-neutral-700 rounded-lg">
              <Image
                className="shrink-0 size-6 mb-4"
                src="/assets/images/ads-ready-icon.svg"
                alt="Ads Ready icon - Paid advertising campaign readiness and optimization metrics"
                width={24}
                height={24}
                unoptimized
              />
              <p className="text-sm text-gray-800 dark:text-neutral-200">
                Ads Ready
              </p>
              <p className="font-semibold text-lg text-gray-800 dark:text-neutral-200">
                17%
              </p>
            </div>
            {/* End Card */}
          </div>
          {/* End Grid */}
        </div>
        {/* End Stats */}

        <div className="mt-5">
          {/* Alert */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs py-2 px-3 dark:bg-neutral-800 dark:border-neutral-700" role="alert" tabIndex={-1} aria-labelledby="hs-pro-dpna-label">
            <div className="flex items-center gap-x-3">
              <svg className="shrink-0 size-5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <div className="grow">
                <h3 id="hs-pro-dpna-label" className="text-sm text-gray-800 font-semibold dark:text-white">
                  Push notifications
                </h3>
                <p className="text-sm text-gray-700 dark:text-neutral-400">
                  Automatically send me notifications
                </p>
              </div>

              <div className="flex items-center self-stretch">
                {/* Switch/Toggle */}
                <label htmlFor="hs-pro-dbcpns" className="relative inline-block w-11 h-6 cursor-pointer">
                  <input type="checkbox" id="hs-pro-dbcpns" className="peer sr-only" defaultChecked />
                  <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 dark:bg-neutral-700 dark:peer-checked:bg-blue-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                  <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white"></span>
                </label>
                {/* End Switch/Toggle */}
              </div>
            </div>
          </div>
          {/* End Alert */}
        </div>
      </div>
      {/* End Body */}
    </div>
  );
}
