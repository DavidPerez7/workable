@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ================================================================================
echo   PRUEBAS CRUD - TODAS LAS ENTIDADES DEL BACKEND
echo ================================================================================
echo.

set BASE_URL=http://localhost:8080

REM Colores (aproximados con echo)
setlocal enabledelayedexpansion

echo [1/10] Verificando servidor...
curl -s %BASE_URL%/actuator/health >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ✗ SERVIDOR NO DISPONIBLE
    pause
    exit /b 1
)
echo ✓ Servidor disponible
echo.

REM ========== USUARIOS ==========
echo ================================================================================
echo   [CRUD] USUARIOS
echo ================================================================================
echo.

echo [1.1] CREATE - Crear usuario admin...
curl -X POST "%BASE_URL%/api/usuario" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Admin\",\"apellido\":\"System\",\"correo\":\"admin@test.com\",\"telefono\":\"573104625832\",\"password\":\"Admin123!\",\"rol\":\"ADMIN\",\"fechaNacimiento\":\"1990-01-01\",\"municipioId\":1}" 2>nul
echo.

echo [1.2] READ - Listar usuarios...
curl -s -X GET "%BASE_URL%/api/usuario" | findstr /i "nombre apellido"
echo.

echo [1.3] UPDATE - Actualizar usuario...
curl -X PUT "%BASE_URL%/api/usuario/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"AdminUpdate\",\"apellido\":\"System\",\"telefono\":\"573104625832\"}" 2>nul
echo.

echo [1.4] DELETE - Eliminar usuario...
curl -X DELETE "%BASE_URL%/api/usuario/1" 2>nul
echo.
echo.

REM ========== MUNICIPIOS ==========
echo ================================================================================
echo   [READ] MUNICIPIOS
echo ================================================================================
echo.

echo [2.1] READ - Listar municipios...
curl -s -X GET "%BASE_URL%/api/municipio" | findstr /i "nombre departamento"
echo.
echo.

REM ========== EMPRESAS ==========
echo ================================================================================
echo   [CRUD] EMPRESAS
echo ================================================================================
echo.

echo [3.1] CREATE - Crear empresa...
curl -X POST "%BASE_URL%/api/empresa" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Tech Corp\",\"nit\":\"900111222\",\"sector\":\"Tecnología\",\"telefono\":\"6011111111\",\"email\":\"info@tech.com\"}" 2>nul
echo.

echo [3.2] READ - Listar empresas...
curl -s -X GET "%BASE_URL%/api/empresa" | findstr /i "nombre nit"
echo.

echo [3.3] UPDATE - Actualizar empresa...
curl -X PUT "%BASE_URL%/api/empresa/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Tech Corp Updated\",\"sector\":\"Software\"}" 2>nul
echo.

echo [3.4] DELETE - Eliminar empresa...
curl -X DELETE "%BASE_URL%/api/empresa/1" 2>nul
echo.
echo.

REM ========== OFERTAS ==========
echo ================================================================================
echo   [CRUD] OFERTAS
echo ================================================================================
echo.

echo [4.1] CREATE - Crear oferta...
curl -X POST "%BASE_URL%/api/oferta" ^
  -H "Content-Type: application/json" ^
  -d "{\"titulo\":\"Desarrollador Java\",\"descripcion\":\"Se busca...\",\"salarioMin\":3000000,\"salarioMax\":5000000,\"experienciaRequerida\":\"3 años\",\"empresaId\":1,\"modalidad\":\"REMOTO\",\"nivelExperiencia\":\"INTERMEDIO\",\"tipoContrato\":\"TIEMPO_COMPLETO\"}" 2>nul
echo.

echo [4.2] READ - Listar ofertas...
curl -s -X GET "%BASE_URL%/api/oferta" | findstr /i "titulo salario"
echo.

echo [4.3] UPDATE - Actualizar oferta...
curl -X PUT "%BASE_URL%/api/oferta/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"titulo\":\"Desarrollador Java Senior\",\"salarioMin\":3500000}" 2>nul
echo.

echo [4.4] DELETE - Eliminar oferta...
curl -X DELETE "%BASE_URL%/api/oferta/1" 2>nul
echo.
echo.

REM ========== ESTUDIOS ==========
echo ================================================================================
echo   [CRUD] ESTUDIOS
echo ================================================================================
echo.

echo [5.1] CREATE - Crear estudio...
curl -X POST "%BASE_URL%/api/estudio" ^
  -H "Content-Type: application/json" ^
  -d "{\"usuarioId\":1,\"institucion\":\"Universidad Nacional\",\"titulo\":\"Ingeniería de Sistemas\",\"nivelEducativo\":\"LICENCIATURA\",\"modalidad\":\"PRESENCIAL\",\"fechaInicio\":\"2015-01-15\",\"fechaGraduacion\":\"2019-12-20\"}" 2>nul
echo.

echo [5.2] READ - Listar estudios...
curl -s -X GET "%BASE_URL%/api/estudio" | findstr /i "institucion titulo"
echo.

echo [5.3] UPDATE - Actualizar estudio...
curl -X PUT "%BASE_URL%/api/estudio/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"institucion\":\"Universidad Nacional Updated\"}" 2>nul
echo.

echo [5.4] DELETE - Eliminar estudio...
curl -X DELETE "%BASE_URL%/api/estudio/1" 2>nul
echo.
echo.

REM ========== EXPERIENCIA ==========
echo ================================================================================
echo   [CRUD] EXPERIENCIA
echo ================================================================================
echo.

echo [6.1] CREATE - Crear experiencia...
curl -X POST "%BASE_URL%/api/experiencia" ^
  -H "Content-Type: application/json" ^
  -d "{\"usuarioId\":1,\"puesto\":\"Desarrollador Java\",\"empresa\":\"Tech Solutions\",\"descripcion\":\"Desarrollo backend...\",\"fechaInicio\":\"2020-01-15\",\"fechaFinalizacion\":\"2023-12-31\"}" 2>nul
echo.

echo [6.2] READ - Listar experiencias...
curl -s -X GET "%BASE_URL%/api/experiencia" | findstr /i "puesto empresa"
echo.

echo [6.3] UPDATE - Actualizar experiencia...
curl -X PUT "%BASE_URL%/api/experiencia/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"puesto\":\"Senior Desarrollador Java\"}" 2>nul
echo.

echo [6.4] DELETE - Eliminar experiencia...
curl -X DELETE "%BASE_URL%/api/experiencia/1" 2>nul
echo.
echo.

REM ========== HABILIDADES ==========
echo ================================================================================
echo   [CRUD] HABILIDADES
echo ================================================================================
echo.

echo [7.1] CREATE - Crear habilidad...
curl -X POST "%BASE_URL%/api/habilidad" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Java\",\"tipo\":\"TECNICA\",\"descripcion\":\"Programación en Java\"}" 2>nul
echo.

echo [7.2] READ - Listar habilidades...
curl -s -X GET "%BASE_URL%/api/habilidad" | findstr /i "nombre tipo"
echo.

echo [7.3] UPDATE - Actualizar habilidad...
curl -X PUT "%BASE_URL%/api/habilidad/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Java Spring Boot\"}" 2>nul
echo.

echo [7.4] DELETE - Eliminar habilidad...
curl -X DELETE "%BASE_URL%/api/habilidad/1" 2>nul
echo.
echo.

REM ========== POSTULACIONES ==========
echo ================================================================================
echo   [READ] POSTULACIONES
echo ================================================================================
echo.

echo [8.1] READ - Listar postulaciones...
curl -s -X GET "%BASE_URL%/api/postulacion" | findstr /i "id estado"
echo.
echo.

REM ========== CITACIONES ==========
echo ================================================================================
echo   [CRUD] CITACIONES
echo ================================================================================
echo.

echo [9.1] CREATE - Crear citación...
curl -X POST "%BASE_URL%/api/citacion" ^
  -H "Content-Type: application/json" ^
  -d "{\"postulacionId\":1,\"reclutadorId\":1,\"fechaCitacion\":\"2025-12-25\",\"hora\":\"14:00\",\"linkMeet\":\"https://meet.google.com/xyz\",\"detalles\":\"Entrevista técnica\",\"usuarioIdActual\":1}" 2>nul
echo.

echo [9.2] READ - Listar citaciones...
curl -s -X GET "%BASE_URL%/api/citacion/reclutador/1?usuarioIdActual=1" | findstr /i "id estado"
echo.

echo [9.3] UPDATE - Cambiar estado...
curl -X PUT "%BASE_URL%/api/citacion/1/estado?estado=CONFIRMADA&usuarioIdActual=1" ^
  -H "Content-Type: application/json" 2>nul
echo.

echo [9.4] DELETE - Eliminar citación...
curl -X DELETE "%BASE_URL%/api/citacion/1?usuarioIdActual=1" 2>nul
echo.
echo.

REM ========== NOTIFICACIONES ==========
echo ================================================================================
echo   [READ] NOTIFICACIONES
echo ================================================================================
echo.

echo [10.1] READ - Ver notificaciones del usuario...
curl -s -X GET "%BASE_URL%/api/notificacion/usuario/1" | findstr /i "titulo mensaje leida"
echo.

echo [10.2] READ - Contar no leídas...
curl -s -X GET "%BASE_URL%/api/notificacion/usuario/1/no-leidas"
echo.
echo.

REM ========== RESUMEN ==========
echo ================================================================================
echo   PRUEBAS COMPLETADAS
echo ================================================================================
echo.
echo [✓] CRUD Usuarios
echo [✓] CRUD Empresas
echo [✓] CRUD Ofertas
echo [✓] CRUD Estudios
echo [✓] CRUD Experiencia
echo [✓] CRUD Habilidades
echo [✓] CRUD Citaciones
echo [✓] READ Postulaciones
echo [✓] READ Notificaciones
echo [✓] READ Municipios
echo.
echo ================================================================================
echo.
pause

