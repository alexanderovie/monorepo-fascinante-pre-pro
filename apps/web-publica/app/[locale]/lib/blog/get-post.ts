import { BlogPostSchema, type BlogPost, isValidSlug } from './types';
import { BLOG_REQUEST_TIMEOUT, BLOG_SOURCE } from './constants';
import { mockBlogPosts } from './posts-data';
import { z } from 'zod';
import matter from 'gray-matter';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Get Blog Post by Slug
 * Actualizado: Diciembre 2025
 * Función robusta con validación, manejo de errores y timeouts
 * Soporta MDX/Markdown files organizados por locale (es/en)
 * y backward compatibility con mock data
 */

// Función para obtener desde archivo MDX/Markdown (con soporte de locale)
async function getPostFromMDX(slug: string, locale: string): Promise<BlogPost | null> {
  try {
    // Estructura: content/blog/{locale}/{slug}.md
    const contentDir = join(process.cwd(), 'content', 'blog', locale);
    const filePath = join(contentDir, `${slug}.md`);

    // Verificar si el archivo existe
    if (!existsSync(filePath)) {
      return null; // Archivo no existe, retornar null para fallback
    }

    // Leer archivo
    const fileContent = readFileSync(filePath, 'utf-8');

    // Parsear frontmatter y contenido
    const { data, content } = matter(fileContent);

    // Construir objeto post con valores por defecto robustos
    const postData = {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      content: content || '', // Contenido Markdown sin frontmatter
      author: {
        name: data.author?.name || data.author || 'Unknown Author',
        role: data.author?.role || '',
        avatar: data.author?.avatar || undefined, // undefined si está vacío
      },
      date: data.date || new Date().toISOString(),
      category: data.category || 'Uncategorized',
      images: data.images && (data.images.main || data.images.gallery?.length) ? {
        main: data.images.main || undefined,
        gallery: Array.isArray(data.images.gallery) ? data.images.gallery.filter(Boolean) : undefined,
      } : undefined,
      tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
      relatedPosts: Array.isArray(data.relatedPosts) ? data.relatedPosts.filter(Boolean) : undefined,
    };

    // Validar inmediatamente antes de retornar para detectar errores temprano
    try {
      return BlogPostSchema.parse(postData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error(`[MDX Validation Error] Post: ${slug}`);
        console.error('Validation errors:', validationError.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
          received: e.code === 'invalid_type' ? e.received : undefined,
        })));
        throw new Error(`Invalid MDX post data for "${slug}": ${validationError.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      throw validationError;
    }
  } catch (error) {
    // Error al leer archivo, retornar null para fallback
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null; // Archivo no existe, es válido (fallback a mock)
    }
    // Errores de validación se propagan para diagnóstico
    if (error instanceof Error && error.message.includes('Invalid MDX post data')) {
      throw error;
    }
    console.error(`[MDX Read Error] Slug: ${slug}`, error);
    return null;
  }
}

// Función para obtener desde mock (backward compatibility)
async function getPostFromMock(slug: string): Promise<BlogPost | null> {
  const post = mockBlogPosts.find((p) => p.slug === slug);
  return post || null;
}

// Función para obtener desde CMS (futuro)
async function _getPostFromCMS(_slug: string): Promise<BlogPost | null> {
  // TODO: Implementar cuando se integre CMS
  throw new Error('CMS integration not implemented');
}

// Función para obtener desde base de datos (futuro)
async function _getPostFromDB(_slug: string): Promise<BlogPost | null> {
  // TODO: Implementar cuando se integre DB
  throw new Error('Database integration not implemented');
}

/**
 * Obtiene un artículo de blog por su slug y locale
 * @param slug - Slug del artículo (localizado para el idioma)
 * @param locale - Locale del artículo ('es' | 'en')
 * @returns Promise<BlogPost | null> - El artículo o null si no existe
 * @throws Error si hay un problema de validación o timeout
 */
export async function getPost(slug: string, locale: string = 'es'): Promise<BlogPost | null> {
  try {
    // Validación de entrada
    if (!slug || typeof slug !== 'string' || slug.length === 0) {
      console.warn(`Invalid slug: ${slug}`);
      return null;
    }

    if (!isValidSlug(slug)) {
      console.warn(`Invalid slug format: ${slug}`);
      return null;
    }

    // Seleccionar fuente de datos
    let rawPost: unknown;

    if (BLOG_SOURCE === 'cms') {
      // Fetch desde CMS con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), BLOG_REQUEST_TIMEOUT);

      try {
        const res = await fetch(`${process.env.CMS_URL}/posts/${slug}`, {
          signal: controller.signal,
          next: { revalidate: 3600 },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          if (res.status === 404) {
            return null;
          }
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        rawPost = await res.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Request timeout for slug:', slug);
          throw new Error('Request timeout');
        }
        throw error;
      }
    } else if (BLOG_SOURCE === 'database') {
      rawPost = await _getPostFromDB(slug);
    } else {
      // Prioridad: MDX files > Mock data (backward compatibility)
      // Usar el locale pasado como parámetro
      try {
        rawPost = await getPostFromMDX(slug, locale);
      } catch (mdxError) {
        // Si es error de validación de MDX, propagarlo para diagnóstico
        if (mdxError instanceof Error && mdxError.message.includes('Invalid MDX post data')) {
          throw mdxError;
        }
        // Otros errores de MDX: log y fallback a mock
        console.warn(`[MDX Error] Falling back to mock for slug: ${slug}`, mdxError);
        rawPost = null;
      }

      if (!rawPost) {
        // Fallback a mock data si no existe archivo MDX o hubo error no crítico
        rawPost = await getPostFromMock(slug);
      }
    }

    if (!rawPost) {
      return null;
    }

    // Validar con Zod
    try {
      const validatedPost = BlogPostSchema.parse(rawPost);
      return validatedPost;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error for post:', slug, error.errors);
        throw new Error(`Invalid post data: ${error.message}`);
      }
      throw error;
    }
  } catch (error) {
    // Re-lanzar errores que no son de "no encontrado"
    if (error instanceof Error && error.message.includes('timeout')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('Invalid post data')) {
      throw error;
    }
    console.error('Error fetching post:', error);
    // Para otros errores, retornar null (tratado como 404)
    return null;
  }
}
