# 📖 Guía: Usar Axios en Otros Componentes

---

## 1️⃣ Patrón Básico de Consumo

Una vez que creaste la función en `authApi.js`, usarla es muy simple:

### Paso 1: Importar la función
```javascript
import { registrarReclutador } from "../../../api/authApi";
```

### Paso 2: Usar en tu componente
```javascript
try {
  const response = await registrarReclutador(datos);
  console.log("Éxito:", response);
} catch (error) {
  console.error("Error:", error.message);
}
```

---

## 2️⃣ Ejemplo: Registrar Aspirante

### Crear la función en `aspirantesApi.js`:
```javascript
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 🔗 REGISTRAR ASPIRANTE
 * POST /auth/register-aspirante
 */
export const registrarAspirante = async (aspiranteData) => {
  try {
    const response = await axiosInstance.post("/register-aspirante", aspiranteData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al registrar aspirante");
  }
};

export default axiosInstance;
```

### Usar en el componente `aspiranteForm.jsx`:
```javascript
import React, { useState } from "react";
import { registrarAspirante } from "../../../api/aspirantesApi";

const AspiranteForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const aspiranteData = Object.fromEntries(formData.entries());

    try {
      const response = await registrarAspirante(aspiranteData);
      console.log("Aspirante registrado:", response);
      alert("¡Registro exitoso!");
      // Redirigir o hacer algo más
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario aquí */}
      <button type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Registrar"}
      </button>
    </form>
  );
};

export default AspiranteForm;
```

---

## 3️⃣ Ejemplo: Login de Usuario

### En `authApi.js`:
```javascript
/**
 * 🔗 LOGIN
 * POST /auth/login
 */
export const loginUsuario = async (credenciales) => {
  try {
    const response = await axiosInstance.post("/login", credenciales);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Credenciales inválidas");
  }
};
```

### En tu componente `LoginPage.jsx`:
```javascript
import { loginUsuario } from "../../../api/authApi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUsuario({ correo: email, password });
      localStorage.setItem("usuarioActual", JSON.stringify(response));
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};
```

---

## 4️⃣ Ejemplo: Obtener Datos (GET)

### En `ofertaApi.js`:
```javascript
import axios from "axios";

const API_URL = "http://localhost:8080/api/oferta";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 🔗 OBTENER TODAS LAS OFERTAS
 * GET /oferta
 */
export const obtenerOfertas = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener ofertas");
  }
};

/**
 * 🔗 OBTENER OFERTA POR ID
 * GET /oferta/{id}
 */
export const obtenerOfertaPorId = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Oferta no encontrada");
  }
};
```

### En tu componente:
```javascript
import { useState, useEffect } from "react";
import { obtenerOfertas, obtenerOfertaPorId } from "../../../api/ofertaApi";

const OfertasPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        const datos = await obtenerOfertas();
        setOfertas(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarOfertas();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {ofertas.map((oferta) => (
        <div key={oferta.id}>
          <h3>{oferta.titulo}</h3>
          <p>{oferta.descripcion}</p>
        </div>
      ))}
    </div>
  );
};

export default OfertasPage;
```

---

## 5️⃣ Ejemplo: Crear Datos (POST)

### En `postulacionApi.js`:
```javascript
/**
 * 🔗 CREAR POSTULACIÓN
 * POST /postulacion
 */
export const crearPostulacion = async (postulacionData) => {
  try {
    const response = await axiosInstance.post("/", postulacionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear postulación");
  }
};
```

### En tu componente:
```javascript
const handlePostular = async () => {
  const postulacionData = {
    usuarioId: 10,
    ofertaId: 5,
  };

  try {
    const response = await crearPostulacion(postulacionData);
    alert("¡Postulación creada exitosamente!");
    console.log("Postulación:", response);
  } catch (error) {
    alert(error.message);
  }
};

return (
  <button onClick={handlePostular}>Postularme</button>
);
```

---

## 6️⃣ Ejemplo: Actualizar Datos (PUT)

### En `ofertaApi.js`:
```javascript
/**
 * 🔗 ACTUALIZAR OFERTA
 * PUT /oferta/{id}
 */
export const actualizarOferta = async (id, ofertaData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, ofertaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar oferta");
  }
};
```

### En tu componente:
```javascript
const handleActualizar = async () => {
  const ofertaActualizada = {
    titulo: "Senior Backend Developer",
    descripcion: "5+ años de experiencia",
    salario: 5000000,
  };

  try {
    const response = await actualizarOferta(1, ofertaActualizada);
    alert("¡Oferta actualizada!");
    console.log("Oferta:", response);
  } catch (error) {
    alert(error.message);
  }
};

return (
  <button onClick={handleActualizar}>Actualizar</button>
);
```

---

## 7️⃣ Ejemplo: Eliminar Datos (DELETE)

### En `ofertaApi.js`:
```javascript
/**
 * 🔗 ELIMINAR OFERTA
 * DELETE /oferta/{id}
 */
export const eliminarOferta = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar oferta");
  }
};
```

### En tu componente:
```javascript
const handleEliminar = async (ofertaId) => {
  if (!window.confirm("¿Estás seguro?")) return;

  try {
    await eliminarOferta(ofertaId);
    alert("¡Oferta eliminada!");
    // Recargar lista de ofertas
  } catch (error) {
    alert(error.message);
  }
};

return (
  <button onClick={() => handleEliminar(oferta.id)}>Eliminar</button>
);
```

---

## 8️⃣ Ejemplo: Parámetros Query (GET con filtros)

### En `ofertaApi.js`:
```javascript
/**
 * 🔗 OBTENER OFERTAS CON FILTROS
 * GET /oferta?estado=ACTIVA&municipio=Bogotá
 */
export const obtenerOfertasConFiltros = async (filtros) => {
  try {
    const response = await axiosInstance.get("/", { params: filtros });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al filtrar ofertas");
  }
};
```

### En tu componente:
```javascript
const handleFiltrar = async () => {
  const filtros = {
    estado: "ACTIVA",
    municipio: "Bogotá",
    salarioMinimo: 3000000,
  };

  try {
    const ofertas = await obtenerOfertasConFiltros(filtros);
    setOfertas(ofertas);
  } catch (error) {
    alert(error.message);
  }
};

// Se convierte en: GET /oferta?estado=ACTIVA&municipio=Bogotá&salarioMinimo=3000000
```

---

## 9️⃣ Ejemplo: Peticiones con Headers Personalizados

```javascript
/**
 * 🔗 DESCARGAR ARCHIVO
 * GET /oferta/{id}/descargar-cv
 */
export const descargarCV = async (postulacionId) => {
  try {
    const response = await axiosInstance.get(`/postulacion/${postulacionId}/descargar-cv`, {
      responseType: 'blob', // Importante para archivos
    });
    
    // Crear descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cv.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentElement.removeChild(link);
  } catch (error) {
    throw new Error("Error al descargar CV");
  }
};

// Usar en componente:
<button onClick={() => descargarCV(10)}>Descargar CV</button>
```

---

## 🔟 Hook Personalizado: useApi

Crea un hook reutilizable para simplificar el código:

### Crear `src/hooks/useApi.js`:
```javascript
import { useState, useCallback } from "react";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};
```

### Usar el hook en un componente:
```javascript
import { useApi } from "../../../hooks/useApi";
import { registrarReclutador } from "../../../api/authApi";

const ReclutadorForm = () => {
  const { execute, loading, error } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await execute(registrarReclutador, reclutadorData);
      alert("¡Éxito!");
    } catch (err) {
      // Error ya está en el estado 'error'
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Cargando..." : "Registrar"}
      </button>
    </form>
  );
};
```

---

## 📚 Estructura Recomendada

```
src/
├── api/
│   ├── authApi.js (LOGIN, REGISTER)
│   ├── empresaApi.js (CRUD EMPRESAS)
│   ├── ofertaApi.js (CRUD OFERTAS)
│   ├── postulacionApi.js (CRUD POSTULACIONES)
│   ├── notificacionApi.js (NOTIFICACIONES)
│   └── axiosConfig.js (Configuración compartida)
│
├── hooks/
│   ├── useApi.js (Hook para peticiones)
│   ├── useAuth.js (Hook para autenticación)
│   └── useFetch.js (Hook para GET)
│
├── context/
│   └── AuthContext.js (Estado global de autenticación)
│
├── components/
│   ├── SignUpPage/
│   ├── LoginPage/
│   └── OfertasPage/
│
└── App.jsx
```

---

## ✅ Checklist

- ✅ ¿Instalaste axios? (`npm install axios`)
- ✅ ¿Creaste el archivo `authApi.js` con axiosInstance?
- ✅ ¿Configuraste los interceptores?
- ✅ ✅ ¿Usaste la función en el componente?
- ✅ ¿El backend está corriendo en `http://localhost:8080`?
- ✅ ¿Los endpoints están implementados en el backend?

---

¡Ahora tienes todo lo que necesitas para consumir APIs! 🚀

