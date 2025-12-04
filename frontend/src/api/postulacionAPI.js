const API_URL = "http://localhost:8080/api/postulacion";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Crear una nueva postulación
 * @param {number} usuarioId - ID del aspirante
 * @param {number} ofertaId - ID de la oferta
 */
export const crearPostulacion = async (usuarioId, ofertaId) => {
  const res = await fetch(`${API_URL}?usuarioId=${usuarioId}&ofertaId=${ofertaId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Error al postularse" }));
    throw new Error(errData.error || errData.message || "Error al crear postulación");
  }
  return res.json();
};

/**
 * Obtener postulación por ID
 * @param {number} id - ID de la postulación
 * @param {number} usuarioIdActual - ID del usuario actual para validación
 */
export const getPostulacionPorId = async (id, usuarioIdActual) => {
  const res = await fetch(`${API_URL}/${id}?usuarioIdActual=${usuarioIdActual}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al obtener postulación");
  return res.json();
};

/**
 * Obtener postulaciones de un usuario (aspirante)
 * @param {number} usuarioId - ID del aspirante
 */
export const getPostulacionesPorUsuario = async (usuarioId) => {
  const res = await fetch(`${API_URL}/usuario/${usuarioId}?usuarioIdActual=${usuarioId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Error al obtener postulaciones" }));
    throw new Error(errData.error || "Error al obtener postulaciones");
  }
  return res.json();
};

/**
 * Obtener postulaciones de una oferta (para reclutadores)
 * @param {number} ofertaId - ID de la oferta
 * @param {number} usuarioIdActual - ID del reclutador actual
 */
export const getPostulacionesPorOferta = async (ofertaId, usuarioIdActual) => {
  const res = await fetch(`${API_URL}/oferta/${ofertaId}?usuarioIdActual=${usuarioIdActual}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al obtener postulaciones de la oferta");
  return res.json();
};

/**
 * Verificar si un usuario ya se postuló a una oferta
 * @param {number} usuarioId - ID del aspirante
 * @param {number} ofertaId - ID de la oferta
 */
export const verificarYaPostulado = async (usuarioId, ofertaId) => {
  const res = await fetch(`${API_URL}/verificar?usuarioId=${usuarioId}&ofertaId=${ofertaId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al verificar postulación");
  return res.json();
};

// Alias para compatibilidad
export const verificarPostulacion = verificarYaPostulado;

/**
 * Cambiar estado de una postulación (solo reclutadores)
 * @param {number} postulacionId - ID de la postulación
 * @param {string} nuevoEstado - Nuevo estado (PENDIENTE, RECHAZADO, ACEPTADO, ENTREVISTA_PROGRAMADA)
 * @param {number} usuarioIdActual - ID del reclutador
 */
export const cambiarEstadoPostulacion = async (postulacionId, nuevoEstado, usuarioIdActual) => {
  const res = await fetch(`${API_URL}/${postulacionId}/estado?nuevoEstado=${nuevoEstado}&usuarioIdActual=${usuarioIdActual}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al cambiar estado de postulación");
  return res.json();
};

/**
 * Eliminar/Cancelar una postulación
 * @param {number} postulacionId - ID de la postulación
 * @param {number} usuarioIdActual - ID del usuario actual
 */
export const eliminarPostulacion = async (postulacionId, usuarioIdActual) => {
  const res = await fetch(`${API_URL}/${postulacionId}?usuarioIdActual=${usuarioIdActual}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al eliminar postulación");
};

/**
 * Obtener postulaciones por estado del usuario
 * @param {number} usuarioId - ID del aspirante
 * @param {string} estado - Estado de la postulación
 */
export const getPostulacionesPorUsuarioYEstado = async (usuarioId, estado) => {
  const res = await fetch(`${API_URL}/usuario/${usuarioId}/estado?estado=${estado}&usuarioIdActual=${usuarioId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al obtener postulaciones por estado");
  return res.json();
};
