# 🔍 ANÁLISIS COMPLETO DEL PROYECTO EXISTENTE
## Para Mantener Consistencia en Sistema de Reserva de Citas

---

## 📁 ESTRUCTURA DEL PROYECTO

### **Monorepo con Workspaces**
```
fascinante-pro-yo-desde-cero-preline/
├── apps/
│   ├── app/              # Dashboard (puerto 3001)
│   └── web-publica/      # Web pública (puerto 3002)
├── node_modules/
├── package.json          # Workspace root
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

---

## 🎨 SISTEMA DE DISEÑO ACTUAL

### **Framework de UI**
- ✅ **Preline UI 3.2.3** - Framework base
- ✅ **Tailwind CSS 4.1.17** - Utilidades de estilo
- ✅ **Dark mode** - Soporte completo (dark: classes)

### **Componentes UI Existentes**

#### Dashboard (`apps/app/components/ui/`)
- ✅ `button.tsx` - Button component con variantes
- ✅ `card.tsx` - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- ✅ `textarea.tsx` - Textarea component
- ✅ `select.tsx` - Select component (probablemente)
- ✅ `slider.tsx` - Slider component

#### Patrón de Componentes
```tsx
// Estructura típica
import { cn } from "@/lib/utils";

export interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "secondary" | ...;
  size?: "sm" | "default" | "lg";
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        className={cn(
          "base-classes",
          variant === "default" && "variant-classes",
          size === "default" && "size-classes",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Component.displayName = "Component";
export { Component };
```

### **Utilidades de Estilo**

#### `apps/app/lib/utils.ts`
```typescript
// Función cn() para combinar clases con tailwind-merge
export function cn(...inputs: (string | undefined | null | false)[]): string {
  // Combina clsx + tailwind-merge
}
```

#### Uso típico:
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)}>
```

---

## 🎯 CONVENCIONES DE ESTILO

### **Colores Principales**
- **Primary**: `blue-600` / `blue-500` (dark mode)
- **Neutral/Gray**: `gray-50`, `gray-100`, `gray-200`, `gray-800`, `gray-900`
- **Dark mode**: `neutral-700`, `neutral-800`, `neutral-900`
- **Borders**: `border-gray-200` / `dark:border-neutral-700`
- **Text**: `text-gray-800` / `dark:text-neutral-200`

### **Espaciado**
- Sidebar width: `280px` (lg: fixed)
- Padding estándar: `p-6`, `p-5`, `p-2`
- Gaps: `gap-5`, `gap-y-1`, `gap-x-3`

### **Bordes y Sombras**
- Borders: `rounded-lg`, `rounded-xl`
- Shadow: `shadow-sm`, `shadow-xl`
- Border radius: `rounded-lg` (default), `rounded-xl` (cards)

### **Tipografía**
- Títulos: `text-2xl font-semibold`
- Subtítulos: `text-sm text-gray-600 dark:text-neutral-400`
- Body: `text-sm text-gray-800 dark:text-neutral-200`

---

## 🏗️ ARQUITECTURA DE COMPONENTES

### **Dashboard Layout**

#### Estructura:
```
apps/app/app/
├── layout.tsx              # Root layout
├── dashboard/
│   ├── page.tsx           # Dashboard principal
│   └── apps/
│       └── text-to-speech/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx    # Navegación lateral (Preline UI)
│   │   ├── Header.tsx     # Header con user menu
│   │   └── Footer.tsx     # Footer
│   ├── dashboard/
│   │   └── *.tsx          # Cards y componentes del dashboard
│   └── ui/
│       └── *.tsx          # Componentes base (button, card, etc.)
└── globals.css            # Estilos globales con Preline
```

#### Sidebar Actual
- ✅ Ya existe con navegación
- ✅ Usa Preline UI accordions
- ✅ Tiene sección de "Apps" al final
- ✅ Link a `/calendar-month` (pendiente pero existe en el menú)

### **Web Pública Layout**

#### Estructura:
```
apps/web-publica/app/
├── [locale]/
│   ├── layout.tsx         # Layout con next-intl
│   ├── (marketing)/
│   ├── audit/
│   ├── components/        # Componentes de marketing
│   └── globals.css
└── components/
    └── crisp/
        └── CrispChat.tsx  # Chat widget
```

---

## 🔧 TECNOLOGÍAS Y DEPENDENCIAS

### **Ya Instaladas**
- ✅ Next.js 15.5.6 (App Router)
- ✅ React 19.2.0
- ✅ TypeScript 5.9.3
- ✅ Tailwind CSS 4.1.17
- ✅ Preline UI 3.2.3
- ✅ Supabase (@supabase/ssr, @supabase/supabase-js)
- ✅ clsx + tailwind-merge
- ✅ next-intl (web pública)
- ✅ Crisp Chat (web pública)

### **Necesitamos Agregar**
- 🆕 FullCalendar (`@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/interaction`)
- 🆕 react-day-picker (web pública)
- 🆕 date-fns + date-fns-tz
- 🆕 react-hook-form + zod + @hookform/resolvers
- 🆕 Stripe (`stripe`, `@stripe/stripe-js`)

---

## 📐 PATRONES DE CÓDIGO

### **Server Components por Defecto**
```tsx
// ✅ PREFERIDO: Server Component
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ⚠️ Solo cuando sea necesario: Client Component
'use client';
export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={...}>Click</button>;
}
```

### **Supabase Client Pattern**
```tsx
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // ... resto del código
}
```

### **Imports**
- ✅ Absolutos con `@/` (configurado en tsconfig.json)
- ✅ `@/utils/supabase/server` para Supabase
- ✅ `@/lib/utils` para utilidades
- ✅ `@/components/...` para componentes

---

## 🎨 CLASES TAILWIND PATRÓN

### **Cards**
```tsx
className="rounded-xl border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm p-6"
```

### **Botones**
```tsx
className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
```

### **Inputs**
```tsx
className="flex w-full rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 px-3 py-2 text-sm text-gray-800 dark:text-neutral-200 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
```

### **Links (Sidebar)**
```tsx
className="flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700"
```

---

## 🚀 PLAN DE INTEGRACIÓN SIN ROMPER NADA

### **✅ Estrategia de Implementación**

#### 1. **Rutas Nuevas (No tocar existentes)**
```
apps/app/app/dashboard/
└── appointments/          # NUEVO - No interfiere
    ├── page.tsx          # Vista de calendario
    ├── calendar/
    ├── settings/
    └── [id]/

apps/web-publica/app/[locale]/
└── book/                  # NUEVO - No interfiere
    ├── page.tsx          # Página de reserva
    └── [token]/          # Gestión de cita
```

#### 2. **Componentes Nuevos (Reutilizando UI existente)**
```
apps/app/app/components/
└── appointments/          # NUEVO
    ├── CalendarView.tsx   # Usa Card de ui/
    ├── AppointmentCard.tsx # Usa Card de ui/
    └── ...

apps/web-publica/app/[locale]/components/
└── booking/               # NUEVO
    ├── CalendarPicker.tsx
    └── ...
```

#### 3. **Sidebar - Agregar Item**
```tsx
// En apps/app/app/components/layout/Sidebar.tsx
// Agregar nuevo item antes de la sección "Apps"
<li className="px-2 lg:px-5">
  <Link
    className="flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 ..."
    href="/dashboard/appointments"
  >
    <svg>...</svg>
    Appointments
  </Link>
</li>
```

#### 4. **Base de Datos - Nuevas Tablas**
- ✅ Crear nuevas tablas (no modificar existentes)
- ✅ Usar migraciones de Supabase
- ✅ No tocar tablas existentes

---

## 📋 CHECKLIST DE CONSISTENCIA

### **UI/UX**
- [x] Usar Preline UI components cuando sea posible
- [x] Reutilizar componentes de `ui/` (Button, Card, etc.)
- [x] Seguir colores establecidos (blue-600, gray-*)
- [x] Dark mode compatible
- [x] Usar `cn()` para clases
- [x] Misma estructura de cards (rounded-xl, shadow-sm, p-6)

### **Código**
- [x] Server Components por defecto
- [x] Client Components solo cuando necesario ('use client')
- [x] Usar `createClient()` de Supabase
- [x] Imports absolutos con `@/`
- [x] TypeScript estricto

### **Estructura**
- [x] No tocar rutas existentes
- [x] No modificar componentes existentes
- [x] Agregar nuevas rutas en lugares lógicos
- [x] Agregar item en Sidebar sin modificar estructura existente

---

## ⚠️ LO QUE NO DEBEMOS HACER

- ❌ NO modificar `globals.css` existente (agregar solo si es necesario)
- ❌ NO cambiar estructura de Sidebar (solo agregar items)
- ❌ NO tocar componentes UI existentes
- ❌ NO modificar rutas existentes
- ❌ NO cambiar configuración de Tailwind (a menos que sea absolutamente necesario)
- ❌ NO modificar tablas de BD existentes

---

## ✅ LO QUE SÍ DEBEMOS HACER

- ✅ Crear nuevas rutas para appointments
- ✅ Crear nuevos componentes reutilizando UI existente
- ✅ Agregar item en Sidebar (sin modificar estructura)
- ✅ Crear nuevas tablas en Supabase
- ✅ Usar mismos patrones de código existentes
- ✅ Mantener consistencia visual (colores, espaciado, tipografía)

---

## 🎯 RESUMEN

### **Entendimiento del Proyecto**
- ✅ Framework: Preline UI + Tailwind CSS 4
- ✅ Componentes UI existentes: Button, Card, Textarea, Select, Slider
- ✅ Utilidades: `cn()` function para clases
- ✅ Patrones: Server Components, Supabase client pattern
- ✅ Estilos: Dark mode, colores establecidos, espaciado consistente

### **Plan de Integración**
- ✅ Rutas nuevas: `/dashboard/appointments` y `/[locale]/book`
- ✅ Componentes nuevos reutilizando UI existente
- ✅ Sidebar: Solo agregar item (no modificar estructura)
- ✅ Base de datos: Nuevas tablas (no modificar existentes)

---

**¿TODO CORRECTO? ¿AVANZAMOS CON LA IMPLEMENTACIÓN MANTENIENDO ESTA CONSISTENCIA?** ✅
