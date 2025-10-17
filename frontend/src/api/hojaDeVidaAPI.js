const API_URL = "http://localhost:8080/api/hojasdevida";

export const getHojasDeVidaPorAspirante = async (aspiranteId) => {
  const res = await fetch(`${API_URL}/aspirante/${aspiranteId}`);
  if (!res.ok) throw new Error("Error al obtener hojas de vida");
  return await res.json();
};

export const getHojaDeVida = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener hoja de vida");
  return await res.json();
};

export const crearHojaDeVida = async (hoja) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hoja),
  });
  if (!res.ok) throw new Error("Error al crear hoja de vida");
  return await res.json();
};

export const actualizarHojaDeVida = async (id, hoja) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hoja),
  });
  if (!res.ok) throw new Error("Error al actualizar hoja de vida");
  return await res.json();
};

export const eliminarHojaDeVida = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar hoja de vida");
};
