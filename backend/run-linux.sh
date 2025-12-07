#!/bin/bash

# Auto-asignar permisos de ejecución
chmod +x "$0"

# run-linux.sh - Inicia XAMPP (MySQL) y luego el backend de Spring Boot

echo "========================================"
echo "   INICIANDO ENTORNO WORKABLE"
echo "========================================"
echo.

# Verificar si XAMPP/MySQL está corriendo
if pgrep -x "mysqld" > /dev/null; then
    echo "✓ XAMPP/MySQL ya está corriendo"
else
    echo "Iniciando XAMPP..."
    sudo /opt/lampp/lampp start
    if [ $? -eq 0 ]; then
        echo "✓ XAMPP iniciado correctamente"
        echo "Esperando 10 segundos para que MySQL esté listo..."
        sleep 10
    else
        echo "✗ Error al iniciar XAMPP"
        exit 1
    fi
fi

echo.
echo "========================================"
echo "   INICIANDO BACKEND SPRING BOOT"
echo "========================================"
echo.

# Cambiar al directorio backend (asumiendo que el script está en backend/)
cd "$(dirname "$0")"

# Verificar si existe pom.xml
if [ ! -f "pom.xml" ]; then
    echo "Error: No se encuentra pom.xml. Ejecuta desde el directorio backend."
    exit 1
fi

echo "Iniciando Spring Boot..."
mvn spring-boot:run