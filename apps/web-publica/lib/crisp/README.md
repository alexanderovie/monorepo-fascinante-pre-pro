# Integración Crisp Chat - Elite Pro

Integración completa y robusta de Crisp Chat para Next.js 15 con App Router, incluyendo:
- **SDK del cliente** (widget en el navegador)
- **REST API** (configuración programática desde el servidor)

## 📋 Tabla de Contenidos

- [Variables de Entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Uso Básico (SDK Cliente)](#uso-básico-sdk-cliente)
- [Uso Avanzado (REST API)](#uso-avanzado-rest-api)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Manejo de Errores](#manejo-de-errores)
- [Troubleshooting](#troubleshooting)

## 🔐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Crisp Chat - Website ID (público, se usa en el cliente)
# Obtén desde: https://app.crisp.chat → Settings → Website Settings
NEXT_PUBLIC_CRISP_WEBSITE_ID=your-website-id-here

# Crisp REST API - Credenciales (privadas, solo servidor)
# Obtén desde: https://marketplace.crisp.chat/ → Tu Plugin → Tokens
CRISP_API_IDENTIFIER=your-api-identifier-here
CRISP_API_KEY=your-api-key-here
CRISP_API_SIGNING_SECRET=your-signing-secret-here
```

### 🔍 Dónde obtener las credenciales

1. **Website ID**:
   - Ve a https://app.crisp.chat
   - Settings → Website Settings
   - Copia el Website ID (formato UUID)

2. **API Credentials**:
   - Ve a https://marketplace.crisp.chat
   - Tu Plugin → Tokens
   - Copia Identifier, Key y Signing Secret
   - ⚠️ **Importante**: Activa el plugin en el Marketplace para que funcionen

## 📦 Instalación

La dependencia ya está instalada en `package.json`:

```json
{
  "dependencies": {
    "crisp-sdk-web": "^1.0.26"
  }
}
```

## 🚀 Uso Básico (SDK Cliente)

### Integración en el Layout

El componente `CrispChat` ya está integrado en `app/[locale]/layout.tsx`:

```typescript
import CrispChat from "@/components/crisp/CrispChat";

export default function RootLayout({ children, params }) {
  const { locale } = await params;

  return (
    <html>
      <body>
        {children}
        <CrispChat
          locale={locale}
          position="right"
          colorTheme="blue"
          hideOnMobile={false}
        />
      </body>
    </html>
  );
}
```

### Personalización del Widget

```typescript
<CrispChat
  locale="es"
  position="left"              // 'left' | 'right'
  colorTheme="blue"            // 'blue' | 'orange' | 'green' | 'red' | 'grey' | 'purple'
  hideOnMobile={true}          // Ocultar en móviles
  lazyLoad={false}            // Cargar inmediatamente o lazy
  userData={{
    email: "usuario@ejemplo.com",
    nickname: "Juan Pérez",
    phone: "+1234567890",
    avatar: "https://ejemplo.com/avatar.jpg",
    company: {
      name: "Mi Empresa",
      url: "https://miempresa.com",
      description: "Descripción de la empresa",
      employment: {
        title: "CEO"
      },
      geolocation: {
        city: "Madrid",
        country: "España"
      }
    }
  }}
  sessionData={{
    user_id: "12345",
    plan: "premium",
    custom_field: "valor personalizado"
  }}
/>
```

## 🔧 Uso Avanzado (REST API)

### ⚠️ Limitaciones de la REST API v1

**IMPORTANTE**: Según la [documentación oficial de Crisp REST API v1](https://docs.crisp.chat/references/rest-api/v1/), la configuración del chatbox (color, posición, textos) **NO está disponible** en la REST API.

La REST API solo permite gestionar:
- ✅ Información del website (GET `/website/{website_id}`)
- ✅ Conversaciones
- ✅ People (perfiles de usuarios)
- ✅ Visitors
- ✅ Sessions
- ❌ **NO** configuración del chatbox

**Para cambiar la configuración del chatbox**, usa el componente `CrispChat.tsx` con props dinámicas.

### Verificar Conexión

```typescript
import { verifyCrispApiSetup } from '@/lib/crisp/api-config';

// En un Server Component o API Route
async function checkConnection() {
  try {
    await verifyCrispApiSetup();
    console.log('✅ API de Crisp configurada correctamente');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}
```

### Obtener Información del Website

```typescript
import { getWebsiteInfo } from '@/lib/crisp/api-config';

async function getWebsite() {
  try {
    const website = await getWebsiteInfo();
    console.log('Website:', website.name);
    console.log('Dominio:', website.domain);
    console.log('Logo:', website.logo);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Configurar Chatbox (Usando el SDK del Cliente)

Como la REST API no soporta configuración del chatbox, usa el componente `CrispChat` con props dinámicas:

```typescript
// En un Server Component
import CrispChat from '@/components/crisp/CrispChat';

export default function Page() {
  // Obtener configuración desde tu base de datos o estado
  const chatboxColor = 'blue'; // desde tu fuente de datos
  const chatboxPosition = 'right';

  return (
    <>
      {/* Tu contenido */}
      <CrispChat
        locale="es"
        colorTheme={chatboxColor}
        position={chatboxPosition}
        hideOnMobile={false}
      />
    </>
  );
}
```

## 💡 Ejemplos Prácticos

### Ejemplo 1: API Route para Verificar Conexión

```typescript
// app/api/crisp/test/route.ts
import { NextResponse } from 'next/server';
import { verifyCrispApiSetup, getWebsiteInfo } from '@/lib/crisp/api-config';

export async function GET() {
  try {
    await verifyCrispApiSetup();
    const website = await getWebsiteInfo();

    return NextResponse.json({
      success: true,
      website: {
        name: website.name,
        domain: website.domain,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

### Ejemplo 2: Configurar Chatbox Dinámicamente (Client Component)

```typescript
// components/DynamicCrispChat.tsx
'use client';

import { useEffect, useState } from 'react';
import CrispChat from '@/components/crisp/CrispChat';

export default function DynamicCrispChat() {
  const [color, setColor] = useState<'blue' | 'grey'>('blue');

  useEffect(() => {
    // Cambiar color según hora del día
    const hour = new Date().getHours();
    setColor(hour >= 6 && hour < 18 ? 'blue' : 'grey');
  }, []);

  return (
    <CrispChat
      locale="es"
      colorTheme={color}
      position="right"
    />
  );
}
```

### Ejemplo 3: Server Component con Configuración desde Base de Datos

```typescript
// app/page.tsx
import CrispChat from '@/components/crisp/CrispChat';
import { getChatboxSettings } from '@/lib/db'; // Tu función de DB

export default async function Page() {
  // Obtener configuración desde tu base de datos
  const settings = await getChatboxSettings();

  return (
    <>
      {/* Tu contenido */}
      <CrispChat
        locale="es"
        colorTheme={settings.color}
        position={settings.position}
        hideOnMobile={settings.hideOnMobile}
      />
    </>
  );
}
```

## ⚠️ Manejo de Errores

### Errores Comunes

#### 1. `Credenciales de API no configuradas`
**Causa**: Faltan variables de entorno `CRISP_API_IDENTIFIER` o `CRISP_API_KEY`

**Solución**: Agrega las variables a `.env.local`

#### 2. `invalid_session` o `authentication token is set but it could not be verified`
**Causa**: El plugin no está activado en el Marketplace de Crisp

**Solución**:
1. Ve a https://marketplace.crisp.chat
2. Tu Plugin → Activar
3. O solicita un Production Token

#### 3. `Website ID no configurado`
**Causa**: Falta `NEXT_PUBLIC_CRISP_WEBSITE_ID` en variables de entorno

**Solución**: Agrega la variable a `.env.local`

#### 4. `not_subscribed` al usar `/website/list`
**Causa**: El website no está en el "plugin sandbox"

**Solución**: Esto es normal. Usa `/website/{website_id}` en su lugar.

### Clase de Error Personalizada

```typescript
import { CrispApiError } from '@/lib/crisp/api-client';

try {
  await updateChatboxConfig({ color: 'blue' });
} catch (error) {
  if (error instanceof CrispApiError) {
    console.error('Error de API:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Reason:', error.reason);
  } else {
    console.error('Error desconocido:', error);
  }
}
```

## 🔍 Troubleshooting

### El widget no aparece

1. Verifica que `NEXT_PUBLIC_CRISP_WEBSITE_ID` esté configurado
2. Revisa la consola del navegador por errores
3. Verifica que el componente `CrispChat` esté en el layout

### La API no funciona

1. Verifica que las credenciales estén completas (no truncadas)
2. Verifica que el plugin esté activado en el Marketplace
3. Prueba con `curl`:
   ```bash
   curl -X GET \
     -u "IDENTIFIER:KEY" \
     -H "X-Crisp-Tier: plugin" \
     -H "Content-Type: application/json" \
     "https://api.crisp.chat/v1/website/YOUR_WEBSITE_ID"
   ```

### Errores de TypeScript

1. Asegúrate de usar los tipos correctos:
   ```typescript
   import type { ChatboxPosition, ChatboxColors } from 'crisp-sdk-web';
   ```

2. No uses strings literales, usa los enums:
   ```typescript
   // ❌ Incorrecto
   position="right"

   // ✅ Correcto
   import { ChatboxPosition } from 'crisp-sdk-web';
   position={ChatboxPosition.Right}
   ```

## 📚 Referencias

- [Documentación Oficial de Crisp](https://docs.crisp.chat/)
- [Crisp REST API v1](https://docs.crisp.chat/references/rest-api/v1/)
- [Crisp SDK Web](https://github.com/crisp-im/crisp-sdk-web)

## 🎯 Características Elite Pro

✅ **TypeScript estricto** - Tipos completos y seguros
✅ **Manejo robusto de errores** - Clases de error personalizadas
✅ **Retry logic** - Reintentos automáticos con exponential backoff
✅ **Validación** - Validación de UUID, credenciales, etc.
✅ **Timeout** - Timeouts de 30 segundos para evitar cuelgues
✅ **Next.js 15 compatible** - Server Components y App Router
✅ **Documentación completa** - JSDoc en todas las funciones
✅ **Sin dependencias obsoletas** - Solo APIs modernas (fetch nativo)
