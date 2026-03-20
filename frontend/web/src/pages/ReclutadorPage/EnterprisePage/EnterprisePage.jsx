import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmpresaById } from "../../../api/empresaAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorAlert from "../../../components/reclutador/ReclutadorAlert";
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
        setError("");
        const reclutador = await reclutadoresApi.getMyProfile();
        const empresaId = reclutador?.empresa?.id;

        if (!empresaId) {
          setEmpresa(null);
          setOfertas([]);
          return;
        }

        const empresaData = await getEmpresaById(empresaId);

        setEmpresa(empresaData);
        const ofertasEmpresa =
          empresaData?.ofertas ||
          empresaData?.listaOfertas ||
          empresaData?.ofertasActivas ||
          [];
        setOfertas(Array.isArray(ofertasEmpresa) ? ofertasEmpresa : []);
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
    <ReclutadorLayout>
      <ReclutadorCard as="section" className="empresa-hero-EP">
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
            <p className="empresa-meta-EP">{empresa?.municipio?.nombre || "Sin ubicacion"}</p>
          </div>
        </div>
        <div className="empresa-actions-EP">
          <ReclutadorButton type="button" onClick={() => navigate("/Reclutador/EnterprisePage/Edit")}>
            Editar empresa
          </ReclutadorButton>
          <Link to="/Reclutador/Publicacion" className="reclutador-link-RP">
            Crear oferta
          </Link>
        </div>
      </ReclutadorCard>

      {error ? <ReclutadorAlert>{error}</ReclutadorAlert> : null}

      {loading ? (
        <ReclutadorCard>Cargando empresa...</ReclutadorCard>
      ) : !empresa ? (
        <ReclutadorCard>
          <p className="empresa-empty-EP">Aun no tienes empresa registrada.</p>
          <Link to="/Reclutador/RegistrarEmpresa" className="reclutador-button-RP">
            Registrar empresa
          </Link>
        </ReclutadorCard>
      ) : (
        <div className="empresa-grid-EP">
          <ReclutadorCard as="section">
            <ReclutadorSectionHeader kicker="Descripcion" title="Sobre la empresa" />
            <p className="empresa-text-EP">{empresa.descripcion || "Sin descripcion"}</p>
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
          </ReclutadorCard>

          <ReclutadorCard as="section">
            <ReclutadorSectionHeader
              kicker="Ofertas"
              title="Ofertas publicadas"
              action={<Link to="/Reclutador/GestigOferts" className="reclutador-link-RP">Ver gestion</Link>}
            />
            {ofertas.length === 0 ? (
              <p className="empresa-text-EP">No hay ofertas publicadas.</p>
            ) : (
              <ul className="empresa-list-EP">
                {ofertas.slice(0, 5).map((oferta) => (
                  <li key={oferta.id}>
                    <span>{oferta.titulo || "Oferta"}</span>
                    <Link to={`/Reclutador/OfertaCompleta/${oferta.id}`}>Ver</Link>
                  </li>
                ))}
              </ul>
            )}
          </ReclutadorCard>
        </div>
      )}
    </ReclutadorLayout>
  );
}

export default EnterprisePage;
