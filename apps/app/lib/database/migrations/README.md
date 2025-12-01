# Migraciones de Base de Datos - Solución Élite Pro

Este directorio contiene migraciones para una solución escalable y pragmática.

## Migraciones Incluidas

### Migraciones de Seguridad y Optimización (Fases 1-4)
- `20251220000001_fix_critical_security_issues.sql` - Seguridad crítica
- `20251220000002_optimize_rls_policies.sql` - Optimización RLS
- `20251220000003_add_missing_indexes.sql` - Índices en foreign keys
- `20251220000004_cleanup_and_maintenance.sql` - Limpieza y documentación

### Migraciones Pragmáticas (Fases 5-7)
- `20251220000005_install_pg_cron_and_jobs.sql` - **pg_cron + jobs automáticos**
- `20251220000006_cleanup_unused_indexes.sql` - **Limpieza de 100+ índices no usados**
- `20251220000007_consolidate_duplicate_policies.sql` - **Consolidación de políticas duplicadas**

## Edge Functions

- `supabase/functions/process-notification/` - **Procesa notificaciones con Redis rate limiting**

## Orden de Aplicación

1. ✅ Fases 1-4 (ya aplicadas)
2. **Fase 5**: Instalar pg_cron y jobs
3. **Fase 6**: Limpiar índices no usados
4. **Fase 7**: Consolidar políticas duplicadas
5. **Edge Function**: Desplegar `process-notification`

## Configuración Requerida

### 1. Variables de DB para pg_cron

```sql
ALTER DATABASE postgres SET app.settings.edge_function_url = 'https://your-project.supabase.co/functions/v1';
ALTER DATABASE postgres SET app.settings.service_role_key = 'your-service-role-key';
```

### 2. Secrets de Edge Function

En Supabase Dashboard > Edge Functions > Secrets:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Desplegar Edge Function

```bash
supabase functions deploy process-notification
```

## Verificación

### Verificar pg_cron jobs

```sql
SELECT * FROM cron.job;
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### Verificar índices eliminados

```sql
SELECT * FROM public.identify_unused_indexes();
```

### Verificar políticas consolidadas

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('appointments', 'availability_settings', 'services')
ORDER BY tablename, policyname;
```

## Resultados Esperados

- ✅ **pg_cron**: Procesa notificaciones cada 5 minutos automáticamente
- ✅ **Índices**: ~100 índices eliminados, mejor performance
- ✅ **Políticas**: 3 políticas duplicadas consolidadas, mejor performance
- ✅ **Edge Function**: Notificaciones procesadas con rate limiting

---

**Última actualización:** Diciembre 2025
**Enfoque:** Pragmático y escalable
