# Edge Function: Process Notification

Procesa notificaciones programadas con rate limiting usando Redis.

## Configuración

### Secrets en Supabase Dashboard

1. Ve a **Edge Functions > Secrets**
2. Configura los siguientes secrets:

```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
RESEND_API_KEY=re_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Variables de Configuración en DB

Ejecuta en SQL Editor:

```sql
-- Configurar URL de Edge Function
ALTER DATABASE postgres SET app.settings.edge_function_url = 'https://your-project.supabase.co/functions/v1';

-- Configurar Service Role Key (solo para pg_cron)
ALTER DATABASE postgres SET app.settings.service_role_key = 'your-service-role-key';
```

## Rate Limiting

- **Límite**: 10 notificaciones por minuto por usuario
- **Ventana**: 60 segundos
- **Storage**: Redis (Upstash)

## Uso

Esta función es invocada automáticamente por el cron job `process_scheduled_notifications` cada 5 minutos.

## Testing Manual

```bash
curl -X POST https://your-project.supabase.co/functions/v1/process-notification \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_id": "uuid-here",
    "user_id": "uuid-here",
    "notification_type": "activity_change"
  }'
```
