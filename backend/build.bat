@echo off
REM ==============================================================================
REM build.bat - Compilar el proyecto Spring Boot
REM ==============================================================================
echo.
echo ============================================
echo    WORKABLE - Compilando proyecto
echo ============================================
echo.

cd /d "%~dp0"

REM Verificar si existe mvnw.cmd
if exist mvnw.cmd (
    echo Usando Maven Wrapper...
    call mvnw.cmd clean package -DskipTests
) else (
    echo Usando Maven del sistema...
    call mvn clean package -DskipTests
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo    BUILD EXITOSO
    echo ============================================
    echo.
    echo El JAR se encuentra en: target\workable-0.0.1-SNAPSHOT.jar
    echo.
    echo Para ejecutar: java -jar target\workable-0.0.1-SNAPSHOT.jar
) else (
    echo.
    echo [ERROR] Fallo en la compilacion
    pause
    exit /b 1
)
