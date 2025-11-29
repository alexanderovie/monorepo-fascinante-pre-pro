# Plan Elite Pro: Hero Reutilizable y Escalable para Todas las Páginas

## 📋 Resumen Ejecutivo

Este documento proporciona un plan profesional para refactorizar el componente Hero y crear un sistema de configuración escalable que permita reutilizarlo en múltiples páginas (homepage, contacto, auditoría, y futuras) sin hardcodear valores, siguiendo mejores prácticas de UX/UI actualizadas a noviembre 2025.

**Objetivo:** Crear un sistema de configuración tipo "preset" que permita definir variantes de Hero de forma declarativa, escalable y mantenible.

---

## 🔍 Análisis de la Situación Actual

### Estado Actual

**Homepage:**
```tsx
<Hero
  badge={t('badge')}
  title={...formato complejo...}
  description={t('description')}
  primaryButton={{...}}
  secondaryButton={{...}}
  downloadSection={...}
  // Tabs por defecto
  // Background por defecto
/>
```

**Contacto:**
```tsx
<Hero
  badge={t('badge')}
  title={t('title')}
  description={t('description')}
  tabs={[]}
  showBackground={false}
  primaryButton={null}
  secondaryButton={null}
/>
```

**Auditoría:**
```tsx
// ❌ NO TIENE HERO
// Solo tiene AuditFormSection directamente
```

### Problemas Identificados

1. **Hardcoding de props:** Cada página pasa props individualmente
2. **Duplicación de configuración:** Mismas opciones repetidas en múltiples lugares
3. **No escalable:** Agregar nueva página requiere copiar/pegar código
4. **Inconsistencia:** Difícil mantener consistencia entre páginas
5. **Mantenimiento difícil:** Cambios globales requieren modificar múltiples archivos

---

## 🎯 Solución Propuesta: Sistema de Presets/Variantes

### Concepto: Hero Presets Pattern

Similar a cómo funcionan los design systems modernos (Material UI, Chakra UI, Tailwind UI), crearemos un sistema de "presets" que define variantes de Hero preconfiguradas.

**Patrón de Diseño:** "Configuration over Code"

---

## 📐 Arquitectura de la Solución

### 1. Hero Preset Configuration

Crear un archivo de configuración centralizado con todas las variantes de Hero:

```typescript
// lib/hero-presets.ts

export type HeroPresetType = 'homepage' | 'contact' | 'audit' | 'features' | 'pricing';

export interface HeroPreset {
  // Identificación
  id: HeroPresetType;

  // Configuración básica
  badge: string | { key: string; namespace?: string };
  title: string | { key: string; namespace?: string; format?: 'simple' | 'split' };
  description: string | { key: string; namespace?: string };

  // Elementos opcionales
  tabs: 'default' | 'none' | HeroTab[];
  background: boolean | { light: string; dark: string };
  buttons: {
    primary: HeroButton | null;
    secondary: HeroButton | null;
  } | null;
  downloadSection: boolean | DownloadSectionConfig;

  // Spacing personalizado (opcional)
  spacing?: {
    paddingTop?: string;
    paddingBottom?: string;
  };
}
```

### 2. Hero Factory Hook

Crear un hook que toma el preset y devuelve las props configuradas:

```typescript
// hooks/useHeroPreset.ts

export function useHeroPreset(presetType: HeroPresetType, locale?: string) {
  // Carga traducciones
  // Resuelve configuración del preset
  // Devuelve props listas para usar
}
```

### 3. Componente Hero Simplificado

El Hero acepta props directamente o un preset:

```typescript
<Hero preset="homepage" />
// O
<Hero {...heroProps} />
```

---

## 🏗️ Implementación Detallada

### Fase 1: Crear Sistema de Configuración

#### Paso 1.1: Definir Tipos y Interfaces

**Archivo: `lib/hero-presets.types.ts`**

```typescript
export type HeroPresetType =
  | 'homepage'
  | 'contact'
  | 'audit'
  | 'features'  // Futuro
  | 'pricing';   // Futuro

export interface HeroPresetConfig {
  id: HeroPresetType;
  badge: TranslationKey;
  title: TranslationKey | SplitTitleConfig;
  description: TranslationKey;
  tabs: 'default' | 'none' | HeroTab[];
  background: boolean | BackgroundImageConfig;
  buttons: ButtonConfig | null;
  downloadSection: boolean | DownloadSectionConfig;
  spacing?: SpacingConfig;
}

interface TranslationKey {
  key: string;
  namespace?: string;
}

interface SplitTitleConfig {
  key: string;
  keyOn?: string;
  namespace?: string;
}
```

#### Paso 1.2: Crear Presets Configuration

**Archivo: `lib/hero-presets.config.ts`**

```typescript
import { HeroPresetConfig, HeroPresetType } from './hero-presets.types';

export const heroPresets: Record<HeroPresetType, HeroPresetConfig> = {
  homepage: {
    id: 'homepage',
    badge: { key: 'badge', namespace: 'hero' },
    title: {
      key: 'title',
      keyOn: 'titleOn',
      namespace: 'hero',
      format: 'split'
    },
    description: { key: 'description', namespace: 'hero' },
    tabs: 'default',
    background: true, // Usa defaults
    buttons: {
      primary: {
        label: { key: 'primaryButton', namespace: 'hero' },
        href: URLS.tryItFree,
      },
      secondary: {
        label: { key: 'secondaryButton', namespace: 'hero' },
        href: URLS.getDemo,
      },
    },
    downloadSection: true, // Usa defaultHeroDownloadData
  },

  contact: {
    id: 'contact',
    badge: { key: 'badge', namespace: 'hero.contact' },
    title: { key: 'title', namespace: 'hero.contact', format: 'simple' },
    description: { key: 'description', namespace: 'hero.contact' },
    tabs: 'none',
    background: false,
    buttons: null,
    downloadSection: false,
  },

  audit: {
    id: 'audit',
    badge: { key: 'badge', namespace: 'hero' },
    title: { key: 'title', namespace: 'hero', format: 'simple' },
    description: { key: 'description', namespace: 'hero' },
    tabs: 'none',
    background: false,
    buttons: null,
    downloadSection: false,
  },
};
```

#### Paso 1.3: Crear Helper para Resolver Presets

**Archivo: `lib/hero-presets.helpers.ts`**

```typescript
export async function resolveHeroPreset(
  presetType: HeroPresetType,
  getTranslations: (namespace: string) => any
): Promise<HeroProps> {
  const preset = heroPresets[presetType];

  // Resolver traducciones
  // Resolver configuración
  // Devolver props finales
}
```

---

### Fase 2: Refactorizar Componente Hero

#### Paso 2.1: Extender HeroProps para Aceptar Preset

```typescript
interface HeroProps {
  // Opción 1: Usar preset
  preset?: HeroPresetType;

  // Opción 2: Props directas (backward compatible)
  badge?: string;
  title?: string | React.ReactNode;
  // ... resto de props
}
```

#### Paso 2.2: Implementar Lógica de Preset en Hero

```typescript
export default async function Hero({
  preset,
  ...directProps
}: HeroProps) {
  let finalProps: HeroProps;

  if (preset) {
    // Usar preset
    finalProps = await resolveHeroPreset(preset);
  } else {
    // Usar props directas (backward compatible)
    finalProps = directProps;
  }

  // Renderizar con finalProps
}
```

---

### Fase 3: Actualizar Páginas

#### Paso 3.1: Homepage (Mantener Compatibilidad)

```tsx
// Opción A: Usar preset (recomendado)
<Hero preset="homepage" />

// Opción B: Mantener props directas (backward compatible)
<Hero {...existingProps} />
```

#### Paso 3.2: Contacto (Usar Preset)

```tsx
<Hero preset="contact" />
```

#### Paso 3.3: Auditoría (Agregar Hero con Preset)

```tsx
// audit/page.tsx
export default async function AuditPage() {
  return (
    <>
      <Hero preset="audit" />
      <AuditFormSection />
    </>
  );
}
```

---

## 🔧 Implementación Técnica Específica

### Estructura de Archivos

```
lib/
  hero-presets/
    types.ts           # Tipos TypeScript
    config.ts          # Configuraciones de presets
    helpers.ts         # Funciones helper
    constants.ts       # Constantes compartidas
    index.ts           # Exportaciones públicas
```

### Ejemplo de Implementación Completa

#### 1. Tipos (`types.ts`)

```typescript
export type HeroPresetType = 'homepage' | 'contact' | 'audit';

export interface HeroPresetConfig {
  id: HeroPresetType;
  badge: { key: string; namespace: string };
  title: {
    key: string;
    namespace: string;
    format?: 'simple' | 'split';
    keyOn?: string;
  };
  description: { key: string; namespace: string };
  tabs: 'default' | 'none';
  background: boolean;
  buttons: {
    primary: { labelKey: string; href: string } | null;
    secondary: { labelKey: string; href: string } | null;
  } | null;
  downloadSection: boolean;
}
```

#### 2. Configuración (`config.ts`)

```typescript
import { HeroPresetConfig } from './types';
import { URLS } from '../../constants';

export const heroPresets: Record<string, HeroPresetConfig> = {
  homepage: {
    id: 'homepage',
    badge: { key: 'badge', namespace: 'hero' },
    title: {
      key: 'title',
      keyOn: 'titleOn',
      namespace: 'hero',
      format: 'split'
    },
    description: { key: 'description', namespace: 'hero' },
    tabs: 'default',
    background: true,
    buttons: {
      primary: { labelKey: 'primaryButton', href: URLS.tryItFree },
      secondary: { labelKey: 'secondaryButton', href: URLS.getDemo },
    },
    downloadSection: true,
  },
  contact: {
    id: 'contact',
    badge: { key: 'badge', namespace: 'hero.contact' },
    title: { key: 'title', namespace: 'hero.contact', format: 'simple' },
    description: { key: 'description', namespace: 'hero.contact' },
    tabs: 'none',
    background: false,
    buttons: null,
    downloadSection: false,
  },
  audit: {
    id: 'audit',
    badge: { key: 'badge', namespace: 'hero' },
    title: { key: 'title', namespace: 'hero', format: 'simple' },
    description: { key: 'description', namespace: 'hero' },
    tabs: 'none',
    background: false,
    buttons: null,
    downloadSection: false,
  },
};
```

#### 3. Helper para Resolver (`helpers.ts`)

```typescript
import { getTranslations } from 'next-intl/server';
import { heroPresets } from './config';
import { defaultHeroDownloadData } from '../hero-download-data';
import { defaultTabs } from '../../components/Hero';

export async function resolveHeroPreset(
  presetType: string
): Promise<any> {
  const preset = heroPresets[presetType];
  if (!preset) {
    throw new Error(`Hero preset "${presetType}" not found`);
  }

  const t = await getTranslations(preset.badge.namespace);

  // Resolver badge
  const badge = t(preset.badge.key);

  // Resolver title
  let title: string | React.ReactNode;
  if (preset.title.format === 'split') {
    title = (
      <>
        {t(preset.title.key)}
        <br className="hidden md:block" />
        <span className="md:hidden"> </span>
        {t(preset.title.keyOn || '')}
      </>
    );
  } else {
    title = t(preset.title.key);
  }

  // Resolver description
  const description = t(preset.description.key);

  // Resolver tabs
  const tabs = preset.tabs === 'default' ? defaultTabs : [];

  // Resolver background
  const showBackground = preset.background === true;

  // Resolver buttons
  let primaryButton = null;
  let secondaryButton = null;
  if (preset.buttons) {
    if (preset.buttons.primary) {
      primaryButton = {
        label: t(preset.buttons.primary.labelKey),
        href: preset.buttons.primary.href,
      };
    }
    if (preset.buttons.secondary) {
      secondaryButton = {
        label: t(preset.buttons.secondary.labelKey),
        href: preset.buttons.secondary.href,
      };
    }
  }

  // Resolver downloadSection
  const downloadSection = preset.downloadSection
    ? defaultHeroDownloadData
    : undefined;

  return {
    badge,
    title,
    description,
    tabs,
    showBackground,
    primaryButton,
    secondaryButton,
    downloadSection,
  };
}
```

---

## 🎯 Mejores Prácticas UX/UI 2025

### Principios Aplicados

1. **Single Source of Truth**
   - Toda la configuración en un solo lugar
   - Elimina duplicación
   - Fácil mantenimiento

2. **Configuration over Code**
   - Declarativo vs imperativo
   - Más fácil de entender
   - Más fácil de modificar

3. **Backward Compatibility**
   - El Hero sigue aceptando props directas
   - No rompe código existente
   - Migración gradual posible

4. **Type Safety**
   - TypeScript en toda la configuración
   - Autocompletado en IDEs
   - Detección de errores en compile-time

5. **Separation of Concerns**
   - Configuración separada de lógica
   - Traducciones separadas de UI
   - Reutilización fácil

---

## 📊 Plan de Migración

### Estrategia: Migración Gradual

**Fase 1: Infraestructura (Sin cambios visibles)**
- ✅ Crear sistema de presets
- ✅ Crear helpers y tipos
- ✅ Mantener Hero backward compatible

**Fase 2: Migrar Páginas Existentes**
- ✅ Migrar Contacto a preset
- ✅ Mantener Homepage con props directas (opcional)

**Fase 3: Agregar Nuevas Páginas**
- ✅ Agregar Hero a Auditoría con preset
- ✅ Usar presets para futuras páginas

**Fase 4: Optimización (Opcional)**
- Migrar Homepage a preset
- Eliminar soporte de props directas (si se desea)

---

## 🎓 Beneficios de Esta Arquitectura

### Para Desarrolladores

1. **Rapidez:** `preset="audit"` vs 15+ líneas de props
2. **Consistencia:** Todos usan la misma fuente de verdad
3. **Mantenibilidad:** Cambio en un lugar afecta todas las páginas
4. **Escalabilidad:** Agregar nueva página = agregar preset

### Para el Negocio

1. **Velocidad de desarrollo:** Menos tiempo en configuración
2. **Calidad:** Menos errores por configuración incorrecta
3. **Flexibilidad:** Fácil probar diferentes variantes
4. **Consistencia:** UX uniforme en todas las páginas

---

## ✅ Checklist de Implementación

### Fase 1: Infraestructura
- [ ] Crear estructura de archivos `lib/hero-presets/`
- [ ] Definir tipos TypeScript
- [ ] Crear configuración de presets
- [ ] Crear helper de resolución
- [ ] Añadir tests unitarios

### Fase 2: Refactorizar Hero
- [ ] Extender HeroProps para aceptar preset
- [ ] Implementar lógica de preset
- [ ] Mantener backward compatibility
- [ ] Añadir tests

### Fase 3: Migrar/Agregar Páginas
- [ ] Migrar Contacto a preset
- [ ] Agregar Hero a Auditoría con preset
- [ ] Verificar que Homepage sigue funcionando
- [ ] Testing en todas las páginas

### Fase 4: Documentación
- [ ] Documentar sistema de presets
- [ ] Crear ejemplos de uso
- [ ] Documentar cómo agregar nuevos presets

---

## 🚀 Código de Ejemplo Final

### Uso Simplificado en Páginas

**Antes (Hardcodeado):**
```tsx
<Hero
  badge={t('badge')}
  title={t('title')}
  description={t('description')}
  tabs={[]}
  showBackground={false}
  primaryButton={null}
  secondaryButton={null}
/>
```

**Después (Con Preset):**
```tsx
<Hero preset="contact" />
```

### Agregar Nueva Página

**Paso 1:** Agregar preset a config
```typescript
pricing: {
  id: 'pricing',
  badge: { key: 'badge', namespace: 'hero.pricing' },
  // ...
}
```

**Paso 2:** Usar en página
```tsx
<Hero preset="pricing" />
```

**¡Listo!** Sin código repetido, sin hardcoding.

---

## 📝 Consideraciones Finales

### Escalabilidad ✅

- Fácil agregar nuevas variantes
- No requiere modificar componente Hero
- Configuración centralizada

### Robustez ✅

- Type-safe con TypeScript
- Validación de presets
- Backward compatible

### Mantenibilidad ✅

- Single source of truth
- Fácil de entender
- Fácil de modificar

### Performance ✅

- Sin overhead significativo
- Lazy loading posible
- Caching de traducciones

---

## 🎯 Próximos Pasos

1. **Revisar este plan** con el equipo
2. **Implementar Fase 1** (infraestructura)
3. **Testing** en desarrollo
4. **Migrar páginas** gradualmente
5. **Documentar** para futuros desarrolladores

---

**Documento creado:** Noviembre 2025
**Versión:** 1.0
**Basado en:** Mejores prácticas UX/UI 2025, Design Systems modernos, TypeScript best practices
