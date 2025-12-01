-- ============================================
-- MIGRACIÓN: Fase 3 - Índices en Foreign Keys
-- ============================================
-- Fecha: 2025-12-20
-- Descripción: Crea índices en foreign keys faltantes y elimina duplicados
--
-- Cambios:
-- 1. Crea índices en 14 foreign keys sin índice
-- 2. Elimina índices duplicados
--
-- Mejora esperada: JOINs más rápidos, mejor performance en cascadas
-- Basado en: Supabase Database Advisor Lint 0001
-- ============================================

BEGIN;

-- ============================================
-- 1. ÍNDICES EN FOREIGN KEYS: Tablas Legacy
-- ============================================
-- Nota: Estas tablas legacy pueden eliminarse en el futuro
-- pero mientras existan, necesitan índices para performance

-- Chat.userId -> User.id
CREATE INDEX IF NOT EXISTS idx_chat_user_id_fk
ON public."Chat"(userId)
WHERE userId IS NOT NULL;

-- Document.chatId -> Chat.id
CREATE INDEX IF NOT EXISTS idx_document_chat_id_fk
ON public."Document"(chatId)
WHERE chatId IS NOT NULL;

-- Document.userId -> User.id
CREATE INDEX IF NOT EXISTS idx_document_user_id_fk
ON public."Document"(userId)
WHERE userId IS NOT NULL;

-- Message.chatId -> Chat.id
CREATE INDEX IF NOT EXISTS idx_message_chat_id_fk
ON public."Message"(chatId)
WHERE chatId IS NOT NULL;

-- Stream.chatId -> Chat.id
CREATE INDEX IF NOT EXISTS idx_stream_chat_id_fk
ON public."Stream"(chatId)
WHERE chatId IS NOT NULL;

-- Stream.messageId -> Message.id
CREATE INDEX IF NOT EXISTS idx_stream_message_id_fk
ON public."Stream"(messageId)
WHERE messageId IS NOT NULL;

-- Suggestion.chatId -> Chat.id
CREATE INDEX IF NOT EXISTS idx_suggestion_chat_id_fk
ON public."Suggestion"(chatId)
WHERE chatId IS NOT NULL;

-- Suggestion.messageId -> Message.id
CREATE INDEX IF NOT EXISTS idx_suggestion_message_id_fk
ON public."Suggestion"(messageId)
WHERE messageId IS NOT NULL;

-- Vote.messageId -> Message.id
CREATE INDEX IF NOT EXISTS idx_vote_message_id_fk
ON public."Vote"(messageId)
WHERE messageId IS NOT NULL;

-- Vote.userId -> User.id
CREATE INDEX IF NOT EXISTS idx_vote_user_id_fk
ON public."Vote"(userId)
WHERE userId IS NOT NULL;

-- ============================================
-- 2. ÍNDICES EN FOREIGN KEYS: Tablas Activas
-- ============================================

-- notifications.activity_event_id -> activity_events.id
CREATE INDEX IF NOT EXISTS idx_notifications_activity_event_id_fk
ON public.notifications(activity_event_id)
WHERE activity_event_id IS NOT NULL;

-- suggestions.chat_id -> chats.id
CREATE INDEX IF NOT EXISTS idx_suggestions_chat_id_fk
ON public.suggestions(chat_id)
WHERE chat_id IS NOT NULL;

-- suggestions.message_id -> messages.id
CREATE INDEX IF NOT EXISTS idx_suggestions_message_id_fk
ON public.suggestions(message_id)
WHERE message_id IS NOT NULL;

-- waitlist.service_id -> services.id
CREATE INDEX IF NOT EXISTS idx_waitlist_service_id_fk
ON public.waitlist(service_id)
WHERE service_id IS NOT NULL;

-- ============================================
-- 3. ELIMINAR ÍNDICES DUPLICADOS
-- ============================================

-- availability_settings tiene 2 índices idénticos
-- Eliminar el constraint-based index (mantener el named index)
DROP INDEX IF EXISTS public.availability_settings_professional_id_key;

-- Verificar que el otro índice existe
CREATE INDEX IF NOT EXISTS idx_availability_settings_professional
ON public.availability_settings(professional_id)
WHERE professional_id IS NOT NULL;

-- ============================================
-- 4. COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================

COMMENT ON INDEX idx_chat_user_id_fk IS
'Índice en foreign key para mejorar JOINs. Tabla legacy.';

COMMENT ON INDEX idx_notifications_activity_event_id_fk IS
'Índice en foreign key para mejorar JOINs con activity_events.';

COMMENT ON INDEX idx_suggestions_chat_id_fk IS
'Índice en foreign key para mejorar JOINs con chats.';

COMMENT ON INDEX idx_waitlist_service_id_fk IS
'Índice en foreign key para mejorar JOINs con services.';

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
-- Después de aplicar esta migración:
-- 1. Monitorea el uso de los índices (pg_stat_user_indexes)
-- 2. Verifica que los JOINs son más rápidos
-- 3. Considera eliminar tablas legacy si no se usan
-- ============================================

COMMIT;
