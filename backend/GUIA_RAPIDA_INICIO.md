# 🚀 Guía Rápida de Inicio - Backend WORKABLE

## Requisitos Previos
- Java 21+ instalado
- Maven 3.8+ instalado
- MySQL 8+ con base de datos `workable_db`

---

## Opción 1: Usar Archivos .BAT (Windows) 🪟

### 1. Compilar y construir
```batch
cd c:\Users\javie\OneDrive\Escritorio\workable\backend
build.bat
```

### 2. Ejecutar los tests
```batch
test.bat
```

### 3. Iniciar el servidor
```batch
run.bat
```

El servidor estará disponible en: `http://localhost:8080`

---

## Opción 2: Comandos Maven Manuales

### 1. Limpiar build anterior
```bash
mvn clean
```

### 2. Compilar
```bash
mvn compile
```

### 3. Ejecutar tests
```bash
mvn test
```

### 4. Ejecutar el servidor
```bash
mvn spring-boot:run
```

---

## Configuración de Base de Datos

Asegúrate de que `application.properties` contiene:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/workable_db
spring.datasource.username=root
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
```

---

## Endpoints Principales

### Autenticación
```http
POST /auth/login
POST /auth/register
GET /auth/me
```

### Aspirantes (Requiere Token + Rol ASPIRANTE)
```http
GET /aspirantes/perfil/{id}
PUT /aspirantes/actualizar/{id}
POST /postulaciones/crear
GET /postulaciones/mis-postulaciones
```

### Reclutadores (Requiere Token + Rol RECLUTADOR)
```http
GET /citaciones/del-reclutador/{id}
POST /citaciones/crear
```

### Admin (Requiere Token + Rol ADMIN)
```http
GET /usuarios/listar
PUT /usuarios/actualizar/{id}
```

---

## Ejemplo de Autenticación

### 1. Registrarse
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Perez",
    "password": "123456",
    "rol": "ASPIRANTE"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "usuario@example.com",
    "password": "123456"
  }'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "nombre": "Juan",
  "apellido": "Perez",
  "correo": "usuario@example.com",
  "rol": "ASPIRANTE"
}
```

### 3. Usar el token
```bash
curl -X GET http://localhost:8080/aspirantes/perfil/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Estructura de Archivos Importante

```
backend/
├── src/
│   ├── main/java/com/workable_sb/workable/
│   │   ├── models/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── controller/
│   │   ├── security/
│   │   └── config/
│   └── test/java/com/workable_sb/workable/service/
├── build.bat
├── run.bat
├── test.bat
├── clean.bat
├── pom.xml
└── REVISION_FINAL_COMPLETA.md
```

---

## Solución de Problemas

### ❌ Error: "No se puede conectar a MySQL"
- Verificar que MySQL está corriendo
- Verificar credenciales en `application.properties`
- Verificar que la base de datos `workable_db` existe

### ❌ Error: "Puerto 8080 en uso"
Cambiar puerto en `application.properties`:
```properties
server.port=8081
```

### ❌ Error: "Java 21 no encontrado"
- Instalar Java 21 JDK
- Configurar JAVA_HOME en variables de entorno

### ❌ Error: "Maven no reconocido"
- Instalar Maven 3.8+
- Agregar Maven al PATH

---

## Tests Disponibles

Los tests se encuentran en: `src/test/java/com/workable_sb/workable/service/`

Clases de test:
- ✅ `UsuarioServiceTest`
- ✅ `EstudioServiceTest`
- ✅ `ExperienciaServiceTest`
- ✅ `PostulacionServiceTest`
- ✅ `UsuarioHabilidadServiceTest`
- ✅ `HojaVidaServiceTest`

Ejecutar un test específico:
```bash
mvn test -Dtest=UsuarioServiceTest
```

---

## Características Disponibles

✅ Gestión de Usuarios con roles  
✅ Gestión de Hojas de Vida (CV)  
✅ Gestión de Educación y Experiencia  
✅ Sistema de Postulaciones  
✅ Sistema de Citaciones  
✅ Autenticación JWT  
✅ Validaciones completas  
✅ Tests unitarios  
✅ Seguridad basada en roles (RBAC)

---

## 📚 Documentación Adicional

- Consulta `REVISION_FINAL_COMPLETA.md` para detalles técnicos
- Consulta `pom.xml` para dependencias
- Consulta `src/main/resources/application.properties` para configuración

---

**¡El backend está listo para usar! 🎉**
