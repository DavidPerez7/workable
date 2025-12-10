import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/Footer/footer';
import { getAllOfertas, crearOferta, actualizarOferta, eliminarOferta, cambiarEstadoOferta } from '../../../api/ofertasAPI';
import { getAllEmpresasDto } from '../../../api/empresaAPI';
import './OffersPage.css';

function OffersPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroModalidad, setFiltroModalidad] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [ofertas, setOfertas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    empresa: '',
    salario: '',
    numeroVacantes: '',
    modalidad: 'PRESENCIAL',
    nivelExperiencia: 'SIN_EXPERIENCIA',
    tipoContrato: 'TIEMPO_COMPLETO'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ofertasData, empresasData] = await Promise.all([
        getAllOfertas(),
        getAllEmpresasDto()
      ]);
      setOfertas(ofertasData);
      setEmpresas(empresasData);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const ofertasFiltradas = ofertas.filter(oferta => {
    const cumpleFiltroEstado = filtroEstado === 'todas' || oferta.estado === filtroEstado;
    const cumpleFiltroModalidad = filtroModalidad === 'todas' || oferta.modalidad === filtroModalidad;
    const cumpleBusqueda = oferta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           (oferta.empresa?.nombre || '').toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltroEstado && cumpleFiltroModalidad && cumpleBusqueda;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateOferta = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.empresa || !formData.salario) {
      setError('Por favor llena todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      const today = new Date();
      const fechaLimite = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
      const nuevaOferta = {
        titulo: formData.titulo,
        descripcion: formData.descripcion || '',
        empresa: { id: parseInt(formData.empresa) },
        salario: parseInt(formData.salario),
        numeroVacantes: parseInt(formData.numeroVacantes) || 1,
        modalidad: formData.modalidad,
        nivelExperiencia: formData.nivelExperiencia,
        tipoContrato: formData.tipoContrato,
        fechaPublicacion: new Date().toISOString().split('T')[0],
        fechaLimite: fechaLimite.toISOString().split('T')[0],
        estado: 'ABIERTA'
      };
      
      const ofertaCreada = await crearOferta(nuevaOferta);
      setOfertas([...ofertas, ofertaCreada]);
      setShowModal(false);
      setFormData({
        titulo: '',
        descripcion: '',
        empresa: '',
        salario: '',
        numeroVacantes: '',
        modalidad: 'PRESENCIAL',
        nivelExperiencia: 'SIN_EXPERIENCIA',
        tipoContrato: 'TIEMPO_COMPLETO'
      });
      setError(null);
    } catch (err) {
      console.error('Error al crear oferta:', err);
      setError('Error al crear oferta: ' + (err.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      titulo: '',
      descripcion: '',
      empresa: '',
      salario: '',
      numeroVacantes: '',
      modalidad: 'PRESENCIAL',
      nivelExperiencia: 'SIN_EXPERIENCIA',
      tipoContrato: 'TIEMPO_COMPLETO'
    });
    setError(null);
  };

  const handleEditOferta = (oferta) => {
    setEditingId(oferta.id);
    setFormData({
      titulo: oferta.titulo,
      descripcion: oferta.descripcion || '',
      empresa: oferta.empresa?.id || '',
      salario: oferta.salario || '',
      numeroVacantes: oferta.numeroVacantes || '',
      modalidad: oferta.modalidad || 'PRESENCIAL',
      nivelExperiencia: oferta.nivelExperiencia || 'BASICO',
      tipoContrato: oferta.tipoContrato || 'TIEMPO_COMPLETO'
    });
    setShowEditModal(true);
  };

  const handleUpdateOferta = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.empresa || !formData.salario) {
      setError('Por favor llena todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      const ofertaOriginal = ofertas.find(o => o.id === editingId);
      const ofertaActualizada = {
        titulo: formData.titulo,
        descripcion: formData.descripcion || '',
        empresa: { id: parseInt(formData.empresa) },
        salario: parseInt(formData.salario),
        numeroVacantes: parseInt(formData.numeroVacantes) || 1,
        modalidad: formData.modalidad,
        nivelExperiencia: formData.nivelExperiencia,
        tipoContrato: formData.tipoContrato,
        fechaPublicacion: ofertaOriginal?.fechaPublicacion || new Date().toISOString().split('T')[0],
        fechaLimite: ofertaOriginal?.fechaLimite || new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        estado: ofertaOriginal?.estado || 'ABIERTA'
      };
      
      await actualizarOferta(editingId, ofertaActualizada);
      setOfertas(ofertas.map(of => 
        of.id === editingId ? { ...of, ...ofertaActualizada } : of
      ));
      setShowEditModal(false);
      setEditingId(null);
      setFormData({
        titulo: '',
        descripcion: '',
        empresa: '',
        salario: '',
        numeroVacantes: '',
        modalidad: 'PRESENCIAL',
        nivelExperiencia: 'SIN_EXPERIENCIA',
        tipoContrato: 'TIEMPO_COMPLETO'
      });
      setError(null);
    } catch (err) {
      console.error('Error al actualizar oferta:', err);
      setError('Error al actualizar oferta: ' + (err.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingId(null);
    setFormData({
      titulo: '',
      descripcion: '',
      empresa: '',
      salario: '',
      numeroVacantes: '',
      modalidad: 'PRESENCIAL',
      nivelExperiencia: 'SIN_EXPERIENCIA',
      tipoContrato: 'TIEMPO_COMPLETO'
    });
    setError(null);
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoOferta(id, nuevoEstado);
      setOfertas(ofertas.map(of => 
        of.id === id ? { ...of, estado: nuevoEstado } : of
      ));
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError('Error al cambiar estado: ' + (err.message || ''));
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta oferta? Esta acción no se puede deshacer.')) {
      try {
        await eliminarOferta(id);
        setOfertas(ofertas.filter(of => of.id !== id));
      } catch (err) {
        console.error('Error al eliminar oferta:', err);
        setError('Error al eliminar oferta: ' + (err.message || ''));
      }
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch(estado) {
      case 'ABIERTA': return 'badge-activa-OP';
      case 'CERRADA': return 'badge-inactiva-OP';
      default: return 'badge-pendiente-OP';
    }
  };

  const estadisticas = {
    total: ofertas.length,
    activas: ofertas.filter(o => o.estadoOferta === 'ABIERTA').length,
    inactivas: ofertas.filter(o => o.estadoOferta === 'CERRADA').length
  };

  return (
    <>
      <main className="main-offers-page-OP">
        <div className="container-offers-page-OP">
          
          <div className="header-section-OP">
            <div>
              <h1 className="title-offers-OP">Gestión de Ofertas Laborales</h1>
              <p className="subtitle-offers-OP">
                Supervisa y modera las ofertas laborales publicadas en la plataforma
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn-back-OP"
                onClick={() => setShowModal(true)}
                style={{ 
                  background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
                }}
              >
                ✨ Nueva Oferta
              </button>
              <button 
                className="btn-back-OP"
                onClick={() => navigate('/Administrador')}
              >
                ← Volver al Panel
              </button>
            </div>
          </div>

          {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Cargando ofertas...</div>
          ) : (
            <>
              <div className="stats-section-OP">
                <div className="stat-card-OP stat-total-OP">
                  <div className="stat-icon-OP">💼</div>
                  <div>
                    <div className="stat-number-OP">{estadisticas.total}</div>
                    <div className="stat-label-OP">Total Ofertas</div>
                  </div>
                </div>
                <div className="stat-card-OP stat-activas-OP">
                  <div className="stat-icon-OP">✅</div>
                  <div>
                    <div className="stat-number-OP">{estadisticas.activas}</div>
                    <div className="stat-label-OP">Ofertas Activas</div>
                  </div>
                </div>
                <div className="stat-card-OP stat-inactivas-OP">
                  <div className="stat-icon-OP">⏸️</div>
                  <div>
                    <div className="stat-number-OP">{estadisticas.inactivas}</div>
                    <div className="stat-label-OP">Ofertas Inactivas</div>
                  </div>
                </div>
              </div>

              <div className="filters-section-OP">
                <div className="search-box-OP">
                  <input
                    type="text"
                    placeholder="Buscar por título, empresa o ubicación..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input-OP"
                  />
                  <span className="search-icon-OP">🔍</span>
                </div>
                
                <div className="filter-group-OP">
                  <label className="filter-label-OP">Estado:</label>
                  <div className="filter-buttons-OP">
                    <button
                      className={`filter-btn-OP ${filtroEstado === 'todas' ? 'active' : ''}`}
                      onClick={() => setFiltroEstado('todas')}
                    >
                      Todas
                    </button>
                    <button
                      className={`filter-btn-OP ${filtroEstado === 'ABIERTA' ? 'active' : ''}`}
                      onClick={() => setFiltroEstado('ABIERTA')}
                    >
                      Activas
                    </button>
                    <button
                      className={`filter-btn-OP ${filtroEstado === 'CERRADA' ? 'active' : ''}`}
                      onClick={() => setFiltroEstado('CERRADA')}
                    >
                      Cerradas
                    </button>
                  </div>
                </div>

                <div className="filter-group-OP">
                  <label className="filter-label-OP">Modalidad:</label>
                  <select
                    className="select-filter-OP"
                    value={filtroModalidad}
                    onChange={(e) => setFiltroModalidad(e.target.value)}
                  >
                    <option value="todas">Todas</option>
                    <option value="REMOTO">Remoto</option>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="HIBRIDO">Híbrido</option>
                  </select>
                </div>
              </div>

              <div className="table-container-OP">
                <table className="offers-table-OP">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Empresa</th>
                      <th>Ubicación</th>
                      <th>Modalidad</th>
                      <th>Salario</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ofertasFiltradas.length > 0 ? (
                      ofertasFiltradas.map(oferta => (
                        <tr key={oferta.id}>
                          <td>{oferta.id}</td>
                          <td className="offer-title-OP">{oferta.titulo}</td>
                          <td className="company-name-OP">{oferta.empresa?.nombre || 'N/A'}</td>
                          <td>{oferta.municipio?.nombre || 'N/A'}</td>
                          <td>
                            <span className="modalidad-badge-OP">{oferta.modalidad || 'N/A'}</span>
                          </td>
                          <td className="salary-OP">${(oferta.salario || 0).toLocaleString('es-CO')}</td>
                          <td>
                            <span className={`estado-badge-OP ${getEstadoBadgeClass(oferta.estado)}`}>
                              {oferta.estado === 'ABIERTA' ? 'Abierta' : 'Cerrada'}
                            </span>
                          </td>
                          <td>{new Date(oferta.fechaPublicacion).toLocaleDateString('es-CO')}</td>
                          <td>
                            <div className="actions-buttons-OP">
                              <button
                                className="btn-action-OP btn-edit-OP"
                                onClick={() => handleEditOferta(oferta)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              {oferta.estado === 'ABIERTA' ? (
                                <button
                                  className="btn-action-OP btn-deactivate-OP"
                                  onClick={() => handleCambiarEstado(oferta.id, 'CERRADA')}
                                  title="Cerrar oferta"
                                >
                                  ⏸️
                                </button>
                              ) : (
                                <button
                                  className="btn-action-OP btn-activate-OP"
                                  onClick={() => handleCambiarEstado(oferta.id, 'ABIERTA')}
                                  title="Abrir oferta"
                                >
                                  ▶️
                                </button>
                              )}
                              <button
                                className="btn-action-OP btn-delete-OP"
                                onClick={() => handleEliminar(oferta.id)}
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
                        <td colSpan="9" className="no-results-OP">
                          No se encontraron ofertas con los filtros seleccionados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* MODAL PARA CREAR OFERTA */}
        {showModal && (
          <div className="modal-overlay-OP" onClick={handleCloseModal}>
            <div className="modal-content-OP" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-OP">
                <h2>Crear Nueva Oferta</h2>
                <button className="modal-close-btn-OP" onClick={handleCloseModal}>✕</button>
              </div>

              <form onSubmit={handleCreateOferta} className="modal-form-OP">
                <div className="form-group-OP">
                  <label>Título *</label>
                  <input type="text" name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título de la oferta" required />
                </div>

                <div className="form-group-OP">
                  <label>Descripción</label>
                  <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" rows="3" />
                </div>

                <div className="form-group-OP">
                  <label>Empresa *</label>
                  <select name="empresa" value={formData.empresa} onChange={handleInputChange} required>
                    <option value="">Selecciona una empresa</option>
                    {empresas.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row-OP">
                  <div className="form-group-OP">
                    <label>Salario *</label>
                    <input type="number" name="salario" value={formData.salario} onChange={handleInputChange} placeholder="0" required />
                  </div>
                  <div className="form-group-OP">
                    <label>Vacantes</label>
                    <input type="number" name="numeroVacantes" value={formData.numeroVacantes} onChange={handleInputChange} placeholder="1" min="1" />
                  </div>
                </div>

                <div className="form-row-OP">
                  <div className="form-group-OP">
                    <label>Modalidad</label>
                    <select name="modalidad" value={formData.modalidad} onChange={handleInputChange}>
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="REMOTO">Remoto</option>
                      <option value="HIBRIDO">Híbrido</option>
                    </select>
                  </div>
                  <div className="form-group-OP">
                    <label>Nivel Experiencia</label>
                    <select name="nivelExperiencia" value={formData.nivelExperiencia} onChange={handleInputChange}>
                      <option value="SIN_EXPERIENCIA">Sin Experiencia</option>
                      <option value="BASICO">Básico</option>
                      <option value="INTERMEDIO">Intermedio</option>
                      <option value="AVANZADO">Avanzado</option>
                      <option value="EXPERTO">Experto</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-OP">
                  <label>Tipo Contrato</label>
                  <select name="tipoContrato" value={formData.tipoContrato} onChange={handleInputChange}>
                    <option value="TIEMPO_COMPLETO">Tiempo Completo</option>
                    <option value="MEDIO_TIEMPO">Medio Tiempo</option>
                    <option value="TEMPORAL">Temporal</option>
                    <option value="PRACTICANTE">Practicante</option>
                  </select>
                </div>

                {error && <div className="error-message-OP">{error}</div>}

                <div className="modal-buttons-OP">
                  <button type="button" className="btn-cancel-OP" onClick={handleCloseModal} disabled={submitting}>Cancelar</button>
                  <button type="submit" className="btn-submit-OP" disabled={submitting}>{submitting ? 'Creando...' : 'Crear Oferta'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL PARA EDITAR OFERTA */}
        {showEditModal && (
          <div className="modal-overlay-OP" onClick={handleCloseEditModal}>
            <div className="modal-content-OP" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-OP">
                <h2>Editar Oferta</h2>
                <button className="modal-close-btn-OP" onClick={handleCloseEditModal}>✕</button>
              </div>

              <form onSubmit={handleUpdateOferta} className="modal-form-OP">
                <div className="form-group-OP">
                  <label>Título *</label>
                  <input type="text" name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título de la oferta" required />
                </div>

                <div className="form-group-OP">
                  <label>Descripción</label>
                  <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" rows="3" />
                </div>

                <div className="form-group-OP">
                  <label>Empresa *</label>
                  <select name="empresa" value={formData.empresa} onChange={handleInputChange} required>
                    <option value="">Selecciona una empresa</option>
                    {empresas.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row-OP">
                  <div className="form-group-OP">
                    <label>Salario *</label>
                    <input type="number" name="salario" value={formData.salario} onChange={handleInputChange} placeholder="0" required />
                  </div>
                  <div className="form-group-OP">
                    <label>Vacantes</label>
                    <input type="number" name="numeroVacantes" value={formData.numeroVacantes} onChange={handleInputChange} placeholder="1" min="1" />
                  </div>
                </div>

                <div className="form-row-OP">
                  <div className="form-group-OP">
                    <label>Modalidad</label>
                    <select name="modalidad" value={formData.modalidad} onChange={handleInputChange}>
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="REMOTO">Remoto</option>
                      <option value="HIBRIDO">Híbrido</option>
                    </select>
                  </div>
                  <div className="form-group-OP">
                    <label>Nivel Experiencia</label>
                    <select name="nivelExperiencia" value={formData.nivelExperiencia} onChange={handleInputChange}>
                      <option value="SIN_EXPERIENCIA">Sin Experiencia</option>
                      <option value="BASICO">Básico</option>
                      <option value="INTERMEDIO">Intermedio</option>
                      <option value="AVANZADO">Avanzado</option>
                      <option value="EXPERTO">Experto</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-OP">
                  <label>Tipo Contrato</label>
                  <select name="tipoContrato" value={formData.tipoContrato} onChange={handleInputChange}>
                    <option value="TIEMPO_COMPLETO">Tiempo Completo</option>
                    <option value="MEDIO_TIEMPO">Medio Tiempo</option>
                    <option value="TEMPORAL">Temporal</option>
                    <option value="PRACTICANTE">Practicante</option>
                  </select>
                </div>

                {error && <div className="error-message-OP">{error}</div>}

                <div className="modal-buttons-OP">
                  <button type="button" className="btn-cancel-OP" onClick={handleCloseEditModal} disabled={submitting}>Cancelar</button>
                  <button type="submit" className="btn-submit-OP" disabled={submitting}>{submitting ? 'Actualizando...' : 'Actualizar Oferta'}</button>
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

export default OffersPage;