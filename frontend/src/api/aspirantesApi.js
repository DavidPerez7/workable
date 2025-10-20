const API_URL = "http://localhost:8080/api/aspirante";


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const buscarAspirantePorId = async (id) => {
const res = await fetch(`http://localhost:8080/api/aspirante/${id}`, {
  method: "GET",
  headers: getAuthHeaders(),
});

  if (!res.ok) throw new Error("Datos no encontrados");
  return res.json();
};

export const crearAspirante = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al crear aspirante: ${errText}`);
  }
  return res.json();
};


// Actualizar aspirante existente
export const updateAspirante = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al actualizar aspirante: ${errText}`);
  }
  return res.json();
};


// Eliminar aspirante existente
export const eliminarAspirante = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al eliminar aspirante: ${errText}`);
  }
  return true;
};
