const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

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
  const response = await fetch(`http://localhost:8080/api/empresa/${id}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Empresa no encontrada");
  }
  return response.json();
};

export const getEmpresaPorNit = async (nit) => {
  const response = await fetch(`http://localhost:8080/api/empresa/nit/${nit}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Empresa no encontrada");
  }
  return response.json();
};

export const getReclutadoresEmpresa = async (empresaId) => {
  const response = await fetch(`http://localhost:8080/api/empresa/${empresaId}/reclutadores`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Error al obtener reclutadores");
  }
  return response.json();
};

export const getAllEmpresasDto = async () => {
  const response = await fetch("http://localhost:8080/api/empresa", {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Error al obtener empresas");
  }
  return response.json();
};

export const crearEmpresa = async (empresaData) => {
  const response = await fetch("http://localhost:8080/api/empresa", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(empresaData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear empresa");
  }

  return response.json();
};

export const actualizarEmpresa = async (id, empresaData) => {
  const response = await fetch(`http://localhost:8080/api/empresa/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(empresaData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar empresa");
  }

  return response.json();
};

export const eliminarEmpresa = async (id) => {
  const response = await fetch(`http://localhost:8080/api/empresa/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al eliminar empresa");
  }

  return null;
};

export default {
  getAllEmpresas,
  getEmpresaById,
  getEmpresaPorNit,
  getAllEmpresasDto,
  getReclutadoresEmpresa,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
};
