import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getMunicipios = async () => {
	try {
		const response = await axios.get(`${API_URL}/municipio`);
		return response.data;
	} catch (error) {
		console.error("Error obteniendo municipios:", error.response?.data || error.message);
		const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error al obtener municipios";
		throw new Error(errorMessage);
	}
};