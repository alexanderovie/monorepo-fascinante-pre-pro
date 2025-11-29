# Análisis Comparativo: Hero Homepage vs Hero Contacto

## 📊 Comparación Detallada

### Homepage Hero (`page.tsx`)

**Configuración:**
```tsx
<Hero
  badge={t('badge')}  // "Aplicación Web"
  title={
    <>
      {t('title')}  // "Haz Visible Tu Negocio"
      <br className="hidden md:block" />
      <span className="md:hidden"> </span>
      {t('titleOn')}  // "en Google"
    </>
  }
  description={t('description')}
  primaryButton={{
    label: t('primaryButton'),  // "Pruébalo gratis"
    href: URLS.tryItFree,
  }}
  secondaryButton={{
    label: t('secondaryButton'),  // "Solicita una demo"
    href: URLS.getDemo,
  }}
  downloadSection={defaultHeroDownloadData}
/>
```

**Características:**
- ✅ Tiene badge
- ✅ Título con formato especial (salto de línea responsive)
- ✅ Descripción
- ✅ Botón primario (Pruébalo gratis)
- ✅ Botón secundario (Solicita una demo)
- ✅ Sección de descarga (downloadSection)
- ✅ Tabs con imágenes (por defecto, muestra 6 tabs)
- ✅ Background image visible (`showBackground=true` por defecto)

---

### Contact Page Hero (`contact/page.tsx`)

**Configuración:**
```tsx
<Hero
  badge={t('badge')}  // "Contacto"
  title={t('title')}  // "Solicita una demo gratuita"
  description={t('description')}
  tabs={[]}  // Sin tabs
  showBackground={false}  // Sin imagen de fondo
  primaryButton={null}  // Sin botones
  secondaryButton={null}  // Sin botones
/>
```

**Características:**
- ✅ Tiene badge ("Contacto")
- ✅ Título simple (sin formato especial)
- ✅ Descripción
- ❌ Sin botones
- ❌ Sin downloadSection
- ❌ Sin tabs (array vacío)
- ❌ Sin background image

---

## 🔍 Diferencias Clave Identificadas

| Aspecto | Homepage | Contacto | Diferencia |
|---------|----------|----------|------------|
| **Badge** | "Aplicación Web" | "Contacto" | ✅ Diferentes, correcto |
| **Título** | Formato complejo con `<br>` | Texto simple | ⚠️ Diferente formato |
| **Descripción** | Larga, explicativa | Corta, directa | ✅ Diferentes, correcto |
| **Botones** | 2 botones (primary + secondary) | Sin botones | ✅ Diferente por diseño |
| **Tabs** | 6 tabs con imágenes | Sin tabs | ✅ Diferente por diseño |
| **Background** | Imagen de fondo visible | Sin imagen | ✅ Diferente por diseño |
| **Download Section** | Sí | No | ✅ Diferente por diseño |

---

## 📐 Estructura Visual Comparada

### Homepage Hero
```
┌─────────────────────────────────────┐
│  [Imagen de fondo]                  │
│  ┌───────────────────────────────┐  │
│  │ Badge: "Aplicación Web"       │  │
│  │ Título (con salto de línea)   │  │
│  │ Descripción larga             │  │
│  │ [Botón 1] [Botón 2]          │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ [Tabs con imágenes]           │  │
│  │ Dashboard | Workspace | etc.  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Contact Page Hero
```
┌─────────────────────────────────────┐
│  [Sin imagen de fondo]              │
│  ┌───────────────────────────────┐  │
│  │ Badge: "Contacto"             │  │
│  │ Título simple                 │  │
│  │ Descripción corta             │  │
│  │ (Sin botones)                 │  │
│  └───────────────────────────────┘  │
│  (Sin tabs)                         │
└─────────────────────────────────────┘
```

---

## 🎯 Análisis de Consistencia

### Elementos Consistentes ✅
- Ambas usan el mismo componente `Hero`
- Ambas tienen badge, título y descripción
- Ambas siguen la misma estructura base
- Ambas son responsive

### Elementos Diferentes (Por Diseño) ✅
- Homepage: Más elementos visuales (tabs, imágenes, botones)
- Contacto: Más minimalista (sin elementos distractores)

### Posibles Inconsistencias a Revisar ⚠️
1. **Formato del título:** Homepage usa formato complejo, contacto usa simple
2. **Padding/Espaciado:** ¿Deberían tener el mismo padding?
3. **Altura visual:** ¿Deberían tener la misma altura mínima?

---

## 📝 Estado Actual del Código

### Homepage Hero Implementation
- Usa traducciones de `hero` namespace
- Tiene configuración completa con todos los elementos
- Tabs visibles (defaultTabs)
- Background image visible

### Contact Hero Implementation
- Usa traducciones de `hero.contact` namespace
- Configuración minimalista
- Sin tabs (`tabs={[]}`)
- Sin background (`showBackground={false}`)
- Sin botones (`primaryButton={null}`, `secondaryButton={null}`)

---

## 🔧 Archivos Involucrados

1. **Componente Hero:** `apps/web-publica/app/[locale]/components/Hero.tsx`
2. **Homepage:** `apps/web-publica/app/[locale]/(marketing)/page.tsx`
3. **Contact Page:** `apps/web-publica/app/[locale]/(marketing)/contact/page.tsx`
4. **Traducciones:**
   - `apps/web-publica/messages/es.json` (sección `hero` y `hero.contact`)
   - `apps/web-publica/messages/en.json` (sección `hero` y `hero.contact`)

---

**Análisis completado.** Listo para recibir feedback y ajustes específicos.
