#!/usr/bin/env node
/**
 * Script de prueba directa de la API de Crisp
 * No requiere servidor, prueba directamente las funciones
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Cargar variables de entorno manualmente
const envPath = resolve(process.cwd(), '.env.local');
let envContent = '';

try {
  envContent = readFileSync(envPath, 'utf-8');
} catch (error) {
  console.error('❌ No se pudo leer .env.local');
  process.exit(1);
}

// Parsear variables de entorno
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Configurar process.env
Object.assign(process.env, envVars);

// Verificar variables
console.log('🔍 Verificando variables de entorno...\n');
console.log('NEXT_PUBLIC_CRISP_WEBSITE_ID:', 
  process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ? '✅ Configurado' : '❌ No configurado');
console.log('CRISP_API_IDENTIFIER:', 
  process.env.CRISP_API_IDENTIFIER ? '✅ Configurado' : '❌ No configurado');
console.log('CRISP_API_KEY:', 
  process.env.CRISP_API_KEY ? '✅ Configurado' : '❌ No configurado');
console.log('');

// Importar funciones (usando import dinámico para Next.js)
try {
  console.log('🧪 Probando conexión con Crisp API...\n');
  
  // Usar fetch directamente para probar
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
  const identifier = process.env.CRISP_API_IDENTIFIER;
  const key = process.env.CRISP_API_KEY;
  
  if (!websiteId || !identifier || !key) {
    console.error('❌ Faltan variables de entorno');
    process.exit(1);
  }
  
  const authString = `${identifier}:${key}`;
  const encodedAuth = Buffer.from(authString).toString('base64');
  
  console.log('📡 Haciendo petición a Crisp API...');
  const response = await fetch(
    `https://api.crisp.chat/v1/website/${websiteId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json',
        'X-Crisp-Tier': 'plugin',
      },
    }
  );
  
  const data = await response.json();
  
  if (response.ok && !data.error) {
    console.log('✅ ¡Conexión exitosa!\n');
    console.log('📊 Información del website:');
    console.log('   - ID:', data.data?.website_id || data.website_id);
    console.log('   - Nombre:', data.data?.name || data.name);
    console.log('   - Dominio:', data.data?.domain || data.domain);
  } else {
    console.error('❌ Error en la respuesta:');
    console.error('   Status:', response.status);
    console.error('   Error:', data.error);
    console.error('   Reason:', data.reason);
    console.error('   Data:', JSON.stringify(data, null, 2));
  }
} catch (error) {
  console.error('❌ Error al probar conexión:');
  console.error('   Mensaje:', error.message);
  if (error.stack) {
    console.error('   Stack:', error.stack);
  }
  process.exit(1);
}

