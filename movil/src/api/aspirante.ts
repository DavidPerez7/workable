import { api, getErrorMessage } from './config';
import type { Aspirante } from '../types';

// Get my profile (JWT authenticated)
export const getMyProfile = async (): Promise<Aspirante> => {
  try {
    const response = await api.get<Aspirante>('/aspirante/me');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update my profile
export const updateMyProfile = async (data: Aspirante): Promise<Aspirante> => {
  try {
    const response = await api.put<Aspirante>('/aspirante/actualizar', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update aspirante by ID (ADMIN)
export const updateAspirante = async (id: number, data: Partial<Aspirante>): Promise<Aspirante> => {
  try {
    const response = await api.put<Aspirante>(`/aspirante/${id}/admin`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all aspirantes (ADMIN)
export const getAllAspirantes = async (): Promise<Aspirante[]> => {
  try {
    const response = await api.get<Aspirante[]>('/aspirante');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get aspirante by ID
export const getAspiranteById = async (id: number): Promise<Aspirante> => {
  try {
    const response = await api.get<Aspirante>(`/aspirante/public/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get aspirante by correo
export const getAspiranteByCorreo = async (correo: string): Promise<Aspirante> => {
  try {
    const response = await api.get<Aspirante>(`/aspirante/correo?correo=${correo}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create aspirante (ADMIN)
export const createAspirante = async (data: Aspirante): Promise<Aspirante> => {
  try {
    const response = await api.post<Aspirante>('/aspirante', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete aspirante (ADMIN)
export const deleteAspirante = async (id: number): Promise<void> => {
  try {
    await api.delete(`/aspirante/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
