const fs = require('fs');
const path = require('path');

const templateDir = '/mnt/c/Users/alexa/Downloads/preline-pro-templates/preline-pro-templates/pro/startup';
const appDir = path.join(__dirname, 'app');

// Mapeo de archivos HTML a rutas Next.js
const pages = [
  { html: 'about.html', route: 'about' },
  { html: 'features.html', route: 'features' },
  { html: 'pricing.html', route: 'pricing' },
  { html: 'customers.html', route: 'customers' },
  { html: 'customer-details.html', route: 'customer-details' },
];

function convertHtmlToNextJs(htmlPath, routePath) {
  console.log(`\n🔄 Convirtiendo ${path.basename(htmlPath)} → app/${routePath}/page.tsx`);

  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Extraer el body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) {
    console.error(`❌ No se encontró body en ${htmlPath}`);
    return false;
  }

  let bodyContent = bodyMatch[1];

  // Extraer scripts del body
  const scripts = [];
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(bodyContent)) !== null) {
    if (scriptMatch[1].trim() && !scriptMatch[0].includes('src=')) {
      scripts.push(scriptMatch[1].trim());
    }
    bodyContent = bodyContent.replace(scriptMatch[0], '');
  }

  // Extraer estilos inline
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const inlineStyles = styleMatch ? styleMatch[1] : '';

  // Convertir HTML a JSX
  bodyContent = bodyContent
    .replace(/class=/g, 'class=')
    .replace(/href="\.\.\/\.\.\/pro\/startup\//g, 'href="/')
    .replace(/href="\.\.\/assets\//g, 'href="/assets/')
    .replace(/href="\/index\.html"/g, 'href="/"')
    .replace(/href="\/([^"]+\.html)"/g, 'href="/$1"')
    .replace(/src="\.\.\/assets\//g, 'src="/assets/')
    .replace(/url\(https:\/\/preline\.co\/assets\//g, 'url(/assets/')
    .replace(/url\(\.\.\/assets\//g, 'url(/assets/');

  // Convertir rutas .html a rutas Next.js
  bodyContent = bodyContent
    .replace(/href="\/about\.html"/g, 'href="/about"')
    .replace(/href="\/features\.html"/g, 'href="/features"')
    .replace(/href="\/pricing\.html"/g, 'href="/pricing"')
    .replace(/href="\/customers\.html"/g, 'href="/customers"')
    .replace(/href="\/customer-details\.html"/g, 'href="/customer-details"');

  // Crear el componente
  const component = `'use client';

import { useEffect } from 'react';

export default function ${routePath.charAt(0).toUpperCase() + routePath.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Page() {
  useEffect(() => {
    // Scripts de inicialización - esperar a que Preline se cargue
    const initScripts = () => {
      if (!window.HSStaticMethods) {
        setTimeout(initScripts, 100);
        return;
      }

      ${scripts.map((script, i) => {
        // Limpiar el script y adaptarlo
        let cleanScript = script
          .replace(/HSTabs\.getInstance/g, '(window as any).HSTabs?.getInstance')
          .replace(/HSScrollNav\.getInstance/g, '(window as any).HSScrollNav?.getInstance')
          .replace(/window\.addEventListener\('load'/g, '// window.addEventListener(\'load\'')
          .replace(/const tabs = /g, 'const tabs = (window as any).HSTabs?.getInstance')
          .replace(/const scrollNav = /g, 'const scrollNav = (window as any).HSScrollNav?.getInstance');

        return `// Script ${i + 1}\n      ${cleanScript}`;
      }).filter(Boolean).join('\n      ') || '// No scripts adicionales'}
    };

    // Esperar a que el DOM y Preline estén listos
    if (document.readyState === 'complete') {
      setTimeout(initScripts, 200);
    } else {
      window.addEventListener('load', () => {
        setTimeout(initScripts, 200);
      });
    }
  }, []);

  return (
    <>
      ${inlineStyles ? `<style jsx global>{\`${inlineStyles.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`}</style>` : ''}
      <div dangerouslySetInnerHTML={{ __html: \`${bodyContent.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\` }} />
    </>
  );
}
`;

  // Crear el directorio de la ruta
  const routeDir = path.join(appDir, routePath);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  // Escribir el componente
  const pagePath = path.join(routeDir, 'page.tsx');
  fs.writeFileSync(pagePath, component);
  console.log(`✅ Creado: ${pagePath}`);

  return true;
}

// Convertir todas las páginas
console.log('🚀 Iniciando conversión de todas las páginas...\n');

let successCount = 0;
for (const page of pages) {
  const htmlPath = path.join(templateDir, page.html);
  if (fs.existsSync(htmlPath)) {
    if (convertHtmlToNextJs(htmlPath, page.route)) {
      successCount++;
    }
  } else {
    console.error(`❌ No se encontró: ${htmlPath}`);
  }
}

console.log(`\n✨ Conversión completada: ${successCount}/${pages.length} páginas convertidas`);
