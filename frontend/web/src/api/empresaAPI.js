const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

// NOTE: controller reduced to the 5 standard methods. Use getAllEmpresasDto for listing.

export const getEmpresaById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/empresa/${id}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error("Empresa no encontrada");
  }
  return response.json();
};

// Endpoints like /nit/{nit} and /{empresaId}/reclutadores were removed from the controller
// as the API was reduced to the standard CRUD methods. If needed, implement service-side support first.

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

// Note: Activar/Desactivar should use the generic PUT /api/empresa/{id} with the full entity payload.

export const eliminarEmpresa = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error('No se encontró token de autenticación. Por favor inicia sesión.');

  const response = await fetch(`http://localhost:8080/api/empresa/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    // parse detailed error from body if possible
    let bodyText = '';
    try {
      const json = await response.json().catch(() => null);
      if (json && json.message) bodyText = json.message;
      else if (json) bodyText = JSON.stringify(json);
    } catch (e) {
      bodyText = await response.text().catch(() => '');
    }

    const statusMsg = `${response.status} ${response.statusText}`.trim();
    const message = bodyText ? `${statusMsg}: ${bodyText}` : statusMsg;
    throw new Error(message || "Error al eliminar empresa");
  }

  return null;
};

export default {
  getAllEmpresasDto,
  getEmpresaById,
  
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
};
