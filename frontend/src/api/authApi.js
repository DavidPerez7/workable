import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";


export const login = async (LoginCredenciales) => {
	try {
		localStorage.clear();
		const response = await axios.post(`${API_URL}/login`, LoginCredenciales, {
			headers: { "Content-Type": "application/json" },
		});
		localStorage.setItem("token", response.data.token);
		localStorage.setItem("usuarioId", response.data.usuarioId);
		localStorage.setItem("rol", response.data.rol);
		return response.data;
	} catch (error) {
		console.error("Error de login details:", error.response?.data || error.message);
		const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error al iniciar sesión";
		throw new Error(errorMessage);
	}
};

export const registerAspirante = async (aspiranteData) => {
	try {
		const response = await axios.post(`${API_URL}/register-aspirante`, aspiranteData, {
			headers: { "Content-Type": "application/json" },
		});
		return response.data;
	} catch (error) {
		console.error("Error de registro aspirante details:", error.response?.data || error.message);
		const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error al registrar aspirante";
		throw new Error(errorMessage);
	}
};

export const registerReclutador = async (reclutadorData) => {
	try {
		const response = await axios.post(`${API_URL}/register-reclutador`, reclutadorData, {
			headers: { "Content-Type": "application/json" },
		});
		return response.data;
	} catch (error) {
		console.error("Error de registro reclutador details:", error.response?.data || error.message);
		const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error al registrar reclutador";
		throw new Error(errorMessage);
	}
};

export const logout = () => {
	localStorage.removeItem("token");
};
