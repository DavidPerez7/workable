import api from './axiosConfig';

// ===== READ ALL =====
export const obtenerTodasLasHabilidades = async () => {
  const response = await api.get('/api/habilidad');
  return response.data;
};

// ===== CREATE =====
export const crearHabilidad = async (habilidadData) => {
  const response = await api.post('/api/habilidad', habilidadData);
  return response.data;
};

// ===== READ BY ASPIRANTE =====
export const obtenerHabilidadesAspirante = async () => {
  const response = await api.get('/api/habilidad/aspirante');
  return response.data;
};

// ===== READ BY USUARIO ID =====
export const obtenerHabilidadesPorUsuario = async (aspiranteId) => {
  const response = await api.get(`/api/habilidad/usuario/${aspiranteId}`);
  return response.data;
};

// ===== READ BY ID =====
export const obtenerHabilidadPorId = async (id) => {
  const response = await api.get(`/api/habilidad/${id}`);
  return response.data;
};

// ===== UPDATE =====
export const actualizarHabilidad = async (id, habilidadData) => {
  const response = await api.put(`/api/habilidad/${id}`, habilidadData);
  return response.data;
};

// ===== DELETE =====
export const eliminarHabilidad = async (id) => {
  const response = await api.delete(`/api/habilidad/${id}`);
  return response.data;
};
