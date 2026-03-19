import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import reclutadoresApi from "../../../api/reclutadoresApi";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import { logout } from "../../../api/authApi";
import "./ReclutadorProfile.css";

function ReclutadorProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // Obtener perfil del reclutador autenticado
      const reclutadorData = await reclutadoresApi.getMyProfile();

      setProfileData(reclutadorData);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  if (!profileData) {
    return (
      <>
        <HeaderReclutador />
        <main className="reclutador-main-RP">
          <div className="reclutador-card-RP">
            <h2>Perfil no encontrado</h2>
            <Link to="/Reclutador" className="reclutador-button-RP">
              Volver
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />
        <main className="reclutador-main-RP">
          <section className="reclutador-card-RP profile-hero-RPF">
            <div className="profile-hero-info-RPF">
              <div className="profile-avatar-RPF">
                {profileData.urlFotoPerfil ? (
                  <img src={profileData.urlFotoPerfil} alt={profileData.nombre} />
                ) : (
                  <span>{profileData.nombre?.charAt(0) || "R"}</span>
                )}
              </div>
              <div>
                <p className="reclutador-kicker-RP">Perfil</p>
                <h1>{profileData.nombre}</h1>
                <p className="profile-muted-RPF">{profileData.correo}</p>
                <p className="profile-muted-RPF">
                  {profileData.municipio?.nombre || "Sin ubicacion"}
                </p>
              </div>
            </div>
          </section>

          <section className="reclutador-card-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Acciones</p>
                <h2>Atajos del reclutador</h2>
              </div>
            </div>
            <div className="profile-actions-RPF">
              <Link to="/Reclutador/EditarPerfil">Editar perfil</Link>
              <Link to="/Reclutador/GestigOferts">Gestionar ofertas</Link>
              <Link to="/Reclutador/Publicacion">Publicar oferta</Link>
              <Link to="/Reclutador/Configuracion">Configuracion</Link>
              <button type="button" onClick={cerrarSesion}>Cerrar sesion</button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default ReclutadorProfile;
