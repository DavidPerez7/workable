#!/bin/bash

# Script para probar endpoint de habilidades con cURL

echo "🧪 PROBANDO ENDPOINT DE HABILIDADES"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar que el backend está corriendo
if ! timeout 2 bash -c "cat < /dev/null > /dev/tcp/localhost/8080" 2>/dev/null; then
    echo -e "${RED}✗ Backend NO está disponible${NC}"
    echo "Inicia el backend con: ./run-project-linux.sh"
    exit 1
fi

echo -e "${GREEN}✓ Backend disponible${NC}"
echo ""

# Solicitar token
read -p "Ingresa tu TOKEN JWT (obtenlo del localStorage al iniciar sesión): " TOKEN

if [ -z "$TOKEN" ]; then
    echo -e "${RED}✗ Token vacío${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo "TEST 1: Obtener habilidades del usuario autenticado"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

RESPONSE=$(curl -s -X GET "http://localhost:8080/api/habilidad/aspirante" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo "TEST 2: Crear nueva habilidad"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

RESPONSE=$(curl -s -X POST "http://localhost:8080/api/habilidad" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "nombre": "React.js",
        "descripcion": "Librería para construir interfaces",
        "nivel": "AVANZADO"
    }')

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo -e "${GREEN}✓ Tests completados${NC}"
