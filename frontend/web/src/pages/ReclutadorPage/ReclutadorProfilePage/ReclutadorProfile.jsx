import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import reclutadoresApi from "../../../api/reclutadoresApi";
import { logout } from "../../../api/authApi";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorEmptyState from "../../../components/reclutador/ReclutadorEmptyState";
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
      <ReclutadorLayout>
        <ReclutadorCard>
          <h2>Perfil no encontrado</h2>
          <Link to="/Reclutador" className="reclutador-button-RP">
            Volver
          </Link>
        </ReclutadorCard>
      </ReclutadorLayout>
    );
  }

  return (
    <ReclutadorLayout>
      <ReclutadorCard as="section" className="profile-hero-RPF">
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
            <p className="profile-muted-RPF">{profileData.municipio?.nombre || "Sin ubicacion"}</p>
          </div>
        </div>
      </ReclutadorCard>

      <ReclutadorCard as="section">
        <ReclutadorSectionHeader kicker="Acciones" title="Atajos del reclutador" />
        <div className="profile-actions-RPF">
          <Link to="/Reclutador/EditarPerfil" className="reclutador-button-RP">Editar perfil</Link>
          <Link to="/Reclutador/Ofertas" className="reclutador-button-RP">Gestionar ofertas</Link>
          <Link to="/Reclutador/Publicacion" className="reclutador-button-RP">Publicar oferta</Link>
          <Link to="/Reclutador/Configuracion" className="reclutador-button-RP">Configuracion</Link>
          <ReclutadorButton type="button" onClick={cerrarSesion}>Cerrar sesion</ReclutadorButton>
        </div>
      </ReclutadorCard>
    </ReclutadorLayout>
  );
}

export default ReclutadorProfile;
