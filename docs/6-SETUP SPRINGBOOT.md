# 🚀 Setup Completo de Spring Boot para Workable Backend

**Proyecto:** Workable Backend  
**Fecha:** 10 de marzo de 2026  
**Plataforma:** Windows 11  
**Framework:** Spring Boot 3.5.4  
**Java:** OpenJDK 21  
**IDE/Editor:** VS Code  
**Objetivo:** Configurar entorno de desarrollo Spring Boot sin IDE pesada, usando Maven CLI y VS Code

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación de Java 21](#instalación-de-java-21)
4. [Verificación de Java](#verificación-de-java)
5. [Configuración de Maven](#configuración-de-maven)
6. [Configuración de JAVA_HOME](#configuración-de-javahome)
7. [Verificación del Setup](#verificación-del-setup)
8. [Problemas Encontrados y Soluciones](#problemas-encontrados-y-soluciones)
9. [Comandos Útiles de Maven](#comandos-útiles-de-maven)
10. [Estructura del Proyecto Spring Boot](#estructura-del-proyecto-spring-boot)
11. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Introducción

Este documento detalla la configuración completa del entorno de desarrollo para **Workable Backend**, un proyecto Spring Boot 3.5.4 que requiere **Java 21** específicamente.

### ¿Por qué Spring Boot sin IDE pesada?

**Decisión tomada:** VS Code + Maven CLI

**Razones:**
- ✅ Maven CLI es más ligero que IDEs como IntelliJ o Eclipse
- ✅ Configuración explícita (sabes exactamente qué está pasando)
- ✅ Misma herramienta usada en CI/CD (GitLab CI, GitHub Actions)
- ✅ Mejor para trabajar en equipo (sin archivos `.idea` o `.project`)
- ✅ Compatible con VS Code mediante extensiones de Java

### Arquitectura del Proyecto

```
Workable Backend (Spring Boot 3.5.4)
    ├── Controllers (REST endpoints)
    ├── Services (Lógica de negocio)
    ├── Repositories (Acceso a datos - JPA)
    ├── Models (Entidades)
    ├── Security (JWT)
    └── Database (MySQL)
```

### Stack Tecnológico

| Componente | Versión | Propósito |
|------------|---------|-----------|
| Java | 21 (OpenJDK) | Runtime |
| Spring Boot | 3.5.4 | Framework |
| Maven | 3.9.6+ | Build tool |
| MySQL | 5.7+ | Base de datos |
| Hibernate | Auto (via Spring) | ORM |
| JWT | Integrado | Autenticación |

---

## 📦 Requisitos Previos

### Software Necesario

| Componente | Versión Mínima | Estado |
|------------|----------------|--------|
| Java JDK | 21 | **CRÍTICO** |
| Maven | 3.6.0 | **CRÍTICO** |
| MySQL Server | 5.7+ | **CRÍTICO** |
| VS Code | Latest | Recomendado |

### Espacio en Disco

- Java 21 JDK: ~300 MB
- Maven + Dependencias: ~2-3 GB (incluye descarga de librerías)
- Proyecto compilado: ~500 MB

**Total recomendado:** 5 GB libres

### Conexión a Internet

**Necesaria para:**
- Descargar Java 21 (192 MB)
- Descargar dependencias Maven (primera ejecución: 1-2 GB)
- Maven Central Repository

---

## 📥 Instalación de Java 21

### Paso 1: Descargar OpenJDK 21

**⚠️ NOTA CRÍTICA:** El proyecto requiere específicamente Java 21. Las versiones anteriores (17, 11, 8) NO son compatibles.

**Comando:**
```powershell
powershell -Command "Write-Host 'Descargando OpenJDK 21...'; Invoke-WebRequest -Uri 'https://download.java.net/java/GA/jdk21.0.2/f2283984656d49d69e91c558476027ac/13/GPL/openjdk-21.0.2_windows-x64_bin.zip' -OutFile 'C:\Temp\openjdk-21.zip'; Write-Host 'Descarga completada.'"
```

**Resultado esperado:**
```
Descargando OpenJDK 21...
Descarga completada.
```

**Tamaño:** ~192 MB  
**Tiempo:** 2-5 minutos (depende de conexión)

---

### Paso 2: Extraer a Carpeta Temporal

**Problema a evitar:** ❌ NO extraigas directamente a `C:\Program Files\Java\` (problemas de permisos)

**Solución:** ✅ Extraer a carpeta temporal primero

**Comando:**
```powershell
powershell -Command "Write-Host 'Extrayendo a carpeta temporal...'; Expand-Archive -Path 'C:\Temp\openjdk-21.zip' -DestinationPath 'C:\Temp\java21-extract' -Force; Write-Host 'Extraccion completada.'"
```

**Resultado esperado:**
```
Extrayendo a carpeta temporal...
Extraccion completada.
```

**Estructura creada:**
```
C:\Temp\java21-extract\
└── jdk-21.0.2\
    ├── bin\
    ├── conf\
    ├── include\
    ├── legal\
    ├── lib\
    └── ...
```

---

### Paso 3: Mover a Ubicación Final (sin Permisos)

**Problema a evitar:** ❌ Este comando puede fallar con "Acceso denegado"
```powershell
Move-Item -Path "C:\Temp\java21-extract\jdk-21.0.2" -Destination "C:\Program Files\Java\jdk-21" -Force
```

**Error:** `ERROR 5 (0x00000005) Acceso denegado.`

**Solución:** ✅ Usar `robocopy` que tiene mejor manejo de permisos

**Comando:**
```powershell
robocopy "C:\Temp\java21-extract\jdk-21.0.2" "C:\Java\jdk-21" /E /COPY:DAT
```

**Resultado esperado:**
```
   ROBOCOPY     ::     Herramienta para copia eficaz de archivos
   Origen : C:\Temp\java21-extract\jdk-21.0.2\
   Destino : C:\Java\jdk-21\
   
   [... muchos archivos copiados ...]
   
   Total: 1000 archivos copiados
```

**¿Por qué `C:\Java\` en lugar de `C:\Program Files\Java\`?**
- `C:\Program Files\` requiere permisos de administrador
- `C:\Java\` es más accesible y evita conflictos
- Spring Boot no requiere ubicación específica

---

### Paso 4: Verificar Instalación

**Comando:**
```powershell
dir "C:\Java"
```

**Resultado esperado:**
```
Directorio: C:\Java

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----     10/03/2026  03:38 p. m.                jdk-21
```

✅ La carpeta `jdk-21` debe existir

---

## 🔍 Verificación de Java

### Paso 1: Probar Ejecutable de Java

**Comando en PowerShell:**
```powershell
& "C:\Java\jdk-21\bin\java.exe" -version
```

**⚠️ PROBLEMA COMÚN:** ❌ Usar sin `&` fallará
```powershell
# ❌ ESTO NO FUNCIONA:
"C:\Java\jdk-21\bin\java.exe" -version
# Error: Token '-version' inesperado

# ✅ ESTO FUNCIONA:
& "C:\Java\jdk-21\bin\java.exe" -version
```

**Resultado esperado:**
```
openjdk version "21.0.2" 2024-01-16
OpenJDK Runtime Environment (build 21.0.2+13-58)
OpenJDK 64-Bit Server VM (build 21.0.2+13-58, mixed mode, sharing)
```

✅ **Debe mostrar versión 21.0.2**

---

### Paso 2: Configurar JAVA_HOME (Permanente)

**Comando:**
```powershell
setx JAVA_HOME "C:\Java\jdk-21"
```

**Resultado:**
```
CORRECTO: se guardó el valor especificado.
```

**¿Qué hace `setx`?**
- Guarda la variable de forma  **permanente** para el usuario
- Se aplica en **nuevas sesiones** de terminal
- NO afecta la sesión actual (necesita cerrar y reabrir terminal)

---

### Paso 3: Verificar JAVA_HOME (Sesión Actual)

**En la terminal actual NO verá el valor porque `setx` requiere nuevo terminal**

**Para pruebas inmediatas en sesión actual:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"
```

**Verificar:**
```powershell
echo $env:JAVA_HOME
```

**Resultado esperado:**
```
C:\Java\jdk-21
```

---

## 🛠️ Configuración de Maven

### Verificación: ¿Maven ya está instalado?

**Comando:**
```powershell
mvn --version
```

**Resultado esperado:**
```
Apache Maven 3.9.6 (bc0240f3c744dd6b6ec2920b3cd08dcc295161ae)
Maven home: C:\Maven\apache-maven-3.9.6
Java version: 21.0.2, vendor: Oracle Corporation, runtime: C:\Java\jdk-21
Default locale: es_MX, platform encoding: UTF-8
OS name: "windows 11", version: "10.0", arch: "amd64", family: "windows"
```

✅ **Debe mostrar Java 21.0.2** (no 17 ni 11)

---

### Problema: Maven Sigue Usando Java 17

**⚠️ PROBLEMA COMÚN:**

Si `mvn --version` muestra:
```
Java version: 17.0.7, vendor: Oracle Corporation, runtime: C:\Program Files\Java\jdk-17
```

**Causa:** Aún no cerró terminal después del `setx`

**Soluciones:**

**Opción 1: Cerrar y reabrir terminal (recomendado)**
1. Cierra la terminal actual (`exit`)
2. Abre nueva terminal PowerShell
3. Ejecuta `mvn --version` nuevamente

**Opción 2: Establecer en sesión actual**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"
mvn --version
```

**Opción 3: Agregar Java 21 al inicio del PATH (temporal)**
```powershell
$env:Path = "C:\Java\jdk-21\bin;" + $env:Path
mvn --version
```

---

### Maven Sin Internet (Modo Offline)

**Nota:** Primera compilación descarga ~1-2 GB de librerías

**Comando con búsqueda en repositorio local:**
```powershell
mvn -o clean compile
```

**⚠️ Solo funciona después de primera compilación con internet**

---

## 🔧 Configuración de JAVA_HOME

### Ubicación de JAVA_HOME (Verificación)

**Comando:**
```powershell
echo $env:JAVA_HOME
```

**Resultado esperado (después de nuevo terminal):**
```
C:\Java\jdk-21
```

### Agregar Java al PATH (Opcional pero Recomendado)

**Comando para agregar permanentemente:**
```powershell
powershell -Command "[Environment]::SetEnvironmentVariable('Path', 'C:\Java\jdk-21\bin;' + [Environment]::GetEnvironmentVariable('Path', 'User'), 'User'); Write-Host 'PATH actualizado para Java 21'"
```

**Resultado:**
```
PATH actualizado para Java 21
```

**Beneficio:** Permite ejecutar `java` y `javac` desde cualquier terminal sin ruta completa

---

## ✅ Verificación del Setup

### Checklist Completo

```
☐ Java 21 descargado (192 MB)
☐ Java 21 extraído a C:\Java\jdk-21
☐ java.exe funciona correctamente
☐ JAVA_HOME configurado permanentemente
☐ Maven detecta Java 21 (3.9.6+)
☐ Terminal nuevo abierto después de setx
☐ MySQL corriendo (si lo necesitas para tests)
```

### Comandos de Verificación Rápida

**1. Verificar Java:**
```powershell
& "C:\Java\jdk-21\bin\java.exe" -version
```

**2. Verificar Maven:**
```powershell
mvn --version
```

**3. Verificar JAVA_HOME en nuevo terminal:**
```powershell
echo $env:JAVA_HOME
```

**4. Listar compiladores Java:**
```powershell
& "C:\Java\jdk-21\bin\javac.exe" -version
```

---

## ⚠️ Problemas Encontrados y Soluciones

### Problema 1: PowerShell rechaza argumentos con guion

**Síntoma:**
```powershell
"C:\Java\jdk-21\bin\java.exe" -version
# Error: Token '-version' inesperado en la expresión
```

**Causa:** PowerShell requiere `&` para ejecutar archivos con rutas entrecomilladas

**❌ INCORRECTO:**
```powershell
"C:\Java\jdk-21\bin\java.exe" -version
```

**✅ CORRECTO:**
```powershell
& "C:\Java\jdk-21\bin\java.exe" -version
```

---

### Problema 2: Acceso denegado al copiar a Program Files

**Síntoma:**
```
ERROR 5 (0x00000005) Creando directorio de destino C:\Program Files\Java\jdk-21\
Acceso denegado.
```

**Causa:** `C:\Program Files\` requiere permisos de administrador

**❌ INCORRECTO:**
```powershell
Move-Item -Path "C:\Temp\java21-extract\jdk-21.0.2" -Destination "C:\Program Files\Java\jdk-21" -Force
```

**✅ CORRECTO:**
```powershell
robocopy "C:\Temp\java21-extract\jdk-21.0.2" "C:\Java\jdk-21" /E /COPY:DAT
```

---

### Problema 3: Maven Sigue Usando Java Antigua

**Síntoma:**
```
mvn --version
# Muestra: Java version: 17.0.7 (INCORRECTA)
```

**Causas Posibles:**

1. **No cerró terminal después de `setx`**
   - Solución: Cierra y abre nuevo terminal PowerShell

2. **JAVA_HOME mal configurada**
   - Verificar: `echo $env:JAVA_HOME`
   - Debe mostrar: `C:\Java\jdk-21`

3. **Múltiples versiones de Java en PATH**
   - Verificar: `echo $env:Path` y buscar referencias a otras versiones
   - Puede remover JDK 17 si solo necesitas JDK 21

**Solución Inmediata:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn --version
```

---

### Problema 4: Expand-Archive Falla con ZIP Grande

**Síntoma:**
```
Expand-Archive -Path 'C:\Temp\openjdk-21.zip' -DestinationPath 'C:\Java' -Force
# Timeout o archivo corrupto
```

**Causa:** ZIP (~192 MB) es grande para PowerShell

**❌ INCORRECTO:**
```powershell
Expand-Archive -Path 'C:\Temp\openjdk-21.zip' -DestinationPath 'C:\Program Files\Java' -Force
```

**✅ CORRECTO:**
```powershell
# 1. Extraer a temporal primero
Expand-Archive -Path 'C:\Temp\openjdk-21.zip' -DestinationPath 'C:\Temp\java21-extract' -Force

# 2. Luego copiar a ubicación final
robocopy "C:\Temp\java21-extract\jdk-21.0.2" "C:\Java\jdk-21" /E /COPY:DAT
```

---

### Problema 5: PowerShell Math Operations

**Síntoma:**
```powershell
Get-Item 'C:\Temp\openjdk-21.zip' | Select-Object FullName, @{Name='SizeMB';Expression={[math]::Round($_.Length/1MB,2)}}
# Error: Faltan paréntesis
```

**Causa:** Escaping incorrecto de variables en expresión de hash

**❌ INCORRECTO:**
```powershell
@{Name='SizeMB';Expression={[math]::Round(.Length/1MB,2)}}
```

**✅ CORRECTO:**
```powershell
(Get-Item "C:\Temp\openjdk-21.zip").Length / 1MB
```

---

### Problema 6: Descargar con Invoke-WebRequest Falla

**Síntoma:**
```powershell
Invoke-WebRequest -Uri 'https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.zip' -OutFile 'C:\Temp\jdk-21.zip'
# Error de descarga (Oracle requiere aceptación de licencia)
```

**Causa:** Oracle requiere aceptar términos (cambia URL frecuentemente)

**❌ INCORRECTO:**
```powershell
# Oracle JDK directo (requiere licencia)
'https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.zip'
```

**✅ CORRECTO:**
```powershell
# OpenJDK (sin licencia)
'https://download.java.net/java/GA/jdk21.0.2/f2283984656d49d69e91c558476027ac/13/GPL/openjdk-21.0.2_windows-x64_bin.zip'
```

---

## 📚 Comandos Útiles de Maven

### Compilación de Proyecto

**Limpiar y compilar:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn clean compile
```

**Solo compilar (sin limpiar):**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn compile
```

**Compilar con output detallado:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn clean compile -X
```

---

### Ejecución de Tests

**Ejecutar todos los tests:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn test
```

**Ejecutar un test específico:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn test -Dtest=NombreTestClass
```

---

### Empaquetado

**Crear JAR ejecutable:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn clean package
```

**Salida:** `target/workable-0.0.1-SNAPSHOT.jar`

**Crear JAR sin ejecutar tests:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn clean package -DskipTests
```

---

### Ejecución de Aplicación

**Desde Maven (durante desarrollo):**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn spring-boot:run
```

**⚠️ Requiere plugin `spring-boot-maven-plugin` en pom.xml**

**Desde JAR compilado:**
```powershell
java -jar target/workable-0.0.1-SNAPSHOT.jar
```

---

### Gestión de Dependencias

**Descargar todas las dependencias:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn dependency:resolve
```

**Ver árbol de dependencias:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn dependency:tree
```

**Verificar dependencias obsoletas:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn versions:display-dependency-updates
```

---

### Otros Comandos Útiles

**Listar todas las tareas disponibles:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn help:active-profiles
```

**Instalar en repositorio local:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn install
```

**Ejecutar en modo offline (después de primera descarga):**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"; mvn -o clean compile
```

---

## 📁 Estructura del Proyecto Spring Boot

### Estructura Esperada (Workable)

```
workable-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/workable_sb/workable/
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── OfertaController.java
│   │   │       │   ├── PostulacionController.java
│   │   │       │   └── ...
│   │   │       ├── service/
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── HojaVidaService.java
│   │   │       │   ├── OfertaService.java
│   │   │       │   ├── UserService.java
│   │   │       │   └── ...
│   │   │       ├── repository/
│   │   │       │   ├── UsuarioRepository.java
│   │   │       │   ├── OfertaRepository.java
│   │   │       │   ├── PostulacionRepository.java
│   │   │       │   └── ...
│   │   │       ├── models/
│   │   │       │   ├── Usuario.java
│   │   │       │   ├── Oferta.java
│   │   │       │   ├── Empresa.java
│   │   │       │   ├── Aspirante.java
│   │   │       │   ├── Reclutador.java
│   │   │       │   └── ...
│   │   │       ├── security/
│   │   │       │   ├── AuthResponse.java
│   │   │       │   ├── JwtUtil.java
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   └── ...
│   │   │       ├── config/
│   │   │       │   ├── DataInitializer.java
│   │   │       │   └── CorsConfig.java
│   │   │       └── WorkableApplication.java
│   │   └── resources/
│   │       ├── application.properties       ← Configuración
│   │       ├── application-dev.properties   ← Desarrollo
│   │       ├── application-prod.properties  ← Producción
│   │       └── ...
│   └── test/
│       └── java/com/workable_sb/workable/
│           ├── AuthControllerTest.java
│           ├── OfertaServiceTest.java
│           └── ...
├── .mvn/                                     ← Maven Wrapper
├── mvn/
├── pom.xml                                   ← Dependencias y config
├── .gitignore
└── README.md
```

### Archivo Clave: `pom.xml`

**Propiedades importantes:**

```xml
<properties>
    <java.version>21</java.version>        <!-- CRÍTICO: Java 21 -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
</properties>
```

**⚠️ NOTA:** Si `<java.version>` es inferior a 21, cambiarlo para compatibilidad

---

### Archivo Clave: `application.properties`

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/workable?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create

# JWT Configuration
jwt.secret=mi_clave_super_secreta_muy_larga_que_tenga_al_menos_32_bytes
jwt.expiration=36000000

# Logging
logging.level.com.workable_sb.workable=INFO
logging.level.org.springframework.security=WARN
```

---

## 🚀 Próximos Pasos

### 1. Compilar el Proyecto (Primera Vez)

**Comando:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"
cd C:\Users\Aprendiz\Desktop\workable\backend
mvn clean compile
```

**Tiempo estimado:** 3-5 minutos (descarga dependencias)

**Resultado esperado:**
```
[INFO] BUILD SUCCESS
```

---

### 2. Ejecutar Tests

**Comando:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"
mvn test
```

**Resultado esperado:**
```
[INFO] Tests run: 15, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

### 3. Empaquetar Aplicación

**Comando:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"
mvn clean package
```

**Resultado:**
```
[INFO] Building jar: C:\...\target\workable-0.0.1-SNAPSHOT.jar
[INFO] BUILD SUCCESS
```

---

### 4. Ejecutar Aplicación

**Opción A: Con Maven:**
```powershell
$env:JAVA_HOME="C:\Java\jdk-21"
mvn spring-boot:run
```

**Opción B: JAR directo:**
```powershell
java -jar target/workable-0.0.1-SNAPSHOT.jar
```

**Resultado esperado:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| ._ |_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v3.5.4)

2026-03-10 15:45:23.123  INFO 1234 --- [  main] 
c.w.w.WorkableApplication            : Started WorkableApplication in 3.456 seconds
```

**Acceso:**
```
Backend disponible en: http://localhost:8080/api
```

---

### 5. Desarrollar en VS Code

**Extensiones necesarias:**
```powershell
code --install-extension vscjava.vscode-java-pack
code --install-extension redhat.java
code --install-extension vscjava.vscode-gradle
```

**Abrir proyecto:**
```powershell
code C:\Users\Aprendiz\Desktop\workable\backend
```

---

## 📖 Recursos Adicionales

### Documentación Oficial

- **Java 21 Docs:** https://docs.oracle.com/en/java/javase/21/
- **Spring Boot 3.5.4:** https://spring.io/projects/spring-boot
- **Apache Maven:** https://maven.apache.org/
- **JWT en Spring:** https://www.baeldung.com/spring-security-authentication-with-a-database

### Comandos Rápidos por Caso de Uso

| Caso | Comando |
|------|---------|
| Compilar | `mvn clean compile` |
| Tests | `mvn test` |
| Empaquetar | `mvn clean package` |
| Ejecutar | `mvn spring-boot:run` |
| Limpiar | `mvn clean` |
| Full build | `mvn clean install` |

---

## 🎯 Conclusión

**Setup completado exitosamente:**

✅ **JDK 21** → `C:\Java\jdk-21`  
✅ **JAVA_HOME** → Configurado permanentemente  
✅ **Maven 3.9.6** → Detecta Java 21  
✅ **Modo alto rendimiento** → Activado  

**Próximo paso:** Resolver errores de compilación en el código del backend (métodos faltantes en services)

---

**Documentación creada:** 10 de marzo de 2026  
**Autor:** Equipo Workable  
**Versión:** 1.0.0  
**Estado:** Setup completado ✅
