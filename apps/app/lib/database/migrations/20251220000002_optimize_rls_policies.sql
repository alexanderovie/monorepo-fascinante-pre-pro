-- ============================================
-- MIGRACIÓN: Fase 2 - Optimización de Políticas RLS
-- ============================================
-- Fecha: 2025-12-20
-- Descripción: Optimiza 40+ políticas RLS para mejor performance
--
-- Cambios:
-- 1. Reemplaza auth.uid() por (SELECT auth.uid()) en todas las políticas
-- 2. Consolida políticas duplicadas (una por rol/acción)
-- 3. Agrega índices en columnas usadas en políticas
--
-- Mejora esperada: 94-99% según benchmarks oficiales de Supabase
-- Basado en: Supabase RLS Performance Guide (Diciembre 2025)
-- ============================================

BEGIN;

-- ============================================
-- 1. OPTIMIZAR POLÍTICAS: activity_events
-- ============================================

DROP POLICY IF EXISTS "Users can view their own activity events" ON public.activity_events;

CREATE POLICY "Users can view their own activity events"
ON public.activity_events
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_activity_events_user_id_optimized
ON public.activity_events(user_id)
WHERE user_id IS NOT NULL;

-- ============================================
-- 2. OPTIMIZAR POLÍTICAS: appointment_automation_logs
-- ============================================

DROP POLICY IF EXISTS "Users can view automation logs for their appointments" ON public.appointment_automation_logs;

CREATE POLICY "Users can view automation logs for their appointments"
ON public.appointment_automation_logs
FOR SELECT
TO authenticated
USING (
  appointment_id IS NULL
  OR EXISTS (
    SELECT 1
    FROM public.appointments
    WHERE appointments.id = appointment_automation_logs.appointment_id
      AND appointments.professional_id = (SELECT auth.uid())
  )
);

-- ============================================
-- 3. OPTIMIZAR POLÍTICAS: appointments
-- ============================================
-- Consolidar políticas duplicadas en una sola por rol/acción

-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Users can manage their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own appointments as professional" ON public.appointments;

-- Política consolidada para authenticated
CREATE POLICY "Authenticated users can manage their appointments"
ON public.appointments
FOR ALL
TO authenticated
USING ((SELECT auth.uid()) = professional_id)
WITH CHECK ((SELECT auth.uid()) = professional_id);

-- Las políticas públicas se mantienen (ya están optimizadas en migración anterior)

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id_optimized
ON public.appointments(professional_id)
WHERE professional_id IS NOT NULL;

-- ============================================
-- 4. OPTIMIZAR POLÍTICAS: availability_settings
-- ============================================
-- Consolidar políticas duplicadas

DROP POLICY IF EXISTS "Users can manage their own availability" ON public.availability_settings;

CREATE POLICY "Authenticated users can manage their availability"
ON public.availability_settings
FOR ALL
TO authenticated
USING ((SELECT auth.uid()) = professional_id)
WITH CHECK ((SELECT auth.uid()) = professional_id);

-- Las políticas públicas se mantienen (ya están optimizadas)

-- ============================================
-- 5. OPTIMIZAR POLÍTICAS: blocked_dates
-- ============================================

DROP POLICY IF EXISTS "Users can manage their own blocked dates" ON public.blocked_dates;

CREATE POLICY "Authenticated users can manage their blocked dates"
ON public.blocked_dates
FOR ALL
TO authenticated
USING ((SELECT auth.uid()) = professional_id)
WITH CHECK ((SELECT auth.uid()) = professional_id);

-- Las políticas públicas se mantienen

-- ============================================
-- 6. OPTIMIZAR POLÍTICAS: chats
-- ============================================

DROP POLICY IF EXISTS "Users can view own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can create chats" ON public.chats;
DROP POLICY IF EXISTS "Users can update own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can delete own chats" ON public.chats;

-- Política consolidada para SELECT
CREATE POLICY "Users can view their chats"
ON public.chats
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR visibility = 'public'
);

-- Política para INSERT
CREATE POLICY "Users can create chats"
ON public.chats
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- Política para UPDATE
CREATE POLICY "Users can update their chats"
ON public.chats
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- Política para DELETE
CREATE POLICY "Users can delete their chats"
ON public.chats
FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id_optimized
ON public.chats(user_id)
WHERE user_id IS NOT NULL;

-- ============================================
-- 7. OPTIMIZAR POLÍTICAS: documents
-- ============================================

DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can create documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;

CREATE POLICY "Users can view their documents"
ON public.documents
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their documents"
ON public.documents
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their documents"
ON public.documents
FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id_optimized
ON public.documents(user_id)
WHERE user_id IS NOT NULL;

-- ============================================
-- 8. OPTIMIZAR POLÍTICAS: messages
-- ============================================

DROP POLICY IF EXISTS "Users can view messages from their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages in their chats" ON public.messages;

CREATE POLICY "Users can view messages from their chats"
ON public.messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.chats
    WHERE chats.id = messages.chat_id
      AND (
        chats.user_id = (SELECT auth.uid())
        OR chats.visibility = 'public'
      )
  )
);

CREATE POLICY "Users can create messages in their chats"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.chats
    WHERE chats.id = messages.chat_id
      AND chats.user_id = (SELECT auth.uid())
  )
);

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_messages_chat_id_optimized
ON public.messages(chat_id)
WHERE chat_id IS NOT NULL;

-- ============================================
-- 9. OPTIMIZAR POLÍTICAS: notification_preferences
-- ============================================

DROP POLICY IF EXISTS "Users can manage their own notification preferences" ON public.notification_preferences;

CREATE POLICY "Users can manage their notification preferences"
ON public.notification_preferences
FOR ALL
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id_optimized
ON public.notification_preferences(user_id)
WHERE user_id IS NOT NULL;

-- ============================================
-- 10. OPTIMIZAR POLÍTICAS: notifications
-- ============================================

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_optimized
ON public.notifications(user_id)
WHERE user_id IS NOT NULL;

-- ============================================
-- 11. OPTIMIZAR POLÍTICAS: oauth_tokens
-- ============================================

DROP POLICY IF EXISTS "Users can view own tokens" ON public.oauth_tokens;
DROP POLICY IF EXISTS "Users can insert own tokens" ON public.oauth_tokens;
DROP POLICY IF EXISTS "Users can update own tokens" ON public.oauth_tokens;
DROP POLICY IF EXISTS "Users can delete own tokens" ON public.oauth_tokens;

CREATE POLICY "Users can view their tokens"
ON public.oauth_tokens
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their tokens"
ON public.oauth_tokens
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their tokens"
ON public.oauth_tokens
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their tokens"
ON public.oauth_tokens
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_user_id_optimized
ON public.oauth_tokens(user_id)
WHERE user_id IS NOT NULL;

-- ============================================
-- 12. OPTIMIZAR POLÍTICAS: payments
-- ============================================

DROP POLICY IF EXISTS "Users can view payments for their appointments" ON public.payments;

CREATE POLICY "Users can view payments for their appointments"
ON public.payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.appointments
    WHERE appointments.id = payments.appointment_id
      AND appointments.professional_id = (SELECT auth.uid())
  )
);

-- ============================================
-- 13. OPTIMIZAR POLÍTICAS: services
-- ============================================
-- Consolidar políticas duplicadas

DROP POLICY IF EXISTS "Users can manage their own services" ON public.services;

CREATE POLICY "Authenticated users can manage their services"
ON public.services
FOR ALL
TO authenticated
USING ((SELECT auth.uid()) = professional_id)
WITH CHECK ((SELECT auth.uid()) = professional_id);

-- Las políticas públicas se mantienen

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_services_professional_id_optimized
ON public.services(professional_id)
WHERE professional_id IS NOT NULL;

-- ============================================
-- 14. OPTIMIZAR POLÍTICAS: suggestions
-- ============================================

DROP POLICY IF EXISTS "Users can view suggestions from their chats" ON public.suggestions;

CREATE POLICY "Users can view suggestions from their chats"
ON public.suggestions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.chats
    WHERE chats.id = suggestions.chat_id
      AND chats.user_id = (SELECT auth.uid())
  )
);

-- ============================================
-- 15. OPTIMIZAR POLÍTICAS: user_integrations
-- ============================================

DROP POLICY IF EXISTS "Users can view their own integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can insert their own integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can update their own integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can delete their own integrations" ON public.user_integrations;

CREATE POLICY "Users can view their integrations"
ON public.user_integrations
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their integrations"
ON public.user_integrations
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their integrations"
ON public.user_integrations
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their integrations"
ON public.user_integrations
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id_optimized
ON public.user_integrations(user_id)
WHERE user_id IS NOT NULL;

-- ============================================
-- 16. OPTIMIZAR POLÍTICAS: users
-- ============================================

DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

CREATE POLICY "Users can view their data"
ON public.users
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their data"
ON public.users
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_users_id_optimized
ON public.users(id)
WHERE id IS NOT NULL;

-- ============================================
-- 17. OPTIMIZAR POLÍTICAS: votes
-- ============================================

DROP POLICY IF EXISTS "Users can create votes" ON public.votes;
DROP POLICY IF EXISTS "Users can update own votes" ON public.votes;
DROP POLICY IF EXISTS "Users can delete own votes" ON public.votes;

CREATE POLICY "Users can create votes"
ON public.votes
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their votes"
ON public.votes
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their votes"
ON public.votes
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_votes_user_id_optimized
ON public.votes(user_id)
WHERE user_id IS NOT NULL;

-- ============================================
-- 18. OPTIMIZAR POLÍTICAS: waitlist
-- ============================================
-- Consolidar políticas duplicadas

DROP POLICY IF EXISTS "Users can view their own waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Users can manage their own waitlist" ON public.waitlist;

CREATE POLICY "Authenticated users can manage their waitlist"
ON public.waitlist
FOR ALL
TO authenticated
USING ((SELECT auth.uid()) = professional_id)
WITH CHECK ((SELECT auth.uid()) = professional_id);

-- Índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_waitlist_professional_id_optimized
ON public.waitlist(professional_id)
WHERE professional_id IS NOT NULL;

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
-- Después de aplicar esta migración:
-- 1. Verifica que todas las políticas funcionan correctamente
-- 2. Monitorea el performance de queries (debería mejorar 94-99%)
-- 3. Revisa los índices creados para asegurar que se usan
-- ============================================

COMMIT;
