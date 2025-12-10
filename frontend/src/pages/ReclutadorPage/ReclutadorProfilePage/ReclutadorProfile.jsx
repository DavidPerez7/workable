import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getReclutadorPorCorreo } from "../../../api/reclutadoresApi";
import { getEmpresaById } from "../../../api/empresaAPI";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import Footer from "../../../components/Footer/footer";
import "./ReclutadorProfile.css";

function ReclutadorProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    correo: "",
    fotoPerfilUrl: "",
    fotoBannerUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener correo del usuario logueado
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const correo = user.correo;

      if (!correo) {
        throw new Error('No se encontró información del usuario');
      }

      // Obtener datos del reclutador
      const reclutadorData = await getReclutadorPorCorreo(correo);
      
      // Si tiene empresa, obtener datos de la empresa
      let empresaData = null;
      if (reclutadorData.empresa?.id) {
        try {
          empresaData = await getEmpresaById(reclutadorData.empresa.id);
        } catch (err) {
          console.warn('No se pudo cargar información de la empresa:', err);
        }
      }

      const profileInfo = {
        ...reclutadorData,
        empresa: empresaData || reclutadorData.empresa,
        ofertasPublicadas: 0, // TODO: Obtener de API de ofertas
        candidatosContratados: 0,
        conexiones: 0,
        seguidores: 0,
      };

      setProfileData(profileInfo);
      setEditForm({
        nombre: reclutadorData.nombre || '',
        correo: reclutadorData.correo || '',
        fotoPerfilUrl: reclutadorData.urlFotoPerfil || '',
        fotoBannerUrl: reclutadorData.urlBanner || '',
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      setError(error.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setShowEditSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowEditSidebar(false);
    // Restaurar valores originales
    setEditForm({
      nombre: profileData.nombre,
      correo: profileData.correo,
      fotoPerfilUrl: profileData.fotoPerfilUrl,
      fotoBannerUrl: profileData.fotoBannerUrl,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // TODO: Llamada real a API para actualizar
      // const response = await fetch(`http://localhost:8080/api/usuario/${profileData.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     nombre: editForm.nombre,
      //     correo: editForm.correo,
      //     telefono: profileData.telefono,
      //     fotoPerfilUrl: editForm.fotoPerfilUrl,
      //     rol: profileData.rol,
      //     municipio_id: profileData.municipio.id
      //   })
      // });

      // Simulación de guardado exitoso
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfileData((prev) => ({
        ...prev,
        nombre: editForm.nombre,
        correo: editForm.correo,
        fotoPerfilUrl: editForm.fotoPerfilUrl,
        fotoBannerUrl: editForm.fotoBannerUrl,
      }));

      setShowEditSidebar(false);
      alert("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar el perfil. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <div className="loading-container-RP">
          <div className="spinner-large-RP"></div>
          <p>Cargando perfil...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!profileData) {
    return (
      <>
        <HeaderReclutador />
        <div className="error-container-RP">
          <h2>Perfil no encontrado</h2>
          <Link to="/Reclutador" className="btn-back-RP">
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
      <main className="profile-main-RP">
        <div className="profile-container-RP">
          {/* Hero Section con Foto y Datos Básicos */}
          <section className="profile-hero-RP">
            <div
              className="hero-background-RP"
              style={{
                backgroundImage: `url(${profileData.fotoBannerUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <button className="btn-edit-profile-RP" onClick={handleEditClick}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar perfil
            </button>

            <div className="hero-content-RP">
              <div className="profile-avatar-large-RP">
                <img
                  src={profileData.fotoPerfilUrl}
                  alt={profileData.nombre}
                  className="avatar-img-RP"
                />
                <div className="avatar-badge-RP">
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
              </div>
              <div className="profile-info-main-RP">
                <div className="name-section-RP">
                  <h1 className="profile-name-RP">{profileData.nombre}</h1>
                  <span className="profile-role-badge-RP">Reclutador</span>
                </div>
                <p className="profile-title-RP">
                  Reclutador {profileData.empresa?.nombre ? `en ${profileData.empresa.nombre}` : ''}
                </p>
                <div className="profile-meta-RP">
                  <span className="meta-item-RP">
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
                    {profileData.municipio?.nombre || 'Ubicación no especificada'}
                    {profileData.municipio?.departamento?.nombre ? `, ${profileData.municipio.departamento.nombre}` : ''}
                  </span>
                  <span className="meta-separator-RP">·</span>
                  <span className="meta-item-RP">
                    <strong>{profileData.conexiones}+</strong> conexiones
                  </span>
                </div>
                {profileData.empresa && (
                  <div className="profile-company-RP">
                    <img
                      src={profileData.empresa.logo || 'https://via.placeholder.com/50'}
                      alt={profileData.empresa.nombre}
                      className="company-logo-small-RP"
                    />
                    <div>
                      <p className="company-name-RP">
                        {profileData.empresa.nombre}
                      </p>
                      <p className="company-desc-RP">
                        {profileData.empresa.descripcion}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="profile-actions-RP">
                <button className="btn-action-primary-RP">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {profileData.correo}
                </button>
              </div>
            </div>
          </section>

          {profileData.empresa ? (
            <Link to="/Reclutador/EnterprisePage" className="link-no-style-RP">
              <section className="profile-section-RP empresa-section-RP">
                <div className="section-header-profile-RP">
                  <h2 className="section-title-profile-RP">Empresa</h2>
                </div>
                <div className="empresa-card-RP">
                  <img
                    src={profileData.empresa.logo || 'https://via.placeholder.com/100'}
                    alt={profileData.empresa.nombre}
                    className="empresa-logo-RP"
                  />
                  <div className="empresa-info-RP">
                    <h3 className="empresa-name-RP">
                      {profileData.empresa.nombre}
                    </h3>
                    <p className="empresa-desc-RP">
                      {profileData.empresa.descripcion}
                    </p>
                    <div className="empresa-stats-RP">
                      <span className="empresa-stat-RP">
                        <svg
                          width="16"
                          height="16"
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
                        {profileData.empresa.numeroTrabajadores || 0} empleados
                      </span>
                      <span className="empresa-stat-RP">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        {profileData.empresa.puntuacion || 0} / 5.0
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </Link>
          ) : (
            <section className="profile-section-RP empresa-section-RP">
              <div className="section-header-profile-RP">
                <h2 className="section-title-profile-RP">Empresa</h2>
              </div>
              <div className="empresa-card-RP">
                <p>No tienes una empresa asociada. <Link to="/Reclutador/RegistrarEmpresa">Registrar empresa</Link></p>
              </div>
            </section>
          )}

          {/* Actividad */}
          <section className="profile-section-RP">
            <div className="section-header-profile-RP">
              <h2 className="section-title-profile-RP">Actividad</h2>
            </div>
            <div className="activity-content-RP">
              <p className="activity-text-RP">
                Las publicaciones de ofertas y actividad de reclutamiento de{" "}
                {profileData.nombre.split(" ")[0]} aparecen aquí.
              </p>
            </div>
          </section>

          {/* Estadísticas de Reclutador */}
          <section className="profile-section-RP stats-section-RP">
            <div className="section-header-profile-RP">
              <h2 className="section-title-profile-RP">
                Estadísticas de reclutamiento
              </h2>
            </div>
            <div className="recruiter-stats-RP">
              <div className="stat-box-RP">
                <div className="stat-icon-wrapper-RP blue-bg-RP">
                  <svg
                    width="28"
                    height="28"
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
                </div>
                <div className="stat-content-RP">
                  <p className="stat-number-RP">
                    {profileData.ofertasPublicadas}
                  </p>
                  <p className="stat-label-RP">Ofertas publicadas</p>
                </div>
              </div>
              <div className="stat-box-RP">
                <div className="stat-icon-wrapper-RP green-bg-RP">
                  <svg
                    width="28"
                    height="28"
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
                <div className="stat-content-RP">
                  <p className="stat-number-RP">
                    {profileData.candidatosContratados}
                  </p>
                  <p className="stat-label-RP">Candidatos contratados</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar de Edición */}
        {showEditSidebar && (
          <>
            <div
              className="sidebar-overlay-RP"
              onClick={handleCloseSidebar}
            ></div>
            <div className="edit-sidebar-RP">
              <div className="sidebar-header-RP">
                <h2>Editar perfil</h2>
                <button
                  className="btn-close-sidebar-RP"
                  onClick={handleCloseSidebar}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="sidebar-content-RP">
                <div className="form-group-RP">
                  <label className="form-label-RP">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={editForm.nombre}
                    onChange={handleInputChange}
                    className="form-input-RP"
                    placeholder="Ingresa tu nombre"
                  />
                </div>

                <div className="form-group-RP">
                  <label className="form-label-RP">Correo electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={editForm.correo}
                    onChange={handleInputChange}
                    className="form-input-RP"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="form-group-RP">
                  <label className="form-label-RP">URL de foto de perfil</label>
                  <input
                    type="url"
                    name="fotoPerfilUrl"
                    value={editForm.fotoPerfilUrl}
                    onChange={handleInputChange}
                    className="form-input-RP"
                    placeholder="https://ejemplo.com/foto.jpg"
                  />
                  {editForm.fotoPerfilUrl && (
                    <div className="preview-image-RP">
                      <img src={editForm.fotoPerfilUrl} alt="Preview perfil" />
                    </div>
                  )}
                </div>

                <div className="form-group-RP">
                  <label className="form-label-RP">URL de foto de banner</label>
                  <input
                    type="url"
                    name="fotoBannerUrl"
                    value={editForm.fotoBannerUrl}
                    onChange={handleInputChange}
                    className="form-input-RP"
                    placeholder="https://ejemplo.com/banner.jpg"
                  />
                  {editForm.fotoBannerUrl && (
                    <div className="preview-banner-RP">
                      <img src={editForm.fotoBannerUrl} alt="Preview banner" />
                    </div>
                  )}
                </div>
              </div>

              <div className="sidebar-footer-RP">
                <button
                  className="btn-cancel-RP"
                  onClick={handleCloseSidebar}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  className="btn-save-RP"
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ReclutadorProfile;
