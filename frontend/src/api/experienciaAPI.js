const API_URL = "http://localhost:8080/api/experiencia";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getExperienciasPorUsuario = async (usuarioId) => {
  const res = await fetch(`${API_URL}/usuario/${usuarioId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener experiencias");
  return await res.json();
};

export const crearExperiencia = async (experiencia, usuarioId) => {
  const res = await fetch(`${API_URL}?usuarioId=${usuarioId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(experiencia),
  });
  if (!res.ok) throw new Error("Error al crear experiencia");
  return await res.json();
};

export const actualizarExperiencia = async (id, experiencia, usuarioIdActual) => {
  const res = await fetch(`${API_URL}/${id}?usuarioIdActual=${usuarioIdActual}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(experiencia),
  });
  if (!res.ok) throw new Error("Error al actualizar experiencia");
  return await res.json();
};

export const eliminarExperiencia = async (id, usuarioIdActual) => {
  const res = await fetch(`${API_URL}/${id}?usuarioIdActual=${usuarioIdActual}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar experiencia");
};
