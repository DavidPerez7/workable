const API_URL = "http://localhost:8080/api/aspirante";
const AUTH_URL = "http://localhost:8080/api/auth";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const registrarAspirante = async (data) => {
  const res = await fetch(`${AUTH_URL}/register-aspirante`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ message: "Error al registrar" }));
    throw new Error(errData.message || "Error al registrar aspirante");
  }
  return res.json();
};

export const buscarAspirantePorId = async (id) => {
const res = await fetch(`http://localhost:8080/api/aspirante/${id}`, {
  method: "GET",
  headers: getAuthHeaders(),
});

  if (!res.ok) throw new Error("Datos no encontrados");
  return res.json();
};

export const crearAspirante = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al crear aspirante: ${errText}`);
  }
  return res.json();
};
