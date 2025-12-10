@echo off
chcp 65001 >nul
cls

:MENU
echo.
echo ========================================
echo   MENÚ DE GESTIÓN BACKEND - WORKABLE
echo ========================================
echo.
echo   1. Verificar proyecto y entorno
echo   2. Prueba rápida (solo tests)
echo   3. Pruebas completas (clean, compile, test, package)
echo   4. Iniciar servidor (puerto 8080)
echo   5. Detener servidor (liberar puerto 8080)
echo   6. Limpiar proyecto (mvn clean)
echo   7. Ver logs de errores
echo   8. Salir
echo.
echo ========================================
set /p OPCION="Selecciona una opción (1-8): "

if "%OPCION%"=="1" goto VERIFICAR
if "%OPCION%"=="2" goto TEST_RAPIDO
if "%OPCION%"=="3" goto TEST_COMPLETO
if "%OPCION%"=="4" goto INICIAR
if "%OPCION%"=="5" goto DETENER
if "%OPCION%"=="6" goto LIMPIAR
if "%OPCION%"=="7" goto LOGS
if "%OPCION%"=="8" goto SALIR

echo Opción inválida
timeout /t 2 >nul
cls
goto MENU

:VERIFICAR
cls
call verificar-proyecto.bat
cls
goto MENU

:TEST_RAPIDO
cls
call test-rapido.bat
cls
goto MENU

:TEST_COMPLETO
cls
call test-backend.bat
cls
goto MENU

:INICIAR
cls
call iniciar-servidor.bat
cls
goto MENU

:DETENER
cls
echo Deteniendo servidor en puerto 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Matando proceso PID: %%a
    taskkill /F /PID %%a
)
echo.
echo Servidor detenido
pause
cls
goto MENU

:LIMPIAR
cls
echo Limpiando proyecto...
call mvn clean
echo.
echo Limpieza completada
pause
cls
goto MENU

:LOGS
cls
echo ========================================
echo   ÚLTIMOS ERRORES DE COMPILACIÓN
echo ========================================
echo.
if exist "target\surefire-reports" (
    dir /b target\surefire-reports\*.txt 2>nul
    if %ERRORLEVEL% equ 0 (
        echo.
        echo Archivos de reporte encontrados en target\surefire-reports\
    ) else (
        echo No se encontraron reportes de tests
    )
) else (
    echo No existe el directorio de reportes
)
echo.
if exist "output.txt" (
    echo Contenido de output.txt:
    echo ----------------------------------------
    type output.txt
) else (
    echo No se encontró output.txt
)
echo.
pause
cls
goto MENU

:SALIR
echo.
echo Saliendo...
exit /b 0
