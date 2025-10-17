export const getAllEmpresas = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/empresa/all");
    if (!response.ok) {
      throw new Error("Error al obtener empresas");
    }
    return response.json();
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("No se pudo conectar con el servidor");
    }
    throw error;
  }
};

export const getEmpresaById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/empresa/${id}`);
  if (!response.ok) {
    throw new Error("Empresa no encontrada");
  }
  return response.json();
};

export const getAllEmpresasDto = async () => {
  const response = await fetch("http://localhost:8080/api/empresa");
  if (!response.ok) {
    throw new Error("Error al obtener empresas");
  }
  return response.json();
};

export const crearEmpresa = async (empresaData) => {
  const response = await fetch("http://localhost:8080/api/empresa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(empresaData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear empresa");
  }

  return response.json();
};

export const eliminarEmpresa = async (id) => {
  const response = await fetch(`http://localhost:8080/api/empresa/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar empresa");
  }

  return null;
};
