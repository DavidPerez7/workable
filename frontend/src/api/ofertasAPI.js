export const getAllOfertas = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:8080/api/oferta", {
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
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

export const getOfertaById = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8080/api/oferta/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    }
  });
  if (!response.ok) {
    throw new Error("Oferta no encontrada");
  }
  return response.json();
};

export const getOfertasPorEmpresa = async (empresaId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/oferta/empresa/${empresaId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
    if (!response.ok) {
      throw new Error("Error al obtener ofertas de la empresa");
    }
    return response.json();
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("No se pudo conectar con el servidor");
    }
    throw error;
  }
};

export const crearOferta = async (ofertaData) => {
  const token = localStorage.getItem('token');
  
  console.log('🔑 Token JWT:', token ? 'Presente' : 'NO PRESENTE');
  console.log('� Token completo:', token);
  
  // Decodificar el token para ver su contenido (solo para debug)
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('📋 Contenido del token:', payload);
      console.log('👤 Rol en token:', payload.rol);
    } catch (e) {
      console.error('Error al decodificar token:', e);
    }
  }
  
  console.log('�📤 Datos a enviar:', ofertaData);
  
  const response = await fetch("http://localhost:8080/api/oferta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify(ofertaData),
  });

  console.log('📡 Status de respuesta:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Error del servidor:', errorData);
    throw new Error(errorData.message || `Error al crear oferta (${response.status})`);
  }

  return response.json();
};

export const eliminarOferta = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8080/api/oferta/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    throw new Error("Error al eliminar oferta");
  }

  return null;
};
