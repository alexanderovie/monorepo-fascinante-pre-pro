/**
 * DataForSEO Client - Cliente autenticado
 *
 * Basado en dataforseo-client@2.0.15 (Noviembre 2025)
 * Documentación: https://github.com/dataforseo/TypeScriptClient
 *
 * Características:
 * - Autenticación Basic Auth
 * - Singleton pattern para reutilizar conexiones
 * - Configuración centralizada
 */

import * as client from 'dataforseo-client';

const DATAFORSEO_API_URL = 'https://api.dataforseo.com';

/**
 * Crea un fetch autenticado para DataForSEO API
 *
 * @param username - Username de DataForSEO
 * @param password - Password de DataForSEO
 * @returns Fetch function con autenticación Basic Auth
 */
export function createAuthenticatedFetch(username: string, password: string) {
  return (url: RequestInfo, init?: RequestInit): Promise<Response> => {
    // Usar Buffer en Node.js (más seguro que btoa en servidor)
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    const authHeader = { 'Authorization': `Basic ${token}` };

    const newInit: RequestInit = {
      ...init,
      headers: {
        ...init?.headers,
        ...authHeader,
      },
    };

    return fetch(url, newInit);
  };
}

/**
 * Obtiene credenciales de DataForSEO desde variables de entorno
 *
 * @throws Error si las credenciales no están configuradas
 */
export function getDataForSEOCredentials(): { username: string; password: string } {
  const username = process.env.DATAFORSEO_USERNAME;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'DATAFORSEO_USERNAME y DATAFORSEO_PASSWORD deben estar configuradas en variables de entorno'
    );
  }

  return { username, password };
}

/**
 * Crea una instancia autenticada de BusinessDataApi
 *
 * @returns BusinessDataApi instance con autenticación
 */
export function createBusinessDataApi(): client.BusinessDataApi {
  const { username, password } = getDataForSEOCredentials();
  const authFetch = createAuthenticatedFetch(username, password);

  return new client.BusinessDataApi(DATAFORSEO_API_URL, { fetch: authFetch });
}

/**
 * Crea una instancia autenticada de SerpApi
 *
 * @returns SerpApi instance con autenticación
 */
export function createSerpApi(): client.SerpApi {
  const { username, password } = getDataForSEOCredentials();
  const authFetch = createAuthenticatedFetch(username, password);

  return new client.SerpApi(DATAFORSEO_API_URL, { fetch: authFetch });
}
