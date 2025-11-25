# Estructura del Proyecto - Monorepo Preline Pro

## 📁 Estructura Actual

```
fascinante-pro-yo-desde-cero-preline/
├── app/                          # Next.js App Router (Startup Template)
│   ├── about/                    # Página About
│   │   └── page.tsx
│   ├── components/               # Componentes compartidos
│   │   ├── PrelineScript.tsx
│   │   ├── PrelineScriptWrapper.tsx
│   │   └── ThemeScript.tsx
│   ├── customers/                # Página Customers
│   │   └── page.tsx
│   ├── customer-details/         # Página Customer Details
│   │   └── page.tsx
│   ├── features/                 # Página Features
│   │   └── page.tsx
│   ├── pricing/                  # Página Pricing
│   │   └── page.tsx
│   ├── globals.css               # Estilos globales (Tailwind + Preline)
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Homepage
├── public/
│   └── assets/                   # Assets de la plantilla startup
├── global.d.ts                     # Type definitions Preline
├── postcss.config.mjs            # Config PostCSS (Tailwind v4)
└── package.json
```

## 🎯 Páginas Convertidas (Startup Template)

✅ **Todas las páginas de la plantilla startup están convertidas:**

1. **Homepage** (`/`) - `app/page.tsx`
2. **About** (`/about`) - `app/about/page.tsx`
3. **Features** (`/features`) - `app/features/page.tsx`
4. **Pricing** (`/pricing`) - `app/pricing/page.tsx`
5. **Customers** (`/customers`) - `app/customers/page.tsx`
6. **Customer Details** (`/customer-details`) - `app/customer-details/page.tsx`

## 🚀 Próximos Pasos para Monorepo

### Estructura Futura del Monorepo:

```
fascinante-pro-monorepo/
├── apps/
│   ├── web-publica/              # App actual (Startup Template)
│   │   ├── app/
│   │   │   ├── about/
│   │   │   ├── features/
│   │   │   ├── pricing/
│   │   │   └── ...
│   │   └── package.json
│   └── dashboard/                # Nueva app (Dashboard Template)
│       ├── app/
│       └── package.json
├── packages/                      # Paquetes compartidos (opcional)
│   └── shared-components/
└── package.json                  # Root package.json
```

## 📦 Tecnologías Configuradas

- ✅ **Next.js 15.2.1** - Framework React
- ✅ **Tailwind CSS v4.1.17** - Estilos utility-first
- ✅ **Preline UI v3.2.3** - Componentes UI
- ✅ **TypeScript** - Tipado estático
- ✅ **PostCSS** - Procesamiento CSS
- ✅ **pnpm v10.19.0** - Gestor de paquetes (monorepo ready)

## 🔧 Configuración Actual

### Tailwind CSS v4
- Configurado según documentación oficial
- Usa `@import "tailwindcss"` en `globals.css`
- PostCSS con `@tailwindcss/postcss`

### Preline UI
- Configurado según documentación oficial para Next.js
- JavaScript cargado dinámicamente (SSR disabled)
- TypeScript types definidos en `global.d.ts`

## ✅ Estado: Listo para Escalar

- ✅ Todas las páginas de startup convertidas
- ✅ Enlaces corregidos (rutas Next.js)
- ✅ Estructura preparada para monorepo
- ✅ Configuración según documentación oficial
- ✅ Migrado a **pnpm** (listo para monorepo)

## 📦 Comandos pnpm

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build
pnpm build

# Iniciar producción
pnpm start

# Lint
pnpm lint
```

## 🔧 Configuración pnpm

- `pnpm-workspace.yaml` - Configurado para monorepo (`apps/*`, `packages/*`)
- `.npmrc` - Configuración de pnpm (shamefully-hoist, auto-install-peers)

## 📝 Notas

- Los assets están en `public/assets/`
- Cada página usa `dangerouslySetInnerHTML` para renderizar el HTML original
- Los scripts de Preline se inicializan automáticamente
- El tema dark/light se maneja con `ThemeScript`
