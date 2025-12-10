import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/footer';
import { getAllEmpresasDto, actualizarEmpresa, eliminarEmpresa, crearEmpresa } from '../../../api/empresaAPI';
import './CompaniesPage.css';

function CompaniesPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nit: '',
    emailContacto: '',
    telefonoContacto: '',
    numeroTrabajadores: '',
    website: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEmpresasDto();
      setEmpresas(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const empresasFiltradas = empresas.filter(empresa => {
    const cumpleFiltro = filtroEstado === 'todas' || (empresa.isActive === true && filtroEstado === 'Aprobado') || (empresa.isActive === false && filtroEstado === 'Inactivo');
    const cumpleBusqueda = empresa.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           empresa.nit.includes(busqueda) ||
                           (empresa.emailContacto && empresa.emailContacto.toLowerCase().includes(busqueda.toLowerCase()));
    return cumpleFiltro && cumpleBusqueda;
  });

  const handleAprobar = async (id) => {
    try {
      const empresa = empresas.find(e => e.id === id);
      await actualizarEmpresa(id, { ...empresa, isActive: true });
      setEmpresas(empresas.map(emp => 
        emp.id === id ? { ...emp, isActive: true } : emp
      ));
    } catch (err) {
      console.error('Error al activar empresa:', err);
      setError('Error al activar empresa');
    }
  };

  const handleDesactivar = async (id) => {
    if (window.confirm('¿Estás seguro de desactivar esta empresa?')) {
      try {
        const empresa = empresas.find(e => e.id === id);
        await actualizarEmpresa(id, { ...empresa, isActive: false });
        setEmpresas(empresas.map(emp => 
          emp.id === id ? { ...emp, isActive: false } : emp
        ));
      } catch (err) {
        console.error('Error al desactivar empresa:', err);
        setError('Error al desactivar empresa');
      }
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.')) {
      try {
        await eliminarEmpresa(id);
        setEmpresas(empresas.filter(emp => emp.id !== id));
      } catch (err) {
        console.error('Error al eliminar empresa:', err);
        setError('Error al eliminar empresa');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEmpresa = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.nit || !formData.emailContacto) {
      setError('Por favor llena todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      const nuevaEmpresa = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        nit: formData.nit,
        emailContacto: formData.emailContacto,
        telefonoContacto: formData.telefonoContacto,
        numeroTrabajadores: parseInt(formData.numeroTrabajadores) || 0,
        website: formData.website,
        isActive: true
      };
      
      const empresaCreada = await crearEmpresa(nuevaEmpresa);
      setEmpresas([...empresas, empresaCreada]);
      setShowModal(false);
      setFormData({
        nombre: '',
        descripcion: '',
        nit: '',
        emailContacto: '',
        telefonoContacto: '',
        numeroTrabajadores: '',
        website: ''
      });
      setError(null);
    } catch (err) {
      console.error('Error al crear empresa:', err);
      setError('Error al crear empresa: ' + (err.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      nombre: '',
      descripcion: '',
      nit: '',
      emailContacto: '',
      telefonoContacto: '',
      numeroTrabajadores: '',
      website: ''
    });
    setError(null);
  };

  const handleEditEmpresa = (empresa) => {
    setEditingId(empresa.id);
    setFormData({
      nombre: empresa.nombre,
      descripcion: empresa.descripcion || '',
      nit: empresa.nit,
      emailContacto: empresa.emailContacto,
      telefonoContacto: empresa.telefonoContacto || '',
      numeroTrabajadores: empresa.numeroTrabajadores || '',
      website: empresa.website || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateEmpresa = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.nit || !formData.emailContacto) {
      setError('Por favor llena todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      const empresaActualizada = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        nit: formData.nit,
        emailContacto: formData.emailContacto,
        telefonoContacto: formData.telefonoContacto,
        numeroTrabajadores: parseInt(formData.numeroTrabajadores) || 0,
        website: formData.website,
        isActive: empresas.find(e => e.id === editingId)?.isActive || true
      };
      
      await actualizarEmpresa(editingId, empresaActualizada);
      setEmpresas(empresas.map(emp => 
        emp.id === editingId ? { ...emp, ...empresaActualizada } : emp
      ));
      setShowEditModal(false);
      setEditingId(null);
      setFormData({
        nombre: '',
        descripcion: '',
        nit: '',
        emailContacto: '',
        telefonoContacto: '',
        numeroTrabajadores: '',
        website: ''
      });
      setError(null);
    } catch (err) {
      console.error('Error al actualizar empresa:', err);
      setError('Error al actualizar empresa: ' + (err.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      nit: '',
      emailContacto: '',
      telefonoContacto: '',
      numeroTrabajadores: '',
      website: ''
    });
    setError(null);
  };

  const getEstadoBadgeClass = (isActive) => {
    return isActive ? 'badge-aprobado-CP' : 'badge-inactivo-CP';
  };

  const estadisticas = {
    total: empresas.length,
    activas: empresas.filter(e => e.isActive === true).length,
    inactivas: empresas.filter(e => e.isActive === false).length
  };

  return (
    <>
      <main className="main-companies-page-CP">
        <div className="container-companies-page-CP">
          
          <div className="header-section-CP">
            <div>
              <h1 className="title-companies-CP">Gestión de Empresas</h1>
              <p className="subtitle-companies-CP">
                Administra las empresas registradas en la plataforma
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn-back-CP"
                onClick={() => setShowModal(true)}
                style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                ✨ Nueva Empresa
              </button>
              <button 
                className="btn-back-CP"
                onClick={() => navigate('/Administrador')}
              >
                ← Volver al Panel
              </button>
            </div>
          </div>

          {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Cargando empresas...</div>
          ) : (
            <>
              <div className="stats-section-CP">
                <div className="stat-card-CP stat-total-CP">
                  <div className="stat-icon-CP">🏢</div>
                  <div>
                    <div className="stat-number-CP">{estadisticas.total}</div>
                    <div className="stat-label-CP">Total Empresas</div>
                  </div>
                </div>
                <div className="stat-card-CP stat-aprobadas-CP">
                  <div className="stat-icon-CP">✅</div>
                  <div>
                    <div className="stat-number-CP">{estadisticas.activas}</div>
                    <div className="stat-label-CP">Activas</div>
                  </div>
                </div>
                <div className="stat-card-CP stat-inactivas-CP">
                  <div className="stat-icon-CP">⏸️</div>
                  <div>
                    <div className="stat-number-CP">{estadisticas.inactivas}</div>
                    <div className="stat-label-CP">Inactivas</div>
                  </div>
                </div>
              </div>


              <div className="filters-section-CP">
                <div className="search-box-CP">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, NIT o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input-CP"
                  />
                  <span className="search-icon-CP">🔍</span>
                </div>
                
                <div className="filter-buttons-CP">
                  <button
                    className={`filter-btn-CP ${filtroEstado === 'todas' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('todas')}
                  >
                    Todas
                  </button>
                  <button
                    className={`filter-btn-CP ${filtroEstado === 'Aprobado' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('Aprobado')}
                  >
                    Activas
                  </button>
                  <button
                    className={`filter-btn-CP ${filtroEstado === 'Inactivo' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('Inactivo')}
                  >
                    Inactivas
                  </button>
                </div>
              </div>


              <div className="table-container-CP">
                <table className="companies-table-CP">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>NIT</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Descripción</th>
                      <th>Dirección</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empresasFiltradas.length > 0 ? (
                      empresasFiltradas.map(empresa => (
                        <tr key={empresa.id}>
                          <td>{empresa.id}</td>
                          <td className="empresa-name-CP">{empresa.nombre}</td>
                          <td>{empresa.nit}</td>
                          <td>{empresa.emailContacto || 'N/A'}</td>
                          <td>{empresa.telefonoContacto || 'N/A'}</td>
                          <td>{empresa.descripcion || 'N/A'}</td>
                          <td>{empresa.website || 'N/A'}</td>
                          <td>
                            <span className={`estado-badge-CP ${getEstadoBadgeClass(empresa.isActive)}`}>
                              {empresa.isActive ? 'Activa' : 'Inactiva'}
                            </span>
                          </td>
                          <td>
                            <div className="actions-buttons-CP">
                              <button
                                className="btn-action-CP btn-edit-CP"
                                onClick={() => handleEditEmpresa(empresa)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              {empresa.isActive ? (
                                <button
                                  className="btn-action-CP btn-reject-CP"
                                  onClick={() => handleDesactivar(empresa.id)}
                                  title="Desactivar"
                                >
                                  ⏸️
                                </button>
                              ) : (
                                <button
                                  className="btn-action-CP btn-approve-CP"
                                  onClick={() => handleAprobar(empresa.id)}
                                  title="Activar"
                                >
                                  ▶️
                                </button>
                              )}
                              <button
                                className="btn-action-CP btn-delete-CP"
                                onClick={() => handleEliminar(empresa.id)}
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="no-results-CP">
                          No se encontraron empresas con los filtros seleccionados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* MODAL PARA CREAR EMPRESA */}
        {showModal && (
          <div className="modal-overlay-CP" onClick={handleCloseModal}>
            <div className="modal-content-CP" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-CP">
                <h2>Crear Nueva Empresa</h2>
                <button 
                  className="modal-close-btn-CP"
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateEmpresa} className="modal-form-CP">
                <div className="form-group-CP">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre de la empresa"
                    required
                  />
                </div>

                <div className="form-group-CP">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción de la empresa"
                    rows="4"
                  />
                </div>

                <div className="form-row-CP">
                  <div className="form-group-CP">
                    <label>NIT *</label>
                    <input
                      type="text"
                      name="nit"
                      value={formData.nit}
                      onChange={handleInputChange}
                      placeholder="NIT"
                      required
                    />
                  </div>

                  <div className="form-group-CP">
                    <label>Email Contacto *</label>
                    <input
                      type="email"
                      name="emailContacto"
                      value={formData.emailContacto}
                      onChange={handleInputChange}
                      placeholder="email@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-CP">
                  <div className="form-group-CP">
                    <label>Teléfono Contacto</label>
                    <input
                      type="text"
                      name="telefonoContacto"
                      value={formData.telefonoContacto}
                      onChange={handleInputChange}
                      placeholder="3101234567"
                    />
                  </div>

                  <div className="form-group-CP">
                    <label>Número de Trabajadores</label>
                    <input
                      type="number"
                      name="numeroTrabajadores"
                      value={formData.numeroTrabajadores}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group-CP">
                  <label>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="www.ejemplo.com"
                  />
                </div>

                {error && (
                  <div className="error-message-CP">
                    {error}
                  </div>
                )}

                <div className="modal-buttons-CP">
                  <button
                    type="button"
                    className="btn-cancel-CP"
                    onClick={handleCloseModal}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-submit-CP"
                    disabled={submitting}
                  >
                    {submitting ? 'Creando...' : 'Crear Empresa'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL PARA EDITAR EMPRESA */}
        {showEditModal && (
          <div className="modal-overlay-CP" onClick={handleCloseEditModal}>
            <div className="modal-content-CP" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-CP">
                <h2>Editar Empresa</h2>
                <button 
                  className="modal-close-btn-CP"
                  onClick={handleCloseEditModal}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateEmpresa} className="modal-form-CP">
                <div className="form-group-CP">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre de la empresa"
                    required
                  />
                </div>

                <div className="form-group-CP">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción de la empresa"
                    rows="4"
                  />
                </div>

                <div className="form-row-CP">
                  <div className="form-group-CP">
                    <label>NIT *</label>
                    <input
                      type="text"
                      name="nit"
                      value={formData.nit}
                      onChange={handleInputChange}
                      placeholder="NIT"
                      required
                    />
                  </div>

                  <div className="form-group-CP">
                    <label>Email Contacto *</label>
                    <input
                      type="email"
                      name="emailContacto"
                      value={formData.emailContacto}
                      onChange={handleInputChange}
                      placeholder="email@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-CP">
                  <div className="form-group-CP">
                    <label>Teléfono Contacto</label>
                    <input
                      type="text"
                      name="telefonoContacto"
                      value={formData.telefonoContacto}
                      onChange={handleInputChange}
                      placeholder="3101234567"
                    />
                  </div>

                  <div className="form-group-CP">
                    <label>Número de Trabajadores</label>
                    <input
                      type="number"
                      name="numeroTrabajadores"
                      value={formData.numeroTrabajadores}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group-CP">
                  <label>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="www.ejemplo.com"
                  />
                </div>

                {error && (
                  <div className="error-message-CP">
                    {error}
                  </div>
                )}

                <div className="modal-buttons-CP">
                  <button
                    type="button"
                    className="btn-cancel-CP"
                    onClick={handleCloseEditModal}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-submit-CP"
                    disabled={submitting}
                  >
                    {submitting ? 'Actualizando...' : 'Actualizar Empresa'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default CompaniesPage;