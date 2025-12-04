# 📚 Guía de Consumo de API: Register Reclutador

---

## 🎯 Resumen General

Hemos integrado **axios** en el proyecto para comunicarnos con el backend. El flujo es:

```
ReclutadorForm.jsx → registrarReclutador() → axiosInstance → Backend (http://localhost:8080/api/auth/register-reclutador)
```

---

## 📁 Archivos Modificados

### 1. **`src/api/authApi.js`** (Capa de Servicios)

Este archivo es tu **puente de comunicación** con el backend.

**Lo que hicimos:**
```javascript
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**¿Qué es esto?**
- `axiosInstance`: Instancia personalizada de axios con configuración base
- `interceptor`: Automáticamente agrega el token JWT a todas las peticiones (útil para peticiones autenticadas)
- `baseURL`: URL base del backend

**La función principal:**
```javascript
export const registrarReclutador = async (reclutadorData) => {
  try {
    const response = await axiosInstance.post("/register-reclutador", reclutadorData);
    
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al registrar reclutador");
  }
};
```

**¿Qué hace?**
- Realiza un `POST` a `http://localhost:8080/api/auth/register-reclutador`
- Envía los datos del formulario (`reclutadorData`)
- Si viene un token en la respuesta, lo guarda en `localStorage`
- Si hay error, lanza una excepción con el mensaje del servidor

---

### 2. **`src/components/SignUpPage/reclutador/reclutadorForm.jsx`** (Componente Frontend)

Este es el **formulario que llena el usuario**.

**Cambios principales:**

#### Importar la función
```javascript
import { registrarReclutador } from "../../../api/authApi";
```

#### Usar la función en el `handleSubmit`
```javascript
try {
  // 🔗 PETICIÓN REAL A LA API USANDO AXIOS
  const response = await registrarReclutador(reclutadorData);

  console.log("Reclutador registrado con éxito:", response);
  alert("¡Reclutador registrado con éxito! Redirigiendo a login...");

  formRef.current.reset();
  
  setTimeout(() => navigate("/login"), 1000);

} catch (error) {
  console.error("Error al registrar reclutador:", error.message);
  
  let mensajeError = "Error al completar el registro";
  if (error.response) {
    mensajeError = error.response.data?.message || error.message;
  }

  alert(mensajeError);
}
```

---

## 🔄 Flujo Paso a Paso

### Cuando el usuario hace clic en "Registrar Reclutador":

1. **Validación en Frontend:**
   - Verificar que todos los campos obligatorios estén completos ✅
   - Validar que la contraseña tenga mínimo 8 caracteres ✅
   - Verificar que las contraseñas coincidan ✅

2. **Preparar datos:**
   ```javascript
   const reclutadorData = {
     nombre: "Juan",
     apellido: "Pérez",
     correo: "juan@example.com",
     telefono: "3001234567",
     password: "Password123!",
     fechaNacimiento: "1990-05-15",
     rol: "RECLUTADOR",
     municipio: { id: 1 }
   };
   ```

3. **Enviar a la API:**
   ```
   POST http://localhost:8080/api/auth/register-reclutador
   Headers: {
     "Content-Type": "application/json",
     "Authorization": "Bearer {token_si_existe}"
   }
   Body: {reclutadorData}
   ```

4. **Backend procesa:**
   - Valida los datos
   - Verifica que el email no exista
   - Encripta la contraseña
   - Guarda el reclutador en la BD
   - Retorna la respuesta (201 Created)

5. **Frontend recibe respuesta:**
   - Si es exitosa → Mostrar mensaje de éxito
   - Guarda el token si viene en la respuesta
   - Redirige a `/login` después de 1 segundo
   
   O si hay error → Mostrar mensaje de error

---

## 📊 Estructura de Respuestas

### ✅ Respuesta Exitosa (201 Created)
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "mensaje": "Reclutador registrado exitosamente"
}
```

### ❌ Respuesta de Error (400/409)
```json
{
  "error": "Bad Request",
  "message": "El correo ya está registrado",
  "status": 409
}
```

---

## 🛠️ Cómo Agregar Más Consumos de API

Siguiendo el mismo patrón, aquí está el template para agregar más endpoints:

### En `authApi.js`:
```javascript
/**
 * 📝 DESCRIPCIÓN DEL ENDPOINT
 * METHOD /ruta
 * 
 * Parámetros:
 * - param1: descripción
 * - param2: descripción
 */
export const miNuevoEndpoint = async (parametros) => {
  try {
    const response = await axiosInstance.post("/mi-ruta", parametros);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error describiendo el error");
  }
};
```

### En tu componente:
```javascript
import { miNuevoEndpoint } from "../../../api/authApi";

// En tu handler o useEffect
try {
  const response = await miNuevoEndpoint(datos);
  console.log("Éxito:", response);
} catch (error) {
  console.error("Error:", error.message);
}
```

---

## 🔐 Manejo de Tokens JWT

El token se guarda automáticamente en `localStorage`:
```javascript
localStorage.setItem("token", response.data.token);
```

Y se envía automáticamente en todas las peticiones gracias al interceptor:
```javascript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Para logout:
```javascript
export const logout = () => {
  localStorage.removeItem("token");
};
```

---

## 🧪 Cómo Probar

### Opción 1: Usando Postman
1. Abre Postman
2. Crea un POST a `http://localhost:8080/api/auth/register-reclutador`
3. En Body (JSON):
```json
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
4. Haz clic en Send

### Opción 2: Usando el formulario en el navegador
1. Abre `http://localhost:3000` (React)
2. Ve a la página de registro de reclutador
3. Completa el formulario
4. Haz clic en "Registrar Reclutador"
5. Abre la consola (F12) para ver logs

---

## 📋 Checklist de Verificación

- ✅ ¿Axios está instalado? (`npm install axios`)
- ✅ ¿El backend está corriendo? (`http://localhost:8080`)
- ✅ ¿El endpoint `/auth/register-reclutador` existe en el backend?
- ✅ ¿Los campos del formulario coinciden con los que espera el backend?
- ✅ ¿El municipioId que envías existe en la BD?
- ✅ ¿La contraseña cumple con los requisitos?

---

## 🚀 Próximos Pasos

Una vez que esto esté funcionando:

1. **Crear más servicios API:**
   - `registerAspirante()` en authApi.js
   - `loginUsuario()` mejorado
   - Endpoints de CRUD para Empresa, Oferta, Postulación, etc.

2. **Crear carpetas organizadas:**
   ```
   src/api/
   ├── authApi.js
   ├── empresaApi.js
   ├── ofertaApi.js
   ├── postulacionApi.js
   └── ...
   ```

3. **Usar hooks personalizados:**
   ```javascript
   // src/hooks/useRegistroReclutador.js
   export const useRegistroReclutador = () => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     
     const registrar = async (datos) => {
       setLoading(true);
       try {
         const response = await registrarReclutador(datos);
         return response;
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };
     
     return { registrar, loading, error };
   };
   ```

4. **Context API o Redux para estado global:**
   - Guardar datos del usuario autenticado
   - Manejar la expiración del token
   - Refrescar el token automáticamente

---

## 📞 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `SyntaxError: Unexpected token` | JSON inválido | Verifica la estructura del JSON |
| `404 Not Found` | Endpoint no existe | Verifica la URL en el backend |
| `401 Unauthorized` | Token inválido o expirado | Vuelve a hacer login |
| `409 Conflict` | Email ya registrado | Usa otro email |
| `CORS error` | El backend no permite la petición | Configura CORS en el backend |
| `Network error` | Backend no está corriendo | Inicia el servidor de backend |

---

¡Listo! Ahora tu frontend está conectado con el backend. 🎉

