#!/bin/bash

# Script de Verificación Post-Corrección
# Workable Mobile App - Testing Suite

echo "========================================="
echo "🔍 VERIFICACIÓN DE CORRECCIONES CRÍTICAS"
echo "========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que el backend esté ejecutándose
echo "1️⃣  Verificando servidor backend..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://192.168.20.8:8080/actuator/health 2>/dev/null || echo "000")

if [ "$response" -eq "200" ] || [ "$response" -eq "404" ]; then
    echo -e "${GREEN}✅ Backend está ejecutándose${NC}"
else
    echo -e "${RED}❌ Backend NO responde. Asegúrate de que esté ejecutándose en http://192.168.20.8:8080${NC}"
    echo -e "${YELLOW}   Ejecuta: cd backend && ./mvnw spring-boot:run${NC}"
    exit 1
fi

echo ""
echo "2️⃣  Verificando endpoints críticos corregidos..."

# Test endpoint de postulaciones ADMIN
echo "   - Verificando /api/postulacion/all (ADMIN)..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://192.168.20.8:8080/api/postulacion/all 2>/dev/null || echo "000")
if [ "$response" -eq "401" ] || [ "$response" -eq "403" ]; then
    echo -e "${GREEN}   ✅ Endpoint existe (requiere autenticación)${NC}"
elif [ "$response" -eq "404" ]; then
    echo -e "${RED}   ❌ Endpoint /api/postulacion/all NO encontrado${NC}"
else
    echo -e "${YELLOW}   ⚠️  Respuesta inesperada: $response${NC}"
fi

# Test endpoint de reclutador/me
echo "   - Verificando /api/reclutador/me..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://192.168.20.8:8080/api/reclutador/me 2>/dev/null || echo "000")
if [ "$response" -eq "401" ] || [ "$response" -eq "403" ]; then
    echo -e "${GREEN}   ✅ Endpoint existe (requiere autenticación)${NC}"
elif [ "$response" -eq "404" ]; then
    echo -e "${RED}   ❌ Endpoint /api/reclutador/me NO encontrado${NC}"
else
    echo -e "${YELLOW}   ⚠️  Respuesta inesperada: $response${NC}"
fi

echo ""
echo "3️⃣  Verificando archivos modificados..."

# Verificar que los archivos corregidos existen
files=(
    "movil/src/context/AuthContext.tsx"
    "movil/src/api/postulacion.ts"
    "backend/src/main/java/com/workable_sb/workable/models/Reclutador.java"
    "backend/src/main/java/com/workable_sb/workable/controller/PostulacionController.java"
    "backend/src/main/java/com/workable_sb/workable/service/PostulacionService.java"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}   ✅ $file${NC}"
    else
        echo -e "${RED}   ❌ $file NO encontrado${NC}"
        all_exist=false
    fi
done

echo ""
echo "4️⃣  Verificando correcciones específicas..."

# Verificar que AuthContext NO tiene código temporal
if grep -q "TEMPORAL: Limpiar cache para desarrollo" movil/src/context/AuthContext.tsx; then
    echo -e "${RED}   ❌ AuthContext aún tiene código temporal (logout automático)${NC}"
else
    echo -e "${GREEN}   ✅ Código temporal eliminado de AuthContext${NC}"
fi

# Verificar que Reclutador.java NO tiene @JsonIgnore en empresa
if grep -A 2 "private Empresa empresa" backend/src/main/java/com/workable_sb/workable/models/Reclutador.java | grep -q "@JsonIgnore"; then
    echo -e "${RED}   ❌ Reclutador.java aún tiene @JsonIgnore en empresa${NC}"
else
    echo -e "${GREEN}   ✅ @JsonIgnore eliminado de empresa en Reclutador.java${NC}"
fi

# Verificar que postulacion.ts usa endpoint correcto
if grep -q "'/postulacion/all'" movil/src/api/postulacion.ts; then
    echo -e "${GREEN}   ✅ postulacion.ts usa endpoint correcto (/postulacion/all)${NC}"
else
    echo -e "${RED}   ❌ postulacion.ts NO usa /postulacion/all${NC}"
fi

# Verificar que PostulacionService tiene método listarTodas
if grep -q "listarTodas()" backend/src/main/java/com/workable_sb/workable/service/PostulacionService.java; then
    echo -e "${GREEN}   ✅ PostulacionService tiene método listarTodas()${NC}"
else
    echo -e "${RED}   ❌ PostulacionService NO tiene método listarTodas()${NC}"
fi

echo ""
echo "========================================="
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================================="

if [ "$all_exist" = true ]; then
    echo -e "${GREEN}✅ Todos los archivos modificados están presentes${NC}"
else
    echo -e "${RED}❌ Algunos archivos no se encontraron${NC}"
fi

echo ""
echo "🚀 PRÓXIMOS PASOS:"
echo ""
echo "1. ${YELLOW}Reiniciar el servidor backend:${NC}"
echo "   cd backend"
echo "   ./mvnw spring-boot:run"
echo ""
echo "2. ${YELLOW}Limpiar y reiniciar la app móvil:${NC}"
echo "   cd movil"
echo "   npx expo start --clear"
echo ""
echo "3. ${YELLOW}Probar las funcionalidades:${NC}"
echo "   - Login como ADMIN → Dashboard debe cargar sin error 500"
echo "   - Login como RECLUTADOR → Debe ver datos de su empresa"
echo "   - Login como ASPIRANTE → Hoja de vida debe funcionar"
echo ""
echo "========================================="
echo "✅ Verificación completada"
echo "========================================="
