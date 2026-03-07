import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para token
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardAPI = {
  getMetrics: async () => {
    try {
      // New consolidated endpoint provided by backend
      const resp = await adminApi.get('/admin/stats');
      return resp.data || {};
    } catch (error) {
      console.error('Error fetching metrics (admin/stats):', error);
      // If the error is an auth issue (not an admin), try the public stats endpoint
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        try {
          const resp = await adminApi.get('/stats/public');
          // mark as public so UI can display a hint if desired
          return { ...(resp.data || {}), _public: true };
        } catch (exPublic) {
          console.error('Public stats fallback failed:', exPublic);
          throw error; // rethrow original to let UI show an auth-related message
        }
      }

      // Fallback to older behavior if admin/stats is not available for other reasons
      try {
        const [aspirantes, ofertas] = await Promise.all([
          adminApi.get('/aspirante'),
          adminApi.get('/oferta'),
        ]);
        return {
          totalAspirantes: aspirantes.data?.length || 0,
          totalOfertas: ofertas.data?.length || 0,
          avgResponse: 210,
        };
      } catch (ex) {
        console.error('Fallback metrics fetch also failed:', ex);
        return { totalAspirantes: 0, totalOfertas: 0, avgResponse: 210 };
      }
    }
  },
};

export const logsAPI = {
  getLogs: async () => {
    try {
      const resp = await adminApi.get('/admin/logs');
      return resp.data || [];
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
  },

  postLog: async (payload) => {
    try {
      await adminApi.post('/admin/logs', payload);
      return true;
    } catch (error) {
      console.error('Error posting log:', error);
      return false;
    }
  }
};


export const userAPI = {
  getAll: async () => {
    try {
      const response = await adminApi.get('/aspirante');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await adminApi.get(`/aspirante/public/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return null;
    }
  },

  create: async (payload) => {
    try {
      const response = await adminApi.post('/aspirante', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  update: async (id, payload) => {
    try {
      const response = await adminApi.put(`/aspirante/${id}/admin`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await adminApi.delete(`/aspirante/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  activate: async (id) => {
    try {
      const response = await adminApi.put(`/aspirante/${id}/activar`);
      return response.data;
    } catch (error) {
      console.error(`Error activating user ${id}:`, error);
      throw error;
    }
  },

  deactivate: async (id) => {
    try {
      const response = await adminApi.put(`/aspirante/${id}/desactivar`);
      return response.data;
    } catch (error) {
      console.error(`Error deactivating user ${id}:`, error);
      throw error;
    }
  },
};

export const productAPI = {
  getAll: async () => {
    try {
      const response = await adminApi.get('/oferta');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await adminApi.get(`/oferta/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  create: async (payload) => {
    try {
      const response = await adminApi.post('/oferta', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  update: async (id, payload) => {
    try {
      const response = await adminApi.put(`/oferta/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await adminApi.delete(`/oferta/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

export const adminAPI = {
  getAll: async () => {
    try {
      const response = await adminApi.get('/administrador');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching admins:', error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await adminApi.get(`/administrador/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching admin ${id}:`, error);
      return null;
    }
  },

  create: async (payload) => {
    try {
      const response = await adminApi.post('/administrador', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  update: async (id, payload) => {
    try {
      const response = await adminApi.put(`/administrador/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating admin ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await adminApi.delete(`/administrador/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting admin ${id}:`, error);
      throw error;
    }
  },
};

export const postulacionAPI = {
  getByAspiranteId: async (aspiranteId) => {
    try {
      const response = await adminApi.get(`/postulacion/aspirante/${aspiranteId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching postulaciones for aspirante ${aspiranteId}:`, error);
      return [];
    }
  },

  getAll: async () => {
    try {
      const response = await adminApi.get('/postulacion');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching postulaciones:', error);
      return [];
    }
  },
};

export default adminApi;
