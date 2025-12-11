const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

export const getAllOfertas = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/oferta", {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Error al obtener ofertas");
    }
    return response.json();
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("No se pudo conectar con el servidor");
    }
    throw error;
  }
};

export const getOfertasAbiertas = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/oferta/abiertas");
    if (!response.ok) {
      throw new Error("Error al obtener ofertas");
    }
    return response.json();
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("No se pudo conectar con el servidor");
    }
    throw error;
  }
};

export const getOfertaById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/oferta/${id}`);
  if (!response.ok) {
    throw new Error("Oferta no encontrada");
  }
  return response.json();
};

export const getOfertasPorEmpresa = async (empresaId) => {
  const response = await fetch(`http://localhost:8080/api/oferta/empresa/${empresaId}`);
  if (!response.ok) {
    throw new Error("Error al obtener ofertas");
  }
  return response.json();
};

export const getOfertasPorReclutador = async (reclutadorId) => {
  const response = await fetch(`http://localhost:8080/api/oferta/reclutador/${reclutadorId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Error al obtener ofertas");
  }
  return response.json();
};

export const buscarOfertas = async (texto) => {
  const response = await fetch(`http://localhost:8080/api/oferta/buscar?texto=${encodeURIComponent(texto)}`);
  if (!response.ok) {
    throw new Error("Error al buscar ofertas");
  }
  return response.json();
};

export const crearOferta = async (ofertaData) => {
  const response = await fetch("http://localhost:8080/api/oferta", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(ofertaData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear oferta");
  }

  return response.json();
};

export const actualizarOferta = async (id, ofertaData) => {
  const response = await fetch(`http://localhost:8080/api/oferta/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(ofertaData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar oferta");
  }

  return response.json();
};

export const cambiarEstadoOferta = async (id, estado) => {
  const response = await fetch(`http://localhost:8080/api/oferta/${id}/estado?estado=${estado}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al cambiar estado");
  }

  return response.json();
};

export const eliminarOferta = async (id) => {
  const response = await fetch(`http://localhost:8080/api/oferta/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al eliminar oferta");
  }

  return null;
};

export default {
  getAllOfertas,
  getOfertasAbiertas,
  getOfertaById,
  getOfertasPorEmpresa,
  getOfertasPorReclutador,
  buscarOfertas,
  crearOferta,
  actualizarOferta,
  cambiarEstadoOferta,
  eliminarOferta
};
