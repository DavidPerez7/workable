import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/Footer/footer';
import Sidebar from '../SideBar/Sidebar';
import { getAllOfertas, crearOferta, actualizarOferta, eliminarOferta, cambiarEstadoOferta } from '../../../api/ofertasAPI';
import { getAllEmpresasDto } from '../../../api/empresaAPI';
import { obtenerConteoPostulacionesPorOferta } from '../../../api/postulacionesAPI';
import './AdminOfertas.css';
import OffersTable from './OffersTable';
import OffersPostulacionesModal from './OffersPostulacionesModal/OffersPostulacionesModal';

function OffersPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroModalidad, setFiltroModalidad] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [ofertas, setOfertas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    requisitos: '',
    empresa: '',
    salario: '',
    numeroVacantes: '',
    modalidad: 'PRESENCIAL',
    nivelExperiencia: 'SIN_EXPERIENCIA',
    tipoContrato: 'TIEMPO_COMPLETO'
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [showPostulacionesModal, setShowPostulacionesModal] = useState(false);
  const [selectedOfertaIdForPostulaciones, setSelectedOfertaIdForPostulaciones] = useState(null);

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
      // Fetch postulaciones count for each oferta
      const ofertasWithCount = await Promise.all(
        ofertasData.map(async (oferta) => {
          try {
            const count = await obtenerConteoPostulacionesPorOferta(oferta.id);
            return { ...oferta, postulacionesCount: count };
          } catch (err) {
            console.error(`Error fetching count for oferta ${oferta.id}:`, err);
            return { ...oferta, postulacionesCount: 0 };
          }
        })
      );
      setOfertas(ofertasWithCount);
      setEmpresas(empresasData);
      setLastUpdated(new Date());
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
    if (!formData.requisitos || !formData.requisitos.trim()) {
      setError("El campo 'requisitos' es obligatorio");
      return;
    }
    if (!formData.requisitos || !formData.requisitos.trim()) {
      setError("El campo 'requisitos' es obligatorio");
      return;
    }

    try {
      setSubmitting(true);
      const today = new Date();
      const fechaLimite = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
      const nuevaOferta = {
        titulo: formData.titulo,
        descripcion: formData.descripcion || '',
        requisitos: formData.requisitos || '',
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
        requisitos: '',
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
      requisitos: oferta.requisitos || '',
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
        requisitos: formData.requisitos || '',
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
      const ofertaOriginal = ofertas.find(o => o.id === id);
      if (!ofertaOriginal) throw new Error('Oferta no encontrada');
      const nuevoIsActive = !(ofertaOriginal.isActive ?? true);
      const nuevoEstado = nuevoIsActive ? 'ABIERTA' : 'CERRADA';
      const ofertaActualizada = { ...ofertaOriginal, isActive: nuevoIsActive, estado: nuevoEstado };
      await actualizarOferta(id, ofertaActualizada);
      setOfertas(ofertas.map(of => of.id === id ? { ...of, ...ofertaActualizada } : of));
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError('Error al cambiar estado: ' + (err.message || ''));
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta oferta? Esta acción no se puede deshacer.')) {
      try {
        setDeletingIds(prev => [...prev, id]);
        await eliminarOferta(id);
        setOfertas(ofertas.filter(of => of.id !== id));
      } catch (err) {
        console.error('Error al eliminar oferta:', err);
        setError('Error al eliminar oferta: ' + (err.message || ''));
      }
      finally {
        setDeletingIds(prev => prev.filter(x => x !== id));
      }
    }
  };

  const handleViewPostulaciones = (ofertaId) => {
    setSelectedOfertaIdForPostulaciones(ofertaId);
    setShowPostulacionesModal(true);
  };

  const handleClosePostulacionesModal = () => {
    setSelectedOfertaIdForPostulaciones(null);
    setShowPostulacionesModal(false);
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
    activas: ofertas.filter(o => o.estado === 'ABIERTA').length,
    inactivas: ofertas.filter(o => o.estado === 'CERRADA').length
  };

  return (
    <>
      <div className="admin-layout">
        <Sidebar />
        <main className="main-offers-page-OP">
          <div className="container-offers-page-OP">
          
          <div className="header-section-OP">
            <div>
              <h1 className="title-offers-OP">GESTIONAR OFERTAS</h1>
              <p className="subtitle-offers-OP">Última actualización: {lastUpdated?.toLocaleString()}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn-back-OP"
                onClick={() => setShowModal(true)}
                style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                + Nueva Oferta
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
                  <svg className="stat-icon-OP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                  <div>
                    <div className="stat-number-OP">{estadisticas.total}</div>
                    <div className="stat-label-OP">Total Ofertas</div>
                  </div>
                </div>
                <div className="stat-card-OP stat-activas-OP">
                  <svg className="stat-icon-OP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <div>
                    <div className="stat-number-OP">{estadisticas.activas}</div>
                    <div className="stat-label-OP">Ofertas Activas</div>
                  </div>
                </div>
                <div className="stat-card-OP stat-inactivas-OP">
                  <svg className="stat-icon-OP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
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
                  <button className="search-btn-OP" type="button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="filter-buttons-OP">
                  <button
                    className={`filter-oferta1 ${filtroEstado === 'todas' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('todas')}
                  >
                    TODAS
                  </button>
                  <button
                    className={`filter-oferta2 ${filtroEstado === 'ABIERTA' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('ABIERTA')}
                  >
                    ABIERTA
                  </button>
                  <button
                    className={`filter-oferta3 ${filtroEstado === 'CERRADA' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('CERRADA')}
                  >
                    CERRADA
                  </button>
                </div>
              </div>

              <OffersTable
                ofertas={ofertasFiltradas}
                onEdit={handleEditOferta}
                onChangeState={handleCambiarEstado}
                onDelete={handleEliminar}
                deletingIds={deletingIds}
                onViewPostulaciones={handleViewPostulaciones}
                getEstadoBadgeClass={getEstadoBadgeClass}
              />
            </>
          )}
        </div>

        {/* MODAL PARA CREAR OFERTA */}
        {showModal && (
          <div className="modal-overlay-OP" onClick={handleCloseModal}>
            <div className="modal-content-OP" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-OP">
                <h2>Crear Nueva Oferta</h2>
                <button className="modal-close-btn-OP" onClick={handleCloseModal}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
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
                  <label>Requisitos *</label>
                  <textarea name="requisitos" value={formData.requisitos} onChange={handleInputChange} placeholder="Requisitos (máx 500 caracteres)" rows="2" maxLength={500} required />
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
                <button className="modal-close-btn-OP" onClick={handleCloseEditModal}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
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
                  <label>Requisitos *</label>
                  <textarea name="requisitos" value={formData.requisitos} onChange={handleInputChange} placeholder="Requisitos (máx 500 caracteres)" rows="2" maxLength={500} required />
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
      </div>
      <OffersPostulacionesModal
        isOpen={showPostulacionesModal}
        onClose={handleClosePostulacionesModal}
        ofertaId={selectedOfertaIdForPostulaciones}
      />
      <Footer />
    </>
  );
}

export default OffersPage;