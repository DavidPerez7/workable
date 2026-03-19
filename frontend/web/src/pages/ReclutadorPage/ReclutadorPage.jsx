import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderReclutador from "../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../components/SidebarReclutador/SidebarReclutador";
import OfertaCard from "../../components/OfertaCard/ofertaCard";
import { getEmpresaById } from "../../api/empresaAPI";
import { getOfertasPorEmpresa } from "../../api/ofertasAPI";
import reclutadoresApi from "../../api/reclutadoresApi";
import "./ReclutadorPage.css";

const ReclutadorPage = () => {
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");

        const reclutador = await reclutadoresApi.getMyProfile();
        const empresaId = reclutador?.empresa?.id;

        if (!empresaId) {
          setEmpresa(null);
          setOfertas([]);
          return;
        }

        const [empresaInfo, ofertasInfo] = await Promise.all([
          getEmpresaById(empresaId),
          getOfertasPorEmpresa(empresaId),
        ]);

        setEmpresa(empresaInfo);
        setOfertas(Array.isArray(ofertasInfo) ? ofertasInfo : []);
      } catch (err) {
        console.error("Error al cargar reclutador:", err);
        setError(err.message || "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />

        <main className="reclutador-main-RP">
          <section className="reclutador-hero-RP">
            <div>
              <p className="reclutador-kicker-RP">Panel reclutador</p>
              <h1>Gestiona tus ofertas y empresa</h1>
            </div>
            <div className="reclutador-hero-metric-RP">
              <strong>{ofertas.length}</strong>
              <span>ofertas activas</span>
            </div>
          </section>

          {error && <p className="reclutador-alert-RP error">{error}</p>}

          {loading ? (
            <div className="reclutador-card-RP">Cargando información...</div>
          ) : (
            <section className="reclutador-grid-RP">
              <article className="reclutador-card-RP">
                <div className="reclutador-card-header-RP">
                  <div>
                    <p className="reclutador-kicker-RP">Empresa</p>
                    <h2>Mi empresa</h2>
                  </div>
                  <Link to="/Reclutador/EnterprisePage" className="reclutador-link-RP">
                    Ver detalle
                  </Link>
                </div>

                {empresa ? (
                  <div className="reclutador-company-RP">
                    <div className="reclutador-company-avatar-RP">
                      {empresa.logo ? (
                        <img src={empresa.logo} alt={empresa.nombre} />
                      ) : (
                        <span>{empresa.nombre?.charAt(0) || "E"}</span>
                      )}
                    </div>
                    <div>
                      <h3>{empresa.nombre}</h3>
                      <p>{empresa.descripcion || "Sin descripción"}</p>
                      <span>{empresa.municipio?.nombre || "Sin ubicación"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="reclutador-empty-RP">
                    Aún no tienes una empresa registrada.
                    <Link to="/Reclutador/RegistrarEmpresa" className="reclutador-button-RP">
                      Registrar empresa
                    </Link>
                  </div>
                )}
              </article>

              <article className="reclutador-card-RP">
                <div className="reclutador-card-header-RP">
                  <div>
                    <p className="reclutador-kicker-RP">Ofertas</p>
                    <h2>Últimas ofertas</h2>
                  </div>
                  <Link to="/Reclutador/GestigOferts" className="reclutador-link-RP">
                    Gestionar
                  </Link>
                </div>

                {ofertas.length === 0 ? (
                  <div className="reclutador-empty-RP">
                    No tienes ofertas publicadas.
                    <Link to="/Reclutador/Publicacion" className="reclutador-button-RP">
                      Crear oferta
                    </Link>
                  </div>
                ) : (
                  <div className="reclutador-list-RP">
                    {ofertas.slice(0, 3).map((oferta) => (
                      <OfertaCard
                        key={oferta.id}
                        titulo={oferta.titulo || "Oferta"}
                        salario={oferta.salario || 0}
                        ubicacion={oferta.municipio?.nombre || oferta.ubicacion || "-"}
                        empresa={empresa?.nombre || "Empresa"}
                        modalidad={oferta.modalidad || "-"}
                        tipoContrato={oferta.tipoContrato || "-"}
                      />
                    ))}
                  </div>
                )}
              </article>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default ReclutadorPage;
