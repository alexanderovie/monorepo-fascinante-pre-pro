'use client';

/**
 * Chatbot de Auditoría con AI SDK
 *
 * Componente de chatbot especializado para la página de auditoría.
 * Usa AI SDK v5 para responder preguntas sobre auditorías de visibilidad.
 *
 * Implementación siguiendo documentación oficial AI SDK v5:
 * - Input gestionado manualmente con useState (recomendado)
 * - Manejo robusto de errores
 * - Validación de input antes de enviar
 * - Estado de carga y errores manejados correctamente
 *
 * @module app/[locale]/audit/components/AuditChatbot
 */

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Componente AuditChatbot
 *
 * Chatbot flotante con diseño moderno que se integra con la página de auditoría.
 */
export default function AuditChatbot() {
  const t = useTranslations('audit');
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onError: (error) => {
      console.error('Error en chatbot:', error);
    },
  });

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus en input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación: input debe existir y no estar vacío
    const trimmedInput = input?.trim() || '';
    if (!trimmedInput || status !== 'ready') {
      return;
    }

    // Enviar mensaje y limpiar input
    sendMessage({ text: trimmedInput });
    setInput('');
  };

  // Estado de carga basado en status oficial
  const isLoading = status === 'submitted' || status === 'streaming';
  const isReady = status === 'ready';

  return (
    <>
      {/* Botón flotante para abrir el chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Abrir chatbot de auditoría"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Panel del chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold text-lg">
                {t('chatbot.title', { defaultValue: 'Asistente de Auditoría' })}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-700 rounded transition-colors"
              aria-label="Cerrar chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">
                  {t('chatbot.welcome', {
                    defaultValue: '¡Hola! Soy tu asistente de auditoría. ¿En qué puedo ayudarte?'
                  })}
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === 'text') {
                        return (
                          <p key={index} className="text-sm whitespace-pre-wrap">
                            {part.text}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 max-w-[80%]">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">
                      {t('chatbot.error', {
                        defaultValue: 'Error al procesar tu mensaje. Por favor, intenta de nuevo.'
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => regenerate()}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    {t('chatbot.retry', { defaultValue: 'Reintentar' })}
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleFormSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input || ''}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatbot.placeholder', {
                  defaultValue: 'Escribe tu pregunta...'
                })}
                disabled={!isReady || error != null}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-label="Campo de texto para escribir mensaje"
              />
              <button
                type="submit"
                disabled={!input?.trim() || !isReady || error != null}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Enviar mensaje"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {t('chatbot.disclaimer', {
                defaultValue: 'Respuestas generadas por IA. Para consultas complejas, contacta al equipo.'
              })}
            </p>
          </form>
        </div>
      )}
    </>
  );
}
