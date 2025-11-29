import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Optimizaciones de build
  typescript: {
    // En producción, verificar tipos en build (más rápido en dev)
    ignoreBuildErrors: false,
  },
  eslint: {
    // En producción, verificar ESLint en build (más rápido en dev)
    ignoreDuringBuilds: false,
  },
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    // Configurar qualities para Next.js 16 (evita warnings)
    qualities: [75, 85, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'preline.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'streetviewpixels-pa.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
        pathname: '/**',
      },
    ],
  },
  // Compresión
  compress: true,
  // SWC minification es el default en Next.js 15, no necesita configuración
  // Power de Turbopack (si está disponible)
  experimental: {
    // Optimizaciones de compilación
    optimizePackageImports: ['preline'],
  },
};

export default withNextIntl(nextConfig);
