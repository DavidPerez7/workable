import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/Footer/footer';
import Sidebar from '../SideBar/Sidebar';
import { getAllEmpresasDto, actualizarEmpresa, eliminarEmpresa, crearEmpresa } from '../../../api/empresaAPI';
import { getMunicipios } from '../../../api/municipioAPI';
import EmpresasTable from './EmpresasTable';
import RecruitersModal from './RecruitersModal';
import './AdminEmpresas.css';

function AdminEmpresas() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showRecruitersModal, setShowRecruitersModal] = useState(false);
  const [selectedEmpresaForRecruiters, setSelectedEmpresaForRecruiters] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nit: '',
    emailContacto: '',
    telefonoContacto: '',
    numeroTrabajadores: '',
    puntuacion: '',
    website: '',
    logoUrl: '',
    redesSociales: '',
    direcciones: '',
    razonSocial: '',
    municipioId: '',
    categories: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [municipios, setMunicipios] = useState([]);
  const [categories] = useState([
    'TECNOLOGIA', 'SOFTWARE', 'TELECOMUNICACIONES', 'SALUD', 'FARMACEUTICA', 'EDUCACION', 'FINANZAS', 'BANCA', 'SEGUROS', 'CONSULTORIA', 'LEGAL', 'MANUFACTURERA', 'AUTOMOTRIZ', 'CONSTRUCCION', 'INMOBILIARIA', 'ENERGIA', 'RETAIL', 'ECOMMERCE', 'ALIMENTACION', 'TRANSPORTE', 'LOGISTICA', 'MARKETING', 'PUBLICIDAD', 'TURISMO', 'HOTELERIA', 'RESTAURACION', 'RECURSOS_HUMANOS', 'AGRICULTURA', 'MEDIO_AMBIENTE', 'OTRO'
  ]);

  useEffect(() => {
    fetchEmpresas();
    fetchMunicipios();
  }, []);

  const fetchMunicipios = async () => {
    try {
      const data = await getMunicipios();
      setMunicipios(data);
    } catch (err) {
      console.error('Error fetching municipios:', err);
    }
  };

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEmpresasDto();
      setEmpresas(data);
      setLastUpdated(new Date());
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
      setProcessingId(id);
      const empresa = empresas.find(e => e.id === id);
      if (!empresa) throw new Error('Empresa no encontrada');
      await actualizarEmpresa(id, { ...empresa, isActive: true });
      fetchEmpresas(); // Refresh to get updated data
    } catch (err) {
      console.error('Error al activar empresa:', err);
      setError('Error al activar empresa: ' + (err.message || ''));
    } finally {
      setProcessingId(null);
    }
  };

  const handleDesactivar = async (id) => {
    if (window.confirm('¿Estás seguro de desactivar esta empresa?')) {
      try {
        setProcessingId(id);
        const empresa = empresas.find(e => e.id === id);
        if (!empresa) throw new Error('Empresa no encontrada');
        await actualizarEmpresa(id, { ...empresa, isActive: false });
        fetchEmpresas(); // Refresh to get updated data
      } catch (err) {
        console.error('Error al desactivar empresa:', err);
        setError('Error al desactivar empresa: ' + (err.message || ''));
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.')) {
      try {
        setProcessingId(id);
        await eliminarEmpresa(id);
        fetchEmpresas(); // Refresh to get updated data
      } catch (err) {
        console.error('Error al eliminar empresa:', err);
        setError('Error al eliminar empresa: ' + (err.message || ''));
      } finally {
        setProcessingId(null);
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

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
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
        puntuacion: parseFloat(formData.puntuacion) || 0.0,
        website: formData.website,
        logoUrl: formData.logoUrl,
        redesSociales: formData.redesSociales ? formData.redesSociales.split(',').map(s => s.trim()) : [],
        direcciones: formData.direcciones ? formData.direcciones.split(',').map(s => s.trim()) : [],
        razonSocial: formData.razonSocial,
        municipio: formData.municipioId ? { id: parseInt(formData.municipioId) } : null,
        categories: formData.categories,
        isActive: true
      };
      
      const empresaCreada = await crearEmpresa(nuevaEmpresa);
      // setEmpresas([...empresas, empresaCreada]); // Remove local update
      setShowModal(false);
      setFormData({
        nombre: '',
        descripcion: '',
        nit: '',
        emailContacto: '',
        telefonoContacto: '',
        numeroTrabajadores: '',
        puntuacion: '',
        website: '',
        logoUrl: '',
        redesSociales: '',
        direcciones: '',
        razonSocial: '',
        municipioId: '',
        categories: []
      });
      setError(null);
      fetchEmpresas(); // Refresh to get updated data
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
      puntuacion: '',
      website: '',
      logoUrl: '',
      redesSociales: '',
      direcciones: '',
      razonSocial: '',
      municipioId: '',
      categories: []
    });
    setError(null);
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
      puntuacion: '',
      website: '',
      logoUrl: '',
      redesSociales: '',
      direcciones: '',
      razonSocial: '',
      municipioId: '',
      categories: []
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
      puntuacion: empresa.puntuacion != null ? empresa.puntuacion : '',
      website: empresa.website || '',
      logoUrl: empresa.logoUrl || '',
      redesSociales: empresa.redesSociales ? empresa.redesSociales.join(', ') : '',
      direcciones: empresa.direcciones ? empresa.direcciones.join(', ') : '',
      razonSocial: empresa.razonSocial || '',
      municipioId: empresa.municipio ? empresa.municipio.id : '',
      categories: empresa.categories || []
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
        puntuacion: parseFloat(formData.puntuacion) || 0.0,
        website: formData.website,
        logoUrl: formData.logoUrl,
        redesSociales: formData.redesSociales ? formData.redesSociales.split(',').map(s => s.trim()) : [],
        direcciones: formData.direcciones ? formData.direcciones.split(',').map(s => s.trim()) : [],
        razonSocial: formData.razonSocial,
        municipio: formData.municipioId ? { id: parseInt(formData.municipioId) } : null,
        categories: formData.categories,
        isActive: empresas.find(e => e.id === editingId)?.isActive || true
      };
      
      const empresaActualizadaResponse = await actualizarEmpresa(editingId, empresaActualizada);
      // setEmpresas(empresas.map(emp => 
      //   emp.id === editingId ? empresaActualizadaResponse : emp
      // )); // Remove local update
      setShowEditModal(false);
      setEditingId(null);
      setFormData({
        nombre: '',
        descripcion: '',
        nit: '',
        emailContacto: '',
        telefonoContacto: '',
        numeroTrabajadores: '',
        puntuacion: '',
        website: '',
        logoUrl: '',
        redesSociales: '',
        direcciones: '',
        razonSocial: '',
        municipioId: '',
        categories: []
      });
      setError(null);
      fetchEmpresas(); // Refresh to get updated data
    } catch (err) {
      console.error('Error al actualizar empresa:', err);
      setError('Error al actualizar empresa: ' + (err.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewRecruiters = (empresa) => {
    setSelectedEmpresaForRecruiters(empresa);
    setShowRecruitersModal(true);
  };

  const handleCloseRecruitersModal = () => {
    setShowRecruitersModal(false);
    setSelectedEmpresaForRecruiters(null);
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
      <div className="admin-layout">
        <Sidebar />
        <main className="main-companies-page-CP">
          <div className="container-companies-page-CP">
          
          <div className="header-section-CP">
            <div>
              <h1 className="title-companies-CP">GESTIÓN DE EMPRESAS</h1>
              {lastUpdated && <div className="dashboard-subtitle">Última actualización: {lastUpdated.toLocaleString()}</div>}
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
                + Nueva Empresa
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
                  <svg className="stat-icon-CP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <div>
                    <div className="stat-number-CP">{estadisticas.total}</div>
                    <div className="stat-label-CP">Total Empresas</div>
                  </div>
                </div>
                <div className="stat-card-CP stat-aprobadas-CP">
                  <svg className="stat-icon-CP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
                  <div>
                    <div className="stat-number-CP">{estadisticas.activas}</div>
                    <div className="stat-label-CP">Activas</div>
                  </div>
                </div>
                <div className="stat-card-CP stat-inactivas-CP">
                  <svg className="stat-icon-CP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
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
                  <button type="button" className="search-btn-CP" onClick={() => {}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div className="filter-buttons-CP">
                  <button
                    className={`filter-empresa1 ${filtroEstado === 'todas' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('todas')}
                  >
                    Todas
                  </button>
                  <button
                    className={`filter-empresa2 ${filtroEstado === 'Aprobado' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('Aprobado')}
                  >
                    Activas
                  </button>
                  <button
                    className={`filter-empresa3 ${filtroEstado === 'Inactivo' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('Inactivo')}
                  >
                    Inactivas
                  </button>
                </div>
              </div>


              <EmpresasTable
                empresasFiltradas={empresasFiltradas}
                getEstadoBadgeClass={getEstadoBadgeClass}
                handleEditEmpresa={handleEditEmpresa}
                handleAprobar={handleAprobar}
                handleDesactivar={handleDesactivar}
                handleEliminar={handleEliminar}
                onViewRecruiters={handleViewRecruiters}
                processingId={processingId}
              />
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

                <div className="form-row-CP">
                  <div className="form-group-CP">
                    <label>Puntuación</label>
                    <input
                      type="number"
                      name="puntuacion"
                      value={formData.puntuacion}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      step="0.1"
                      min="0"
                      max="5"
                    />
                  </div>

                  <div className="form-group-CP">
                    <label>Logo URL</label>
                    <input
                      type="text"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/logo.png"
                    />
                  </div>
                </div>

                <div className="form-group-CP">
                  <label>Redes Sociales</label>
                  <input
                    type="text"
                    name="redesSociales"
                    value={formData.redesSociales}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/empresa, https://twitter.com/empresa"
                  />
                </div>

                <div className="form-group-CP">
                  <label>Direcciones</label>
                  <input
                    type="text"
                    name="direcciones"
                    value={formData.direcciones}
                    onChange={handleInputChange}
                    placeholder="Dirección 1, Dirección 2"
                  />
                </div>

                <div className="form-row-CP">
                  <div className="form-group-CP">
                    <label>Razón Social</label>
                    <input
                      type="text"
                      name="razonSocial"
                      value={formData.razonSocial}
                      onChange={handleInputChange}
                      placeholder="Razón Social S.A."
                    />
                  </div>

                  <div className="form-group-CP">
                    <label>Municipio</label>
                    <select
                      name="municipioId"
                      value={formData.municipioId}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar Municipio</option>
                      {municipios.map(municipio => (
                        <option key={municipio.id} value={municipio.id}>
                          {municipio.nombre} - {municipio.departamento}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group-CP">
                  <label>Categorías</label>
                  <div className="categories-grid-CP">
                    {categories.map(category => (
                      <label key={category} className="category-checkbox-CP">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        {category.replace('_', ' ')}
                      </label>
                    ))}
                  </div>
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

                <div className="form-row-CP">
                  <div className="form-group-CP">
                    <label>Puntuación</label>
                    <input
                      type="number"
                      name="puntuacion"
                      value={formData.puntuacion}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      step="0.1"
                      min="0"
                      max="5"
                    />
                  </div>

                  <div className="form-group-CP">
                    <label>Logo URL</label>
                    <input
                      type="text"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/logo.png"
                    />
                  </div>
                </div>

                <div className="form-group-CP">
                  <label>Redes Sociales</label>
                  <input
                    type="text"
                    name="redesSociales"
                    value={formData.redesSociales}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/empresa, https://twitter.com/empresa"
                  />
                </div>

                <div className="form-group-CP">
                  <label>Direcciones</label>
                  <input
                    type="text"
                    name="direcciones"
                    value={formData.direcciones}
                    onChange={handleInputChange}
                    placeholder="Dirección 1, Dirección 2"
                  />
                </div>

                <div className="form-row-CP">
                  <div className="form-group-CP">
                    <label>Razón Social</label>
                    <input
                      type="text"
                      name="razonSocial"
                      value={formData.razonSocial}
                      onChange={handleInputChange}
                      placeholder="Razón Social S.A."
                    />
                  </div>

                  <div className="form-group-CP">
                    <label>Municipio</label>
                    <select
                      name="municipioId"
                      value={formData.municipioId}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar Municipio</option>
                      {municipios.map(municipio => (
                        <option key={municipio.id} value={municipio.id}>
                          {municipio.nombre} - {municipio.departamento}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group-CP">
                  <label>Categorías</label>
                  <div className="categories-grid-CP">
                    {categories.map(category => (
                      <label key={category} className="category-checkbox-CP">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        {category.replace('_', ' ')}
                      </label>
                    ))}
                  </div>
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
      </div>

      <RecruitersModal
        isOpen={showRecruitersModal}
        onClose={handleCloseRecruitersModal}
        empresa={selectedEmpresaForRecruiters}
      />

      <Footer />
    </>
  );
}

export default AdminEmpresas;