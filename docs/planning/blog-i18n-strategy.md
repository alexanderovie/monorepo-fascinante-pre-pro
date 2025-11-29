# Estrategia de i18n para Blog - Análisis y Recomendaciones

**Fecha:** Diciembre 2025
**Estado:** Análisis y Propuesta de Implementación

## 📊 Situación Actual

### Problema Identificado
1. El sistema obtiene posts por `slug` sin considerar el `locale`
2. Solo existe versión en español: `como-hacer-auditoria-digital.md`
3. Cuando accedes a `/en/blog/como-hacer-auditoria-digital`, muestra contenido en español
4. No hay hreflang tags para SEO multilingüe
5. No hay mapeo de slugs entre idiomas

### Código Actual
```typescript
// get-post.ts - NO considera locale
async function getPostFromMDX(slug: string): Promise<BlogPost | null> {
  const filePath = join(contentDir, `${slug}.md`);
  // Busca solo por slug, ignora locale
}

// page.tsx - Tiene locale pero no lo usa
const post = await getPost(slug); // ❌ No pasa locale
```

## 🌍 Estándares de la Industria (Elite Pro)

### Principios Fundamentales

1. **Contenido Localizado, No Solo Traducido**
   - Cada idioma debe tener su propia versión del contenido
   - No es solo traducir palabras, es adaptar culturalmente
   - Ejemplo: SEO keywords diferentes por mercado

2. **Slugs Localizados**
   - ❌ NO: `/en/blog/como-hacer-auditoria-digital` (slug en español)
   - ✅ SÍ: `/en/blog/how-to-do-digital-audit` (slug en inglés)
   - Los slugs deben ser SEO-friendly en cada idioma

3. **Estructura de Archivos**
   ```
   content/blog/
   ├── es/
   │   └── como-hacer-auditoria-digital.md
   ├── en/
   │   └── how-to-do-digital-audit.md
   └── metadata.json (opcional: mapeo de artículos relacionados)
   ```

4. **SEO Multilingüe**
   - Hreflang tags en `<head>`
   - Alternate links en sitemap
   - Canonical URLs por idioma
   - Metadata localizada

## 📚 Prácticas Recomendadas por Expertos

### Según next-intl (Documentación Oficial)

1. **Separación de Contenido por Locale**
   - Usar `getLocale()` para obtener el locale activo
   - Cargar contenido específico por locale
   - Ejemplo:
   ```typescript
   const locale = await getLocale();
   const post = await getPost(slug, locale);
   ```

2. **Hreflang Tags Automáticos**
   - next-intl genera automáticamente alternate links
   - Configurar `alternateLinks: true` en routing config
   - Genera: `<link rel="alternate" hreflang="es" href="..." />`

3. **Sitemap Localizado**
   - Incluir alternate entries por idioma
   - Usar `getPathname()` para construir URLs localizadas

### Ejemplos de Implementación Elite

#### Estrategia 1: Slugs Localizados (Recomendada)
```
/es/blog/como-hacer-auditoria-digital
/en/blog/how-to-do-digital-audit
```
**Ventajas:**
- ✅ SEO óptimo (keywords en cada idioma)
- ✅ URLs más naturales para cada mercado
- ✅ Mejor UX (el usuario ve URLs en su idioma)

**Desventajas:**
- Requiere mapeo entre slugs relacionados

#### Estrategia 2: Mismo Slug, Archivos por Locale
```
/content/blog/como-hacer-auditoria-digital.es.md
/content/blog/como-hacer-auditoria-digital.en.md
```
**Ventajas:**
- ✅ Más simple de mapear artículos
- ✅ Fácil de mantener relación entre idiomas

**Desventajas:**
- ❌ Slugs no localizados (pérdida de SEO)
- ❌ URLs menos naturales

## 🎯 Recomendación Final

### Implementación Recomendada: **Estrategia Híbrida Elite**

**Estructura de Archivos:**
```
content/blog/
├── es/
│   └── como-hacer-auditoria-digital.md
├── en/
│   └── how-to-do-digital-audit.md
└── .meta/
    └── article-mapping.json (mapea slugs relacionados)
```

**Características:**
1. **Slugs localizados** por idioma (SEO optimizado)
2. **Mapeo de artículos** relacionados entre idiomas
3. **Metadata compartida** (fechas, autor, etc.)
4. **Contenido independiente** por idioma (máxima flexibilidad)

## 🔧 Cambios Necesarios en el Código

### 1. Actualizar `get-post.ts`
```typescript
export async function getPost(slug: string, locale: string): Promise<BlogPost | null> {
  // Buscar en: content/blog/{locale}/{slug}.md
  const localeDir = join(process.cwd(), 'content', 'blog', locale);
  const filePath = join(localeDir, `${slug}.md`);
  // ... resto del código
}
```

### 2. Actualizar `get-all-posts.ts`
```typescript
export async function getAllPosts(options: {
  locale: string; // ✅ Agregar locale
  limit?: number;
  sortBy?: 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
}): Promise<BlogPost[]> {
  // Filtrar por locale
}
```

### 3. Actualizar `page.tsx` (generateStaticParams)
```typescript
export async function generateStaticParams() {
  const locales = ['es', 'en'];
  const allParams: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = await getAllPostSlugs(locale);
    allParams.push(...slugs.map(slug => ({ locale, slug })));
  }

  return allParams;
}
```

### 4. Actualizar Metadata (hreflang)
```typescript
export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const post = await getPost(slug, locale);

  // Obtener slugs relacionados en otros idiomas
  const alternateSlugs = await getAlternateSlugs(slug, locale);

  return {
    title: post.title,
    alternates: {
      languages: {
        'es': `/es/blog/${alternateSlugs.es}`,
        'en': `/en/blog/${alternateSlugs.en}`,
        'x-default': `/es/blog/${alternateSlugs.es}`, // Idioma por defecto
      },
    },
  };
}
```

## 📋 Checklist de Implementación

- [ ] Crear estructura de carpetas por locale
- [ ] Actualizar `getPost()` para recibir locale
- [ ] Actualizar `getAllPosts()` para filtrar por locale
- [ ] Crear sistema de mapeo de slugs relacionados
- [ ] Implementar hreflang tags en metadata
- [ ] Actualizar generateStaticParams para ambos locales
- [ ] Crear versión en inglés del artículo actual
- [ ] Agregar alternate links en sitemap
- [ ] Testing: Verificar SEO y hreflang tags
- [ ] Documentación: Guía para agregar nuevos artículos

## 🚀 Próximos Pasos

1. **Inmediato**: Crear versión en inglés del artículo actual
2. **Corto plazo**: Implementar estructura de carpetas por locale
3. **Mediano plazo**: Sistema de mapeo de artículos relacionados
4. **Largo plazo**: Dashboard CMS para gestión multilingüe

## 📖 Referencias

- [next-intl Documentation - Alternate Links](https://next-intl-docs.vercel.app/docs/routing/configuration#alternate-links)
- [Google - Hreflang Tags Best Practices](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Next.js - Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
