import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/footer';
import { getAllOfertas } from '../../../api/ofertasAPI';
import './OffersPage.css';

function OffersPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroModalidad, setFiltroModalidad] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOfertas();
      setOfertas(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const ofertasFiltradas = ofertas.filter(oferta => {
    const cumpleFiltroEstado = filtroEstado === 'todas' || oferta.estadoOferta === filtroEstado;
    const cumpleFiltroModalidad = filtroModalidad === 'todas' || oferta.modalidad === filtroModalidad;
    const cumpleBusqueda = oferta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           (oferta.empresa?.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                           (oferta.municipio?.nombre || '').toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltroEstado && cumpleFiltroModalidad && cumpleBusqueda;
  });

  const handleActivar = (id) => {
    setOfertas(ofertas.map(of => 
      of.id === id ? { ...of, estadoOferta: 'ABIERTA' } : of
    ));
  };

  const handleDesactivar = (id) => {
    if (window.confirm('¿Estás seguro de desactivar esta oferta?')) {
      setOfertas(ofertas.map(of => 
        of.id === id ? { ...of, estadoOferta: 'CERRADA' } : of
      ));
    }
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta oferta? Esta acción no se puede deshacer.')) {
      setOfertas(ofertas.filter(of => of.id !== id));
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
      <HeaderAdmin />
      <main className="main-offers-page-OP">
        <div className="container-offers-page-OP">
          
          <div className="header-section-OP">
            <div>
              <h1 className="title-offers-OP">Gestión de Ofertas Laborales</h1>
              <p className="subtitle-offers-OP">
                Supervisa y modera las ofertas laborales publicadas en la plataforma
              </p>
            </div>
            <button 
              className="btn-back-OP"
              onClick={() => navigate('/Administrador')}
            >
              ← Volver al Panel
            </button>
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
                            <span className={`estado-badge-OP ${getEstadoBadgeClass(oferta.estadoOferta)}`}>
                              {oferta.estadoOferta === 'ABIERTA' ? 'Abierta' : 'Cerrada'}
                            </span>
                          </td>
                          <td>{new Date(oferta.fechaPublicacion).toLocaleDateString('es-CO')}</td>
                          <td>
                            <div className="actions-buttons-OP">
                              {oferta.estadoOferta === 'ABIERTA' ? (
                                <button
                                  className="btn-action-OP btn-deactivate-OP"
                                  onClick={() => handleDesactivar(oferta.id)}
                                  title="Cerrar oferta"
                                >
                                  ⏸️
                                </button>
                              ) : (
                                <button
                                  className="btn-action-OP btn-activate-OP"
                                  onClick={() => handleActivar(oferta.id)}
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
      </main>
      <Footer />
    </>
  );
}

export default OffersPage;