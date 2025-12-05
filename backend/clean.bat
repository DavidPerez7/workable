@echo off
REM ==============================================================================
REM clean.bat - Limpiar el proyecto Spring Boot
REM ==============================================================================
echo.
echo ============================================
echo    WORKABLE - Limpiando proyecto
echo ============================================
echo.

cd /d "%~dp0"

REM Verificar si existe mvnw.cmd
if exist mvnw.cmd (
    echo Usando Maven Wrapper...
    call mvnw.cmd clean
) else (
    echo Usando Maven del sistema...
    call mvn clean
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo    LIMPIEZA EXITOSA
    echo ============================================
    echo.
    echo Directorio target eliminado correctamente
) else (
    echo.
    echo [ERROR] Fallo en la limpieza
    pause
    exit /b 1
)
