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
  console.log("📤 Enviando datos de empresa:", empresaData);
  
  const response = await fetch("http://localhost:8080/api/empresa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(empresaData),
  });

  console.log("📥 Respuesta del servidor:", response.status, response.statusText);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
    console.error("❌ Error del servidor:", errorData);
    
    // Crear un error con más detalles
    const error = new Error(errorData.error || errorData.message || "Error al crear empresa");
    error.response = { data: errorData };
    throw error;
  }

  const result = await response.json();
  console.log("✅ Empresa creada exitosamente:", result);
  return result;
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
