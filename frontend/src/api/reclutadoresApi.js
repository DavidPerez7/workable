// src/api/reclutadorAPI.js
import { getAuthHeaders } from '../utils/auth';

export const getAllReclutadores = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/reclutadores", {
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
  const response = await fetch(`http://localhost:8080/api/reclutadores/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("reclutador no encontrado");
  }
  const data = await response.json();
  return data;
};

export const getAllReclutadoresDto = async () => {
  const response = await fetch("http://localhost:8080/api/reclutadores", {
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
  console.log("📤 Enviando datos de reclutador:", objeto);
  
  const response = await fetch("http://localhost:8080/api/reclutadores", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(objeto)
  });

  console.log("📥 Respuesta del servidor:", response.status, response.statusText);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Error desconocido al crear reclutador" }));
    console.error("❌ Error del servidor:", errorData);
    
    const error = new Error(errorData.error || errorData.message || "Error al crear reclutador");
    error.response = { data: errorData };
    throw error;
  }
  
  const data = await response.json();
  console.log("✅ Reclutador creado exitosamente:", data);
  return data;
};

export const eliminarReclutador = async (id) => {
  const response = await fetch(`http://localhost:8080/api/reclutadores/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("error al eliminar reclutador");
  }
  return null;
};