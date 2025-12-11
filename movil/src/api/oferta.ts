import { api, getErrorMessage } from './config';
import type { Oferta } from '../types';

// Get all ofertas
export const getAllOfertas = async (): Promise<Oferta[]> => {
  try {
    const response = await api.get<Oferta[]>('/oferta');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get ofertas abiertas
export const getOfertasAbiertas = async (): Promise<Oferta[]> => {
  try {
    const response = await api.get<Oferta[]>('/oferta/abiertas');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get oferta by ID
export const getOfertaById = async (id: number): Promise<Oferta> => {
  try {
    const response = await api.get<Oferta>(`/oferta/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get ofertas by empresa
export const getOfertasByEmpresa = async (empresaId: number): Promise<Oferta[]> => {
  try {
    const response = await api.get<Oferta[]>(`/oferta/empresa/${empresaId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get ofertas by reclutador
export const getOfertasByReclutador = async (reclutadorId: number): Promise<Oferta[]> => {
  try {
    const response = await api.get<Oferta[]>(`/oferta/reclutador/${reclutadorId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Search ofertas
export const searchOfertas = async (texto: string): Promise<Oferta[]> => {
  try {
    const response = await api.get<Oferta[]>(`/oferta/buscar?texto=${encodeURIComponent(texto)}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create oferta
export const createOferta = async (data: Oferta): Promise<Oferta> => {
  try {
    const response = await api.post<Oferta>('/oferta', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update oferta
export const updateOferta = async (id: number, data: Oferta): Promise<Oferta> => {
  try {
    const response = await api.put<Oferta>(`/oferta/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete oferta
export const deleteOferta = async (id: number): Promise<void> => {
  try {
    await api.delete(`/oferta/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Change estado oferta
export const changeEstadoOferta = async (
  id: number,
  estado: 'ABIERTA' | 'CERRADA' | 'PAUSADA'
): Promise<Oferta> => {
  try {
    const response = await api.patch<Oferta>(`/oferta/${id}/estado?estado=${estado}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get ofertas by estado
export const getOfertasByEstado = async (
  estado: 'ABIERTA' | 'CERRADA' | 'PAUSADA'
): Promise<Oferta[]> => {
  try {
    const response = await api.get<Oferta[]>(`/oferta/estado?estado=${estado}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get ofertas by modalidad
export const getOfertasByModalidad = async (
  modalidad: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO'
): Promise<Oferta[]> => {
  try {
    const response = await api.get<Oferta[]>(`/oferta/modalidad?modalidad=${modalidad}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
