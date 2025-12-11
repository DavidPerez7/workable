import { api, getErrorMessage } from './config';
import type { Reclutador } from '../types';

// Get my profile (JWT authenticated)
export const getMyProfile = async (): Promise<Reclutador> => {
  try {
    const response = await api.get<Reclutador>('/reclutador/me');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all reclutadores (ADMIN)
export const getAllReclutadores = async (): Promise<Reclutador[]> => {
  try {
    const response = await api.get<Reclutador[]>('/reclutador');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get reclutador by ID
export const getReclutadorById = async (id: number): Promise<Reclutador> => {
  try {
    const response = await api.get<Reclutador>(`/reclutador/public/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get reclutador by correo
export const getReclutadorByCorreo = async (correo: string): Promise<Reclutador> => {
  try {
    const response = await api.get<Reclutador>(`/reclutador/correo/${correo}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get reclutadores by empresa
export const getReclutadoresByEmpresa = async (empresaId: number): Promise<Reclutador[]> => {
  try {
    const response = await api.get<Reclutador[]>(`/reclutador/empresa/${empresaId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create reclutador
export const createReclutador = async (data: Reclutador): Promise<Reclutador> => {
  try {
    const response = await api.post<Reclutador>('/reclutador', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update reclutador
export const updateReclutador = async (id: number, data: Reclutador): Promise<Reclutador> => {
  try {
    const response = await api.put<Reclutador>(`/reclutador/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete reclutador (ADMIN)
export const deleteReclutador = async (id: number): Promise<void> => {
  try {
    await api.delete(`/reclutador/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
