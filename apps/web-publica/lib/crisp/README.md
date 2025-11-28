# Integración Crisp Chat - Documentación

## Configuración

### Variables de Entorno

Agrega la siguiente variable de entorno en tu archivo `.env.local`:

```bash
NEXT_PUBLIC_CRISP_WEBSITE_ID=tu-website-id-aqui
```

**Cómo obtener tu Website ID:**
1. Inicia sesión en [Crisp App](https://app.crisp.chat)
2. Ve a Settings → Website Settings
3. Copia el **Website ID** (formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Uso Básico

El componente `CrispChat` ya está integrado en el layout principal. Solo necesitas configurar la variable de entorno.

### Uso Avanzado

Si necesitas personalizar el comportamiento del widget, puedes modificar el componente en `app/[locale]/layout.tsx`:

```tsx
<CrispChat
  position="right"           // 'left' | 'right'
  colorTheme="blue"          // Ver tipos disponibles en CrispChat.tsx
  hideOnMobile={false}       // Ocultar en móviles
  lazyLoad={false}           // Carga diferida
  userData={{                // Enriquecer datos de usuario
    email: "user@example.com",
    nickname: "John Doe"
  }}
  sessionData={{            // Datos de sesión personalizados
    user_id: "123456",
    plan: "pro"
  }}
/>
```

## Características Implementadas

✅ Integración con `crisp-sdk-web` (NPM Package oficial)
✅ Configuración mediante variables de entorno
✅ Sincronización automática con `next-intl` (es/en)
✅ TypeScript con tipos completos
✅ Optimizaciones de rendimiento (preconnect, dns-prefetch)
✅ Documentación JSDoc completa
✅ Sin dependencia del dashboard de Crisp (configuración 100% programática)

## Referencias

- [Documentación oficial de Crisp - NPM Package](https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/npm/)
- [Métodos disponibles de $crisp](https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/crisp-methods/)
