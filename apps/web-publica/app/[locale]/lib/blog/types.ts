import { z } from 'zod';

/**
 * Blog Post Types and Zod Schemas
 * Actualizado: Noviembre 2025
 * Validación completa con Zod para robustez
 */

// Schema de autor
export const BlogAuthorSchema = z.object({
  name: z.string().min(1, 'El nombre del autor es requerido').max(100),
  role: z.string().max(100).optional(),
  avatar: z.string().url('URL de avatar inválida').optional(),
});

export type BlogAuthor = z.infer<typeof BlogAuthorSchema>;

// Schema de imágenes
export const BlogImagesSchema = z.object({
  main: z.string().url('URL de imagen principal inválida').optional(),
  gallery: z.array(z.string().url('URL de imagen inválida')).optional(),
}).optional();

export type BlogImages = z.infer<typeof BlogImagesSchema>;

// Schema completo de artículo
export const BlogPostSchema = z.object({
  slug: z.string().min(1, 'El slug es requerido').max(100, 'El slug es muy largo'),
  title: z.string().min(1, 'El título es requerido').max(200, 'El título es muy largo'),
  excerpt: z.string().max(500, 'El extracto es muy largo').optional(),
  content: z.string().min(1, 'El contenido es requerido'),
  author: BlogAuthorSchema,
  date: z.string().datetime('Fecha inválida'),
  category: z.string().min(1, 'La categoría es requerida').max(50),
  images: BlogImagesSchema,
  tags: z.array(z.string()).default([]),
  relatedPosts: z.array(z.string()).optional(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

// Schema para validar slug
export function isValidSlug(slug: string): boolean {
  // Solo letras, números, guiones y guiones bajos
  const slugRegex = /^[a-z0-9-_]+$/;
  return slugRegex.test(slug) && slug.length >= 1 && slug.length <= 100;
}
