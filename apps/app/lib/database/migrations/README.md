# Migraciones de Base de Datos - Mejoras Élite

Este directorio contiene migraciones para mejorar la seguridad, performance y escalabilidad de la base de datos.

## Migraciones Incluidas

### 1. `20251220000001_fix_critical_security_issues.sql`
**Fase 1: Seguridad Crítica**

- ✅ Habilita RLS en `oauth_tokens` (tenía políticas pero RLS deshabilitado)
- ✅ Corrige `search_path` en 9 funciones (previene SQL injection)
- ✅ Corrige view `oauth_tokens_info` (security_invoker)

**Impacto:** Elimina vulnerabilidades críticas de seguridad

---

### 2. `20251220000002_optimize_rls_policies.sql`
**Fase 2: Optimización de Políticas RLS**

- ✅ Optimiza 40+ políticas RLS usando `(SELECT auth.uid())`
- ✅ Consolida políticas duplicadas (una por rol/acción)
- ✅ Crea índices en columnas usadas en políticas

**Mejora esperada:** 94-99% según benchmarks oficiales de Supabase

---

### 3. `20251220000003_add_missing_indexes.sql`
**Fase 3: Índices en Foreign Keys**

- ✅ Crea índices en 14 foreign keys sin índice
- ✅ Elimina índices duplicados

**Mejora esperada:** JOINs más rápidos, mejor performance en cascadas

---

### 4. `20251220000004_cleanup_and_maintenance.sql`
**Fase 4: Limpieza y Mantenimiento**

- ✅ Mejora documentación de tablas
- ✅ Documenta tablas legacy para futura decisión
- ✅ Verifica integridad de RLS

**Nota:** Esta migración es opcional y no crítica

---

## Cómo Aplicar las Migraciones

### Opción 1: Usando Supabase CLI (Recomendado)

```bash
# Aplicar todas las migraciones
supabase db push

# O aplicar una por una
supabase migration up
```

### Opción 2: Desde el Dashboard

1. Ve a SQL Editor en el Dashboard
2. Copia y pega el contenido de cada migración
3. Ejecuta en orden (1, 2, 3, 4)

### Opción 3: Usando MCP Server

Las migraciones se pueden aplicar usando el MCP server de Supabase.

---

## Orden de Aplicación

**IMPORTANTE:** Aplica las migraciones en este orden:

1. `20251220000001_fix_critical_security_issues.sql` (URGENTE)
2. `20251220000002_optimize_rls_policies.sql` (ALTA PRIORIDAD)
3. `20251220000003_add_missing_indexes.sql` (MEDIA PRIORIDAD)
4. `20251220000004_cleanup_and_maintenance.sql` (OPCIONAL)

---

## Verificación Post-Migración

Después de aplicar las migraciones, verifica:

1. **RLS habilitado:**
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
     AND tablename = 'oauth_tokens';
   -- Debe retornar rowsecurity = true
   ```

2. **Políticas optimizadas:**
   ```sql
   SELECT policyname, qual
   FROM pg_policies
   WHERE tablename = 'documents'
     AND policyname LIKE '%view%';
   -- Debe usar (SELECT auth.uid()) no auth.uid()
   ```

3. **Índices creados:**
   ```sql
   SELECT indexname
   FROM pg_indexes
   WHERE tablename = 'notifications'
     AND indexname LIKE '%activity_event%';
   -- Debe existir el índice
   ```

---

## Rollback

Cada migración está en una transacción (`BEGIN`/`COMMIT`). Si algo falla, la migración se revierte automáticamente.

Para rollback manual, consulta la documentación de Supabase sobre [rollback de migraciones](https://supabase.com/docs/guides/deployment/branching/troubleshooting#rolling-back-migrations).

---

## Notas Importantes

- ⚠️ **Backup antes de aplicar:** Aunque las migraciones son seguras, siempre haz backup antes de cambios en producción
- ✅ **Testing:** Prueba en local/staging antes de producción
- 📊 **Monitoreo:** Monitorea performance después de aplicar para verificar mejoras
- 🔒 **Seguridad:** Las migraciones de Fase 1 son críticas y deben aplicarse primero

---

## Referencias

- [Supabase RLS Performance Guide](https://supabase.com/docs/guides/database/postgres/row-level-security#rls-performance-recommendations)
- [Supabase Database Advisors](https://supabase.com/docs/guides/database/database-advisors)
- [PostgreSQL Security Best Practices](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

**Última actualización:** Diciembre 2025
**Basado en:** Documentación oficial de Supabase (Diciembre 2025)
