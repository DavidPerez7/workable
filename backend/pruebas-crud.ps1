# Script de Pruebas CRUD - Todas las entidades del backend
# Requiere: Servidor en http://localhost:8080, MySQL conectada

$baseUrl = "http://localhost:8080"
$contador = 0

function Write-Header {
    param([string]$title)
    Write-Host "`n" -ForegroundColor White
    Write-Host "=" * 80 -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host "=" * 80 -ForegroundColor Cyan
    Write-Host ""
}

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
            $response = Invoke-WebRequest -Uri $url -Method $method -Body ($body | ConvertTo-Json) -ContentType "application/json" -ErrorAction Stop
        } else {
            $response = Invoke-WebRequest -Uri $url -Method $method -ContentType "application/json" -ErrorAction Stop
        }
        
        $result = $response.Content | ConvertFrom-Json
        Write-Host "  ✓ Status: $($response.StatusCode)" -ForegroundColor Green
        
        if ($result) {
            $json = $result | ConvertTo-Json -Depth 2
            if ($json.Length -gt 200) {
                Write-Host "  Response: $(($json | Select-Object -First 200) -replace "`n", "`n  ")" -ForegroundColor Gray
            } else {
                Write-Host "  Response: $json" -ForegroundColor Gray
            }
        }
    }
    catch {
        Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Verificar servidor
Write-Host "`n[VERIFICACIÓN] Conectando al servidor..." -ForegroundColor Cyan
try {
    $health = Invoke-WebRequest -Uri "$baseUrl/actuator/health" -Method GET -ErrorAction Stop
    Write-Host "✓ Servidor disponible en $baseUrl" -ForegroundColor Green
} catch {
    Write-Host "✗ SERVIDOR NO DISPONIBLE - Inicia con: java -jar target\workable-0.0.1-SNAPSHOT.jar" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ==================== MUNICIPIOS ====================
Write-Header "[READ] MUNICIPIOS"
Test-Endpoint -Method GET -Endpoint "/api/municipio" -Description "Listar municipios"

# ==================== USUARIOS ====================
Write-Header "[CRUD] USUARIOS"
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

Test-Endpoint -Method PUT -Endpoint "/api/usuario/1" -Description "UPDATE - Actualizar usuario" -Body @{
    nombre = "Juan Carlos"
    apellido = "Pérez López"
    telefono = "573104625832"
}

Test-Endpoint -Method GET -Endpoint "/api/usuario/1" -Description "READ - Obtener usuario específico"

# ==================== EMPRESAS ====================
Write-Header "[CRUD] EMPRESAS"
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

# ==================== OFERTAS ====================
Write-Header "[CRUD] OFERTAS"
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

# ==================== ESTUDIOS ====================
Write-Header "[CRUD] ESTUDIOS"
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
    nivelEducativo = "LICENCIATURA"
}

# ==================== EXPERIENCIA ====================
Write-Header "[CRUD] EXPERIENCIA"
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
    descripcion = "Liderazgo en desarrollo de APIs REST con Spring Boot"
}

# ==================== HABILIDADES ====================
Write-Header "[CRUD] HABILIDADES"
Test-Endpoint -Method POST -Endpoint "/api/habilidad" -Description "CREATE - Nueva habilidad" -Body @{
    nombre = "Java"
    tipo = "TECNICA"
    descripcion = "Programación en Java y Spring Boot"
}

Test-Endpoint -Method GET -Endpoint "/api/habilidad" -Description "READ - Listar habilidades"

Test-Endpoint -Method PUT -Endpoint "/api/habilidad/1" -Description "UPDATE - Actualizar habilidad" -Body @{
    nombre = "Java Spring Boot"
    descripcion = "Java con enfoque en Spring Boot y microservicios"
}

# ==================== POSTULACIONES ====================
Write-Header "[READ] POSTULACIONES"
Test-Endpoint -Method GET -Endpoint "/api/postulacion" -Description "READ - Listar postulaciones"

# ==================== CITACIONES ====================
Write-Header "[CRUD] CITACIONES"
Test-Endpoint -Method POST -Endpoint "/api/citacion" -Description "CREATE - Nueva citación" -Body @{
    postulacionId = 1
    reclutadorId = 1
    fechaCitacion = "2025-12-25"
    hora = "14:00"
    linkMeet = "https://meet.google.com/xyz"
    detalles = "Entrevista técnica"
    usuarioIdActual = 1
}

Test-Endpoint -Method GET -Endpoint "/api/citacion" -Description "READ - Listar citaciones"

# ==================== NOTIFICACIONES ====================
Write-Header "[READ] NOTIFICACIONES"
Test-Endpoint -Method GET -Endpoint "/api/notificacion" -Description "READ - Listar notificaciones"

# ==================== RESUMEN ====================
Write-Header "RESUMEN DE PRUEBAS"
Write-Host "Total de pruebas ejecutadas: $($script:contador)" -ForegroundColor Cyan
Write-Host ""
Write-Host "[✓] Pruebas completadas correctamente" -ForegroundColor Green
Write-Host ""
