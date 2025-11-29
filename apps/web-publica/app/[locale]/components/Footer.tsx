import type { FooterData } from '../lib/footer-data';

interface FooterProps {
  data: FooterData;
  className?: string;
}

export default function Footer({ data, className = '' }: FooterProps) {
  if (!data) {
    return null;
  }

  return (
    <footer className={`mt-auto bg-white dark:bg-neutral-900 ${className}`}>
      <div className="w-full max-w-[85rem] mx-auto pt-10 lg:pt-20 px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-6 md:mb-14">
          <div className="col-span-2 md:col-span-1 h-full flex flex-row md:flex-col justify-between gap-5">
            <div>
              {/* Logo */}
              {data.logo && (
                <a
                  className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
                  href={data.logo.href}
                  aria-label={data.logo.ariaLabel}
                >
                  {data.logo.component}
                </a>
              )}
              {/* End Logo */}
            </div>

            {data.socialLinks && data.socialLinks.length > 0 && (
              <div>
                {/* Social Brands */}
                <div className="-mx-2.5 flex flex-wrap items-center gap-1">
                  {data.socialLinks.map((social) => (
                    <a
                      key={social.name}
                      className="flex flex-col justify-center items-center size-7 md:size-9 rounded-full text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      href={social.href}
                      aria-label={social.name}
                    >
                      {social.icon}
                      <span className="sr-only">{social.name}</span>
                    </a>
                  ))}
                </div>
                {/* End Social Brands */}
              </div>
            )}
          </div>
          {/* End Col */}

          {data.columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-1 md:mb-3 font-medium text-sm text-gray-800 dark:text-neutral-200">
                {column.title}
              </h4>

              <ul className="grid md:space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="text-[13px] md:text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {data.appLinks && data.appLinks.length > 0 && (
            <div className="space-y-10">
              <div>
                <h4 className="font-medium text-sm text-gray-800 dark:text-neutral-200">Apps</h4>

                {/* Social Brands */}
                <div className="mt-2 -mx-3 flex flex-col gap-1">
                  {data.appLinks.map((app) => (
                    <div key={app.name}>
                      <a
                        className="inline-flex items-center gap-x-2 py-1.5 px-2.5 rounded-full text-[13px] md:text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                        href={app.href}
                      >
                        {app.icon}
                        {app.name}
                      </a>
                    </div>
                  ))}
                </div>
                {/* End Social Brands */}
              </div>
            </div>
          )}
          {/* End Col */}
        </div>
        {/* End Grid */}
      </div>

      {data.bottomLinks && data.bottomLinks.length > 0 && (
        <div className="w-full max-w-[85rem] pb-10 lg:pb-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-3">
            {/* List */}
            <ul className="flex flex-wrap items-center whitespace-nowrap gap-3">
              {data.bottomLinks.map((link) => (
                <li
                  key={link.label}
                  className="inline-flex items-center relative text-xs text-gray-500 pe-3.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-gray-400 after:rounded-full after:-translate-y-1/2 dark:text-neutral-500 dark:after:bg-neutral-600"
                >
                  <a
                    className="text-xs text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {/* End List */}

            {data.copyright && (
              <p className="text-xs text-gray-500 dark:text-neutral-500">{data.copyright}</p>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
