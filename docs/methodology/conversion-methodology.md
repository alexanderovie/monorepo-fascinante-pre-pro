# Metodología de Conversión Template → Next.js

## 🎯 Proceso Elite Pro para Minimizar Errores

### Fase 1: Análisis Pre-Conversión ✅
- [x] Identificar todas las dependencias (scripts, CSS, librerías)
- [x] Mapear estructura de componentes
- [x] Listar todos los assets (imágenes, fuentes, SVG)
- [x] Identificar componentes Preline UI usados
- [x] Documentar rutas y enlaces relativos

### Fase 2: Preparación del Entorno
- [x] Configurar Next.js 15.5.6 con TypeScript estricto
- [x] Instalar Preline UI y dependencias
- [x] Configurar Tailwind CSS v4
- [x] Setup de ESLint estricto
- [x] Crear estructura de carpetas (components/, lib/, public/)

### Fase 3: Conversión Incremental (Una sección a la vez)

#### 3.1 Header (PRIORIDAD 1)
1. Extraer HTML del header
2. Identificar componentes Preline usados
3. Convertir a componente TypeScript
4. Mapear rutas relativas a rutas Next.js
5. Verificar que Preline UI se inicializa correctamente
6. Test visual en navegador
7. ✅ Build exitoso
8. ✅ ESLint sin errores

#### 3.2 Hero Section (PRIORIDAD 2)
- Mismo proceso que header
- Verificar imágenes y assets
- Test responsive

#### 3.3 Resto de Secciones
- Convertir sección por sección
- Validar después de cada conversión

### Fase 4: Validación Final
- [ ] Build production exitoso
- [ ] ESLint estricto sin errores
- [ ] TypeScript sin errores
- [ ] Test visual completo
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Verificar todos los componentes Preline UI funcionan

## 🔧 Herramientas Creadas

1. **analyze-template.js**: Analiza la plantilla y extrae dependencias
2. **convert-header.js**: Convierte header a componente Next.js

## 📋 Checklist de Conversión

Para cada componente:
- [ ] HTML extraído correctamente
- [ ] Convertido a TSX con tipos
- [ ] Rutas actualizadas (../assets/ → /assets/)
- [ ] Componentes Preline identificados
- [ ] Imágenes copiadas a public/
- [ ] CSS classes preservadas
- [ ] Responsive funcionando
- [ ] Dark mode funcionando (si aplica)
- [ ] Build exitoso
- [ ] ESLint sin errores
