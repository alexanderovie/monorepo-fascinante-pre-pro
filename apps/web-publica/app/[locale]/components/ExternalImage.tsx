'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';

/**
 * ExternalImage Component
 *
 * Componente robusto y escalable para manejar imágenes externas
 * especialmente de servicios como Google, que pueden venir de múltiples subdominios.
 *
 * Características:
 * - Detección automática de URLs de Google (cualquier subdominio)
 * - Usa <img> nativo para URLs de Google (más flexible, no requiere configuración)
 * - Usa next/image para otras URLs (optimización automática)
 * - Manejo robusto de errores con fallback visual
 * - Soporte para dark mode
 * - Lazy loading por defecto
 * - Validación de URLs
 * - TypeScript completo
 *
 * Basado en mejores prácticas de Next.js 15
 * https://nextjs.org/docs/app/api-reference/components/image
 */

interface ExternalImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fallback?: React.ReactNode;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Lista de dominios de Google que pueden servir imágenes
 * Escalable: fácil agregar más dominios si es necesario
 */
const GOOGLE_IMAGE_DOMAINS = [
  'googleusercontent.com',
  'googleapis.com',
  'gstatic.com',
  'google.com',
  'googleapis.com',
  'ggpht.com', // Google Photos
] as const;

/**
 * Verifica si una URL es de Google (cualquier subdominio)
 *
 * @param url - URL a verificar
 * @returns true si la URL es de Google
 */
function isGoogleUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Verificar si el hostname contiene alguno de los dominios de Google
    return GOOGLE_IMAGE_DOMAINS.some((domain) => hostname.includes(domain));
  } catch {
    // Si la URL no es válida, retornar false
    return false;
  }
}

/**
 * Valida que una URL sea válida y segura
 *
 * @param url - URL a validar
 * @returns true si la URL es válida
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    // Solo permitir HTTPS para seguridad
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Placeholder por defecto para cuando falla la imagen
 */
const DefaultPlaceholder = ({ className }: { className?: string }) => (
  <div className={`w-full h-full flex items-center justify-center bg-gray-200 dark:bg-neutral-600 ${className || ''}`}>
    <svg
      className="size-12 text-gray-400 dark:text-neutral-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <span className="sr-only">Imagen no disponible</span>
  </div>
);

/**
 * ExternalImage - Componente para imágenes externas con manejo robusto
 *
 * @example
 * ```tsx
 * <ExternalImage
 *   src="https://lh3.googleusercontent.com/..."
 *   alt="Business logo"
 *   width={120}
 *   height={120}
 *   className="rounded-lg"
 * />
 * ```
 */
export default function ExternalImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallback,
  objectFit = 'cover',
}: ExternalImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validar URL antes de renderizar
  const isValid = useMemo(() => isValidUrl(src), [src]);
  const isGoogle = useMemo(() => isGoogleUrl(src), [src]);

  // Si la URL no es válida, mostrar placeholder
  if (!isValid) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
        {fallback || <DefaultPlaceholder />}
      </div>
    );
  }

  // Si es una URL de Google, usar <img> nativo (más flexible, no requiere configuración)
  if (isGoogle) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
        {hasError ? (
          fallback || <DefaultPlaceholder />
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 dark:bg-neutral-700 animate-pulse" aria-hidden="true" />
            )}
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={`object-${objectFit} transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ width: '100%', height: '100%' }}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
            />
          </>
        )}
      </div>
    );
  }

  // Para otras URLs, usar next/image (optimización automática)
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {hasError ? (
        fallback || <DefaultPlaceholder />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-${objectFit}`}
          priority={priority}
          onError={() => setHasError(true)}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}
