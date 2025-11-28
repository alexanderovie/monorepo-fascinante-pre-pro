-- Google Business Profile - Audit Log Tables Migration
--
-- ÉLITE PRO: Tablas para audit log y notificaciones
-- Según estándares de la industria (Event Sourcing pattern)
--
-- Políticas de Google:
-- - Transparencia: Notificar cambios en 48 horas
-- - Audit trail completo para cumplimiento
--
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla de eventos de actividad (audit log)
CREATE TABLE IF NOT EXISTS activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id VARCHAR NOT NULL,
  account_id VARCHAR NOT NULL,
  action VARCHAR NOT NULL CHECK (action IN (
    'location_edit',
    'location_create',
    'location_delete',
    'admin_add',
    'admin_remove',
    'hours_update',
    'category_update',
    'attribute_update',
    'verification_initiated',
    'verification_completed'
  )),
  changes JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notified BOOLEAN NOT NULL DEFAULT FALSE,
  notification_sent_at TIMESTAMPTZ,

  -- Índices para búsquedas eficientes
  CONSTRAINT activity_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_activity_events_user_id ON activity_events(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_location_id ON activity_events(location_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_account_id ON activity_events(account_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_timestamp ON activity_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_action ON activity_events(action);
CREATE INDEX IF NOT EXISTS idx_activity_events_notified ON activity_events(notified) WHERE notified = FALSE;

-- 2. Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id VARCHAR,
  activity_event_id UUID REFERENCES activity_events(id) ON DELETE SET NULL,
  type VARCHAR NOT NULL CHECK (type IN (
    'activity_change',
    'verification_required',
    'admin_added',
    'admin_removed',
    'location_deleted',
    'system_alert'
  )),
  message TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para notificaciones
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_location_id ON notifications(location_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for) WHERE sent = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_sent ON notifications(sent);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read) WHERE read = FALSE;

-- 3. Tabla de preferencias de notificación
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type VARCHAR NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  channel VARCHAR NOT NULL CHECK (channel IN ('email', 'in_app', 'both')) DEFAULT 'both',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, notification_type),
  CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para preferencias
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- 4. RLS (Row Level Security) Policies
-- ÉLITE: Solo el usuario puede ver sus propios eventos y notificaciones

-- Activity Events
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity events"
  ON activity_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity events"
  ON activity_events FOR INSERT
  WITH CHECK (true); -- Se valida en la aplicación

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true); -- Se valida en la aplicación

-- Notification Preferences
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notification preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);

-- 5. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notification_preferences
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Comentarios para documentación
COMMENT ON TABLE activity_events IS 'Audit log de todas las actividades realizadas en ubicaciones GBP';
COMMENT ON TABLE notifications IS 'Notificaciones programadas y enviadas a usuarios sobre cambios';
COMMENT ON TABLE notification_preferences IS 'Preferencias de notificación por usuario';

COMMENT ON COLUMN activity_events.changes IS 'JSON con cambios realizados: {campo: {old: valor_anterior, new: valor_nuevo}}';
COMMENT ON COLUMN activity_events.metadata IS 'Metadata adicional: IP, user agent, source, etc.';
COMMENT ON COLUMN notifications.scheduled_for IS 'Fecha programada para enviar notificación (48 horas después del cambio según política de Google)';
