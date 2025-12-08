import axios from "axios";

const API_URL = "http://localhost:8080/api/usuario"; //en singular

// este call api ya usa TOKENS
// solo para ADMIN (son usuarios totales)
export const getUsuarios = async (TOKEN) => {
	try {
		const response = await axios.get(API_URL, {headers: {Authorization: `Bearer ${TOKEN}`}});
		return response.data;
	} catch (error) {
		throw new Error("Error al obtener usuarios");
	}
}

export const getUsuarioById = async (userId, TOKEN) => {
	try {
		const response = await axios.get(`${API_URL}/public/${userId}`, {headers: {Authorization: `Bearer ${TOKEN}`}});
		return response.data;
	} catch (error) {
		if (error.response?.status === 404) {
			throw new Error("Usuario no encontrado");
		}
		throw new Error("Error al obtener usuario");
	}
}

export const createUsuario = async (usuarioData, TOKEN) => {
	try {
		const response = await axios.post(API_URL, usuarioData, {headers: {Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json'}});
		return response.data;
	} catch (error) {
		throw new Error("Error al crear usuario");
	}
}

export const updateUsuario = async (id, usuarioData, TOKEN) => {
	try {
		const response = await axios.put(`${API_URL}/${id}`, usuarioData, {headers: {Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json"}});
		return response.data
	} catch (error) {
		throw new Error("Error al actualizar usuario");
	}
}

export const deletePublicUsuario = async (id, TOKEN) => {
	try {
		const response = await axios.delete(`${API_URL}/publicDelete/${id}`, {headers: {Authorization: `Bearer ${TOKEN}`}});
		return response.data;
	} catch (error) {
		throw new Error("Error al eliminar usuario");
	}
}
