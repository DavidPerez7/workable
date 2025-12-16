@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Configuración
set BASE_URL=http://localhost:8080
set EMAIL=reclu.emp.%RANDOM%@example.com
set PASSWORD=pass123
set NOMBRE=Reclu Empresa
set APELLIDO=Tester
set NIT=EMP-%RANDOM%

echo === Registro de Reclutador ===
echo Email: %EMAIL%

REM Registrar reclutador público
curl -s -X POST "%BASE_URL%/api/auth/register-reclutador" ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"%EMAIL%\",\"password\":\"%PASSWORD%\",\"nombre\":\"%NOMBRE%\",\"apellido\":\"%APELLIDO%\"}" > tmp_register.json

echo Registro: & type tmp_register.json

REM Login
curl -s -X POST "%BASE_URL%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"%EMAIL%\",\"password\":\"%PASSWORD%\"}" > tmp_login.json

echo Login: & type tmp_login.json

for /f "tokens=*" %%i in ('powershell -NoProfile -Command "$j=Get-Content tmp_login.json | ConvertFrom-Json; Write-Output $j.token"') do set TOKEN=%%i
if "%TOKEN%"=="" (
  echo ERROR: No se obtuvo token en login.
  goto :end
)

echo Token OK

REM Perfil actual
curl -s -X GET "%BASE_URL%/api/reclutador/me" ^
  -H "Authorization: Bearer %TOKEN%" > tmp_me_before.json

echo Perfil antes: & type tmp_me_before.json

REM Crear Empresa como reclutador autenticado
set EMPRESA_BODY={\"nombre\":\"Empresa QA\",\"descripcion\":\"Empresa creada por script\",\"numeroTrabajadores\":10,\"nit\":\"%NIT%\"}

curl -s -X POST "%BASE_URL%/api/empresa" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "%EMPRESA_BODY%" > tmp_empresa.json

echo Empresa creada: & type tmp_empresa.json

REM Ver perfil nuevamente (debe incluir empresa)
curl -s -X GET "%BASE_URL%/api/reclutador/me" ^
  -H "Authorization: Bearer %TOKEN%" > tmp_me_after.json

echo Perfil despues: & type tmp_me_after.json

REM Validación rápida de presencia de campo empresa
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "$m=Get-Content tmp_me_after.json | ConvertFrom-Json; if ($m.empresa -ne $null) { 'OK' } else { 'NO' }"') do set HAS_EMPRESA=%%i

echo Empresa vinculada: %HAS_EMPRESA%

:end
endlocal
