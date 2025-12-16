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
  descripcion?: string;
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
    fechaNacimiento?: string;
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
  tipoContrato?: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'TEMPORAL' | 'PRESTACION_SERVICIOS' | 'PRACTICAS';
  modalidad?: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  estado?: 'ABIERTA' | 'CERRADA' | 'PAUSADA';
  fechaPublicacion?: string;
  fechaCierre?: string;
  fechaLimite?: string;
  numeroVacantes?: number;
  nivelExperiencia?: 'SIN_EXPERIENCIA' | 'BASICO' | 'INTERMEDIO' | 'AVANZADO' | 'EXPERTO';
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

// Hoja de Vida types - Coincide con HojaVida.java del backend
export interface HojaVida {
  id?: number;
  resumenProfesional?: string;
  redSocial1?: string;
  contactoEmail?: string;
  telefono?: string;
  idiomas?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  aspirante?: Aspirante;
  estudios?: EstudioData[];
  experiencias?: ExperienciaData[];
}

// EstudioData - @Embeddable en backend
export interface EstudioData {
  titulo: string;
  institucion: string;
  nivelEducativo?: 'PRIMARIA' | 'BACHILLERATO' | 'TECNICO' | 'TECNOLOGO' | 'LICENCIATURA' | 'UNIVERSITARIO' | 'ESPECIALIZACION' | 'MAESTRIA' | 'DOCTORADO';
  fechaInicio: string;
  fechaFin?: string;
  enCurso?: boolean;
  modalidad?: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';
  descripcion?: string;
  certificadoUrl?: string;
}

// ExperienciaData - @Embeddable en backend
export interface ExperienciaData {
  cargo: string;
  empresa: string;
  fechaInicio: string;
  fechaFin?: string;
  municipio?: string;
  descripcion?: string;
  certificadoUrl?: string;
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
  HojaDeVidaTab: undefined;
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
  HojasDeVidaAdmin: undefined;
  AspiranteView: undefined;
  ReclutadorView: undefined;
  AspiranteHojaVida: { aspiranteId: number; aspiranteNombre: string };
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
