const API_URL = "http://localhost:8080/api/estudio";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getEstudiosPorUsuario = async (usuarioId) => {
  const res = await fetch(`${API_URL}/usuario/${usuarioId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener estudios");
  return await res.json();
};

export const crearEstudio = async (estudio, usuarioId) => {
  const res = await fetch(`${API_URL}?usuarioId=${usuarioId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(estudio),
  });
  if (!res.ok) throw new Error("Error al crear estudio");
  return await res.json();
};

export const actualizarEstudio = async (id, estudio, usuarioIdActual) => {
  const res = await fetch(`${API_URL}/${id}?usuarioIdActual=${usuarioIdActual}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(estudio),
  });
  if (!res.ok) throw new Error("Error al actualizar estudio");
  return await res.json();
};

export const eliminarEstudio = async (id, usuarioIdActual) => {
  const res = await fetch(`${API_URL}/${id}?usuarioIdActual=${usuarioIdActual}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar estudio");
};
