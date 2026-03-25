import axios from "axios";
import { API_BASE_URL } from "./apiBase";

const API_URL = `${API_BASE_URL}/api/auth`;


export const login = async (LoginCredenciales) => {
	try {
		localStorage.clear();
		const response = await axios.post(`${API_URL}/login`, LoginCredenciales, {
			headers: { "Content-Type": "application/json" },
		});
		
		const data = response.data;
		localStorage.setItem("token", data.token);
		localStorage.setItem("usuarioId", data.usuarioId);
		localStorage.setItem("rol", data.rol);
		
		// Guardar objeto user básico
		localStorage.setItem("user", JSON.stringify(data));
		
		return data;
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
	localStorage.removeItem("usuarioId");
	localStorage.removeItem("rol");
	localStorage.removeItem("user");
};
