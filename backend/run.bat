@echo off
REM ==============================================================================
REM run.bat - Iniciar el servidor Spring Boot
REM ==============================================================================
echo.
echo ============================================
echo    WORKABLE - Iniciando Spring Boot
echo ============================================
echo.

cd /d "%~dp0"

REM Verificar si existe mvnw.cmd
if exist mvnw.cmd (
    echo Usando Maven Wrapper...
    call mvnw.cmd spring-boot:run
) else (
    echo Usando Maven del sistema...
    call mvn spring-boot:run
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Fallo al iniciar el servidor
    pause
    exit /b 1
)
