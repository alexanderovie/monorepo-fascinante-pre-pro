# Componentes UI Disponibles - Web Pública

## 📋 Resumen

Lista completa de componentes UI reutilizables disponibles en `apps/web-publica` que podemos usar para construir la página `/book` estilo Cal.com.

---

## 🎨 Componentes de Formulario (Form Components)

### 1. **FormInput** (`app/[locale]/components/forms/FormInput.tsx`)
Input reutilizable con estilos consistentes de Preline UI.

**Uso:**
```tsx
import FormInput from '@/app/[locale]/components/forms/FormInput';

<FormInput
  id="email"
  name="email"
  type="email"
  label="Email"
  placeholder="nombre@empresa.com"
  required
  error="Error message"
  helperText="Helper text"
/>
```

**Props:**
- `label: string` - Etiqueta del campo
- `error?: string` - Mensaje de error
- `helperText?: string` - Texto de ayuda
- Todas las props nativas de `<input>`

**Estilos:**
- Bordes redondeados (`rounded-lg`)
- Focus states con azul (`focus:border-blue-500`)
- Dark mode completo
- Estados disabled y error

---

### 2. **FormButton** (`app/[locale]/components/forms/FormButton.tsx`)
Botón reutilizable con estados de carga.

**Uso:**
```tsx
import FormButton from '@/app/[locale]/components/forms/FormButton';

<FormButton
  type="submit"
  variant="primary"
  isLoading={isSubmitting}
  loadingText="Guardando..."
>
  Enviar
</FormButton>
```

**Variantes:**
- `primary` - Azul (`bg-blue-600`)
- `secondary` - Gris (`bg-gray-600`)
- `outline` - Borde con fondo blanco

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline'`
- `isLoading?: boolean`
- `loadingText?: string`

---

### 3. **FormSelect** (`app/[locale]/components/forms/FormSelect.tsx`)
Select dropdown reutilizable.

**Uso:**
```tsx
import FormSelect from '@/app/[locale]/components/forms/FormSelect';

<FormSelect
  id="timezone"
  name="timezone"
  label="Zona horaria"
  options={[
    { value: 'america/new_york', label: 'America/New York' },
    { value: 'america/los_angeles', label: 'America/Los Angeles' },
  ]}
  required
/>
```

**Props:**
- `label: string`
- `options: FormSelectOption[]`
- `error?: string`
- `helperText?: string`

---

## 🎴 Componentes UI Base

### 4. **Card** (`components/ui/card.tsx`)
Contenedor tipo card con sombras y bordes.

**Uso:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido aquí
  </CardContent>
</Card>
```

**Componentes:**
- `Card` - Contenedor principal
- `CardHeader` - Header con padding
- `CardTitle` - Título del card
- `CardDescription` - Descripción
- `CardContent` - Contenido principal
- `CardFooter` - Footer

**Estilos:**
- `rounded-xl`
- `shadow-sm`
- Borde gris claro
- Dark mode completo

---

### 5. **Button** (`components/ui/button.tsx`)
Botón base con variantes usando class-variance-authority.

**Uso:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Click me
</Button>
```

**Variantes:**
- `default` - Primary
- `destructive` - Rojo (para acciones peligrosas)
- `outline` - Con borde
- `secondary` - Secundario
- `ghost` - Sin fondo
- `link` - Estilo link

**Tamaños:**
- `default` - h-9
- `sm` - h-8
- `lg` - h-10
- `icon` - Cuadrado

---

## 🔧 Utilidades

### 6. **cn()** (`lib/utils.ts`)
Función helper para combinar clases de Tailwind.

**Uso:**
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // prop opcional
)}>
```

---

## 🎯 Componentes Preline UI Disponibles

Basado en el código, estos son los componentes de Preline que se están usando:

### Dropdowns (`hs-dropdown`)
```tsx
<div className="hs-dropdown [--strategy:static] relative">
  <button className="hs-dropdown-toggle">Toggle</button>
  <div className="hs-dropdown-menu">Menu items</div>
</div>
```

### Collapse/Accordion (`hs-collapse`)
```tsx
<button
  className="hs-collapse-toggle"
  data-hs-collapse="#target"
>
  Toggle
</button>
<div id="target" className="hs-collapse hidden">
  Content
</div>
```

### Tabs (`hs-tab`)
```tsx
<div className="hs-tabs">
  <button className="hs-tab-active:bg-gray-200" data-hs-tab="#tab1">Tab 1</button>
  <div id="tab1" className="hs-tab-content">Content</div>
</div>
```

### Scroll Navigation (`hs-scroll-nav`)
```tsx
<div data-hs-scroll-nav>
  <div className="hs-scroll-nav-body">
    {/* Tabs that scroll */}
  </div>
</div>
```

---

## 📐 Estilos Base Disponibles

### Colores
- **Primary**: `blue-600`, `blue-700` (hover)
- **Gray**: `gray-50` (bg), `gray-200` (borders), `gray-800` (text)
- **Dark mode**: `neutral-800` (bg), `neutral-700` (borders), `neutral-200` (text)

### Bordes y Sombras
- **Rounded**: `rounded-lg`, `rounded-xl`, `rounded-full`
- **Shadow**: `shadow-sm`, `shadow-lg`, `shadow-2xs`
- **Borders**: `border`, `border-gray-200`, `border-transparent`

### Estados
- **Hover**: `hover:bg-gray-50`, `hover:bg-blue-700`
- **Focus**: `focus:ring-2`, `focus:ring-blue-500`
- **Disabled**: `disabled:opacity-50`, `disabled:pointer-events-none`

---

## 🎨 Patrones de Diseño Usados

### Inputs/Texareas
```tsx
className="block w-full rounded-lg border border-gray-200 px-3 py-2
  sm:text-sm focus:border-blue-500 focus:ring-blue-500
  disabled:pointer-events-none disabled:opacity-50
  dark:border-neutral-700 dark:bg-neutral-900
  dark:text-neutral-200 dark:placeholder-neutral-500
  dark:focus:ring-neutral-600"
```

### Botones
```tsx
className="inline-flex items-center justify-center gap-x-2
  rounded-lg border px-4 py-2.5 text-sm font-semibold
  focus:outline-hidden disabled:pointer-events-none
  disabled:opacity-50 transition-colors"
```

### Cards/Containers
```tsx
className="rounded-xl border border-gray-200 bg-white
  dark:bg-neutral-800 dark:border-neutral-700 shadow-sm"
```

---

## 📦 Para la Página `/book`

### Componentes Recomendados:

1. **FormInput** - Para nombre, email, teléfono
2. **FormSelect** - Para timezone, duración
3. **FormButton** - Para botones de acción
4. **Card** - Para agrupar secciones
5. **Button** (de `components/ui`) - Para horarios disponibles

### Estilos a Mantener:

- **Background**: `bg-gray-50 dark:bg-neutral-900` (página)
- **Card**: `bg-white dark:bg-neutral-800` con `rounded-xl shadow-lg`
- **Bordes**: `border-gray-200 dark:border-neutral-700`
- **Textos**: `text-gray-800 dark:text-neutral-200`

---

## ✅ Checklist para Implementar

- [ ] Usar `FormInput` para campos de texto
- [ ] Usar `FormSelect` para dropdowns
- [ ] Usar `FormButton` o `Button` para acciones
- [ ] Mantener consistencia de colores (blue-600 para primary)
- [ ] Dark mode en todos los componentes
- [ ] Estados disabled/hover/focus consistentes
- [ ] Bordes redondeados (`rounded-lg` o `rounded-xl`)
- [ ] Sombras sutiles (`shadow-sm` o `shadow-lg`)

---

**¿Necesitas más información sobre algún componente específico?**
