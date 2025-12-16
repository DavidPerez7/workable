@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Configuración
set BASE_URL=http://localhost:8080
set EMAIL=reclutador.test.%RANDOM%@example.com
set PASSWORD=pass123
set NOMBRE=Reclu Tester

echo === Registro de Reclutador ===
echo Email: %EMAIL%

REM Registrar reclutador
curl -s -X POST "%BASE_URL%/api/auth/register-reclutador" ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"%EMAIL%\",\"password\":\"%PASSWORD%\",\"nombre\":\"%NOMBRE%\"}" > tmp_register.json

REM Verificar respuesta
for /f "usebackq tokens=*" %%A in ("tmp_register.json") do set RESP=%%A

echo Respuesta registro: !RESP!

echo === Login de Reclutador ===
curl -s -X POST "%BASE_URL%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"%EMAIL%\",\"password\":\"%PASSWORD%\"}" > tmp_login.json

for /f "usebackq tokens=*" %%A in ("tmp_login.json") do set LOGIN=%%A

echo Respuesta login: !LOGIN!

REM Extraer token con PowerShell si disponible
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "$j=Get-Content tmp_login.json | ConvertFrom-Json; Write-Output $j.token"') do set TOKEN=%%i

echo Token: %TOKEN%
if "%TOKEN%"=="" (
  echo ERROR: No se obtuvo token. Revisar backend.
  goto :end
)

echo === Perfil del Reclutador ===
curl -s -X GET "%BASE_URL%/api/reclutador/me" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" > tmp_me.json

type tmp_me.json

echo === Prueba finalizada ===

:end
endlocal
