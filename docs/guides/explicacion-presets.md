# ¿Qué son los Presets? Explicación Simple para Junior Developers

## 🎯 La Idea Principal (En Español Simple)

Imagina que tienes un componente `Hero` que se usa en varias páginas (homepage, contact, audit). Cada página quiere mostrar el Hero de forma **diferente**:

- **Homepage:** Con fondo, con botones, con tabs, con sección de descarga
- **Contact:** Sin fondo, sin botones, sin tabs
- **Audit:** Sin fondo, sin botones, sin tabs

**El problema:** Si cada página construye el Hero manualmente, tendrías código repetido y difícil de mantener.

**La solución:** Los **presets** son como "plantillas" o "recetas" que dicen cómo debe verse el Hero en cada página.

---

## 🍕 Analogía: Una Pizzería

Piensa en una pizzería:

- **Preset "Margarita":** Queso, tomate, orégano
- **Preset "Pepperoni":** Queso, tomate, pepperoni
- **Preset "Vegana":** Sin queso, solo verduras

Cada preset es una **receta** que define qué ingredientes tiene la pizza.

En nuestro caso:
- **Preset "homepage":** Con fondo, con botones, con tabs
- **Preset "contact":** Sin fondo, sin botones
- **Preset "audit":** Sin fondo, sin botones

---

## 📁 Estructura de Archivos

Los presets están organizados en esta carpeta:

```
lib/hero-presets/
├── config.ts          ← Aquí defines los presets (las "recetas")
├── helpers.ts         ← Aquí resuelves los presets (cocinas la pizza)
├── resolve-to-props.tsx ← Aquí conviertes datos a props del Hero
├── types.ts           ← Aquí defines los tipos TypeScript
└── index.ts           ← Aquí exportas todo (punto de entrada)
```

---

## 🔧 Cómo Funciona (Paso a Paso)

### Paso 1: Definir el Preset (config.ts)

Aquí defines cómo debe verse cada preset:

```typescript
export const heroPresets = {
  audit: {
    id: 'audit',
    badge: { key: 'badge', namespace: 'hero' },
    title: {
      key: 'title',
      namespace: 'hero',
      format: 'simple',  // ← Título simple (no dividido)
    },
    description: { key: 'description', namespace: 'hero' },
    tabs: 'none',           // ← Sin tabs
    background: false,       // ← Sin fondo
    buttons: null,          // ← Sin botones
    downloadSection: false, // ← Sin sección de descarga
  },
};
```

**En palabras simples:** Este preset dice "el Hero de audit debe tener título simple, sin tabs, sin fondo, sin botones".

### Paso 2: Resolver el Preset (helpers.ts)

Cuando usas el preset, necesitas:
1. **Traducciones:** Obtener los textos en el idioma correcto (español/inglés)
2. **Datos:** Combinar la configuración con las traducciones

```typescript
// En tu página (audit/page.tsx)
const heroData = await resolveHeroPreset('audit');
```

**¿Qué hace esto?**
- Busca el preset `'audit'` en `config.ts`
- Lee las traducciones desde `messages/es.json` o `messages/en.json`
- Combina todo y te devuelve los datos listos

**Ejemplo de lo que devuelve:**
```typescript
{
  badge: "Auditoría Gratuita",  // ← Traducido al español
  title: {
    format: 'simple',
    main: "Obtén tu auditoría gratuita"
  },
  description: "Antes de gastar en anuncios...",
  tabs: [],  // ← Array vacío (sin tabs)
  showBackground: false,
  buttons: null,
  downloadSection: undefined
}
```

### Paso 3: Convertir a Props (resolve-to-props.tsx)

El componente `Hero` necesita props específicas. Esta función convierte los datos en props:

```typescript
const heroProps = resolveToHeroProps(heroData);
```

**¿Qué hace?**
- Toma los datos resueltos
- Convierte el título según su formato (simple o split)
- Prepara todo para que el componente `Hero` lo entienda

### Paso 4: Usar en el Componente

Finalmente, pasas las props al Hero:

```typescript
<Hero {...heroProps} />
```

---

## 🎨 Comparación: Con vs Sin Presets

### ❌ Sin Presets (Código Repetido)

```typescript
// En audit/page.tsx
const t = await getTranslations('hero');
return (
  <Hero
    badge={t('badge')}
    title={t('title')}
    description={t('description')}
    tabs={[]}
    showBackground={false}
    primaryButton={null}
    secondaryButton={null}
    downloadSection={undefined}
  />
);

// En contact/page.tsx (código casi idéntico)
const t = await getTranslations('hero.contact');
return (
  <Hero
    badge={t('badge')}
    title={t('title')}
    description={t('description')}
    tabs={[]}
    showBackground={false}
    primaryButton={null}
    secondaryButton={null}
    downloadSection={undefined}
  />
);
```

**Problemas:**
- Código repetido en cada página
- Si cambias algo, tienes que cambiarlo en varios lugares
- Fácil cometer errores (olvidar cambiar algo)

### ✅ Con Presets (Código Centralizado)

```typescript
// En audit/page.tsx
const heroData = await resolveHeroPreset('audit');
const heroProps = resolveToHeroProps(heroData);
return <Hero {...heroProps} />;

// En contact/page.tsx
const heroData = await resolveHeroPreset('contact');
const heroProps = resolveToHeroProps(heroData);
return <Hero {...heroProps} />;
```

**Ventajas:**
- Código limpio y corto
- Todo centralizado en `config.ts`
- Si cambias algo, solo cambias en un lugar
- Menos errores

---

## 🔍 Ejemplo Real: Preset "audit"

Vamos a ver cómo funciona el preset `audit` paso a paso:

### 1. Configuración (config.ts)

```typescript
audit: {
  id: 'audit',
  badge: { key: 'badge', namespace: 'hero' },
  // ↑ Dice: "Busca 'badge' en messages/es.json bajo 'hero'"

  title: {
    key: 'title',
    namespace: 'hero',
    format: 'simple',  // ← Título simple (no dividido)
  },

  description: { key: 'description', namespace: 'hero' },
  tabs: 'none',        // ← Sin tabs
  background: false,   // ← Sin fondo
  buttons: null,       // ← Sin botones
  downloadSection: false,
}
```

### 2. Traducciones (messages/es.json)

```json
{
  "hero": {
    "badge": "Auditoría Gratuita",
    "title": "Obtén tu auditoría gratuita",
    "description": "Antes de gastar en anuncios..."
  }
}
```

### 3. Uso en la Página (audit/page.tsx)

```typescript
// 1. Resolver el preset (obtener datos)
const heroData = await resolveHeroPreset('audit');
// heroData = {
//   badge: "Auditoría Gratuita",
//   title: { format: 'simple', main: "Obtén tu auditoría gratuita" },
//   description: "Antes de gastar en anuncios...",
//   tabs: [],
//   showBackground: false,
//   buttons: null,
//   downloadSection: undefined
// }

// 2. Convertir a props
const heroProps = resolveToHeroProps(heroData);
// heroProps = {
//   badge: "Auditoría Gratuita",
//   title: "Obtén tu auditoría gratuita",  // ← Convertido a string
//   description: "Antes de gastar en anuncios...",
//   tabs: [],
//   showBackground: false,
//   primaryButton: null,
//   secondaryButton: null,
//   downloadSection: undefined
// }

// 3. Usar en el componente
return <Hero {...heroProps} />;
```

---

## 🆚 Diferencia Entre Presets

### Preset "homepage" (Más Completo)

```typescript
homepage: {
  tabs: 'default',      // ← Con tabs
  background: true,     // ← Con fondo
  buttons: {            // ← Con botones
    primary: { labelKey: 'primaryButton', href: URLS.tryItFree },
    secondary: { labelKey: 'secondaryButton', href: URLS.getDemo },
  },
  downloadSection: true, // ← Con sección de descarga
}
```

### Preset "audit" (Más Simple)

```typescript
audit: {
  tabs: 'none',         // ← Sin tabs
  background: false,   // ← Sin fondo
  buttons: null,       // ← Sin botones
  downloadSection: false, // ← Sin sección de descarga
}
```

**En palabras simples:** Homepage es como una pizza completa con todos los ingredientes. Audit es como una pizza simple, solo lo básico.

---

## 🎓 Conceptos Clave para Entender

### 1. **Namespace (Espacio de Nombres)**

Es como una "carpeta" en las traducciones:

```json
{
  "hero": {           // ← Este es el namespace
    "badge": "...",
    "title": "..."
  },
  "hero.contact": {   // ← Otro namespace
    "badge": "...",
    "title": "..."
  }
}
```

Cuando defines `namespace: 'hero'`, busca las traducciones en `messages/es.json` bajo `"hero"`.

### 2. **Format: 'simple' vs 'split'**

- **'simple':** Título normal → "Obtén tu auditoría gratuita"
- **'split':** Título dividido → "Haz Visible Tu Negocio" + "en Google" (en dos líneas)

### 3. **Resolución Asíncrona**

`resolveHeroPreset()` es `async` porque necesita leer las traducciones, y eso toma tiempo.

Por eso usas `await`:
```typescript
const heroData = await resolveHeroPreset('audit');
```

---

## 🛠️ Cómo Crear un Nuevo Preset

Si quieres crear un preset para una nueva página (por ejemplo, "pricing"):

### 1. Agregar en config.ts

```typescript
export const heroPresets = {
  // ... otros presets
  pricing: {
    id: 'pricing',
    badge: { key: 'badge', namespace: 'hero.pricing' },
    title: {
      key: 'title',
      namespace: 'hero.pricing',
      format: 'simple',
    },
    description: { key: 'description', namespace: 'hero.pricing' },
    tabs: 'none',
    background: false,
    buttons: {
      primary: { labelKey: 'primaryButton', href: URLS.tryItFree },
      secondary: null,
    },
    downloadSection: false,
  },
};
```

### 2. Agregar Traducciones

```json
// messages/es.json
{
  "hero": {
    "pricing": {
      "badge": "Precios",
      "title": "Planes para tu Negocio",
      "description": "Elige el plan perfecto...",
      "primaryButton": "Comenzar gratis"
    }
  }
}
```

### 3. Usar en la Página

```typescript
// pricing/page.tsx
const heroData = await resolveHeroPreset('pricing');
const heroProps = resolveToHeroProps(heroData);
return <Hero {...heroProps} />;
```

---

## 🎯 Resumen en 3 Puntos

1. **Los presets son "recetas"** que definen cómo debe verse el Hero en cada página
2. **Todo está centralizado** en `config.ts`, así es fácil mantener y cambiar
3. **Solo necesitas 2 líneas** en cada página para usar un preset:
   ```typescript
   const heroData = await resolveHeroPreset('audit');
   const heroProps = resolveToHeroProps(heroData);
   ```

---

## 💡 Preguntas Frecuentes

### ¿Por qué no construir el Hero directamente en cada página?

Porque tendrías código repetido y sería difícil mantener. Si quieres cambiar algo, tendrías que cambiarlo en varios lugares.

### ¿Puedo tener un preset sin traducciones?

No, los presets siempre necesitan traducciones porque el Hero muestra textos. Si no hay traducción, el preset fallará.

### ¿Qué pasa si el preset no existe?

Se lanza un error `HeroPresetError` y la página muestra un 404 (gracias al manejo de errores en `audit/page.tsx`).

### ¿Puedo modificar un preset después de resolverlo?

Sí, pero no es recomendable. Es mejor modificar el preset en `config.ts` y resolverlo de nuevo.

---

## 🚀 Siguiente Paso

Ahora que entiendes los presets, puedes:
1. Ver cómo se usan en `audit/page.tsx`
2. Comparar con `contact/page.tsx` (que NO usa presets todavía)
3. Crear un nuevo preset para otra página

¡Espero que esto te haya ayudado a entender los presets! 🎉
