# Rate Limiting y Activity Logging - Documentación

## Resumen

Implementación élite pro de rate limiting y activity logging para Google Business Profile API según estándares de la industria.

## Características Implementadas

### 1. Rate Limiting (10 ediciones/min por perfil)

**Patrón:** Token Bucket Algorithm (RFC 2697)

**Archivo:** `lib/integrations/gbp-rate-limiter.ts`

**Características:**
- ✅ Token Bucket Algorithm (estándar industria)
- ✅ 10 tokens por ubicación (regeneran 1 por minuto)
- ✅ In-memory para desarrollo (escalable a Redis)
- ✅ Auto-limpieza de buckets inactivos
- ✅ Thread-safe

**Uso:**

```typescript
import { canEditLocation, getEditWaitTime, getRateLimitStatus } from '@/lib/integrations/gbp-rate-limiter'

// Verificar si se puede editar
const canEdit = await canEditLocation('locationId123')

// Obtener tiempo de espera
const waitTime = getEditWaitTime('locationId123') // milisegundos

// Obtener estado completo
const status = getRateLimitStatus('locationId123')
// { tokensAvailable: 5, maxTokens: 10, waitTimeMs: 0, canEdit: true }
```

### 2. Activity Logging (Audit Trail)

**Patrón:** Event Sourcing

**Archivo:** `lib/gbp/activity-logger.ts`

**Características:**
- ✅ Registro completo de cambios
- ✅ Notificaciones automáticas (48 horas según política Google)
- ✅ Audit trail para cumplimiento
- ✅ Type-safe

**Uso:**

```typescript
import { createActivityLogger } from '@/lib/gbp/activity-logger'

const logger = createActivityLogger(cookieStore)

await logger.logActivity({
  userId: 'user123',
  locationId: 'location123',
  accountId: 'account123',
  action: 'location_edit',
  changes: {
    title: { old: 'Old Name', new: 'New Name' },
    phoneNumbers: { old: '+1234567890', new: '+0987654321' }
  },
  metadata: {
    source: 'ui',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...'
  }
})

// Obtener historial
const history = await logger.getActivityHistory('location123', 50)
```

### 3. Location Editor (Wrapper Integrado)

**Patrón:** Facade Pattern

**Archivo:** `lib/integrations/gbp-location-editor.ts`

**Características:**
- ✅ Integra rate limiting automático
- ✅ Integra activity logging automático
- ✅ No modifica código existente (wrapper)
- ✅ Manejo robusto de errores

**Uso:**

```typescript
import { LocationEditor } from '@/lib/integrations/gbp-location-editor'

// Editar ubicación con rate limiting y logging automáticos
const result = await LocationEditor.updateLocation({
  locationId: 'location123',
  accountId: 'account123',
  updateMask: 'title,phoneNumbers',
  locationData: {
    title: 'New Business Name',
    phoneNumbers: {
      primaryPhone: '+1234567890'
    }
  },
  userId: 'user123',
  cookieStore: cookieStore,
  metadata: {
    source: 'ui',
    ipAddress: request.headers.get('x-forwarded-for')
  }
})

// result.location - Ubicación actualizada
// result.rateLimitStatus - Estado del rate limiter
// result.activityEventId - ID del evento registrado
```

## Migración de Base de Datos

**Archivo:** `lib/gbp/migrations/create-audit-log-tables.sql`

**Ejecutar en Supabase SQL Editor:**

1. Copiar contenido de `create-audit-log-tables.sql`
2. Ejecutar en Supabase SQL Editor
3. Verificar que las tablas se crearon correctamente

**Tablas creadas:**
- `activity_events` - Log de todas las actividades
- `notifications` - Notificaciones programadas
- `notification_preferences` - Preferencias de usuario

## Integración con Código Existente

### ✅ No Invasivo

- **No modifica** métodos existentes del cliente GBP
- **Agrega** nuevos métodos (PATCH, updateLocation)
- **Wrapper pattern** - Envuelve funcionalidad existente
- **Opcional** - Se puede usar o no según necesidad

### Migración Gradual

**Opción 1: Usar LocationEditor (Recomendado)**
```typescript
// Nuevo código - con rate limiting y logging
await LocationEditor.updateLocation({ ... })
```

**Opción 2: Usar Cliente Directo (Sin rate limiting)**
```typescript
// Código existente - sigue funcionando
const client = await createGBPClient(userId)
await client.updateLocation(locationId, updateMask, data)
```

## Escalabilidad

### Desarrollo (Actual)
- Rate limiter: In-memory (Map)
- Activity log: Supabase (PostgreSQL)

### Producción (Futuro)
- Rate limiter: Redis/Upstash (fácil migración)
- Activity log: Supabase (ya escalable)

## Cumplimiento con Políticas de Google

✅ **Rate Limiting:** 10 ediciones/min por perfil (implementado)
✅ **Transparencia:** Notificaciones en 48 horas (implementado)
✅ **Audit Trail:** Registro completo de cambios (implementado)

## Próximos Pasos

1. ✅ Rate Limiting - **COMPLETADO**
2. ✅ Activity Logging - **COMPLETADO**
3. ⏳ Ejecutar migración SQL en Supabase
4. ⏳ Crear endpoint API para editar ubicaciones
5. ⏳ Migrar a Redis para producción (opcional)
