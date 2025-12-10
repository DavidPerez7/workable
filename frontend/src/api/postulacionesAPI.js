import axios from "axios";

const API_URL = "http://localhost:8080/api/postulacion";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Obtener postulaciones del aspirante logueado
export const obtenerPostulacionesAspirante = async () => {
  try {
    const response = await axios.get(`${API_URL}/aspirante`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener postulaciones:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener postulaciones");
  }
};

// Obtener todas las postulaciones (admin)
export const obtenerTodasPostulaciones = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener postulaciones:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener postulaciones");
  }
};

// Obtener postulación por ID
export const obtenerPostulacionPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener postulación:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener postulación");
  }
};

// Crear postulación
export const crearPostulacion = async (ofertaId) => {
  try {
    const response = await axios.post(API_URL, { ofertaId }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear postulación:", error.response?.data || error.message);
    const errorMsg = error.response?.data?.error || error.response?.data?.message || "Error al crear postulación";
    throw new Error(errorMsg);
  }
};

// Actualizar postulación
export const actualizarPostulacion = async (id, postulacionData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, postulacionData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar postulación:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al actualizar postulación");
  }
};

// Eliminar postulación
export const eliminarPostulacion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}/eliminar`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar postulación:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error al eliminar postulación");
  }
};
