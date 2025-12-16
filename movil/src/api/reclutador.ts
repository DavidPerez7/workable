import { api, getErrorMessage } from './config';
import type { Reclutador } from '../types';

// Get my profile (JWT authenticated) - Backend NO tiene /me, usar /{id}
export const getMyProfile = async (userId: number): Promise<Reclutador> => {
  try {
    const response = await api.get<Reclutador>(`/api/reclutador/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all reclutadores (ADMIN)
export const getAllReclutadores = async (): Promise<Reclutador[]> => {
  try {
    const response = await api.get<Reclutador[]>('/api/reclutador');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get reclutador by ID
export const getReclutadorById = async (id: number): Promise<Reclutador> => {
  try {
    const response = await api.get<Reclutador>(`/api/reclutador/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get reclutador by correo
export const getReclutadorByCorreo = async (correo: string): Promise<Reclutador> => {
  try {
    const response = await api.get<Reclutador>(`/api/reclutador/por-correo?correo=${correo}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get reclutadores by empresa
export const getReclutadoresByEmpresa = async (empresaId: number): Promise<Reclutador[]> => {
  try {
    const response = await api.get<Reclutador[]>(`/api/reclutador/empresa/${empresaId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create reclutador
export const createReclutador = async (data: Reclutador): Promise<Reclutador> => {
  try {
    const response = await api.post<Reclutador>('/api/reclutador', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update reclutador - Backend solo tiene PUT /{id}
export const updateReclutador = async (id: number, data: Reclutador): Promise<Reclutador> => {
  try {
    const response = await api.put<Reclutador>(`/api/reclutador/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update reclutador con reclutadorIdActual (para validación en backend)
export const updateReclutadorWithActual = async (
  id: number,
  data: Partial<Reclutador>,
  reclutadorIdActual: number
): Promise<Reclutador> => {
  try {
    const response = await api.put<Reclutador>(
      `/api/reclutador/${id}?reclutadorIdActual=${reclutadorIdActual}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete reclutador (ADMIN)
export const deleteReclutador = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/reclutador/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
