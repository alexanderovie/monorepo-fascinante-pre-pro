This is a [Next.js](https://nextjs.org) project with [Preline UI](https://preline.co) and [Tailwind CSS v4](https://tailwindcss.com).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+ (instalado globalmente)

### Installation

```bash
# Instalar dependencias
pnpm install
```

### Development

```bash
# Iniciar servidor de desarrollo
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Estructura del Proyecto

```
app/
├── about/              # Página About
├── customers/         # Página Customers
├── customer-details/  # Página Customer Details
├── features/         # Página Features
├── pricing/           # Página Pricing
├── components/        # Componentes Preline
├── globals.css        # Tailwind + Preline CSS
├── layout.tsx         # Layout principal
└── page.tsx           # Homepage
```

## 🎨 Tecnologías

- **Next.js 15.2.1** - Framework React
- **Tailwind CSS v4.1.17** - Estilos utility-first
- **Preline UI v3.2.3** - Componentes UI
- **TypeScript** - Tipado estático
- **pnpm** - Gestor de paquetes (monorepo ready)

## 📚 Documentación

- [Next.js Documentation](https://nextjs.org/docs)
- [Preline UI Documentation](https://preline.co/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)

## 🏗️ Monorepo Ready

Este proyecto está configurado para escalar a un monorepo:

- `pnpm-workspace.yaml` - Configurado para `apps/*` y `packages/*`
- Estructura preparada para mover a `apps/web-publica/`
- Listo para agregar `apps/dashboard/`

Ver `ESTRUCTURA.md` para más detalles.

## 🚀 Deploy

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
pnpm build
```
