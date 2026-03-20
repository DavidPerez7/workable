import React from "react";
import { Link } from "react-router-dom";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import "./InfoRecPage.css";

const InfoRecPage = () => {
  return (
    <ReclutadorLayout>
      <ReclutadorCard as="section" className="info-hero-IRP">
        <p className="reclutador-kicker-RP">Reclutador</p>
        <h1>Publica ofertas y encuentra talento</h1>
        <p className="info-text-IRP">
          Crea ofertas en minutos y gestiona postulaciones desde un solo lugar.
        </p>
        <Link to="/Reclutador/Publicacion" className="reclutador-button-RP">
          Publicar oferta
        </Link>
      </ReclutadorCard>

      <ReclutadorCard as="section">
        <ReclutadorSectionHeader kicker="Proceso" title="En 3 pasos" />
        <ol className="info-steps-IRP">
          <li>Publica tu oferta con los datos clave.</li>
          <li>Revisa postulaciones y cambia el estado.</li>
          <li>Selecciona al mejor candidato.</li>
        </ol>
      </ReclutadorCard>
    </ReclutadorLayout>
  );
};

export default InfoRecPage;
