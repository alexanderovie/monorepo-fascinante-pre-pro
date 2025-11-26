# Configuración de Autenticación con Supabase

Esta aplicación usa **Supabase Auth** con `@supabase/ssr` para autenticación server-side en Next.js 15.

## Requisitos Previos

1. Una cuenta en [Supabase](https://supabase.com)
2. Un proyecto de Supabase creado

## Configuración

### 1. Obtener Credenciales de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Settings** → **API**
3. Copia los siguientes valores:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz de `apps/app/`:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

**IMPORTANTE:** Nunca commitees el archivo `.env.local` al repositorio.

### 3. Configurar URLs de Redirección en Supabase

En tu proyecto de Supabase:

1. Ve a **Authentication** → **URL Configuration**
2. Agrega las siguientes URLs a **Redirect URLs**:
   - `http://localhost:3000/auth/confirm` (desarrollo)
   - `https://tu-dominio.com/auth/confirm` (producción)

### 4. Configurar Email Templates (Opcional)

Supabase envía emails de confirmación automáticamente. Puedes personalizarlos en:
**Authentication** → **Email Templates**

## Estructura de Archivos

```
apps/app/
├── utils/
│   └── supabase/
│       ├── client.ts      # Cliente para Client Components
│       ├── server.ts       # Cliente para Server Components
│       └── middleware.ts    # Lógica de middleware
├── middleware.ts           # Middleware de Next.js
├── app/
│   ├── login/
│   │   ├── page.tsx       # Página de login
│   │   └── actions.ts     # Server Actions para login/signup
│   ├── auth/
│   │   ├── confirm/
│   │   │   └── route.ts   # Callback para verificación de email
│   │   ├── signout/
│   │   │   └── route.ts   # Ruta para cerrar sesión
│   │   └── confirm-email/
│   │       └── page.tsx  # Página de confirmación
│   └── error/
│       └── page.tsx       # Página de errores
└── components/
    └── auth/
        └── SignOutButton.tsx  # Componente de sign out
```

## Uso

### Proteger Rutas

Para proteger una ruta, verifica el usuario en el Server Component:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Contenido protegido</div>
}
```

### Obtener Usuario en Client Components

```tsx
'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  return <div>{user?.email}</div>
}
```

## Documentación Oficial

- [Supabase Auth con Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [@supabase/ssr](https://supabase.com/docs/reference/javascript/auth-helpers/nextjs)

## Notas Importantes

1. **Siempre usa `getUser()` en el servidor**, nunca `getSession()`, ya que `getUser()` valida el token con el servidor de Auth.

2. **El middleware es crítico**: Refresca automáticamente los tokens de sesión en cada request.

3. **Variables de entorno**: Las variables `NEXT_PUBLIC_*` son accesibles en el cliente. No uses variables sensibles con este prefijo.

