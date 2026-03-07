import API from './axiosConfig';

// ===== CREATE =====
export const crearOferta = async (ofertaData) => {
  try {
    const response = await API.post('/api/oferta', ofertaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear oferta:', error);
    throw error;
  }
};

// ===== READ =====

export const getAllOfertas = async () => {
  try {
    const response = await API.get('/api/oferta');
    return response.data;
  } catch (error) {
    console.error('Error al obtener ofertas:', error);
    throw error;
  }
};

export const getOfertaById = async (id) => {
  try {
    const response = await API.get(`/api/oferta/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener oferta ${id}:`, error);
    throw error;
  }
};

// ===== BÚSQUEDAS Y FILTROS =====

// RF11 - Buscar por nombre/título
export const buscarPorNombre = async (nombre) => {
  try {
    const response = await API.get('/api/oferta/nombre', {
      params: { nombre }
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar ofertas por nombre:', error);
    throw error;
  }
};

// RF12 - Buscar por rango de salario
export const buscarPorSalario = async (min, max) => {
  try {
    const response = await API.get('/api/oferta/salario', {
      params: { min, max }
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar ofertas por salario:', error);
    throw error;
  }
};

// RF12 - Buscar por ubicación (municipio)
export const buscarPorUbicacion = async (municipioId) => {
  try {
    const response = await API.get(`/api/oferta/ubicacion/${municipioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar ofertas por ubicación:', error);
    throw error;
  }
};

// RF11 - Buscar por nivel de experiencia
export const buscarPorExperiencia = async (nivel) => {
  try {
    const response = await API.get(`/api/oferta/experiencia/${nivel}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar ofertas por experiencia:', error);
    throw error;
  }
};

// RF12 - Buscar por modalidad
export const buscarPorModalidad = async (modalidad) => {
  try {
    const response = await API.get(`/api/oferta/modalidad/${modalidad}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar ofertas por modalidad:', error);
    throw error;
  }
};

// Buscar por empresa
export const getOfertasPorEmpresa = async (empresaId) => {
  try {
    const response = await API.get(`/api/oferta/empresa/${empresaId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener ofertas de empresa ${empresaId}:`, error);
    throw error;
  }
};

// Búsqueda por texto genérica (nombre o descripción)
export const buscarOfertas = async (texto) => {
  try {
    const response = await API.get('/api/oferta/nombre', {
      params: { nombre: texto }
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar ofertas:', error);
    throw error;
  }
};

// ===== UPDATE =====

export const actualizarOferta = async (id, ofertaData) => {
  try {
    const response = await API.put(`/api/oferta/${id}`, ofertaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar oferta ${id}:`, error);
    throw error;
  }
};

// Cambiar estado de oferta (ABIERTA/CERRADA)
export const cambiarEstadoOferta = async (id, estado) => {
  try {
    const response = await API.patch(`/api/oferta/${id}/estado`, null, {
      params: { estado }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al cambiar estado de oferta ${id}:`, error);
    throw error;
  }
};

// ===== DELETE =====

export const eliminarOferta = async (id) => {
  try {
    const response = await API.delete(`/api/oferta/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar oferta ${id}:`, error);
    throw error;
  }
};

// ===== EXPORTS PARA COMPATIBILIDAD HACIA ATRÁS =====
// Mantener nombres antiguos para no romper código existente
export const getOfertasAbiertas = getAllOfertas;
export const getOfertasPorReclutador = getOfertasPorEmpresa;

export default {
  crearOferta,
  getAllOfertas,
  getOfertaById,
  buscarPorNombre,
  buscarPorSalario,
  buscarPorUbicacion,
  buscarPorExperiencia,
  buscarPorModalidad,
  getOfertasPorEmpresa,
  buscarOfertas,
  actualizarOferta,
  cambiarEstadoOferta,
  eliminarOferta,
  getOfertasAbiertas,
  getOfertasPorReclutador
};
