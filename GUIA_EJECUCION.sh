#!/bin/bash

# ============================================
#  GUÍA DE EJECUCIÓN - PROYECTO WORKABLE
# ============================================
#
# Este script contiene instrucciones para ejecutar el proyecto
# en Linux. Para Windows, usa run-project-windows.bat

# ============================================
# PRE-REQUISITOS
# ============================================
# Asegúrate de tener instalado:
# - Node.js 18+ (https://nodejs.org/)
# - Maven 3.8+ (https://maven.apache.org/)
# - Java 21 LTS (https://www.oracle.com/java/)
# - MySQL/XAMPP (https://www.apachefriends.org/)

# ============================================
# OPCIÓN 1: MENÚ INTERACTIVO (RECOMENDADO)
# ============================================
# 
# Simplemente ejecuta:
#
#   bash run-project-linux.sh
#
# Esto abrirá un menú con las siguientes opciones:
#   1) Ejecutar SOLO Backend (foreground)
#   2) Ejecutar SOLO Frontend (foreground)
#   3) Ejecutar Backend + Frontend (background)
#   4) Verificar Dependencias
#   5) Validar Estructura del Proyecto
#   6) Ver Logs
#   7) Detener Todos los Procesos
#   8) Salir
#

# ============================================
# OPCIÓN 2: EJECUCIÓN DIRECTA (AVANZADO)
# ============================================
#
# Para ejecución sin menú, usa los siguientes comandos:
#

# A. Solo Backend (espera a que se complete - presiona Ctrl+C para salir)
bash run-project-linux.sh --backend-only

# B. Solo Frontend (espera a que se complete - presiona Ctrl+C para salir)
bash run-project-linux.sh --frontend-only

# C. Backend en background
bash run-project-linux.sh --backend-bg

# D. Frontend en background  
bash run-project-linux.sh --frontend-bg

# E. Backend + Frontend en background (RECOMENDADO PARA DESARROLLO)
bash run-project-linux.sh --both

# ============================================
# MONITOREAR EJECUCIÓN
# ============================================
#
# Los logs se guardan en: /tmp/workable-logs/
#
# Ver logs en tiempo real:
#
#   # Backend
#   tail -f /tmp/workable-logs/backend.log
#   
#   # Frontend
#   tail -f /tmp/workable-logs/frontend.log
#   
#   # Health check
#   tail -f /tmp/workable-logs/health-check.log
#

# ============================================
# ACCEDER A LA APLICACIÓN
# ============================================
#
# Una vez que Backend + Frontend estén corriendo:
#
#   Frontend (UI):  http://localhost:5173
#   Backend (API):  http://localhost:8080
#   Health Check:   http://localhost:8080/api/health
#

# ============================================
# DETENER LA EJECUCIÓN
# ============================================
#
# Si ejecutaste con --both o en background:
#
#   # Opción 1: Usa el menú del script
#   bash run-project-linux.sh
#   # Selecciona opción 7 (Detener Todos los Procesos)
#   
#   # Opción 2: Mata los procesos directamente
#   pkill -f "java.*workable"  # Mata el backend
#   pkill -f "npm run dev"     # Mata el frontend
#

# ============================================
# SOLUCIÓN DE PROBLEMAS
# ============================================
#
# PROBLEMA: "MySQL no está corriendo"
# SOLUCIÓN: 
#   - Asegúrate que XAMPP esté en /opt/lampp
#   - O inicia MySQL manualmente: sudo systemctl start mysql
#   - O abre XAMPP Control Panel y inicia MySQL
#
# PROBLEMA: "Error compilando el backend"
# SOLUCIÓN:
#   - Revisa el log: tail -f /tmp/workable-logs/backend.log
#   - Intenta: cd backend && mvn clean package -DskipTests
#   - Verifica que tienes Java 21+: java -version
#
# PROBLEMA: "Puerto 8080 en uso"
# SOLUCIÓN:
#   - Mata el proceso: sudo lsof -ti :8080 | xargs kill -9
#   - O cambia el puerto en application.properties
#
# PROBLEMA: "Puerto 5173 en uso"
# SOLUCIÓN:
#   - Mata el proceso: sudo lsof -ti :5173 | xargs kill -9
#   - El script intenta liberar automáticamente este puerto
#

# ============================================
# CREDENCIALES DE PRUEBA
# ============================================
#
# Para probar el login:
#
# Admin:
#   Email: admin@admin.com
#   Password: admin123
#
# Reclutador:
#   Email: reclutador1@empresa.com
#   Password: reclutador123
#
# Aspirante:
#   Email: aspirante1@example.com
#   Password: aspirante123
#

# ============================================
# RUTAS PRINCIPALES DE LA API
# ============================================
#
# POST   /api/auth/login              - Iniciar sesión
# POST   /api/usuario/public          - Registrar usuario
# GET    /api/oferta                  - Listar ofertas de empleo
# GET    /api/empresa                 - Listar empresas
# POST   /api/postulacion             - Postularse a una oferta
# GET    /api/postulacion/aspirante   - Mis postulaciones
#
# Para más detalles, revisa la documentación en backend/Documentation/
#

echo "✓ Guía de ejecución cargada"
echo ""
echo "Ejecuta con:"
echo "  bash run-project-linux.sh"
echo ""
