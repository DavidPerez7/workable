export const getAllOfertas = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/oferta");
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

export const crearOferta = async (ofertaData) => {
  const response = await fetch("http://localhost:8080/api/oferta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ofertaData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear oferta");
  }

  return response.json();
};

export const eliminarOferta = async (id) => {
  const response = await fetch(`http://localhost:8080/api/oferta/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar oferta");
  }

  return null;
};
