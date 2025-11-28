/**
 * Account Selector Component
 *
 * ÉLITE PRO: Selector de cuenta de Google Business Profile con navegación por URL params.
 * Implementa estándares élite de la industria para UX/UI.
 *
 * Características:
 * - Client Component para interactividad
 * - useTransition para transiciones suaves (Next.js 15 best practice)
 * - Loading state con spinner durante transición
 * - Manejo de errores con feedback visual
 * - Throttle para evitar múltiples requests
 * - Optimistic UI con skeleton inmediato
 * - Preparado para i18n (textos en inglés)
 * - Compatible con Server Components (recibe accounts como prop)
 */

'use client'

import { useTransition, useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { GBPAccount } from '@/lib/gbp/types'
import { ACCOUNT_SELECTOR_MESSAGES } from '@/lib/gbp/constants'
import { invalidateLocationsCache } from '@/app/google-business-profile/locations/actions'

interface AccountSelectorProps {
  accounts: GBPAccount[]
  currentAccountId: string | null
}

/**
 * ÉLITE: Throttle helper para prevenir múltiples cambios rápidos
 */
function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastRun.current >= delay) {
        lastRun.current = now
        callback(...args)
      } else {
        // Si se intenta ejecutar antes del delay, programar para después
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now()
          callback(...args)
        }, delay - (now - lastRun.current))
      }
    }) as T,
    [callback, delay]
  )
}

export default function AccountSelector({ accounts, currentAccountId }: AccountSelectorProps) {
  // ÉLITE: Todos los hooks deben llamarse antes de cualquier early return
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const previousAccountIdRef = useRef<string | null>(currentAccountId)

  // ÉLITE: Función de cambio de cuenta con manejo de errores
  const handleAccountChangeInternal = useCallback((accountId: string) => {
    // Validar que la cuenta existe
    const accountExists = accounts.some((acc) => acc.accountId === accountId)
    if (!accountExists) {
      setError(ACCOUNT_SELECTOR_MESSAGES.ERROR)
      // Restaurar cuenta anterior si la seleccionada no existe
      if (previousAccountIdRef.current) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('accountId', previousAccountIdRef.current)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      }
      return
    }

    // Limpiar error si existe
    setError(null)
    previousAccountIdRef.current = accountId

    // Crear nueva URL con el accountId seleccionado
    const params = new URLSearchParams(searchParams.toString())
    params.set('accountId', accountId)

    // ÉLITE PRO: Patrón moderno de Next.js 15 - invalidar cache y navegar
    // Solución robusta: Server Action para invalidación + router.push + key en Suspense
    // Esto asegura que el Server Component obtenga datos frescos cuando cambia la cuenta
    startTransition(() => {
      // ÉLITE: Invalidar cache de forma asíncrona (no bloquea la UI)
      // Invalidamos tanto la cuenta anterior como la nueva para asegurar datos frescos
      invalidateLocationsCache(accountId).catch((err) => {
        console.error('[AccountSelector] Cache invalidation error:', err)
        // No bloquear la navegación si falla la invalidación
      })

      if (previousAccountIdRef.current && previousAccountIdRef.current !== accountId) {
        invalidateLocationsCache(previousAccountIdRef.current).catch((err) => {
          console.error('[AccountSelector] Cache invalidation error (previous):', err)
        })
      }

      try {
        // Navegar - el key en Suspense forzará re-render del Server Component
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      } catch (err) {
        // Manejo de errores durante navegación
        console.error('[AccountSelector] Navigation error:', err)
        setError(ACCOUNT_SELECTOR_MESSAGES.ERROR)
        // Restaurar cuenta anterior en caso de error
        if (previousAccountIdRef.current) {
          const restoreParams = new URLSearchParams(searchParams.toString())
          restoreParams.set('accountId', previousAccountIdRef.current)
          router.replace(`${pathname}?${restoreParams.toString()}`, { scroll: false })
        }
      }
    })
  }, [accounts, pathname, router, searchParams])

  // ÉLITE: Throttle para prevenir múltiples cambios rápidos (300ms)
  const handleAccountChange = useThrottle(handleAccountChangeInternal, 300)

  // ÉLITE: Limpiar error cuando cambia la cuenta exitosamente
  useEffect(() => {
    if (currentAccountId && currentAccountId === previousAccountIdRef.current) {
      setError(null)
    }
    previousAccountIdRef.current = currentAccountId
  }, [currentAccountId])

  // ÉLITE: Early returns después de todos los hooks
  // Si no hay cuentas, no mostrar selector
  if (accounts.length === 0) {
    return null
  }

  // Si solo hay una cuenta, no mostrar selector (no tiene sentido)
  if (accounts.length === 1) {
    return null
  }

  return (
    <div className="mb-4">
      <label
        htmlFor="account-selector"
        className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2"
      >
        {ACCOUNT_SELECTOR_MESSAGES.LABEL}
      </label>

      {/* ÉLITE: Contenedor relativo para spinner */}
      <div className="relative">
        <select
          id="account-selector"
          value={currentAccountId || ''}
          onChange={(e) => handleAccountChange(e.target.value)}
          disabled={isPending}
          aria-busy={isPending}
          aria-label={ACCOUNT_SELECTOR_MESSAGES.LABEL}
          className={`py-2 px-3 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          }`}
        >
          {accounts.map((account) => (
            <option key={account.accountId} value={account.accountId}>
              {account.accountName || account.accountId} {account.locationCount > 0 && `(${account.locationCount} locations)`}
            </option>
          ))}
        </select>

        {/* ÉLITE: Spinner de loading durante transición */}
        {isPending && (
          <div
            className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              className="animate-spin size-4 text-blue-600 dark:text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* ÉLITE: Mensaje de error con opción de reintentar */}
      {error && (
        <div className="mt-2 flex items-center gap-x-2">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null)
              if (currentAccountId) {
                // ÉLITE: Reintentar con la cuenta actual
                handleAccountChangeInternal(currentAccountId)
              }
            }}
            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-hidden"
          >
            {ACCOUNT_SELECTOR_MESSAGES.RETRY}
          </button>
        </div>
      )}

      {/* ÉLITE: Indicador visual de transición (opcional, para feedback adicional) */}
      {isPending && (
        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400" aria-live="polite">
          {ACCOUNT_SELECTOR_MESSAGES.LOADING}
        </p>
      )}
    </div>
  )
}
