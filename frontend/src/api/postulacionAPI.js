const API_URL = 'http://localhost:8080/api/postulacion';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const crearPostulacion = async (postulacion) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(postulacion),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al crear postulacion');
  }
  return res.json();
};

export const obtenerPostulaciones = async () => {
  const res = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Error al obtener postulaciones');
  return res.json();
};

export const eliminarPostulacion = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al eliminar postulacion');
  }
  return true;
};
