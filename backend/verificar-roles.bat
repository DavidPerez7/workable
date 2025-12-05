@echo off
REM Script para verificar las correcciones de roles
REM Requiere: curl, jq (opcional pero recomendado)

setlocal enabledelayedexpansion

echo.
echo ============================================
echo     VERIFICADOR DE ROLES - Backend Workable
echo ============================================
echo.

set BASE_URL=http://localhost:8080

REM Colores (si cmd soporta)
set ERROR=[FAIL]
set SUCCESS=[PASS]

echo Verificando conexion al servidor...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/api/empresa/publicas > temp.txt
set /p HTTP_CODE=<temp.txt
del temp.txt

if "%HTTP_CODE%"=="200" (
    echo %SUCCESS% Servidor activo en %BASE_URL%
) else (
    echo %ERROR% No se puede conectar a %BASE_URL%
    echo Asegurate de que el servidor Spring Boot este corriendo
    pause
    exit /b 1
)

echo.
echo ============================================
echo 1. PRUEBA: Acceso PUBLICO a empresas (sin token)
echo ============================================
echo.
echo Ejecutando: GET %BASE_URL%/api/empresa/publicas
echo.
curl -s -X GET "%BASE_URL%/api/empresa/publicas" ^
    -H "Content-Type: application/json" | jq . 2>nul || curl -s -X GET "%BASE_URL%/api/empresa/publicas" -H "Content-Type: application/json"

echo.
echo Resultado esperado: [{"id": 1, "nombre": "...", "isActive": true}, ...]
echo.

REM Agregar mas pruebas segun necesidad
echo.
echo ============================================
echo NOTAS IMPORTANTES:
echo ============================================
echo.
echo - Para pruebas con autenticacion, necesitas:
echo   1. Registrar usuarios (ASPIRANTE, RECLUTADOR)
echo   2. Obtener tokens del endpoint de login
echo   3. Pasar tokens en header "Authorization: Bearer [token]"
echo.
echo - Revisa GUIA_PRUEBAS_ROLES.md para ejemplos completos
echo.
echo - Comandos comun con curl:
echo   GET:    curl -X GET [url] -H "Authorization: Bearer [token]"
echo   POST:   curl -X POST [url] -H "Authorization: Bearer [token]" -d "{...}"
echo   PUT:    curl -X PUT [url] -H "Authorization: Bearer [token]" -d "{...}"
echo   DELETE: curl -X DELETE [url] -H "Authorization: Bearer [token]"
echo.

pause
