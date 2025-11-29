# Plan Elite Pro: Migración Blog a MDX manteniendo UI

## 📋 Resumen Ejecutivo

**Objetivo:** Migrar el sistema de blog de HTML hardcodeado a **MDX/Markdown** usando `next-mdx-remote/rsc` (Next.js 15 oficial), manteniendo **exactamente el mismo UI**, mejorando escalabilidad, seguridad y mantenibilidad.

**Decisión técnica:** `next-mdx-remote/rsc` - Solución oficial y recomendada por Next.js para App Router.

---

## 🎯 Requisitos Cumplidos

✅ **Mismo UI exacto** - Solo cambia el contenido interno, no el wrapper
✅ **Estable y moderno** - Basado en Next.js 15 oficial
✅ **Elite/Pro** - Estándar de la industria
✅ **Escalable** - Archivos Markdown separados
✅ **Robusto** - Type-safe con Zod, manejo de errores
✅ **Manejo de errores** - Try/catch, validación, fallbacks

---

## 🔍 Análisis: Solución Recomendada

### **next-mdx-remote/rsc** (Recomendado)

**Por qué es la mejor opción:**

1. ✅ **Oficial de Next.js 15** - Documentado en docs oficiales
2. ✅ **App Router compatible** - Diseñado para Server Components
3. ✅ **Mantiene UI exacto** - Solo reemplaza el contenido, no el wrapper
4. ✅ **Type-safe** - Compatible con TypeScript y Zod
5. ✅ **Escalable** - Archivos `.md` o `.mdx` separados
6. ✅ **Seguro** - Sin `dangerouslySetInnerHTML`
7. ✅ **Robusto** - Manejo de errores integrado
8. ✅ **Flexible** - Permite componentes React en Markdown

### Alternativas Consideradas y Rechazadas

| Solución | Pros | Contras | Decisión |
|----------|------|---------|----------|
| **next-mdx-remote/rsc** | ✅ Oficial, App Router, mantiene UI | Requiere instalar paquete | ✅ **ELEGIDO** |
| Content Collections | ✅ Type-safe nativo | ❌ Cambia estructura completa | ❌ Rechazado (rompe UI) |
| next-mdx-remote-client | ✅ Similar | ❌ Menos mantenido | ❌ Rechazado |
| @next/mdx | ✅ Integrado | ❌ Requiere reestructuración | ❌ Rechazado |

---

## 🏗️ Arquitectura de la Solución

### Estructura Propuesta

```
apps/web-publica/
├── content/
│   └── blog/
│       ├── mi-articulo.md
│       ├── otro-articulo.md
│       └── ...
├── app/[locale]/(marketing)/blog/[slug]/
│   └── page.tsx                    # ← Mismo UI, solo cambia getPost
├── app/[locale]/components/blog/
│   └── BlogArticle.tsx             # ← Mismo UI, solo cambia renderizado
└── app/[locale]/lib/blog/
    ├── get-post.ts                 # ← Actualizado para leer MDX
    ├── posts-data.tsx              # ← Deprecado (mantener para migración)
    └── mdx-components.tsx          # ← NUEVO: Componentes MDX custom
```

### Flujo de Datos

```
1. Archivo .md/.mdx con frontmatter
   ↓
2. getPost() lee archivo y parsea frontmatter
   ↓
3. Valida con Zod (mismo schema)
   ↓
4. BlogArticle recibe post con content MDX
   ↓
5. Renderiza con MDXRemote (mantiene UI exacto)
```

---

## 📦 Instalación Requerida

```bash
pnpm add next-mdx-remote
pnpm add -D @types/mdx
```

**Dependencias adicionales (opcional pero recomendadas):**
```bash
pnpm add gray-matter          # Para parsear frontmatter
pnpm add remark-gfm           # Para GitHub Flavored Markdown
pnpm add rehype-highlight     # Para syntax highlighting
pnpm add rehype-slug          # Para IDs en headings
pnpm add rehype-autolink-headings # Para links en headings
```

---

## 🔧 Implementación Técnica

### 1. Estructura de Archivo MDX

**Antes (HTML hardcodeado):**
```typescript
{
  content: `<p>HTML aquí...</p>`
}
```

**Después (Markdown):**
```markdown
---
title: "Announcing a free plan for small teams"
excerpt: "At preline, our mission..."
date: "2023-01-18T00:00:00Z"
category: "Company News"
tags: ["Plan", "Web development", "Free", "Team"]
author:
  name: "Leyla Ludic"
  role: "UI/UX enthusiast"
  avatar: "https://..."
images:
  main: "https://..."
relatedPosts:
  - "5-reasons-not-start-ux-designer-career"
---

# Título del Artículo

At preline, our mission has always been focused...

## Subtítulo

Párrafo con **negrita** y *cursiva*.

![Descripción](https://imagen.jpg)
```

### 2. Función getPost() Actualizada

```typescript
import { MDXRemote } from 'next-mdx-remote/rsc'
import matter from 'gray-matter'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    // Leer archivo MDX
    const filePath = join(process.cwd(), 'content', 'blog', `${slug}.md`)
    const fileContent = readFileSync(filePath, 'utf-8')

    // Parsear frontmatter
    const { data, content } = matter(fileContent)

    // Validar con Zod (mismo schema)
    const postData = {
      ...data,
      content, // Contenido Markdown
      slug,
    }

    const validatedPost = BlogPostSchema.parse(postData)
    return validatedPost
  } catch (error) {
    // Manejo de errores robusto
    if (error.code === 'ENOENT') {
      return null // Archivo no existe
    }
    throw error
  }
}
```

### 3. BlogArticle Component Actualizado

**Cambio mínimo - solo el renderizado:**

```typescript
// ANTES
<div
  className="prose prose-lg max-w-none dark:prose-invert"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>

// DESPUÉS
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from './mdx-components'

<MDXRemote
  source={post.content}
  components={mdxComponents}
  options={{
    parseFrontmatter: false, // Ya lo parseamos antes
  }}
/>
```

### 4. Componentes MDX Custom (mdx-components.tsx)

Para mantener el mismo estilo visual:

```typescript
import Image from 'next/image'

export const mdxComponents = {
  // Headings con mismo estilo
  h1: (props) => (
    <h1 className="text-3xl font-bold lg:text-5xl dark:text-white" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-2xl font-semibold dark:text-white" {...props} />
  ),
  // Párrafos con estilo
  p: (props) => (
    <p className="text-lg text-gray-800 dark:text-neutral-200" {...props} />
  ),
  // Imágenes optimizadas
  img: ({ src, alt, ...props }) => (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      className="rounded-xl"
      {...props}
    />
  ),
  // Links con estilo
  a: (props) => (
    <a
      className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
      {...props}
    />
  ),
  // Blockquotes
  blockquote: (props) => (
    <blockquote className="text-center p-4 sm:px-7" {...props} />
  ),
  // ... más componentes según necesites
}
```

---

## ✅ Ventajas de Esta Solución

### 1. **Mismo UI Exacto**
- ✅ Wrapper `BlogArticle` idéntico
- ✅ Mismo layout, spacing, colores
- ✅ Solo cambia el contenido interno

### 2. **Escalabilidad Elite**
- ✅ Archivos Markdown separados (`content/blog/`)
- ✅ Fácil agregar artículos nuevos
- ✅ Control de versiones con Git
- ✅ Puede migrar a CMS después sin cambios

### 3. **Seguridad**
- ✅ Sin `dangerouslySetInnerHTML`
- ✅ Renderizado seguro con MDX
- ✅ Validación con Zod

### 4. **Mantenibilidad**
- ✅ Markdown es fácil de escribir
- ✅ No-developers pueden editar
- ✅ Sintaxis simple y legible

### 5. **Robustez**
- ✅ Type-safe end-to-end
- ✅ Manejo de errores robusto
- ✅ Validación en cada paso

### 6. **Moderno y Elite**
- ✅ Next.js 15 oficial
- ✅ Server Components
- ✅ Estándar de la industria

---

## 🔄 Plan de Migración

### Fase 1: Setup e Infraestructura
1. ✅ Instalar dependencias
2. ✅ Crear carpeta `content/blog/`
3. ✅ Crear `mdx-components.tsx`
4. ✅ Actualizar `getPost()` para leer MDX
5. ✅ Mantener `posts-data.tsx` para backward compatibility

### Fase 2: Migración Gradual
1. ✅ Migrar un artículo de prueba
2. ✅ Verificar UI es idéntico
3. ✅ Migrar resto de artículos
4. ✅ Deprecar `posts-data.tsx`

### Fase 3: Optimización
1. ✅ Agregar plugins (GFM, syntax highlighting)
2. ✅ Optimizar imágenes en Markdown
3. ✅ Agregar componentes MDX avanzados

---

## 📊 Comparación: Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Formato** | HTML en TypeScript | Markdown en archivos |
| **UI** | ✅ Actual | ✅ **Idéntico** |
| **Seguridad** | ⚠️ `dangerouslySetInnerHTML` | ✅ Renderizado seguro |
| **Escalabilidad** | ❌ Limitada | ✅ **Alta** |
| **Mantenibilidad** | ❌ Difícil | ✅ **Fácil** |
| **Type-safe** | ✅ Parcial | ✅ **Completo** |
| **Estándar industria** | ❌ No | ✅ **Sí** |

---

## 🎯 Checklist de Implementación

### Preparación
- [ ] Revisar este plan
- [ ] Confirmar que UI debe mantenerse igual
- [ ] Decidir estructura de carpetas

### Implementación
- [ ] Instalar dependencias
- [ ] Crear estructura de carpetas
- [ ] Crear mdx-components.tsx
- [ ] Actualizar getPost()
- [ ] Actualizar BlogArticle (solo renderizado)
- [ ] Migrar un artículo de prueba

### Testing
- [ ] Verificar UI es idéntico
- [ ] Verificar SEO (metadata)
- [ ] Verificar manejo de errores
- [ ] Verificar TypeScript types

### Migración
- [ ] Migrar todos los artículos
- [ ] Deprecar posts-data.tsx
- [ ] Documentar formato MDX

---

## 🔒 Manejo de Errores

```typescript
export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    // Validar slug
    if (!isValidSlug(slug)) {
      console.warn(`Invalid slug: ${slug}`)
      return null
    }

    // Leer archivo
    const filePath = join(process.cwd(), 'content', 'blog', `${slug}.md`)
    let fileContent: string

    try {
      fileContent = readFileSync(filePath, 'utf-8')
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null // Archivo no existe (404)
      }
      throw error // Error inesperado
    }

    // Parsear
    const { data, content } = matter(fileContent)

    // Validar con Zod
    const validatedPost = BlogPostSchema.parse({
      ...data,
      content,
      slug,
    })

    return validatedPost
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      throw new Error(`Invalid post data: ${error.message}`)
    }
    throw error
  }
}
```

---

## 📝 Ejemplo Completo de Archivo MDX

```markdown
---
title: "Announcing a free plan for small teams"
excerpt: "At preline, our mission has always been focused on bringing openness and transparency to the design process."
date: "2023-01-18T00:00:00Z"
category: "Company News"
tags: ["Plan", "Web development", "Free", "Team"]
author:
  name: "Leyla Ludic"
  role: "UI/UX enthusiast"
  avatar: "https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
images:
  main: "https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80"
  gallery:
    - "https://images.unsplash.com/photo-1671726203638-83742a2721a1?ixlib=rb-4.0.3"
    - "https://images.unsplash.com/photo-1671726203394-491c8b574a0a?ixlib=rb-4.0.3"
relatedPosts:
  - "5-reasons-not-start-ux-designer-career"
  - "ux-portfolio-20-percent-well-done"
  - "7-principles-icon-design"
---

# Announcing a free plan for small teams

At preline, our mission has always been focused on bringing openness and transparency to the design process. We've always believed that by providing a space where designers can share ongoing work not only empowers them to make better products, it also helps them grow.

We're proud to be a part of creating a more open culture and to continue building a product that supports this vision.

![Working process](https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3)

As we've grown, we've seen how Preline has helped companies such as Spotify, Microsoft, Airbnb, Facebook, and Intercom bring their designers closer together to create amazing things.

> To say that switching to Preline has been life-changing is an understatement. My business has tripled and I got my life back.
>
> — Nicole Grazioso

## Bringing the culture of sharing to everyone

We know the power of sharing is real, and we want to create an opportunity for everyone to try Preline and explore how transformative open communication can be.

- Preline allows us to collaborate in real time
- It's a persistent way for everyone to see and absorb each other's work
- Transparency and collaboration becomes integrated
```

---

## ✅ Conclusión

Esta solución cumple **TODOS** los requisitos:

✅ **Mismo UI** - Wrapper idéntico
✅ **Estable** - Basado en Next.js 15 oficial
✅ **Moderno** - MDX es estándar 2025
✅ **Elite/Pro** - Usado por empresas top
✅ **Escalable** - Archivos separados
✅ **Robusto** - Type-safe, validación, errores
✅ **Manejo de errores** - Completo

---

**¿Avanzamos con esta solución?**

**Documento creado:** Noviembre 2025
**Basado en:** Next.js 15 docs oficiales, best practices industria 2025
