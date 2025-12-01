import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import type { UIMessage } from 'ai';

/**
 * API Route para el Chatbot de Auditoría
 *
 * Usa AI SDK v5 con OpenAI GPT-4o-mini (bajo costo) para responder
 * preguntas sobre auditorías de visibilidad en Google.
 *
 * @module app/api/chat/route
 */

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * POST handler para el chatbot
 *
 * Recibe mensajes del cliente y devuelve respuestas streamed del modelo.
 */
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Validar que hay mensajes
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // System prompt en español e inglés según el contexto
    // El locale se puede detectar del primer mensaje o header Accept-Language
    const systemPrompt = `Eres un asistente experto de Fascinante Digital, especializado en auditorías de visibilidad en Google Business Profile y SEO local.

Tu función es ayudar a los usuarios a entender:
- Cómo funciona la auditoría gratuita de visibilidad
- Qué métricas y datos se analizan
- Cómo interpretar los resultados de la auditoría
- Qué información puede estar faltando en su perfil de Google Business
- Cómo mejorar su visibilidad en Google sin anuncios pagados

Reglas importantes:
- Sé profesional, amigable y claro
- Responde en el mismo idioma que el usuario
- Si no sabes algo, admítelo y ofrece contactar con el equipo
- No hagas promesas sobre resultados específicos
- Enfócate en educar sobre SEO local y visibilidad en Google
- Si el usuario pregunta sobre precios o planes, menciona que puede contactar al equipo

Si el usuario necesita ayuda más específica o quiere hablar con un humano, sugiere usar el chat de soporte.`;

    // Generar respuesta con streaming
    const result = streamText({
      model: openai('gpt-4o-mini'), // Modelo económico pero efectivo
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      temperature: 0.7, // Balance entre creatividad y precisión
      maxOutputTokens: 1000, // Limitar tokens de salida para controlar costos
    });

    // Devolver respuesta como stream de UI messages
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error en API route /api/chat:', error);

    return new Response(
      JSON.stringify({
        error: 'Error al procesar la solicitud',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
