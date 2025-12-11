import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Footer from '../../../components/Footer/footer';
import userAPI from '../../../api/usuarioAPI';
import './AdminUsuarios.css';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    numeroDocumento: '',
    tipoDocumento: 'CC',
    rol: 'ASPIRANTE'
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userAPI.getAll();
      const usuariosData = data.map((u) => ({
        id: u.id,
        nombre: `${u.nombre} ${u.apellido || ''}`.trim(),
        correo: u.correo,
        telefono: u.telefono || 'N/A',
        documento: u.numeroDocumento || 'N/A',
        tipoDocumento: u.tipoDocumento || 'CC',
        estado: u.isActive ? 'Activo' : 'Inactivo',
        rol: u.rol || 'No asignado',
        fechaRegistro: u.fechaRegistro?.split('T')[0] || 'N/A'
      }));
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
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.documento.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleEstado && cumpleRol && cumpleBusqueda;
  });

  const handleCrear = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      numeroDocumento: '',
      tipoDocumento: 'CC',
      rol: 'ASPIRANTE'
    });
    setShowModal(true);
  };

  const handleEditar = async (id) => {
    try {
      const usuario = await userAPI.get(id);
      setEditingUser(usuario);
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        numeroDocumento: usuario.numeroDocumento || '',
        tipoDocumento: usuario.tipoDocumento || 'CC',
        rol: usuario.rol || 'ASPIRANTE'
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

    try {
      if (editingUser) {
        await userAPI.update(editingUser.id, formData);
      } else {
        await userAPI.create(formData);
      }
      cargarUsuarios();
      handleCloseModal();
    } catch (err) {
      setError(editingUser ? 'Error al actualizar usuario' : 'Error al crear usuario');
      console.error(err);
    }
  };

  const handleActivar = async (id) => {
    try {
      await userAPI.activate(id);
      cargarUsuarios();
    } catch (err) {
      setError('Error al activar usuario');
      console.error(err);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await userAPI.deactivate(id);
      cargarUsuarios();
    } catch (err) {
      setError('Error al desactivar usuario');
      console.error(err);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await userAPI.delete(id);
        cargarUsuarios();
      } catch (err) {
        setError('Error al eliminar usuario');
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      numeroDocumento: '',
      tipoDocumento: 'CC',
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
          {/* Header Section */}
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

          {/* Stats Section */}
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

          {/* Filters Section */}
          <div className="filters-section-UP">
            <div className="search-box-UP">
              <input
                type="text"
                className="search-input-UP"
                placeholder="Buscar por nombre, correo o documento..."
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

            {/* Filter por Estado */}
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

            {/* Filter por Rol */}
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

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '1.2rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.12) 0%, rgba(107, 114, 128, 0.06) 100%)',
                color: '#374151',
                borderRadius: '10px',
                borderLeft: '4px solid rgba(107, 114, 128, 0.5)',
                fontWeight: '700',
                fontSize: '0.95em',
                letterSpacing: '0.3px',
                marginBottom: '1rem'
              }}
            >
              {error}
            </div>
          )}

          {/* Loading Message */}
          {loading && (
            <div
              style={{
                padding: '1.2rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)',
                color: '#3B82F6',
                borderRadius: '10px',
                borderLeft: '4px solid rgba(59, 130, 246, 0.5)',
                fontWeight: '700',
                fontSize: '0.95em',
                letterSpacing: '0.3px',
                marginBottom: '1rem'
              }}
            >
              Cargando usuarios...
            </div>
          )}

          {/* Table Section */}
          <div className="table-container-UP">
            <table className="table-UP">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Documento</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="nombre-cell-UP">{usuario.nombre}</td>
                      <td>{usuario.correo}</td>
                      <td>{usuario.telefono}</td>
                      <td>
                        <div className="contact-info-UP">
                          <span>{usuario.documento}</span>
                          <span className="doc-type-UP">{usuario.tipoDocumento}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>
                          {usuario.rol.toLowerCase()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge-UP ${
                            usuario.estado === 'Activo' ? 'status-active-UP' : 'status-inactive-UP'
                          }`}
                        >
                          {usuario.estado}
                        </span>
                      </td>
                      <td>{usuario.fechaRegistro}</td>
                      <td>
                        <div className="actions-UP">
                          <button
                            className="btn-action-UP btn-edit-UP"
                            onClick={() => handleEditar(usuario.id)}
                            title="Editar"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>

                          {usuario.estado === 'Activo' ? (
                            <button
                              className="btn-action-UP btn-deactivate-UP"
                              onClick={() => handleDesactivar(usuario.id)}
                              title="Desactivar"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <path d="M18 6L6 18M6 6l12 12"></path>
                              </svg>
                            </button>
                          ) : (
                            <button
                              className="btn-action-UP btn-activate-UP"
                              onClick={() => handleActivar(usuario.id)}
                              title="Activar"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </button>
                          )}

                          <button
                            className="btn-action-UP btn-delete-UP"
                            onClick={() => handleEliminar(usuario.id)}
                            title="Eliminar"
                          >
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
                    <td colSpan="8" className="no-results-UP">
                      No hay usuarios que coincidan con los filtros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay-UP" onClick={handleCloseModal}>
          <div className="modal-content-UP" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-UP">
              <h2>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
              <button className="modal-close-UP" onClick={handleCloseModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {error && (
              <div className="error-message-UP">
                {error}
              </div>
            )}

            <form className="modal-form-UP" onSubmit={handleGuardar}>
              <div className="form-row-UP">
                <div className="form-group-UP">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Juan"
                  />
                </div>
                <div className="form-group-UP">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Ej: Pérez"
                  />
                </div>
              </div>

              <div className="form-group-UP">
                <label>Correo *</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: juan@example.com"
                />
              </div>

              <div className="form-row-UP">
                <div className="form-group-UP">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 3001234567"
                  />
                </div>
                <div className="form-group-UP">
                  <label>Documento</label>
                  <input
                    type="text"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleInputChange}
                    placeholder="Ej: 12345678"
                  />
                </div>
              </div>

              <div className="form-row-UP">
                <div className="form-group-UP">
                  <label>Tipo Documento</label>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                  >
                    <option value="CC">CC - Cédula de Ciudadanía</option>
                    <option value="CE">CE - Cédula de Extranjería</option>
                    <option value="NIT">NIT - Número de Identificación Tributaria</option>
                    <option value="PP">PP - Pasaporte</option>
                  </select>
                </div>
                <div className="form-group-UP">
                  <label>Rol</label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                  >
                    <option value="ASPIRANTE">Aspirante</option>
                    <option value="RECLUTADOR">Reclutador</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="modal-buttons-UP">
                <button
                  type="button"
                  className="btn-cancel-UP"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-submit-UP"
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

import './AdminUsuarios.css';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: '',
    fechaNacimiento: '',
    genero: '',
    numeroDocumento: '',
    tipoDocumento: 'CC',
    descripcion: ''
  });

  useEffect(() => { cargarUsuarios(); }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAll();
      const usuariosData = data.map((u) => ({
        id: u.id,
        nombre: `${u.nombre} ${u.apellido || ''}`.trim(),
        correo: u.correo,
        telefono: u.telefono || 'N/A',
        documento: u.numeroDocumento || 'N/A',
        tipoDocumento: u.tipoDocumento || 'CC',
        estado: u.isActive ? 'Activo' : 'Inactivo',
        rol: u.rol || 'No asignado',
        fechaRegistro: u.fechaRegistro?.split('T')[0] || 'N/A'
      }));
      setUsuarios(usuariosData);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const pasaFiltro = filtroEstado === 'todos' || u.estado === filtroEstado;
    const pasaBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || u.correo.toLowerCase().includes(busqueda.toLowerCase());
    return pasaFiltro && pasaBusqueda;
  });

  const handleCrear = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      password: '',
      fechaNacimiento: '',
      genero: '',
      numeroDocumento: '',
      tipoDocumento: 'CC',
      descripcion: ''
    });
    setShowModal(true);
  };

  const handleEditar = async (id) => {
    try {
      const user = await userAPI.get(id);
      setEditingUser(id);
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido || '',
        correo: user.correo,
        telefono: user.telefono || '',
        password: '',
        fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : '',
        genero: user.genero || '',
        numeroDocumento: user.numeroDocumento || '',
        tipoDocumento: user.tipoDocumento || 'CC',
        descripcion: user.descripcion || ''
      });
      setShowModal(true);
    } catch {
      setError('Error al cargar usuario');
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.correo.includes('@')) {
      setError('Campos requeridos inválidos');
      return;
    }
    if (!editingUser && !formData.password) {
      setError('Contraseña obligatoria');
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono || null,
        fechaNacimiento: formData.fechaNacimiento || '1990-01-01',
        genero: formData.genero,
        numeroDocumento: formData.numeroDocumento || null,
        tipoDocumento: formData.tipoDocumento || 'CC',
        descripcion: formData.descripcion || null
      };

      if (!editingUser) {
        payload.password = formData.password;
        await userAPI.create(payload);
      } else {
        await userAPI.update(editingUser, payload);
      }

      cargarUsuarios();
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleActivar = async (id) => {
    try {
      await userAPI.activate(id);
      cargarUsuarios();
    } catch {
      setError('Error al activar');
    }
  };

  const handleDesactivar = async (id) => {
    if (!window.confirm('¿Desactivar usuario?')) return;
    try {
      await userAPI.deactivate(id);
      cargarUsuarios();
    } catch {
      setError('Error al desactivar');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar usuario? No se puede deshacer.')) return;
    try {
      await userAPI.delete(id);
      cargarUsuarios();
    } catch {
      setError('Error al eliminar');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      password: '',
      fechaNacimiento: '',
      genero: '',
      numeroDocumento: '',
      tipoDocumento: 'CC',
      descripcion: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="admin-layout">
        <Sidebar />
        <main className="main-users-manage-UP">
          <div className="container-users-manage-UP">
            <div className="header-section-UP">
              <div>
                <h1 className="title-users-UP">Gestión de Usuarios</h1>
                <p className="subtitle-users-UP">Administra las cuentas de usuarios</p>
              </div>
              <button
                className="btn-create-UP"
                onClick={handleCrear}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                + Crear Usuario
              </button>
            </div>

            {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Cargando usuarios...</div>
            ) : (
              <>
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
                      placeholder="Buscar usuarios..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="search-input-UP"
                    />
                    <button className="search-btn-UP" type="button">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                      TODOS
                    </button>
                    <button
                      className={`filter-btn-UP ${filtroEstado === 'Activo' ? 'active' : ''}`}
                      onClick={() => setFiltroEstado('Activo')}
                    >
                      ACTIVOS
                    </button>
                    <button
                      className={`filter-btn-UP ${filtroEstado === 'Inactivo' ? 'active' : ''}`}
                      onClick={() => setFiltroEstado('Inactivo')}
                    >
                      INACTIVOS
                    </button>
                  </div>
                </div>

                <div className="table-container-UP">
                  <table className="table-UP">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Documento</th>
                        <th>Estado</th>
                        <th>Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.length > 0 ? (
                        usuariosFiltrados.map(u => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td className="nombre-cell-UP">{u.nombre}</td>
                            <td>{u.correo}</td>
                            <td>{u.telefono}</td>
                            <td><span className="doc-type-UP">{u.tipoDocumento}</span> {u.documento}</td>
                            <td>
                              <span className={`status-badge-UP ${u.estado === 'Activo' ? 'status-active-UP' : 'status-inactive-UP'}`}>
                                {u.estado}
                              </span>
                            </td>
                            <td>{u.fechaRegistro}</td>
                            <td>
                              <div className="actions-UP">
                                <button className="btn-action-UP btn-edit-UP" onClick={() => handleEditar(u.id)} title="Editar">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                </button>
                                {u.estado === 'Activo' ? (
                                  <button className="btn-action-UP btn-deactivate-UP" onClick={() => handleDesactivar(u.id)} title="Desactivar">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="6" y="4" width="4" height="16"></rect>
                                      <rect x="14" y="4" width="4" height="16"></rect>
                                    </svg>
                                  </button>
                                ) : (
                                  <button className="btn-action-UP btn-activate-UP" onClick={() => handleActivar(u.id)} title="Activar">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                  </button>
                                )}
                                <button className="btn-action-UP btn-delete-UP" onClick={() => handleEliminar(u.id)} title="Eliminar">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18"></path>
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
                          <td colSpan="8" className="no-results-UP">No hay resultados</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay-UP" onClick={handleCloseModal}>
          <div className="modal-content-UP" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-UP">
              <h2>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h2>
              <button className="modal-close-UP" onClick={handleCloseModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleGuardar} className="modal-form-UP">
              <div className="form-row-UP">
                <div className="form-group-UP">
                  <label>Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" required />
                </div>
                <div className="form-group-UP">
                  <label>Apellido *</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Apellido" required />
                </div>
              </div>
              <div className="form-group-UP">
                <label>Correo *</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="email@ejemplo.com" required />
              </div>
              <div className="form-row-UP">
                <div className="form-group-UP">
                  <label>Género *</label>
                  <select name="genero" value={formData.genero} onChange={handleInputChange} required>
                    <option value="">Seleccionar...</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div className="form-group-UP">
                  <label>Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="3101234567" />
                </div>
              </div>
              <div className="form-row-UP">
                <div className="form-group-UP">
                  <label>Tipo Documento</label>
                  <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleInputChange}>
                    <option value="CC">C.C</option>
                    <option value="PA">Pasaporte</option>
                    <option value="CE">C.E</option>
                    <option value="TI">T.I</option>
                  </select>
                </div>
                <div className="form-group-UP">
                  <label>Número Documento</label>
                  <input type="text" name="numeroDocumento" value={formData.numeroDocumento} onChange={handleInputChange} placeholder="12345678" />
                </div>
              </div>
              <div className="form-group-UP">
                <label>Fecha de Nacimiento</label>
                <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} />
              </div>
              <div className="form-group-UP">
                <label>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Breve descripción..." rows="3" />
              </div>
              {!editingUser && (
                <div className="form-group-UP">
                  <label>Contraseña *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required={!editingUser} />
                </div>
              )}
              <div className="modal-buttons-UP">
                <button type="button" className="btn-cancel-UP" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="btn-submit-UP">{editingUser ? 'Guardar Cambios' : 'Crear Usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
