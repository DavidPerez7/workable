import { api, getErrorMessage } from './config';
import type { LoginCredentials, LoginResponse, Aspirante, Reclutador } from '../types';

// Login
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Si es reclutador, obtener datos completos
    if (response.data.rol === 'RECLUTADOR') {
      try {
        const reclutadorResponse = await api.get(`/reclutador/por-correo?correo=${response.data.correo}`, {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });
        
        return {
          ...response.data,
          reclutadorId: reclutadorResponse.data.id,
          empresaId: reclutadorResponse.data.empresa?.id || null,
        };
      } catch (error) {
        console.warn('No se pudieron obtener datos completos del reclutador');
      }
    }
    
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Register Aspirante
export const registerAspirante = async (data: Aspirante): Promise<Aspirante> => {
  try {
    const response = await api.post<Aspirante>('/auth/register-aspirante', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Register Reclutador
export const registerReclutador = async (data: Reclutador): Promise<Reclutador> => {
  try {
    const response = await api.post<Reclutador>('/auth/register-reclutador', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Logout (client-side only)
export const logout = async (): Promise<void> => {
  // No hay endpoint de logout en el backend, solo limpiar token
  return Promise.resolve();
};

// Verify token
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    // Intentar obtener perfil según rol del token decodificado
    await api.get('/aspirante/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};
