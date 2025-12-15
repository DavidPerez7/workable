import api from './axiosConfig';

// ===== CREATE (Solo ADMIN) =====
export const crearNotificacion = async (data) => {
  const response = await api.post('/api/notificacion', data);
  return response.data;
};

// ===== READ ALL =====
export const getAllNotificaciones = async () => {
  const response = await api.get('/api/notificacion');
  return response.data;
};

// ===== READ BY ID =====
export const getNotificacion = async (id) => {
  const response = await api.get(`/api/notificacion/${id}`);
  return response.data;
};

// ===== READ BY USUARIO =====
export const getNotificacionesPorUsuario = async (usuarioId, usuarioIdActual) => {
  const response = await api.get(`/api/notificacion/usuario/${usuarioId}`, {
    params: { usuarioIdActual }
  });
  return response.data;
};

// ===== UPDATE (marcar como leída) =====
export const marcarNotificacionLeida = async (id) => {
  const response = await api.put(`/api/notificacion/${id}/marcar-leida`);
  return response.data;
};

// ===== DELETE =====
export const eliminarNotificacion = async (id, usuarioIdActual) => {
  const response = await api.delete(`/api/notificacion/${id}`, {
    params: { usuarioIdActual }
  });
  return response.data;
};
