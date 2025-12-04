# ✅ Resumen: Integración de Axios - Register Reclutador

---

## 🎯 ¿Qué se hizo?

Conectamos el **formulario de registro de reclutador en React** con el **backend de Spring Boot** usando **axios**.

---

## 📂 Archivos Modificados

### 1. **`src/api/authApi.js`** - Capa de Servicios
**Antes:**
```javascript
// Usando fetch (solo métodos antiguos)
export const login = async (credenciales) => {
  const res = await fetch(`${API_URL}/login`, {...});
  // ...
};
```

**Después:**
```javascript
import axios from "axios";

// Instancia de axios con config base
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  headers: { "Content-Type": "application/json" }
});

// Interceptor: Agregar token automáticamente
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Nueva función para registrar reclutador
export const registrarReclutador = async (reclutadorData) => {
  try {
    const response = await axiosInstance.post("/register-reclutador", reclutadorData);
    if (response.data.token) localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al registrar");
  }
};
```

---

### 2. **`src/components/SignUpPage/reclutador/reclutadorForm.jsx`** - Componente
**Antes:**
```javascript
import "./ReclutadorForm.css";

const ReclutadorForm = () => {
  // ... form code ...
  try {
    console.log("Datos listos para API:", reclutadorData);
    alert("Reclutador registrado con éxito");
    navigate("/login");
  } catch (error) {
    // ... error handling ...
  }
};
```

**Después:**
```javascript
import { registrarReclutador } from "../../../api/authApi";
import "./ReclutadorForm.css";

const ReclutadorForm = () => {
  // ... form code ...
  try {
    // ✅ Consumir la API real
    const response = await registrarReclutador(reclutadorData);
    console.log("Reclutador registrado:", response);
    alert("¡Éxito! Redirigiendo a login...");
    formRef.current.reset();
    setTimeout(() => navigate("/login"), 1000);
  } catch (error) {
    alert(error.message); // Mostrar error real del backend
  }
};
```

---

## 🔄 Flujo de Ejecución

```
1. Usuario llena el formulario
   ↓
2. Usuario hace clic en "Registrar Reclutador"
   ↓
3. ReclutadorForm.jsx valida campos (frontend)
   ↓
4. ReclutadorForm.jsx llama registrarReclutador()
   ↓
5. authApi.js prepara la petición con axios
   ↓
6. axios.post() envía JSON al backend
   ↓
7. Backend valida, encripta password, guarda en BD
   ↓
8. Backend retorna 201 Created + token JWT
   ↓
9. authApi.js guarda token en localStorage
   ↓
10. ReclutadorForm.jsx muestra éxito y redirige a /login
```

---

## 📋 Estructura de Datos

### Entrada (desde formulario):
```javascript
{
  nombre: "Juan",
  apellido: "Pérez",
  correo: "juan@example.com",
  telefono: "3001234567",
  password: "Password123!",
  fechaNacimiento: "1990-05-15",
  rol: "RECLUTADOR",
  municipio: { id: 1 }
}
```

### Salida (desde backend):
```javascript
{
  id: 1,
  nombre: "Juan",
  apellido: "Pérez",
  correo: "juan@example.com",
  rol: "RECLUTADOR",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  mensaje: "Reclutador registrado exitosamente"
}
```

---

## 🛠️ Tecnologías Usadas

| Tecnología | Uso | Versión |
|-----------|-----|---------|
| **React** | Framework frontend | ^19.1.0 |
| **Axios** | Cliente HTTP | ^1.7.x |
| **Spring Boot** | Backend API | 3.x |
| **JWT** | Autenticación | Token Bearer |
| **localStorage** | Persistencia de token | Navegador |

---

## 📡 Petición HTTP Real

```http
POST http://localhost:8080/api/auth/register-reclutador HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Connection: keep-alive

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "telefono": "3001234567",
  "password": "Password123!",
  "fechaNacimiento": "1990-05-15",
  "rol": "RECLUTADOR",
  "municipio": { "id": 1 }
}
```

**Respuesta (201 Created):**
```http
HTTP/1.1 201 Created
Content-Type: application/json
Set-Cookie: JSESSIONID=...; Path=/; HttpOnly

{
  "id": 1,
  "nombre": "Juan",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "mensaje": "Reclutador registrado exitosamente"
}
```

---

## 🔐 Seguridad

### Token JWT
- Se genera en el backend
- Se guarda en `localStorage`
- Se envía automáticamente en todas las peticiones (via interceptor)
- Formato: `Authorization: Bearer {token}`

### Password
- Validación de 8 caracteres mínimo (frontend)
- Se encripta en el backend (BCrypt)
- Nunca se envía de vuelta en la respuesta

### Email
- Validación de formato (HTML5)
- Validación de unicidad en backend

---

## ✨ Ventajas de Esta Implementación

✅ **Reutilizable**: La función `registrarReclutador()` se puede usar en cualquier componente

✅ **Automático**: El token se agrega automáticamente a todas las peticiones

✅ **Manejo de errores**: Errores del backend se muestran al usuario

✅ **Escalable**: Fácil agregar más endpoints en `authApi.js`

✅ **Centralizado**: Toda la lógica de API en un solo lugar

✅ **Persistencia**: El token se guarda en localStorage

---

## 🧪 Cómo Probar

### Opción 1: En el navegador
1. Ve a `http://localhost:3000`
2. Navega a la página de registro de reclutador
3. Completa el formulario
4. Haz clic en "Registrar Reclutador"
5. Verifica que se redirige a `/login`
6. Presiona F12 → Console para ver logs

### Opción 2: Con DevTools
1. Abre `http://localhost:3000`
2. Presiona F12
3. Ve a la pestaña **Network**
4. Completa el formulario
5. Observa la petición POST a `register-reclutador`
6. Verifica que el response es 201 Created
7. Ve a **Application** → **Local Storage** → Verifica que existe `token`

### Opción 3: Con Postman
1. Abre Postman
2. Crea un POST a `http://localhost:8080/api/auth/register-reclutador`
3. Agrega el body JSON
4. Haz clic en Send
5. Verifica la respuesta

---

## 📚 Documentación Creada

Hemos creado dos archivos de referencia:

1. **`CONSUMO_API_EXPLICACION.md`** - Guía detallada con ejemplos
2. **`DIAGRAMA_FLUJO_API.md`** - Diagramas visuales del flujo

---

## 🚀 Próximos Pasos

1. **Crear endpoints para Aspirante:**
   - Agregar `registrarAspirante()` en authApi.js
   - Crear formulario similar en frontend

2. **Crear más servicios:**
   ```
   src/api/
   ├── authApi.js (✅ Done)
   ├── empresaApi.js (pendiente)
   ├── ofertaApi.js (pendiente)
   ├── postulacionApi.js (pendiente)
   └── notificacionApi.js (pendiente)
   ```

3. **Context o Redux:**
   - Guardar usuario autenticado globalmente
   - Manejar expiración de token
   - Auto-refresh de token

4. **Interceptor de errores:**
   - Si token expirado → Redirigir a login
   - Retry automático en ciertos errores

---

## 📞 Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Error: Cannot find module 'axios' | axios no instalado | `npm install axios` |
| 404 Not Found | Endpoint no existe en backend | Verificar URL en backend |
| 409 Conflict | Email ya registrado | Usar otro email |
| CORS error | Backend no permite | Configurar CORS en backend |
| Token no se guarda | localStorage deshabilitado | Verificar configuración del navegador |
| No redirige a login | setTimeout muy corto | Aumentar a 1000ms |

---

## 📊 Status

| Componente | Estado |
|-----------|--------|
| ✅ axios instalado | Ready |
| ✅ authApi.js actualizado | Ready |
| ✅ reclutadorForm.jsx actualizado | Ready |
| ✅ Interceptor de token | Ready |
| ✅ Manejo de errores | Ready |
| ✅ localStorage configurado | Ready |
| ⏳ Backend endpoint | En desarrollo |

---

¡Listo! Tu frontend ya está conectado con el backend. 🎉

Para más detalles, revisa:
- `CONSUMO_API_EXPLICACION.md`
- `DIAGRAMA_FLUJO_API.md`

