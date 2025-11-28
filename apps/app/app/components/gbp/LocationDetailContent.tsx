/**
 * Location Detail Content
 *
 * ÉLITE PRO: Componente que muestra los detalles completos de una ubicación
 * según estándares de la industria.
 *
 * Características:
 * - Información completa y organizada
 * - Acciones rápidas
 * - Enlaces a Google Maps
 * - Responsive y accesible
 */

'use client'

import Link from 'next/link'
import type { GBPLocation } from '@/lib/gbp/types'

interface LocationDetailContentProps {
  location: GBPLocation
  locationId: string
}

export default function LocationDetailContent({ location, locationId }: LocationDetailContentProps) {
  // ÉLITE: Formatear dirección
  const formatAddress = () => {
    if (!location.storefrontAddress) return 'No address available'
    
    const { addressLines, locality, administrativeArea, postalCode, regionCode } = location.storefrontAddress
    const parts = [
      ...(addressLines || []),
      locality,
      administrativeArea,
      postalCode,
      regionCode,
    ].filter(Boolean)
    
    return parts.join(', ') || 'No address available'
  }

  // ÉLITE: Formatear teléfono
  const formatPhone = () => {
    if (!location.phoneNumbers || location.phoneNumbers.length === 0) return 'No phone available'
    return location.phoneNumbers[0]?.phoneNumber || 'No phone available'
  }

  // ÉLITE: Formatear horarios
  const formatHours = () => {
    if (!location.regularHours?.periods || location.regularHours.periods.length === 0) {
      return 'Hours not available'
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const dayMap: Record<string, string> = {
      MONDAY: 'Monday',
      TUESDAY: 'Tuesday',
      WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday',
      FRIDAY: 'Friday',
      SATURDAY: 'Saturday',
      SUNDAY: 'Sunday',
    }

    return location.regularHours.periods.map((period) => {
      const openDay = dayMap[period.openDay || ''] || period.openDay
      const closeDay = dayMap[period.closeDay || ''] || period.closeDay
      const openTime = period.openTime
        ? `${String(period.openTime.hours || 0).padStart(2, '0')}:${String(period.openTime.minutes || 0).padStart(2, '0')}`
        : ''
      const closeTime = period.closeTime
        ? `${String(period.closeTime.hours || 0).padStart(2, '0')}:${String(period.closeTime.minutes || 0).padStart(2, '0')}`
        : ''

      if (openDay === closeDay) {
        return `${openDay}: ${openTime} - ${closeTime}`
      }
      return `${openDay} - ${closeDay}: ${openTime} - ${closeTime}`
    }).join('\n')
  }

  // ÉLITE: Obtener estado de apertura
  const getOpenStatus = () => {
    if (!location.openInfo) return { status: 'unknown', label: 'Status unknown' }
    
    switch (location.openInfo.status) {
      case 'OPEN':
        return { status: 'open', label: 'Open' }
      case 'CLOSED_PERMANENTLY':
        return { status: 'closed', label: 'Closed Permanently' }
      case 'CLOSED_TEMPORARILY':
        return { status: 'temporarily', label: 'Closed Temporarily' }
      default:
        return { status: 'unknown', label: 'Status unknown' }
    }
  }

  // ÉLITE: Obtener categoría principal
  const getPrimaryCategory = () => {
    return location.categories?.primaryCategory?.displayName || 
           location.categories?.primaryCategory?.name?.replace(/^gcid:/, '') || 
           'No category'
  }

  // ÉLITE: Obtener URL de Google Maps
  const getMapsUrl = (): string | undefined => {
    if (location.metadata?.mapsUri) {
      return location.metadata.mapsUri
    }
    // Fallback: construir URL desde dirección
    const address = formatAddress()
    if (address && address !== 'No address available') {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    }
    return undefined
  }

  const openStatus = getOpenStatus()

  // ÉLITE: Iconos SVG inline (sin dependencias externas)
  const StatusIcon = () => {
    const iconClass = `size-4 ${
      openStatus.status === 'open'
        ? 'text-green-600 dark:text-green-400'
        : openStatus.status === 'closed'
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-600 dark:text-neutral-400'
    }`
    
    if (openStatus.status === 'open') {
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
    if (openStatus.status === 'closed') {
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
    return (
      <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {location.title || 'Unnamed Location'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-neutral-400">
              <span className="flex items-center gap-1">
                <StatusIcon />
                {openStatus.label}
              </span>
              <span className="text-gray-500 dark:text-neutral-500">•</span>
              <span>{getPrimaryCategory()}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {getMapsUrl() && (
              <a
                href={getMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View on Maps
                <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              Edit Location
            </button>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-start gap-3">
            <svg className="size-5 text-gray-400 dark:text-neutral-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Address</h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400 whitespace-pre-line">
                {formatAddress()}
              </p>
            </div>
          </div>
        </div>

        {/* Phone Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-start gap-3">
            <svg className="size-5 text-gray-400 dark:text-neutral-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
              <a
                href={`tel:${formatPhone()}`}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {formatPhone()}
              </a>
            </div>
          </div>
        </div>

        {/* Website Card */}
        {location.websiteUri && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex items-start gap-3">
              <svg className="size-5 text-gray-400 dark:text-neutral-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Website</h3>
                <a
                  href={location.websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
                >
                  {location.websiteUri}
                  <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Hours Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-start gap-3">
            <svg className="size-5 text-gray-400 dark:text-neutral-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Business Hours</h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400 whitespace-pre-line">
                {formatHours()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Card */}
      {location.metadata && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {location.metadata.hasPendingEdits !== undefined && (
              <div>
                <span className="text-gray-600 dark:text-neutral-400">Pending Edits: </span>
                <span className={location.metadata.hasPendingEdits ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}>
                  {location.metadata.hasPendingEdits ? 'Yes' : 'No'}
                </span>
              </div>
            )}
            {location.metadata.hasGoogleUpdated !== undefined && (
              <div>
                <span className="text-gray-600 dark:text-neutral-400">Google Updated: </span>
                <span className={location.metadata.hasGoogleUpdated ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}>
                  {location.metadata.hasGoogleUpdated ? 'Yes' : 'No'}
                </span>
              </div>
            )}
            {location.metadata.canDelete !== undefined && (
              <div>
                <span className="text-gray-600 dark:text-neutral-400">Can Delete: </span>
                <span className="text-gray-900 dark:text-white">
                  {location.metadata.canDelete ? 'Yes' : 'No'}
                </span>
              </div>
            )}
            {location.updateTime && (
              <div>
                <span className="text-gray-600 dark:text-neutral-400">Last Updated: </span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(location.updateTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-start">
        <Link
          href="/google-business-profile/locations"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700"
        >
          ← Back to Locations
        </Link>
      </div>
    </div>
  )
}

