# Proyecto Android Kotlin - Documentación Técnica

**Fecha:** 3 de marzo de 2026  
**Proyecto:** Workable Mobile - App nativa Android

---

## 📋 Índice

1. [Decisión: Kotlin Android](#decisión-kotlin-android)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración Gradle](#configuración-gradle)
4. [Problemas y Soluciones](#problemas-y-soluciones)
5. [Conceptos Jetpack Compose](#conceptos-jetpack-compose)
6. [Comandos Esenciales](#comandos-esenciales)
7. [Git y Control de Versiones](#git-y-control-de-versiones)
8. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Decisión: Kotlin Android

**¿Por qué Kotlin y no React Native o Flutter?**
- ✅ Sintaxis similar a Java (tu expertise)
- ✅ Máximo rendimiento (nativo)
- ✅ Jetpack Compose similar a React
- ✅ Tiempo limitado (<1 mes MVP)
- ❌ Solo Android (no multiplataforma)

---

## 📁 Estructura del Proyecto

```
workable-android/
├── gradle/wrapper/          # Gradle Wrapper (8.2)
├── app/
│   ├── build.gradle.kts     # Dependencias (Compose, Retrofit, etc.)
│   ├── src/main/
│   │   ├── AndroidManifest.xml  # Permisos y configuración
│   │   ├── java/com/workable/mobile/
│   │   │   ├── MainActivity.kt     # Punto de entrada
│   │   │   ├── ui/auth/LoginScreen.kt  # Pantalla login
│   │   │   └── ui/theme/           # Tema Material 3
│   │   └── res/                    # Recursos (iconos, strings)
│   └── build/outputs/apk/debug/app-debug.apk  # APK generado
├── build.gradle.kts         # Configuración raíz
├── settings.gradle.kts      # Módulos del proyecto
├── gradle.properties        # Config global (cache=false)
└── gradlew.bat             # Ejecutable Gradle
```

**Package:** `com.workable.mobile`

---

## ⚙️ Configuración Gradle

### settings.gradle.kts
```kotlin
pluginManagement {
    repositories { google(); mavenCentral(); gradlePluginPortal() }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { google(); mavenCentral() }
}
rootProject.name = "Workable"
include(":app")
```

### build.gradle.kts (raíz)
```kotlin
plugins {
    id("com.android.application") version "8.2.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.20" apply false
}
```

### app/build.gradle.kts
```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.workable.mobile"
    compileSdk = 34
    defaultConfig {
        applicationId = "com.workable.mobile"
        minSdk = 24; targetSdk = 34
        versionCode = 1; versionName = "1.0"
    }
    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.4" }
}

dependencies {
    // Compose BOM
    implementation(platform("androidx.compose:compose-bom:2024.01.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    
    // Core Android
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    
    // API y Networking
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Asincronía
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // Arquitectura
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.navigation:navigation-compose:2.7.6")
    implementation("androidx.datastore:datastore-preferences:1.0.0")
}
```

### gradle.properties
```properties
android.useAndroidX=true
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
kotlin.code.style=official
org.gradle.parallel=true
org.gradle.configuration-cache=false  # CRÍTICO: Desactivado por Java 21
```

---

## 💻 Archivos de Código Principal

### MainActivity.kt
```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            WorkableTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    LoginScreen()
                }
            }
        }
    }
}
```

### LoginScreen.kt
```kotlin
@Composable
fun LoginScreen() {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier.fillMaxSize().padding(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Bienvenido a Workable", style = MaterialTheme.typography.headlineLarge)
        Spacer(modifier = Modifier.height(16.dp))
        Text("Iniciar sesion", style = MaterialTheme.typography.headlineMedium)
        Button(onClick = { println("Login") }) { Text("Entrar") }
    }
}
```

**Estado reactivo:** `mutableStateOf("")` + `remember` = `useState` en React

---

## 🎨 Sistema de Temas UI

### Color.kt
```kotlin
val WorkablePrimary = Color(0xFF1976D2) // Azul principal
```

### Theme.kt
```kotlin
@Composable
fun WorkableTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(primary = WorkablePrimary),
        typography = Typography,
        content = content
    )
}
```

## 📱 Manifiesto de Android

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:usesCleartextTraffic="true"
        android:icon="@mipmap/ic_launcher">
        
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

**Permisos:** INTERNET (obligatorio), ACCESS_NETWORK_STATE  
**usesCleartextTraffic="true":** Permite HTTP para desarrollo

---

## 🚨 Problemas y Soluciones

### 1. Error Configuration Cache con Java 21
**Error:** `JdkImageTransform` serialization failed  
**Causa:** AGP 8.2.0 + Java 21 incompatibilidad  
**Solución:** `gradle.properties` → `org.gradle.configuration-cache=false`

### 2. Errores de sintaxis en LoginScreen.kt
**Errores:** `andoridx` typo, comas faltantes  
**Solución:** Corregir imports y sintaxis Kotlin

### 3. Surface con múltiples hijos
**Error:** Surface solo acepta 1 hijo directo  
**Solución:** Envolver en `Column` si necesitas múltiples elementos

---

## 🔨 Proceso de Compilación

### Comandos Básicos
```bash
# Limpiar build
gradlew.bat clean

# Compilar APK debug
gradlew.bat assembleDebug

# Ver tasks disponibles
gradlew.bat tasks
```

### Ubicación APK
`workable-android/app/build/outputs/apk/debug/app-debug.apk`

### Instalación
- **ADB:** `adb install -r app-debug.apk`
- **Directo:** Copiar APK a dispositivo y abrir
- **HTTP:** `python -m http.server 8000` → acceder desde dispositivo

---

## � Git y Control de Versiones

### ¿Qué se sube al repositorio?

**SÍ se sube (todo el código y configuración):**
- ✅ Todo el código fuente (`app/src/main/java/`, `app/src/main/res/`)
- ✅ Archivos de configuración Gradle (`build.gradle.kts`, `settings.gradle.kts`, `gradle.properties`)
- ✅ Gradle Wrapper (`gradle/wrapper/`, `gradlew`, `gradlew.bat`)
- ✅ `AndroidManifest.xml`
- ✅ Archivos de tema y recursos
- ✅ `.gitignore`

**NO se sube (archivos locales/generados):**
- ❌ `local.properties` (ruta del SDK - diferente en cada máquina)
- ❌ Carpeta `build/` (APKs generados, archivos compilados)
- ❌ Carpeta `.gradle/` (caché de Gradle)
- ❌ `.idea/` (configuración de IntelliJ/Android Studio)
- ❌ `*.iml` (archivos de módulos IDE)
- ❌ `*.apk`, `*.aab` (archivos de instalación generados)

### .gitignore Recomendado

```gitignore
# Built application files
*.apk
*.ap_
*.aab

# Files for the ART/Dalvik VM
*.dex

# Generated files
bin/
gen/
out/
build/

# Gradle files
.gradle/

# Local configuration file (sdk path, etc)
local.properties

# IntelliJ
*.iml
*.ipr
*.iws
.idea/workspace.xml
.idea/tasks.xml
.idea/gradle.xml
.idea/misc.xml
.idea/uiDesigner.xml

# Keystore files
*.jks
*.keystore

# External native build folder
.externalNativeBuild
.cxx/

# macOS
.DS_Store

# Windows
Thumbs.db
ehthumbs.db
```

**Resumen:** Sube TODO el código fuente y configuración, NO subas archivos generados, cachés o configuración local.

---

## �📚 Conceptos Jetpack Compose

### ¿Qué es Compose?
Framework declarativo para UI (como React). Reemplaza XML tradicional.

### Conceptos Clave

#### Estado Reactivo
```kotlin
var email by remember { mutableStateOf("") }  // Equivalente a useState("")
```

#### Layouts
```kotlin
Column { /* Vertical */ }
Row { /* Horizontal */ }
Box { /* Apilado */ }
```

#### Modifiers
```kotlin
Modifier.fillMaxWidth().padding(16.dp).background(Color.Blue)
```

#### Components Material 3
```kotlin
Button(onClick = {}) { Text("Click") }
OutlinedTextField(value = email, onValueChange = { email = it })
```

### Ciclo de Vida
- `@Composable` = función que genera UI
- Recomposición = re-render automático cuando cambia estado
- `remember` preserva estado entre recomposiciones

---

## 🚀 Próximos Pasos

### 1. Completar LoginScreen
- Agregar `OutlinedTextField` para email/password
- Validación básica con `Patterns.EMAIL_ADDRESS`
- Estado de loading con `CircularProgressIndicator`

### 2. Navegación
- `Navigation Compose` para cambiar entre pantallas
- `NavGraph` con rutas login/register/home
- `NavController` para navegación programática

### 3. API Integration
- `Retrofit` para llamadas HTTP al backend Spring Boot
- `OkHttp` con logging interceptor
- `Gson` para parseo JSON
- `Coroutines` para asincronía

### 4. Arquitectura MVVM
- `ViewModel` para lógica de negocio
- `StateFlow` para estado reactivo
- `Repository` pattern para datos
- `DataStore` para persistir JWT

### 5. Pantallas Principales
- RegisterScreen (registro de usuarios)
- HomeScreen con navegación por roles (Aspirante/Reclutador/Admin)
- Pantallas específicas por rol

### Checklist de Progreso
- ✅ Proyecto configurado
- ✅ LoginScreen básico
- ✅ APK compilando
- ⏳ Campos de login funcionales
- ❌ API integration
- ❌ Navegación completa
- ❌ MVVM architecture
