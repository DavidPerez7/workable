import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginApi, logout as logoutApi } from '../api/auth';
import { setAuthToken } from '../api/config';
import { getMyProfile } from '../api/reclutador';
import type { User, LoginCredentials } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'workable_token';
const USER_KEY = 'workable_user';

// Clave de empresa cacheada por correo
// Expo SecureStore exige claves alfanuméricas y solo permite ".", "-", "_".
// Sanitizamos el correo para cumplir las reglas (p.ej. reemplazar "@" y otros por "_").
const normalizeKey = (raw: string) => {
  const lower = (raw || '').toLowerCase();
  const safe = lower.replace(/[^a-z0-9._-]/g, '_');
  return safe.length > 0 ? safe : 'unknown';
};
const empresaCacheKey = (correo: string) => `workable_empresa_${normalizeKey(correo)}`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const hydrateEmpresaFromCache = async (correo: string) => {
    try {
      const cached = await SecureStore.getItemAsync(empresaCacheKey(correo));
      if (cached) return JSON.parse(cached);
    } catch (err) {
      console.warn('No se pudo leer empresa cacheada:', err);
    }
    return null;
  };

  const persistUser = async (data: User) => {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data));
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
  };

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);

      if (token && userJson) {
        let userData: User = JSON.parse(userJson);

        // Forzar re-login para ADMIN al reiniciar la app
        if (userData.rol === 'ADMIN') {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(USER_KEY);
          setAuthToken(null);
          setUser(null);
          return;
        }

        setAuthToken(token);

        // Si es reclutador y sigue sin empresa, hidratar
        if (userData.rol === 'RECLUTADOR' && !userData.empresaId) {
          try {
            const perfil = await getMyProfile();
            const perfilEmpresaId = perfil.empresa?.id || null;
            const perfilEmpresa = perfil.empresa || undefined;

            if (perfilEmpresaId) {
              userData = { ...userData, empresaId: perfilEmpresaId, empresa: perfilEmpresa };
              await persistUser(userData);
            } else {
              const cached = await hydrateEmpresaFromCache(userData.correo);
              if (cached?.id) {
                userData = { ...userData, empresaId: cached.id, empresa: cached };
                await persistUser(userData);
              }
            }
          } catch (perfilErr) {
            console.warn('No se pudo hidratar empresa al cargar usuario:', perfilErr);
          }
        }

        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await loginApi(credentials);
      // Set token early to allow follow-up requests (perfil)
      setAuthToken(response.token);

      let empresaId = response.empresaId || response.empresa?.id || null;
      let empresa = response.empresa || null;

      // Si es reclutador, SIEMPRE llamamos a /me para obtener empresa actualizada
      if (response.rol === 'RECLUTADOR') {
        try {
          const perfil = await getMyProfile();
          if (perfil && perfil.empresa) {
            empresaId = perfil.empresa.id || empresaId;
            empresa = perfil.empresa;
            // Cache empresa para futuras sesiones
            await SecureStore.setItemAsync(
              empresaCacheKey(response.correo),
              JSON.stringify(perfil.empresa)
            );
          }
        } catch (perfilErr) {
          console.error('Error obteniendo perfil de reclutador:', perfilErr);
          // Intentar recuperar empresa cacheada como fallback
          const cached = await hydrateEmpresaFromCache(response.correo);
          if (cached?.id && !empresaId) {
            empresaId = cached.id;
            empresa = cached;
          }
        }
      }
      
      const userData: User = {
        token: response.token,
        usuarioId: response.usuarioId,
        rol: response.rol,
        correo: response.correo,
        nombre: response.nombre,
        apellido: response.apellido,
        reclutadorId: response.rol === 'RECLUTADOR' ? response.usuarioId : response.reclutadorId,
        empresaId,
        empresa,
      };

      // Save to SecureStore
      await persistUser(userData);

      // Update state
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      
      // Clear SecureStore
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

      // Clear state
      setUser(null);
      setAuthToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      persistUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
