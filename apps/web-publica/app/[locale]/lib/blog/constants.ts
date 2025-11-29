/**
 * Blog Constants
 * Actualizado: Noviembre 2025
 * Configuraciones y constantes para el blog
 */

// Límites para generateStaticParams
export const BLOG_STATIC_PARAMS_LIMIT = 100; // Pre-renderizar solo los 100 más recientes

// Configuración de revalidación ISR
export const BLOG_REVALIDATE_TIME = 3600; // 1 hora en segundos

// Timeout para requests
export const BLOG_REQUEST_TIMEOUT = 5000; // 5 segundos

// Fuente de datos (mock, cms, database)
export const BLOG_SOURCE = process.env.BLOG_SOURCE || 'mock';
