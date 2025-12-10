import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/footer';
import { getAllEmpresasDto } from '../../../api/empresaAPI';
import './CompaniesPage.css';

function CompaniesPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                           (empresa.correo && empresa.correo.toLowerCase().includes(busqueda.toLowerCase()));
    return cumpleFiltro && cumpleBusqueda;
  });

  const handleAprobar = (id) => {
    setEmpresas(empresas.map(emp => 
      emp.id === id ? { ...emp, isActive: true } : emp
    ));
  };

  const handleDesactivar = (id) => {
    if (window.confirm('¿Estás seguro de desactivar esta empresa?')) {
      setEmpresas(empresas.map(emp => 
        emp.id === id ? { ...emp, isActive: false } : emp
      ));
    }
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.')) {
      setEmpresas(empresas.filter(emp => emp.id !== id));
    }
  };

  const handleVerDetalles = (id) => {
    navigate(`/admin/empresas/${id}`);
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
                      <th>Empresa</th>
                      <th>NIT</th>
                      <th>Correo</th>
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
                          <td>{empresa.correo || 'N/A'}</td>
                          <td>
                            <span className={`estado-badge-CP ${getEstadoBadgeClass(empresa.isActive)}`}>
                              {empresa.isActive ? 'Activa' : 'Inactiva'}
                            </span>
                          </td>
                          <td>
                            <div className="actions-buttons-CP">
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
                        <td colSpan="6" className="no-results-CP">
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
      </main>
      <Footer />
    </>
  );
}

export default CompaniesPage;