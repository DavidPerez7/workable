import axios from "axios";

const API_URL = "http://localhost:8080/api/experiencia";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Obtener todas las experiencias del aspirante logueado
export const obtenerExperienciasAspirante = async () => {
  try {
    const response = await axios.get(`${API_URL}/aspirante`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener experiencias:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener experiencias");
  }
};

// Obtener experiencia por ID
export const obtenerExperienciaPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener experiencia:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener experiencia");
  }
};

// Crear experiencia
export const crearExperiencia = async (experienciaData) => {
  try {
    const response = await axios.post(API_URL, experienciaData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear experiencia:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al crear experiencia");
  }
};

// Actualizar experiencia
export const actualizarExperiencia = async (id, experienciaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, experienciaData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar experiencia:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al actualizar experiencia");
  }
};

// Eliminar experiencia
export const eliminarExperiencia = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar experiencia:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al eliminar experiencia");
  }
};

// Obtener experiencias por aspirante (para ADMIN y vista de otros usuarios)
export const obtenerExperienciasPorUsuario = async (aspiranteId) => {
  try {
    const response = await axios.get(`${API_URL}/usuario/${aspiranteId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener experiencias por usuario:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener experiencias por usuario");
  }
};
