import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Article Mapping System
 * Sistema de mapeo de artículos relacionados entre diferentes idiomas
 * Actualizado: Diciembre 2025
 */

interface ArticleMapping {
  articles: Array<{
    id: string;
    slugs: Record<string, string>; // { es: "slug-es", en: "slug-en" }
    title: Record<string, string>; // { es: "Título", en: "Title" }
    created?: string;
    updated?: string;
  }>;
}

/**
 * Carga el mapeo de artículos desde el archivo JSON
 */
function loadArticleMapping(): ArticleMapping | null {
  try {
    const mappingPath = join(process.cwd(), 'content', 'blog', '.meta', 'article-mapping.json');

    if (!existsSync(mappingPath)) {
      console.warn('[Article Mapping] Mapping file not found at:', mappingPath);
      return null;
    }

    const fileContent = readFileSync(mappingPath, 'utf-8');
    const mapping = JSON.parse(fileContent) as ArticleMapping;

    return mapping;
  } catch (error) {
    console.error('[Article Mapping] Error loading mapping:', error);
    return null;
  }
}

/**
 * Encuentra el artículo en el mapeo por slug y locale
 */
function findArticleBySlug(slug: string, locale: string): ArticleMapping['articles'][0] | null {
  const mapping = loadArticleMapping();
  if (!mapping) return null;

  return mapping.articles.find((article) => article.slugs[locale] === slug) || null;
}

/**
 * Obtiene el slug de un artículo en otro locale
 * @param slug - Slug del artículo en el locale actual
 * @param currentLocale - Locale actual del slug
 * @param targetLocale - Locale objetivo
 * @returns Slug en el locale objetivo o null si no existe
 */
export function getAlternateSlug(
  slug: string,
  currentLocale: string,
  targetLocale: string
): string | null {
  if (currentLocale === targetLocale) {
    return slug; // Mismo locale, retornar el mismo slug
  }

  const article = findArticleBySlug(slug, currentLocale);
  if (!article) {
    return null; // Artículo no encontrado en el mapeo
  }

  return article.slugs[targetLocale] || null;
}

/**
 * Obtiene todos los slugs alternativos de un artículo
 * @param slug - Slug del artículo
 * @param locale - Locale actual
 * @returns Objeto con slugs por locale { es: "slug-es", en: "slug-en" }
 */
export function getAllAlternateSlugs(
  slug: string,
  locale: string
): Record<string, string | null> {
  const article = findArticleBySlug(slug, locale);
  if (!article) {
    return {};
  }

  const result: Record<string, string | null> = {};
  const locales = ['es', 'en']; // Expandir según se agreguen más idiomas

  for (const loc of locales) {
    result[loc] = article.slugs[loc] || null;
  }

  return result;
}

/**
 * Obtiene el ID único del artículo basado en slug y locale
 * Útil para relacionar artículos entre idiomas
 */
export function getArticleId(slug: string, locale: string): string | null {
  const article = findArticleBySlug(slug, locale);
  return article?.id || null;
}

/**
 * Verifica si un slug existe en el mapeo para un locale dado
 */
export function slugExistsInMapping(slug: string, locale: string): boolean {
  return findArticleBySlug(slug, locale) !== null;
}
