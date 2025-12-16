import API from './axiosConfig';

const reclutadoresApi = {
  // Obtener todos los reclutadores
  getAll: async () => {
    try {
      const response = await API.get('/api/reclutador');
      return response.data;
    } catch (error) {
      console.error('Error fetching reclutadores:', error);
      throw error;
    }
  },

  // Obtener un reclutador por ID
  get: async (id) => {
    try {
      const response = await API.get(`/api/reclutador/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reclutador ${id}:`, error);
      throw error;
    }
  },

  // Obtener reclutador público por ID
  getPublic: async (id) => {
    try {
      const response = await API.get(`/api/reclutador/public/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching public reclutador ${id}:`, error);
      throw error;
    }
  },

  // Obtener mi perfil (usa el ID del usuario en localStorage)
  getMyProfile: async () => {
    try {
      const reclutadorId = localStorage.getItem("usuarioId");
      if (!reclutadorId) {
        throw new Error("No se encontró ID de usuario en sesión");
      }
      const response = await API.get(`/api/reclutador/${reclutadorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching my profile:', error);
      throw error;
    }
  },

  // Obtener reclutadores de una empresa
  getByEmpresa: async (empresaId) => {
    try {
      const response = await API.get(`/api/reclutador/empresa/${empresaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reclutadores for empresa ${empresaId}:`, error);
      throw error;
    }
  },

  // Obtener reclutador por correo
  getByCorreo: async (correo) => {
    try {
      const response = await API.get(`/api/reclutador/correo/${correo}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reclutador by correo ${correo}:`, error);
      throw error;
    }
  },

  // Crear un nuevo reclutador
  create: async (data) => {
    try {
      console.log('Payload enviado a /api/reclutador:', JSON.stringify(data, null, 2));
      const response = await API.post('/api/reclutador', data);
      return response.data;
    } catch (error) {
      console.error('Error creating reclutador:', error);
      if (error.response?.data) {
        console.error('Respuesta del servidor:', error.response.data);
      }
      throw error;
    }
  },

  // Actualizar un reclutador
  update: async (id, data, reclutadorIdActual) => {
    try {
      const response = await API.put(`/api/reclutador/${id}?reclutadorIdActual=${reclutadorIdActual}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating reclutador ${id}:`, error);
      throw error;
    }
  },

  // Actualizar reclutador como ADMIN
  updateAdmin: async (id, data) => {
    try {
      const response = await API.put(`/api/reclutador/admin/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating reclutador ${id} as admin:`, error);
      throw error;
    }
  },

  // Eliminar un reclutador
  delete: async (id, reclutadorIdActual) => {
    try {
      const response = await API.delete(`/api/reclutador/${id}?reclutadorIdActual=${reclutadorIdActual}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting reclutador ${id}:`, error);
      throw error;
    }
  },

  // Asignar empresa al reclutador logueado
  asignarEmpresa: async (empresaId) => {
    try {
      const response = await API.put(`/api/reclutador/me/empresa/${empresaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error assigning empresa ${empresaId}:`, error);
      throw error;
    }
  }
};

export default reclutadoresApi;