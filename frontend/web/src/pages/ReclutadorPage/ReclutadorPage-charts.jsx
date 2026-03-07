import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import HeaderReclutador from "../../components/HeaderReclutador/HeaderReclutador";
import OfertaCard from "../../components/OfertaCard/ofertaCard";
import VerPostulacionesRecibidas from "../../components/VerPostulacionesRecibidas/VerPostulacionesRecibidas";
import "./ReclutadorPage.css";
import { getOfertasPorEmpresa } from "../../api/ofertasAPI";
import { obtenerPostulacionesPorOferta } from "../../api/postulacionesAPI";
import reclutadoresApi from "../../api/reclutadoresApi";
import { getEmpresaById } from "../../api/empresaAPI";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function ReclutadorPage() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empresaData, setEmpresaData] = useState(null);
  const [totalPostulantes, setTotalPostulantes] = useState(0);
  const [estadisticas, setEstadisticas] = useState({
    ofertasAbiertas: 0,
    ofertasCerradas: 0,
    postulacionesPorEstado: { POSTULADO: 0, EN_REVISION: 0, ENTREVISTA: 0, RECHAZADO: 0, ACEPTADO: 0 },
    postulacionesPorOferta: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const reclutador = await reclutadoresApi.getMyProfile();
      
      if (reclutador?.empresa?.id) {
        const empresa = await getEmpresaById(reclutador.empresa.id);
        setEmpresaData(empresa);
        
        const ofertasData = await getOfertasPorEmpresa(empresa.id);
        setOfertas(ofertasData || []);

        // Calcular estadísticas
        let totalPostulaciones = 0;
        let abiertas = 0, cerradas = 0;
        const estadosCounts = { POSTULADO: 0, EN_REVISION: 0, ENTREVISTA: 0, RECHAZADO: 0, ACEPTADO: 0 };
        const postulacionesPorOferta = [];

        if (ofertasData?.length > 0) {
          for (const oferta of ofertasData) {
            if (oferta.estadoOferta === 'ABIERTA') abiertas++;
            else cerradas++;

            try {
              const postulaciones = await obtenerPostulacionesPorOferta(oferta.id);
              totalPostulaciones += (postulaciones?.length || 0);
              
              postulacionesPorOferta.push({
                nombre: oferta.titulo?.substring(0, 15) || 'Oferta',
                count: postulaciones?.length || 0
              });

              postulaciones?.forEach(p => {
                if (estadosCounts[p.estado] !== undefined) {
                  estadosCounts[p.estado]++;
                }
              });
            } catch (err) {
              console.warn(`Error postulaciones ${oferta.id}:`, err);
              postulacionesPorOferta.push({ nombre: oferta.titulo?.substring(0, 15) || 'Oferta', count: 0 });
            }
          }
          setTotalPostulantes(totalPostulaciones);
          setEstadisticas({
            ofertasAbiertas: abiertas,
            ofertasCerradas: cerradas,
            postulacionesPorEstado: estadosCounts,
            postulacionesPorOferta: postulacionesPorOferta.slice(0, 6)
          });
        }
      } else {
        setEmpresaData(null);
        setOfertas([]);
        setTotalPostulantes(0);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Configuración de gráficos
  const ofertasChart = {
    labels: ['Abiertas', 'Cerradas'],
    datasets: [{
      data: [estadisticas.ofertasAbiertas, estadisticas.ofertasCerradas],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0
    }]
  };

  const estadosChart = {
    labels: Object.keys(estadisticas.postulacionesPorEstado),
    datasets: [{
      label: 'Postulaciones',
      data: Object.values(estadisticas.postulacionesPorEstado),
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']
    }]
  };

  const postulacionesChart = {
    labels: estadisticas.postulacionesPorOferta.map(p => p.nombre),
    datasets: [{
      label: 'Postulaciones',
      data: estadisticas.postulacionesPorOferta.map(p => p.count),
      backgroundColor: '#2563eb'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  return (
    <>
      <HeaderReclutador />
      <main className="reclutador-main">
        <aside className="sidebar-nav">
          <nav className="nav-list-sidebar">
            <Link to="/Reclutador" className="nav-item-sidebar active">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              <span>Inicio</span>
            </Link>
            <Link to="/Reclutador/GestigOferts" className="nav-item-sidebar">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>Ofertas</span>
            </Link>
            <Link to="/Reclutador/RegistrarEmpresa" className="nav-item-sidebar">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21V7a2 2 0 0 1 2-2h3V3h4v2h3a2 2 0 0 1 2 2v14"></path>
                <path d="M3 21h18"></path>
              </svg>
              <span>Empresa</span>
            </Link>
            <Link to="/Reclutador/Configuracion" className="nav-item-sidebar">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
              </svg>
              <span>Config</span>
            </Link>
          </nav>
        </aside>

        <div className="content-wrapper">
          <div className="content-grid">
            <div className="column-left">
              {empresaData && (
                <Link to="/Reclutador/EnterprisePage" className="company-card-link">
                  <div className="company-card">
                    <div className="company-avatar">
                      <img src={empresaData?.logo || "https://via.placeholder.com/80"} alt="Logo" className="company-logo-img" />
                    </div>
                    <div className="company-info">
                      <h2 className="company-name">{empresaData?.nombre || 'Mi Empresa'}</h2>
                      <p className="company-role">{empresaData?.categoria || 'Empresa'}</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* ESTADÍSTICAS */}
              <section className="section-card">
                <div className="section-header">
                  <div className="section-title-group">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    </svg>
                    <h3 className="section-title">Estadísticas</h3>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon blue-bg">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2"></rect>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <p className="stat-value">{ofertas.length}</p>
                      <p className="stat-label">Ofertas</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon green-bg">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <p className="stat-value">{totalPostulantes}</p>
                      <p className="stat-label">Postulantes</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* GRÁFICOS */}
              <section className="section-card">
                <div className="section-header">
                  <h3 className="section-title">📊 Análisis</h3>
                </div>
                <div className="charts-grid">
                  <div className="chart-container">
                    <h4 className="chart-title">Estado de Ofertas</h4>
                    <div className="chart-wrapper">
                      <Doughnut data={ofertasChart} options={chartOptions} />
                    </div>
                  </div>
                  <div className="chart-container">
                    <h4 className="chart-title">Postulaciones por Estado</h4>
                    <div className="chart-wrapper">
                      <Bar data={estadosChart} options={chartOptions} />
                    </div>
                  </div>
                </div>
                <div className="chart-container-full">
                  <h4 className="chart-title">Postulaciones por Oferta</h4>
                  <div className="chart-wrapper-line">
                    <Bar data={postulacionesChart} options={chartOptions} />
                  </div>
                </div>
              </section>

              {/* OFERTAS */}
              <section className="section-card">
                <div className="section-header">
                  <div className="section-title-group">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2"></rect>
                    </svg>
                    <h3 className="section-title">Mis Ofertas</h3>
                  </div>
                  <Link to="/Reclutador/GestigOferts" className="section-link">
                    Ver todas →
                  </Link>
                </div>
                <div className="ofertas-container">
                  {loading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Cargando...</p>
                    </div>
                  ) : ofertas.length > 0 ? (
                    ofertas.slice(0, 3).map((oferta) => (
                      <OfertaCard key={oferta.id} titulo={oferta.titulo} descripcion={oferta.descripcion} salario={oferta.salario} ubicacion={oferta.ubicacion} />
                    ))
                  ) : (
                    <div className="empty-state">
                      <p className="empty-text">No hay ofertas</p>
                    </div>
                  )}
                </div>
                <div className="button-container">
                  <Link to="/Reclutador/Publicacion" className="btn-publish">+ Nueva Oferta</Link>
                </div>
              </section>

              {/* POSTULACIONES */}
              <section className="section-card">
                <div className="section-header">
                  <div className="section-title-group">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    </svg>
                    <h3 className="section-title">Postulaciones</h3>
                  </div>
                </div>
                <VerPostulacionesRecibidas ofertas={ofertas} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ReclutadorPage;
