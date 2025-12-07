#!/bin/bash

# Script para ejecutar el frontend de Workable
# Verifica dependencias, mata procesos existentes y inicia uno nuevo

FRONTEND_DIR="$(dirname "$0")"  # Directorio donde está el script (frontend)
DEFAULT_PORT=5173

echo "Verificando dependencias..."

# Verificación rápida de Node.js y npm
if ! command -v node &> /dev/null; then
    echo "Error: Node.js no está instalado o no está en PATH."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "Error: npm no está instalado o no está en PATH."
    exit 1
fi

echo "Dependencias OK. Verificando procesos de Vite existentes..."

# Buscar procesos de Vite (excluyendo este script y grep)
VITE_PIDS=$(ps aux | grep '[v]ite' | awk '{print $2}')

if [ ! -z "$VITE_PIDS" ]; then
    echo "Encontrados procesos de Vite: $VITE_PIDS"
    echo "Matando procesos existentes..."
    for PID in $VITE_PIDS; do
        kill -9 $PID 2>/dev/null
        echo "Proceso $PID terminado."
    done
else
    echo "No se encontraron procesos de Vite corriendo."
fi

# Verificar si el puerto por defecto está en uso
echo "Verificando puerto $DEFAULT_PORT..."
if lsof -i :$DEFAULT_PORT > /dev/null 2>&1; then
    echo "Puerto $DEFAULT_PORT en uso. Matando proceso que lo ocupa..."
    PORT_PIDS=$(lsof -ti :$DEFAULT_PORT)
    for PID in $PORT_PIDS; do
        kill -9 $PID 2>/dev/null
        echo "Proceso en puerto $PID terminado."
    done
else
    echo "Puerto $DEFAULT_PORT libre."
fi

# Ejecutar el frontend
echo "Iniciando frontend..."
npm run dev