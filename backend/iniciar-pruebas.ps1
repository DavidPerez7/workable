#!/usr/bin/env powershell
# Script principal: Inicia MySQL, Servidor y ejecuta Pruebas CRUD

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    PRUEBAS CRUD - WORKABLE BACKEND                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080"

# ============== INICIAR MySQL ==============
Write-Host "[1/3] Iniciando MySQL..." -ForegroundColor Yellow
$mysqlProcess = Start-Process -FilePath "C:\xampp\mysql\bin\mysqld.exe" -WindowStyle Hidden -PassThru
Write-Host "✓ MySQL iniciado (PID: $($mysqlProcess.Id))" -ForegroundColor Green
Start-Sleep -Seconds 3

# ============== INICIAR SERVIDOR ==============
Write-Host "[2/3] Iniciando Servidor Spring Boot..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "java" `
    -ArgumentList '-jar', 'target\workable-0.0.1-SNAPSHOT.jar' `
    -WorkingDirectory "c:\Users\Administrador\Desktop\workable\workable\backend" `
    -WindowStyle Hidden `
    -PassThru

Write-Host "✓ Servidor iniciado (PID: $($serverProcess.Id))" -ForegroundColor Green
Write-Host "Esperando que el servidor esté listo (10 segundos)..." -ForegroundColor Gray

# Esperar a que el servidor esté listo
$maxRetries = 10
$retries = 0
$isReady = $false

while ($retries -lt $maxRetries) {
    try {
        $health = Invoke-WebRequest -Uri "$baseUrl/actuator/health" -Method GET -ErrorAction Stop -TimeoutSec 2
        $isReady = $true
        break
    } catch {
        $retries++
        Start-Sleep -Seconds 1
    }
}

if (-not $isReady) {
    Write-Host "✗ El servidor no respondió en 10 segundos" -ForegroundColor Red
    $serverProcess.Kill()
    $mysqlProcess.Kill()
    exit 1
}

Write-Host "✓ Servidor está listo" -ForegroundColor Green

# ============== EJECUTAR PRUEBAS ==============
Write-Host ""
Write-Host "[3/3] Ejecutando Pruebas CRUD..." -ForegroundColor Yellow
Write-Host ""

$contador = 0

function Test-Endpoint {
    param(
        [string]$method,
        [string]$endpoint,
        [string]$description,
        [object]$body = $null
    )
    
    $script:contador++
    Write-Host "[$($script:contador)] $description" -ForegroundColor Yellow
    
    try {
        $url = "$baseUrl$endpoint"
        
        if ($body) {
            $response = Invoke-WebRequest -Uri $url -Method $method -Body ($body | ConvertTo-Json) `
                -ContentType "application/json" -ErrorAction Stop -TimeoutSec 5
        } else {
            $response = Invoke-WebRequest -Uri $url -Method $method `
                -ContentType "application/json" -ErrorAction Stop -TimeoutSec 5
        }
        
        $result = $response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
        Write-Host "  ✓ Status: $($response.StatusCode)" -ForegroundColor Green
        
        if ($result -and $result.psobject.Properties.Count -gt 0) {
            $jsonStr = $result | ConvertTo-Json -Depth 1 -Compress
            if ($jsonStr.Length -gt 150) {
                $preview = $jsonStr.Substring(0, 150)
                Write-Host "  Response: $preview..." -ForegroundColor DarkGray
            } else {
                Write-Host "  Response: $jsonStr" -ForegroundColor DarkGray
            }
        }
    }
    catch {
        Write-Host "  ✗ Error: $($_.Exception.Message.Substring(0, 80))" -ForegroundColor Red
    }
    Write-Host ""
}

# ========== MUNICIPIOS ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [READ] MUNICIPIOS" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method GET -Endpoint "/api/municipio" -Description "Listar municipios"

# ========== USUARIOS ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [CRUD] USUARIOS" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method POST -Endpoint "/api/usuario" -Description "CREATE - Nuevo usuario aspirante" -Body @{
    nombre = "Juan"
    apellido = "Pérez"
    correo = "juan.perez@test.com"
    telefono = "573104625832"
    password = "Test1234"
    rol = "ASPIRANTE"
    fechaNacimiento = "1995-05-15"
    municipioId = 1
}

Test-Endpoint -Method GET -Endpoint "/api/usuario" -Description "READ - Listar usuarios"

Test-Endpoint -Method GET -Endpoint "/api/usuario/1" -Description "READ - Obtener usuario específico"

Test-Endpoint -Method PUT -Endpoint "/api/usuario/1" -Description "UPDATE - Actualizar usuario" -Body @{
    nombre = "Juan Carlos"
    apellido = "Pérez López"
    telefono = "573104625832"
}

# ========== EMPRESAS ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [CRUD] EMPRESAS" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method POST -Endpoint "/api/empresa" -Description "CREATE - Nueva empresa" -Body @{
    nombre = "Tech Solutions S.A."
    nit = "900111222"
    sector = "Tecnología"
    telefono = "6011111111"
    email = "info@techsolutions.com"
    descripcion = "Empresa de soluciones tecnológicas"
}

Test-Endpoint -Method GET -Endpoint "/api/empresa" -Description "READ - Listar empresas"

Test-Endpoint -Method GET -Endpoint "/api/empresa/1" -Description "READ - Obtener empresa específica"

Test-Endpoint -Method PUT -Endpoint "/api/empresa/1" -Description "UPDATE - Actualizar empresa" -Body @{
    nombre = "Tech Solutions Updated"
    sector = "Software"
}

# ========== OFERTAS ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [CRUD] OFERTAS" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method POST -Endpoint "/api/oferta" -Description "CREATE - Nueva oferta de trabajo" -Body @{
    titulo = "Desarrollador Java Senior"
    descripcion = "Se busca desarrollador Java con 3+ años de experiencia"
    salarioMin = 3000000
    salarioMax = 5000000
    experienciaRequerida = "3 años"
    empresaId = 1
    modalidad = "REMOTO"
    nivelExperiencia = "INTERMEDIO"
    tipoContrato = "TIEMPO_COMPLETO"
}

Test-Endpoint -Method GET -Endpoint "/api/oferta" -Description "READ - Listar ofertas"

Test-Endpoint -Method GET -Endpoint "/api/oferta/1" -Description "READ - Obtener oferta específica"

Test-Endpoint -Method PUT -Endpoint "/api/oferta/1" -Description "UPDATE - Actualizar oferta" -Body @{
    titulo = "Desarrollador Java Senior (Python también)"
    salarioMin = 3500000
}

# ========== ESTUDIOS ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [CRUD] ESTUDIOS" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method POST -Endpoint "/api/estudio" -Description "CREATE - Nuevo estudio" -Body @{
    usuarioId = 1
    institucion = "Universidad Nacional de Colombia"
    titulo = "Ingeniería de Sistemas"
    nivelEducativo = "LICENCIATURA"
    modalidad = "PRESENCIAL"
    fechaInicio = "2015-01-15"
    fechaGraduacion = "2019-12-20"
}

Test-Endpoint -Method GET -Endpoint "/api/estudio" -Description "READ - Listar estudios"

Test-Endpoint -Method PUT -Endpoint "/api/estudio/1" -Description "UPDATE - Actualizar estudio" -Body @{
    institucion = "Universidad Nacional - Sede Bogotá"
}

# ========== EXPERIENCIA ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [CRUD] EXPERIENCIA" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method POST -Endpoint "/api/experiencia" -Description "CREATE - Nueva experiencia laboral" -Body @{
    usuarioId = 1
    puesto = "Desarrollador Backend Java"
    empresa = "Tech Solutions"
    descripcion = "Desarrollo de APIs REST con Spring Boot"
    fechaInicio = "2020-01-15"
    fechaFinalizacion = "2023-12-31"
}

Test-Endpoint -Method GET -Endpoint "/api/experiencia" -Description "READ - Listar experiencias"

Test-Endpoint -Method PUT -Endpoint "/api/experiencia/1" -Description "UPDATE - Actualizar experiencia" -Body @{
    puesto = "Senior Desarrollador Backend Java"
}

# ========== HABILIDADES ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [CRUD] HABILIDADES" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method POST -Endpoint "/api/habilidad" -Description "CREATE - Nueva habilidad" -Body @{
    nombre = "Java"
    tipo = "TECNICA"
    descripcion = "Programación en Java y Spring Boot"
}

Test-Endpoint -Method GET -Endpoint "/api/habilidad" -Description "READ - Listar habilidades"

Test-Endpoint -Method PUT -Endpoint "/api/habilidad/1" -Description "UPDATE - Actualizar habilidad" -Body @{
    nombre = "Java Spring Boot"
}

# ========== POSTULACIONES ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [READ] POSTULACIONES" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method GET -Endpoint "/api/postulacion" -Description "READ - Listar postulaciones"

# ========== CITACIONES ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [READ] CITACIONES" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method GET -Endpoint "/api/citacion" -Description "READ - Listar citaciones"

# ========== NOTIFICACIONES ==========
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host "  [READ] NOTIFICACIONES" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Test-Endpoint -Method GET -Endpoint "/api/notificacion" -Description "READ - Listar notificaciones"

# ========== RESUMEN ==========
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                        PRUEBAS COMPLETADAS                                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Total de pruebas ejecutadas: $($script:contador)" -ForegroundColor Green
Write-Host ""
Write-Host "Procesos activos:" -ForegroundColor Yellow
Write-Host "  - MySQL (PID: $($mysqlProcess.Id))" -ForegroundColor Gray
Write-Host "  - Spring Boot (PID: $($serverProcess.Id))" -ForegroundColor Gray
Write-Host ""
Write-Host "Servidor disponible en: $baseUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Para detener los procesos:" -ForegroundColor Yellow
Write-Host "  Stop-Process -Id $($mysqlProcess.Id)" -ForegroundColor Gray
Write-Host "  Stop-Process -Id $($serverProcess.Id)" -ForegroundColor Gray
Write-Host ""
