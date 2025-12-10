#!/bin/bash

# 🧪 SCRIPT DE VERIFICACIÓN - HojaDeVida Editable
# Este script verifica que todos los endpoints estén funcionando correctamente

set -e

echo "🔍 Iniciando verificación de endpoints..."
echo ""

# Variables
BACKEND_URL="http://localhost:8080"
TOKEN="${1:-}"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para print colorido
print_status() {
    local status=$1
    local message=$2
    
    if [ "$status" = "ok" ]; then
        echo -e "${GREEN}✓${NC} $message"
    elif [ "$status" = "error" ]; then
        echo -e "${RED}✗${NC} $message"
    elif [ "$status" = "info" ]; then
        echo -e "${BLUE}ℹ${NC} $message"
    elif [ "$status" = "warn" ]; then
        echo -e "${YELLOW}⚠${NC} $message"
    fi
}

# Verificar que el backend está corriendo
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo "PASO 1: Verificar disponibilidad del Backend"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

if ! timeout 2 bash -c "cat < /dev/null > /dev/tcp/localhost/8080" 2>/dev/null; then
    print_status "error" "Backend no está disponible en localhost:8080"
    echo ""
    print_status "info" "Asegúrate de que el backend está corriendo:"
    echo "  cd /home/david/Desktop/programacion/workable/backend"
    echo "  java -jar target/workable-0.0.1-SNAPSHOT.jar"
    exit 1
else
    print_status "ok" "Backend disponible en localhost:8080"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo "PASO 2: Verificar Endpoints de Habilidades"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

# Si no hay token, obtener uno
if [ -z "$TOKEN" ]; then
    print_status "warn" "Token no proporcionado. Proporciona: ./verificar-endpoints.sh <TOKEN>"
    print_status "info" "Obten el token iniciando sesión en el frontend"
    TOKEN="tu_token_aqui"
fi

# 1. Verificar endpoint GET /api/habilidad/aspirante
print_status "info" "Probando: GET /api/habilidad/aspirante"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BACKEND_URL/api/habilidad/aspirante" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    print_status "ok" "GET /api/habilidad/aspirante - HTTP $HTTP_CODE"
    echo "  Response: $BODY"
else
    print_status "error" "GET /api/habilidad/aspirante - HTTP $HTTP_CODE"
fi

echo ""

# 2. Verificar endpoint POST /api/habilidad (crear habilidad)
print_status "info" "Probando: POST /api/habilidad (crear)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/habilidad" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"nombre": "Java", "descripcion": "Spring Boot", "nivel": "AVANZADO"}' 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    print_status "ok" "POST /api/habilidad - HTTP $HTTP_CODE"
elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    print_status "warn" "POST /api/habilidad - HTTP $HTTP_CODE (Token inválido o expirado)"
else
    print_status "error" "POST /api/habilidad - HTTP $HTTP_CODE"
fi

echo ""

# 3. Verificar endpoint PUT /api/aspirante/actualizar
print_status "info" "Probando: PUT /api/aspirante/actualizar"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BACKEND_URL/api/aspirante/actualizar" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"descripcion": "Descripción de prueba"}' 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    print_status "ok" "PUT /api/aspirante/actualizar - HTTP $HTTP_CODE"
elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    print_status "warn" "PUT /api/aspirante/actualizar - HTTP $HTTP_CODE (Token inválido)"
else
    print_status "error" "PUT /api/aspirante/actualizar - HTTP $HTTP_CODE"
fi

echo ""

# 4. Verificar endpoint GET /api/aspirante/me
print_status "info" "Probando: GET /api/aspirante/me"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BACKEND_URL/api/aspirante/me" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    print_status "ok" "GET /api/aspirante/me - HTTP $HTTP_CODE"
elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    print_status "warn" "GET /api/aspirante/me - HTTP $HTTP_CODE (No autenticado)"
else
    print_status "error" "GET /api/aspirante/me - HTTP $HTTP_CODE"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo "PASO 3: Archivos Verificados"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

# Verificar que los archivos existen
FILES=(
    "backend/src/main/java/com/workable_sb/workable/models/Habilidad.java"
    "backend/src/main/java/com/workable_sb/workable/repository/HabilidadRepo.java"
    "backend/src/main/java/com/workable_sb/workable/service/HabilidadService.java"
    "backend/src/main/java/com/workable_sb/workable/controller/HabilidadController.java"
    "frontend/src/api/habilidadAPI.js"
    "frontend/src/pages/AspirantePage/MiPerfil/HojaDeVida/HojaDeVida.jsx"
    "frontend/src/pages/AspirantePage/MiPerfil/HojaDeVida/HojaDeVida.css"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "ok" "Archivo existe: $file"
    else
        print_status "error" "Archivo NO existe: $file"
    fi
done

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo "RESUMEN DE VERIFICACIÓN"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
print_status "info" "Si deseas hacer un test completo:"
echo "  1. Inicia el backend: ./run-project-linux.sh"
echo "  2. Abre el frontend en localhost:5173"
echo "  3. Inicia sesión como aspirante"
echo "  4. Ve a 'Hoja de Vida'"
echo "  5. Prueba editar descripción"
echo "  6. Prueba agregar/eliminar habilidades"
echo ""
print_status "ok" "✨ Verificación completada!"
