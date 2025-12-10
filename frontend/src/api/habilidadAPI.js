import axios from "axios";

const API_URL = "http://localhost:8080/api/habilidad";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Obtener todas las habilidades del aspirante logueado
export const obtenerHabilidadesAspirante = async () => {
  try {
    const response = await axios.get(`${API_URL}/aspirante`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener habilidades:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener habilidades");
  }
};

// Obtener habilidad por ID
export const obtenerHabilidadPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener habilidad:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener habilidad");
  }
};

// Crear habilidad
export const crearHabilidad = async (habilidadData) => {
  try {
    const response = await axios.post(API_URL, habilidadData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear habilidad:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al crear habilidad");
  }
};

// Actualizar habilidad
export const actualizarHabilidad = async (id, habilidadData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, habilidadData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar habilidad:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al actualizar habilidad");
  }
};

// Eliminar habilidad
export const eliminarHabilidad = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar habilidad:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al eliminar habilidad");
  }
};
