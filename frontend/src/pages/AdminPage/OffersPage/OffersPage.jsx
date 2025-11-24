import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/Footer';
import './OffersPage.css';

function OffersPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroModalidad, setFiltroModalidad] = useState('todas');
  const [busqueda, setBusqueda] = useState('');


  const ofertasEjemplo = [
    {
      ofertaId: 1,
      titulo: 'Desarrollador Full Stack',
      empresa: 'SoftCorp',
      ubicacion: 'Bogotá D.C',
      modalidad: 'Remoto',
      tipoContrato: 'Tiempo completo',
      salario: '$3.500.000 - $5.000.000',
      categoria: 'TECNOLOGIA',
      estado: 'Activa',
      postulaciones: 45,
      fechaPublicacion: '2024-10-15'
    },
    {
      ofertaId: 2,
      titulo: 'Diseñador UX/UI',
      empresa: 'DesignHub',
      ubicacion: 'Medellín',
      modalidad: 'Híbrido',
      tipoContrato: 'Tiempo completo',
      salario: '$2.800.000 - $4.000.000',
      categoria: 'TECNOLOGIA',
      estado: 'Activa',
      postulaciones: 32,
      fechaPublicacion: '2024-10-18'
    },
    {
      ofertaId: 3,
      titulo: 'Contador Público',
      empresa: 'FinanzasPro',
      ubicacion: 'Bogotá D.C',
      modalidad: 'Presencial',
      tipoContrato: 'Tiempo completo',
      salario: '$3.000.000 - $3.800.000',
      categoria: 'FINANZAS',
      estado: 'Activa',
      postulaciones: 28,
      fechaPublicacion: '2024-10-20'
    },
    {
      ofertaId: 4,
      titulo: 'Analista de Marketing Digital',
      empresa: 'MarketingPlus',
      ubicacion: 'Cali',
      modalidad: 'Remoto',
      tipoContrato: 'Medio tiempo',
      salario: '$1.800.000 - $2.500.000',
      categoria: 'COMERCIO',
      estado: 'Inactiva',
      postulaciones: 15,
      fechaPublicacion: '2024-09-25'
    },
    {
      ofertaId: 5,
      titulo: 'Enfermero Profesional',
      empresa: 'HealthCare Plus',
      ubicacion: 'Barranquilla',
      modalidad: 'Presencial',
      tipoContrato: 'Tiempo completo',
      salario: '$2.500.000 - $3.200.000',
      categoria: 'SALUD',
      estado: 'Activa',
      postulaciones: 52,
      fechaPublicacion: '2024-10-22'
    },
    {
      ofertaId: 6,
      titulo: 'Docente de Matemáticas',
      empresa: 'EduFuture',
      ubicacion: 'Medellín',
      modalidad: 'Presencial',
      tipoContrato: 'Contrato temporal',
      salario: '$2.200.000 - $2.800.000',
      categoria: 'EDUCACION',
      estado: 'Pendiente',
      postulaciones: 0,
      fechaPublicacion: '2024-10-28'
    },
    {
      ofertaId: 7,
      titulo: 'Ingeniero de Datos',
      empresa: 'DataTech Solutions',
      ubicacion: 'Bogotá D.C',
      modalidad: 'Remoto',
      tipoContrato: 'Tiempo completo',
      salario: '$4.500.000 - $6.500.000',
      categoria: 'TECNOLOGIA',
      estado: 'Activa',
      postulaciones: 38,
      fechaPublicacion: '2024-10-12'
    }
  ];

  const [ofertas, setOfertas] = useState(ofertasEjemplo);

  const ofertasFiltradas = ofertas.filter(oferta => {
    const cumpleFiltroEstado = filtroEstado === 'todas' || oferta.estado === filtroEstado;
    const cumpleFiltroModalidad = filtroModalidad === 'todas' || oferta.modalidad === filtroModalidad;
    const cumpleBusqueda = oferta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           oferta.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
                           oferta.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltroEstado && cumpleFiltroModalidad && cumpleBusqueda;
  });

  const handleActivar = (id) => {
    setOfertas(ofertas.map(of => 
      of.ofertaId === id ? { ...of, estado: 'Activa' } : of
    ));
  };

  const handleDesactivar = (id) => {
    if (window.confirm('¿Estás seguro de desactivar esta oferta?')) {
      setOfertas(ofertas.map(of => 
        of.ofertaId === id ? { ...of, estado: 'Inactiva' } : of
      ));
    }
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta oferta? Esta acción no se puede deshacer.')) {
      setOfertas(ofertas.filter(of => of.ofertaId !== id));
    }
  };

  const handleVerDetalles = (id) => {
    navigate(`/admin/ofertas/${id}`);
  };

  const getEstadoBadgeClass = (estado) => {
    switch(estado) {
      case 'Activa': return 'badge-activa-OP';
      case 'Inactiva': return 'badge-inactiva-OP';
      case 'Pendiente': return 'badge-pendiente-OP';
      default: return '';
    }
  };

  const estadisticas = {
    total: ofertas.length,
    activas: ofertas.filter(o => o.estado === 'Activa').length,
    inactivas: ofertas.filter(o => o.estado === 'Inactiva').length,
    pendientes: ofertas.filter(o => o.estado === 'Pendiente').length,
    totalPostulaciones: ofertas.reduce((sum, o) => sum + o.postulaciones, 0)
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
            <div className="stat-card-OP stat-pendientes-OP">
              <div className="stat-icon-OP">⏳</div>
              <div>
                <div className="stat-number-OP">{estadisticas.pendientes}</div>
                <div className="stat-label-OP">Pendientes</div>
              </div>
            </div>
            <div className="stat-card-OP stat-postulaciones-OP">
              <div className="stat-icon-OP">📝</div>
              <div>
                <div className="stat-number-OP">{estadisticas.totalPostulaciones}</div>
                <div className="stat-label-OP">Total Postulaciones</div>
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
                  className={`filter-btn-OP ${filtroEstado === 'Activa' ? 'active' : ''}`}
                  onClick={() => setFiltroEstado('Activa')}
                >
                  Activas
                </button>
                <button
                  className={`filter-btn-OP ${filtroEstado === 'Inactiva' ? 'active' : ''}`}
                  onClick={() => setFiltroEstado('Inactiva')}
                >
                  Inactivas
                </button>
                <button
                  className={`filter-btn-OP ${filtroEstado === 'Pendiente' ? 'active' : ''}`}
                  onClick={() => setFiltroEstado('Pendiente')}
                >
                  Pendientes
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
                <option value="Remoto">Remoto</option>
                <option value="Presencial">Presencial</option>
                <option value="Híbrido">Híbrido</option>
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
                  <th>Tipo Contrato</th>
                  <th>Salario</th>
                  <th>Categoría</th>
                  <th>Postulaciones</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ofertasFiltradas.length > 0 ? (
                  ofertasFiltradas.map(oferta => (
                    <tr key={oferta.ofertaId}>
                      <td>{oferta.ofertaId}</td>
                      <td className="offer-title-OP">{oferta.titulo}</td>
                      <td className="company-name-OP">{oferta.empresa}</td>
                      <td>{oferta.ubicacion}</td>
                      <td>
                        <span className="modalidad-badge-OP">{oferta.modalidad}</span>
                      </td>
                      <td>{oferta.tipoContrato}</td>
                      <td className="salary-OP">{oferta.salario}</td>
                      <td>
                        <span className="categoria-badge-OP">{oferta.categoria}</span>
                      </td>
                      <td className="postulaciones-count-OP">{oferta.postulaciones}</td>
                      <td>
                        <span className={`estado-badge-OP ${getEstadoBadgeClass(oferta.estado)}`}>
                          {oferta.estado}
                        </span>
                      </td>
                      <td>{oferta.fechaPublicacion}</td>
                      <td>
                        <div className="actions-buttons-OP">
                          <button
                            className="btn-action-OP btn-view-OP"
                            onClick={() => handleVerDetalles(oferta.ofertaId)}
                            title="Ver detalles"
                          >
                            👁️
                          </button>
                          {oferta.estado === 'Activa' ? (
                            <button
                              className="btn-action-OP btn-deactivate-OP"
                              onClick={() => handleDesactivar(oferta.ofertaId)}
                              title="Desactivar"
                            >
                              ⏸️
                            </button>
                          ) : (
                            <button
                              className="btn-action-OP btn-activate-OP"
                              onClick={() => handleActivar(oferta.ofertaId)}
                              title="Activar"
                            >
                              ▶️
                            </button>
                          )}
                          <button
                            className="btn-action-OP btn-delete-OP"
                            onClick={() => handleEliminar(oferta.ofertaId)}
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
                    <td colSpan="12" className="no-results-OP">
                      No se encontraron ofertas con los filtros seleccionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default OffersPage;