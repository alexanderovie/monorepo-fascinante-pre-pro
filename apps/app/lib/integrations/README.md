# Google Business Profile Integration

## Resumen

Este módulo maneja la integración OAuth 2.0 con Google Business Profile APIs, incluyendo:

- ✅ Flujo OAuth completo (autorización, callback, intercambio de tokens)
- ✅ Almacenamiento seguro de tokens en Supabase
- ✅ Renovación automática de access tokens usando refresh tokens
- ✅ Cliente API para hacer consultas a Google Business Profile

## Estructura de Archivos

```
lib/integrations/
├── gbp-oauth.ts          # Utilidades OAuth (generar URL, intercambiar código, refrescar tokens)
├── gbp-tokens.ts         # Almacenamiento y recuperación de tokens desde Supabase
├── gbp-api-client.ts    # Cliente API para hacer consultas (renovación automática)
└── gbp-redirect-uri.ts   # Utilidades para manejar redirect URIs dinámicos
```

## Flujo OAuth

1. **Usuario hace clic en "Connect"** → `/api/integrations/google-business-profile/connect`
2. **Redirige a Google** → Usuario autoriza la aplicación
3. **Google redirige de vuelta** → `/api/integrations/google-business-profile/callback`
4. **Intercambia código por tokens** → Guarda `access_token` y `refresh_token` en Supabase
5. **Redirige al usuario** → `/account/integrations?success=true`

## Almacenamiento de Tokens

### ÉLITE: Encriptación AES-256

Los tokens se guardan en la tabla `user_integrations` de Supabase **encriptados usando AES-256**:

```sql
CREATE TABLE user_integrations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  integration_id TEXT, -- 'google-business-profile'
  access_token TEXT,    -- Encriptado con AES-256 (pgcrypto)
  refresh_token TEXT,   -- Encriptado con AES-256 (pgcrypto)
  expires_at TIMESTAMPTZ,
  token_type TEXT,
  scope TEXT,
  UNIQUE(user_id, integration_id)
);
```

### Características de Seguridad Implementadas

✅ **Encriptación AES-256 a nivel de base de datos** usando `pgcrypto`
✅ **Validación de formato** antes de encriptar
✅ **Desencriptación automática** al recuperar tokens
✅ **Rotación automática** de access tokens cuando expiran
✅ **Logging seguro** (sin exponer valores sensibles)
✅ **Manejo robusto de errores** con mensajes descriptivos

### Funciones de Base de Datos

La migración crea dos funciones seguras en PostgreSQL:

- `encrypt_oauth_token(token, encryption_key)` - Encripta tokens usando AES-256
- `decrypt_oauth_token(encrypted_token, encryption_key)` - Desencripta tokens

Estas funciones se ejecutan con `SECURITY DEFINER` para máxima seguridad.

## Uso del Refresh Token

### Obtener un Access Token Válido

```typescript
import { getValidAccessToken } from '@/lib/integrations/gbp-api-client'

// Obtiene un access token válido (renueva automáticamente si está expirado)
const accessToken = await getValidAccessToken(userId)
```

### Hacer Consultas a la API

```typescript
import { getGBPAccounts, getGBPLocations, getGBPLocationMetrics } from '@/lib/integrations/gbp-api-client'

// Obtener todas las cuentas
const accounts = await getGBPAccounts(userId)

// Obtener ubicaciones de una cuenta
const locations = await getGBPLocations(userId, 'accounts/123456789')

// Obtener métricas de una ubicación
const metrics = await getGBPLocationMetrics(
  userId,
  'locations/987654321',
  '2025-01-01',
  '2025-01-31'
)
```

### Hacer Consultas Personalizadas

```typescript
import { makeGBPRequest } from '@/lib/integrations/gbp-api-client'

// Hacer una petición personalizada
const response = await makeGBPRequest(
  userId,
  'accounts/123456789/locations',
  {
    method: 'GET',
  }
)

const data = await response.json()
```

## Ejemplo: Endpoint API

```typescript
// app/api/integrations/google-business-profile/accounts/route.ts
import { getGBPAccounts } from '@/lib/integrations/gbp-api-client'

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser() // Tu función de autenticación

  try {
    const accounts = await getGBPAccounts(user.id)
    return NextResponse.json({ success: true, data: accounts })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

## Renovación Automática de Tokens

El cliente API (`gbp-api-client.ts`) maneja automáticamente la renovación de tokens:

1. **Verifica si el token está expirado** usando `isTokenExpired()`
2. **Si está expirado**, usa `refreshAccessToken()` con el `refresh_token`
3. **Actualiza los tokens en Supabase** con el nuevo `access_token` y `expires_at`
4. **Retorna el nuevo access token** para usar en la consulta

## Variables de Entorno Requeridas

```env
# Google Business Profile OAuth
GOOGLE_BUSINESS_PROFILE_CLIENT_ID=tu_client_id
GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=tu_client_secret
GOOGLE_BUSINESS_PROFILE_REDIRECT_URI=http://localhost:3001/api/integrations/google-business-profile/callback

# ÉLITE: Clave de encriptación para tokens OAuth (AES-256)
# Debe ser de al menos 32 caracteres (256 bits)
# Generar con: openssl rand -base64 32
OAUTH_TOKEN_ENCRYPTION_KEY=tu_clave_de_encriptacion_de_32_caracteres_minimo
```

### Generar Clave de Encriptación

Para generar una clave segura de 32 caracteres:

```bash
openssl rand -base64 32
```

O usando Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**⚠️ IMPORTANTE:**
- Esta clave debe mantenerse secreta y nunca commitearse al repositorio
- Usa diferentes claves para desarrollo, staging y producción
- Rota la clave periódicamente (cada 90 días recomendado)

## Próximos Pasos

- [ ] Encriptar tokens antes de guardarlos en producción
- [ ] Implementar manejo de errores más robusto
- [ ] Agregar rate limiting para evitar exceder cuotas de API
- [ ] Implementar cache para reducir llamadas a la API
- [ ] Agregar webhooks para sincronización automática

## Referencias

- [Google Business Profile API Documentation](https://developers.google.com/my-business/content/overview)
- [OAuth 2.0 for Google APIs](https://developers.google.com/identity/protocols/oauth2)
- [Refresh Token Best Practices](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
