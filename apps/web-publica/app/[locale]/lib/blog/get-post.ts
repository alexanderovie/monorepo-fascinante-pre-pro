import { BlogPostSchema, type BlogPost, isValidSlug } from './types';
import { BLOG_REQUEST_TIMEOUT, BLOG_SOURCE } from './constants';
import { mockBlogPosts } from './posts-data';
import { z } from 'zod';

/**
 * Get Blog Post by Slug
 * Actualizado: Noviembre 2025
 * Función robusta con validación, manejo de errores y timeouts
 */

// Función para obtener desde mock (actual)
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
 * Obtiene un artículo de blog por su slug
 * @param slug - Slug del artículo
 * @returns Promise<BlogPost | null> - El artículo o null si no existe
 * @throws Error si hay un problema de validación o timeout
 */
export async function getPost(slug: string): Promise<BlogPost | null> {
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
      // Mock (default)
      rawPost = await getPostFromMock(slug);
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
