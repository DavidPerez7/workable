import API from './axiosConfig';

const aspirantesApi = {
  // Obtener todos los aspirantes
  getAll: async () => {
    try {
      const response = await API.get('/api/aspirante');
      return response.data;
    } catch (error) {
      console.error('Error fetching aspirantes:', error);
      throw error;
    }
  },

  // Obtener un aspirante por ID
  get: async (id) => {
    try {
      const response = await API.get(`/api/aspirante/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching aspirante ${id}:`, error);
      throw error;
    }
  },

  // Obtener aspirante público por ID
  getPublic: async (id) => {
    try {
      const response = await API.get(`/api/aspirante/public/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching public aspirante ${id}:`, error);
      throw error;
    }
  },

  // Obtener mi perfil
  getMyProfile: async () => {
    try {
      const response = await API.get('/api/aspirante/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching my profile:', error);
      throw error;
    }
  },

  // Obtener aspirante por correo
  getByCorreo: async (correo) => {
    try {
      const response = await API.get(`/api/aspirante/correo?correo=${correo}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching aspirante by correo ${correo}:`, error);
      throw error;
    }
  },

  // Obtener aspirante por nombre
  getByNombre: async (nombre) => {
    try {
      const response = await API.get(`/api/aspirante/nombre?nombre=${nombre}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching aspirante by nombre ${nombre}:`, error);
      throw error;
    }
  },

  // Crear un nuevo aspirante (PÚBLICO)
  createPublic: async (data) => {
    try {
      const response = await API.post('/api/aspirante/public', data);
      return response.data;
    } catch (error) {
      console.error('Error creating aspirante publicly:', error);
      throw error;
    }
  },

  // Crear un nuevo aspirante (ADMIN)
  create: async (data) => {
    try {
      console.log('Payload enviado a /api/aspirante:', JSON.stringify(data, null, 2));
      const response = await API.post('/api/aspirante', data);
      return response.data;
    } catch (error) {
      console.error('Error creating aspirante:', error);
      if (error.response?.data) {
        console.error('Respuesta del servidor:', error.response.data);
      }
      throw error;
    }
  },

  // Actualizar mi perfil
  updateMyProfile: async (data) => {
    try {
      const response = await API.put('/api/aspirante/actualizar', data);
      return response.data;
    } catch (error) {
      console.error('Error updating my profile:', error);
      throw error;
    }
  },

  // Actualizar mi perfil (protegido)
  update: async (id, data) => {
    try {
      const response = await API.put(`/api/aspirante/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating aspirante ${id}:`, error);
      throw error;
    }
  },

  // Actualizar aspirante como ADMIN
  updateAdmin: async (id, data) => {
    try {
      const response = await API.put(`/api/aspirante/${id}/admin`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating aspirante ${id} as admin:`, error);
      throw error;
    }
  },

  // Actualizar aspirante públicamente
  updatePublic: async (id, data, aspiranteActualId) => {
    try {
      const response = await API.put(`/api/aspirante/public/${id}?aspiranteActualId=${aspiranteActualId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating aspirante ${id} publicly:`, error);
      throw error;
    }
  },

  // Desactivar un aspirante
  deactivate: async (id) => {
    try {
      const response = await API.put(`/api/aspirante/${id}/desactivar`);
      return response.data;
    } catch (error) {
      console.error(`Error deactivating aspirante ${id}:`, error);
      throw error;
    }
  },

  // Activar un aspirante
  activate: async (id) => {
    try {
      const response = await API.put(`/api/aspirante/${id}/activar`);
      return response.data;
    } catch (error) {
      console.error(`Error activating aspirante ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un aspirante (PÚBLICO)
  deletePublic: async (id) => {
    try {
      const response = await API.delete(`/api/aspirante/publicDelete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting aspirante ${id} publicly:`, error);
      throw error;
    }
  },

  // Eliminar un aspirante (ADMIN)
  delete: async (id) => {
    try {
      const response = await API.delete(`/api/aspirante/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting aspirante ${id}:`, error);
      throw error;
    }
  }
};

export default aspirantesApi;
