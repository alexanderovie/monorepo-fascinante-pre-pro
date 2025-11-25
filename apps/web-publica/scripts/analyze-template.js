#!/usr/bin/env node
/**
 * Script para analizar la plantilla startup y extraer:
 * - Dependencias (scripts, CSS, librerías)
 * - Estructura de componentes
 * - Assets (imágenes, fuentes, etc.)
 * - Configuraciones de Preline UI
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = process.argv[2] || '/mnt/c/Users/alexa/Downloads/preline-pro-templates/preline-pro-templates/pro/startup';

function analyzeTemplate() {
  console.log('🔍 Analizando plantilla startup...\n');

  const analysis = {
    htmlFiles: [],
    dependencies: {
      scripts: [],
      styles: [],
      libraries: []
    },
    assets: {
      images: [],
      fonts: [],
      svg: []
    },
    prelineComponents: [],
    structure: {}
  };

  // Analizar index.html
  const indexPath = path.join(TEMPLATE_PATH, 'index.html');
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf-8');

    // Extraer scripts
    const scriptMatches = html.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/g) || [];
    scriptMatches.forEach(match => {
      const src = match.match(/src=["']([^"']+)["']/)?.[1];
      if (src) analysis.dependencies.scripts.push(src);
    });

    // Extraer estilos
    const styleMatches = html.match(/<link[^>]*href=["']([^"']+\.css)["'][^>]*>/g) || [];
    styleMatches.forEach(match => {
      const href = match.match(/href=["']([^"']+)["']/)?.[1];
      if (href) analysis.dependencies.styles.push(href);
    });

    // Extraer componentes Preline (data-hs-*)
    const prelineMatches = html.match(/data-hs-[^=]+/g) || [];
    analysis.prelineComponents = [...new Set(prelineMatches)];

    // Extraer imágenes
    const imgMatches = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/g) || [];
    imgMatches.forEach(match => {
      const src = match.match(/src=["']([^"']+)["']/)?.[1];
      if (src && !src.startsWith('http')) {
        if (src.endsWith('.svg')) analysis.assets.svg.push(src);
        else analysis.assets.images.push(src);
      }
    });
  }

  // Listar todos los HTML
  const files = fs.readdirSync(TEMPLATE_PATH);
  analysis.htmlFiles = files.filter(f => f.endsWith('.html'));

  // Buscar carpeta de assets
  const assetsDirs = ['assets', 'img', 'images', 'src'];
  assetsDirs.forEach(dir => {
    const dirPath = path.join(TEMPLATE_PATH, dir);
    if (fs.existsSync(dirPath)) {
      analysis.structure[dir] = fs.readdirSync(dirPath);
    }
  });

  return analysis;
}

const result = analyzeTemplate();
console.log(JSON.stringify(result, null, 2));
