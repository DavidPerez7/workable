# 📱 Setup Completo de Entorno Kotlin Android para Workable Mobile

**Proyecto:** Workable Mobile  
**Fecha:** 3 de marzo de 2026  
**Plataforma:** Windows  
**Framework:** Kotlin Android (Nativo)  
**Objetivo:** Configurar entorno de desarrollo Android sin Android Studio, usando solo VS Code y herramientas de línea de comandos

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Verificación del Sistema](#verificación-del-sistema)
4. [Instalación de Android SDK Command Line Tools](#instalación-de-android-sdk-command-line-tools)
5. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
6. [Aceptación de Licencias SDK](#aceptación-de-licencias-sdk)
7. [Instalación de Componentes Android](#instalación-de-componentes-android)
8. [Instalación de Extensiones VS Code](#instalación-de-extensiones-vs-code)
9. [Verificación Final](#verificación-final)
10. [Problemas Encontrados y Soluciones](#problemas-encontrados-y-soluciones)
11. [Comandos Útiles](#comandos-útiles)
12. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Introducción

Este documento detalla el proceso completo de configuración del entorno de desarrollo para la aplicación móvil de Workable utilizando Kotlin Android nativo. 

### ¿Por qué Kotlin Android y no React Native?

**Decisión tomada:** Kotlin Android Nativo

**Razones:**
- ✅ El equipo tiene fuerte experiencia en Java/Spring Boot
- ✅ Kotlin es una evolución natural de Java (curva de aprendizaje corta)
- ✅ No se requiere app multi-plataforma (solo Android para MVP)
- ✅ Performance nativa real
- ✅ Fortalece el perfil profesional en el ecosistema Java/JVM
- ✅ Permite aprendizaje profundo de desarrollo mobile real

### Estrategia de Desarrollo

- **Desarrollo:** VS Code + Android SDK Command Line Tools
- **Compilación:** Gradle Wrapper (`gradlew.bat`)
- **Testing:** APK directo instalado en dispositivo físico
- **Backend:** Spring Boot ya existente en AWS
- **Arquitectura:** MVVM (similar a Controller-Service-Repository del backend)

---

## 📦 Requisitos Previos

### Software Base Necesario

| Componente | Versión Mínima | Propósito |
|------------|----------------|-----------|
| JDK | 17+ | Compilación de Kotlin y ejecución de Gradle |
| Android SDK | API 30+ | Compilación de aplicaciones Android |
| VS Code | Latest | Editor de código principal |
| Sistema Operativo | Windows 10+ | Entorno de desarrollo |

### Espacio en Disco

- Android SDK Command Line Tools: ~150 MB (descarga)
- Android SDK completo: ~2-3 GB (tras instalación de componentes)
- Proyecto Kotlin: ~500 MB (con dependencias)

**Total recomendado:** 5 GB libres

---

## 🔍 Verificación del Sistema

### Paso 1: Verificar Java JDK

**Comando:**
```bash
java -version
```

**Resultado esperado:**
```
java version "21.0.9" 2025-10-21 LTS
Java(TM) SE Runtime Environment (build 21.0.9+7-LTS-338)
Java HotSpot(TM) 64-Bit Server VM (build 21.0.9+7-LTS-338, mixed mode, sharing)
```

**Interpretación:**
- ✅ **Version 21 (o 17+):** Compatibilidad total con Android SDK y Gradle
- ❌ **Version < 17:** Actualizar JDK antes de continuar

---

### Paso 2: Verificar Variable JAVA_HOME

**Comando:**
```bash
echo %JAVA_HOME%
```

**Resultado esperado:**
```
C:\Program Files\Java\jdk-21
```

**⚠️ Si devuelve `%JAVA_HOME%` (sin expandir):**

Significa que la variable no está configurada. Configurarla así:

```bash
setx JAVA_HOME "C:\Program Files\Java\jdk-21"
```

**Nota:** Ajustar la ruta según la ubicación real de tu JDK.

---

### Paso 3: Verificar Android SDK (Inicial)

**Comando:**
```bash
echo %ANDROID_HOME%
```

**Resultado esperado en primera ejecución:**
```
%ANDROID_HOME%
```

Esto es **normal** si nunca has instalado Android SDK. Lo configuraremos en pasos siguientes.

---

### Paso 4: Verificar Gradle (Opcional)

**Comando:**
```bash
gradle --version
```

**Resultado esperado:**
```
"gradle" no se reconoce como un comando interno o externo
```

**✅ Esto es correcto y esperado.**

**Razón:** No necesitamos Gradle instalado globalmente. El proyecto Kotlin Android incluirá **Gradle Wrapper** (`gradlew.bat`) que descarga automáticamente la versión correcta de Gradle.

---

### Paso 5: Verificar Extensiones VS Code

**Comando:**
```bash
code --list-extensions
```

**Resultado inicial:**
```
74th.monokai-charcoal-high-contrast
github.copilot-chat
pkief.material-icon-theme
```

**Análisis:**
- ❌ No hay extensiones de Kotlin
- ❌ No hay extensiones de Java/Gradle

Las instalaremos más adelante en el proceso.

---

## 📥 Instalación de Android SDK Command Line Tools

### Paso 1: Crear Directorio Base

**Comando:**
```bash
mkdir "%LOCALAPPDATA%\Android\Sdk"
```

**Ubicación resultante:**
```
C:\Users\SENA\AppData\Local\Android\Sdk
```

**Nota:** Esta es la ubicación estándar que Android Studio y las herramientas de Android esperan por defecto.

---

### Paso 2: Descargar Command Line Tools

**⚠️ PROBLEMA ENCONTRADO:**

Comando intentado (que NO funcionó):
```bash
mkdir "%LOCALAPPDATA%\Android\Sdk" 2>nul && echo Directorio creado || echo Directorio ya existe
```

**Error:**
```
"amp" no se reconoce como un comando interno o externo
```

**Causa:** Los caracteres `&` en Windows CMD deben escribirse como `&` en comandos simples, pero al usar el shell pueden causar problemas de interpretación.

---

**✅ SOLUCIÓN:**

Usamos PowerShell para descargas web:

```bash
powershell -Command "Write-Host 'Descargando Android Command Line Tools... (esto puede tomar unos minutos)'; $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip' -OutFile '%TEMP%\cmdline-tools.zip'; Write-Host 'Descarga completada!'"
```

**¿Por qué PowerShell?**
- ✅ `Invoke-WebRequest` es nativo de PowerShell
- ✅ `$ProgressPreference = 'SilentlyContinue'` acelera la descarga
- ✅ Manejo robusto de archivos grandes

**Resultado:**
```
Descargando Android Command Line Tools... (esto puede tomar unos minutos)
Descarga completada!
```

**Archivo descargado en:**
```
C:\Users\SENA\AppData\Local\Temp\cmdline-tools.zip
```

**Tamaño aproximado:** ~150 MB

---

### Paso 3: Extraer Command Line Tools

**Comando:**
```bash
powershell -Command "Write-Host 'Extrayendo archivos...'; Expand-Archive -Path '%TEMP%\cmdline-tools.zip' -DestinationPath '%LOCALAPPDATA%\Android\Sdk\cmdline-tools' -Force; Write-Host 'Extraccion completada!'"
```

**Resultado:**
```
Extrayendo archivos...
Extraccion completada!
```

**Estructura resultante:**
```
C:\Users\SENA\AppData\Local\Android\Sdk\cmdline-tools\
└── cmdline-tools\
    ├── bin\
    ├── lib\
    └── ...
```

---

### Paso 4: Reorganizar Estructura (CRÍTICO)

**⚠️ PROBLEMA ESTRUCTURAL:**

Android SDK espera esta estructura:
```
cmdline-tools/
└── latest/         ← Debe tener este nombre específico
    ├── bin/
    ├── lib/
    └── ...
```

Pero la extracción crea:
```
cmdline-tools/
└── cmdline-tools/  ← Nombre duplicado
    ├── bin/
    └── ...
```

---

**✅ SOLUCIÓN:**

Renombrar la carpeta interna:

```bash
move "%LOCALAPPDATA%\Android\Sdk\cmdline-tools\cmdline-tools" "%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest"
```

**Resultado:**
```
Se ha(n) movido 1 directorio(s).
```

**Verificación:**
```bash
dir "%LOCALAPPDATA%\Android\Sdk\cmdline-tools"
```

**Salida esperada:**
```
Directorio de C:\Users\SENA\AppData\Local\Android\Sdk\cmdline-tools

03/03/2026  03:19 p. m.    <DIR>          .
03/03/2026  03:19 p. m.    <DIR>          ..
03/03/2026  03:19 p. m.    <DIR>          latest
```

✅ **Ahora la estructura es correcta.**

---

## 🔧 Configuración de Variables de Entorno

### Paso 1: Configurar ANDROID_HOME (Permanente)

**Comando:**
```bash
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
```

**Resultado:**
```
CORRECTO: se guardó el valor especificado.
```

**¿Qué hace `setx`?**
- Configura la variable de entorno de forma **permanente** para el usuario
- La variable estará disponible en TODAS las nuevas ventanas de terminal
- ⚠️ **NO** afecta a la terminal actual (necesita reinicio)

---

### Paso 2: Agregar Android SDK al PATH (Permanente)

**Comando:**
```bash
powershell -Command "[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'User') + ';%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin;%LOCALAPPDATA%\Android\Sdk\platform-tools', 'User'); Write-Host 'PATH actualizado correctamente'"
```

**Resultado:**
```
PATH actualizado correctamente
```

**¿Qué rutas agregamos?**

1. **`cmdline-tools\latest\bin`:**
   - Contiene: `sdkmanager.bat`, `avdmanager.bat`
   - Propósito: Gestión de paquetes SDK

2. **`platform-tools`:**
   - Contiene: `adb.exe`, `fastboot.exe`
   - Propósito: Comunicación con dispositivos Android
   - ⚠️ **Nota:** `platform-tools` aún no existe, lo instalaremos después

---

### Paso 3: Configurar Variables en Sesión Actual

**⚠️ PROBLEMA:**

Las variables configuradas con `setx` no afectan la terminal actual.

**Intento fallido:**
```bash
refreshenv 2>nul || set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk && set PATH=%PATH%;%ANDROID_HOME%\cmdline-tools\latest\bin
```

**Error:**
```
"amp" no se reconoce como un comando interno o externo
```

---

**✅ SOLUCIÓN:**

Configurar manualmente en la sesión actual:

```bash
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
```

**Verificación en sesión actual:**
```bash
echo %ANDROID_HOME%
```

**Resultado esperado:**
```
C:\Users\SENA\AppData\Local\Android\Sdk
```

**⚡ Recomendación:** Para futuras sesiones, simplemente cerrar y abrir nueva terminal.

---

## 📜 Aceptación de Licencias SDK

### Paso 1: Verificar sdkmanager

**Comando:**
```bash
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --version
```

**Resultado:**
```
Picked up JAVA_TOOL_OPTIONS: -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8
12.0
```

✅ **sdkmanager funcionando correctamente**

---

### Paso 2: Intentar Aceptar Licencias (Varios Intentos)

**⚠️ PROBLEMA: Licencias interactivas**

**Intento 1 (Fallido):**
```bash
echo y | "%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --licenses
```

**Resultado:**
```
7 of 7 SDK package licenses not accepted.
Review licenses that have not been accepted (y/N)?
```

**Causa:** `echo y` solo envía UNA "y", pero hay 7 licencias.

---

**Intento 2 (Fallido):**
```bash
(echo y & echo y & echo y & echo y & echo y & echo y & echo y & echo y) | sdkmanager --licenses
```

**Error:**
```
"amp" no se reconoce como un comando interno o externo
```

**Causa:** Problema de escaping con `&` en CMD.

---

**Intento 3 (Fallido):**
```bash
powershell -Command "for($i=0; $i -lt 10; $i++) { Write-Output 'y' } | & '%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat' --licenses"
```

**Error:**
```
No se permiten elementos de canalización vacíos.
Token 'licenses' inesperado en la expresión o la instrucción.
```

**Causa:** PowerShell tiene problemas con el operador `&` y los argumentos `--licenses`.

---

### ✅ SOLUCIÓN FINAL: Script Batch

**Crear archivo `accept_licenses.bat`:**

```batch
@echo off
setlocal EnableDelayedExpansion
echo Aceptando licencias de Android SDK...

REM Crear archivo temporal con respuestas
echo y> %TEMP%\licenses.txt
echo y>> %TEMP%\licenses.txt
echo y>> %TEMP%\licenses.txt
echo y>> %TEMP%\licenses.txt
echo y>> %TEMP%\licenses.txt
echo y>> %TEMP%\licenses.txt
echo y>> %TEMP%\licenses.txt
echo y>> %TEMP%\licenses.txt

REM Ejecutar con entrada desde archivo
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --licenses < %TEMP%\licenses.txt

REM Limpiar
del %TEMP%\licenses.txt

echo.
echo Proceso completado!
```

**Ejecutar:**
```bash
accept_licenses.bat
```

**Resultado:**
```
Aceptando licencias de Android SDK...
[... texto extenso de licencias de Google ...]
All SDK package licenses accepted ✅

Proceso completado!
```

**¿Por qué funcionó?**
- ✅ Redireccionamiento de archivo (`<`) en lugar de pipe (`|`)
- ✅ Múltiples "y" escritas en archivo temporal
- ✅ Batch nativo de Windows sin complicaciones de PowerShell

---

## 📦 Instalación de Componentes Android

### Componentes Necesarios

| Componente | Propósito | Tamaño Aprox. |
|------------|-----------|---------------|
| `platform-tools` | ADB, fastboot, herramientas de depuración | ~10 MB |
| `platforms;android-34` | Android 14 SDK Platform (Target) | ~70 MB |
| `build-tools;34.0.0` | Herramientas de compilación (aapt, dx, etc.) | ~60 MB |

**Total:** ~140 MB (comprimido), ~500 MB (instalado)

---

### Comando de Instalación

```bash
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

**Proceso de instalación:**
```
Picked up JAVA_TOOL_OPTIONS: -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8
[====                           ] 15% Fetching...
[==========                     ] 35% Downloading platform-tools...
[====================           ] 52% Unzipping android-34...
[==============================] 100% Computing updates...
```

**⏱️ Tiempo estimado:** 3-10 minutos (depende de conexión a internet)

---

### Verificación de Instalación

**Comando:**
```bash
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --list_installed
```

**Resultado:**
```
Installed packages:
  Path                 | Version | Description                | Location
  -------              | ------- | -------                    | -------
  build-tools;34.0.0   | 34.0.0  | Android SDK Build-Tools 34 | build-tools\34.0.0
  platform-tools       | 37.0.0  | Android SDK Platform-Tools | platform-tools
  platforms;android-34 | 3       | Android SDK Platform 34    | platforms\android-34
```

✅ **Todos los componentes instalados correctamente**

---

### Estructura Final del SDK

```
C:\Users\SENA\AppData\Local\Android\Sdk\
├── build-tools\
│   └── 34.0.0\
│       ├── aapt.exe
│       ├── aapt2.exe
│       ├── apksigner.bat
│       ├── d8.bat
│       └── ...
├── cmdline-tools\
│   └── latest\
│       └── bin\
│           ├── sdkmanager.bat
│           └── avdmanager.bat
├── platform-tools\
│   ├── adb.exe           ← Para debugging con dispositivo
│   ├── fastboot.exe
│   └── ...
└── platforms\
    └── android-34\
        ├── android.jar    ← APIs de Android 14
        ├── framework.aidl
        └── ...
```

---

## 🧩 Instalación de Extensiones VS Code

### Extensión 1: Kotlin Language Support

**Comando:**
```bash
code --install-extension fwcd.kotlin
```

**Resultado:**
```
Installing extensions...
Installing extension 'fwcd.kotlin'...
Extension 'fwcd.kotlin' v0.2.36 was successfully installed.
```

**Propósito:**
- Syntax highlighting para Kotlin
- IntelliSense básico
- Navegación de código

---

### Extensión 2: Extension Pack for Java

**Comando:**
```bash
code --install-extension vscjava.vscode-java-pack
```

**Resultado:**
```
Installing extensions...
Installing extension 'vscjava.vscode-java-pack'...
Extension 'vscjava.vscode-java-dependency' v0.27.0 was successfully installed.
Extension 'vscjava.vscode-java-debug' v0.58.5 was successfully installed.
Extension 'vscjava.vscode-java-test' v0.44.0 was successfully installed.
Extension 'vscjava.vscode-java-pack' v0.30.5 was successfully installed.
Extension 'vscjava.vscode-maven' v0.45.1 was successfully installed.
Extension 'vscjava.vscode-gradle' v3.17.2 was successfully installed.
Extension 'redhat.java' v1.53.0 was successfully installed.
```

**Extensiones incluidas en el pack:**

| Extensión | Propósito |
|-----------|-----------|
| `redhat.java` | Lenguaje Java (Language Server) |
| `vscjava.vscode-gradle` | **Soporte Gradle** (crítico para Android) |
| `vscjava.vscode-java-debug` | Debugging de aplicaciones Java/Kotlin |
| `vscjava.vscode-java-dependency` | Gestión de dependencias |
| `vscjava.vscode-java-test` | Ejecución de tests |
| `vscjava.vscode-maven` | Maven (opcional, útil si migras de Maven) |

---

### Verificación Final de Extensiones

**Comando:**
```bash
code --list-extensions
```

**Resultado esperado:**
```
74th.monokai-charcoal-high-contrast
fwcd.kotlin                           ← Kotlin ✓
github.copilot-chat
pkief.material-icon-theme
redhat.java                           ← Java ✓
vscjava.vscode-gradle                 ← Gradle ✓
vscjava.vscode-java-debug
vscjava.vscode-java-dependency
vscjava.vscode-java-pack
vscjava.vscode-java-test
vscjava.vscode-maven
```

✅ **Todas las extensiones necesarias instaladas**

---

### 🧹 Recomendación: Limpiar Extensiones Innecesarias

Si en algún momento tienes muchas extensiones instaladas y deseas desinstalar todas las innecesarias manteniendo solo `github.copilot-chat`, puedes ejecutar este comando:

**Comando para desinstalar todas EXCEPTO copilot-chat:**
```powershell
code --list-extensions | Where-Object { $_ -ne 'github.copilot-chat' } | ForEach-Object { code --uninstall-extension $_ }
```

**Explicación:**
- `code --list-extensions` → Lista todas las extensiones instaladas
- `Where-Object { $_ -ne 'github.copilot-chat' }` → Filtra excluyendo la extensión de copilot
- `ForEach-Object { code --uninstall-extension $_ }` → Desinstala cada una de las extensiones filtradas

**Resultado:**
```
Uninstalling extension1...
Extension 'extension1' was successfully uninstalled!
Uninstalling extension2...
Extension 'extension2' was successfully uninstalled!
...
```

**Ventajas:**
- ✅ Mantiene VS Code limpio y rápido
- ✅ Preserva GitHub Copilot Chat (útil para desarrollo)
- ✅ Reduce conflictos de dependencias entre extensiones
- ✅ Permite instalar solo lo necesario según el proyecto

---

## ✅ Verificación Final

### Checklist Completo

```
✅ JDK 21.0.9 instalado
✅ JAVA_HOME configurado: C:\Program Files\Java\jdk-21
✅ Android SDK instalado: C:\Users\SENA\AppData\Local\Android\Sdk
✅ ANDROID_HOME configurado (permanente)
✅ PATH actualizado con cmdline-tools y platform-tools
✅ Licencias SDK aceptadas (7/7)
✅ platform-tools v37.0.0 instalado
✅ build-tools v34.0.0 instalado
✅ platforms android-34 (Android 14) instalado
✅ Extensión Kotlin v0.2.36 instalada
✅ Extension Pack for Java instalado
✅ Gradle support v3.17.2 instalado
```

---

### Comandos de Verificación Rápida

**1. Verificar Java:**
```bash
java -version
```

**2. Verificar Android SDK:**
```bash
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --version
```

**3. Verificar componentes instalados:**
```bash
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --list_installed
```

**4. Verificar extensiones VS Code:**
```bash
code --list-extensions | findstr kotlin
code --list-extensions | findstr gradle
```

---

## ⚠️ Problemas Encontrados y Soluciones

### Problema 1: Operador `&` en CMD

**Síntoma:**
```
"amp" no se reconoce como un comando interno o externo
```

**Causa:**
Los caracteres `&` necesitan escaping especial en Windows CMD cuando se usan en ciertos contextos.

**Soluciones:**
1. Usar comandos separados (sin `&&` ni `&`)
2. Usar PowerShell para comandos complejos
3. Crear scripts `.bat` para lógica compleja

---

### Problema 2: Licencias Interactivas SDK

**Síntoma:**
```bash
echo y | sdkmanager --licenses
# Solo acepta 1 de 7 licencias
```

**Causa:**
`sdkmanager --licenses` muestra 7 licencias secuenciales, cada una requiere entrada "y".

**Solución:**
Crear archivo temporal con múltiples "y" y usar redirección de archivo (`<`) en lugar de pipe (`|`).

```batch
echo y> licenses.txt
echo y>> licenses.txt
...
sdkmanager --licenses < licenses.txt
```

---

### Problema 3: Variables de Entorno No Disponibles

**Síntoma:**
```bash
echo %ANDROID_HOME%
# Devuelve: %ANDROID_HOME%
```

**Causa:**
`setx` no afecta la terminal actual, solo futuras sesiones.

**Solución:**
Para sesión actual:
```bash
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
```

Para futuras sesiones: Cerrar y reabrir terminal.

---

### Problema 4: Estructura Incorrecta de cmdline-tools

**Síntoma:**
```bash
sdkmanager --version
# No funciona después de extraer ZIP
```

**Causa:**
Android SDK espera:
```
cmdline-tools/latest/bin/sdkmanager.bat
```

Pero ZIP incluye:
```
cmdline-tools/cmdline-tools/bin/sdkmanager.bat
```

**Solución:**
```bash
move cmdline-tools\cmdline-tools cmdline-tools\latest
```

---

### Problema 5: PowerShell con Argumentos `--`

**Síntoma:**
```powershell
& 'sdkmanager.bat' --licenses
# Error: Token 'licenses' inesperado
```

**Causa:**
PowerShell interpreta `--licenses` como operador de decremento.

**Solución:**
Usar comillas o ejecutar desde CMD:
```powershell
& 'sdkmanager.bat' '--licenses'
```

O mejor: Usar script `.bat` desde CMD.

---

### Problema 6: Acceso Denegado en %TEMP% al Descargar ZIP

**Síntoma:**
```powershell
Invoke-WebRequest -OutFile "$env:TEMP\cmdline-tools.zip" ...
# Acceso denegado a la ruta
```

**Causa:**
`$env:TEMP` puede apuntar a una ruta con permisos restringidos o configuración del sistema.

**Solución:**
Usar `curl` en lugar de `Invoke-WebRequest`:
```bash
curl -o 'C:\Temp\cmdline-tools.zip' 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip'
```
O crear directorio alternativo y usar `Start-BitsTransfer` para descargas grandes.

---

### Problema 7: Ruta Incorrecta de JAVA_HOME (Versión Específica)

**Síntoma:**
```bash
sdkmanager --version
# ERROR: JAVA_HOME is set to an invalid directory: C:\Program Files\Java\jdk-21
```

**Causa:**
La instalación crea carpetas con versiones específicas (ej. `jdk-21.0.10`), no genéricas.

**Solución:**
Verificar ruta real:
```bash
dir "C:\Program Files\Java"
```
Configurar con ruta exacta:
```bash
setx JAVA_HOME "C:\Program Files\Java\jdk-21.0.10"
```

---

### Problema 8: Archivo local.properties Requerido

**Síntoma:**
```bash
gradlew.bat assembleDebug
# SDK location not found. Define sdk.dir in local.properties
```

**Causa:**
Gradle requiere `local.properties` para localizar el SDK, incluso con ANDROID_HOME configurado.

**Solución:**
Crear `local.properties` en la raíz del proyecto:
```
sdk.dir=C:\\Users\\<usuario>\\AppData\\Local\\Android\\Sdk
```
Reemplazar `<usuario>` con el nombre real (ej. `SENA`).

---

### Problema 9: Advertencia de Parámetro No Usado en Kotlin

**Síntoma:**
```kotlin
// Línea 8: Parameter 'navController' is never used
fun AspiranteScreen(navController: NavController) { ... }
```

**Causa:**
Parámetros declarados pero no utilizados generan warnings en compilación.

**Solución:**
- Usar el parámetro (ej. `navController.navigate(...)`).
- Prefijar con `_` si no se usa: `fun AspiranteScreen(_navController: NavController)`.
- Suprimir warning: `@Suppress("UNUSED_PARAMETER")`.

---

### Problema 10: Licencias SDK Aceptadas Automáticamente en Instalación

**Síntoma:**
Durante instalación de componentes, licencias se aceptan sin intervención.

**Causa:**
Versiones recientes de sdkmanager aceptan licencias automáticamente durante instalación.

**Solución:**
Si falla, revertir al script batch documentado en Problema 2. Para setups nuevos, intentar instalación directa primero.

---

## 📚 Comandos Útiles

### Android SDK Manager

**Listar paquetes disponibles:**
```bash
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --list
```

**Actualizar todos los paquetes:**
```bash
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --update
```

**Instalar paquete específico:**
```bash
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "package-name"
```

**Ver paquetes instalados:**
```bash
"%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --list_installed
```

---

### Gradle (cuando tengas proyecto)

**Compilar APK de debug:**
```bash
gradlew.bat assembleDebug
```

**Limpiar proyecto:**
```bash
gradlew.bat clean
```

**Ver todas las tareas disponibles:**
```bash
gradlew.bat tasks
```

**Compilar y ejecutar tests:**
```bash
gradlew.bat test
```

**Generar APK release (firmado):**
```bash
gradlew.bat assembleRelease
```

---

### ADB (Android Debug Bridge)

**⚠️ Nota:** Estos comandos requieren dispositivo conectado vía USB. Como usarás APK directo, no los necesitas por ahora.

**Listar dispositivos conectados:**
```bash
adb devices
```

**Instalar APK en dispositivo:**
```bash
adb install ruta\del\app-debug.apk
```

**Desinstalar app:**
```bash
adb uninstall com.workable.app
```

**Ver logs en tiempo real:**
```bash
adb logcat
```

---

## 🚀 Próximos Pasos

### 1. Crear Proyecto Kotlin Android

**Opciones:**

**Opción A: Plantilla oficial de Google**
```bash
git clone https://github.com/android/compose-samples.git
```

**Opción B: Crear desde cero con Gradle**
- Configurar `build.gradle.kts`
- Definir estructura de carpetas
- Configurar dependencias

---

### 2. Configurar Dependencias Clave

**build.gradle.kts (app):**

```kotlin
dependencies {
    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.20")
    
    // AndroidX Core
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    
    // Jetpack Compose (UI moderna)
    implementation("androidx.compose.ui:ui:1.6.0")
    implementation("androidx.compose.material3:material3:1.2.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    
    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.6")
    
    // Retrofit (API REST - como Feign de Spring)
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp (Cliente HTTP - como RestTemplate)
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Coroutines (Async - como CompletableFuture)
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // ViewModel & LiveData (MVVM)
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.7.0")
    
    // DataStore (SharedPreferences moderno para JWT)
    implementation("androidx.datastore:datastore-preferences:1.0.0")
    
    // Room (Base de datos local - como JPA)
    implementation("androidx.room:room-runtime:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
}
```

---

### 3. Estructura del Proyecto (Propuesta)

```
workable-mobile/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/workable/mobile/
│   │   │   │   ├── data/                    ← Capa de datos
│   │   │   │   │   ├── api/                 ← Retrofit services
│   │   │   │   │   │   ├── AuthApi.kt       (POST /api/auth/login)
│   │   │   │   │   │   ├── OfertasApi.kt    (GET /api/ofertas)
│   │   │   │   │   │   └── PostulacionesApi.kt
│   │   │   │   │   ├── model/               ← DTOs
│   │   │   │   │   │   ├── Usuario.kt
│   │   │   │   │   │   ├── Oferta.kt
│   │   │   │   │   │   └── LoginRequest.kt
│   │   │   │   │   ├── repository/          ← Repositorios
│   │   │   │   │   │   ├── AuthRepository.kt
│   │   │   │   │   │   └── OfertasRepository.kt
│   │   │   │   │   └── local/               ← DataStore/Room
│   │   │   │   │       └── TokenDataStore.kt
│   │   │   │   ├── domain/                  ← Lógica de negocio (casos de uso)
│   │   │   │   │   ├── LoginUseCase.kt
│   │   │   │   │   └── GetOfertasUseCase.kt
│   │   │   │   ├── ui/                      ← Pantallas (Compose)
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── LoginScreen.kt
│   │   │   │   │   │   ├── RegisterScreen.kt
│   │   │   │   │   │   └── LoginViewModel.kt
│   │   │   │   │   ├── aspirante/
│   │   │   │   │   │   ├── DashboardScreen.kt
│   │   │   │   │   │   ├── OfertasScreen.kt
│   │   │   │   │   │   ├── PerfilScreen.kt
│   │   │   │   │   │   └── AspiranteViewModel.kt
│   │   │   │   │   └── reclutador/
│   │   │   │   │       ├── MisOfertasScreen.kt
│   │   │   │   │       ├── PostulantesScreen.kt
│   │   │   │   │       └── ReclutadorViewModel.kt
│   │   │   │   ├── navigation/              ← Navegación entre pantallas
│   │   │   │   │   ├── NavGraph.kt
│   │   │   │   │   └── Routes.kt
│   │   │   │   ├── di/                      ← Dependency Injection (Hilt)
│   │   │   │   │   └── NetworkModule.kt
│   │   │   │   └── MainActivity.kt          ← Punto de entrada
│   │   │   ├── res/                         ← Recursos (strings, colores, etc.)
│   │   │   │   ├── values/
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   ├── colors.xml
│   │   │   │   │   └── themes.xml
│   │   │   │   └── drawable/                ← Imágenes/iconos
│   │   │   └── AndroidManifest.xml          ← Configuración de la app
│   │   └── test/                            ← Tests unitarios
│   └── build.gradle.kts                     ← Dependencias del módulo
├── build.gradle.kts                         ← Config global
├── settings.gradle.kts                      ← Módulos del proyecto
├── gradle.properties                        ← Props de Gradle
├── gradlew.bat                              ← Gradle Wrapper (Windows)
└── local.properties                         ← SDK location (auto-generado)
```

---

### 4. Arquitectura: MVVM (Como Spring Boot)

**Comparativa con tu backend:**

| Spring Boot | Kotlin Android |
|-------------|----------------|
| `@RestController` | **View** (Compose Screen) |
| `@Service` | **ViewModel** + Use Cases |
| `@Repository` | **Repository** + API/Room |
| `@Entity` | **Model** (data class) |
| `RestTemplate/Feign` | **Retrofit** |
| `Optional<T>` | **Nullable types** (`T?`) |
| `CompletableFuture` | **Coroutines** (`suspend fun`) |
| `@Autowired` | **Constructor Injection** (Hilt) |

---

### 5. Flujo de Desarrollo (Tu Workflow)

```
1. Escribes código Kotlin en VS Code
   ↓
2. Gradle compila y genera APK
   📌 gradlew.bat assembleDebug
   ↓
3. APK generado en:
   app/build/outputs/apk/debug/app-debug.apk
   ↓
4. Envías APK al celular
   • WhatsApp
   • Google Drive
   • Cable USB (copiar archivo)
   ↓
5. Instalas en celular
   • Permitir "Instalar apps desconocidas"
   • Abrir APK desde archivos
   ↓
6. App consume tu backend de AWS
   • Retrofit → https://tu-backend.com/api
   • JWT en headers
   ↓
7. Pruebas > Ajustes > Recompilación
   (Ciclo rápido sin emulador)
```

---

### 6. Configurar Retrofit para tu Backend

**NetworkModule.kt:**

```kotlin
object RetrofitClient {
    private const val BASE_URL = "https://tu-backend-aws.com/api/"
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    private val authInterceptor = Interceptor { chain ->
        val token = TokenManager.getToken() // Desde DataStore
        val request = chain.request().newBuilder()
            .addHeader("Authorization", "Bearer $token")
            .build()
        chain.proceed(request)
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .addInterceptor(authInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .build()
    
    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
}
```

**AuthApi.kt:**

```kotlin
interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    @POST("auth/register/aspirante")
    suspend fun registerAspirante(@Body request: RegisterRequest): Response<RegisterResponse>
}

data class LoginRequest(
    val correo: String,
    val contrasena: String
)

data class LoginResponse(
    val token: String,
    val rol: String,
    val usuario: Usuario
)
```

**AuthRepository.kt:**

```kotlin
class AuthRepository {
    private val api = RetrofitClient.retrofit.create(AuthApi::class.java)
    
    suspend fun login(correo: String, contrasena: String): Result<LoginResponse> {
        return try {
            val response = api.login(LoginRequest(correo, contrasena))
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Error: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

**LoginViewModel.kt:**

```kotlin
class LoginViewModel : ViewModel() {
    private val repository = AuthRepository()
    
    private val _loginState = MutableLiveData<LoginState>()
    val loginState: LiveData<LoginState> = _loginState
    
    fun login(correo: String, contrasena: String) {
        viewModelScope.launch {
            _loginState.value = LoginState.Loading
            
            val result = repository.login(correo, contrasena)
            
            _loginState.value = if (result.isSuccess) {
                val response = result.getOrNull()!!
                TokenManager.saveToken(response.token)
                LoginState.Success(response)
            } else {
                LoginState.Error(result.exceptionOrNull()?.message ?: "Error desconocido")
            }
        }
    }
}

sealed class LoginState {
    object Idle : LoginState()
    object Loading : LoginState()
    data class Success(val response: LoginResponse) : LoginState()
    data class Error(val message: String) : LoginState()
}
```

---

### 7. Primera Compilación (Cuando tengas proyecto)

**Comandos:**

```bash
# Navegar al proyecto
cd workable-mobile

# Sincronizar dependencias (primera vez)
gradlew.bat --refresh-dependencies

# Compilar APK de debug
gradlew.bat assembleDebug

# APK estará en:
# app\build\outputs\apk\debug\app-debug.apk
```

**Tiempo estimado primera compilación:** 5-15 minutos (descarga dependencias)

**Compilaciones posteriores:** 30-60 segundos

---

## 📖 Recursos Adicionales

### Documentación Oficial

- **Kotlin:** https://kotlinlang.org/docs/home.html
- **Android Developers:** https://developer.android.com/
- **Jetpack Compose:** https://developer.android.com/jetpack/compose
- **Retrofit:** https://square.github.io/retrofit/
- **Coroutines:** https://kotlinlang.org/docs/coroutines-overview.html

### Tutoriales Recomendados

- **Kotlin for Java Developers:** https://kotlinlang.org/docs/java-to-kotlin-idioms-strings.html
- **Android MVVM Architecture:** https://developer.android.com/topic/architecture
- **Retrofit + Coroutines:** https://square.github.io/retrofit/#kotlin-coroutines

### Comparativas para Spring Boot Developers

- **Spring @Service ↔ ViewModel + UseCase**
- **Spring @Repository ↔ Repository Pattern + Retrofit**
- **Spring RestTemplate ↔ Retrofit**
- **Spring @Autowired ↔ Hilt Dependency Injection**
- **Spring Security JWT ↔ DataStore + Interceptors**

---

## 🎯 Conclusión

**Setup completado exitosamente. Componentes instalados:**

✅ **JDK 21** → Compilación Kotlin/Gradle  
✅ **Android SDK** → Compilación apps Android  
✅ **Build Tools 34** → Generación de APK  
✅ **Platform Tools** → Debugging (opcional)  
✅ **VS Code + Kotlin** → Entorno de desarrollo  
✅ **Gradle Extension** → Gestión de tareas  

**Listo para crear proyecto Kotlin Android y consumir backend Spring Boot.**

---

**Siguiente paso:** Crear estructura base del proyecto con arquitectura MVVM y conectar a tu API REST de Workable en AWS.

---

## 📝 Notas del Desarrollador

### Problemas Resueltos

1. ✅ Operador `&` en CMD → Usar comandos separados o PowerShell
2. ✅ Licencias interactivas → Script batch con archivo de entrada
3. ✅ Variables de entorno → Configuración permanente con `setx`
4. ✅ Estructura cmdline-tools → Renombrar a `latest`
5. ✅ Gradle global no necesario → Usar Gradle Wrapper del proyecto

### Lecciones Aprendidas

- **Windows CMD tiene limitaciones** → PowerShell para operaciones complejas
- **Android SDK estructura específica** → Seguir convenciones de Google
- **Variables de entorno no son inmediatas** → Requieren nueva sesión
- **Licencias SDK son bloqueantes** → Mejor automatizar con script
- **VS Code + extensiones = alternativa viable** a Android Studio para proyectos ligeros

### Tiempo Total de Setup

- **Verificación inicial:** 5 minutos
- **Descarga Android SDK:** 5-10 minutos (conexión)
- **Instalación y configuración:** 15-20 minutos
- **Resolución de problemas:** 10 minutos
- **Instalación de componentes:** 10 minutos
- **Extensiones VS Code:** 5 minutos

**Total:** ~45-60 minutos

---

**Documentación creada:** 3 de marzo de 2026  
**Autor:** Equipo Workable (Juan David Gómez, Juan David Pérez, Yerson Zequea)  
**Versión:** 1.0.0  
**Estado:** Setup completado ✅
