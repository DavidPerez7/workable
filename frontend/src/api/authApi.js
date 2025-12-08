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
		return response.data;
	} catch (error) {
		throw new Error("Error al iniciar sesión");
	}
};

export const registerAspirante = async (aspiranteData) => {
	try {
		const response = await axios.post(`${API_URL}/register-aspirante`, aspiranteData, {
			headers: { "Content-Type": "application/json" },
		});
		return response.data;
	} catch (error) {
		throw new Error("Error al registrar aspirante");
	}
};

export const registerReclutador = async (reclutadorData) => {
	try {
		const response = await axios.post(`${API_URL}/register-reclutador`, reclutadorData, {
			headers: { "Content-Type": "application/json" },
		});
		return response.data;
	} catch (error) {
		throw new Error("Error al registrar reclutador");
	}
};

export const logout = () => {
	localStorage.removeItem("token");
};
