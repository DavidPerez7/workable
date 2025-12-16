import { api, getErrorMessage } from './config';
import type { Aspirante } from '../types';

// Get my profile (JWT authenticated) - Backend NO tiene endpoint /me para aspirante
// Usar el ID del usuario actual desde el contexto
export const getMyProfile = async (userId: number): Promise<Aspirante> => {
  try {
    const response = await api.get<Aspirante>(`/api/aspirante/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update my profile - Backend solo tiene PUT /{id}
export const updateMyProfile = async (userId: number, data: Aspirante): Promise<Aspirante> => {
  try {
    const response = await api.put<Aspirante>(`/api/aspirante/${userId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update aspirante by ID (ADMIN) - Backend solo tiene PUT /{id}
export const updateAspirante = async (id: number, data: Partial<Aspirante>): Promise<Aspirante> => {
  try {
    const response = await api.put<Aspirante>(`/api/aspirante/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all aspirantes (ADMIN)
export const getAllAspirantes = async (): Promise<Aspirante[]> => {
  try {
    const response = await api.get<Aspirante[]>('/api/aspirante');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get aspirante by ID
export const getAspiranteById = async (id: number): Promise<Aspirante> => {
  try {
    const response = await api.get<Aspirante>(`/api/aspirante/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get aspirante by correo
export const getAspiranteByCorreo = async (correo: string): Promise<Aspirante> => {
  try {
    const response = await api.get<Aspirante>(`/api/aspirante/correo?correo=${correo}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create aspirante (ADMIN)
export const createAspirante = async (data: Aspirante): Promise<Aspirante> => {
  try {
    const response = await api.post<Aspirante>('/api/aspirante', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete aspirante (ADMIN)
export const deleteAspirante = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/aspirante/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
