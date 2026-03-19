import React from "react";
import { Link } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import "./InfoRecPage.css";

const InfoRecPage = () => {
  return (
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />
        <main className="reclutador-main-RP">
          <section className="reclutador-card-RP info-hero-IRP">
            <p className="reclutador-kicker-RP">Reclutador</p>
            <h1>Publica ofertas y encuentra talento</h1>
            <p className="info-text-IRP">
              Crea ofertas en minutos y gestiona postulaciones desde un solo lugar.
            </p>
            <Link to="/Reclutador/Publicacion" className="reclutador-button-RP">
              Publicar oferta
            </Link>
          </section>

          <section className="reclutador-card-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Proceso</p>
                <h2>En 3 pasos</h2>
              </div>
            </div>
            <ol className="info-steps-IRP">
              <li>Publica tu oferta con los datos clave.</li>
              <li>Revisa postulaciones y cambia el estado.</li>
              <li>Selecciona al mejor candidato.</li>
            </ol>
          </section>
        </main>
      </div>
    </>
  );
};

export default InfoRecPage;
