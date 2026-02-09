import { api, getErrorMessage } from './config';
import type { HojaVida, EstudioData, ExperienciaData } from '../types';

// ===== Hoja de Vida =====

// Obtener hoja de vida por aspiranteId (crea una nueva si no existe)
export const getHojaVidaByAspirante = async (aspiranteId: number): Promise<HojaVida> => {
  try {
    const response = await api.get<HojaVida>(`/api/hoja-vida/aspirante/${aspiranteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Obtener hoja de vida por ID
export const getHojaVidaById = async (id: number): Promise<HojaVida> => {
  try {
    const response = await api.get<HojaVida>(`/api/hoja-vida/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Crear hoja de vida
export const createHojaVida = async (data: HojaVida): Promise<HojaVida> => {
  try {
    const response = await api.post<HojaVida>('/api/hoja-vida', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Actualizar hoja de vida completa (incluye estudios y experiencias embebidos)
export const updateHojaVida = async (id: number, data: Partial<HojaVida>): Promise<HojaVida> => {
  try {
    const response = await api.put<HojaVida>(`/api/hoja-vida/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Eliminar hoja de vida
export const deleteHojaVida = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/hoja-vida/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// ===== Estudios (embebidos en HojaVida) =====
// Los estudios se manejan como parte de la HojaVida

export const addEstudio = async (hojaVidaId: number, estudio: EstudioData): Promise<HojaVida> => {
  try {
    const hojaVida = await getHojaVidaById(hojaVidaId);
    const estudiosActuales = hojaVida.estudios || [];
    const nuevosEstudios = [...estudiosActuales, estudio];
    return await updateHojaVida(hojaVidaId, { estudios: nuevosEstudios });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateEstudioByIndex = async (
  hojaVidaId: number, 
  estudioIndex: number, 
  estudio: EstudioData
): Promise<HojaVida> => {
  try {
    const hojaVida = await getHojaVidaById(hojaVidaId);
    const estudiosActuales = [...(hojaVida.estudios || [])];
    
    if (estudioIndex < 0 || estudioIndex >= estudiosActuales.length) {
      throw new Error('Índice de estudio inválido');
    }
    
    estudiosActuales[estudioIndex] = estudio;
    return await updateHojaVida(hojaVidaId, { estudios: estudiosActuales });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteEstudioByIndex = async (hojaVidaId: number, estudioIndex: number): Promise<HojaVida> => {
  try {
    const hojaVida = await getHojaVidaById(hojaVidaId);
    const estudiosActuales = [...(hojaVida.estudios || [])];
    
    if (estudioIndex < 0 || estudioIndex >= estudiosActuales.length) {
      throw new Error('Índice de estudio inválido');
    }
    
    estudiosActuales.splice(estudioIndex, 1);
    return await updateHojaVida(hojaVidaId, { estudios: estudiosActuales });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// ===== Experiencias (embebidas en HojaVida) =====

export const addExperiencia = async (hojaVidaId: number, experiencia: ExperienciaData): Promise<HojaVida> => {
  try {
    const hojaVida = await getHojaVidaById(hojaVidaId);
    const experienciasActuales = hojaVida.experiencias || [];
    const nuevasExperiencias = [...experienciasActuales, experiencia];
    return await updateHojaVida(hojaVidaId, { experiencias: nuevasExperiencias });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateExperienciaByIndex = async (
  hojaVidaId: number, 
  experienciaIndex: number, 
  experiencia: ExperienciaData
): Promise<HojaVida> => {
  try {
    const hojaVida = await getHojaVidaById(hojaVidaId);
    const experienciasActuales = [...(hojaVida.experiencias || [])];
    
    if (experienciaIndex < 0 || experienciaIndex >= experienciasActuales.length) {
      throw new Error('Índice de experiencia inválido');
    }
    
    experienciasActuales[experienciaIndex] = experiencia;
    return await updateHojaVida(hojaVidaId, { experiencias: experienciasActuales });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteExperienciaByIndex = async (hojaVidaId: number, experienciaIndex: number): Promise<HojaVida> => {
  try {
    const hojaVida = await getHojaVidaById(hojaVidaId);
    const experienciasActuales = [...(hojaVida.experiencias || [])];
    
    if (experienciaIndex < 0 || experienciaIndex >= experienciasActuales.length) {
      throw new Error('Índice de experiencia inválido');
    }
    
    experienciasActuales.splice(experienciaIndex, 1);
    return await updateHojaVida(hojaVidaId, { experiencias: experienciasActuales });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Obtener todas las hojas de vida (admin)
export const getAllHojasVida = async (): Promise<HojaVida[]> => {
  try {
    const response = await api.get<HojaVida[]>('/api/hoja-vida');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
