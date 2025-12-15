import api from './axiosConfig';

// ===== CREATE =====
export const createCitacion = async (data) => {
  const { postulacionId, reclutadorId, fechaCitacion, hora, linkMeet, detalles, usuarioIdActual } = data;
  const response = await api.post('/api/citacion', null, {
    params: {
      postulacionId,
      reclutadorId,
      fechaCitacion,
      hora,
      linkMeet,
      detalles,
      usuarioIdActual
    }
  });
  return response.data;
};

// ===== READ ALL =====
export const getAllCitaciones = async () => {
  const response = await api.get('/api/citacion');
  return response.data;
};

// ===== READ BY ID =====
export const getCitacionById = async (id, usuarioIdActual) => {
  const response = await api.get(`/api/citacion/${id}`, {
    params: { usuarioIdActual }
  });
  return response.data;
};

// ===== UPDATE (cambiar estado) =====
export const updateCitacionEstado = async (id, estado, usuarioIdActual) => {
  const response = await api.put(`/api/citacion/${id}/estado`, null, {
    params: {
      estado,
      usuarioIdActual
    }
  });
  return response.data;
};

// Alias para compatibilidad
export const updateCitacion = updateCitacionEstado;

// ===== DELETE =====
export const deleteCitacion = async (id, usuarioIdActual) => {
  const response = await api.delete(`/api/citacion/${id}`, {
    params: { usuarioIdActual }
  });
  return response.data;
};

// ===== EXTRAS =====
export const getCitacionesByReclutador = async (reclutadorId, usuarioIdActual) => {
  const response = await api.get(`/api/citacion/reclutador/${reclutadorId}`, {
    params: { usuarioIdActual }
  });
  return response.data;
};

export const getCitacionesByAspirante = async (aspiranteId, usuarioIdActual) => {
  const response = await api.get(`/api/citacion/aspirante/${aspiranteId}`, {
    params: { usuarioIdActual }
  });
  return response.data;
};
