'use client'

import { useRouter } from 'next/navigation'

/**
 * Botón de Sign Out
 * 
 * Client Component que maneja el cierre de sesión.
 * Usa un form action para llamar a la ruta de signout.
 */
export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const response = await fetch('/auth/signout', {
      method: 'POST',
    })

    if (response.ok) {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 w-full"
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
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
      </svg>
      Sign out
    </button>
  )
}

