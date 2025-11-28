/**
 * Location Map Component
 *
 * ÉLITE PRO: Componente para mostrar mapa embebido de Google Maps
 * según estándares de la industria.
 *
 * Características:
 * - Usa Google Maps Embed API (iframe simple)
 * - Responsive y accesible
 * - Fallback si no hay dirección
 * - Enlace a "Abrir en Google Maps"
 */

'use client'

import type { GBPLocation } from '@/lib/gbp/types'

interface LocationMapProps {
  location: GBPLocation
  height?: string
}

export default function LocationMap({ location, height = '400px' }: LocationMapProps) {
  // ÉLITE: Construir dirección completa para el mapa
  const buildAddress = (): string | null => {
    if (!location.storefrontAddress) return null

    const { addressLines, locality, administrativeArea, postalCode, regionCode } =
      location.storefrontAddress

    const parts = [
      ...(addressLines || []),
      locality,
      administrativeArea,
      postalCode,
      regionCode,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(', ') : null
  }

  const address = buildAddress()

  // ÉLITE: Construir URL de embed de Google Maps
  // Opción 1: Por dirección (más común y funciona sin Place ID)
  const getEmbedUrl = (): string | null => {
    if (!address) return null

    // ÉLITE: Usar Maps Embed API con dirección
    // Formato: https://www.google.com/maps/embed/v1/place?key=API_KEY&q=address
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      // ÉLITE: Si no hay API key, usar URL de búsqueda (menos preciso pero funciona)
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024!2d-73.988!3d40.748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzUyLjgiTiA3M8KwNTknMTYuOCJX!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus&q=${encodeURIComponent(address)}`
    }

    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}`
  }

  const embedUrl = getEmbedUrl()
  const mapsUrl = location.metadata?.mapsUri || (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : null)

  // ÉLITE: Fallback si no hay dirección
  if (!address || !embedUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
        <svg
          className="size-12 text-gray-400 dark:text-neutral-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Dirección no disponible</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-neutral-700">
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
        title={`Mapa de ${location.title || 'ubicación'}`}
        aria-label={`Mapa interactivo de ${location.title || 'la ubicación'}`}
      />
      {mapsUrl && (
        <div className="p-3 bg-gray-50 dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-2 font-medium"
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Abrir en Google Maps
          </a>
        </div>
      )}
    </div>
  )
}
