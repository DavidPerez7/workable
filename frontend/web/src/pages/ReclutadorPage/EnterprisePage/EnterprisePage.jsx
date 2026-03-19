import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import { getEmpresaById } from "../../../api/empresaAPI";
import { getOfertasPorEmpresa } from "../../../api/ofertasAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import "./EnterprisePage.css";

function EnterprisePage() {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const reclutador = await reclutadoresApi.getMyProfile();
        const empresaId = reclutador?.empresa?.id;

        if (!empresaId) {
          setEmpresa(null);
          setOfertas([]);
          return;
        }

        const [empresaData, ofertasData] = await Promise.all([
          getEmpresaById(empresaId),
          getOfertasPorEmpresa(empresaId),
        ]);

        setEmpresa(empresaData);
        setOfertas(Array.isArray(ofertasData) ? ofertasData : []);
      } catch (err) {
        console.error("Error al cargar empresa:", err);
        setError(err.message || "No se pudo cargar la empresa");
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
          <section className="reclutador-card-RP empresa-hero-EP">
            <div className="empresa-hero-info-EP">
              <div className="empresa-avatar-EP">
                {empresa?.logo ? (
                  <img src={empresa.logo} alt={empresa.nombre} />
                ) : (
                  <span>{empresa?.nombre?.charAt(0) || "E"}</span>
                )}
              </div>
              <div>
                <p className="reclutador-kicker-RP">Mi empresa</p>
                <h1>{empresa?.nombre || "Empresa"}</h1>
                <p className="empresa-meta-EP">
                  {empresa?.municipio?.nombre || "Sin ubicacion"}
                </p>
              </div>
            </div>
            <div className="empresa-actions-EP">
              <button
                type="button"
                className="reclutador-button-RP"
                onClick={() => navigate("/Reclutador/EnterprisePage/Edit")}
              >
                Editar empresa
              </button>
              <Link to="/Reclutador/Publicacion" className="reclutador-link-RP">
                Crear oferta
              </Link>
            </div>
          </section>

          {error && <p className="reclutador-alert-RP error">{error}</p>}

          {loading ? (
            <div className="reclutador-card-RP">Cargando empresa...</div>
          ) : !empresa ? (
            <div className="reclutador-card-RP">
              <p className="empresa-empty-EP">Aun no tienes empresa registrada.</p>
              <Link to="/Reclutador/RegistrarEmpresa" className="reclutador-button-RP">
                Registrar empresa
              </Link>
            </div>
          ) : (
            <div className="empresa-grid-EP">
              <section className="reclutador-card-RP">
                <div className="reclutador-card-header-RP">
                  <div>
                    <p className="reclutador-kicker-RP">Descripcion</p>
                    <h2>Sobre la empresa</h2>
                  </div>
                </div>
                <p className="empresa-text-EP">
                  {empresa.descripcion || "Sin descripcion"}
                </p>
                <div className="empresa-details-EP">
                  <div>
                    <span>NIT</span>
                    <strong>{empresa.nit || "-"}</strong>
                  </div>
                  <div>
                    <span>Contacto</span>
                    <strong>{empresa.email || empresa.emailContacto || "-"}</strong>
                  </div>
                  <div>
                    <span>Telefono</span>
                    <strong>{empresa.telefono || empresa.telefonoContacto || "-"}</strong>
                  </div>
                </div>
              </section>

              <section className="reclutador-card-RP">
                <div className="reclutador-card-header-RP">
                  <div>
                    <p className="reclutador-kicker-RP">Ofertas</p>
                    <h2>Ofertas publicadas</h2>
                  </div>
                  <Link to="/Reclutador/GestigOferts" className="reclutador-link-RP">
                    Ver gestion
                  </Link>
                </div>
                {ofertas.length === 0 ? (
                  <p className="empresa-text-EP">No hay ofertas publicadas.</p>
                ) : (
                  <ul className="empresa-list-EP">
                    {ofertas.slice(0, 5).map((oferta) => (
                      <li key={oferta.id}>
                        <span>{oferta.titulo || "Oferta"}</span>
                        <Link to={`/Reclutador/OfertaCompleta/${oferta.id}`}>
                          Ver
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default EnterprisePage;
