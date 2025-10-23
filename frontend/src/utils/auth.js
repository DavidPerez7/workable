// auth.js - Helper de autenticación centralizado

/**
 * Guarda los datos de sesión del usuario tras login exitoso
 * @param {Object} loginData - Datos recibidos del backend tras login
 */
export const saveAuthSession = (loginData) => {
  console.log('💾 Guardando sesión con datos:', loginData);
  
  // Datos comunes para todos los usuarios
  localStorage.setItem('token', loginData.token);
  localStorage.setItem('role', loginData.role || 'ASPIRANTE');
  localStorage.setItem('userId', loginData.id);
  localStorage.setItem('nombre', loginData.nombre || '');
  localStorage.setItem('correo', loginData.correo || '');
  localStorage.setItem('telefono', loginData.telefono || '');

  // Datos específicos para ASPIRANTE (backward-compatible)
  if (loginData.role === 'ASPIRANTE' || !loginData.role) {
    localStorage.setItem('idAspirante', loginData.id);
    localStorage.setItem('apellido', loginData.apellido || '');
    localStorage.setItem('ubicacion', loginData.ubicacion || '');
    localStorage.setItem('fechaNacimiento', loginData.fechaNacimiento || '');
    localStorage.setItem('tipoDocumento', loginData.nombreTipDoc || '');
    localStorage.setItem('numeroDocumento', loginData.numeroDocumento || '');
    localStorage.setItem('nombreMunicipio', loginData.nombreMunicipio || '');
    localStorage.setItem('nombreGenero', loginData.nombreGenero || '');
  }

  // Datos específicos para RECLUTADOR
  if (loginData.role === 'RECLUTADOR') {
    console.log('📝 Guardando datos de RECLUTADOR. empresaId:', loginData.empresaId);
    localStorage.setItem('idReclutador', loginData.id);
    if (loginData.empresaId) {
      localStorage.setItem('empresaId', loginData.empresaId);
      // Guardar también como string para compatibilidad
      localStorage.setItem('empresa_id', loginData.empresaId);
      console.log('✅ empresaId guardado:', loginData.empresaId);
    } else {
      console.warn('⚠️ No se recibió empresaId en los datos de login');
    }
  }

  // Datos específicos para EMPRESA
  if (loginData.role === 'EMPRESA') {
    localStorage.setItem('idEmpresa', loginData.id);
    localStorage.setItem('empresaId', loginData.empresaId || loginData.id);
    localStorage.setItem('empresa_id', loginData.empresaId || loginData.id);
  }

  // Datos específicos para ADMINISTRADOR
  if (loginData.role === 'ADMIN' || loginData.role === 'ADMINISTRADOR') {
    localStorage.setItem('idAdmin', loginData.id);
  }
  
  console.log('✅ Sesión guardada. localStorage actual:', {
    role: localStorage.getItem('role'),
    empresaId: localStorage.getItem('empresaId'),
    empresa_id: localStorage.getItem('empresa_id')
  });
};

/**
 * Limpia todos los datos de sesión del localStorage
 */
export const clearAuthSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('idAspirante');
  localStorage.removeItem('idReclutador');
  localStorage.removeItem('idEmpresa');
  localStorage.removeItem('idAdmin');
  localStorage.removeItem('empresaId');
  localStorage.removeItem('empresa_id');
  localStorage.removeItem('nombre');
  localStorage.removeItem('apellido');
  localStorage.removeItem('correo');
  localStorage.removeItem('telefono');
  localStorage.removeItem('ubicacion');
  localStorage.removeItem('fechaNacimiento');
  localStorage.removeItem('tipoDocumento');
  localStorage.removeItem('numeroDocumento');
  localStorage.removeItem('nombreMunicipio');
  localStorage.removeItem('nombreGenero');
};

/**
 * Obtiene el token JWT del localStorage
 * @returns {string|null} Token JWT o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Obtiene el rol del usuario actual
 * @returns {string|null} Rol del usuario o null si no existe
 */
export const getRole = () => {
  return localStorage.getItem('role');
};

/**
 * Obtiene el ID del usuario actual
 * @returns {string|null} ID del usuario o null si no existe
 */
export const getUserId = () => {
  return localStorage.getItem('userId');
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si existe token, false en caso contrario
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Genera los headers de autenticación para las peticiones HTTP
 * @param {Object} additionalHeaders - Headers adicionales opcionales
 * @returns {Object} Headers con Authorization si existe token
 */
export const getAuthHeaders = (additionalHeaders = {}) => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...additionalHeaders,
  };
};

/**
 * Realiza login y guarda la sesión
 * @param {string} correo - Correo del usuario
 * @param {string} clave - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario autenticado
 * @throws {Error} Si las credenciales son inválidas
 */
export const login = async (correo, clave) => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, clave }),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  const data = await response.json();
  saveAuthSession(data);
  return data;
};

/**
 * Realiza logout y limpia la sesión
 */
export const logout = () => {
  clearAuthSession();
};

/**
 * Redirige al usuario según su rol
 * @param {Function} navigate - Función de navegación de react-router-dom
 * @param {string} role - Rol del usuario (opcional, se obtiene del localStorage si no se provee)
 */
export const redirectByRole = (navigate, role = null) => {
  const userRole = role || getRole();
  
  switch (userRole) {
    case 'RECLUTADOR':
      navigate('/Reclutador');
      break;
    case 'EMPRESA':
      navigate('/Reclutador'); // Las empresas van al panel de reclutador
      break;
    case 'ADMIN':
    case 'ADMINISTRADOR':
      navigate('/Admin');
      break;
    case 'ASPIRANTE':
    default:
      navigate('/Aspirante');
      break;
  }
};
