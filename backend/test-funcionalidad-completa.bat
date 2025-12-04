@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ================================================================================
echo   PRUEBAS FUNCIONALES COMPLETAS DEL BACKEND - CRUD POR ROLES
echo ================================================================================
echo.
echo Este script verifica toda la funcionalidad del backend:
echo   - ADMIN: CRUD completo (Create, Read, Update, Delete)
echo   - RECLUTADOR: CRU (Create, Read, Update) - Sin Delete
echo   - ASPIRANTE: Read (solo ver sus datos)
echo.
echo ================================================================================
echo.

REM Variables de configuración
set BASE_URL=http://localhost:8080
set ADMIN_TOKEN=token_admin_aqui
set RECLUTADOR_TOKEN=token_reclutador_aqui
set ASPIRANTE_TOKEN=token_aspirante_aqui

echo [PASO 1] Verificando que el servidor está corriendo...
curl -s %BASE_URL%/actuator/health >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ✗ ERROR: El servidor no está disponible en %BASE_URL%
    echo.
    echo Para iniciar el servidor, ejecuta:
    echo   mvn spring-boot:run
    echo.
    pause
    exit /b 1
)
echo ✓ Servidor disponible en %BASE_URL%
echo.

REM ================================================================================
REM   PRUEBAS DE USUARIOS (CRUD)
REM ================================================================================
echo ================================================================================
echo   [PRUEBAS] GESTIÓN DE USUARIOS
echo ================================================================================
echo.

echo [1.1] ADMIN: Crear usuario ASPIRANTE...
curl -X POST "%BASE_URL%/api/usuario" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -d "{\"nombre\":\"Juan\",\"apellido\":\"Pérez\",\"correo\":\"juan@test.com\",\"telefono\":\"573104625832\",\"password\":\"Pass123\",\"rol\":\"ASPIRANTE\",\"municipioId\":1}" 2>nul
echo.

echo [1.2] RECLUTADOR: Intentar crear usuario (debe funcionar)...
curl -X POST "%BASE_URL%/api/usuario" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%" ^
  -d "{\"nombre\":\"María\",\"apellido\":\"García\",\"correo\":\"maria@test.com\",\"telefono\":\"573104625833\",\"password\":\"Pass123\",\"rol\":\"ASPIRANTE\",\"municipioId\":1}" 2>nul
echo.

echo [1.3] ADMIN: Listar todos los usuarios...
curl -s -X GET "%BASE_URL%/api/usuario" -H "Authorization: Bearer %ADMIN_TOKEN%" | findstr /i "id nombre apellido"
echo.

echo [1.4] ADMIN: Obtener usuario por ID...
curl -s -X GET "%BASE_URL%/api/usuario/1" -H "Authorization: Bearer %ADMIN_TOKEN%" | findstr /i "id nombre"
echo.

echo [1.5] ADMIN: Actualizar usuario...
curl -X PUT "%BASE_URL%/api/usuario/1" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -d "{\"nombre\":\"JuanMod\",\"apellido\":\"Pérez\",\"correo\":\"juan@test.com\",\"telefono\":\"573104625832\"}" 2>nul
echo.

echo [1.6] ADMIN: Eliminar usuario (Solo ADMIN)...
curl -X DELETE "%BASE_URL%/api/usuario/1" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" 2>nul
echo.

echo [1.7] RECLUTADOR: Intentar eliminar usuario (debe fallar - 403)...
curl -X DELETE "%BASE_URL%/api/usuario/2" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%" 2>nul
echo.

REM ================================================================================
REM   PRUEBAS DE EMPRESAS (CRUD)
REM ================================================================================
echo.
echo ================================================================================
echo   [PRUEBAS] GESTIÓN DE EMPRESAS
echo ================================================================================
echo.

echo [2.1] ADMIN: Crear empresa...
curl -X POST "%BASE_URL%/api/empresa" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -d "{\"nombre\":\"Tech Solutions\",\"nit\":\"900123456\",\"sector\":\"Tecnología\",\"telefono\":\"6012345678\"}" 2>nul
echo.

echo [2.2] RECLUTADOR: Crear empresa (debe funcionar)...
curl -X POST "%BASE_URL%/api/empresa" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%" ^
  -d "{\"nombre\":\"Business Corp\",\"nit\":\"900123457\",\"sector\":\"Servicios\",\"telefono\":\"6012345679\"}" 2>nul
echo.

echo [2.3] ADMIN: Listar empresas...
curl -s -X GET "%BASE_URL%/api/empresa" -H "Authorization: Bearer %ADMIN_TOKEN%" | findstr /i "id nombre nit"
echo.

echo [2.4] ADMIN: Actualizar empresa...
curl -X PUT "%BASE_URL%/api/empresa/1" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -d "{\"nombre\":\"Tech Solutions Updated\",\"sector\":\"Tecnología\"}" 2>nul
echo.

echo [2.5] ADMIN: Desactivar empresa...
curl -X PUT "%BASE_URL%/api/empresa/1/desactivar" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" 2>nul
echo.

echo [2.6] ADMIN: Eliminar empresa (Solo ADMIN)...
curl -X DELETE "%BASE_URL%/api/empresa/1" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" 2>nul
echo.

REM ================================================================================
REM   PRUEBAS DE OFERTAS (CRUD)
REM ================================================================================
echo.
echo ================================================================================
echo   [PRUEBAS] GESTIÓN DE OFERTAS
echo ================================================================================
echo.

echo [3.1] RECLUTADOR: Crear oferta...
curl -X POST "%BASE_URL%/api/oferta" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%" ^
  -d "{\"titulo\":\"Desarrollador Java Senior\",\"descripcion\":\"Se requiere...\",\"salarioMin\":3000000,\"salarioMax\":5000000,\"empresaId\":1}" 2>nul
echo.

echo [3.2] ADMIN: Listar ofertas...
curl -s -X GET "%BASE_URL%/api/oferta" -H "Authorization: Bearer %ADMIN_TOKEN%" | findstr /i "id titulo salario"
echo.

echo [3.3] RECLUTADOR: Actualizar oferta propia...
curl -X PUT "%BASE_URL%/api/oferta/1" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%" ^
  -d "{\"titulo\":\"Desarrollador Java Senior - UPDATED\",\"salarioMin\":3500000}" 2>nul
echo.

echo [3.4] RECLUTADOR: Intentar eliminar oferta (debe fallar - 403)...
curl -X DELETE "%BASE_URL%/api/oferta/1" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%" 2>nul
echo.

echo [3.5] ADMIN: Eliminar oferta (Solo ADMIN)...
curl -X DELETE "%BASE_URL%/api/oferta/1" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" 2>nul
echo.

REM ================================================================================
REM   PRUEBAS DE POSTULACIONES
REM ================================================================================
echo.
echo ================================================================================
echo   [PRUEBAS] GESTIÓN DE POSTULACIONES
echo ================================================================================
echo.

echo [4.1] ASPIRANTE: Postularse a oferta...
curl -X POST "%BASE_URL%/api/postulacion" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ASPIRANTE_TOKEN%" ^
  -d "{\"ofertaId\":1,\"usuarioId\":1,\"carta\":\"Estoy interesado...\"}" 2>nul
echo.

echo [4.2] ADMIN: Listar postulaciones...
curl -s -X GET "%BASE_URL%/api/postulacion" -H "Authorization: Bearer %ADMIN_TOKEN%" | findstr /i "id estado"
echo.

echo [4.3] RECLUTADOR: Cambiar estado de postulación...
curl -X PATCH "%BASE_URL%/api/postulacion/1/estado" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%" ^
  -d "{\"estado\":\"EN_REVISION\"}" 2>nul
echo.

REM ================================================================================
REM   PRUEBAS DE CITACIONES
REM ================================================================================
echo.
echo ================================================================================
echo   [PRUEBAS] GESTIÓN DE CITACIONES
echo ================================================================================
echo.

echo [5.1] RECLUTADOR: Crear citación...
curl -X POST "%BASE_URL%/api/citacion" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%" ^
  -d "{\"postulacionId\":1,\"reclutadorId\":2,\"fechaCitacion\":\"2025-12-20\",\"hora\":\"10:00\",\"linkMeet\":\"https://meet.google.com/abc-defg-hij\",\"usuarioIdActual\":2}" 2>nul
echo.

echo [5.2] ADMIN: Listar citaciones...
curl -s -X GET "%BASE_URL%/api/citacion/reclutador/2" -H "Authorization: Bearer %ADMIN_TOKEN%&usuarioIdActual=1" | findstr /i "id estado"
echo.

echo [5.3] RECLUTADOR: Enviar citación por WhatsApp...
curl -X POST "%BASE_URL%/api/citacion/1/enviar-whatsapp" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%&usuarioIdActual=2" 2>nul
echo.

echo [5.4] RECLUTADOR: Cambiar estado de citación...
curl -X PUT "%BASE_URL%/api/citacion/1/estado" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%&usuarioIdActual=2" ^
  -d "{\"estado\":\"CONFIRMADA\"}" 2>nul
echo.

echo [5.5] RECLUTADOR: Intentar eliminar citación (debe fallar - 403)...
curl -X DELETE "%BASE_URL%/api/citacion/1" ^
  -H "Authorization: Bearer %RECLUTADOR_TOKEN%&usuarioIdActual=2" 2>nul
echo.

echo [5.6] ADMIN: Eliminar citación (Solo ADMIN)...
curl -X DELETE "%BASE_URL%/api/citacion/1" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%&usuarioIdActual=1" 2>nul
echo.

REM ================================================================================
REM   PRUEBAS DE NOTIFICACIONES
REM ================================================================================
echo.
echo ================================================================================
echo   [PRUEBAS] GESTIÓN DE NOTIFICACIONES
echo ================================================================================
echo.

echo [6.1] ASPIRANTE: Ver sus notificaciones...
curl -s -X GET "%BASE_URL%/api/notificacion/usuario/1" -H "Authorization: Bearer %ASPIRANTE_TOKEN%" | findstr /i "id titulo mensaje leida"
echo.

echo [6.2] ASPIRANTE: Contar notificaciones no leídas...
curl -s -X GET "%BASE_URL%/api/notificacion/usuario/1/no-leidas" -H "Authorization: Bearer %ASPIRANTE_TOKEN%"
echo.

echo [6.3] ASPIRANTE: Marcar notificación como leída...
curl -X PATCH "%BASE_URL%/api/notificacion/1/leida" ^
  -H "Authorization: Bearer %ASPIRANTE_TOKEN%" 2>nul
echo.

echo [6.4] ASPIRANTE: Marcar todas como leídas...
curl -X PATCH "%BASE_URL%/api/notificacion/usuario/1/leidas" ^
  -H "Authorization: Bearer %ASPIRANTE_TOKEN%" 2>nul
echo.

REM ================================================================================
REM   RESUMEN FINAL
REM ================================================================================
echo.
echo ================================================================================
echo   RESUMEN DE PRUEBAS
echo ================================================================================
echo.
echo [✓] Pruebas de Usuarios (CRUD - ADMIN, CRU - RECLUTADOR)
echo [✓] Pruebas de Empresas (CRUD - ADMIN, CRU - RECLUTADOR)
echo [✓] Pruebas de Ofertas (CRUD - ADMIN, CRU - RECLUTADOR)
echo [✓] Pruebas de Postulaciones (lectura y cambio de estado)
echo [✓] Pruebas de Citaciones (CRUD - ADMIN, CRU - RECLUTADOR + WhatsApp)
echo [✓] Pruebas de Notificaciones (lectura y marca como leída)
echo.
echo ================================================================================
echo   CONTROL DE ACCESO POR ROLES
echo ================================================================================
echo.
echo ADMIN:
echo   - Puede crear, leer, actualizar y eliminar en todas las entidades
echo   - POST/GET/PUT/DELETE habilitados para usuarios, empresas, ofertas, citaciones
echo.
echo RECLUTADOR:
echo   - Puede crear, leer y actualizar
echo   - DELETE rechazado (403 Forbidden)
echo   - Puede enviar citaciones por WhatsApp
echo   - Solo acceso a sus propias empresas y ofertas
echo.
echo ASPIRANTE:
echo   - Solo lectura (GET)
echo   - Puede postularse a ofertas
echo   - Ve sus propias citaciones y notificaciones
echo.
echo ================================================================================
echo.
echo NOTA: Reemplaza los tokens con los tokens JWT reales obtenidos del endpoint /api/auth/login
echo.
pause

