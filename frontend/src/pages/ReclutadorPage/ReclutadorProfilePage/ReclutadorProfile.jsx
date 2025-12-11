import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import reclutadoresApi from "../../../api/reclutadoresApi";
import { getEmpresaById } from "../../../api/empresaAPI";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import Footer from "../../../components/Footer/footer";
import { User, Building2, BarChart3, LogOut, Edit2, Save, X } from "lucide-react";
import "./ReclutadorProfile.css";

function ReclutadorProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [savingField, setSavingField] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const correo = user.correo;

      if (!correo) {
        throw new Error("No se encontró información del usuario");
      }

      const reclutadorData = await reclutadoresApi.getByCorreo(correo);

      let empresaData = null;
      if (reclutadorData.empresa?.id) {
        try {
          empresaData = await getEmpresaById(reclutadorData.empresa.id);
        } catch (err) {
          console.warn("No se pudo cargar información de la empresa:", err);
        }
      }

      setProfileData({
        ...reclutadorData,
        empresa: empresaData || reclutadorData.empresa,
      });
      setEditValues({
        nombre: reclutadorData.nombre || "",
        correo: reclutadorData.correo || "",
        telefono: reclutadorData.telefono || "",
        urlFotoPerfil: reclutadorData.urlFotoPerfil || "",
        urlBanner: reclutadorData.urlBanner || "",
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      setError(error.message || "Error al cargar el perfil");
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

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  const startEditing = (field) => {
    setEditingField(field);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const saveEdit = async (field) => {
    setSavingField(field);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProfileData((prev) => ({
        ...prev,
        [field]: editValues[field],
      }));
      setEditingField(null);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setSavingField(null);
    }
  };

  if (!profileData) {
    return (
      <>
        <HeaderReclutador />
        <main className="profile-main-RPF">
          <div className="error-container-RPF">
            <h2>Perfil no encontrado</h2>
            <Link to="/Reclutador" className="btn-back-RPF">
              Volver
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      <main className="profile-main-RPF">
        <div className="profile-container-RPF">
          {/* Sección Hero */}
          <section className="profile-hero-RPF">
            <div
              className="hero-banner-RPF"
              style={{
                backgroundImage: `url(${profileData.urlBanner || "https://via.placeholder.com/1200x300"})`,
              }}
            ></div>

            <div className="hero-content-RPF">
              <div className="profile-avatar-RPF">
                <img
                  src={profileData.urlFotoPerfil || "https://via.placeholder.com/150"}
                  alt={profileData.nombre}
                />
              </div>

              <div className="hero-info-RPF">
                <h1 className="profile-name-RPF">{profileData.nombre}</h1>
                <p className="profile-role-RPF">Reclutador</p>
                {profileData.empresa && (
                  <p className="profile-company-RPF">
                    <Building2 size={16} />
                    {profileData.empresa.nombre}
                  </p>
                )}
                {profileData.municipio && (
                  <p className="profile-location-RPF">
                    {profileData.municipio.nombre}
                    {profileData.municipio.departamento
                      ? `, ${profileData.municipio.departamento}`
                      : ""}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Información Personal */}
          <section className="info-section-RPF">
            <div className="section-header-RPF">
              <h2>
                <User size={24} />
                Información Personal
              </h2>
            </div>

            <div className="info-grid-RPF">
              <div className="info-card-RPF">
                <label>Nombre Completo</label>
                <p className="info-value-static-RPF">{profileData.nombre}</p>
              </div>

              <div className="info-card-RPF">
                <label>Correo Electrónico</label>
                <p className="info-value-static-RPF">{profileData.correo}</p>
              </div>

              <div className="info-card-RPF">
                <label>Teléfono</label>
                <p className="info-value-static-RPF">{profileData.telefono || "No especificado"}</p>
              </div>
            </div>
          </section>

          {/* Empresa */}
          {profileData.empresa && (
            <section className="info-section-RPF">
              <div className="section-header-RPF">
                <h2>
                  <Building2 size={24} />
                  Empresa
                </h2>
              </div>

              <div className="company-card-RPF">
                {profileData.empresa.logo && (
                  <img
                    src={profileData.empresa.logo}
                    alt={profileData.empresa.nombre}
                    className="company-logo-RPF"
                  />
                )}
                <div className="company-info-RPF">
                  <h3>{profileData.empresa.nombre}</h3>
                  <p>{profileData.empresa.descripcion}</p>
                  <div className="company-stats-RPF">
                    <span>
                      <Building2 size={16} />
                      {profileData.empresa.numeroTrabajadores || 0} empleados
                    </span>
                    <span>
                      <BarChart3 size={16} />
                      {profileData.empresa.puntuacion || 0}/5.0
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Acciones Rápidas */}
          <section className="quick-actions-RPF">
            <h2>Acciones</h2>
            <div className="actions-grid-RPF">
              <Link to="/Reclutador/GestigOferts" className="action-card-RPF">
                <BarChart3 size={32} className="action-icon" />
                <h3>Gestionar Ofertas</h3>
                <p>Administra tus ofertas publicadas</p>
              </Link>

              <Link to="/Reclutador/Publicacion" className="action-card-RPF">
                <Building2 size={32} className="action-icon" />
                <h3>Publicar Oferta</h3>
                <p>Crea una nueva oferta laboral</p>
              </Link>

              <button
                onClick={cerrarSesion}
                className="action-card-RPF action-warning-RPF"
              >
                <LogOut size={32} className="action-icon" />
                <h3>Cerrar Sesión</h3>
                <p>Cierra tu sesión en la plataforma</p>
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ReclutadorProfile;
