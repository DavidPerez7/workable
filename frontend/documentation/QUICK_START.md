# 🚀 Quick Start: Usar Axios en 5 Minutos

---

## Paso 1: Instalar Axios (1 min)

```bash
cd frontend
npm install axios
```

✅ **Hecho**

---

## Paso 2: Crear Archivo API (2 min)

### Crear: `src/api/authApi.js`

```javascript
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Agregar token automáticamente
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Registrar Reclutador
export const registrarReclutador = async (datos) => {
  try {
    const response = await axiosInstance.post("/register-reclutador", datos);
    if (response.data.token) localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al registrar");
  }
};

export default axiosInstance;
```

✅ **Hecho**

---

## Paso 3: Usar en tu Componente (1.5 min)

### En: `src/components/SignUpPage/reclutador/reclutadorForm.jsx`

**Agregar import:**
```javascript
import { registrarReclutador } from "../../../api/authApi";
```

**En tu función handleSubmit:**
```javascript
try {
  const response = await registrarReclutador(reclutadorData);
  alert("¡Éxito!");
  navigate("/login");
} catch (error) {
  alert(error.message);
}
```

✅ **Hecho**

---

## Paso 4: Probar (0.5 min)

### Opción A: En el navegador
1. Abre `http://localhost:3000`
2. Ve a formulario de registro
3. Completa datos
4. Haz clic en "Registrar"
5. Deberías ver el éxito

### Opción B: Con DevTools (F12)
1. Abre Developer Tools (F12)
2. Ve a **Network**
3. Completa el formulario
4. Observa la petición POST
5. Verifica response 201

### Opción C: Con Postman
1. Abre Postman
2. POST a `http://localhost:8080/api/auth/register-reclutador`
3. Body (JSON):
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
4. Envía

✅ **Listo**

---

## Template para Otros Endpoints

### 1. Crear función en `api/miServicio.js`:
```javascript
export const miEndpoint = async (datos) => {
  try {
    const response = await axiosInstance.post("/mi-ruta", datos);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error");
  }
};
```

### 2. Usar en componente:
```javascript
import { miEndpoint } from "../../../api/miServicio";

try {
  const response = await miEndpoint(datos);
  // Hacer algo
} catch (error) {
  alert(error.message);
}
```

---

## Métodos Comunes de HTTP

| Método | Para | Ejemplo |
|--------|------|---------|
| **POST** | Crear | `axiosInstance.post("/ruta", datos)` |
| **GET** | Obtener | `axiosInstance.get("/ruta")` |
| **PUT** | Actualizar | `axiosInstance.put("/ruta/1", datos)` |
| **DELETE** | Eliminar | `axiosInstance.delete("/ruta/1")` |
| **PATCH** | Actualizar parcial | `axiosInstance.patch("/ruta/1", datos)` |

---

## Errores Comunes y Soluciones

| Error | Solución |
|-------|----------|
| `Module not found: axios` | `npm install axios` |
| `POST 404` | URL incorrecta en backend |
| `POST 401` | Token no enviado o inválido |
| `POST 409` | Email ya existe, usa otro |
| `CORS error` | Backend necesita CORS configurado |

---

## Variables de Entorno (Opcional)

Crea: `frontend/.env`

```
VITE_API_URL=http://localhost:8080/api
```

Usa en código:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 5 Cosas Que NO Hacer

❌ No guardes el token en una variable (se pierde al recargar)
❌ No hagas axios en archivos HTML
❌ No mezcles fetch y axios
❌ No olvides el header `Authorization`
❌ No uses URLs hardcodeadas en componentes

---

## 5 Cosas Que SÍ Hacer

✅ Guarda token en localStorage o sessionStorage
✅ Centraliza las llamadas a API en archivos api/
✅ Usa try-catch para manejar errores
✅ Crea funciones reutilizables
✅ Documenta los parámetros de tus funciones

---

## Estructura Mínima Recomendada

```
src/
├── api/
│   └── authApi.js          ← Todas las funciones de auth
├── components/
│   ├── LoginPage.jsx       ← Usa loginUsuario()
│   └── ReclutadorForm.jsx  ← Usa registrarReclutador()
└── App.jsx
```

---

## Checklist Rápido

- [ ] ¿Instalaste axios? → `npm install axios`
- [ ] ¿Creaste `src/api/authApi.js`?
- [ ] ¿Importaste `registrarReclutador` en el componente?
- [ ] ¿El backend está corriendo? → `http://localhost:8080`
- [ ] ¿Probaste en el navegador?
- [ ] ¿Ves la petición en Network (F12)?
- [ ] ¿El token se guarda en localStorage?

---

## Para Saber Más

Lee estos archivos:

1. **CONSUMO_API_EXPLICACION.md** - Guía completa
2. **EJEMPLOS_CONSUMO_AXIOS.md** - 10 ejemplos reales
3. **DIAGRAMA_FLUJO_API.md** - Visual de cómo funciona

---

¡Eso es todo! Ahora sí estás listo para consumir APIs. 🎉

