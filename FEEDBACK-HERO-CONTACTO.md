# Feedback: Layout Hero en Página de Contacto

## Análisis Actual

### Homepage (`page.tsx`)
✅ **Tiene Hero completo con:**
- Componente `Hero` importado y utilizado
- Background image (light/dark mode)
- Badge ("Aplicación Web")
- Título grande y centrado
- Descripción
- Botones primario y secundario
- Estructura visual consistente con padding: `pt-10 md:pt-20 pb-14 md:pb-20`

### Página de Contacto (`contact/page.tsx`)
❌ **No tiene Hero:**
- Solo usa `ContactSection`
- Sin background image del hero
- Sin badge
- Sin estructura visual consistente con homepage
- El título está dentro de `ContactSection` pero sin el mismo estilo visual

## Comparación de Estructuras

### Homepage Structure
```tsx
<div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex-1">
    <Hero {...props} />  {/* ✅ Hero completo aquí */}
    <Stats />
    <ProductsCarousel />
    {/* ... otros componentes */}
  </main>
  <Footer />
</div>
```

### Contact Page Structure (Actual)
```tsx
<div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex-1">
    <ContactSection />  {/* ❌ Sin Hero */}
  </main>
  <Footer />
</div>
```

## Problemas Identificados

1. **Falta el componente Hero** en la página de contacto
2. **No hay consistencia visual** entre homepage y contacto
3. **Background diferente**: Homepage usa imagen de fondo, contacto usa gradientes sutiles
4. **Estructura diferente**: Homepage tiene hero arriba, contacto tiene contenido directamente

## Recomendaciones

### Opción 1: Hero + Formulario Separado (Recomendada)
Agregar el componente `Hero` arriba y mantener el formulario debajo, similar a cómo la homepage tiene Hero y luego otras secciones.

**Estructura propuesta:**
```tsx
<Header />
<main>
  <Hero
    badge="Contacto"
    title="Hablemos de tu negocio"
    description="Descubre cómo podemos mejorar tu visibilidad en Google"
    // Sin botones o con botón que scrollea al formulario
  />
  <ContactSection />
</main>
<Footer />
```

### Opción 2: Hero con Formulario Integrado
Crear un Hero personalizado que incluya el formulario dentro, pero esto sería más complejo y menos reutilizable.

## Implementación Recomendada

### Pasos a seguir:

1. **Modificar `contact/page.tsx`** para incluir el Hero:
   ```tsx
   import Hero from '../../components/Hero';
   import ContactSection from '../../components/ContactSection';
   ```

2. **Agregar traducciones** para el Hero de contacto (si no existen ya):
   - `hero.contact.badge`
   - `hero.contact.title`
   - `hero.contact.description`

3. **Ajustar Hero** para que no muestre tabs en la página de contacto (pasar `tabs={[]}`)

4. **Opcional**: Hacer que el botón secundario del Hero scrollee al formulario usando un ancla

### Código sugerido para `contact/page.tsx`:

```tsx
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import ContactSection from '../../components/ContactSection';
import { defaultFooterData } from '../../lib/footer-data';
import { getTranslations } from 'next-intl/server';

export default async function ContactPage() {
  const t = await getTranslations('hero.contact');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero
          badge={t('badge')}
          title={t('title')}
          description={t('description')}
          tabs={[]} // Sin tabs en contacto
          // Opcional: botones que scrollean al formulario
        />
        <ContactSection />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
```

## Cambios Necesarios en Archivos

### 1. `apps/web-publica/app/[locale]/(marketing)/contact/page.tsx`
- ✅ Agregar import de `Hero`
- ✅ Agregar componente `Hero` antes de `ContactSection`
- ✅ Agregar traducciones

### 2. `apps/web-publica/messages/es.json` y `en.json`
- ✅ Agregar sección `hero.contact` con:
  - `badge`: "Contacto"
  - `title`: "Solicita una demo gratuita" (o similar)
  - `description`: Usar la descripción actual de contacto

### 3. Opcional: Ajustar `ContactSection.tsx`
- Puede necesitar ajustes de spacing si el Hero se agrega arriba
- Considerar cambiar el título h1 a h2 si Hero ya tiene h1

## Beneficios de la Implementación

✅ **Consistencia visual** entre todas las páginas
✅ **Mejor UX** con estructura familiar para usuarios
✅ **Reutilización** del componente Hero existente
✅ **Profesionalismo** con diseño unificado

## Consideraciones de Diseño

1. **Background image**: El Hero usará la misma imagen de fondo que la homepage
2. **Altura del Hero**: Puede ser ligeramente más pequeño que en homepage si no hay tabs
3. **Spacing**: Asegurar buen espaciado entre Hero y formulario
4. **Scroll smooth**: Si se agrega botón de scroll al formulario, usar scroll suave

## Notas Adicionales

- El componente `Hero` ya está preparado para recibir `tabs={[]}` y funcionará sin problemas
- El `backgroundImage` del Hero tiene valores por defecto, así que no es necesario pasarlo
- La página de contacto ya usa traducciones (`next-intl`), así que solo hay que agregar las keys nuevas
