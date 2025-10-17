const API_URL = "http://localhost:8080/api/notificaciones";

export const getNotificacionesPorUsuario = async (usuarioId) => {
  const res = await fetch(`${API_URL}/usuario/${usuarioId}`);
  if (!res.ok) throw new Error("Error al obtener notificaciones");
  return await res.json();
};

export const getNotificacion = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener notificación");
  return await res.json();
};

export const crearNotificacion = async (notificacion) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notificacion),
  });
  if (!res.ok) throw new Error("Error al crear notificación");
  return await res.json();
};

export const marcarNotificacionLeida = async (id) => {
  const res = await fetch(`${API_URL}/leida/${id}`, {
    method: "PUT" });
  if (!res.ok) throw new Error("Error al marcar notificación como leída");
  return await res.json();
};

export const eliminarNotificacion = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar notificación");
};
