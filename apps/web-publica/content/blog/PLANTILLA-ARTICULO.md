# 📝 Plantilla para Crear Artículos de Blog

## 🎯 Estructura Básica de un Artículo

### Frontmatter (Metadatos) - OBLIGATORIO

```yaml
---
title: "Tu título aquí"                    # ← CAMBIAR: Título principal
excerpt: "Resumen de 1-2 líneas"           # ← CAMBIAR: Breve descripción
date: "2025-11-15T00:00:00Z"              # ← CAMBIAR: Fecha de publicación
category: "Nombre de Categoría"            # ← CAMBIAR: Categoría (ej: "Marketing", "SEO", "Negocios")
tags:                                      # ← CAMBIAR: 3-5 tags relevantes
  - Tag1
  - Tag2
  - Tag3
author:
  name: "Nombre Autor"                     # ← CAMBIAR: Nombre del autor
  role: "Rol del autor"                    # ← CAMBIAR: Ej: "CEO", "Marketing Manager"
  avatar: "URL del avatar"                 # ← CAMBIAR: URL de imagen
images:
  main: "URL imagen principal"             # ← CAMBIAR: Imagen destacada
  gallery:                                 # ← OPCIONAL: Más imágenes
    - "URL imagen 1"
    - "URL imagen 2"
relatedPosts:                              # ← OPCIONAL: Slugs de artículos relacionados
  - "slug-articulo-1"
  - "slug-articulo-2"
---
```

---

## 📐 Estructura del Contenido (Cuerpo del Artículo)

### 1. **Introducción** (2-3 párrafos)
```
Párrafo 1: Contexto y problema
Párrafo 2: Por qué es importante
Párrafo 3: Qué van a aprender (preview)
```

### 2. **Encabezados H2** (Secciones principales)
```
## Título de Sección 1
Contenido...

## Título de Sección 2  
Contenido...

## Título de Sección 3
Contenido...
```

### 3. **Encabezados H3** (Subsecciones - opcional)
```
## Sección Principal

### Subtítulo dentro de la sección
Contenido...

### Otro subtítulo
Contenido...
```

### 4. **Cierre** (1-2 párrafos)
```
Párrafo final: Resumen y llamada a acción
```

---

## 📊 Cuántos Encabezados Usar

### Artículo Corto (800-1200 palabras)
- **1 H1** (título principal)
- **2-3 H2** (secciones principales)
- **0-2 H3** (si necesitas subdividir)

### Artículo Mediano (1200-2000 palabras)
- **1 H1**
- **3-5 H2**
- **2-4 H3**

### Artículo Largo (2000+ palabras)
- **1 H1**
- **5-8 H2**
- **4-6 H3**

---

## ✍️ Qué Cambiar para Cada Artículo

### 1. **Frontmatter** (TODO cambia)
- ✅ Título único y atractivo
- ✅ Excerpt diferente
- ✅ Fecha actualizada
- ✅ Tags relevantes
- ✅ Autor y avatar
- ✅ Imágenes diferentes

### 2. **Contenido** (TODO cambia)
- ✅ Introducción nueva
- ✅ Títulos de secciones diferentes
- ✅ Párrafos con contenido único
- ✅ Ejemplos y casos de uso nuevos

### 3. **Estructura** (Se mantiene similar)
- ✅ Misma estructura básica (intro → cuerpo → cierre)
- ✅ Mismo formato Markdown
- ✅ Mismas clases CSS (si usas HTML)

---

## 🎨 Elementos que Puedes Usar

### Párrafos Normales
```markdown
Este es un párrafo normal. Puedes escribir lo que quieras aquí.
```

### Párrafos con Estilo
Los párrafos se estilizan automáticamente con la clase `prose`.

### Listas
```markdown
- Item 1
- Item 2
- Item 3
```

### Links
```markdown
[Texto del link](https://url.com)
```

### Imágenes Simples
```markdown
![Descripción](https://url-imagen.jpg)
```

### Imágenes con Figura (caption)
```markdown
<figure>
  <img src="https://url-imagen.jpg" alt="Descripción" />
  <figcaption>Texto del caption</figcaption>
</figure>
```

### Blockquotes (Citas)
```markdown
<blockquote>
  <p>Tu cita aquí</p>
  <p>— Nombre del autor</p>
</blockquote>
```

### Grids de Imágenes (HTML/JSX)
```jsx
<div className="text-center">
  <div className="grid lg:grid-cols-2 gap-3">
    <figure className="relative w-full h-60">
      <img className="size-full absolute top-0 start-0 object-cover rounded-xl" src="URL" alt="Descripción" />
    </figure>
  </div>
</div>
```

---

## 📝 Ejemplo Completo de Estructura

```markdown
---
title: "Mi Nuevo Artículo"
excerpt: "Descripción breve que resume el artículo"
date: "2025-11-15T00:00:00Z"
category: "Marketing"
tags:
  - SEO
  - Google
  - Negocios
author:
  name: "Juan Pérez"
  role: "Marketing Manager"
  avatar: "https://..."
images:
  main: "https://..."
---

## Introducción

Párrafo 1: Contexto y problema que resuelve el artículo.

Párrafo 2: Por qué es importante y relevante ahora.

Párrafo 3: Qué van a aprender al leer este artículo.

![Imagen de introducción](https://...)

## Primera Sección Principal

Contenido de la primera sección. Puedes incluir:

- Listas de puntos
- **Texto en negrita**
- *Texto en cursiva*
- [Links relevantes](https://...)

### Subsección (Opcional)

Si necesitas subdividir una sección, usa H3.

## Segunda Sección Principal

Más contenido...

<blockquote>
  <p>Cita destacada si es relevante</p>
  <p>— Nombre del autor</p>
</blockquote>

## Tercera Sección Principal

Contenido final...

<figure>
  <img src="https://..." alt="Descripción" />
  <figcaption>Caption de la imagen</figcaption>
</figure>

## Conclusión

Párrafo final resumiendo los puntos principales y llamada a acción.
```

---

## ✅ Checklist para Crear un Artículo

- [ ] Frontmatter completo y único
- [ ] Título atractivo y claro
- [ ] Excerpt descriptivo (1-2 líneas)
- [ ] Fecha actualizada
- [ ] Tags relevantes (3-5)
- [ ] Autor y avatar configurados
- [ ] Imagen principal
- [ ] Introducción clara (2-3 párrafos)
- [ ] 3-5 secciones principales (H2)
- [ ] Subsecciones si es necesario (H3)
- [ ] Contenido único y valioso
- [ ] Imágenes relevantes
- [ ] Conclusión con llamada a acción
- [ ] Revisar ortografía y gramática

---

## 💡 Tips para Buen Copywriting

1. **Títulos claros**: Que el lector sepa qué va a aprender
2. **Párrafos cortos**: 3-5 líneas máximo
3. **Listas**: Fáciles de escanear
4. **Ejemplos concretos**: En lugar de teoría abstracta
5. **Llamadas a acción**: Al final de cada sección importante
6. **Vocabulario simple**: Evita jerga técnica innecesaria
7. **Transiciones**: Conecta ideas entre párrafos
8. **Imágenes relevantes**: Que apoyen el contenido

---

**Última actualización:** Noviembre 2025

