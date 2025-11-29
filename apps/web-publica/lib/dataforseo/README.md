# DataForSEO Integration

Integración robusta de DataForSEO API para obtener información de Google My Business.

## Configuración

### Variables de Entorno

Agrega las siguientes variables a tu `.env.local`:

```bash
# DataForSEO API Credentials
DATAFORSEO_USERNAME=tu_username
DATAFORSEO_PASSWORD=tu_password
```

### Obtener Credenciales

1. Crea una cuenta en [DataForSEO](https://dataforseo.com/)
2. Ve a tu dashboard y obtén tus credenciales de API
3. Agrega las variables de entorno a `.env.local`

## Uso

### Obtener información de Google My Business por place_id

```typescript
import { getGoogleMyBusinessInfo } from '@/lib/dataforseo';

const businessInfo = await getGoogleMyBusinessInfo({
  placeId: 'ChIJw_XSxKcywWgRbf-RlX2O0YE',
  locationCode: 2840, // US
  languageCode: 'en',
});

console.log(businessInfo);
// {
//   placeId: 'ChIJw_XSxKcywWgRbf-RlX2O0YE',
//   name: 'Fascinante Digital',
//   address: '2054 Vista Pkwy # 400, West Palm Beach, FL 33411',
//   phone: '(800) 886-4981',
//   website: 'https://fascinantedigital.com/',
//   rating: 4.8,
//   reviewsCount: 150,
//   categories: ['Digital Marketing Agency'],
//   ...
// }
```

### Manejo de Errores

El servicio incluye manejo robusto de errores con reintentos automáticos:

```typescript
import { getGoogleMyBusinessInfo, DataForSEOError } from '@/lib/dataforseo';

try {
  const businessInfo = await getGoogleMyBusinessInfo({
    placeId: 'ChIJw_XSxKcywWgRbf-RlX2O0YE',
  });
} catch (error) {
  if (error instanceof DataForSEOError) {
    if (error.isRetryable) {
      // Error recuperable (rate limit, server error)
      console.log('Error recuperable, se reintentará automáticamente');
    } else {
      // Error no recuperable (credenciales inválidas, saldo insuficiente)
      console.error('Error no recuperable:', error.message);
    }
  }
}
```

## Arquitectura

### Estructura de Archivos

```
lib/dataforseo/
├── client.ts          # Cliente autenticado
├── errors.ts          # Manejo de errores
├── retry.ts           # Estrategia de reintentos
├── services/
│   └── business-data.ts  # Servicio de Business Data
└── index.ts           # Exports públicos
```

### Características

- ✅ **Autenticación Basic Auth** - Segura y estándar
- ✅ **Retry Strategy** - Reintentos automáticos con exponential backoff
- ✅ **Error Handling** - Manejo robusto de errores HTTP e internos
- ✅ **TypeScript** - Tipado completo
- ✅ **Rate Limiting** - Manejo automático de rate limits

## API Reference

### `getGoogleMyBusinessInfo(options)`

Obtiene información de Google My Business usando `place_id`.

**Parámetros:**
- `options.placeId` (requerido): place_id de Google Places
- `options.locationCode` (opcional): Código de ubicación (default: 2840 para US)
- `options.languageCode` (opcional): Código de idioma (default: "en")

**Retorna:** `Promise<GoogleMyBusinessInfoResult>`

### `getGoogleMyBusinessInfoByName(businessName, locationCode, languageCode)`

Obtiene información de Google My Business usando nombre del negocio (fallback).

**Parámetros:**
- `businessName` (requerido): Nombre del negocio
- `locationCode` (opcional): Código de ubicación (default: 2840)
- `languageCode` (opcional): Código de idioma (default: "en")

**Retorna:** `Promise<GoogleMyBusinessInfoResult | null>`

## Códigos de Error

### HTTP Status Codes

- `401` - Credenciales inválidas
- `402` - Saldo insuficiente
- `404` - Endpoint no encontrado
- `429` - Rate limit excedido (recuperable)
- `500` - Error interno del servidor (recuperable)

### Internal Error Codes

- `20000` - OK
- `20100` - Tarea creada
- `40000` - Múltiples tareas (error)
- `40202` - Rate limit excedido (recuperable)
- `50000` - Error interno (recuperable)

## Testing

Para probar la integración:

1. Asegúrate de tener las variables de entorno configuradas
2. Usa un `place_id` válido de Google Places
3. Verifica los logs en desarrollo para debugging

## Notas

- Los reintentos automáticos solo se aplican a errores recuperables (rate limits, errores 5xx)
- Los errores de autenticación y saldo no se reintentan
- El servicio usa exponential backoff con jitter para evitar thundering herd
