import { z } from 'zod';

/**
 * Blog Post Types and Zod Schemas
 * Actualizado: Noviembre 2025
 * Validación completa con Zod para robustez
 * Soporta URLs absolutas (https://) y rutas relativas (/images/...)
 */

/**
 * Valida que sea URL absoluta (https://) o ruta relativa (/images/...)
 * Basado en mejores prácticas Next.js 15 (Noviembre 2025)
 * Soporta tanto imágenes externas como locales desde /public
 */
const urlOrPathSchema = z
  .string()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true; // Opcional/vacío es válido
      // Acepta URLs absolutas (http/https) o rutas relativas que empiecen con /
      const isUrl = val.startsWith('http://') || val.startsWith('https://');
      const isRelativePath = val.startsWith('/');
      return isUrl || isRelativePath;
    },
    {
      message: 'Debe ser una URL absoluta (https://) o una ruta relativa (/images/...)',
    }
  )
  .optional();

// Schema de autor
export const BlogAuthorSchema = z.object({
  name: z.string().min(1, 'El nombre del autor es requerido').max(100),
  role: z.string().max(100).optional(),
  avatar: urlOrPathSchema,
});

export type BlogAuthor = z.infer<typeof BlogAuthorSchema>;

// Schema de imágenes
export const BlogImagesSchema = z.object({
  main: urlOrPathSchema,
  gallery: z.array(urlOrPathSchema).optional(),
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
