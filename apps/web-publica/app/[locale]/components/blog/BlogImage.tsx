'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * BlogImage Component
 * Actualizado: Noviembre 2025
 * Componente de imagen con fallback para robustez
 */

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function BlogImage({
  src,
  alt,
  className = '',
  fill,
  width,
  height,
  priority = false,
}: BlogImageProps) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
      // Fallback a imagen placeholder
      setImgSrc('/assets/img/placeholder-blog.jpg');
    }
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className="object-cover"
          onError={handleError}
          priority={priority}
        />
      </div>
    );
  }

  if (!width || !height) {
    // Si no hay width/height y no es fill, usar un tamaño por defecto
    return (
      <div className={`relative ${className}`}>
        <Image
          src={imgSrc}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className="object-cover"
          onError={handleError}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={priority}
    />
  );
}
