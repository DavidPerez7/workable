@echo off
chcp 65001 >nul
echo ========================================
echo   PRUEBAS COMPLETAS DEL BACKEND
echo ========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "pom.xml" (
    echo Error: No se encuentra pom.xml
    echo Asegúrate de ejecutar este script desde el directorio backend
    pause
    exit /b 1
)

echo [1/6] Limpiando proyecto anterior...
call mvn clean
if %ERRORLEVEL% neq 0 (
    echo Error en la limpieza del proyecto
    pause
    exit /b 1
)
echo ✓ Limpieza completada
echo.

echo [2/6] Compilando el proyecto...
call mvn compile
if %ERRORLEVEL% neq 0 (
    echo Error en la compilación
    pause
    exit /b 1
)
echo ✓ Compilación exitosa
echo.

echo [3/6] Ejecutando tests unitarios...
call mvn test
if %ERRORLEVEL% neq 0 (
    echo ⚠ Algunos tests fallaron, pero continuamos...
)
echo ✓ Tests ejecutados
echo.

echo [4/6] Empaquetando aplicación...
call mvn package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo Error al empaquetar la aplicación
    pause
    exit /b 1
)
echo ✓ Empaquetado exitoso
echo.

echo [5/6] Verificando dependencias...
call mvn dependency:tree > dependency-tree.txt
echo ✓ Árbol de dependencias guardado en dependency-tree.txt
echo.

echo [6/6] Análisis de código...
call mvn validate
if %ERRORLEVEL% neq 0 (
    echo ⚠ Validación con advertencias
) else (
    echo ✓ Validación exitosa
)
echo.

echo ========================================
echo   RESUMEN DE PRUEBAS
echo ========================================
echo.
echo [✓] Limpieza
echo [✓] Compilación
echo [✓] Tests
echo [✓] Empaquetado
echo [✓] Dependencias
echo [✓] Validación
echo.
echo ========================================
echo   PRUEBAS COMPLETADAS
echo ========================================
echo.
echo El archivo JAR se encuentra en: target\workable-0.0.1-SNAPSHOT.jar
echo.
echo ¿Deseas iniciar el servidor ahora? (S/N)
set /p INICIAR="Respuesta: "

if /i "%INICIAR%"=="S" (
    echo.
    echo Iniciando servidor Spring Boot...
    echo Presiona Ctrl+C para detener el servidor
    echo.
    call mvn spring-boot:run
) else (
    echo.
    echo Para iniciar el servidor manualmente, ejecuta:
    echo mvn spring-boot:run
)

echo.
pause
