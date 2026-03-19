import API from './axiosConfig';

// Obtener postulaciones del aspirante logueado
export const obtenerPostulacionesAspirante = async (aspiranteId) => {
  try {
    const response = await API.get(`/api/postulacion/aspirante/${aspiranteId}`);
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
    const response = await API.get(`/api/postulacion/${id}`);
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
    const response = await API.post('/api/postulacion', postulacion);
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
    const response = await API.delete(`/api/postulacion/${id}`);
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
    const response = await API.get(`/api/postulacion/oferta/${ofertaId}${params}`);
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

// Obtener conteo de postulaciones de una oferta
export const obtenerConteoPostulacionesPorOferta = async (ofertaId) => {
  try {
    const response = await API.get(`/api/postulacion/oferta/${ofertaId}/count`);
    return response.data.count;
  } catch (error) {
    const serverInfo = error.response?.data || error.message;
    console.error("Error al obtener conteo de postulaciones:", serverInfo);
    const serverMsg = error.response?.data?.error || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
    const err = new Error(serverMsg);
    err.serverData = error.response?.data;
    throw err;
  }
};

// Cambiar estado de postulación (para reclutadores)
export const cambiarEstadoPostulacion = async (postulacionId, estado) => {
  try {
    const response = await API.put(`/api/postulacion/${postulacionId}`, { id: postulacionId, estado });
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
    const response = await API.put(`/api/postulacion/${postulacion.id}`, postulacion);
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
  obtenerConteoPostulacionesPorOferta,
  crearPostulacion,
  cambiarEstadoPostulacion,
  actualizarPostulacion,
  eliminarPostulacion
};
