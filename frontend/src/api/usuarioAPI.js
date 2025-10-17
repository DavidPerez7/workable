const API_URL = "http://localhost:8080/api/usuarios";

export const getUsuarios = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
};

export const getUsuario = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener usuario");
  return await res.json();
};

export const crearUsuario = async (usuario) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return await res.json();
};

export const actualizarUsuario = async (id, usuario) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!res.ok) throw new Error("Error al actualizar usuario");
  return await res.json();
};

export const eliminarUsuario = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar usuario");
};
