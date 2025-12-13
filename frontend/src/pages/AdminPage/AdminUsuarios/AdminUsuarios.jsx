import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Footer from '../../../components/Footer/footer';
import aspirantesApi from '../../../api/aspirantesApi';
import reclutadoresApi from '../../../api/reclutadoresApi';
import administradorAPI from '../../../api/administradorAPI';
import './AdminUsuarios.css';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
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
          originalData: a
        }));
        usuariosData = [...usuariosData, ...aspirantesFormateados];
      } catch (err) {
        console.error('Error cargando aspirantes:', err);
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
          originalData: r
        }));
        usuariosData = [...usuariosData, ...reclutadoresFormateados];
      } catch (err) {
        console.error('Error cargando reclutadores:', err);
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
          originalData: ad
        }));
        usuariosData = [...usuariosData, ...administradoresFormateados];
      } catch (err) {
        console.error('Error cargando administradores:', err);
      }

      setUsuarios(usuariosData);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
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
      let usuario;
      if (rol === 'ASPIRANTE') {
        usuario = await aspirantesApi.getPublic(id);
      } else if (rol === 'RECLUTADOR') {
        usuario = await reclutadoresApi.getPublic(id);
      } else if (rol === 'ADMIN') {
        usuario = await administradorAPI.get(id);
      }

      setEditingUser({ id, rol, data: usuario });
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        urlFotoPerfil: usuario.urlFotoPerfil || '',
        urlBanner: usuario.urlBanner || '',
        fechaNacimiento: usuario.fechaNacimiento || '',
        genero: usuario.genero || '',
        password: '',
        rol: rol
      });
      setShowModal(true);
    } catch (err) {
      setError('Error al cargar usuario');
      console.error(err);
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
        setError('Usuario actualizado correctamente');
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
        setError('Usuario creado correctamente');
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

  const handleActivar = async (id, rol) => {
    try {
      if (rol === 'ASPIRANTE') {
        await aspirantesApi.activate(id);
      } else if (rol === 'RECLUTADOR') {
        const reclutador = await reclutadoresApi.get(id);
        await reclutadoresApi.updateAdmin(id, { ...reclutador, isActive: true });
      } else if (rol === 'ADMIN') {
        const admin = await administradorAPI.get(id);
        await administradorAPI.update(id, { ...admin, isActive: true });
      }
      cargarUsuarios();
    } catch (err) {
      setError('Error al activar usuario');
      console.error(err);
    }
  };

  const handleDesactivar = async (id, rol) => {
    try {
      if (rol === 'ASPIRANTE') {
        await aspirantesApi.deactivate(id);
      } else if (rol === 'RECLUTADOR') {
        const reclutador = await reclutadoresApi.get(id);
        await reclutadoresApi.updateAdmin(id, { ...reclutador, isActive: false });
      } else if (rol === 'ADMIN') {
        const admin = await administradorAPI.get(id);
        await administradorAPI.update(id, { ...admin, isActive: false });
      }
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
          await reclutadoresApi.delete(id, id); // reclutadorIdActual = id
        } else if (rol === 'ADMIN') {
          await administradorAPI.delete(id);
        }
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
      rol: 'ASPIRANTE'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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

          <div className="stats-section-UP">
            <div className="stat-card-UP stat-total-UP">
              <svg className="stat-icon-UP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <div className="stat-info-UP">
                <div className="stat-number-UP">{usuarios.length}</div>
                <div className="stat-label-UP">Total Usuarios</div>
              </div>
            </div>

            <div className="stat-card-UP stat-activos-UP">
              <svg className="stat-icon-UP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <div className="stat-info-UP">
                <div className="stat-number-UP">{usuarios.filter(u => u.estado === 'Activo').length}</div>
                <div className="stat-label-UP">Activos</div>
              </div>
            </div>

            <div className="stat-card-UP stat-inactivos-UP">
              <svg className="stat-icon-UP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div className="stat-info-UP">
                <div className="stat-number-UP">{usuarios.filter(u => u.estado === 'Inactivo').length}</div>
                <div className="stat-label-UP">Inactivos</div>
              </div>
            </div>
          </div>

          <div className="filters-section-UP">
            <div className="search-box-UP">
              <input
                type="text"
                className="search-input-UP"
                placeholder="Buscar por nombre o correo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="search-btn-UP">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>

            <div className="filter-buttons-UP">
              <button
                className={`filter-btn-UP ${filtroEstado === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('todos')}
              >
                Todos
              </button>
              <button
                className={`filter-btn-UP ${filtroEstado === 'activos' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('activos')}
              >
                Activos
              </button>
              <button
                className={`filter-btn-UP ${filtroEstado === 'inactivos' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('inactivos')}
              >
                Inactivos
              </button>
            </div>

            <div className="filter-buttons-UP">
              <button
                className={`filter-btn-UP ${filtroRol === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroRol('todos')}
              >
                Todos los Roles
              </button>
              <button
                className={`filter-btn-UP ${filtroRol === 'aspirante' ? 'active' : ''}`}
                onClick={() => setFiltroRol('aspirante')}
              >
                Aspirantes
              </button>
              <button
                className={`filter-btn-UP ${filtroRol === 'reclutador' ? 'active' : ''}`}
                onClick={() => setFiltroRol('reclutador')}
              >
                Reclutadores
              </button>
              <button
                className={`filter-btn-UP ${filtroRol === 'admin' ? 'active' : ''}`}
                onClick={() => setFiltroRol('admin')}
              >
                Administradores
              </button>
            </div>
          </div>

          {error && (
            <div style={{padding: '1.2rem 1.5rem', background: editingUser ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%)', color: editingUser ? '#3B82F6' : '#DC2626', borderRadius: '10px', borderLeft: '4px solid ' + (editingUser ? '#3B82F6' : '#DC2626'), fontWeight: '700', fontSize: '0.95em', letterSpacing: '0.3px', marginBottom: '1rem'}}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{padding: '1.2rem 1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)', color: '#3B82F6', borderRadius: '10px', borderLeft: '4px solid rgba(59, 130, 246, 0.5)', fontWeight: '700', fontSize: '0.95em', letterSpacing: '0.3px', marginBottom: '1rem'}}>
              Cargando usuarios...
            </div>
          )}

          <div className="table-container-UP">
            <table className="table-UP">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Fecha Nacimiento</th>
                  <th>Género</th>
                  <th>Foto Perfil</th>
                  <th>Banner</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.uniqueKey}>
                      <td className="nombre-cell-UP">{usuario.nombre}</td>
                      <td>{usuario.correo}</td>
                      <td>{usuario.telefono || '-'}</td>
                      <td>{usuario.fechaNacimiento || '-'}</td>
                      <td>{usuario.genero ? usuario.genero.charAt(0).toUpperCase() + usuario.genero.slice(1).toLowerCase() : '-'}</td>
                      <td>{usuario.urlFotoPerfil ? <a href={usuario.urlFotoPerfil} target="_blank" rel="noopener noreferrer" style={{color: '#3B82F6', textDecoration: 'none'}}>Ver</a> : '-'}</td>
                      <td>{usuario.urlBanner ? <a href={usuario.urlBanner} target="_blank" rel="noopener noreferrer" style={{color: '#3B82F6', textDecoration: 'none'}}>Ver</a> : '-'}</td>
                      <td><span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{usuario.rol.toLowerCase()}</span></td>
                      <td><span className={`status-badge-UP ${usuario.estado === 'Activo' ? 'status-active-UP' : 'status-inactive-UP'}`}>{usuario.estado}</span></td>
                      <td>{usuario.fechaRegistro}</td>
                      <td>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="no-results-UP">No hay usuarios que coincidan con los filtros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay-UP" onClick={handleCloseModal}>
          <div className="modal-content-UP" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-UP">
              <h2>{editingUser ? 'Editar Usuario' : `Crear ${selectedRole === 'ASPIRANTE' ? 'Aspirante' : selectedRole === 'RECLUTADOR' ? 'Reclutador' : 'Administrador'}`}</h2>
              <button className="modal-close-UP" onClick={handleCloseModal}>
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

              {!editingUser && (
                <>
                  <div className="form-group-UP">
                    <label>Fecha de Nacimiento *</label>
                    <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} required />
                  </div>

                  {formData.rol === 'ASPIRANTE' && (
                    <div className="form-group-UP">
                      <label>Género *</label>
                      <select name="genero" value={formData.genero} onChange={handleInputChange} required>
                        <option value="">Seleccionar género</option>
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMENINO">Femenino</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>
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
              <h2>Seleccionar Tipo de Usuario</h2>
              <button className="modal-close-UP" onClick={handleCloseModal}>
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

                <button
                  onClick={() => handleSelectRole('ADMIN')}
                  style={{
                    padding: '2rem 1rem',
                    border: '2px solid #F59E0B',
                    borderRadius: '12px',
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#F59E0B'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#F59E0B';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#F59E0B';
                  }}
                >
                  ⚙️ Administrador
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
