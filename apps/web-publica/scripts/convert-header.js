#!/usr/bin/env node
/**
 * Script para convertir el header de la plantilla startup a Next.js
 * Extrae el header, identifica dependencias y genera código TypeScript
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = process.argv[2] || '/mnt/c/Users/alexa/Downloads/preline-pro-templates/preline-pro-templates/pro/startup';

function extractHeader(html) {
  // Buscar el header (puede estar en <header> o <nav> o div con clase header)
  const headerPatterns = [
    /<header[^>]*>([\s\S]*?)<\/header>/i,
    /<nav[^>]*class=["'][^"']*header[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i,
    /<div[^>]*class=["'][^"']*header[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of headerPatterns) {
    const match = html.match(pattern);
    if (match) {
      return {
        html: match[1],
        tag: match[0].match(/<(\w+)/)?.[1] || 'header',
        full: match[0]
      };
    }
  }

  return null;
}

function analyzeHeaderDependencies(headerHtml) {
  const deps = {
    prelineComponents: [],
    scripts: [],
    classes: new Set(),
    images: []
  };

  // Preline components
  const prelineMatches = headerHtml.match(/data-hs-[^=]+/g) || [];
  deps.prelineComponents = [...new Set(prelineMatches)];

  // Tailwind classes únicas
  const classMatches = headerHtml.match(/class=["']([^"']+)["']/g) || [];
  classMatches.forEach(match => {
    const classes = match.match(/class=["']([^"']+)["']/)?.[1] || '';
    classes.split(/\s+/).forEach(cls => {
      if (cls) deps.classes.add(cls);
    });
  });

  // Imágenes
  const imgMatches = headerHtml.match(/src=["']([^"']+)["']/g) || [];
  imgMatches.forEach(match => {
    const src = match.match(/src=["']([^"']+)["']/)?.[1];
    if (src && !src.startsWith('http')) {
      deps.images.push(src);
    }
  });

  return {
    ...deps,
    classes: Array.from(deps.classes)
  };
}

function convertToTSX(headerHtml, tag = 'header') {
  // Escapar comillas y convertir a template string
  const escaped = headerHtml
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');

  return `'use client';

export default function Header() {
  return (
    <${tag} dangerouslySetInnerHTML={{ __html: \`${escaped}\` }} />
  );
}`;
}

// Ejecutar
const indexPath = path.join(TEMPLATE_PATH, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ No se encontró index.html');
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf-8');
const header = extractHeader(html);

if (!header) {
  console.error('❌ No se encontró el header en el HTML');
  process.exit(1);
}

console.log('✅ Header extraído\n');
console.log('📊 Análisis de dependencias:');
const deps = analyzeHeaderDependencies(header.html);
console.log(JSON.stringify(deps, null, 2));

// Guardar header extraído
const outputDir = path.join(__dirname, '../app/components');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const tsxContent = convertToTSX(header.html, header.tag);
fs.writeFileSync(path.join(outputDir, 'Header.tsx'), tsxContent);
console.log('\n✅ Header convertido a Header.tsx');
