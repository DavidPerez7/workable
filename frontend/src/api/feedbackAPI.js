import api from './axiosConfig';

// ===== CREATE =====
export const createFeedback = async (data, usuarioIdActual) => {
  const response = await api.post('/api/feedback', data, {
    params: { usuarioIdActual }
  });
  return response.data;
};

// ===== READ ALL =====
export const getAllFeedbacks = async () => {
  const response = await api.get('/api/feedback');
  return response.data;
};

// ===== READ BY ID =====
export const getFeedbackById = async (id) => {
  const response = await api.get(`/api/feedback/${id}`);
  return response.data;
};

// ===== UPDATE =====
export const updateFeedback = async (id, data, usuarioIdActual) => {
  const response = await api.put(`/api/feedback/${id}`, data, {
    params: { usuarioIdActual }
  });
  return response.data;
};

// ===== DELETE =====
export const deleteFeedback = async (id, usuarioIdActual) => {
  const response = await api.delete(`/api/feedback/${id}`, {
    params: { usuarioIdActual }
  });
  return response.data;
};

// ===== EXTRAS =====
export const getFeedbacksByEmpresa = async (empresaId) => {
  const response = await api.get(`/api/feedback/empresa/${empresaId}`);
  return response.data;
};

export const getFeedbacksByOferta = async (ofertaId) => {
  const response = await api.get(`/api/feedback/oferta/${ofertaId}`);
  return response.data;
};
