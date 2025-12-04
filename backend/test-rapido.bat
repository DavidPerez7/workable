@echo off
chcp 65001 >nul
echo ========================================
echo   PRUEBA RÁPIDA DEL BACKEND
echo ========================================
echo.

REM Verificar pom.xml
if not exist "pom.xml" (
    echo Error: Ejecuta desde el directorio backend
    pause
    exit /b 1
)

echo Compilando y ejecutando tests...
echo.

call mvn clean test

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================
    echo   ✓ TODOS LOS TESTS PASARON
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   ✗ ALGUNOS TESTS FALLARON
    echo ========================================
)

echo.
pause
