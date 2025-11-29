# Plan Mejorado: Plantilla de Artículo de Blog
## Escalable, Robusto y con Manejo de Errores Completo

**Fecha:** Noviembre 2025
**Next.js:** 15.5.6 (App Router)
**React:** 19.2.0

---

## 📋 Estructura de Archivos

```
app/[locale]/(marketing)/blog/
├── page.tsx                    # Lista de artículos ✅ (ya existe)
├── [slug]/
│   ├── page.tsx               # Página dinámica del artículo
│   ├── error.tsx              # Error boundary local
│   └── not-found.tsx           # 404 personalizado para artículos
├── loading.tsx                 # Loading state (opcional)
└── error.tsx                   # Error boundary global del blog

lib/blog/
├── types.ts                    # Tipos TypeScript + Zod schemas
├── posts-data.tsx              # Datos mock (inicial)
├── get-post.ts                 # Función para obtener artículo (con validación)
├── get-all-posts.ts            # Función para obtener todos (con paginación)
└── constants.ts                # Constantes (límites, configs)

components/blog/
├── BlogArticle.tsx             # Componente principal del artículo
├── BlogSidebar.tsx             # Sidebar con autor y relacionados
├── BlogArticleHeader.tsx       # Header del artículo (título, fecha, etc.)
├── BlogArticleContent.tsx      # Contenido del artículo
├── BlogArticleFooter.tsx       # Footer (tags, share, etc.)
└── BlogImage.tsx               # Componente de imagen con fallback
```

---

## 🏗️ 1. ESCALABILIDAD

### A. `generateStaticParams` con Límites y Paginación

```typescript
// app/[locale]/(marketing)/blog/[slug]/page.tsx

export async function generateStaticParams() {
  try {
    // Opción 1: Pre-renderizar solo los más recientes (recomendado)
    const posts = await getAllPosts({ limit: 100, sortBy: 'date' });

    // Opción 2: Pre-renderizar todos (solo si tienes < 1000 artículos)
    // const posts = await getAllPosts();

    // Opción 3: Pre-renderizar ninguno (ISR on-demand)
    // return []; // Se generarán en runtime

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Retornar array vacío para evitar fallar el build
    return [];
  }
}

// Configuración para rutas no pre-renderizadas
export const dynamicParams = true; // Permite generar en runtime
export const revalidate = 3600; // ISR: revalidar cada hora
```

### B. Soporte para ISR (Incremental Static Regeneration)

```typescript
// Revalidación automática cada hora
export const revalidate = 3600;

// O revalidación on-demand desde API route
// POST /api/revalidate?path=/blog/[slug]
```

### C. Caching Estratégico

```typescript
// lib/blog/get-post.ts
export async function getPost(slug: string) {
  const res = await fetch(`${API_URL}/posts/${slug}`, {
    next: {
      revalidate: 3600, // Cache por 1 hora
      tags: [`post-${slug}`] // Tag para revalidación on-demand
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch post: ${res.statusText}`);
  }

  return res.json();
}
```

### D. Preparado para CMS/Base de Datos

```typescript
// lib/blog/get-post.ts - Abstracción para múltiples fuentes
export async function getPost(slug: string): Promise<BlogPost> {
  // Futuro: Cambiar fácilmente entre mock, CMS, DB
  if (process.env.BLOG_SOURCE === 'cms') {
    return getPostFromCMS(slug);
  } else if (process.env.BLOG_SOURCE === 'database') {
    return getPostFromDB(slug);
  } else {
    return getPostFromMock(slug);
  }
}
```

---

## 🛡️ 2. ROBUSTEZ

### A. Validación con Zod

```typescript
// lib/blog/types.ts
import { z } from 'zod';

export const BlogPostSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500),
  content: z.string().min(1),
  author: z.object({
    name: z.string().min(1),
    role: z.string(),
    avatar: z.string().url().optional(),
  }),
  date: z.string().datetime(),
  category: z.string(),
  images: z.object({
    main: z.string().url().optional(),
    gallery: z.array(z.string().url()).optional(),
  }).optional(),
  tags: z.array(z.string()),
  relatedPosts: z.array(z.string()).optional(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;
```

### B. Función de Obtención con Validación

```typescript
// lib/blog/get-post.ts
import { BlogPostSchema, type BlogPost } from './types';
import { notFound } from 'next/navigation';

export async function getPost(slug: string): Promise<BlogPost> {
  try {
    // Validar slug
    if (!slug || typeof slug !== 'string' || slug.length === 0) {
      throw new Error('Invalid slug');
    }

    // Obtener datos (mock, CMS, DB, etc.)
    const rawPost = await fetchPostData(slug);

    if (!rawPost) {
      notFound(); // Next.js 15.5.6: lanza 404
    }

    // Validar con Zod
    const validatedPost = BlogPostSchema.parse(rawPost);

    return validatedPost;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error for post:', slug, error.errors);
      throw new Error(`Invalid post data: ${error.message}`);
    }
    throw error;
  }
}
```

### C. Type Safety Completo

```typescript
// app/[locale]/(marketing)/blog/[slug]/page.tsx
type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; // Next.js 15.5.6: params es Promise

  // Type-safe
  const post = await getPost(slug);

  return <BlogArticle post={post} />;
}
```

### D. Validación de Slugs

```typescript
// lib/blog/validate-slug.ts
export function isValidSlug(slug: string): boolean {
  // Solo letras, números, guiones y guiones bajos
  const slugRegex = /^[a-z0-9-_]+$/;
  return slugRegex.test(slug) && slug.length >= 1 && slug.length <= 100;
}
```

---

## ⚠️ 3. MANEJO DE ERRORES

### A. Error Boundary Local (`error.tsx`)

```typescript
// app/[locale]/(marketing)/blog/[slug]/error.tsx
'use client';

import { useEffect } from 'react';
import { Link } from '../../../../i18n/navigation';

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log a servicio de errores (Sentry, LogRocket, etc.)
    console.error('Blog post error:', error);
  }, [error]);

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Algo salió mal
        </h2>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          No pudimos cargar el artículo. Por favor, intenta de nuevo.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/blog"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200"
          >
            Volver al blog
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### B. 404 Personalizado (`not-found.tsx`)

```typescript
// app/[locale]/(marketing)/blog/[slug]/not-found.tsx
import { Link } from '../../../../i18n/navigation';

export default function BlogPostNotFound() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Artículo no encontrado
        </h2>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          El artículo que buscas no existe o fue eliminado.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Volver al blog
        </Link>
      </div>
    </div>
  );
}
```

### C. Uso de `notFound()` en Page

```typescript
// app/[locale]/(marketing)/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPost } from '../../../../lib/blog/get-post';

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await getPost(slug);

    // Si getPost retorna null, lanza notFound()
    if (!post) {
      notFound();
    }

    return <BlogArticle post={post} />;
  } catch (error) {
    // Si es error de validación o datos inválidos, 404
    if (error instanceof Error && error.message.includes('not found')) {
      notFound();
    }
    // Otros errores se propagan al error boundary
    throw error;
  }
}
```

### D. Try-Catch en Funciones Async

```typescript
// lib/blog/get-post.ts
export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    // Validación de entrada
    if (!isValidSlug(slug)) {
      console.warn(`Invalid slug format: ${slug}`);
      return null;
    }

    // Fetch con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch(`${API_URL}/posts/${slug}`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        return null; // No encontrado
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    // Validar con Zod
    return BlogPostSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return null;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout for slug:', slug);
      throw new Error('Request timeout');
    }
    console.error('Error fetching post:', error);
    throw error;
  }
}
```

### E. Fallbacks para Imágenes

```typescript
// components/blog/BlogImage.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export default function BlogImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
}: BlogImageProps) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
      // Fallback a imagen placeholder
      setImgSrc('/assets/img/placeholder-blog.jpg');
    }
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className="object-cover"
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}
```

### F. Metadata con Manejo de Errores

```typescript
// app/[locale]/(marketing)/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { getPost } from '../../../../lib/blog/get-post';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
      return {
        title: 'Artículo no encontrado',
        description: 'El artículo que buscas no existe.',
      };
    }

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.images?.main ? [post.images.main] : [],
        type: 'article',
        publishedTime: post.date,
        authors: [post.author.name],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.images?.main ? [post.images.main] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Metadata por defecto en caso de error
    return {
      title: 'Blog',
      description: 'Artículos y noticias',
    };
  }
}
```

---

## 📊 4. CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Fundamentos
- [ ] Crear tipos TypeScript + Zod schemas
- [ ] Crear datos mock de ejemplo
- [ ] Crear función `getPost` con validación
- [ ] Crear función `getAllPosts` con paginación

### Fase 2: Componentes
- [ ] Crear `BlogArticle` (componente principal)
- [ ] Crear `BlogSidebar` (autor + relacionados)
- [ ] Crear `BlogImage` (con fallback)
- [ ] Crear sub-componentes (Header, Content, Footer)

### Fase 3: Rutas y Errores
- [ ] Crear ruta dinámica `[slug]/page.tsx`
- [ ] Implementar `generateStaticParams`
- [ ] Implementar `generateMetadata`
- [ ] Crear `error.tsx` (error boundary)
- [ ] Crear `not-found.tsx` (404)

### Fase 4: Optimizaciones
- [ ] Configurar ISR (`revalidate`)
- [ ] Configurar `dynamicParams`
- [ ] Agregar loading states
- [ ] Optimizar imágenes (Next.js Image)

### Fase 5: Testing y Validación
- [ ] Probar con slug válido
- [ ] Probar con slug inválido (404)
- [ ] Probar con datos faltantes
- [ ] Probar con imágenes rotas
- [ ] Probar error boundary
- [ ] Validar metadata en producción

---

## 🎯 5. VENTAJAS DE ESTE PLAN

### ✅ Escalabilidad
- Soporta miles de artículos con ISR
- Paginación en `generateStaticParams`
- Preparado para CMS/DB
- Caching estratégico

### ✅ Robustez
- Validación completa con Zod
- Type safety end-to-end
- Validación de slugs
- Manejo de casos edge

### ✅ Manejo de Errores
- Error boundaries (local y global)
- 404 personalizado
- Try-catch en todas las funciones async
- Fallbacks para imágenes
- Logging de errores
- Timeouts en requests

### ✅ Performance
- Pre-renderizado estático
- ISR para contenido dinámico
- Optimización de imágenes
- Metadata dinámica para SEO

### ✅ Mantenibilidad
- Código modular y reutilizable
- Separación de responsabilidades
- Fácil de testear
- Documentado

---

## 📝 Notas Finales

- **Next.js 15.5.6**: `params` es una Promise, siempre usar `await`
- **React 19**: Server Components por defecto, mejor performance
- **TypeScript**: Type safety completo con Zod
- **i18n**: Compatible con next-intl existente
- **SEO**: Metadata dinámica completa
- **Producción**: Listo para escalar y manejar errores

Este plan es **production-ready** y sigue las mejores prácticas de Next.js 15.5.6.
