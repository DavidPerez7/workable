// Types for authentication
export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuarioId: number;
  rol: 'ASPIRANTE' | 'RECLUTADOR' | 'ADMIN';
  correo: string;
  nombre: string;
  apellido?: string;
  reclutadorId?: number;
  empresaId?: number;
  empresa?: { id: number; nombre: string };
}

export interface User {
  token: string;
  usuarioId: number;
  rol: 'ASPIRANTE' | 'RECLUTADOR' | 'ADMIN';
  correo: string;
  nombre: string;
  apellido?: string;
  reclutadorId?: number;
  empresaId?: number;
  empresa?: { id: number; nombre?: string };
}

// Aspirante types
export interface Aspirante {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  genero?: string;
  estadoCivil?: string;
  documentoIdentidad?: string;
  tipoDocumento?: string;
  municipio?: Municipio;
}

// Reclutador types
export interface Reclutador {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  telefono?: string;
  cargo?: string;
  empresa?: Empresa;
}

// Empresa types
export interface Empresa {
  id?: number;
  nombre: string;
  nit?: string;
  direccion?: string;
  direcciones?: string[];
  telefono?: string;
  telefonoContacto?: string;
  correo?: string;
  emailContacto?: string;
  descripcion?: string;
  numeroTrabajadores?: number;
  sector?: string;
  tamano?: string;
  sitioWeb?: string;
  website?: string;
  municipio?: Municipio;
  isActive?: boolean;
  reclutadorOwner?: Reclutador;
}

// Oferta types
export interface Oferta {
  id?: number;
  titulo: string;
  descripcion: string;
  requisitos?: string;
  salario?: number;
  tipoContrato?: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'TEMPORAL' | 'FREELANCE' | 'PRACTICAS';
  modalidad?: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  estado?: 'ABIERTA' | 'CERRADA' | 'PAUSADA';
  fechaPublicacion?: string;
  fechaCierre?: string;
  vacantes?: number;
  experienciaRequerida?: number;
  nivelEducativo?: string;
  empresa?: Empresa;
  reclutador?: Reclutador;
  municipio?: Municipio;
}

// Postulacion types
export interface Postulacion {
  id?: number;
  fechaPostulacion?: string;
  estado?: 'POSTULADO' | 'EN_REVISION' | 'ENTREVISTA' | 'RECHAZADO' | 'ACEPTADO';
  comentarios?: string;
  aspirante?: Aspirante;
  oferta?: Oferta;
}

// Hoja de Vida types
export interface HojaVida {
  id?: number;
  resumen?: string;
  aspirante?: Aspirante;
  estudios?: Estudio[];
  experiencias?: Experiencia[];
  habilidades?: Habilidad[];
}

export interface Estudio {
  id?: number;
  institucion: string;
  titulo: string;
  nivel: string;
  fechaInicio?: string;
  fechaFin?: string;
  enCurso?: boolean;
  descripcion?: string;
  aspirante?: Aspirante;
}

export interface Experiencia {
  id?: number;
  empresa: string;
  cargo: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  actualmenteEmpleado?: boolean;
  aspirante?: Aspirante;
}

export interface Habilidad {
  id?: number;
  nombre: string;
  nivel?: 'BASICO' | 'INTERMEDIO' | 'AVANZADO' | 'EXPERTO';
  descripcion?: string;
  aspirante?: Aspirante;
}

// Municipio types
export interface Municipio {
  id?: number;
  nombre: string;
  departamento?: string;
}

// Notificacion types
export interface Notificacion {
  id?: number;
  mensaje: string;
  leida?: boolean;
  fecha?: string;
  tipo?: string;
  usuarioId?: number;
}

// API Error types
export interface ApiError {
  error?: string;
  message?: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  RegisterAspirante: undefined;
  RegisterReclutador: undefined;
  ForgotPassword: undefined;
};

export type AspiranteTabParamList = {
  OfertasTab: undefined;
  PostulacionesTab: undefined;
  PerfilTab: undefined;
};

export type ReclutadorTabParamList = {
  DashboardTab: undefined;
  MisOfertasTab: undefined;
  CrearOfertaTab: undefined;
  PerfilReclutadorTab: undefined;
};

export type AdminDrawerParamList = {
  DashboardAdmin: undefined;
  UsuariosAdmin: undefined;
  OfertasAdmin: undefined;
  PostulacionesAdmin: undefined;
  AspiranteView: undefined;
  ReclutadorView: undefined;
};

export type OfertasStackParamList = {
  OfertasList: undefined;
  OfertaDetail: { ofertaId: number };
};

export type PostulacionesStackParamList = {
  PostulacionesList: undefined;
  PostulacionDetail: { postulacionId: number };
};

export type MisOfertasStackParamList = {
  MisOfertasList: undefined;
  OfertaDetailReclutador: { ofertaId: number };
  EditarOferta: { ofertaId: number };
  PostulantesOferta: { ofertaId: number };
  PostulanteDetail: { postulacionId: number };
};
