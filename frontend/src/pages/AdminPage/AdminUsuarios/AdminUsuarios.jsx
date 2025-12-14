import React, { useState, useEffect } from 'react';
import Sidebar from '../SideBar/Sidebar';
import Footer from '../../../components/Footer/footer';
import aspirantesApi from '../../../api/aspirantesApi';
import reclutadoresApi from '../../../api/reclutadoresApi';
import administradorAPI from '../../../api/administradorAPI';
import hojaDeVidaApi, { actualizarHojaDeVida as actualizarHojaDeVidaNamed } from '/src/api/hojaDeVidaAPI.js';
import API from '/src/api/axiosConfig.js';
import { obtenerEstudiosPorUsuario, crearEstudio, actualizarEstudio, eliminarEstudio } from '../../../api/estudioAPI';
import { obtenerExperienciasPorUsuario, crearExperiencia, actualizarExperiencia, eliminarExperiencia } from '../../../api/experienciaAPI';
import './AdminUsuarios.css';
import HojaDeVidaModal from './components/HojaDeVidaModal';
import UsersTable from './components/UsersTable';
import FiltersBar from './components/FiltersBar';
import StatsCards from './components/StatsCards';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroRol, setFiltroRol] = useState('aspirante');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear success messages after a short timeout
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 3500);
    return () => clearTimeout(t);
  }, [success]);
  const [showModal, setShowModal] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showHojaVidaModal, setShowHojaVidaModal] = useState(false);
  const [selectedHojaDeVida, setSelectedHojaDeVida] = useState(null);
  const [isEditingHojaVida, setIsEditingHojaVida] = useState(false);
  const [hojaVidaFormData, setHojaVidaFormData] = useState({
    resumenProfesional: '',
    objetivoProfesional: '',
    redSocial1: '',
    // redSocial2 replaced by contactoEmail (autocompletado desde Aspirante)
    idiomas: '',
    esPublica: false
  });
  // Estudios & Experiencias forms moved into HojaDeVidaModal to simplify the page state.
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    urlFotoPerfil: '',
    urlBanner: '',
    fechaNacimiento: '',
    genero: '',
    password: '',
    rol: 'ASPIRANTE'
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      let usuariosData = [];
      // Cargar aspirantes
      try {
        const aspirantes = await aspirantesApi.getAll();
        const aspirantesFormateados = aspirantes.map((a) => ({
          id: a.id,
          uniqueKey: `ASPIRANTE-${a.id}`,
          nombre: `${a.nombre} ${a.apellido || ''}`.trim(),
          correo: a.correo,
          telefono: a.telefono || 'N/A',
          estado: a.isActive ? 'Activo' : 'Inactivo',
          rol: 'ASPIRANTE',
          fechaRegistro: a.fechaCreacion?.split('T')[0] || 'N/A',
          fechaNacimiento: a.fechaNacimiento,
          municipio: a.municipio ? a.municipio.nombre : '-',
          genero: a.genero,
          descripcion: a.descripcion || '-',
          ubicacion: a.ubicacion || '-',
          urlFotoPerfil: a.urlFotoPerfil,
          originalData: a
        }));
        usuariosData = [...usuariosData, ...aspirantesFormateados];
      } catch (err) {
        console.error('Error cargando aspirantes:', err);
        const status = err?.response?.status;
        if (status === 401) {
          setError('No autorizado. Por favor inicia sesión como administrador para ver usuarios.');
        } else {
          setError(err?.response?.data?.error || err?.message || 'Error cargando aspirantes');
        }
      }

      // Cargar reclutadores
      try {
        const reclutadores = await reclutadoresApi.getAll();
        const reclutadoresFormateados = reclutadores.map((r) => ({
          id: r.id,
          uniqueKey: `RECLUTADOR-${r.id}`,
          nombre: `${r.nombre} ${r.apellido || ''}`.trim(),
          correo: r.correo,
          telefono: r.telefono || 'N/A',
          estado: r.isActive ? 'Activo' : 'Inactivo',
          rol: 'RECLUTADOR',
          fechaRegistro: r.fechaCreacion?.split('T')[0] || 'N/A',
          fechaNacimiento: r.fechaNacimiento,
          municipio: r.municipio ? r.municipio.nombre : '-',
          urlFotoPerfil: r.urlFotoPerfil,
          urlBanner: r.urlBanner,
          empresa: r.empresa ? r.empresa.nombre : '-',
          originalData: r
        }));
        usuariosData = [...usuariosData, ...reclutadoresFormateados];
      } catch (err) {
        console.error('Error cargando reclutadores:', err);
        const status = err?.response?.status;
        if (status === 401) {
          setError('No autorizado. Por favor inicia sesión como administrador para ver usuarios.');
        } else {
          setError(err?.response?.data?.error || err?.message || 'Error cargando reclutadores');
        }
      }

      // Cargar administradores
      try {
        const administradores = await administradorAPI.getAll();
        const administradoresFormateados = administradores.map((ad) => ({
          id: ad.id,
          uniqueKey: `ADMIN-${ad.id}`,
          nombre: `${ad.nombre} ${ad.apellido || ''}`.trim(),
          correo: ad.correo,
          telefono: ad.telefono || 'N/A',
          estado: ad.isActive ? 'Activo' : 'Inactivo',
          rol: 'ADMIN',
          fechaRegistro: ad.fechaCreacion?.split('T')[0] || 'N/A',
          fechaNacimiento: ad.fechaNacimiento,
          municipio: ad.municipio ? ad.municipio.nombre : '-',
          ultimoAcceso: ad.ultimoAcceso,
          originalData: ad
        }));
        usuariosData = [...usuariosData, ...administradoresFormateados];
      } catch (err) {
        console.error('Error cargando administradores:', err);
        const status = err?.response?.status;
        if (status === 401) {
          setError('No autorizado. Por favor inicia sesión como administrador para ver usuarios.');
        } else {
          setError(err?.response?.data?.error || err?.message || 'Error cargando administradores');
        }
      }

      setUsuarios(usuariosData);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Estudios handlers ---
  const handleDeleteEstudio = async (id) => {
    if (!confirm('¿Eliminar este estudio?')) return;
    try {
      await eliminarEstudio(id);
      const aspiranteId = selectedHojaDeVida?.aspirante?.id;
      if (aspiranteId) {
        const estudios = await obtenerEstudiosPorUsuario(aspiranteId);
        setSelectedHojaDeVida((prev) => ({ ...prev, estudios }));
      }
    } catch (e) {
      console.error(e);
      alert('Error al eliminar estudio: ' + e.message);
    }
  };

  const saveEstudio = async (payload, editingId = null) => {
    try {
      const aspiranteId = selectedHojaDeVida?.aspirante?.id;
      if (!aspiranteId) throw new Error('Aspirante no definido');
      const finalPayload = { ...payload, aspirante: { id: aspiranteId } };
      if (editingId) {
        await actualizarEstudio(editingId, finalPayload);
      } else {
        await crearEstudio(finalPayload);
      }
      const estudios = await obtenerEstudiosPorUsuario(aspiranteId);
      setSelectedHojaDeVida((prev) => ({ ...prev, estudios }));
      return estudios;
    } catch (e) {
      console.error('Error guardando estudio:', e);
      throw e;
    }
  };

  // --- Experiencias helpers ---
  const handleDeleteExperiencia = async (id) => {
    if (!confirm('¿Eliminar esta experiencia?')) return;
    try {
      await eliminarExperiencia(id);
      const aspiranteId = selectedHojaDeVida?.aspirante?.id;
      if (aspiranteId) {
        const experiencias = await obtenerExperienciasPorUsuario(aspiranteId);
        setSelectedHojaDeVida((prev) => ({ ...prev, experiencias }));
      }
    } catch (e) {
      console.error(e);
      alert('Error al eliminar experiencia: ' + e.message);
    }
  };

  const saveExperiencia = async (payload, editingId = null) => {
    try {
      const aspiranteId = selectedHojaDeVida?.aspirante?.id;
      if (!aspiranteId) throw new Error('Aspirante no definido');
      const finalPayload = { ...payload, aspirante: { id: aspiranteId } };
      if (editingId) {
        await actualizarExperiencia(editingId, finalPayload);
      } else {
        await crearExperiencia(finalPayload);
      }
      const experiencias = await obtenerExperienciasPorUsuario(aspiranteId);
      setSelectedHojaDeVida((prev) => ({ ...prev, experiencias }));
      return experiencias;
    } catch (e) {
      console.error('Error guardando experiencia:', e);
      throw e;
    }
  };

  const getColumns = () => {
    if (filtroRol === 'aspirante') {
      return ['Nombre', 'Correo', 'Teléfono', 'Fecha Nacimiento', 'Municipio', 'Género', 'Descripción', 'Ubicación', 'Foto Perfil', 'Hoja de Vida', 'Rol', 'Estado', 'Fecha Registro', 'Acciones'];
    } else if (filtroRol === 'reclutador') {
      return ['Nombre', 'Correo', 'Teléfono', 'Fecha Nacimiento', 'Municipio', 'Foto Perfil', 'Banner', 'Empresa', 'Rol', 'Estado', 'Fecha Registro', 'Acciones'];
    } else if (filtroRol === 'admin') {
      return ['Nombre', 'Correo', 'Teléfono', 'Fecha Nacimiento', 'Municipio', 'Último Acceso', 'Rol', 'Estado', 'Fecha Registro', 'Acciones'];
    }
    return [];
  };

  const getColumnValue = (usuario, column) => {
    switch (column) {
      case 'Nombre':
        return <td className="nombre-cell-UP" key={column}>{usuario.nombre}</td>;
      case 'Correo':
        return <td key={column}>{usuario.correo}</td>;
      case 'Teléfono':
        return <td key={column}>{usuario.telefono || '-'}</td>;
      case 'Fecha Nacimiento':
        return <td key={column}>{usuario.fechaNacimiento || '-'}</td>;
      case 'Municipio':
        return <td key={column}>{usuario.municipio}</td>;
      case 'Género':
        return <td key={column}>{usuario.genero ? usuario.genero.charAt(0).toUpperCase() + usuario.genero.slice(1).toLowerCase() : '-'}</td>;
      case 'Descripción':
        return <td key={column}>{usuario.descripcion || '-'}</td>;
      case 'Ubicación':
        return <td key={column}>{usuario.ubicacion || '-'}</td>;
      case 'Foto Perfil':
        return <td key={column}>{usuario.urlFotoPerfil ? <a href={usuario.urlFotoPerfil} target="_blank" rel="noopener noreferrer" style={{color: '#3B82F6', textDecoration: 'none'}}>Ver</a> : '-'}</td>;
      case 'Hoja de Vida':
        return <td key={column}><button className="btn-action-UP" onClick={() => handleVerHojaVida(usuario.id)} title="Ver Hoja de Vida">Ver</button></td>;
      case 'Banner':
        return <td key={column}>{usuario.urlBanner ? <a href={usuario.urlBanner} target="_blank" rel="noopener noreferrer" style={{color: '#3B82F6', textDecoration: 'none'}}>Ver</a> : '-'}</td>;
      case 'Empresa':
        return <td key={column}>{usuario.empresa || '-'}</td>;
      case 'Último Acceso':
        return <td key={column}>{usuario.ultimoAcceso || '-'}</td>;
      case 'Rol':
        return <td key={column}><span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{usuario.rol.toLowerCase()}</span></td>;
      case 'Estado':
        return <td key={column}><span className={`status-badge-UP ${usuario.estado === 'Activo' ? 'status-active-UP' : 'status-inactive-UP'}`}>{usuario.estado}</span></td>;
      case 'Fecha Registro':
        return <td key={column}>{usuario.fechaRegistro}</td>;
      case 'Acciones':
        return (
          <td key={column}>
            <div className="actions-UP">
              <button className="btn-action-UP btn-edit-UP" onClick={() => handleEditar(usuario.id, usuario.rol)} title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              {usuario.estado === 'Activo' ? (
                <button className="btn-action-UP btn-deactivate-UP" onClick={() => handleDesactivar(usuario.id, usuario.rol)} title="Desactivar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              ) : (
                <button className="btn-action-UP btn-activate-UP" onClick={() => handleActivar(usuario.id, usuario.rol)} title="Activar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              )}
              <button className="btn-action-UP btn-delete-UP" onClick={() => handleEliminar(usuario.id, usuario.rol)} title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </td>
        );
      default:
        return <td key={column}>-</td>;
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const cumpleEstado = filtroEstado === 'todos' || usuario.estado === (filtroEstado === 'activos' ? 'Activo' : 'Inactivo');
    const cumpleRol = filtroRol === 'todos' || usuario.rol.toLowerCase() === filtroRol.toLowerCase();
    const cumpleBusqueda =
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleEstado && cumpleRol && cumpleBusqueda;
  });

  const handleCrear = () => {
    setEditingUser(null);
    setError('');
    setSelectedRole(null);
    setShowRoleSelector(true);
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      urlFotoPerfil: '',
      urlBanner: '',
      fechaNacimiento: '',
      genero: '',
      password: '',
      rol: role
    });
    setShowRoleSelector(false);
    setShowModal(true);
  };

  const handleEditar = async (id, rol) => {
    try {
      // clear previous messages
      setError('');
      setSuccess('');
      // Try to reuse already-loaded user data to avoid extra API calls and race conditions
      const existing = usuarios.find((u) => u.id === id);
      let usuario = existing?.originalData || null;

      // If not present, fetch from API as fallback
      if (!usuario) {
        if (rol === 'ASPIRANTE') {
          usuario = await aspirantesApi.getPublic(id);
        } else if (rol === 'RECLUTADOR') {
          usuario = await reclutadoresApi.getPublic(id);
        } else if (rol === 'ADMIN') {
          usuario = await administradorAPI.get(id);
        }
      }

      if (!usuario) {
        setError('Usuario no encontrado');
        return;
      }

      // Normalize fechaNacimiento to yyyy-mm-dd if it's an ISO string
      let fechaNacimiento = '';
      if (usuario.fechaNacimiento) {
        if (typeof usuario.fechaNacimiento === 'string') {
          fechaNacimiento = usuario.fechaNacimiento.split('T')[0];
        } else {
          fechaNacimiento = String(usuario.fechaNacimiento);
        }
      }

      setEditingUser({ id, rol, data: usuario });
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        urlFotoPerfil: usuario.urlFotoPerfil || '',
        urlBanner: usuario.urlBanner || '',
        fechaNacimiento: fechaNacimiento,
        genero: usuario.genero || '',
        password: '',
        rol: rol,
        descripcion: usuario.descripcion || '',
        ubicacion: usuario.ubicacion || ''
      });
      setShowModal(true);
    } catch (err) {
      setError('Error al cargar usuario');
      console.error('handleEditar error:', err);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.correo) {
      setError('Nombre y correo son requeridos');
      return;
    }

    // Validaciones para nuevo usuario
    if (!editingUser) {
      if (!formData.password) {
        setError('Contraseña es requerida');
        return;
      }
      if (!formData.fechaNacimiento) {
        setError('Fecha de nacimiento es requerida');
        return;
      }
    }

    try {
      const updateData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono || null
      };

      if (editingUser) {
        // Actualizar usuario existente - incluir todos los campos disponibles
        const { id, rol } = editingUser;
        
        // Agregar fechaNacimiento si está disponible
        if (formData.fechaNacimiento) {
          updateData.fechaNacimiento = formData.fechaNacimiento;
        }
        
        // Campos específicos por rol
        if (rol === 'ASPIRANTE') {
          // Aspirante: puede tener genero y urlFotoPerfil
          if (formData.genero) {
            updateData.genero = formData.genero;
          }
          if (formData.urlFotoPerfil) {
            updateData.urlFotoPerfil = formData.urlFotoPerfil;
          }
          if (formData.descripcion) {
            updateData.descripcion = formData.descripcion;
          }
          if (formData.ubicacion) {
            updateData.ubicacion = formData.ubicacion;
          }
        } else if (rol === 'RECLUTADOR') {
          // Reclutador: puede tener urlFotoPerfil y urlBanner
          if (formData.urlFotoPerfil) {
            updateData.urlFotoPerfil = formData.urlFotoPerfil;
          }
          if (formData.urlBanner) {
            updateData.urlBanner = formData.urlBanner;
          }
        }
        // Administrador: solo campos básicos
        
        console.log('Actualizando usuario:', { id, rol, ...updateData });
        if (rol === 'ASPIRANTE') {
          await aspirantesApi.updateAdmin(id, updateData);
        } else if (rol === 'RECLUTADOR') {
          await reclutadoresApi.updateAdmin(id, updateData);
        } else if (rol === 'ADMIN') {
          await administradorAPI.update(id, updateData);
        }
        setSuccess('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        if (!formData.password) {
          setError('Contraseña es requerida');
          return;
        }
        if (!formData.fechaNacimiento) {
          setError('Fecha de nacimiento es requerida');
          return;
        }
        
        updateData.password = formData.password;
        updateData.fechaNacimiento = formData.fechaNacimiento;
        
        // Campos específicos por rol
        const rol = formData.rol;
        if (rol === 'ASPIRANTE') {
          // Aspirante: agregar genero y urlFotoPerfil
          updateData.genero = formData.genero;
          if (formData.urlFotoPerfil) {
            updateData.urlFotoPerfil = formData.urlFotoPerfil;
          }
          if (formData.descripcion) {
            updateData.descripcion = formData.descripcion;
          }
          if (formData.ubicacion) {
            updateData.ubicacion = formData.ubicacion;
          }
        } else if (rol === 'RECLUTADOR') {
          // Reclutador: agregar urlFotoPerfil y urlBanner
          if (formData.urlFotoPerfil) {
            updateData.urlFotoPerfil = formData.urlFotoPerfil;
          }
          if (formData.urlBanner) {
            updateData.urlBanner = formData.urlBanner;
          }
        }
        // Administrador: sin campos adicionales especiales
        
        console.log('Creando usuario nuevo:', { ...updateData, rol });
        let respuesta = null;
        if (rol === 'ASPIRANTE') {
          respuesta = await aspirantesApi.create(updateData);
        } else if (rol === 'RECLUTADOR') {
          respuesta = await reclutadoresApi.create(updateData);
        } else if (rol === 'ADMIN') {
          respuesta = await administradorAPI.create(updateData);
        }
        console.log('Respuesta de creación:', respuesta);
        setSuccess('Usuario creado correctamente');
      }
      
      setTimeout(() => {
        cargarUsuarios();
        handleCloseModal();
      }, 1000);
    } catch (err) {
      console.error('Error en handleGuardar:', err);
      setError(editingUser ? 'Error al actualizar usuario: ' + err.message : 'Error al crear usuario: ' + err.message);
      // Aún así, intentar recargar en 2 segundos en caso de que se haya guardado
      setTimeout(() => {
        cargarUsuarios();
      }, 2000);
    }
  };

  // Handle form input changes for create/edit user modal
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleActivar = async (id, rol) => {
    try {
      if (!window.confirm('¿Estás seguro de activar este usuario?')) return;
      if (rol === 'ASPIRANTE') {
        await aspirantesApi.activate(id);
      } else if (rol === 'RECLUTADOR') {
        const reclutador = await reclutadoresApi.get(id);
        await reclutadoresApi.updateAdmin(id, { ...reclutador, isActive: true });
      } else if (rol === 'ADMIN') {
        const admin = await administradorAPI.get(id);
        await administradorAPI.update(id, { ...admin, isActive: true });
      }
      setSuccess('Usuario activado correctamente');
      cargarUsuarios();
    } catch (err) {
      setError('Error al activar usuario');
      console.error(err);
    }
  };

  const handleDesactivar = async (id, rol) => {
    try {
      if (!window.confirm('¿Estás seguro de desactivar este usuario?')) return;
      if (rol === 'ASPIRANTE') {
        await aspirantesApi.deactivate(id);
      } else if (rol === 'RECLUTADOR') {
        const reclutador = await reclutadoresApi.get(id);
        await reclutadoresApi.updateAdmin(id, { ...reclutador, isActive: false });
      } else if (rol === 'ADMIN') {
        const admin = await administradorAPI.get(id);
        await administradorAPI.update(id, { ...admin, isActive: false });
      }
      setSuccess('Usuario desactivado correctamente');
      cargarUsuarios();
    } catch (err) {
      setError('Error al desactivar usuario');
      console.error(err);
    }
  };

  const handleEliminar = async (id, rol) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        if (rol === 'ASPIRANTE') {
          await aspirantesApi.delete(id);
        } else if (rol === 'RECLUTADOR') {
          // Use current admin id as the "reclutadorIdActual" parameter to avoid accidental permission issues
          const adminId = Number(localStorage.getItem('usuarioId')) || id;
          await reclutadoresApi.delete(id, adminId);
        } else if (rol === 'ADMIN') {
          await administradorAPI.delete(id);
        }
        setSuccess('Usuario eliminado correctamente');
        cargarUsuarios();
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          setError('Error al eliminar usuario: ' + err.response.data.error);
        } else {
          setError('Error al eliminar usuario');
        }
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowRoleSelector(false);
    setEditingUser(null);
    setSelectedRole(null);
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      urlFotoPerfil: '',
      urlBanner: '',
      fechaNacimiento: '',
      genero: '',
      password: '',
      rol: 'ASPIRANTE',
      descripcion: '',
      ubicacion: ''
    });
  };

  const handleVerHojaVida = async (aspiranteId) => {
    try {
      const hoja = await hojaDeVidaApi.getHojasDeVidaPorAspirante(aspiranteId);
      setSelectedHojaDeVida(hoja);
      try {
        const estudios = await obtenerEstudiosPorUsuario(aspiranteId);
        const experiencias = await obtenerExperienciasPorUsuario(aspiranteId);
        setSelectedHojaDeVida((prev) => ({ ...prev, estudios, experiencias }));
      } catch (e) {
        console.warn('No se pudieron cargar estudios/experiencias:', e);
      }
      setShowHojaVidaModal(true);
    } catch (err) {
      setError('Error al cargar hoja de vida');
      console.error(err);
    }
  };

  const handleHojaVidaInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHojaVidaFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditHojaVida = () => {
    if (selectedHojaDeVida) {
      setHojaVidaFormData({
        resumenProfesional: selectedHojaDeVida.resumenProfesional || '',
        objetivoProfesional: selectedHojaDeVida.objetivoProfesional || '',
        redSocial1: selectedHojaDeVida.redSocial1 || '',
        // salarioEsperado removed from backend model
        idiomas: selectedHojaDeVida.idiomas || '',
        esPublica: selectedHojaDeVida.esPublica || false
      });
      setIsEditingHojaVida(true);
    }
  };

  const handleSaveHojaVida = async () => {
    console.log('hojaDeVidaApi:', hojaDeVidaApi);
    console.log('selectedHojaDeVida:', selectedHojaDeVida);
    if (!selectedHojaDeVida) {
      setError('No hay hoja de vida seleccionada');
      return;
    }
    try {
      console.log('typeof actualizarHojaVida:', typeof hojaDeVidaApi.actualizarHojaVida);
      try {
        console.log('actualizarHojaDeVida.toString():', hojaDeVidaApi.actualizarHojaDeVida?.toString?.());
      } catch (e) {
        console.warn('Could not stringify actualizarHojaDeVida:', e);
      }

      // Sanity-check: try calling a read-only method to ensure API object is usable
      try {
        const sanity = await hojaDeVidaApi.getHojaDeVida(selectedHojaDeVida.id);
        console.log('sanity getHojaDeVida result:', sanity);
      } catch (e) {
        console.warn('sanity getHojaDeVida failed:', e);
      }

      // Try extracting the function to debug unexpected "not a function" errors
      const fn = hojaDeVidaApi.actualizarHojaVida;
      console.log('fn value:', fn, 'typeof:', typeof fn, 'isOwnProp:', Object.prototype.hasOwnProperty.call(hojaDeVidaApi, 'actualizarHojaDeVida'), 'keys:', Object.keys(hojaDeVidaApi));

      // Some module resolution issues can wrap the default export; try common fallbacks
      const resolvedFn = fn ?? actualizarHojaDeVidaNamed ?? hojaDeVidaApi.default?.actualizarHojaDeVida ?? hojaDeVidaApi?.default?.default?.actualizarHojaDeVida;
      console.log('resolvedFn:', resolvedFn, 'typeof resolvedFn:', typeof resolvedFn);

      let updatedHoja;
      if (typeof resolvedFn !== 'function') {
        console.warn('actualizarHojaVida is not callable - trying direct axios.PUT fallback', { fn, resolvedFn });
        const resp = await API.put(`/api/hoja-vida/${selectedHojaDeVida.id}`, hojaVidaFormData);
        updatedHoja = resp.data;
      } else {
        try {
          updatedHoja = await resolvedFn(selectedHojaDeVida.id, hojaVidaFormData);
        } catch (e) {
          console.warn('wrapper call failed, trying direct axios.PUT fallback', e);
          const resp = await API.put(`/api/hoja-vida/${selectedHojaDeVida.id}`, hojaVidaFormData);
          updatedHoja = resp.data;
        }
      }
      setSelectedHojaDeVida(updatedHoja);
      setIsEditingHojaVida(false);
      setError('');
    } catch (err) {
      setError('Error al actualizar hoja de vida');
      console.error(err);
    }
  };

  const handleDeleteHojaVida = async () => {
    if (!selectedHojaDeVida) {
      setError('No hay hoja de vida seleccionada');
      return;
    }
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta Hoja de Vida? Esta acción no se puede deshacer.');
    if (!confirmed) return;
    try {
      // Prefer named function if available, otherwise try default export method or direct axios fallback
      const fn = hojaDeVidaApi.eliminarHojaDeVida;
      let result;
      if (typeof fn === 'function') {
        result = await fn(selectedHojaDeVida.id);
      } else {
        // fallback
        await API.delete(`/api/hoja-vida/${selectedHojaDeVida.id}`);
      }
      // Close modal and clear selected
      setShowHojaVidaModal(false);
      setSelectedHojaDeVida(null);
      setError('Hoja de vida eliminada correctamente');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      console.error('Error eliminando hoja de vida:', err);
      setError('No se pudo eliminar la hoja de vida');
    }
  };

  const handleUpdateHojaDeVida = (updatedHoja) => {
    setSelectedHojaDeVida(updatedHoja);
    // Refresh user list so changes to contacto/telefono are reflected in the table
    cargarUsuarios();
  };

  const handleCancelEditHojaVida = () => {
    setIsEditingHojaVida(false);
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-users-manage-UP">
        <div className="container-users-manage-UP">
          <div className="header-section-UP">
            <div>
              <h1 className="title-users-UP">Gestionar Usuarios</h1>
              <p className="subtitle-users-UP">Administra todos los usuarios del sistema</p>
            </div>
            <button
              className="btn-create-UP"
              onClick={handleCrear}
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)'
              }}
            >
              + Crear Usuario
            </button>
          </div>

          <StatsCards usuarios={usuarios} />

          <FiltersBar
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            filtroRol={filtroRol}
            setFiltroRol={setFiltroRol}
          />

          {error && (
            <div style={{padding: '1.2rem 1.5rem', background: editingUser ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%)', color: editingUser ? '#3B82F6' : '#DC2626', borderRadius: '10px', borderLeft: '4px solid ' + (editingUser ? '#3B82F6' : '#DC2626'), fontWeight: '700', fontSize: '0.95em', letterSpacing: '0.3px', marginBottom: '1rem'}}>
              {error}
            </div>
          )}

          {success && (
            <div style={{padding: '1.2rem 1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)', color: '#059669', borderRadius: '10px', borderLeft: '4px solid #10B981', fontWeight: '700', fontSize: '0.95em', letterSpacing: '0.3px', marginBottom: '1rem'}}>
              {success}
            </div>
          )}

          {loading && (
            <div style={{padding: '1.2rem 1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)', color: '#3B82F6', borderRadius: '10px', borderLeft: '4px solid rgba(59, 130, 246, 0.5)', fontWeight: '700', fontSize: '0.95em', letterSpacing: '0.3px', marginBottom: '1rem'}}>
              Cargando usuarios...
            </div>
          )}

          <UsersTable
            columns={getColumns()}
            data={usuariosFiltrados}
            renderCell={(usuario, col) => getColumnValue(usuario, col)}
          />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay-UP" onClick={handleCloseModal}>
          <div className="modal-content-UP hoja-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-UP">
              <div className="title-wrap">
                <div className="accent-dot" aria-hidden="true" />
                <div>
                  <h2>{editingUser ? 'Editar Usuario' : `Crear ${selectedRole === 'ASPIRANTE' ? 'Aspirante' : selectedRole === 'RECLUTADOR' ? 'Reclutador' : 'Administrador'}`}</h2>
                  <div className="modal-subtitle">{editingUser ? 'Actualiza los datos del usuario' : 'Introduce los datos para crear un usuario'}</div>
                </div>
              </div>
              <button className="modal-close-UP" onClick={handleCloseModal} aria-label="Cerrar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {error && <div className="error-message-UP">{error}</div>}

            <form className="modal-form-UP" onSubmit={handleGuardar}>
              <div className="form-row-UP">
                <div className="form-group-UP">
                  <label>Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Ej: Juan" />
                </div>
                <div className="form-group-UP">
                  <label>Apellido</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Ej: Pérez" />
                </div>
              </div>

              <div className="form-group-UP">
                <label>Correo *</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} required placeholder="Ej: juan@example.com" />
              </div>

              <div className="form-group-UP">
                <label>Teléfono</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Ej: 3001234567" />
              </div>

              {formData.rol === 'ASPIRANTE' && (
                <>
                  <div className="form-group-UP">
                    <label>Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción del aspirante" rows="3" />
                  </div>
                  <div className="form-group-UP">
                    <label>Ubicación</label>
                    <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} placeholder="Ubicación" />
                  </div>
                </>
              )}

              {!editingUser && (
                <>
                  <div className="form-group-UP">
                    <label>Fecha de Nacimiento *</label>
                    <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} required />
                  </div>

                  {formData.rol === 'ASPIRANTE' && (
                    <>
                      <div className="form-group-UP">
                        <label>Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción del aspirante" rows="3" />
                      </div>
                      <div className="form-group-UP">
                        <label>Ubicación</label>
                        <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} placeholder="Ubicación" />
                      </div>
                    </>
                  )}

                  {(formData.rol === 'ASPIRANTE' || formData.rol === 'RECLUTADOR') && (
                    <div className="form-group-UP">
                      <label>URL Foto de Perfil</label>
                      <input type="text" name="urlFotoPerfil" value={formData.urlFotoPerfil} onChange={handleInputChange} placeholder="Ej: https://example.com/foto.jpg" />
                    </div>
                  )}

                  {formData.rol === 'RECLUTADOR' && (
                    <div className="form-group-UP">
                      <label>URL Banner</label>
                      <input type="text" name="urlBanner" value={formData.urlBanner} onChange={handleInputChange} placeholder="Ej: https://example.com/banner.jpg" />
                    </div>
                  )}

                  <div className="form-group-UP">
                    <label>Contraseña *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder="Mínimo 8 caracteres" />
                  </div>
                </>
              )}

              <div className="modal-buttons-UP">
                <button type="button" className="btn-cancel-UP" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="btn-submit-UP">{editingUser ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoleSelector && (
        <div className="modal-overlay-UP" onClick={handleCloseModal}>
          <div className="modal-content-UP" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-UP">
              <div className="title-wrap">
                <div className="accent-dot" aria-hidden="true" />
                <div>
                  <h2>Seleccionar Tipo de Usuario</h2>
                  <div className="modal-subtitle">Elige un rol para comenzar</div>
                </div>
              </div>
              <button className="modal-close-UP" onClick={handleCloseModal} aria-label="Cerrar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '2rem', color: '#666', fontSize: '0.95rem' }}>Selecciona el tipo de usuario que deseas crear:</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <button
                  onClick={() => handleSelectRole('ASPIRANTE')}
                  style={{
                    padding: '2rem 1rem',
                    border: '2px solid #3B82F6',
                    borderRadius: '12px',
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#3B82F6'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#3B82F6';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#3B82F6';
                  }}
                >
                  👤 Aspirante
                </button>

                <button
                  onClick={() => handleSelectRole('RECLUTADOR')}
                  style={{
                    padding: '2rem 1rem',
                    border: '2px solid #10B981',
                    borderRadius: '12px',
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#10B981'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#10B981';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#10B981';
                  }}
                >
                  🔍 Reclutador
                </button>
                {selectedHojaDeVida ? (
                  <div className="hdv-summary-mini" style={{gridColumn: '1 / -1', textAlign: 'left'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div>
                        <div style={{fontWeight:800}}>{(selectedHojaDeVida?.aspirante && `${selectedHojaDeVida.aspirante.nombre || ''} ${selectedHojaDeVida.aspirante.apellido || ''}`).trim() || 'Aspirante'}</div>
                        <div style={{color:'var(--text-secondary)'}}>Hoja ID: {selectedHojaDeVida.id} · {selectedHojaDeVida.fechaCreacion}</div>
                      </div>
                      <div style={{display:'flex', gap:'0.6rem'}}>
                        <button className="btn-small primary" onClick={() => setShowHojaVidaModal(true)}>Abrir Hoja</button>
                        <button className="btn-small ghost" onClick={() => setSelectedHojaDeVida(null)}>Cerrar</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{gridColumn: '1 / -1', color:'var(--text-secondary)'}}>No hay hoja seleccionada</div>
                )}
                </div>
            </div>
          </div>
        </div>
      )}

      {showHojaVidaModal && selectedHojaDeVida && (
        <HojaDeVidaModal
          show={showHojaVidaModal}
          onClose={() => setShowHojaVidaModal(false)}
          selectedHojaDeVida={selectedHojaDeVida}
          isEditing={isEditingHojaVida}
          hojaVidaFormData={hojaVidaFormData}
          onHojaVidaInputChange={handleHojaVidaInputChange}
          handleEditHojaVida={handleEditHojaVida}
          handleSaveHojaVida={handleSaveHojaVida}
          handleCancelEditHojaVida={handleCancelEditHojaVida}
          handleDeleteHojaVida={handleDeleteHojaVida}
          handleUpdateHojaDeVida={handleUpdateHojaDeVida}
          handleSaveEstudio={saveEstudio}
          handleDeleteEstudio={handleDeleteEstudio}
          handleSaveExperiencia={saveExperiencia}
          handleDeleteExperiencia={handleDeleteExperiencia}
        />
      )}
      <Footer />
    </div>
  );
}
