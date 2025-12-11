import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOfertasPorEmpresa } from "../../../api/ofertasAPI";
import { getEmpresaById } from "../../../api/empresaAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import Footer from "../../../components/Footer/footer";
import "./EnterprisePage.css";

function EnterprisePage() {
  const navigate = useNavigate();
  const { nitId } = useParams();
  const [empresaData, setEmpresaData] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("descripcion");

  useEffect(() => {
    fetchEmpresaData();
  }, []);

  const fetchEmpresaData = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Primero intentar obtener el reclutador para saber su empresa
      let empresaId = user.empresaId;
      
      if (!empresaId && user.correo) {
        try {
          const reclutador = await reclutadoresApi.getByCorreo(user.correo);
          empresaId = reclutador.empresa?.id;
          
          // Actualizar localStorage
          if (empresaId) {
            user.empresaId = empresaId;
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (err) {
          console.warn('No se pudo obtener el reclutador:', err);
        }
      }

      if (!empresaId) {
        setError('No tienes una empresa asociada. Por favor registra una empresa primero.');
        setLoading(false);
        return;
      }

      // Cargar datos completos de la empresa
      const empresaInfo = await getEmpresaById(empresaId);
      setEmpresaData(empresaInfo);

      // Cargar ofertas de la empresa
      try {
        const ofertasData = await getOfertasPorEmpresa(empresaId);
        setOfertas(ofertasData || []);
      } catch (err) {
        console.warn('No se pudieron cargar las ofertas:', err);
        setOfertas([]);
      }

    } catch (error) {
      console.error("Error al cargar empresa:", error);
      setError(error.message || 'Error al cargar información de la empresa');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <div className="loading-container-EP">
          <div className="spinner-large-EP"></div>
          <p>Cargando información de la empresa...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!empresaData) {
    return (
      <>
        <HeaderReclutador />
        <div className="error-container-EP">
          <h2>Empresa no encontrada</h2>
          <button className="btn-back-EP" onClick={() => navigate("/Reclutador/EnterprisePage/Create")}>Registrar empresa</button>
          <Link to="/" className="btn-back-EP">
            Volver al inicio
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      <main className="enterprise-main-EP">
        {/* Hero Section con Banner */}
        <section className="enterprise-hero-EP">
          <div
            className="hero-banner-EP"
            style={{
              backgroundImage: `url(${empresaData.banner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div className="hero-content-wrapper-EP">
            <div className="hero-content-EP">
              <div className="enterprise-logo-large-EP">
                <img src={empresaData.logo || 'https://via.placeholder.com/150'} alt={empresaData.nombre} />
              </div>

              <div className="enterprise-info-EP">
                <h1 className="enterprise-name-EP">{empresaData.nombre}</h1>
                {empresaData.empresaCategoria?.nombre && (
                  <p className="enterprise-category-EP">
                    {empresaData.empresaCategoria.nombre}
                  </p>
                )}

                <div className="enterprise-meta-EP">
                  {empresaData.municipio && (
                    <span className="meta-item-EP">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {empresaData.municipio.nombre}
                      {empresaData.municipio.departamento?.nombre && `, ${empresaData.municipio.departamento.nombre}`}
                    </span>
                  )}
                  <span className="meta-separator-EP">·</span>
                </div>

                <div className="enterprise-actions-EP">
                  <button className="btn-follow-EP" onClick={() => navigate("/Reclutador/EnterprisePage/Edit")}>Editar información</button>
                  <button className="btn-see-jobs-EP">Ver empleos</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navegación de Tabs */}
        <nav className="enterprise-tabs-EP">
          <div className="tabs-wrapper-EP">
            <button
              className={`tab-btn-EP ${
                activeTab === "descripcion" ? "active" : ""
              }`}
              onClick={() => setActiveTab("descripcion")}
            >
              Descripción
            </button>
            <button
              className={`tab-btn-EP ${
                activeTab === "empleos" ? "active" : ""
              }`}
              onClick={() => setActiveTab("empleos")}
            >
              Empleos
              <span className="tab-badge-EP">{ofertas.length}</span>
            </button>
            <button
              className={`tab-btn-EP ${activeTab === "vida" ? "active" : ""}`}
              onClick={() => setActiveTab("vida")}
            >
              Vida en la empresa
            </button>
          </div>
        </nav>

        {/* Contenido de Tabs */}
        <div className="enterprise-content-EP">
          <div className="content-wrapper-EP">
            {/* Tab: Descripción */}
            {activeTab === "descripcion" && (
              <div className="tab-content-EP">
                <section className="section-card-EP">
                  <h2 className="section-title-EP">
                    Acerca de {empresaData.nombre}
                  </h2>

                  <p className="section-text-EP">{empresaData.descripcion}</p>
                  <div className="empresa-details-table-EP">
                    <table>
                      <tbody>
                        <tr><td><b>ID</b></td><td>{empresaData.id}</td></tr>
                        <tr><td><b>NIT</b></td><td>{empresaData.nit}</td></tr>
                        <tr><td><b>Razón social</b></td><td>{empresaData.razonSocial}</td></tr>
                        <tr><td><b>Fecha de creación</b></td><td>{empresaData.fechaCreacion}</td></tr>
                        <tr><td><b>Activo</b></td><td>{empresaData.isActive ? 'Sí' : 'No'}</td></tr>
                        <tr><td><b>Código invitación</b></td><td>{empresaData.codigoInvitacion}</td></tr>
                        <tr><td><b>Dueño (reclutador)</b></td><td>{empresaData.reclutadorOwner ? empresaData.reclutadorOwner.nombre + ' ' + empresaData.reclutadorOwner.apellido : 'N/A'}</td></tr>
                        <tr><td><b>Municipio</b></td><td>{empresaData.municipio ? empresaData.municipio.nombre : 'N/A'}</td></tr>
                        <tr><td><b>Puntuación</b></td><td>{empresaData.puntuacion}</td></tr>
                        <tr><td><b>Email contacto</b></td><td>{empresaData.emailContacto}</td></tr>
                        <tr><td><b>Teléfono contacto</b></td><td>{empresaData.telefonoContacto}</td></tr>
                        <tr><td><b>Website</b></td><td>{empresaData.website}</td></tr>
                        <tr><td><b>Logo URL</b></td><td>{empresaData.logoUrl}</td></tr>
                        <tr><td><b>Redes sociales</b></td><td>{empresaData.redesSociales && empresaData.redesSociales.length > 0 ? empresaData.redesSociales.join(', ') : 'N/A'}</td></tr>
                        <tr><td><b>Direcciones</b></td><td>{empresaData.direcciones && empresaData.direcciones.length > 0 ? empresaData.direcciones.join(', ') : 'N/A'}</td></tr>
                        <tr><td><b>Categorías</b></td><td>{empresaData.categories && empresaData.categories.length > 0 ? Array.from(empresaData.categories).join(', ') : 'N/A'}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="enterprise-stats-grid-EP">
                    <div className="stat-item-EP">
                      <div className="stat-icon-EP blue-bg-EP">
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
                      <div>
                        <p className="stat-value-EP">
                          {empresaData.numeroTrabajadores}+
                        </p>
                        <p className="stat-label-EP">Empleados</p>
                      </div>
                    </div>

                    <div className="stat-item-EP">
                      <div className="stat-icon-EP green-bg-EP">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                      <div>
                        <p className="stat-value-EP">
                          {empresaData.puntuacion} / 5.0
                        </p>
                        <p className="stat-label-EP">Valoración</p>
                      </div>
                    </div>

                    <div className="stat-item-EP">
                      <div className="stat-icon-EP amber-bg-EP">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="stat-value-EP">
                          {empresaData.fechaUnion ? new Date(empresaData.fechaUnion).getFullYear() : 'N/A'}
                        </p>
                        <p className="stat-label-EP">En la plataforma</p>
                      </div>
                    </div>
                  </div>
                </section>

                {empresaData.empresaCategoria?.nombre && (
                  <section className="section-card-EP">
                    <h2 className="section-title-EP">Categoría</h2>
                    <div className="category-tag-EP">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
                      <div>
                        <p className="category-name-EP">
                          {empresaData.empresaCategoria.nombre}
                        </p>
                        <p className="category-desc-EP">
                          {empresaData.empresaCategoria.descripcion}
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* Tab: Empleos */}
            {activeTab === "empleos" && (
              <div className="tab-content-EP">
                <section className="section-card-EP">
                  <div className="section-header-EP" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'1.2rem'}}>
                      <h2 className="section-title-EP">Empleos publicados recientemente</h2>
                      <span className="count-badge-EP">{ofertas.length} ofertas activas</span>
                    </div>
                    <button className="btn-compact-create-EP" onClick={()=>navigate('/Reclutador/Publicacion')} title="Crear nueva oferta">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      <span style={{marginLeft:6}}>Nueva oferta</span>
                    </button>
                  </div>
                  {ofertas.length > 0 ? (
                    <div className="jobs-list-EP">
                      {ofertas.map((oferta) => (
                        <div key={oferta.id} className="job-card-EP">
                          <div className="job-header-EP">
                            <img
                              src={empresaData.logo}
                              alt={empresaData.nombre}
                              className="job-logo-EP"
                            />
                            <div className="job-info-EP">
                              <h3 className="job-title-EP">{oferta.titulo}</h3>
                              <p className="job-company-EP">{empresaData.nombre}</p>
                              <p className="job-location-EP">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                {oferta.ubicacion} · {oferta.modalidad?.nombre}
                              </p>
                            </div>
                            <div className="job-status-EP">
                              <span className="status-badge-active-EP">{oferta.estado}</span>
                            </div>
                          </div>
                          <p className="job-description-EP">{oferta.descripcion}</p>
                          <div className="job-details-EP">
                            <span className="job-detail-item-EP">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                              {formatSalary(oferta.salario)}
                            </span>
                            <span className="job-detail-item-EP">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                              {oferta.tipoContrato?.nombre}
                            </span>
                            <span className="job-detail-item-EP">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              Publicado el {formatDate(oferta.fechaPublicacion)}
                            </span>
                          </div>
                          <div className="job-actions-EP">
                            <Link to={`/oferta/${oferta.id}`} className="btn-view-job-EP">Ver oferta completa</Link>
                            <button className="btn-save-job-EP">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state-EP">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                      <p>No hay ofertas publicadas en este momento</p>
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === "vida" && (
              <div className="tab-content-EP">
                <section className="section-card-EP vida-section-EP">
                  <h2 className="section-title-EP">
                    Vida en {empresaData.nombre}
                  </h2>

                  <div className="vida-banner-EP">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                      alt="Vida en la empresa"
                    />
                    <div className="vida-overlay-EP">
                      <h3>Únete a nuestro equipo</h3>
                      <p>Descubre las oportunidades en {empresaData.nombre}</p>
                    </div>
                  </div>

                  <div className="vida-content-EP">
                    <p className="vida-text-EP">
                      En {empresaData.nombre}, creemos en la innovación, el
                      trabajo en equipo y el desarrollo profesional continuo.
                      Nuestro equipo está comprometido con la excelencia y la
                      inclusión, creando un ambiente donde cada persona puede
                      alcanzar su máximo potencial.
                    </p>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar-EP">
            <div className="sidebar-card-EP">
              <h3 className="sidebar-title-EP">Información de contacto</h3>
              <div className="contact-info-EP">
                <div className="contact-item-EP">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <div>
                    <p className="contact-label-EP">Ubicación</p>
                    <p className="contact-value-EP">
                      {empresaData.municipio.nombre}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default EnterprisePage;
