import API from './axiosConfig';

export const getMunicipios = async () => {
	try {
		const response = await API.get('/api/municipio');
		return response.data;
	} catch (error) {
		console.error("Error obteniendo municipios:", error.response?.data || error.message);
		const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error al obtener municipios";
		throw new Error(errorMessage);
	}
};

export const getMunicipioById = async (id) => {
	try {
		const response = await API.get(`/api/municipio/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error obteniendo municipio ${id}:`, error.response?.data || error.message);
		const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error al obtener municipio";
		throw new Error(errorMessage);
	}
};

export const createMunicipio = async (data) => {
	try {
		const response = await API.post('/api/municipio', data);
		return response.data;
	} catch (error) {
		console.error("Error creando municipio:", error.response?.data || error.message);
		const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error al crear municipio";
		throw new Error(errorMessage);
	}
};

export const updateMunicipio = async (id, data) => {
	try {
		const response = await API.put(`/api/municipio/${id}`, data);
		return response.data;
	} catch (error) {
		console.error(`Error actualizando municipio ${id}:`, error.response?.data || error.message);
		const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error al actualizar municipio";
		throw new Error(errorMessage);
	}
};

export const deleteMunicipio = async (id) => {
	try {
		const response = await API.delete(`/api/municipio/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error eliminando municipio ${id}:`, error.response?.data || error.message);
		const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error al eliminar municipio";
		throw new Error(errorMessage);
	}
};

export default {
	getMunicipios,
	getMunicipioById,
	createMunicipio,
	updateMunicipio,
	deleteMunicipio,
};