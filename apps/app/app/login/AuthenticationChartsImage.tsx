/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'

/**
 * AuthenticationChartsImage Component
 *
 * Según Next.js 15 (Nov 2025):
 * - Los archivos en public/ se sirven desde la raíz /
 * - Para SVGs, usar <img> directamente es la mejor práctica
 * - Next.js automáticamente aplica unoptimized para .svg en Image component
 * - Pero <img> es más simple y confiable para SVGs estáticos
 *
 * Best Practices:
 * - Manejo de errores con estado local
 * - Fallback visual elegante
 * - Sin hydration mismatches (solo renderiza en cliente)
 */
export default function AuthenticationChartsImage() {
  const [hasError, setHasError] = useState(false)

  // Fallback elegante si la imagen no carga
  if (hasError) {
    return (
      <div className="mt-8 w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-800 dark:to-neutral-900 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <svg
            className="w-24 h-24 mx-auto text-blue-200 dark:text-neutral-700 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm text-gray-400 dark:text-neutral-500">
            Dashboard Analytics
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 relative w-full">
      {/* Modo claro */}
      <img
        className="dark:hidden w-full h-auto"
        src="/assets/authentication-charts.svg"
        alt="Charts Mockups - Dashboard Analytics"
        onError={() => {
          console.error('Error loading authentication-charts.svg')
          setHasError(true)
        }}
        onLoad={() => {
          console.log('✅ Image loaded successfully')
        }}
      />
      {/* Modo oscuro */}
      <img
        className="hidden dark:block w-full h-auto"
        src="/assets/authentication-charts.svg"
        alt="Charts Mockups - Dashboard Analytics"
        onError={() => {
          console.error('Error loading authentication-charts.svg')
          setHasError(true)
        }}
        onLoad={() => {
          console.log('✅ Image loaded successfully (dark mode)')
        }}
      />
    </div>
  )
}
