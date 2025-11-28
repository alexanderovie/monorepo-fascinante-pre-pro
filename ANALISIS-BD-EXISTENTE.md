# 🔍 ANÁLISIS DE BASE DE DATOS EXISTENTE
## Para Evitar Duplicación de Tablas

---

## 📊 TABLAS EXISTENTES EN SUPABASE

### **Tablas Relevantes para Sistema de Citas:**

1. **`notifications`** ✅
   - Ya existe para notificaciones del sistema (GBP)
   - Campos: `user_id`, `type`, `message`, `scheduled_for`, `sent`, `read`
   - **Decisión**: Podríamos extender `type` para incluir tipos de citas

2. **`notification_preferences`** ✅
   - Ya existe para preferencias de notificación
   - Campos: `user_id`, `notification_type`, `enabled`, `channel`
   - **Decisión**: Podemos extender `notification_type` para incluir tipos de citas

3. **`activity_events`** ✅
   - Ya existe para audit log de actividades GBP
   - Campos: `user_id`, `action`, `changes`, `metadata`, `timestamp`
   - **Decisión**: Es específico para GBP, crear `automation_logs` separado para citas

4. **`subscriptions`** ✅
   - Ya existe para suscripciones de Stripe
   - Campos: `user_id`, `stripe_subscription_id`, `plan_name`, `status`
   - **Decisión**: No confundir con pagos de citas individuales

5. **`profiles`** ✅
   - Ya existe para perfiles de usuario
   - Tiene `user_id` que podemos usar como referencia

---

## 🎯 PLAN AJUSTADO: TABLAS PARA CITAS

### **Tablas que NO EXISTEN (Crear nuevas):**

1. ✅ **`appointments`** - Principal, no existe
2. ✅ **`availability_settings`** - No existe
3. ✅ **`blocked_dates`** - No existe
4. ✅ **`waitlist`** - No existe
5. ✅ **`services`** - No existe (tipos de consultoría)
6. ✅ **`payments`** - No existe (pagos de citas individuales, diferente de subscriptions)

### **Tablas que PODEMOS REUTILIZAR/EXTENDER:**

1. 🔄 **`notifications`** - Extender tipo para incluir notificaciones de citas
2. 🔄 **`notification_preferences`** - Extender para preferencias de citas

### **Tabla que CREAREMOS (similar pero diferente):**

1. ✅ **`appointment_automation_logs`** - Logs específicos de automatizaciones de citas
   - Similar a `activity_events` pero específico para citas
   - Diferente propósito: tracking de automatizaciones (emails, SMS, etc.)

---

## 📋 DECISIÓN FINAL

### **Estrategia:**

1. **Crear tablas nuevas** para:
   - `appointments` - Citas principales
   - `availability_settings` - Configuración de disponibilidad
   - `blocked_dates` - Días bloqueados
   - `waitlist` - Lista de espera
   - `services` - Tipos de consultoría
   - `payments` - Pagos de citas (diferente de subscriptions)
   - `appointment_automation_logs` - Logs de automatizaciones

2. **Extender tablas existentes** para:
   - `notifications` - Agregar tipos de notificación de citas al enum
   - `notification_preferences` - Agregar tipos de preferencias de citas

---

## ✅ TABLAS QUE CREAREMOS (Nuevas)

### **1. `appointments`**
- No existe, crear nueva
- Tabla principal de citas

### **2. `availability_settings`**
- No existe, crear nueva
- Configuración de horarios

### **3. `blocked_dates`**
- No existe, crear nueva
- Días bloqueados/feriados

### **4. `waitlist`**
- No existe, crear nueva
- Lista de espera

### **5. `services`**
- No existe, crear nueva
- Tipos de consultoría/auditoría

### **6. `payments`**
- No existe, crear nueva
- Pagos de citas individuales (diferente de `subscriptions`)

### **7. `appointment_automation_logs`**
- No existe, crear nueva
- Logs de automatizaciones (emails, SMS enviados)

---

## 🔄 TABLAS QUE EXTENDEREMOS (Existentes)

### **1. `notifications`**
```sql
-- Agregar tipos de notificación de citas al enum existente
-- O usar CHECK constraint con más tipos
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    -- Tipos existentes de GBP
    'activity_change',
    'verification_required',
    'admin_added',
    'admin_removed',
    'location_deleted',
    'system_alert',
    -- Nuevos tipos de citas
    'appointment_confirmation',
    'appointment_reminder_24h',
    'appointment_reminder_2h',
    'appointment_cancellation',
    'appointment_rescheduled'
  ));
```

### **2. `notification_preferences`**
```sql
-- Extender notification_type para incluir tipos de citas
-- No necesitamos modificar la estructura, solo usar nuevos valores
-- en el campo notification_type
```

---

## 📝 RESUMEN

### ✅ **Crear nuevas (7 tablas):**
1. `appointments`
2. `availability_settings`
3. `blocked_dates`
4. `waitlist`
5. `services`
6. `payments`
7. `appointment_automation_logs`

### 🔄 **Extender existentes (2 tablas):**
1. `notifications` - Agregar tipos de citas
2. `notification_preferences` - Usar nuevos tipos

### ❌ **NO duplicar:**
- No crear nueva tabla de notificaciones (usar la existente)
- No crear nueva tabla de preferencias (usar la existente)
- No crear nueva tabla de audit log general (crear específica para citas)

---

**¿Todo correcto? ¿Avanzamos con esta estrategia?**
