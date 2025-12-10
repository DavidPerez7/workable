@echo off
REM Script principal para ejecutar el proyecto Workable (Backend + Frontend) en Windows
REM Mejorado con: error handling robusto, logging detallado, MySQL start
REM Nota: Requiere permisos de administrador para XAMPP

setlocal enabledelayedexpansion

REM Configuración
set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%backend"
set "FRONTEND_DIR=%SCRIPT_DIR%frontend"
set "LOG_DIR=%TEMP%\workable-logs"
set "BACKEND_LOG=%LOG_DIR%\backend.log"
set "FRONTEND_LOG=%LOG_DIR%\frontend.log"

REM Puertos
set "BACKEND_PORT=8080"
set "FRONTEND_PORT=5173"

REM Crear directorio de logs
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

cls
color 0B
title Workable Project Manager - Windows

REM ===== FUNCIONES AUXILIARES =====

:print_header
    echo.
    echo ========================================
    echo    %~1
    echo ========================================
    echo.
    exit /b 0

:print_success
    echo [SUCCESS] %~1
    exit /b 0

:print_error
    echo [ERROR] %~1
    exit /b 0

:print_warning
    echo [WARNING] %~1
    exit /b 0

:print_info
    echo [INFO] %~1
    exit /b 0

REM Verificar si una herramienta está disponible
:check_command
    where %~1 >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        exit /b 1
    )
    exit /b 0

:check_dependencies
    call :print_header "Verificando Dependencias"
    
    set "deps_ok=true"
    
    REM Verificar Node.js
    call :check_command "node"
    if !ERRORLEVEL! EQU 0 (
        for /f "tokens=*" %%A in ('node --version') do (
            echo [SUCCESS] Node.js encontrado: %%A
        )
    ) else (
        echo [ERROR] Node.js no está instalado
        set "deps_ok=false"
    )
    
    REM Verificar npm
    call :check_command "npm"
    if !ERRORLEVEL! EQU 0 (
        for /f "tokens=*" %%A in ('npm --version') do (
            echo [SUCCESS] npm encontrado: %%A
        )
    ) else (
        echo [ERROR] npm no está instalado
        set "deps_ok=false"
    )
    
    REM Verificar Java
    call :check_command "java"
    if !ERRORLEVEL! EQU 0 (
        for /f "tokens=*" %%A in ('java -version 2^>^&1 ^| findstr /R "java"') do (
            echo [SUCCESS] Java encontrado: %%A
        )
    ) else (
        echo [ERROR] Java no está instalado
        set "deps_ok=false"
    )
    
    REM Verificar Maven
    call :check_command "mvn"
    if !ERRORLEVEL! EQU 0 (
        for /f "tokens=*" %%A in ('mvn --version 2^>^&1 ^| findstr /R "Apache"') do (
            echo [SUCCESS] Maven encontrado: %%A
        )
    ) else (
        echo [ERROR] Maven no está instalado
        set "deps_ok=false"
    )
    
    if "!deps_ok!"=="false" (
        echo [ERROR] Faltan algunas dependencias. Instálalas e intenta de nuevo.
        exit /b 1
    )
    
    echo [SUCCESS] Todas las dependencias están disponibles
    exit /b 0

:validate_project_structure
    call :print_header "Validando Estructura del Proyecto"
    
    if not exist "%BACKEND_DIR%" (
        echo [ERROR] Directorio backend no encontrado: %BACKEND_DIR%
        exit /b 1
    )
    echo [SUCCESS] Directorio backend encontrado
    
    if not exist "%BACKEND_DIR%\pom.xml" (
        echo [ERROR] pom.xml no encontrado en backend
        exit /b 1
    )
    echo [SUCCESS] pom.xml encontrado
    
    if not exist "%FRONTEND_DIR%" (
        echo [ERROR] Directorio frontend no encontrado: %FRONTEND_DIR%
        exit /b 1
    )
    echo [SUCCESS] Directorio frontend encontrado
    
    if not exist "%FRONTEND_DIR%\package.json" (
        echo [ERROR] package.json no encontrado en frontend
        exit /b 1
    )
    echo [SUCCESS] package.json encontrado
    
    exit /b 0

:ensure_mysql_running
    call :print_header "Verificando MySQL"
    
    REM Verificar si MySQL está corriendo (buscar mysqld.exe)
    tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
    if !ERRORLEVEL! EQU 0 (
        echo [SUCCESS] MySQL ya está corriendo
        exit /b 0
    )
    
    echo [WARNING] MySQL no está corriendo. Intentando iniciar XAMPP...
    
    REM Buscar XAMPP en ubicaciones comunes
    if exist "C:\xampp\xampp_control.exe" (
        echo [INFO] Encontrado XAMPP en: C:\xampp
        echo [WARNING] Iniciando XAMPP (puede requerir permisos de administrador)...
        
        REM Intentar iniciar XAMPP con MySQL
        cd /d "C:\xampp"
        
        REM Buscar el ejecutable de control o apache/mysql start scripts
        if exist "xampp_control.exe" (
            REM Iniciar MySQL directamente si es posible
            if exist "mysql\bin\mysqld.exe" (
                echo [INFO] Iniciando MySQL directamente...
                start "" "mysql\bin\mysqld.exe" --defaults-file=mysql\bin\my.ini
                timeout /t 10 /nobreak >nul
                exit /b 0
            )
        )
    )
    
    REM Intentar otros caminos comunes
    for %%D in (
        "D:\xampp"
        "E:\xampp"
        "%ProgramFiles%\xampp"
        "%ProgramFiles(x86)%\xampp"
    ) do (
        if exist "%%D\mysql\bin\mysqld.exe" (
            echo [INFO] Encontrado XAMPP en: %%D
            echo [INFO] Iniciando MySQL...
            start "" "%%D\mysql\bin\mysqld.exe" --defaults-file="%%D\mysql\bin\my.ini"
            timeout /t 10 /nobreak >nul
            
            REM Verificar que MySQL está corriendo
            tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
            if !ERRORLEVEL! EQU 0 (
                echo [SUCCESS] MySQL iniciado correctamente
                exit /b 0
            )
        )
    )
    
    echo [ERROR] No se pudo iniciar MySQL. Asegúrate de que:
    echo   1. XAMPP esté instalado en C:\xampp u otra ubicación
    echo   2. O MySQL esté instalado como servicio de Windows
    echo   3. Puedes intentar iniciar XAMPP Control Panel manualmente
    exit /b 1

:stop_all_processes
    call :print_header "DETENIENDO PROCESOS"
    
    set "stopped=false"
    
    REM Detener procesos Java
    tasklist | find /I "java.exe" >nul
    if !ERRORLEVEL! EQU 0 (
        taskkill /F /IM java.exe >nul 2>nul
        echo [SUCCESS] Procesos Java detenidos
        set "stopped=true"
    )
    
    REM Detener procesos Node
    tasklist | find /I "node.exe" >nul
    if !ERRORLEVEL! EQU 0 (
        taskkill /F /IM node.exe >nul 2>nul
        echo [SUCCESS] Procesos Node.js detenidos
        set "stopped=true"
    )
    
    timeout /t 2 /nobreak >nul
    
    if "!stopped!"=="true" (
        echo [SUCCESS] Todos los procesos han sido detenidos
    ) else (
        echo [WARNING] No hay procesos en ejecución
    )
    
    exit /b 0

REM ===== FUNCIONES PRINCIPALES =====

:run_backend
    call :print_header "INICIANDO BACKEND (Spring Boot)"
    
    REM Asegurar que MySQL está corriendo
    call :ensure_mysql_running
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] No se puede iniciar el backend sin MySQL
        pause
        exit /b 1
    )
    
    cd /d "%BACKEND_DIR%"
    
    if not exist "pom.xml" (
        echo [ERROR] No se encuentra pom.xml en %BACKEND_DIR%
        pause
        exit /b 1
    )
    
    echo [INFO] Compilando proyecto Backend con Maven...
    echo [WARNING] Esto puede tomar algunos minutos la primera vez...
    
    call mvn clean package -DskipTests -q
    
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Error compilando el backend
        echo [INFO] Revisa: %BACKEND_LOG%
        pause
        exit /b 1
    )
    
    echo [SUCCESS] Compilación completada
    
    REM Verificar que el JAR se creó
    if not exist "target\workable-0.0.1-SNAPSHOT.jar" (
        echo [ERROR] JAR no fue creado después de la compilación
        pause
        exit /b 1
    )
    
    echo [SUCCESS] Iniciando Spring Boot en puerto %BACKEND_PORT%...
    echo [INFO] Presiona Ctrl+C para detener el backend
    
    java -jar target/workable-0.0.1-SNAPSHOT.jar
    
    echo [WARNING] Backend detenido
    exit /b 0

:run_frontend
    call :print_header "INICIANDO FRONTEND (Vite)"
    
    cd /d "%FRONTEND_DIR%"
    
    if not exist "package.json" (
        echo [ERROR] No se encuentra package.json en %FRONTEND_DIR%
        pause
        exit /b 1
    )
    
    REM Verificar si node_modules existe
    if not exist "node_modules" (
        echo [WARNING] node_modules no encontrado. Instalando dependencias...
        call npm install
        if !ERRORLEVEL! NEQ 0 (
            echo [ERROR] Error instalando dependencias de frontend
            pause
            exit /b 1
        )
    )
    
    echo [SUCCESS] Iniciando Vite en puerto %FRONTEND_PORT%...
    echo [INFO] Presiona Ctrl+C para detener el frontend
    
    call npm run dev
    
    echo [WARNING] Frontend detenido
    exit /b 0

:run_both
    call :print_header "INICIANDO BACKEND Y FRONTEND"
    
    call :validate_project_structure
    if !ERRORLEVEL! NEQ 0 (
        pause
        exit /b 1
    )
    
    REM Asegurar MySQL
    call :ensure_mysql_running
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] No se puede iniciar sin MySQL
        pause
        exit /b 1
    )
    
    REM Compilar backend primero
    cd /d "%BACKEND_DIR%"
    echo [INFO] Compilando backend...
    call mvn clean package -DskipTests -q
    
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Error compilando el backend
        pause
        exit /b 1
    )
    
    REM Verificar que el JAR se creó
    if not exist "target\workable-0.0.1-SNAPSHOT.jar" (
        echo [ERROR] JAR no fue creado
        pause
        exit /b 1
    )
    
    echo [SUCCESS] Backend compilado
    
    REM Iniciar backend en nueva terminal
    echo [INFO] Abriendo ventana para Backend...
    start "Workable Backend" cmd /k "cd /d "%BACKEND_DIR%" && echo [INFO] Iniciando Backend... && java -jar target/workable-0.0.1-SNAPSHOT.jar"
    
    timeout /t 5 /nobreak >nul
    
    REM Iniciar frontend en nueva terminal
    echo [INFO] Abriendo ventana para Frontend...
    start "Workable Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && echo [INFO] Instalando dependencias... && npm install && echo [INFO] Iniciando Vite... && npm run dev"
    
    call :print_header "AMBOS SERVICIOS INICIADOS"
    echo [INFO] Backend:  http://localhost:%BACKEND_PORT%
    echo [INFO] Frontend: http://localhost:%FRONTEND_PORT%
    echo [INFO] Ambas ventanas permanecerán abiertas
    echo [INFO] Ciérralas cuando quieras detener los servicios
    echo.
    
    pause
    exit /b 0

:show_menu
    call :print_header "WORKABLE PROJECT MANAGER - MENÚ PRINCIPAL"
    echo.
    echo Selecciona una opción:
    echo.
    echo   1) Iniciar Backend (Terminal actual)
    echo   2) Iniciar Frontend (Terminal actual)
    echo   3) Iniciar Backend + Frontend (Nuevas terminales)
    echo   4) Detener todos los procesos
    echo   5) Verificar dependencias
    echo   6) Validar estructura del proyecto
    echo   7) Salir
    echo.
    exit /b 0

REM ===== FLUJO PRINCIPAL =====

:menu_loop
    cls
    call :show_menu
    set /p choice="Ingresa el número de tu opción (1-7): "
    
    if "%choice%"=="1" (
        call :run_backend
        goto menu_loop
    ) else if "%choice%"=="2" (
        call :run_frontend
        goto menu_loop
    ) else if "%choice%"=="3" (
        call :run_both
        goto menu_loop
    ) else if "%choice%"=="4" (
        call :stop_all_processes
        pause
        goto menu_loop
    ) else if "%choice%"=="5" (
        call :check_dependencies
        pause
        goto menu_loop
    ) else if "%choice%"=="6" (
        call :validate_project_structure
        pause
        goto menu_loop
    ) else if "%choice%"=="7" (
        goto end
    ) else (
        cls
        echo [ERROR] Opción inválida. Por favor ingresa un número entre 1 y 7.
        timeout /t 2 /nobreak >nul
        goto menu_loop
    )

:end
    call :print_header "DETENIENDO TODO"
    call :stop_all_processes
    echo.
    echo [SUCCESS] Hasta luego!
    timeout /t 2 /nobreak >nul
    exit /b 0
