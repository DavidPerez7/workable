const API_URL = "http://localhost:8080/api/administradores";

export const getAdministradores = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener administradores");
  return await res.json();
};

export const getAdministrador = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener administrador");
  return await res.json();
};

export const crearAdministrador = async (admin) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(admin),
  });
  if (!res.ok) throw new Error("Error al crear administrador");
  return await res.json();
};

export const actualizarAdministrador = async (id, admin) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(admin),
  });
  if (!res.ok) throw new Error("Error al actualizar administrador");
  return await res.json();
};

export const eliminarAdministrador = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar administrador");
};
