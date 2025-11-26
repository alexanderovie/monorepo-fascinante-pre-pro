#!/bin/bash

# Elite Pro Pre-Commit Review Script
# Ejecuta verificaciones exhaustivas antes de commit

set -e

echo "🔍 Elite Pro Pre-Commit Review"
echo "================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Build
echo "📦 1. Verificando build..."
if pnpm build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build exitoso${NC}"
else
    echo -e "${RED}❌ Build falló${NC}"
    pnpm build
    exit 1
fi

# 2. Lint
echo ""
echo "🔍 2. Verificando ESLint..."
if pnpm lint --max-warnings=0 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ESLint sin errores${NC}"
else
    echo -e "${RED}❌ ESLint tiene errores${NC}"
    pnpm lint
    exit 1
fi

# 3. Verificar cambios
echo ""
echo "📝 3. Cambios a commitear:"
git diff --stat

# 4. Verificar archivos críticos modificados
echo ""
echo "🔐 4. Verificando archivos críticos..."
CRITICAL_FILES=(
    "utils/supabase/middleware.ts"
    "app/page.tsx"
    "app/auth/callback/route.ts"
    "app/login/LoginForm.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if git diff --name-only HEAD | grep -q "$file"; then
        echo -e "${YELLOW}⚠️  Archivo crítico modificado: $file${NC}"
        echo "   Revisar manualmente:"
        echo "   - ¿Hay doble lógica de autenticación?"
        echo "   - ¿Hay loops de redirect?"
        echo "   - ¿Se manejan todos los edge cases?"
    fi
done

# 5. Checklist manual
echo ""
echo "📋 5. Checklist manual (verificar antes de commit):"
echo "   [ ] ¿Revisaste logs de producción (si aplica)?"
echo "   [ ] ¿Probaste el flujo completo end-to-end?"
echo "   [ ] ¿Verificaste edge cases críticos?"
echo "   [ ] ¿Confirmaste que no hay doble lógica?"
echo "   [ ] ¿Los redirects son correctos (no hay loops)?"
echo ""
echo -e "${YELLOW}⚠️  Por favor, verifica manualmente los puntos anteriores${NC}"
echo ""

# 6. Resumen
echo "================================"
echo -e "${GREEN}✅ Verificaciones automáticas completadas${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Revisar cambios: git diff"
echo "2. Verificar checklist manual"
echo "3. Commit: git commit -m '...'"
echo "4. Push: git push"
