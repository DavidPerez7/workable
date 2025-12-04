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

export const login = async (credenciales) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales),
  });

  if (!res.ok) throw new Error("Error al iniciar sesión");

  const data = await res.json();

  localStorage.setItem("token", data.token);
  return data;
};

export const registro = async (usuario) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) throw new Error("Error al registrar usuario");
  return res.json();
};

/**
 * 🔗 REGISTRAR RECLUTADOR
 * POST /auth/register-reclutador
 * 
 * Parámetros:
 * - nombre (string): Nombre del reclutador
 * - apellido (string): Apellido del reclutador
 * - correo (string): Correo electrónico único
 * - telefono (string): Teléfono de contacto
 * - password (string): Contraseña (mínimo 8 caracteres)
 * - fechaNacimiento (string): Fecha en formato YYYY-MM-DD
 * - rol (string): Siempre "RECLUTADOR"
 * - municipio (object): { id: numero }
 */
export const registrarReclutador = async (reclutadorData) => {
  try {
    const response = await axiosInstance.post("/register-reclutador", reclutadorData);
    
    // Guardar el token si viene en la respuesta
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al registrar reclutador");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
