import type { BlogPost } from './types';
import { BLOG_STATIC_PARAMS_LIMIT, BLOG_SOURCE } from './constants';
import { mockBlogPosts } from './posts-data';

/**
 * Get All Blog Posts
 * Actualizado: Noviembre 2025
 * Función con paginación y ordenamiento para escalabilidad
 */

interface GetAllPostsOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
  category?: string;
  tag?: string;
}

/**
 * Obtiene todos los artículos de blog con opciones de paginación
 * @param options - Opciones de paginación y filtrado
 * @returns Promise<BlogPost[]> - Array de artículos
 */
export async function getAllPosts(options: GetAllPostsOptions = {}): Promise<BlogPost[]> {
  const {
    limit = BLOG_STATIC_PARAMS_LIMIT,
    offset = 0,
    sortBy = 'date',
    sortOrder = 'desc',
    category,
    tag,
  } = options;

  try {
    let posts: BlogPost[] = [];

    // Seleccionar fuente de datos
    if (BLOG_SOURCE === 'cms') {
      // TODO: Implementar fetch desde CMS
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        sortBy,
        sortOrder,
        ...(category && { category }),
        ...(tag && { tag }),
      });

      const res = await fetch(`${process.env.CMS_URL}/posts?${params}`, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      posts = await res.json();
    } else if (BLOG_SOURCE === 'database') {
      // TODO: Implementar query desde DB
      posts = [];
    } else {
      // Mock (default)
      posts = [...mockBlogPosts];
    }

    // Filtrar por categoría si se especifica
    if (category) {
      posts = posts.filter((post) => post.category === category);
    }

    // Filtrar por tag si se especifica
    if (tag) {
      posts = posts.filter((post) => post.tags.includes(tag));
    }

    // Ordenar
    posts.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Aplicar paginación
    const paginatedPosts = posts.slice(offset, offset + limit);

    return paginatedPosts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    // En caso de error, retornar array vacío
    return [];
  }
}

/**
 * Obtiene todos los slugs de artículos (para generateStaticParams)
 * @returns Promise<string[]> - Array de slugs
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await getAllPosts({ limit: BLOG_STATIC_PARAMS_LIMIT });
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}
