import { api, getErrorMessage } from './config';
import type { Postulacion } from '../types';

// Create postulacion
export const createPostulacion = async (
  ofertaId: number,
  aspiranteId: number
): Promise<Postulacion> => {
  try {
    const payload = {
      aspirante: { id: aspiranteId },
      oferta: { id: ofertaId },
    };

    const response = await api.post<Postulacion>('/api/postulacion', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get my postulaciones (aspirante)
export const getMyPostulaciones = async (): Promise<Postulacion[]> => {
  try {
    const response = await api.get<Postulacion[]>('/api/postulacion/aspirante');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get postulacion by ID
export const getPostulacionById = async (id: number): Promise<Postulacion> => {
  try {
    const response = await api.get<Postulacion>(`/api/postulacion/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get postulaciones by oferta
export const getPostulacionesByOferta = async (
  ofertaId: number
): Promise<Postulacion[]> => {
  try {
    const response = await api.get<Postulacion[]>(
      `/api/postulacion/oferta/${ofertaId}`
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
    const response = await api.put<Postulacion>(`/api/postulacion/${id}`, { estado: nuevoEstado });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update postulacion (estado + comentarios)
export const updatePostulacion = async (
  id: number,
  data: Partial<Postulacion>
): Promise<Postulacion> => {
  try {
    const response = await api.put<Postulacion>(`/api/postulacion/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete postulacion
export const deletePostulacion = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/postulacion/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all postulaciones (ADMIN)
export const getAllPostulaciones = async (): Promise<Postulacion[]> => {
  try {
    const response = await api.get<Postulacion[]>('/api/postulacion/all');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
