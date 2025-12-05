@echo off
REM ==============================================================================
REM test.bat - Ejecutar pruebas unitarias del proyecto
REM ==============================================================================
echo.
echo ============================================
echo    WORKABLE - Ejecutando Pruebas
echo ============================================
echo.

cd /d "%~dp0"

REM Verificar si existe mvnw.cmd
if exist mvnw.cmd (
    echo Usando Maven Wrapper...
    call mvnw.cmd test
) else (
    echo Usando Maven del sistema...
    call mvn test
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo    TODAS LAS PRUEBAS PASARON
    echo ============================================
    echo.
    echo Ver reportes en: target\surefire-reports
) else (
    echo.
    echo [ERROR] Algunas pruebas fallaron
    echo Ver reportes en: target\surefire-reports
    pause
    exit /b 1
)
