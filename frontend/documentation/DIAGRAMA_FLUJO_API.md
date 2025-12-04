# 🎯 Flujo de Consumo de API - Register Reclutador

## Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ReclutadorForm.jsx (Componente)                        │   │
│  │  ├─ Renderiza el formulario                            │   │
│  │  ├─ Recibe datos del usuario                           │   │
│  │  ├─ Valida campos (frontend)                           │   │
│  │  └─ Llama: registrarReclutador(reclutadorData)        │   │
│  └─────────────┬───────────────────────────────────────────┘   │
│                │                                                 │
│                ▼                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  authApi.js (Capa de Servicios)                         │   │
│  │  ├─ import axios                                        │   │
│  │  ├─ const axiosInstance = axios.create({...})          │   │
│  │  ├─ Interceptors (agregar token automáticamente)       │   │
│  │  ├─ export const registrarReclutador()                │   │
│  │  │  └─ POST /register-reclutador                      │   │
│  │  └─ Manejo de errores                                  │   │
│  └─────────────┬───────────────────────────────────────────┘   │
│                │                                                 │
│                ▼                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Axios Instance                                         │   │
│  │  ├─ Base URL: http://localhost:8080/api/auth          │   │
│  │  ├─ Headers: Content-Type, Authorization               │   │
│  │  └─ Interceptors: Token automático                      │   │
│  └─────────────┬───────────────────────────────────────────┘   │
│                │                                                 │
│                │ HTTP POST                                       │
│                │ {reclutadorData}                                │
│                │                                                 │
└────────────────┼─────────────────────────────────────────────────┘
                 │
                 │ 🌐 RED
                 │
┌────────────────┼─────────────────────────────────────────────────┐
│                ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  BACKEND (Spring Boot)                                  │    │
│  │  http://localhost:8080/api/auth/register-reclutador   │    │
│  └─────────────┬───────────────────────────────────────────┘    │
│                │                                                  │
│                ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  AuthController (Controller)                            │    │
│  │  ├─ Recibe JSON con datos del reclutador              │    │
│  │  ├─ Valida campos (backend)                           │    │
│  │  └─ Llamar a authService.registrarReclutador()       │    │
│  └─────────────┬───────────────────────────────────────────┘    │
│                │                                                  │
│                ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  AuthService (Servicio)                                 │    │
│  │  ├─ Validar email único                                │    │
│  │  ├─ Encriptar contraseña (BCrypt)                      │    │
│  │  ├─ Crear objeto Usuario (RECLUTADOR)                │    │
│  │  ├─ Guardar en BD                                      │    │
│  │  └─ Generar JWT token                                  │    │
│  └─────────────┬───────────────────────────────────────────┘    │
│                │                                                  │
│                ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Database (MySQL)                                       │    │
│  │  ├─ Tabla USUARIO                                       │    │
│  │  │  ├─ id (PK)                                          │    │
│  │  │  ├─ nombre                                           │    │
│  │  │  ├─ apellido                                         │    │
│  │  │  ├─ correo (UNIQUE)                                 │    │
│  │  │  ├─ telefono                                         │    │
│  │  │  ├─ password (encrypted)                             │    │
│  │  │  ├─ rol (RECLUTADOR)                               │    │
│  │  │  ├─ fechaNacimiento                                  │    │
│  │  │  └─ municipioId (FK)                                │    │
│  │  └─ Tabla MUNICIPIO (foránea)                          │    │
│  └─────────────┬───────────────────────────────────────────┘    │
│                │                                                  │
│                ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Response (201 Created + JWT)                           │    │
│  │  {                                                      │    │
│  │    "id": 1,                                             │    │
│  │    "nombre": "Juan",                                    │    │
│  │    "correo": "juan@example.com",                        │    │
│  │    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." │    │
│  │  }                                                      │    │
│  └─────────────┬───────────────────────────────────────────┘    │
│                │                                                  │
│                │ HTTP Response (201)                              │
│                │ JSON Response                                    │
│                │                                                  │
└────────────────┼──────────────────────────────────────────────────┘
                 │
                 │ 🌐 RED
                 │
┌────────────────┼─────────────────────────────────────────────────┐
│                ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Frontend recibe respuesta                              │   │
│  │  ├─ Status 201 (Éxito) ✅                              │   │
│  │  ├─ Guardar token en localStorage                       │   │
│  │  ├─ Mostrar mensaje de éxito                            │   │
│  │  ├─ Limpiar formulario                                  │   │
│  │  └─ Redirigir a /login después de 1 segundo           │   │
│  │                                                         │   │
│  │  O                                                      │   │
│  │                                                         │   │
│  │  O Status 400/409 (Error) ❌                           │   │
│  │  ├─ Mostrar mensaje de error                            │   │
│  │  └─ NO redirigir (permitir reintentar)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Flujo Paso a Paso

### 1️⃣ **Usuario completa el formulario**
```
Input del Usuario:
├─ Nombre: Juan
├─ Apellido: Pérez
├─ Correo: juan@techcorp.com
├─ Teléfono: 3001234567
├─ Fecha Nacimiento: 1990-05-15
├─ Municipio: Bogotá D.C. (ID: 1)
├─ Contraseña: Password123!
└─ Confirmar Contraseña: Password123!
```

### 2️⃣ **Frontend valida**
```javascript
// En ReclutadorForm.jsx
if (campos vacíos) → Mostrar error
if (password.length < 8) → Mostrar error
if (password !== confirmPassword) → Mostrar error
// Si todo está bien → Continuar
```

### 3️⃣ **Preparar datos**
```javascript
const reclutadorData = {
  nombre: "Juan",
  apellido: "Pérez",
  correo: "juan@techcorp.com",
  telefono: "3001234567",
  password: "Password123!",
  fechaNacimiento: "1990-05-15",
  rol: "RECLUTADOR",
  municipio: { id: 1 }
};
```

### 4️⃣ **Llamar función de API**
```javascript
// En ReclutadorForm.jsx
const response = await registrarReclutador(reclutadorData);
```

### 5️⃣ **Axios hace petición HTTP**
```
POST http://localhost:8080/api/auth/register-reclutador HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Bearer {token_si_existe}

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@techcorp.com",
  "telefono": "3001234567",
  "password": "Password123!",
  "fechaNacimiento": "1990-05-15",
  "rol": "RECLUTADOR",
  "municipio": { "id": 1 }
}
```

### 6️⃣ **Backend procesa**
```
[AuthController.registerReclutador()]
├─ Validar datos
├─ Validar email único (SELECT * FROM usuario WHERE correo = ?)
├─ [AuthService.registrarReclutador()]
│  ├─ Encriptar password (BCrypt)
│  ├─ Crear Usuario
│  ├─ Guardar en BD (INSERT INTO usuario...)
│  ├─ Generar JWT token
│  └─ Retornar usuario + token
└─ Retornar response (201 Created)
```

### 7️⃣ **Backend envía respuesta**
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@techcorp.com",
  "rol": "RECLUTADOR",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoianVhbkB0ZWNoY29ycC5jb20iLCJyb2wiOiJSRUNMVVRBRE9SIn0.hLTScBj9...",
  "mensaje": "Reclutador registrado exitosamente"
}
```

### 8️⃣ **Frontend recibe y procesa**
```javascript
// En authApi.js (registrarReclutador)
if (response.data.token) {
  localStorage.setItem("token", response.data.token); // ✅ Guardar token
}
return response.data; // Retornar datos
```

### 9️⃣ **Frontend actualiza UI**
```javascript
// En ReclutadorForm.jsx (handleSubmit)
alert("¡Reclutador registrado con éxito! Redirigiendo a login...");
formRef.current.reset(); // Limpia el formulario
setTimeout(() => navigate("/login"), 1000); // Redirigir a login
```

### 🔟 **Usuario redirigido a Login**
```
Pantalla actual: /SignUpPage/reclutador
          ↓
Pantalla siguiente: /login
```

---

## Manejo de Errores

### Si hay error (400, 409, 500, etc.)

```
Backend retorna:
HTTP/1.1 409 Conflict
{
  "error": "Conflict",
  "message": "El correo juan@techcorp.com ya está registrado",
  "status": 409
}
```

```javascript
// En authApi.js (catch block)
catch (error) {
  throw new Error(error.response?.data?.message || "Error al registrar reclutador");
}

// En ReclutadorForm.jsx (catch block)
catch (error) {
  console.error("Error:", error.message);
  alert("El correo juan@techcorp.com ya está registrado"); // Mostrar al usuario
  // NO redirigir - permitir que reintentar con otro email
}
```

---

## Interceptor de Axios (Token automático)

Cada vez que hagas una petición, axios automáticamente agrega el token:

```javascript
// ANTES (sin token):
GET /api/oferta/1/candidatos

// DESPUÉS (con token automático):
GET /api/oferta/1/candidatos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Esto funciona así:

```javascript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Obtener token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agregar a headers
  }
  return config;
});
```

---

## Guardando en localStorage

### ¿Qué es localStorage?

Es un almacenamiento en el navegador que persiste incluso si cierras la ventana:

```javascript
// Guardar
localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");

// Obtener
const token = localStorage.getItem("token");
// Resultado: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Eliminar
localStorage.removeItem("token");

// Borrar todo
localStorage.clear();
```

### Verificar en el navegador:

1. Abre tu navegador
2. Presiona `F12` (Developer Tools)
3. Ve a la pestaña `Application`
4. En el menú izquierdo, selecciona `Local Storage`
5. Selecciona `http://localhost:3000`
6. Verás una tabla con `token` como key y el JWT como value

---

## URLs Importantes

| Componente | URL |
|-----------|-----|
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:8080` |
| API Auth | `http://localhost:8080/api/auth` |
| Register Reclutador | `http://localhost:8080/api/auth/register-reclutador` |
| Login | `http://localhost:8080/api/auth/login` |

---

## Comandos Útiles

```bash
# Instalar axios (ya hecho)
npm install axios

# Iniciar el servidor frontend
npm run dev

# Ver logs en la consola
Press F12 → Console

# Verificar que el backend esté corriendo
# Abre http://localhost:8080 en tu navegador
```

---

¡Listo! Ahora entiendes completamente cómo funciona el flujo de registro. 🚀

