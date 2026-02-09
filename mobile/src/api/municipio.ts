import { api, getErrorMessage } from './config';
import type { Municipio } from '../types';

// Get all municipios
export const getAllMunicipios = async (): Promise<Municipio[]> => {
  try {
    const response = await api.get<Municipio[]>('/municipio');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get municipio by ID
export const getMunicipioById = async (id: number): Promise<Municipio> => {
  try {
    const response = await api.get<Municipio>(`/municipio/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Search municipios
export const searchMunicipios = async (nombre: string): Promise<Municipio[]> => {
  try {
    const response = await api.get<Municipio[]>(`/municipio/buscar?nombre=${encodeURIComponent(nombre)}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
