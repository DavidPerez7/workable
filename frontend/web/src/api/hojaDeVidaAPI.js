import API from './axiosConfig';

// Exportar funciones por nombre además del objeto por defecto para evitar problemas
// con ciertas resoluciones de módulos/HMR donde las propiedades del objeto pueden
// no ser directamente invocables.
export const getHojasDeVidaPorAspirante = async (aspiranteId) => {
  try {
    const response = await API.get(`/api/hoja-vida/aspirante/${aspiranteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hojas de vida for aspirante ${aspiranteId}:`, error);
    throw error;
  }
};

export const getHojaDeVida = async (id) => {
  try {
    const response = await API.get(`/api/hoja-vida/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hoja de vida ${id}:`, error);
    throw error;
  }
};

export const crearHojaDeVida = async (hoja) => {
  try {
    const response = await API.post('/api/hoja-vida', hoja);
    return response.data;
  } catch (error) {
    console.error('Error creating hoja de vida:', error);
    throw error;
  }
};

export const actualizarHojaDeVida = async (id, hoja) => {
  try {
    const response = await API.put(`/api/hoja-vida/${id}`, hoja);
    return response.data;
  } catch (error) {
    console.error(`Error updating hoja de vida ${id}:`, error);
    throw error;
  }
};

export const eliminarHojaDeVida = async (id) => {
  try {
    const response = await API.delete(`/api/hoja-vida/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting hoja de vida ${id}:`, error);
    throw error;
  }
};

const hojaDeVidaApi = {
  getHojasDeVidaPorAspirante,
  getHojaDeVida,
  crearHojaDeVida,
  actualizarHojaDeVida,
  eliminarHojaDeVida
};

export default hojaDeVidaApi;
