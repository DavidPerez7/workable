import axios from "axios";

const API_URL = "http://localhost:8080/api/estudio";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Obtener todos los estudios del aspirante logueado
export const obtenerEstudiosAspirante = async () => {
  try {
    const response = await axios.get(`${API_URL}/aspirante`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener estudios:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener estudios");
  }
};

// Obtener estudio por ID
export const obtenerEstudioPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener estudio:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener estudio");
  }
};

// Crear estudio
export const crearEstudio = async (estudioData) => {
  try {
    const response = await axios.post(API_URL, estudioData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear estudio:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al crear estudio");
  }
};

// Actualizar estudio
export const actualizarEstudio = async (id, estudioData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, estudioData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar estudio:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al actualizar estudio");
  }
};

// Eliminar estudio
export const eliminarEstudio = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar estudio:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al eliminar estudio");
  }
};
