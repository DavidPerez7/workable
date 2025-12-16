# Script principal para ejecutar el proyecto Workable (Backend + Frontend) en Windows
# Version: PowerShell
# Este script proporciona opciones para ejecutar backend, frontend o ambos

param(
    [string]$Action = "menu"
)

# Configuración
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $ScriptDir "backend"
$FrontendDir = Join-Path $ScriptDir "frontend"

$BackendPort = 8080
$FrontendPort = 5173

# Colores
$Colors = @{
    Success = "Green"
    Error   = "Red"
    Warning = "Yellow"
    Info    = "Cyan"
}

# ===== FUNCIONES AUXILIARES =====

function Print-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "========================================"  -ForegroundColor Cyan
    Write-Host "   $Message"                               -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Print-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

function Print-Warning {
    param([string]$Message)
    Write-Host "[⚠] $Message" -ForegroundColor Yellow
}

function Print-Info {
    param([string]$Message)
    Write-Host "[i] $Message" -ForegroundColor Cyan
}

# Verificar si una herramienta está disponible
function Test-Command {
    param([string]$Command)
    
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Verificar dependencias del proyecto
function Check-Dependencies {
    Print-Header "Verificando Dependencias"
    
    $DepsOk = $true
    
    # Verificar Node.js
    if (Test-Command "node") {
        $NodeVersion = & node --version
        Print-Success "Node.js encontrado: $NodeVersion"
    }
    else {
        Print-Error "Node.js no está instalado"
        $DepsOk = $false
    }
    
    # Verificar npm
    if (Test-Command "npm") {
        $NpmVersion = & npm --version
        Print-Success "npm encontrado: $NpmVersion"
    }
    else {
        Print-Error "npm no está instalado"
        $DepsOk = $false
    }
    
    # Verificar Java
    if (Test-Command "java") {
        $JavaVersion = & java -version 2>&1 | Select-Object -First 1
        Print-Success "Java encontrado: $JavaVersion"
    }
    else {
        Print-Error "Java no está instalado"
        $DepsOk = $false
    }
    
    # Verificar Maven
    if (Test-Command "mvn") {
        $MavenVersion = & mvn --version | Select-Object -First 1
        Print-Success "Maven encontrado: $MavenVersion"
    }
    else {
        Print-Error "Maven no está instalado"
        $DepsOk = $false
    }
    
    if ($DepsOk) {
        Print-Success "Todas las dependencias están disponibles"
        return $true
    }
    else {
        Print-Error "Faltan algunas dependencias. Instálalas e intenta de nuevo."
        return $false
    }
}

# Validar estructura del proyecto
function Validate-ProjectStructure {
    Print-Header "Validando Estructura del Proyecto"
    
    # Verificar directorio backend
    if (-not (Test-Path $BackendDir)) {
        Print-Error "Directorio backend no encontrado: $BackendDir"
        return $false
    }
    Print-Success "Directorio backend encontrado"
    
    # Verificar pom.xml
    if (-not (Test-Path (Join-Path $BackendDir "pom.xml"))) {
        Print-Error "pom.xml no encontrado en backend"
        return $false
    }
    Print-Success "pom.xml encontrado"
    
    # Verificar directorio frontend
    if (-not (Test-Path $FrontendDir)) {
        Print-Error "Directorio frontend no encontrado: $FrontendDir"
        return $false
    }
    Print-Success "Directorio frontend encontrado"
    
    # Verificar package.json
    if (-not (Test-Path (Join-Path $FrontendDir "package.json"))) {
        Print-Error "package.json no encontrado en frontend"
        return $false
    }
    Print-Success "package.json encontrado"
    
    return $true
}

# Detener todos los procesos
function Stop-AllProcesses {
    Print-Header "DETENIENDO PROCESOS"
    
    $Stopped = $false
    
    # Detener procesos Java
    $JavaProcs = Get-Process -Name java -ErrorAction SilentlyContinue
    if ($JavaProcs) {
        $JavaProcs | Stop-Process -Force -ErrorAction SilentlyContinue
        Print-Success "Procesos Java detenidos"
        $Stopped = $true
    }
    
    # Detener procesos Node
    $NodeProcs = Get-Process -Name node -ErrorAction SilentlyContinue
    if ($NodeProcs) {
        $NodeProcs | Stop-Process -Force -ErrorAction SilentlyContinue
        Print-Success "Procesos Node.js detenidos"
        $Stopped = $true
    }
    
    Start-Sleep -Seconds 2
    
    if ($Stopped) {
        Print-Success "Todos los procesos han sido detenidos correctamente"
    }
    else {
        Print-Warning "No hay procesos en ejecución"
    }
}

# ===== FUNCIONES PRINCIPALES =====

function Run-Backend {
    Print-Header "INICIANDO BACKEND (Spring Boot)"
    
    Push-Location $BackendDir
    
    if (-not (Test-Path "pom.xml")) {
        Print-Error "No se encuentra pom.xml en $BackendDir"
        Pop-Location
        return $false
    }
    
    Print-Info "Compilando proyecto con Maven..."
    & mvn clean package -DskipTests -q
    
    if ($LASTEXITCODE -ne 0) {
        Print-Error "Error compilando el backend"
        Pop-Location
        return $false
    }
    
    Print-Success "Iniciando Spring Boot en puerto $BackendPort..."
    Print-Info "Presiona Ctrl+C para detener el backend"
    
    & java -jar target/workable-0.0.1-SNAPSHOT.jar
    
    if ($LASTEXITCODE -eq 0) {
        Print-Success "Backend detenido correctamente"
    }
    else {
        Print-Warning "Backend detenido"
    }
    
    Pop-Location
    return $true
}

function Run-Frontend {
    Print-Header "INICIANDO FRONTEND (Vite)"
    
    Push-Location $FrontendDir
    
    if (-not (Test-Path "package.json")) {
        Print-Error "No se encuentra package.json en $FrontendDir"
        Pop-Location
        return $false
    }
    
    # Verificar si node_modules existe
    if (-not (Test-Path "node_modules")) {
        Print-Warning "node_modules no encontrado. Instalando dependencias..."
        & npm install
        
        if ($LASTEXITCODE -ne 0) {
            Print-Error "Error instalando dependencias de frontend"
            Pop-Location
            return $false
        }
    }
    
    Print-Success "Iniciando Vite en puerto $FrontendPort..."
    Print-Info "Presiona Ctrl+C para detener el frontend"
    
    & npm run dev
    
    Print-Warning "Frontend detenido"
    
    Pop-Location
    return $true
}

function Run-Both {
    Print-Header "INICIANDO BACKEND Y FRONTEND"
    
    if (-not (Validate-ProjectStructure)) {
        return $false
    }
    
    # Compilar backend primero
    Push-Location $BackendDir
    Print-Success "Compilando backend..."
    & mvn clean package -DskipTests -q
    
    if ($LASTEXITCODE -ne 0) {
        Print-Error "Error compilando el backend"
        Pop-Location
        return $false
    }
    Pop-Location
    
    # Iniciar backend en nueva terminal
    Print-Success "Abriendo ventana para Backend..."
    Start-Process PowerShell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$BackendDir'; & java -jar target/workable-0.0.1-SNAPSHOT.jar"
    ) -WindowStyle Normal
    
    Start-Sleep -Seconds 5
    
    # Iniciar frontend en nueva terminal
    Print-Success "Abriendo ventana para Frontend..."
    Start-Process PowerShell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$FrontendDir'; npm install; npm run dev"
    ) -WindowStyle Normal
    
    Print-Header "AMBOS SERVICIOS INICIADOS"
    Print-Info "Backend: http://localhost:$BackendPort"
    Print-Info "Frontend: http://localhost:$FrontendPort"
    Print-Info "Ambas ventanas permanecerán abiertas"
    
    return $true
}

function Show-Menu {
    Write-Host ""
    Print-Header "WORKABLE PROJECT MANAGER - MENÚ PRINCIPAL"
    Write-Host "Selecciona una opción:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1) Iniciar Backend (Terminal actual)"
    Write-Host "  2) Iniciar Frontend (Terminal actual)"
    Write-Host "  3) Iniciar Backend + Frontend (Nuevas terminales)"
    Write-Host "  4) Detener todos los procesos"
    Write-Host "  5) Verificar dependencias"
    Write-Host "  6) Salir"
    Write-Host ""
}

# ===== FLUJO PRINCIPAL =====

if ($Action -eq "menu" -or $Action -eq "") {
    while ($true) {
        Clear-Host
        Show-Menu
        $Choice = Read-Host "Ingresa el número de tu opción (1-6)"
        
        switch ($Choice) {
            "1" { Run-Backend; Read-Host "Presiona Enter para volver al menú" }
            "2" { Run-Frontend; Read-Host "Presiona Enter para volver al menú" }
            "3" { Run-Both; exit }
            "4" { Stop-AllProcesses; Read-Host "Presiona Enter para volver al menú" }
            "5" { Check-Dependencies; Read-Host "Presiona Enter para volver al menú" }
            "6" { 
                Print-Success "¡Hasta luego!"
                exit
            }
            default {
                Print-Error "Opción inválida. Por favor ingresa un número entre 1 y 6."
                Start-Sleep -Seconds 2
            }
        }
    }
}
elseif ($Action -eq "backend") {
    Check-Dependencies
    Validate-ProjectStructure
    Run-Backend
}
elseif ($Action -eq "frontend") {
    Check-Dependencies
    Validate-ProjectStructure
    Run-Frontend
}
elseif ($Action -eq "both") {
    Check-Dependencies
    Run-Both
}
elseif ($Action -eq "stop") {
    Stop-AllProcesses
}
elseif ($Action -eq "check") {
    Check-Dependencies
}
else {
    Print-Error "Acción desconocida: $Action"
    Write-Host "Usos:"
    Write-Host "  .\run-project-windows.ps1                # Muestra el menú"
    Write-Host "  .\run-project-windows.ps1 -Action backend # Inicia backend"
    Write-Host "  .\run-project-windows.ps1 -Action frontend # Inicia frontend"
    Write-Host "  .\run-project-windows.ps1 -Action both     # Inicia ambos"
    Write-Host "  .\run-project-windows.ps1 -Action stop     # Detiene procesos"
    Write-Host "  .\run-project-windows.ps1 -Action check    # Verifica dependencias"
}
