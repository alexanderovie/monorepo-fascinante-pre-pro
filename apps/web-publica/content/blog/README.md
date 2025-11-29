# Blog Content Structure

**Actualizado:** Diciembre 2025

## 📁 Estructura de Carpetas

```
content/blog/
├── es/                          # Artículos en español
│   └── como-hacer-auditoria-digital.md
├── en/                          # Artículos en inglés
│   └── how-to-do-digital-audit.md
└── .meta/
    └── article-mapping.json     # Mapeo de artículos relacionados entre idiomas
```

## 🌍 Sistema de i18n

### Slugs Localizados

Cada idioma tiene su propio slug SEO-optimizado:
- **Español**: `como-hacer-auditoria-digital`
- **Inglés**: `how-to-do-digital-audit`

Esto permite:
- ✅ URLs SEO-friendly en cada idioma
- ✅ Keywords localizadas en la URL
- ✅ Mejor experiencia de usuario

### Mapeo de Artículos

El archivo `.meta/article-mapping.json` relaciona artículos entre idiomas:

```json
{
  "articles": [
    {
      "id": "digital-audit-complete-guide",
      "slugs": {
        "es": "como-hacer-auditoria-digital",
        "en": "how-to-do-digital-audit"
      },
      "title": {
        "es": "Cómo Hacer una Auditoría Digital Completa en 7 Pasos",
        "en": "How to Do a Complete Digital Audit in 7 Steps"
      }
    }
  ]
}
```

## 📝 Agregar un Nuevo Artículo

### 1. Crear el archivo MDX

**Español:**
```
content/blog/es/mi-nuevo-articulo.md
```

**Inglés:**
```
content/blog/en/my-new-article.md
```

### 2. Frontmatter Requerido

```yaml
---
title: "Título del Artículo"
excerpt: "Descripción breve para SEO y previews"
date: "2025-12-01T00:00:00Z"
category: "Categoría"
tags:
  - tag1
  - tag2
author:
  name: "Fascinante Digital"
  role: "Equipo Editorial"
images:
  main: "https://..."
---
```

### 3. Actualizar el Mapeo

Agregar entrada en `.meta/article-mapping.json`:

```json
{
  "articles": [
    {
      "id": "unique-article-id",
      "slugs": {
        "es": "mi-nuevo-articulo",
        "en": "my-new-article"
      },
      "title": {
        "es": "Título en Español",
        "en": "Title in English"
      },
      "created": "2025-12-01T00:00:00Z"
    }
  ]
}
```

## 🔗 URLs Generadas

- Español: `/es/blog/mi-nuevo-articulo`
- Inglés: `/en/blog/my-new-article`

## 📋 Checklist para Nuevos Artículos

- [ ] Crear archivo MDX en `/es/`
- [ ] Crear archivo MDX en `/en/` (si aplica)
- [ ] Agregar entrada en `article-mapping.json`
- [ ] Verificar frontmatter completo
- [ ] Probar URLs en ambos idiomas
- [ ] Verificar hreflang tags en metadata

## ⚠️ Notas Importantes

1. **Slugs únicos**: Cada slug debe ser único dentro de su locale
2. **Mapeo requerido**: Si un artículo existe en múltiples idiomas, DEBE estar en el mapeo
3. **Formato de fecha**: Usar ISO 8601: `2025-12-01T00:00:00Z`
4. **Imágenes**: Pueden ser URLs absolutas (https://) o rutas relativas (/images/...)
