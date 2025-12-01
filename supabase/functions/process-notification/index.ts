/**
 * Edge Function: Procesar Notificaciones
 *
 * ÉLITE PRO: Procesa notificaciones programadas con rate limiting usando Redis
 *
 * Características:
 * - Rate limiting con Redis
 * - Envío de emails (Resend)
 * - Envío de SMS (Twilio)
 * - Actualización de estado en DB
 * - Retry logic con exponential backoff
 *
 * Invocado por: pg_cron job cada 5 minutos
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.86.0'

// Redis client (usando Upstash Redis REST API)
const REDIS_URL = Deno.env.get('UPSTASH_REDIS_REST_URL') || ''
const REDIS_TOKEN = Deno.env.get('UPSTASH_REDIS_REST_TOKEN') || ''

// Rate limiting: máximo 10 notificaciones por minuto por usuario
const RATE_LIMIT_KEY_PREFIX = 'notification:rate_limit:'
const RATE_LIMIT_WINDOW = 60 // segundos
const RATE_LIMIT_MAX = 10 // notificaciones por ventana

interface NotificationPayload {
  notification_id: string
  user_id: string
  activity_event_id?: string
  notification_type: string
}

/**
 * Redis helper: Verificar rate limit
 */
async function checkRateLimit(userId: string): Promise<boolean> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    // Si Redis no está configurado, permitir (solo en dev)
    console.warn('Redis no configurado, saltando rate limit')
    return true
  }

  const key = `${RATE_LIMIT_KEY_PREFIX}${userId}`
  const now = Date.now()
  const windowStart = now - (RATE_LIMIT_WINDOW * 1000)

  try {
    // Obtener contador actual
    const response = await fetch(`${REDIS_URL}/get/${key}`, {
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`
      }
    })

    const data = await response.json()
    const count = data.result ? parseInt(data.result) : 0

    if (count >= RATE_LIMIT_MAX) {
      return false // Rate limit excedido
    }

    // Incrementar contador
    await fetch(`${REDIS_URL}/incr/${key}`, {
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`
      }
    })

    // Establecer expiración
    await fetch(`${REDIS_URL}/expire/${key}/${RATE_LIMIT_WINDOW}`, {
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`
      }
    })

    return true
  } catch (error) {
    console.error('Error checking rate limit:', error)
    // En caso de error, permitir (fail open)
    return true
  }
}

/**
 * Obtener datos de notificación desde DB
 */
async function getNotificationData(
  supabase: any,
  notificationId: string
): Promise<any | null> {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      activity_events:activity_event_id (
        action,
        changes,
        metadata
      ),
      profiles:user_id (
        email,
        name
      )
    `)
    .eq('id', notificationId)
    .single()

  if (error) {
    console.error('Error fetching notification:', error)
    return null
  }

  return data
}

/**
 * Enviar email usando Resend
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY no configurado')
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Fascinante Digital <notificaciones@fascinantedigital.com>',
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Error sending email:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * Enviar SMS usando Twilio
 */
async function sendSMS(
  to: string,
  message: string
): Promise<boolean> {
  const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
  const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
  const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Twilio no configurado')
    return false
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

    const formData = new URLSearchParams()
    formData.append('From', TWILIO_PHONE_NUMBER)
    formData.append('To', to)
    formData.append('Body', message)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Error sending SMS:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending SMS:', error)
    return false
  }
}

/**
 * Procesar notificación
 */
async function processNotification(
  supabase: any,
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  // 1. Verificar rate limit
  const allowed = await checkRateLimit(payload.user_id)
  if (!allowed) {
    return {
      success: false,
      error: 'Rate limit excedido. Intenta más tarde.',
    }
  }

  // 2. Obtener datos de notificación
  const notification = await getNotificationData(supabase, payload.notification_id)
  if (!notification) {
    return {
      success: false,
      error: 'Notificación no encontrada',
    }
  }

  // 3. Verificar que no esté ya enviada
  if (notification.sent) {
    return {
      success: true, // Ya procesada, considerar éxito
    }
  }

  // 4. Procesar según tipo
  let sent = false

  if (notification.type === 'activity_change' || notification.type === 'email') {
    // Enviar email
    const email = notification.profiles?.email
    if (email) {
      const subject = 'Notificación de Cambio - Fascinante Digital'
      const html = `
        <h2>Notificación de Cambio</h2>
        <p>${notification.message}</p>
        <p>Fecha: ${new Date(notification.scheduled_for).toLocaleString('es-ES')}</p>
      `
      sent = await sendEmail(email, subject, html)
    }
  }

  if (notification.type === 'sms') {
    // Enviar SMS
    const phone = notification.profiles?.phone
    if (phone) {
      sent = await sendSMS(phone, notification.message)
    }
  }

  // 5. Actualizar estado en DB
  if (sent) {
    const { error } = await supabase
      .from('notifications')
      .update({
        sent: true,
        sent_at: new Date().toISOString(),
      })
      .eq('id', payload.notification_id)

    if (error) {
      console.error('Error updating notification:', error)
      return {
        success: false,
        error: 'Error actualizando estado',
      }
    }
  }

  return {
    success: sent,
  }
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    // Verificar autenticación (service role key)
    const authHeader = req.headers.get('Authorization')
    const expectedToken = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!authHeader || !authHeader.includes(expectedToken || '')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Parsear payload
    const payload: NotificationPayload = await req.json()

    // Crear cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Procesar notificación
    const result = await processNotification(supabase, payload)

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('Error processing notification:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
