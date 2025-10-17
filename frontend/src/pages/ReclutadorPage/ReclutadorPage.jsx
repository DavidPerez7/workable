import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderReclutador from "../../components/HeaderReclutador/HeaderReclutador";
import OfertaCard from "../../components/OfertaCard/ofertaCard";
import "./ReclutadorPage.css";
import { getAllOfertas } from "../../api/ofertasAPI";

function ReclutadorPage() {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const data = await getAllOfertas();
        setOfertas(data);
      } catch (error) {
        console.error("Error al obtener ofertas:", error);
      }
    };
    fetchOfertas();
  }, []);

  return (
    <>
      <HeaderReclutador />
      <main className="main-reclutador-rc">
        <div className="nav-panel-rc">
          <div className="nav-item-rc">
            <svg className="icon-nav-rc" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
            </svg>
            <span className="link-nav-rc">
              <Link to="/Reclutador">Inicio</Link>
            </span>
          </div>

          <div className="nav-item-rc">
            <svg className="icon-nav-rc" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z"/>
            </svg>
            <span className="link-nav-rc">
              <Link to="/Reclutador/reclutamiento">Reclutamiento</Link>
            </span>
          </div>

          <div className="nav-item-rc">
            <svg className="icon-nav-rc" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
              <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
            </svg>
            <span className="link-nav-rc">
              <Link to="/Reclutador/GestigOferts">Gestionar ofertas</Link>
            </span>
          </div>

          <div className="nav-item-rc">
            <svg className="icon-nav-rc" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52z"/>
            </svg>
            <span className="link-nav-rc">
              <Link to="/Reclutador/Configuracion">Configuracion</Link>
            </span>
          </div>
        </div>

        <div className="main-content-rc">
          <div className="column-left-rc">
            <div className="info-company-rc">
              <div className="logo-company-rc">
                <img src="https://logodownload.org/wp-content/uploads/2014/04/coca-cola-logo-1-1.png" alt="logo" className="img-logo-rc"/>
              </div>
              <div>
                <h2 className="name-company-rc">Empresa genérica</h2>
                <p className="user-admin-rc">Usuario administrador</p>
              </div>
            </div>

            <div className="section-recruitment-rc">
              <div className="header-section-rc">
                <h3 className="title-section-rc">Reclutamiento</h3>
                <span className="link-manage-rc">Gestionar avisos</span>
              </div>
              <div className="cards-recruitment-rc">
                {ofertas.length > 0 ? (
                  ofertas.map((oferta) => (
                  <OfertaCard
                  key={oferta.id}
                  titulo={oferta.titulo || oferta.nom || "Sin título"}
                  descripcion={oferta.descripcion || oferta.desc || "Sin descripción"}
                  salario={oferta.salario || oferta.sueldo || 0}
                  ubicacion={oferta.ubicacion || oferta.ubi || "No especificada"}
                  />))
  ) : (
    <p>No hay ofertas disponibles</p>
  )}
</div>


              <div className="container-button-publish-rc">
                <Link to="/Reclutador/Publicacion">
                  <button className="button-publish-rc">Publicar oferta</button>
                </Link>
              </div>
            </div>

            <div className="section-statistics-rc">
              <div className="header-statistics-rc">
                <h3 className="title-section-rc">Estadística</h3>
                <span className="link-more-rc">Ver más estadísticas</span>
              </div>
              <div className="graphs-statistics-rc">
                <div className="card-graph-rc"></div>
                <div className="card-graph-rc"></div>
              </div>
            </div>
          </div>

          <div className="column-right-rc">
            <div className="image-placeholder-rc"></div>
            <div className="section-reviews-rc">
              <div className="header-reviews-rc">
                <h3 className="title-section-rc">Reviews</h3>
                <span className="link-reviews-rc">Ver reviews</span>
              </div>
              <div className="container-reviews-rc">
                {/* contenido de reviews */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ReclutadorPage;
