import type { BlogPost } from './types';
import { BLOG_STATIC_PARAMS_LIMIT, BLOG_SOURCE } from './constants';
import { mockBlogPosts } from './posts-data';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { readFileSync } from 'fs';

/**
 * Get All Blog Posts
 * Actualizado: Noviembre 2025
 * Función con paginación y ordenamiento para escalabilidad
 */

/**
 * Obtiene todos los posts desde archivos MDX filtrados por locale
 * @param locale - Locale para filtrar ('es' | 'en')
 */
async function getAllPostsFromMDX(locale: string): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  try {
    // Estructura: content/blog/{locale}/
    const contentDir = join(process.cwd(), 'content', 'blog', locale);

    // Verificar si la carpeta existe
    if (!existsSync(contentDir)) {
      return posts;
    }

    // Leer todos los archivos .md de la carpeta del locale
    const files = readdirSync(contentDir).filter((file) => file.endsWith('.md'));

    // Procesar cada archivo
    for (const file of files) {
      try {
        const slug = file.replace(/\.md$/, '');
        const filePath = join(contentDir, file);
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const postData: BlogPost = {
          slug,
          title: data.title,
          excerpt: data.excerpt || '',
          content,
          author: {
            name: data.author?.name || data.author || 'Unknown',
            role: data.author?.role || '',
            avatar: data.author?.avatar || '',
          },
          date: data.date || new Date().toISOString(),
          category: data.category || 'Uncategorized',
          images: data.images ? {
            main: data.images.main || '',
            gallery: data.images.gallery || [],
          } : undefined,
          tags: data.tags || [],
          relatedPosts: data.relatedPosts || [],
        };

        posts.push(postData);
      } catch (error) {
        console.error(`Error reading MDX file ${file}:`, error);
        // Continuar con el siguiente archivo
      }
    }
  } catch (error) {
    console.error(`Error reading MDX directory for locale ${locale}:`, error);
  }

  return posts;
}

interface GetAllPostsOptions {
  locale?: string; // Locale para filtrar posts
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
  category?: string;
  tag?: string;
}

/**
 * Obtiene todos los artículos de blog con opciones de paginación
 * @param options - Opciones de paginación y filtrado (incluye locale)
 * @returns Promise<BlogPost[]> - Array de artículos
 */
export async function getAllPosts(options: GetAllPostsOptions = {}): Promise<BlogPost[]> {
  const {
    locale = 'es', // Por defecto español
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
      // TODO: Implementar fetch desde CMS con locale
      const params = new URLSearchParams({
        locale,
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
      // TODO: Implementar query desde DB con locale
      posts = [];
    } else {
      // Combinar MDX files + Mock data (backward compatibility)
      // Priorizar MDX sobre Mock - eliminar duplicados por slug
      // Filtrar por locale
      const mdxPosts = await getAllPostsFromMDX(locale);
      const mockPosts = mockBlogPosts;

      // Crear un Map para eliminar duplicados (MDX tiene prioridad)
      const postsMap = new Map<string, BlogPost>();

      // Primero agregar posts mock (si existen)
      mockPosts.forEach((post) => {
        postsMap.set(post.slug, post);
      });

      // Luego agregar/sobrescribir con posts MDX (prioridad)
      mdxPosts.forEach((post) => {
        postsMap.set(post.slug, post);
      });

      // Convertir Map a Array
      posts = Array.from(postsMap.values());
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
 * Obtiene todos los slugs de artículos para un locale específico (para generateStaticParams)
 * @param locale - Locale para filtrar ('es' | 'en')
 * @returns Promise<string[]> - Array de slugs
 */
export async function getAllPostSlugs(locale: string = 'es'): Promise<string[]> {
  try {
    const posts = await getAllPosts({ locale, limit: BLOG_STATIC_PARAMS_LIMIT });
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error(`Error fetching post slugs for locale ${locale}:`, error);
    return [];
  }
}
