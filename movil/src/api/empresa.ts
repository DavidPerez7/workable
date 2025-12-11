import { api, getErrorMessage } from './config';
import type { Empresa } from '../types';

// Get all empresas
export const getAllEmpresas = async (): Promise<Empresa[]> => {
  try {
    const response = await api.get<Empresa[]>('/empresa');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get empresa by ID
export const getEmpresaById = async (id: number): Promise<Empresa> => {
  try {
    const response = await api.get<Empresa>(`/empresa/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create empresa
export const createEmpresa = async (data: Empresa): Promise<Empresa> => {
  try {
    const response = await api.post<Empresa>('/empresa', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update empresa
export const updateEmpresa = async (id: number, data: Empresa): Promise<Empresa> => {
  try {
    const response = await api.put<Empresa>(`/empresa/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete empresa
export const deleteEmpresa = async (id: number): Promise<void> => {
  try {
    await api.delete(`/empresa/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
