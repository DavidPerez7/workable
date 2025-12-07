import axios from "axios";

const API_URL = "http://localhost:8080/api/usuario"; //en singular

export const getUsuarios = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		throw new Error("Error al obtener usuarios");
	}
}

export const getUsuarioById = async (userId, token) => {
	try {
		const response = await axios.get(`${API_URL}/${userId}`, {headers: {Authorization: `Bearer ${token}`}});
		return response.data;
	} catch (error) {
		throw new Error("Error al obtener usuario");
	}
}

export const createUsuario = async (usuarioData) => {
	try {
		const response = await axios.post(API_URL, usuarioData, {headers: {'Content-Type': 'application/json'}}); //
		return response.data;
	} catch (error) {
		throw new Error("Error al crear usuario");
	}
}

export const updateUsuario = async (id, usuarioData) => {
	try {
		const response = await axios.put(`${API_URL}/${id}`, usuarioData, {headers: {"Content-Type": "application/json"}});
		return response.data
	} catch (error) {
		throw new Error("Error al actualizar usuario");
	}
}

export const deleteUsuario = async (id) => {
	try {
		const response = await axios.delete(`${API_URL}/${id}`);
		return response.data;
	} catch (error) {
		throw new Error("Error al eliminar usuario");
	}
}
