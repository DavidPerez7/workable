import API from './axiosConfig';

const administradorAPI = {
  // Obtener todos los administradores
  getAll: async () => {
    try {
      const response = await API.get('/api/administrador');
      return response.data;
    } catch (error) {
      console.error('Error fetching administradores:', error);
      throw error;
    }
  },

  // Obtener un administrador por ID
  get: async (id) => {
    try {
      const response = await API.get(`/api/administrador/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching administrador ${id}:`, error);
      throw error;
    }
  },

  // Obtener administradores activos
  getActive: async () => {
    try {
      const response = await API.get('/api/administrador/activos');
      return response.data;
    } catch (error) {
      console.error('Error fetching active administradores:', error);
      throw error;
    }
  },

  // Crear un nuevo administrador
  create: async (data) => {
    try {
      console.log('Payload enviado a /api/administrador:', JSON.stringify(data, null, 2));
      const response = await API.post('/api/administrador', data);
      return response.data;
    } catch (error) {
      console.error('Error creating administrador:', error);
      if (error.response?.data) {
        console.error('Respuesta del servidor:', error.response.data);
      }
      throw error;
    }
  },

  // Actualizar un administrador
  update: async (id, data) => {
    try {
      const response = await API.put(`/api/administrador/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating administrador ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un administrador
  delete: async (id) => {
    try {
      const response = await API.delete(`/api/administrador/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting administrador ${id}:`, error);
      throw error;
    }
  },

  // Actualizar último acceso
  updateLastAccess: async (id) => {
    try {
      const response = await API.put(`/api/administrador/${id}/ultimo-acceso`);
      return response.data;
    } catch (error) {
      console.error(`Error updating last access for administrador ${id}:`, error);
      throw error;
    }
  }
};

export default administradorAPI;
