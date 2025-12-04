const API_URL = "http://localhost:8080/api/usuario";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getUsuarios = async () => {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
};

export const getUsuario = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener usuario");
  return await res.json();
};

export const crearUsuario = async (usuario) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(usuario),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return await res.json();
};

export const actualizarUsuario = async (id, usuario) => {
  const userId = localStorage.getItem("userId");
  const res = await fetch(`${API_URL}/public/${id}?usuarioActualId=${userId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(usuario),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Error al actualizar" }));
    throw new Error(errData.error || "Error al actualizar usuario");
  }
  return await res.json();
};

export const eliminarUsuario = async (id) => {
  const userId = localStorage.getItem("userId");
  const res = await fetch(`${API_URL}/public/${id}?usuarioActualId=${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar usuario");
};
