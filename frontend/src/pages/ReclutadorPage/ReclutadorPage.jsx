import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import HeaderReclutador from "../../components/HeaderReclutador/HeaderReclutador";
import OfertaCard from "../../components/OfertaCard/ofertaCard";
import "./ReclutadorPage.css";
import { getAllOfertas } from "../../api/ofertasAPI";

function ReclutadorPage() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const data = await getAllOfertas();
        setOfertas(data);
      } catch (error) {
        console.error("Error al obtener ofertas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfertas();
  }, []);

  return (
    <>
      <HeaderReclutador />
      <main className="reclutador-main">
        {/* Sidebar Navigation */}
        <aside className="sidebar-nav">
          <nav className="nav-list-sidebar">
            <Link to="/Reclutador" className="nav-item-sidebar active">
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Inicio</span>
            </Link>

            <Link to="/Reclutador/reclutamiento" className="nav-item-sidebar">
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <span>Reclutamiento</span>
            </Link>

            <Link to="/Reclutador/GestigOferts" className="nav-item-sidebar">
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Gestionar ofertas</span>
            </Link>

            <Link to="/Reclutador/Configuracion" className="nav-item-sidebar">
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m8.66-9l-5.2 3m-5.92 3l-5.2 3M1.34 9l5.2 3m5.92 3l5.2 3"></path>
              </svg>
              <span>Configuración</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="content-wrapper">
          <div className="content-grid">
            {/* Left Column */}
            <div className="column-left">
              {/* Company Info Card */}
              <Link
                to="/Reclutador/EnterprisePage"
                className="company-card-link"
              >
                <div className="company-card">
                  <div className="company-avatar">
                    <img
                      src="https://logodownload.org/wp-content/uploads/2014/04/coca-cola-logo-1-1.png"
                      alt="Logo empresa"
                      className="company-logo-img"
                    />
                  </div>
                  <div className="company-info">
                    <h2 className="company-name">Empresa genérica</h2>
                    <p className="company-role">Usuario administrador</p>
                  </div>
                </div>
              </Link>

              {/* Recruitment Section */}
              <section className="section-card">
                <div className="section-header">
                  <div className="section-title-group">
                    <svg
                      className="section-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="2"
                        y="7"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <h3 className="section-title">Reclutamiento</h3>
                  </div>
                  <Link to="/Reclutador/GestigOferts" className="section-link">
                    Gestionar avisos
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
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
                    ofertas
                      .slice(0, 3)
                      .map((oferta) => (
                        <OfertaCard
                          key={oferta.id}
                          titulo={oferta.titulo || oferta.nom || "Sin título"}
                          descripcion={
                            oferta.descripcion ||
                            oferta.desc ||
                            "Sin descripción"
                          }
                          salario={oferta.salario || oferta.sueldo || 0}
                          ubicacion={
                            oferta.ubicacion || oferta.ubi || "No especificada"
                          }
                        />
                      ))
                  ) : (
                    <div className="empty-state">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <rect
                          x="2"
                          y="7"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      <p className="empty-text">No hay ofertas disponibles</p>
                      <p className="empty-subtext">
                        Publica tu primera oferta para comenzar
                      </p>
                    </div>
                  )}
                </div>

                <div className="button-container">
                  <Link to="/Reclutador/Publicacion" className="btn-publish">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Publicar oferta
                  </Link>
                </div>
              </section>

              {/* Statistics Section */}
              <section className="section-card">
                <div className="section-header">
                  <div className="section-title-group">
                    <svg
                      className="section-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    <h3 className="section-title">Estadísticas</h3>
                  </div>
                  <Link to="/Reclutador/estadisticas" className="section-link">
                    Ver más
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon blue-bg">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <p className="stat-value">248</p>
                      <p className="stat-label">Total candidatos</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon green-bg">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <p className="stat-value">42</p>
                      <p className="stat-label">Contrataciones</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="column-right">
              <div className="banner-card">
                <div className="banner-content">
                  <h3 className="banner-title">Informacion de la empresa</h3>
                  <p className="banner-text">
                    <p>
                      Descripcion:{" "}
                      <span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Deleniti dicta, saepe vitae numquam culpa qui? Beatae
                        est ea quod asperiores voluptate. Pariatur delectus
                        provident possimus ipsam dolores ad laboriosam quam?
                      </span>
                    </p>
                    <p>
                      Numero de trabajadores: <span>30</span>
                    </p>
                    <div className="banner-puntuation">
                      <p>Puntuacion: </p>
                      <div className="banner-puntuation">
                        <FaStar color="#ffffff" />
                        <FaStar color="#ffffff" />
                        <FaStar color="#ffffff" />
                        <FaStar color="#ffffff" />
                      </div>
                    </div>
                    <p>
                      Fecha de creacion: <span>10/10/2020</span>
                    </p>
                    <p>
                      Email: <span>info@generico.com</span>
                    </p>
                    <p>
                      Telefono: <span>+123456789</span>
                    </p>
                  </p>
                </div>
              </div>

              <section className="section-card">
                <div className="section-header">
                  <div className="section-title-group">
                    <svg
                      className="section-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <h3 className="section-title">Reviews</h3>
                  </div>
                  <Link to="/Reclutador/reviews" className="section-link">
                    Ver todas
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>

                <div className="reviews-container">
                  <div className="review-item">
                    <div className="review-header">
                      <div className="review-avatar">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div className="review-info">
                        <p className="review-name">Juan Pérez</p>
                        <div className="review-stars">⭐⭐⭐⭐⭐</div>
                      </div>
                    </div>
                    <p className="review-text">
                      Excelente proceso de selección, muy profesional y
                      transparente.
                    </p>
                  </div>

                  <div className="review-item">
                    <div className="review-header">
                      <div className="review-avatar">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div className="review-info">
                        <p className="review-name">María García</p>
                        <div className="review-stars">⭐⭐⭐⭐</div>
                      </div>
                    </div>
                    <p className="review-text">
                      Gran ambiente laboral y oportunidades de crecimiento.
                    </p>
                  </div>

                  <div className="empty-reviews">
                    <p className="empty-reviews-text">
                      No hay más reviews recientes
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ReclutadorPage;
