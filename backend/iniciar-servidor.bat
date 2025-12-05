@echo off
chcp 65001 >nul
echo ========================================
echo   INICIAR SERVIDOR BACKEND
echo ========================================
echo.

if not exist "pom.xml" (
    echo Error: Ejecuta desde el directorio backend
    pause
    exit /b 1
)

echo Limpiando puerto 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Matando proceso en puerto 8080 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Iniciando servidor Spring Boot en puerto 8080...
echo URL: http://localhost:8080
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

call mvn spring-boot:run

pause
