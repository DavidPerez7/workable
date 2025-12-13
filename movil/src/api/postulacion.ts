import { api, getErrorMessage } from './config';
import type { Postulacion } from '../types';

// Create postulacion
export const createPostulacion = async (ofertaId: number): Promise<Postulacion> => {
  try {
    const response = await api.post<Postulacion>('/postulacion', { ofertaId });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get my postulaciones (aspirante)
export const getMyPostulaciones = async (): Promise<Postulacion[]> => {
  try {
    const response = await api.get<Postulacion[]>('/postulacion/aspirante');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get postulacion by ID
export const getPostulacionById = async (id: number): Promise<Postulacion> => {
  try {
    const response = await api.get<Postulacion>(`/postulacion/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get postulaciones by oferta
export const getPostulacionesByOferta = async (
  ofertaId: number,
  usuarioIdActual: number
): Promise<Postulacion[]> => {
  try {
    const response = await api.get<Postulacion[]>(
      `/postulacion/oferta/${ofertaId}?usuarioIdActual=${usuarioIdActual}`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get postulaciones by usuario
export const getPostulacionesByUsuario = async (
  usuarioId: number,
  usuarioIdActual: number
): Promise<Postulacion[]> => {
  try {
    const response = await api.get<Postulacion[]>(
      `/postulacion/usuario/${usuarioId}?usuarioIdActual=${usuarioIdActual}`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get postulaciones by oferta y estado
export const getPostulacionesByOfertaYEstado = async (
  ofertaId: number,
  estado: 'POSTULADO' | 'EN_REVISION' | 'ENTREVISTA' | 'RECHAZADO' | 'ACEPTADO',
  usuarioIdActual: number
): Promise<Postulacion[]> => {
  try {
    const response = await api.get<Postulacion[]>(
      `/postulacion/oferta/${ofertaId}/estado?estado=${estado}&usuarioIdActual=${usuarioIdActual}`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Change estado postulacion
export const changeEstadoPostulacion = async (
  id: number,
  nuevoEstado: 'POSTULADO' | 'EN_REVISION' | 'ENTREVISTA' | 'RECHAZADO' | 'ACEPTADO'
): Promise<Postulacion> => {
  try {
    const response = await api.put<Postulacion>(
      `/postulacion/${id}/cambiar-estado?nuevoEstado=${nuevoEstado}`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete postulacion
export const deletePostulacion = async (id: number): Promise<void> => {
  try {
    await api.delete(`/postulacion/${id}/eliminar`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all postulaciones (ADMIN)
export const getAllPostulaciones = async (): Promise<Postulacion[]> => {
  try {
    const response = await api.get<Postulacion[]>('/postulacion');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
