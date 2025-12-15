@echo off
REM Script de Verificación Post-Corrección
REM Workable Mobile App - Testing Suite

echo =========================================
echo 🔍 VERIFICACIÓN DE CORRECCIONES CRÍTICAS
echo =========================================
echo.

REM Verificar que el backend esté ejecutándose
echo 1️⃣  Verificando servidor backend...
curl -s -o nul -w "%%{http_code}" http://192.168.20.8:8080/actuator/health > temp_status.txt 2>nul

set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="200" (
    echo ✅ Backend está ejecutándose
) else if "%status%"=="404" (
    echo ✅ Backend está ejecutándose
) else (
    echo ❌ Backend NO responde. Asegúrate de que esté ejecutándose en http://192.168.20.8:8080
    echo    Ejecuta: cd backend ^&^& mvnw spring-boot:run
    exit /b 1
)

echo.
echo 2️⃣  Verificando endpoints críticos corregidos...

REM Test endpoint de postulaciones ADMIN
echo    - Verificando /api/postulacion/all (ADMIN)...
curl -s -o nul -w "%%{http_code}" http://192.168.20.8:8080/api/postulacion/all > temp_status.txt 2>nul
set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="401" (
    echo    ✅ Endpoint existe (requiere autenticación^)
) else if "%status%"=="403" (
    echo    ✅ Endpoint existe (requiere autenticación^)
) else if "%status%"=="404" (
    echo    ❌ Endpoint /api/postulacion/all NO encontrado
) else (
    echo    ⚠️  Respuesta inesperada: %status%
)

REM Test endpoint de reclutador/me
echo    - Verificando /api/reclutador/me...
curl -s -o nul -w "%%{http_code}" http://192.168.20.8:8080/api/reclutador/me > temp_status.txt 2>nul
set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="401" (
    echo    ✅ Endpoint existe (requiere autenticación^)
) else if "%status%"=="403" (
    echo    ✅ Endpoint existe (requiere autenticación^)
) else if "%status%"=="404" (
    echo    ❌ Endpoint /api/reclutador/me NO encontrado
) else (
    echo    ⚠️  Respuesta inesperada: %status%
)

echo.
echo 3️⃣  Verificando archivos modificados...

set all_exist=1

if exist "movil\src\context\AuthContext.tsx" (
    echo    ✅ movil\src\context\AuthContext.tsx
) else (
    echo    ❌ movil\src\context\AuthContext.tsx NO encontrado
    set all_exist=0
)

if exist "movil\src\api\postulacion.ts" (
    echo    ✅ movil\src\api\postulacion.ts
) else (
    echo    ❌ movil\src\api\postulacion.ts NO encontrado
    set all_exist=0
)

if exist "backend\src\main\java\com\workable_sb\workable\models\Reclutador.java" (
    echo    ✅ backend\src\main\java\com\workable_sb\workable\models\Reclutador.java
) else (
    echo    ❌ backend\src\main\java\com\workable_sb\workable\models\Reclutador.java NO encontrado
    set all_exist=0
)

if exist "backend\src\main\java\com\workable_sb\workable\controller\PostulacionController.java" (
    echo    ✅ backend\src\main\java\com\workable_sb\workable\controller\PostulacionController.java
) else (
    echo    ❌ backend\src\main\java\com\workable_sb\workable\controller\PostulacionController.java NO encontrado
    set all_exist=0
)

if exist "backend\src\main\java\com\workable_sb\workable\service\PostulacionService.java" (
    echo    ✅ backend\src\main\java\com\workable_sb\workable\service\PostulacionService.java
) else (
    echo    ❌ backend\src\main\java\com\workable_sb\workable\service\PostulacionService.java NO encontrado
    set all_exist=0
)

echo.
echo 4️⃣  Verificando correcciones específicas...

REM Verificar que AuthContext NO tiene código temporal
findstr /C:"TEMPORAL: Limpiar cache para desarrollo" movil\src\context\AuthContext.tsx >nul 2>&1
if errorlevel 1 (
    echo    ✅ Código temporal eliminado de AuthContext
) else (
    echo    ❌ AuthContext aún tiene código temporal (logout automático^)
)

REM Verificar que Reclutador.java NO tiene @JsonIgnore en empresa
findstr /C:"@JsonIgnore" backend\src\main\java\com\workable_sb\workable\models\Reclutador.java | findstr /C:"empresa" >nul 2>&1
if errorlevel 1 (
    echo    ✅ @JsonIgnore eliminado de empresa en Reclutador.java
) else (
    echo    ❌ Reclutador.java aún tiene @JsonIgnore en empresa
)

REM Verificar que postulacion.ts usa endpoint correcto
findstr /C:"'/postulacion/all'" movil\src\api\postulacion.ts >nul 2>&1
if errorlevel 1 (
    echo    ❌ postulacion.ts NO usa /postulacion/all
) else (
    echo    ✅ postulacion.ts usa endpoint correcto (/postulacion/all^)
)

REM Verificar que PostulacionService tiene método listarTodas
findstr /C:"listarTodas()" backend\src\main\java\com\workable_sb\workable\service\PostulacionService.java >nul 2>&1
if errorlevel 1 (
    echo    ❌ PostulacionService NO tiene método listarTodas(^)
) else (
    echo    ✅ PostulacionService tiene método listarTodas(^)
)

echo.
echo =========================================
echo 📊 RESUMEN DE VERIFICACIÓN
echo =========================================

if "%all_exist%"=="1" (
    echo ✅ Todos los archivos modificados están presentes
) else (
    echo ❌ Algunos archivos no se encontraron
)

echo.
echo 🚀 PRÓXIMOS PASOS:
echo.
echo 1. Reiniciar el servidor backend:
echo    cd backend
echo    mvnw spring-boot:run
echo.
echo 2. Limpiar y reiniciar la app móvil:
echo    cd movil
echo    npx expo start --clear
echo.
echo 3. Probar las funcionalidades:
echo    - Login como ADMIN → Dashboard debe cargar sin error 500
echo    - Login como RECLUTADOR → Debe ver datos de su empresa
echo    - Login como ASPIRANTE → Hoja de vida debe funcionar
echo.
echo =========================================
echo ✅ Verificación completada
echo =========================================

pause
