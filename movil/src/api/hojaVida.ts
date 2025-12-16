import { api, getErrorMessage } from './config';
import type { HojaVida, Estudio, Experiencia, Habilidad } from '../types';

// ===== Hoja de Vida =====
export const getHojaVidaByAspirante = async (aspiranteId: number): Promise<HojaVida> => {
  try {
    const response = await api.get<HojaVida>(`/api/hoja-vida/aspirante/${aspiranteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createOrUpdateHojaVida = async (data: HojaVida): Promise<HojaVida> => {
  try {
    const response = await api.post<HojaVida>('/api/hoja-vida', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// ===== Estudios =====
// NOTA: Backend tiene problema de orden - /aspirante es capturado por /{id}
// Usar /usuario/{id} en su lugar
export const getEstudiosByAspirante = async (userId: number): Promise<Estudio[]> => {
  try {
    const response = await api.get<Estudio[]>(`/api/estudio/usuario/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getEstudiosByAspiranteId = async (aspiranteId: number): Promise<Estudio[]> => {
  try {
    const response = await api.get<Estudio[]>(`/api/estudio/usuario/${aspiranteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createEstudio = async (data: Estudio, aspiranteId?: number): Promise<Estudio> => {
  try {
    const url = aspiranteId ? `/api/estudio?aspiranteId=${aspiranteId}` : '/api/estudio';
    const response = await api.post<Estudio>(url, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateEstudio = async (id: number, data: Estudio): Promise<Estudio> => {
  try {
    const response = await api.put<Estudio>(`/api/estudio/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteEstudio = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/estudio/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// ===== Experiencias =====
// NOTA: Backend tiene problema de orden - /aspirante es capturado por /{id}
// Usar /usuario/{id} en su lugar
export const getExperienciasByAspirante = async (userId: number): Promise<Experiencia[]> => {
  try {
    const response = await api.get<Experiencia[]>(`/api/experiencia/usuario/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getExperienciasByAspiranteId = async (aspiranteId: number): Promise<Experiencia[]> => {
  try {
    const response = await api.get<Experiencia[]>(`/api/experiencia/usuario/${aspiranteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createExperiencia = async (data: Experiencia, aspiranteId?: number): Promise<Experiencia> => {
  try {
    const url = aspiranteId ? `/api/experiencia?aspiranteId=${aspiranteId}` : '/api/experiencia';
    const response = await api.post<Experiencia>(url, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateExperiencia = async (id: number, data: Experiencia): Promise<Experiencia> => {
  try {
    const response = await api.put<Experiencia>(`/api/experiencia/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteExperiencia = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/experiencia/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// ===== Habilidades =====
export const getHabilidadesByAspiranteId = async (aspiranteId: number): Promise<Habilidad[]> => {
  try {
    const response = await api.get<Habilidad[]>(`/api/habilidad/usuario/${aspiranteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// NOTA: Backend tiene problema de orden - /aspirante es capturado por /{id}
// Usar /usuario/{id} en su lugar
export const getHabilidadesByAspirante = async (userId: number): Promise<Habilidad[]> => {
  try {
    const response = await api.get<Habilidad[]>(`/api/habilidad/usuario/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createHabilidad = async (data: Habilidad, aspiranteId?: number): Promise<Habilidad> => {
  try {
    const url = aspiranteId ? `/api/habilidad?aspiranteId=${aspiranteId}` : '/api/habilidad';
    const response = await api.post<Habilidad>(url, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateHabilidad = async (id: number, data: Habilidad): Promise<Habilidad> => {
  try {
    const response = await api.put<Habilidad>(`/api/habilidad/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteHabilidad = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/habilidad/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
