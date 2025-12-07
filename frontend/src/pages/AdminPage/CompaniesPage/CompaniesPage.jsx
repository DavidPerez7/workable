import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/footer';
import './CompaniesPage.css';

function CompaniesPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');


  const empresasEjemplo = [
    {
      empresaId: 1,
      nombre: 'SoftCorp',
      nit: '900123456-1',
      correo: 'contacto@softcorp.com',
      telefono: '3001234567',
      ubicacion: 'Bogotá D.C',
      categoria: 'TECNOLOGIA',
      estadoAprobacion: 'Aprobado',
      fechaRegistro: '2024-10-15'
    },
    {
      empresaId: 2,
      nombre: 'AgroTech Solutions',
      correo: 'info@agrotech.com',
      nit: '900234567-2',
      telefono: '3012345678',
      ubicacion: 'Medellín',
      categoria: 'TECNOLOGIA',
      estadoAprobacion: 'Pendiente',
      fechaRegistro: '2024-10-20'
    },
    {
      empresaId: 3,
      nombre: 'EduFuture',
      nit: '900345678-3',
      correo: 'contacto@edufuture.com',
      telefono: '3023456789',
      ubicacion: 'Cali',
      categoria: 'EDUCACION',
      estadoAprobacion: 'Aprobado',
      fechaRegistro: '2024-10-12'
    },
    {
      empresaId: 4,
      nombre: 'HealthCare Plus',
      nit: '900456789-4',
      correo: 'info@healthcare.com',
      telefono: '3034567890',
      ubicacion: 'Bogotá D.C',
      categoria: 'SALUD',
      estadoAprobacion: 'Rechazado',
      fechaRegistro: '2024-10-18'
    },
    {
      empresaId: 5,
      nombre: 'FinanzasPro',
      nit: '900567890-5',
      correo: 'contacto@finanzaspro.com',
      telefono: '3045678901',
      ubicacion: 'Barranquilla',
      categoria: 'FINANZAS',
      estadoAprobacion: 'Pendiente',
      fechaRegistro: '2024-10-22'
    }
  ];

  const [empresas, setEmpresas] = useState(empresasEjemplo);

  const empresasFiltradas = empresas.filter(empresa => {
    const cumpleFiltro = filtroEstado === 'todas' || empresa.estadoAprobacion === filtroEstado;
    const cumpleBusqueda = empresa.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           empresa.nit.includes(busqueda) ||
                           empresa.correo.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  const handleAprobar = (id) => {
    setEmpresas(empresas.map(emp => 
      emp.empresaId === id ? { ...emp, estadoAprobacion: 'Aprobado' } : emp
    ));
  };

  const handleRechazar = (id) => {
    if (window.confirm('¿Estás seguro de rechazar esta empresa?')) {
      setEmpresas(empresas.map(emp => 
        emp.empresaId === id ? { ...emp, estadoAprobacion: 'Rechazado' } : emp
      ));
    }
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.')) {
      setEmpresas(empresas.filter(emp => emp.empresaId !== id));
    }
  };

  const handleVerDetalles = (id) => {
    navigate(`/admin/empresas/${id}`);
  };

  const getEstadoBadgeClass = (estado) => {
    switch(estado) {
      case 'Aprobado': return 'badge-aprobado-CP';
      case 'Pendiente': return 'badge-pendiente-CP';
      case 'Rechazado': return 'badge-rechazado-CP';
      default: return '';
    }
  };

  const estadisticas = {
    total: empresas.length,
    aprobadas: empresas.filter(e => e.estadoAprobacion === 'Aprobado').length,
    pendientes: empresas.filter(e => e.estadoAprobacion === 'Pendiente').length,
    rechazadas: empresas.filter(e => e.estadoAprobacion === 'Rechazado').length
  };

  return (
    <>
      <HeaderAdmin />
      <main className="main-companies-page-CP">
        <div className="container-companies-page-CP">
          
          <div className="header-section-CP">
            <div>
              <h1 className="title-companies-CP">Gestión de Empresas</h1>
              <p className="subtitle-companies-CP">
                Administra las empresas registradas en la plataforma
              </p>
            </div>
            <button 
              className="btn-back-CP"
              onClick={() => navigate('/Administrador')}
            >
              ← Volver al Panel
            </button>
          </div>


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
                <div className="stat-number-CP">{estadisticas.aprobadas}</div>
                <div className="stat-label-CP">Aprobadas</div>
              </div>
            </div>
            <div className="stat-card-CP stat-pendientes-CP">
              <div className="stat-icon-CP">⏳</div>
              <div>
                <div className="stat-number-CP">{estadisticas.pendientes}</div>
                <div className="stat-label-CP">Pendientes</div>
              </div>
            </div>
            <div className="stat-card-CP stat-rechazadas-CP">
              <div className="stat-icon-CP">❌</div>
              <div>
                <div className="stat-number-CP">{estadisticas.rechazadas}</div>
                <div className="stat-label-CP">Rechazadas</div>
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
                Aprobadas
              </button>
              <button
                className={`filter-btn-CP ${filtroEstado === 'Pendiente' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('Pendiente')}
              >
                Pendientes
              </button>
              <button
                className={`filter-btn-CP ${filtroEstado === 'Rechazado' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('Rechazado')}
              >
                Rechazadas
              </button>
            </div>
          </div>


          <div className="table-container-CP">
            <table className="companies-table-CP">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Empresa</th>
                  <th>NIT</th>
                  <th>Contacto</th>
                  <th>Ubicación</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empresasFiltradas.length > 0 ? (
                  empresasFiltradas.map(empresa => (
                    <tr key={empresa.empresaId}>
                      <td>{empresa.empresaId}</td>
                      <td className="empresa-name-CP">{empresa.nombre}</td>
                      <td>{empresa.nit}</td>
                      <td>
                        <div className="contact-info-CP">
                          <div>{empresa.correo}</div>
                          <div className="phone-CP">{empresa.telefono}</div>
                        </div>
                      </td>
                      <td>{empresa.ubicacion}</td>
                      <td>
                        <span className="categoria-badge-CP">{empresa.categoria}</span>
                      </td>
                      <td>
                        <span className={`estado-badge-CP ${getEstadoBadgeClass(empresa.estadoAprobacion)}`}>
                          {empresa.estadoAprobacion}
                        </span>
                      </td>
                      <td>{empresa.fechaRegistro}</td>
                      <td>
                        <div className="actions-buttons-CP">
                          <button
                            className="btn-action-CP btn-view-CP"
                            onClick={() => handleVerDetalles(empresa.empresaId)}
                            title="Ver detalles"
                          >
                            👁️
                          </button>
                          {empresa.estadoAprobacion === 'Pendiente' && (
                            <>
                              <button
                                className="btn-action-CP btn-approve-CP"
                                onClick={() => handleAprobar(empresa.empresaId)}
                                title="Aprobar"
                              >
                                ✓
                              </button>
                              <button
                                className="btn-action-CP btn-reject-CP"
                                onClick={() => handleRechazar(empresa.empresaId)}
                                title="Rechazar"
                              >
                                ✗
                              </button>
                            </>
                          )}
                          <button
                            className="btn-action-CP btn-delete-CP"
                            onClick={() => handleEliminar(empresa.empresaId)}
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
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CompaniesPage;