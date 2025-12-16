import { api, getErrorMessage, setAuthToken } from './config';
import { getMyProfile } from './reclutador';
import type { LoginCredentials, LoginResponse, Aspirante, Reclutador } from '../types';

// Login
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    
    console.log('Login response:', JSON.stringify(response.data, null, 2));
    
    // Hidratación para reclutador: si no trae empresa, consultamos perfil
    if (response.data.rol === 'RECLUTADOR') {
      let empresaId = response.data.empresa?.id || null;
      let empresa = response.data.empresa;

      if (!empresaId) {
        try {
          setAuthToken(response.data.token);
          const perfil = await getMyProfile();
          empresaId = perfil.empresa?.id || null;
          empresa = perfil.empresa;
        } catch (perfilErr) {
          console.warn('No se pudo hidratar empresa en login:', perfilErr);
        }
      }

      return {
        ...response.data,
        reclutadorId: response.data.usuarioId, // El usuarioId ES el reclutadorId
        empresaId,
        empresa,
      };
    }
    
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Register Aspirante
export const registerAspirante = async (data: Aspirante): Promise<Aspirante> => {
  try {
    const response = await api.post<Aspirante>('/api/auth/register-aspirante', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Register Reclutador
export const registerReclutador = async (data: Reclutador): Promise<Reclutador> => {
  try {
    const response = await api.post<Reclutador>('/api/auth/register-reclutador', data);
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

// Verify token - simplemente intenta una llamada autenticada
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    // Intentar obtener un endpoint público que requiera autenticación
    await api.get('/api/aspirante', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};
