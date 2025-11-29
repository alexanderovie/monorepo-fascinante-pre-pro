# Blog Content Directory

Este directorio contiene los artículos del blog en formato **Markdown/MDX**.

## Formato de Archivos

Cada artículo debe ser un archivo `.md` con la siguiente estructura:

```markdown
---
title: "Título del artículo"
excerpt: "Resumen corto del artículo"
date: "2023-01-18T00:00:00Z"
category: "Categoría"
tags:
  - Tag1
  - Tag2
author:
  name: "Nombre del autor"
  role: "Rol del autor"
  avatar: "URL del avatar"
images:
  main: "URL de imagen principal"
  gallery:
    - "URL imagen 1"
    - "URL imagen 2"
relatedPosts:
  - "slug-articulo-relacionado-1"
  - "slug-articulo-relacionado-2"
---

# Contenido del artículo

Aquí va el contenido en Markdown...

## Subtítulos

Párrafos, listas, imágenes, etc.

- Lista item 1
- Lista item 2

![Descripción](https://url-imagen.jpg)
```

## Frontmatter Obligatorio

- `title`: Título del artículo
- `date`: Fecha en formato ISO 8601
- `category`: Categoría del artículo
- `author.name`: Nombre del autor

## Frontmatter Opcional

- `excerpt`: Resumen corto
- `tags`: Array de tags
- `images`: Objeto con `main` y `gallery`
- `relatedPosts`: Array de slugs de artículos relacionados
- `author.role`: Rol del autor
- `author.avatar`: URL del avatar

## Slug del Artículo

El slug del artículo se deriva del nombre del archivo:
- Archivo: `mi-articulo.md` → Slug: `mi-articulo`

## Compatibilidad

- Los artículos pueden usar **Markdown puro** o **HTML embebido** dentro del Markdown
- El sistema detecta automáticamente si el contenido es Markdown o HTML del sistema antiguo
- Si un artículo no existe en formato MDX, el sistema hace fallback a los datos mock (backward compatibility)

## Ejemplos

Ver `announcing-free-plan-small-teams.md` para un ejemplo completo.
