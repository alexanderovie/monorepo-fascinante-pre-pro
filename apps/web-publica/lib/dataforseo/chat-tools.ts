/**
 * DataForSEO Tools para Chatbot
 *
 * Tools directos que llaman al gateway data.fascinantedigital.com
 * Versión rápida para probar - luego escalamos con auth, rate limiting, etc.
 *
 * @module lib/dataforseo/chat-tools
 */

import { tool } from 'ai';
import { z } from 'zod';

const GATEWAY_URL = 'https://data.fascinantedigital.com';

/**
 * Cliente helper para llamar al gateway
 */
async function callGateway(endpoint: string, body: Record<string, unknown>) {
  const response = await fetch(`${GATEWAY_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Plan': 'free',
      'X-Force-Refresh': 'false',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gateway error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  // Extraer costo si está disponible
  const cost = response.headers.get('X-Cost-Single');

  return {
    data,
    cost: cost ? parseFloat(cost) : 0,
  };
}

/**
 * Tools de DataForSEO para el chatbot
 */
export const dataForSEOTools = {
  /**
   * Analiza un negocio específico en Google Business Profile
   */
  analyzeMyBusiness: tool({
    description: 'Analiza un negocio específico en Google Business Profile. Busca por nombre y devuelve rating, reseñas, dirección, teléfono, horarios y verificación.',
    inputSchema: z.object({
      keyword: z.string().describe('Nombre del negocio (incluir ciudad para mayor precisión, ej: "Duffy\'s West Palm Beach")'),
      location_name: z.string().describe('Ubicación en formato: Ciudad,Estado,País (ej: "West Palm Beach,Florida,United States")'),
      language_code: z.enum(['es', 'en', 'pt']).describe('Código de idioma: es (español), en (inglés), pt (portugués)'),
    }),
    execute: async ({ keyword, location_name, language_code }) => {
      try {
        const { data, cost } = await callGateway(
          '/v3/business_data/google/my_business_info/live.ai',
          { keyword, location_name, language_code }
        );

        return {
          success: true,
          data,
          cost,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  }),

  /**
   * Busca todos los competidores locales por categoría
   */
  searchAllCompetitors: tool({
    description: 'Busca todos los negocios competidores en un área específica por categoría. IMPORTANTE: Usa la MISMA ubicación (ciudad, estado, país) que el negocio analizado para obtener competidores relevantes. Devuelve nombres, ratings, reseñas, direcciones y teléfonos de negocios en la misma área.',
    inputSchema: z.object({
      location_name: z.string().describe('Ubicación EXACTA en formato: Ciudad,Estado,País (DEBE ser la misma ciudad/área del negocio analizado, ej: "West Palm Beach,Florida,United States")'),
      categories: z.array(z.string()).describe('Categorías de negocio obtenidas del negocio analizado (ej: ["restaurant", "food", "latin_american_restaurant"])'),
      limit: z.number().optional().default(20).describe('Máximo de resultados (1-100). Recomendado: 20 para obtener los más relevantes'),
    }),
    execute: async ({ location_name, categories, limit }) => {
      try {
        const { data, cost } = await callGateway(
          '/v3/business_data/business_listings/search/live.ai',
          { location_name, categories, limit }
        );

        return {
          success: true,
          data,
          cost,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  }),

  /**
   * Analiza la demanda de búsqueda de keywords
   */
  analyzeSearchDemand: tool({
    description: 'Muestra el volumen de búsquedas mensuales en Google para palabras clave específicas en un país.',
    inputSchema: z.object({
      keywords: z.array(z.string()).describe('Lista de palabras clave a analizar (ej: ["restaurant miami", "beauty salon tampa"])'),
      location_name: z.string().describe('País (ej: "United States", "Venezuela", "Colombia")'),
      language_code: z.enum(['es', 'en', 'pt']).describe('Código de idioma'),
    }),
    execute: async ({ keywords, location_name, language_code }) => {
      try {
        const { data, cost } = await callGateway(
          '/v3/dataforseo_labs/google/keyword_overview/live.ai',
          { keywords, location_name, language_code }
        );

        return {
          success: true,
          data,
          cost,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  }),

  /**
   * Encuentra keywords relacionadas
   */
  findRelatedSearches: tool({
    description: 'Encuentra palabras clave relacionadas con volúmenes de búsqueda para descubrir oportunidades.',
    inputSchema: z.object({
      keywords: z.array(z.string()).describe('Palabras clave base (ej: ["restaurant", "beauty salon"])'),
      location_name: z.string().describe('País'),
      language_code: z.enum(['es', 'en', 'pt']).describe('Código de idioma'),
      limit: z.number().optional().default(30).describe('Máximo de resultados'),
    }),
    execute: async ({ keywords, location_name, language_code, limit }) => {
      try {
        const { data, cost } = await callGateway(
          '/v3/dataforseo_labs/google/keyword_ideas/live.ai',
          { keywords, location_name, language_code, limit }
        );

        return {
          success: true,
          data,
          cost,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  }),
};
