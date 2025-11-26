import Link from 'next/link';

interface CustomerLogoCardProps {
  title: string;
  logoSvg: string;
  href: string;
}

/**
 * CustomerLogoCard Component
 * Card con logo SVG y título, con efectos hover idénticos al template
 */
export default function CustomerLogoCard({
  title,
  logoSvg,
  href,
}: CustomerLogoCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden flex flex-col justify-center items-center text-center p-6 rounded-xl border border-gray-200 bg-white hover:bg-neutral-50 focus:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:border-neutral-700 focus:outline-hidden before:absolute before:inset-0 before:size-full before:bg-[radial-gradient(var(--color-gray-300)_1px,transparent_1px)] dark:before:bg-[radial-gradient(var(--color-neutral-700)_1px,transparent_1px)] before:bg-[size:20px_20px]"
    >
      <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-3 group-focus:-translate-y-3">
        <div className="flex justify-center items-center mb-4">
          <div
            className="text-gray-800 dark:text-neutral-200"
            dangerouslySetInnerHTML={{ __html: logoSvg }}
          />
        </div>

        <h3 className="text-gray-800 dark:text-neutral-200 font-medium">
          {title}
        </h3>
      </div>

      <p className="relative z-10 mt-2 text-sm text-blue-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-3 group-focus:opacity-100 group-focus:translate-y-3 dark:text-blue-500">
        Learn more
      </p>
    </Link>
  );
}

