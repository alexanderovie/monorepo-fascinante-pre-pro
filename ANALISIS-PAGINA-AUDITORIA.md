# Análisis de la Página de Auditoría

**Fecha:** Enero 2025
**Ruta:** `/audit`
**Archivos principales:**
- `app/[locale]/audit/page.tsx`
- `app/[locale]/audit/layout.tsx`
- `app/[locale]/components/AuditFormSection.tsx`

---

## 📋 Resumen Ejecutivo

La página de auditoría es una landing page optimizada para conversión que permite a los usuarios solicitar una auditoría gratuita de visibilidad en Google Business Profile. La implementación sigue las mejores prácticas de Next.js 15 con App Router, Server Components, y un diseño modular y reutilizable.

---

## 🏗️ Estructura y Arquitectura

### 1. **Estructura de Archivos**

```
app/[locale]/audit/
├── page.tsx          # Página principal (Server Component)
├── layout.tsx        # Layout específico con Header/Footer personalizados
└── components/
    └── AuditFormSection.tsx  # Formulario de auditoría (Client Component)
```

### 2. **Componentes Utilizados**

#### **Page Component** (`page.tsx`)
- **Tipo:** Server Component (async)
- **Responsabilidades:**
  - Resolver el preset del Hero para la página de auditoría
  - Renderizar Hero + AuditFormSection
  - Manejo robusto de errores con try-catch y `notFound()`

```12:41:apps/web-publica/app/[locale]/audit/page.tsx
export default async function AuditPage() {
  try {
    const heroData = await resolveHeroPreset('audit');
    const heroProps = resolveToHeroProps(heroData);

    return (
      <>
        <Hero {...heroProps} />
        <AuditFormSection />
      </>
    );
  } catch (error) {
    // Log error en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('Error resolving hero preset for audit page:', error);
    }

    // Si es un error de preset (configuración), mostrar 404
    if (error instanceof HeroPresetError) {
      notFound();
    }

    // Re-lanzar otros errores para que Next.js los maneje
    throw error;
  }
}
```

#### **Layout Component** (`layout.tsx`)
- **Características:**
  - Header personalizado (`HeaderAudit`) - minimalista sin menú principal
  - Footer personalizado con datos específicos (`auditFooterData`)
  - Schema.org Structured Data (JSON-LD) para SEO
  - Sin Banner2 (solo para páginas de marketing)

```21:90:apps/web-publica/app/[locale]/audit/layout.tsx
export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Schema.org Structured Data - Service (Free Visibility Audit - Specific) */}
      {/* Note: JSON-LD can be placed in body, Google will read it */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Free Google Visibility Audit',
            serviceType: 'Free Visibility Audit',
            url: auditUrl,
            provider: {
              '@type': 'ProfessionalService',
              name: 'Fascinante Digital',
              image: {
                '@type': 'ImageObject',
                url: `${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`,
                width: 1200,
                height: 630,
              },
              url: baseUrl,
              telephone: '+1-800-886-4981',
              priceRange: '$$',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '2054 Vista Pkwy #400',
                addressLocality: 'West Palm Beach',
                addressRegion: 'FL',
                postalCode: '33411',
                addressCountry: 'US',
              },
            },
            areaServed: {
              '@type': 'Place',
              name: 'United States',
            },
            offers: {
              '@type': 'Offer',
              url: auditUrl,
              priceCurrency: 'USD',
              price: '0',
              description:
                'Free audit to analyze your Google Business visibility and readiness for ads. Discover how your business appears on Google and what is missing.',
            },
            brand: {
              '@type': 'Brand',
              name: 'Fascinante Digital',
            },
            description:
              'Get a free Google Business Profile visibility audit. Discover how your business appears on Google, identify missing information, and understand your readiness to attract real customers without paid ads.',
          }),
        }}
      />
      <div className="flex flex-col min-h-screen">
        <HeaderAudit />
        <main className="flex-1">
          {children}
        </main>
        <Footer data={auditFooterData} />
      </div>
    </>
  );
}
```

#### **AuditFormSection Component**
- **Tipo:** Client Component (`'use client'`)
- **Características:**
  - Formulario simplificado con un solo campo: `businessName`
  - Usa componentes reutilizables: `FormInput`, `FormButton`, `FormContainer`, `FormCard`
  - Estado local para `isSubmitting`
  - Manejo de envío simulado (TODO: integrar con API)

```24:82:apps/web-publica/app/[locale]/components/AuditFormSection.tsx
export default function AuditFormSection() {
  const t = useTranslations('audit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (en producción, esto iría a un API endpoint)
    // TODO: Procesar businessName con Google Places API para obtener detalles del negocio
    // const formData = new FormData(e.currentTarget);
    // const businessName = formData.get('businessName');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    // Aquí podrías agregar lógica para mostrar mensaje de éxito
  };

  return (
    <section className="relative pt-0 pb-16 md:pb-24 lg:pt-16 lg:pb-32">
      <FormContainer layout="centered" formClassName="space-y-5">
        <form onSubmit={handleSubmit} className="w-full">
          <FormCard variant="compact">
            {/* Nombre del negocio - Campo único simplificado */}
            <FormInput
              id="businessName"
              name="businessName"
              type="text"
              label={t('form.businessName')}
              placeholder="Mi Negocio S.L."
              required
              autoComplete="organization"
            />

            {/* Botón de envío */}
            <div className="flex w-full flex-col justify-end space-y-3 pt-2">
              <FormButton
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                loadingText={t('form.submitting')}
                className="w-full"
              >
                {t('form.submit')}
              </FormButton>
              <div className="text-xs text-gray-500 dark:text-neutral-500">
                {t('form.privacy')}{' '}
                <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-neutral-300">
                  {t('form.privacyLink')}
                </Link>
                {t('form.privacyNote')}
              </div>
            </div>
          </FormCard>
        </form>
      </FormContainer>
    </section>
  );
}
```

---

## 🎨 Componentes de UI Reutilizables

### **Sistema de Formularios**

La página utiliza un sistema de componentes de formulario bien estructurado:

1. **FormInput** - Input reutilizable con:
   - Estilos consistentes (Tailwind CSS)
   - Soporte para errores y helper text
   - Accesibilidad (labels asociados, aria-*)
   - Preparado para extensión futura con autocompletado

2. **FormButton** - Botón con:
   - Variantes: `primary`, `secondary`, `outline`
   - Estado de carga (`isLoading`)
   - Spinner animado durante carga

3. **FormContainer** - Container con layouts:
   - `centered`: Para formularios simples (Audit)
   - `two-column`: Para formularios con beneficios (Contact)

4. **FormCard** - Card contenedor:
   - Variante `default`: Para formularios normales
   - Variante `compact`: Para formularios simples (1-2 campos)

---

## 🌐 Internacionalización (i18n)

### **Traducciones Disponibles**

La página soporta múltiples idiomas mediante `next-intl`:

**Español (`es.json`):**
```json
"audit": {
  "title": "Obtén tu auditoría gratuita",
  "description": "Antes de gastar en anuncios, descubre si tu negocio está listo para atraer clientes reales. Recibe una auditoría gratuita basada en datos reales de Google Business Profile que muestra cómo apareces y qué necesitas para mejorar.",
  "form": {
    "businessName": "Nombre del negocio",
    "submit": "Obtener auditoría gratuita",
    "submitting": "Enviando...",
    "privacy": "Al enviar este formulario, aceptas nuestra",
    "privacyLink": "política de privacidad",
    "privacyNote": ". Tu información está segura y no será compartida."
  }
}
```

**Inglés (`en.json`):**
```json
"audit": {
  "title": "Get Your Free Audit",
  "description": "Before spending on ads, find out if your business is ready to attract real customers. Fascinante Digital offers you a free audit that shows how you appear on Google and what's missing.",
  "form": {
    "businessName": "Business name",
    "submit": "Get free audit",
    "submitting": "Submitting...",
    "privacy": "By submitting this form, you agree to our",
    "privacyLink": "privacy policy",
    "privacyNote": ". Your information is safe and will not be shared."
  }
}
```

---

## 🔍 SEO y Metadata

### **Schema.org Structured Data**

El layout incluye JSON-LD para mejorar el SEO:

- **Tipo:** `Service`
- **Servicio:** "Free Google Visibility Audit"
- **Provider:** Fascinante Digital (con datos completos de contacto)
- **Offer:** Precio $0 (gratis)
- **Area Served:** United States

### **Hero Preset**

El Hero usa el preset `audit`:

```45:58:apps/web-publica/app/[locale]/lib/hero-presets/config.ts
  audit: {
    id: 'audit',
    badge: { key: 'badge', namespace: 'hero' },
    title: {
      key: 'title',
      namespace: 'hero',
      format: 'simple',
    },
    description: { key: 'description', namespace: 'hero' },
    tabs: 'none',
    background: false,
    buttons: null,
    downloadSection: false,
  },
```

**Características:**
- Sin background image
- Sin tabs
- Sin botones (solo el formulario)
- Título y descripción desde traducciones

### **⚠️ Falta Metadata Dinámica**

**Problema:** La página no tiene `generateMetadata()` para metadata dinámica (title, description, Open Graph, etc.)

**Impacto:**
- No hay control sobre el `<title>` y `<meta description>` por idioma
- No hay Open Graph tags para compartir en redes sociales
- No hay Twitter Cards

---

## 🎯 Header Personalizado

### **HeaderAudit Component**

Header minimalista específico para la página de auditoría:

```15:93:apps/web-publica/app/[locale]/components/HeaderAudit.tsx
export default function HeaderAudit() {
  // URLs dinámicas basadas en subdominio (cacheadas con useMemo)
  const urls = useMemo(() => ({
    login: getUrl('login'),
    getDemo: getUrl('demo'),
  }), []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
        <nav className="max-w-6xl basis-full w-full py-4 px-4 sm:px-6 lg:px-8 lg:mx-auto">
          <div className="flex items-center justify-between gap-x-4 w-full">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
                aria-label={BRAND.name}
              >
                <Image
                  className="w-[134px] h-auto dark:invert"
                  src={ASSETS.logo}
                  alt={`${BRAND.name} Logo`}
                  width={134}
                  height={38}
                  priority
                />
              </Link>
            </div>

            {/* Button Group */}
            <div className="flex items-center gap-x-2">
              <Link
                href={urls.getDemo}
                className="py-2 px-3 hidden sm:flex items-center gap-x-1.5 text-sm whitespace-nowrap text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                Get a demo
              </Link>

              <Link
                href={urls.login}
                className="py-2 px-3 flex items-center gap-x-1.5 whitespace-nowrap text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                Log in
              </Link>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="py-2 px-3 inline-flex items-center gap-x-1.5 whitespace-nowrap text-sm rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:shadow-none focus:outline-hidden focus:bg-blue-700 focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Solicitar llamada
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Modal para solicitar llamada */}
      <RequestCallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
```

**Características:**
- Sticky header (se mantiene al hacer scroll)
- Sin menú de navegación principal (enfoque en conversión)
- Botones: "Get a demo", "Log in", "Solicitar llamada" (modal)
- Modal `RequestCallModal` para solicitar llamada

**⚠️ Problema de Internacionalización:**
- Textos hardcodeados en español/inglés ("Get a demo", "Log in", "Solicitar llamada")
- Debería usar `useTranslations()` para textos dinámicos

---

## ✅ Puntos Fuertes

1. **Arquitectura Moderna**
   - Next.js 15 con App Router
   - Server Components donde es posible
   - Client Components solo cuando es necesario (formulario)

2. **Componentes Reutilizables**
   - Sistema de formularios bien estructurado
   - Fácil de mantener y extender
   - Type-safe con TypeScript

3. **SEO Básico**
   - Schema.org Structured Data (JSON-LD)
   - Datos estructurados completos

4. **Manejo de Errores**
   - Try-catch robusto en la página
   - Manejo de errores de preset con `notFound()`
   - Logging en desarrollo

5. **Diseño Responsive**
   - Tailwind CSS con breakpoints
   - Clases específicas para móviles (`max-[480px]:`)

6. **Internacionalización**
   - Soporte multiidioma con `next-intl`
   - Traducciones completas para español e inglés

---

## ⚠️ Áreas de Mejora

### 1. **Falta Metadata Dinámica**

**Problema:** No hay `generateMetadata()` en `page.tsx`

**Solución:**
```typescript
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'audit' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
}
```

### 2. **Formulario Sin Validación**

**Problema:** El formulario no tiene validación del lado del cliente

**Solución:**
- Integrar `react-hook-form` con `zod` (ya está en dependencias)
- Validar `businessName` (mínimo caracteres, formato, etc.)

### 3. **Sin Integración con API**

**Problema:** El formulario solo simula el envío

**Solución:**
- Crear API route: `app/api/audit/route.ts`
- Procesar el formulario
- Integrar con Google Places API (como menciona el TODO)
- Enviar email de confirmación

### 4. **Header Sin Internacionalización**

**Problema:** Textos hardcodeados en `HeaderAudit`

**Solución:**
```typescript
const t = useTranslations('header');
// Usar t('getDemo'), t('login'), t('requestCall')
```

### 5. **Modal Sin Funcionalidad**

**Problema:** `RequestCallModal` no tiene lógica de envío

**Solución:**
- Integrar con API
- Validación de formulario
- Mensaje de éxito/error

### 6. **Sin Mensaje de Confirmación**

**Problema:** Después de enviar el formulario, no hay feedback visual

**Solución:**
- Mostrar toast o mensaje de éxito
- Redirigir a página de confirmación
- Mostrar mensaje inline

### 7. **Sin Analytics/Tracking**

**Problema:** No hay tracking de conversiones

**Solución:**
- Integrar Google Analytics 4
- Eventos personalizados para envío de formulario
- Tracking de conversiones

### 8. **Schema.org Podría Mejorar**

**Problema:** El Schema.org está hardcodeado en inglés

**Solución:**
- Hacer dinámico según el locale
- Usar traducciones para description

---

## 🚀 Recomendaciones Prioritarias

### **Prioridad Alta**

1. ✅ **Agregar `generateMetadata()`** - Mejora SEO y compartir en redes sociales
2. ✅ **Validación del formulario** - Mejora UX y reduce errores
3. ✅ **Integración con API** - Funcionalidad real del formulario
4. ✅ **Mensaje de confirmación** - Feedback al usuario

### **Prioridad Media**

5. ✅ **Internacionalizar HeaderAudit** - Consistencia con el resto de la app
6. ✅ **Integrar Google Places API** - Autocompletado de nombre de negocio
7. ✅ **Analytics/Tracking** - Medir conversiones

### **Prioridad Baja**

8. ✅ **Mejorar Schema.org dinámico** - SEO más preciso
9. ✅ **A/B Testing** - Optimizar conversión
10. ✅ **Loading states mejorados** - UX más pulida

---

## 📊 Métricas Sugeridas

Para medir el éxito de la página:

1. **Conversión:** % de visitantes que completan el formulario
2. **Tasa de rebote:** % de usuarios que salen sin interactuar
3. **Tiempo en página:** Tiempo promedio antes de enviar
4. **Errores de validación:** Número de intentos fallidos
5. **Fuentes de tráfico:** De dónde vienen los usuarios

---

## 🔗 Archivos Relacionados

- `app/[locale]/audit/page.tsx` - Página principal
- `app/[locale]/audit/layout.tsx` - Layout específico
- `app/[locale]/components/AuditFormSection.tsx` - Formulario
- `app/[locale]/components/HeaderAudit.tsx` - Header personalizado
- `app/[locale]/components/RequestCallModal.tsx` - Modal de llamada
- `app/[locale]/lib/audit-footer-data.tsx` - Datos del footer
- `app/[locale]/lib/hero-presets/config.ts` - Configuración del Hero
- `messages/es.json` y `messages/en.json` - Traducciones

---

## 📝 Conclusión

La página de auditoría está bien estructurada y sigue las mejores prácticas de Next.js 15. La arquitectura es modular y reutilizable, lo que facilita el mantenimiento. Sin embargo, necesita mejoras en:

- **Funcionalidad:** Integración real con API
- **UX:** Validación y feedback al usuario
- **SEO:** Metadata dinámica
- **Internacionalización:** Textos hardcodeados en Header

Con estas mejoras, la página estará lista para producción y optimizada para conversión.
