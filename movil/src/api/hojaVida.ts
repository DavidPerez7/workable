import { api, getErrorMessage } from './config';
import type { HojaVida, Estudio, Experiencia, Habilidad } from '../types';

// ===== Hoja de Vida =====
export const getHojaVidaByAspirante = async (aspiranteId: number): Promise<HojaVida> => {
  try {
    const response = await api.get<HojaVida>(`/hoja-vida/aspirante/${aspiranteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createOrUpdateHojaVida = async (data: HojaVida): Promise<HojaVida> => {
  try {
    const response = await api.post<HojaVida>('/hoja-vida', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// ===== Estudios =====
export const getEstudiosByAspirante = async (aspiranteId: number): Promise<Estudio[]> => {
  try {
    const response = await api.get<Estudio[]>(`/estudio/aspirante/${aspiranteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createEstudio = async (data: Estudio): Promise<Estudio> => {
  try {
    const response = await api.post<Estudio>('/estudio', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateEstudio = async (id: number, data: Estudio): Promise<Estudio> => {
  try {
    const response = await api.put<Estudio>(`/estudio/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteEstudio = async (id: number): Promise<void> => {
  try {
    await api.delete(`/estudio/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// ===== Experiencias =====
export const getExperienciasByAspirante = async (aspiranteId: number): Promise<Experiencia[]> => {
  try {
    const response = await api.get<Experiencia[]>(`/experiencia/aspirante/${aspiranteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createExperiencia = async (data: Experiencia): Promise<Experiencia> => {
  try {
    const response = await api.post<Experiencia>('/experiencia', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateExperiencia = async (id: number, data: Experiencia): Promise<Experiencia> => {
  try {
    const response = await api.put<Experiencia>(`/experiencia/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteExperiencia = async (id: number): Promise<void> => {
  try {
    await api.delete(`/experiencia/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// ===== Habilidades =====
export const getHabilidadesByAspirante = async (aspiranteId: number): Promise<Habilidad[]> => {
  try {
    const response = await api.get<Habilidad[]>(`/habilidad/aspirante/${aspiranteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createHabilidad = async (data: Habilidad): Promise<Habilidad> => {
  try {
    const response = await api.post<Habilidad>('/habilidad', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateHabilidad = async (id: number, data: Habilidad): Promise<Habilidad> => {
  try {
    const response = await api.put<Habilidad>(`/habilidad/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteHabilidad = async (id: number): Promise<void> => {
  try {
    await api.delete(`/habilidad/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
