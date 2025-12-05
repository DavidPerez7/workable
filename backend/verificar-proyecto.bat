@echo off
chcp 65001 >nul
echo ========================================
echo   VERIFICACIÓN DEL PROYECTO BACKEND
echo ========================================
echo.

REM Verificar Java
echo [1] Verificando Java...
java -version 2>&1 | findstr /i "version" >nul
if %ERRORLEVEL% equ 0 (
    java -version 2>&1 | findstr "version"
    echo ✓ Java instalado
) else (
    echo ✗ Java no encontrado
)
echo.

REM Verificar Maven
echo [2] Verificando Maven...
mvn -version 2>&1 | findstr /i "Apache Maven" >nul
if %ERRORLEVEL% equ 0 (
    mvn -version | findstr "Apache Maven"
    echo ✓ Maven instalado
) else (
    echo ✗ Maven no encontrado
)
echo.

REM Verificar estructura del proyecto
echo [3] Verificando estructura del proyecto...
if exist "pom.xml" (
    echo ✓ pom.xml encontrado
) else (
    echo ✗ pom.xml no encontrado
)

if exist "src\main\java" (
    echo ✓ Directorio src\main\java existe
) else (
    echo ✗ Directorio src\main\java no existe
)

if exist "src\main\resources\application.properties" (
    echo ✓ application.properties encontrado
) else (
    echo ✗ application.properties no encontrado
)
echo.

REM Verificar puerto 8080
echo [4] Verificando puerto 8080...
netstat -ano | findstr :8080 | findstr LISTENING >nul
if %ERRORLEVEL% equ 0 (
    echo ⚠ Puerto 8080 está en uso
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
        echo   PID: %%a
    )
) else (
    echo ✓ Puerto 8080 disponible
)
echo.

REM Verificar conexión a base de datos (si el servidor está corriendo)
echo [5] Estado del servidor...
curl -s http://localhost:8080/actuator/health >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✓ Servidor ejecutándose en http://localhost:8080
) else (
    echo ○ Servidor no está ejecutándose
)
echo.

echo ========================================
echo   VERIFICACIÓN COMPLETADA
echo ========================================
echo.
pause
