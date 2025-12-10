// src/api/reclutadorAPI.js

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

export const getAllReclutadores = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/reclutador", {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("error al obtener reclutadores");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw new Error("no se pudo conectar con el servidor");
    }
    throw error;
  }
};

export const getReclutadorById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/reclutador/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("reclutador no encontrado");
  }
  const data = await response.json();
  return data;
};

export const getReclutadorPublicById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/reclutador/public/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("reclutador no encontrado");
  }
  const data = await response.json();
  return data;
};

export const getReclutadorPorCorreo = async (correo) => {
  const response = await fetch(`http://localhost:8080/api/reclutador/correo/${correo}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("reclutador no encontrado");
  }
  const data = await response.json();
  return data;
};

export const getReclutadoresPorEmpresa = async (empresaId) => {
  const response = await fetch(`http://localhost:8080/api/reclutador/empresa/${empresaId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("error al obtener reclutadores");
  }
  const data = await response.json();
  return data;
};

export const crearReclutador = async (objeto) => {
  const response = await fetch("http://localhost:8080/api/reclutador", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(objeto)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "error al crear reclutador");
  }
  const data = await response.json();
  return data;
};

export const actualizarReclutador = async (id, datos) => {
  const response = await fetch(`http://localhost:8080/api/reclutador/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "error al actualizar reclutador");
  }
  const data = await response.json();
  return data;
};

export const eliminarReclutador = async (id) => {
  const response = await fetch(`http://localhost:8080/api/reclutador/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("error al eliminar reclutador");
  }
  return null;
};

export default {
  getAllReclutadores,
  getReclutadorById,
  getReclutadorPublicById,
  getReclutadorPorCorreo,
  getReclutadoresPorEmpresa,
  crearReclutador,
  actualizarReclutador,
  eliminarReclutador
};