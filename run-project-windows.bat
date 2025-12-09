@echo off
REM Script principal para ejecutar el proyecto Workable (Backend + Frontend) en Windows
REM Proporciona opciones para ejecutar backend, frontend o ambos en terminales separadas

setlocal enabledelayedexpansion

REM Configuración de colores y estilos (simulados con mensajes)
set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%backend"
set "FRONTEND_DIR=%SCRIPT_DIR%frontend"

REM Puertos
set "BACKEND_PORT=8080"
set "FRONTEND_PORT=5173"

REM Variables para control de procesos
set "BACKEND_PID_FILE=%TEMP%\workable-backend.pid"
set "FRONTEND_PID_FILE=%TEMP%\workable-frontend.pid"

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
    goto :eof

:print_success
    echo [SUCCESS] %~1
    goto :eof

:print_error
    echo [ERROR] %~1
    goto :eof

:print_warning
    echo [WARNING] %~1
    goto :eof

REM Verificar si una herramienta está disponible
:check_command
    where %~1 >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] %~1 no está instalado o no está en PATH.
        exit /b 1
    )
    exit /b 0

:check_dependencies
    call :print_header "Verificando Dependencias"
    
    setlocal
    set "deps_ok=true"
    
    REM Verificar Node.js y npm
    where node >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        call :print_error "Node.js no está instalado"
        set "deps_ok=false"
    ) else (
        for /f "tokens=*" %%A in ('node --version') do (
            call :print_success "Node.js encontrado: %%A"
        )
    )
    
    where npm >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        call :print_error "npm no está instalado"
        set "deps_ok=false"
    ) else (
        for /f "tokens=*" %%A in ('npm --version') do (
            call :print_success "npm encontrado: %%A"
        )
    )
    
    REM Verificar Java
    where java >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        call :print_error "Java no está instalado"
        set "deps_ok=false"
    ) else (
        for /f "tokens=*" %%A in ('java -version 2^>^&1 ^| findstr /R "java"') do (
            call :print_success "Java encontrado: %%A"
        )
    )
    
    REM Verificar Maven
    where mvn >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        call :print_error "Maven no está instalado"
        set "deps_ok=false"
    ) else (
        for /f "tokens=*" %%A in ('mvn --version ^| findstr /R "Apache"') do (
            call :print_success "Maven encontrado: %%A"
        )
    )
    
    if "!deps_ok!"=="false" (
        call :print_error "Faltan algunas dependencias. Instálalas e intenta de nuevo."
        exit /b 1
    )
    
    call :print_success "Todas las dependencias están disponibles"
    exit /b 0

:validate_project_structure
    call :print_header "Validando Estructura del Proyecto"
    
    if not exist "%BACKEND_DIR%" (
        call :print_error "Directorio backend no encontrado: %BACKEND_DIR%"
        exit /b 1
    )
    call :print_success "Directorio backend encontrado"
    
    if not exist "%BACKEND_DIR%\pom.xml" (
        call :print_error "pom.xml no encontrado en backend"
        exit /b 1
    )
    call :print_success "pom.xml encontrado"
    
    if not exist "%FRONTEND_DIR%" (
        call :print_error "Directorio frontend no encontrado: %FRONTEND_DIR%"
        exit /b 1
    )
    call :print_success "Directorio frontend encontrado"
    
    if not exist "%FRONTEND_DIR%\package.json" (
        call :print_error "package.json no encontrado en frontend"
        exit /b 1
    )
    call :print_success "package.json encontrado"
    
    exit /b 0

:stop_all_processes
    call :print_header "DETENIENDO PROCESOS"
    
    setlocal
    set "stopped=false"
    
    REM Detener procesos Java
    tasklist | find /I "java.exe" >nul
    if !ERRORLEVEL! EQU 0 (
        taskkill /F /IM java.exe >nul 2>nul
        call :print_success "Procesos Java detenidos"
        set "stopped=true"
    )
    
    REM Detener procesos Node
    tasklist | find /I "node.exe" >nul
    if !ERRORLEVEL! EQU 0 (
        taskkill /F /IM node.exe >nul 2>nul
        call :print_success "Procesos Node.js detenidos"
        set "stopped=true"
    )
    
    timeout /t 2 /nobreak >nul
    
    if "!stopped!"=="true" (
        call :print_success "Todos los procesos han sido detenidos correctamente"
    ) else (
        call :print_warning "No hay procesos en ejecución"
    )
    
    exit /b 0

REM ===== FUNCIONES PRINCIPALES =====

:run_backend
    call :print_header "INICIANDO BACKEND (Spring Boot)"
    
    cd /d "%BACKEND_DIR%"
    
    if not exist "pom.xml" (
        call :print_error "No se encuentra pom.xml en %BACKEND_DIR%"
        exit /b 1
    )
    
    call :print_success "Compilando proyecto con Maven..."
    mvn clean package -DskipTests -q
    
    if !ERRORLEVEL! NEQ 0 (
        call :print_error "Error compilando el backend"
        exit /b 1
    )
    
    call :print_success "Iniciando Spring Boot en puerto %BACKEND_PORT%..."
    echo [INFO] Presiona Ctrl+C para detener el backend
    
    java -jar target/workable-0.0.1-SNAPSHOT.jar
    
    if !ERRORLEVEL! EQU 0 (
        call :print_success "Backend detenido correctamente"
    ) else (
        call :print_warning "Backend detenido"
    )
    
    exit /b 0

:run_frontend
    call :print_header "INICIANDO FRONTEND (Vite)"
    
    cd /d "%FRONTEND_DIR%"
    
    if not exist "package.json" (
        call :print_error "No se encuentra package.json en %FRONTEND_DIR%"
        exit /b 1
    )
    
    REM Verificar si node_modules existe
    if not exist "node_modules" (
        call :print_warning "node_modules no encontrado. Instalando dependencias..."
        call npm install
        if !ERRORLEVEL! NEQ 0 (
            call :print_error "Error instalando dependencias de frontend"
            exit /b 1
        )
    )
    
    call :print_success "Iniciando Vite en puerto %FRONTEND_PORT%..."
    echo [INFO] Presiona Ctrl+C para detener el frontend
    
    call npm run dev
    
    call :print_warning "Frontend detenido"
    exit /b 0

:run_both
    call :print_header "INICIANDO BACKEND Y FRONTEND"
    
    call :validate_project_structure
    if !ERRORLEVEL! NEQ 0 exit /b 1
    
    REM Compilar backend primero
    cd /d "%BACKEND_DIR%"
    call :print_success "Compilando backend..."
    mvn clean package -DskipTests -q
    
    if !ERRORLEVEL! NEQ 0 (
        call :print_error "Error compilando el backend"
        exit /b 1
    )
    
    REM Iniciar backend en nueva terminal
    call :print_success "Abriendo ventana para Backend..."
    start "Workable Backend" cmd /k "cd /d "%BACKEND_DIR%" && java -jar target/workable-0.0.1-SNAPSHOT.jar"
    
    timeout /t 5 /nobreak >nul
    
    REM Iniciar frontend en nueva terminal
    call :print_success "Abriendo ventana para Frontend..."
    start "Workable Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm install && npm run dev"
    
    call :print_header "AMBOS SERVICIOS INICIADOS"
    echo [INFO] Backend: http://localhost:%BACKEND_PORT%
    echo [INFO] Frontend: http://localhost:%FRONTEND_PORT%
    echo [INFO] Ambas ventanas permanecerán abiertas
    echo.
    
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
    echo   6) Salir
    echo.
    exit /b 0

REM ===== FLUJO PRINCIPAL =====

:menu_loop
    cls
    call :show_menu
    set /p choice="Ingresa el número de tu opción (1-6): "
    
    if "%choice%"=="1" (
        call :run_backend
        pause
        goto menu_loop
    ) else if "%choice%"=="2" (
        call :run_frontend
        pause
        goto menu_loop
    ) else if "%choice%"=="3" (
        call :run_both
        goto end
    ) else if "%choice%"=="4" (
        call :stop_all_processes
        pause
        goto menu_loop
    ) else if "%choice%"=="5" (
        call :check_dependencies
        pause
        goto menu_loop
    ) else if "%choice%"=="6" (
        goto end
    ) else (
        cls
        call :print_error "Opción inválida. Por favor ingresa un número entre 1 y 6."
        timeout /t 2 /nobreak >nul
        goto menu_loop
    )

:end
    call :print_success "Hasta luego!"
    timeout /t 2 /nobreak >nul
    exit /b 0
