import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderReclutador from "../../components/HeaderReclutador/HeaderReclutador";
import OfertaCard from "../../components/OfertaCard/ofertaCard";
import VerPostulacionesRecibidas from "../../components/VerPostulacionesRecibidas/VerPostulacionesRecibidas";
import "./ReclutadorPage.css";
import { getOfertasPorEmpresa } from "../../api/ofertasAPI";
import { obtenerPostulacionesPorOferta } from "../../api/postulacionesAPI";
import reclutadoresApi from "../../api/reclutadoresApi";
import { getEmpresaById } from "../../api/empresaAPI";

function ReclutadorPage() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empresaData, setEmpresaData] = useState(null);
  const [totalPostulantes, setTotalPostulantes] = useState(0);

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

        if (ofertasData?.length > 0) {
          let totalPostulaciones = 0;
          for (const oferta of ofertasData) {
            try {
              const postulaciones = await obtenerPostulacionesPorOferta(oferta.id);
              totalPostulaciones += (postulaciones?.length || 0);
            } catch (err) {
              console.warn(`Error postulaciones ${oferta.id}:`, err);
            }
          }
          setTotalPostulantes(totalPostulaciones);
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

  return (
    <>
      <HeaderReclutador />
      <main className="reclutador-main">
        {/* SIDEBAR */}
        <aside className="sidebar-nav">
          <nav className="nav-list-sidebar">
            <Link to="/Reclutador" className="nav-item-sidebar active">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
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
                <path d="M12 1v6m0 6v6m8.66-9l-5.2 3m-5.92 3l-5.2 3"></path>
              </svg>
              <span>Configuración</span>
            </Link>
          </nav>
        </aside>

        {/* CONTENT */}
        <div className="content-wrapper">
          <div className="content-grid">
            <div className="column-left">
              {/* EMPRESA */}
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

              {/* OFERTAS SECTION */}
              <section className="section-card">
                <div className="section-header">
                  <div className="section-title-group">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <h3 className="section-title">Mis Ofertas</h3>
                  </div>
                  <Link to="/Reclutador/GestigOferts" className="section-link">
                    Ver todas
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>

                <div className="ofertas-container">
                  {loading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Cargando ofertas...</p>
                    </div>
                  ) : ofertas.length > 0 ? (
                    ofertas.slice(0, 3).map((oferta) => (
                      <OfertaCard
                        key={oferta.id}
                        titulo={oferta.titulo || oferta.nom || "Sin título"}
                        descripcion={oferta.descripcion || oferta.desc || "Sin descripción"}
                        salario={oferta.salario || oferta.sueldo || 0}
                        ubicacion={oferta.ubicacion || oferta.ubi || "No especificada"}
                      />
                    ))
                  ) : (
                    <div className="empty-state">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      <p className="empty-text">No hay ofertas</p>
                      <p className="empty-subtext">Publica tu primera oferta</p>
                    </div>
                  )}
                </div>

                <div className="button-container">
                  <Link to="/Reclutador/Publicacion" className="btn-publish">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Nueva Oferta
                  </Link>
                </div>
              </section>

              {/* ESTADÍSTICAS */}
              <section className="section-card">
                <div className="section-header">
                  <div className="section-title-group">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    <h3 className="section-title">Estadísticas</h3>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon blue-bg">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
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

              {/* POSTULACIONES RECIBIDAS */}
              <section className="section-card">
                <div className="section-header">
                  <div className="section-title-group">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <h3 className="section-title">Postulaciones</h3>
                  </div>
                  <Link to="/Reclutador/VerPostulacionesRecibidas" className="section-link">
                    Ver todas
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
                <VerPostulacionesRecibidas ofertas={ofertas} />
              </section>

              {/* INFO EMPRESA */}
              {empresaData && (
                <div className="banner-card">
                  <div className="banner-content">
                    <h3 className="banner-title">📋 Información Empresa</h3>
                    <div className="banner-text">
                      <p><strong>Nombre:</strong> <span>{empresaData.nombre}</span></p>
                      <p><strong>Descripción:</strong> <span>{empresaData.descripcion || 'No disponible'}</span></p>
                      <p><strong>Dirección:</strong> <span>{empresaData.direccion || empresaData.ubicacion || 'No disponible'}</span></p>
                      <p><strong>NIT:</strong> <span>{empresaData.nit || 'No disponible'}</span></p>
                      {empresaData.correo && <p><strong>Email:</strong> <span>{empresaData.correo}</span></p>}
                      {empresaData.telefono && <p><strong>Teléfono:</strong> <span>{empresaData.telefono}</span></p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="column-right"></div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ReclutadorPage;
