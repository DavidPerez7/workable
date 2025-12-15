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
    const serverInfo = error.response?.data || error.message;
    console.error("Error al obtener postulaciones:", serverInfo);
    const serverMsg = error.response?.data?.error || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    const err = new Error(serverMsg);
    err.serverData = error.response?.data;
    throw err;
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
    const serverInfo = error.response?.data || error.message;
    console.error("Error al obtener postulación:", serverInfo);
    const serverMsg = error.response?.data?.error || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    const err = new Error(serverMsg);
    err.serverData = error.response?.data;
    throw err;
  }
};

// Crear postulación
export const crearPostulacion = async (postulacion) => {
  try {
    const response = await axios.post(API_URL, postulacion, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    const serverInfo = error.response?.data || error.message;
    console.error("Error al crear postulación:", serverInfo);
    const serverMsg = error.response?.data?.error || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    const err = new Error(serverMsg);
    err.serverData = error.response?.data;
    throw err;
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
    const serverInfo = error.response?.data || error.message;
    console.error("Error al eliminar postulación:", serverInfo);
    const serverMsg = error.response?.data?.error || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    const err = new Error(serverMsg);
    err.serverData = error.response?.data;
    throw err;
  }
};

// Obtener postulaciones de una oferta (para reclutadores)
export const obtenerPostulacionesPorOferta = async (ofertaId, usuarioIdActual) => {
  try {
    const params = usuarioIdActual ? `?usuarioIdActual=${usuarioIdActual}` : '';
    const response = await axios.get(`${API_URL}/oferta/${ofertaId}${params}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    const serverInfo = error.response?.data || error.message;
    console.error("Error al obtener postulaciones:", serverInfo);
    const serverMsg = error.response?.data?.error || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    const err = new Error(serverMsg);
    err.serverData = error.response?.data;
    err.statusCode = error.response?.status || 500;
    throw err;
  }
};

// Cambiar estado de postulación (para reclutadores)
export const cambiarEstadoPostulacion = async (postulacionId, estado) => {
  try {
    const response = await axios.put(`${API_URL}/${postulacionId}`, { id: postulacionId, estado: estado }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    const serverInfo = error.response?.data || error.message;
    console.error("Error al cambiar estado:", serverInfo);
    const serverMsg = error.response?.data?.error || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    const err = new Error(serverMsg);
    err.serverData = error.response?.data;
    throw err;
  }
};

// Actualizar postulación completa
export const actualizarPostulacion = async (postulacion) => {
  try {
    const response = await axios.put(`${API_URL}/${postulacion.id}`, postulacion, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    const serverInfo = error.response?.data || error.message;
    console.error("Error al actualizar postulación:", serverInfo);
    const serverMsg = error.response?.data?.error || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    const err = new Error(serverMsg);
    err.serverData = error.response?.data;
    throw err;
  }
};

export default {
  obtenerPostulacionesAspirante,
  obtenerPostulacionPorId,
  obtenerPostulacionesPorOferta,
  crearPostulacion,
  cambiarEstadoPostulacion,
  actualizarPostulacion,
  eliminarPostulacion
};
