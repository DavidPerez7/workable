// src/api/reclutadorAPI.js

export const getAllReclutadores = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/reclutador/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("reclutador no encontrado");
  }
  const data = await response.json();
  return data;
};

export const getAllReclutadoresDto = async () => {
  const response = await fetch("http://localhost:8080/api/reclutador", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objeto)
  });

  if (!response.ok) {
    throw new Error("error al crear reclutador");
  }
  const data = await response.json();
  return data;
};

export const eliminarReclutador = async (id) => {
  const response = await fetch(`http://localhost:8080/api/reclutador/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("error al eliminar reclutador");
  }
  return null;
};