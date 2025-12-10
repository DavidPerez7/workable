import axios from "axios";

const API_URL_ASPIRANTE = "http://localhost:8080/api/aspirante";
const API_URL_RECLUTADOR = "http://localhost:8080/api/reclutador";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// obtener usuario actual (por JWT)
export const getUsuarioActual = async (rol) => {
	try {
		const endpoint = rol === "ASPIRANTE" 
			? `${API_URL_ASPIRANTE}/me` 
			: `${API_URL_RECLUTADOR}/me`;
		
		const response = await axios.get(endpoint, {
			headers: getAuthHeaders()
		});
		return response.data;
	} catch (error) {
		console.error("Error al obtener usuario actual:", error.response?.data || error.message);
		if (error.response?.status === 401) {
			throw new Error("Sesión expirada. Por favor, inicia sesión de nuevo");
		}
		if (error.response?.status === 404) {
			throw new Error("Usuario no encontrado");
		}
		throw new Error(error.response?.data?.message || error.response?.data?.error || "Error al obtener usuario");
	}
}

// obtener usuario por ID (funciona para Aspirante o Reclutador)
export const getUsuarioById = async (userId, TOKEN, rol) => {
	try {
		// Determinar el endpoint basado en el rol
		const endpoint = rol === "ASPIRANTE" 
			? `http://localhost:8080/api/aspirante/public/${userId}` 
			: `http://localhost:8080/api/reclutador/public/${userId}`;
		
		const response = await axios.get(endpoint, {
			headers: { Authorization: `Bearer ${TOKEN}` }
		});
		return response.data;
	} catch (error) {
		console.error("Error al obtener usuario:", error.response?.data || error.message);
		if (error.response?.status === 404) {
			throw new Error("Usuario no encontrado");
		}
		throw new Error(error.response?.data?.message || "Error al obtener usuario");
	}
}

export const getUsuarios = async (TOKEN) => {
	try {
		const response = await axios.get(API_URL_ASPIRANTE, {
			headers: { Authorization: `Bearer ${TOKEN}` }
		});
		return response.data;
	} catch (error) {
		throw new Error("Error al obtener usuarios");
	}
}

export const createUsuario = async (usuarioData, TOKEN) => {
	try {
		const response = await axios.post(API_URL_ASPIRANTE, usuarioData, {
			headers: {
				Authorization: `Bearer ${TOKEN}`,
				'Content-Type': 'application/json'
			}
		});
		return response.data;
	} catch (error) {
		throw new Error("Error al crear usuario");
	}
}

export const updateUsuario = async (id, usuarioData, TOKEN, rol) => {
	try {
		const endpoint = rol === "ASPIRANTE" ? API_URL_ASPIRANTE : API_URL_RECLUTADOR;
		const response = await axios.put(`${endpoint}/${id}`, usuarioData, {
			headers: {
				Authorization: `Bearer ${TOKEN}`,
				"Content-Type": "application/json"
			}
		});
		return response.data;
	} catch (error) {
		throw new Error("Error al actualizar usuario");
	}
}

export const deletePublicUsuario = async (id, TOKEN, rol) => {
	try {
		let endpoint;
		let config = {
			headers: { Authorization: `Bearer ${TOKEN}` }
		};

		if (rol === "ASPIRANTE") {
			endpoint = `${API_URL_ASPIRANTE}/publicDelete/${id}`;
		} else if (rol === "RECLUTADOR") {
			endpoint = `${API_URL_RECLUTADOR}/${id}`;
			config.params = { reclutadorIdActual: id };
		}

		const response = await axios.delete(endpoint, config);
		return response; // Devolver toda la respuesta, no solo data
	} catch (error) {
		throw new Error("Error al eliminar usuario");
	}
}
