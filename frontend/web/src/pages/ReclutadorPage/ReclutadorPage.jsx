import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  FileText,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";
import reclutadoresApi from "../../api/reclutadoresApi";
import { getEmpresaById } from "../../api/empresaAPI";
import ReclutadorLayout from "./ReclutadorLayout";
import ReclutadorCard from "../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorButton from "../../components/reclutador/ReclutadorButton";
import ReclutadorEmptyState from "../../components/reclutador/ReclutadorEmptyState";
import ReclutadorAlert from "../../components/reclutador/ReclutadorAlert";
import "./ReclutadorPage.css";

const ReclutadorPage = () => {
  const [reclutador, setReclutador] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const datosReclutador = await reclutadoresApi.getMyProfile();
      setReclutador(datosReclutador);

      if (datosReclutador?.empresa?.id) {
        const dataEmpresa = await getEmpresaById(datosReclutador.empresa.id);
        setEmpresa(dataEmpresa);

        const ofertasEmpresa =
          dataEmpresa?.ofertas ||
          dataEmpresa?.listaOfertas ||
          dataEmpresa?.ofertasActivas ||
          [];
        setOfertas(Array.isArray(ofertasEmpresa) ? ofertasEmpresa : []);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err.message || "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas simples
  const ofertasActivas = ofertas.filter(oferta => oferta.estadoOferta === "ABIERTA" || oferta.estado === "ACTIVA").length;
  const postulacionesTotales = ofertas.reduce((total, oferta) => total + (oferta.postulaciones?.length || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    window.location.href = "/";
  };

  return (
    <ReclutadorLayout>
      {loading ? (
        <ReclutadorCard>Cargando...</ReclutadorCard>
      ) : (
        <>
          <ReclutadorCard as="section" className="reclutador-hero-RP">
            <div>
              <p className="reclutador-kicker-RP">Panel reclutador</p>
              <h1>Gestiona tu empresa y ofertas</h1>
            </div>
            <div className="reclutador-hero-metrics-RP">
              <div className="metric-RP">
                <strong>{ofertasActivas}</strong>
                <span>Ofertas activas</span>
              </div>
              <div className="metric-RP">
                <strong>{postulacionesTotales}</strong>
                <span>Postulaciones totales</span>
              </div>
            </div>
          </ReclutadorCard>

          {error ? <ReclutadorAlert>{error}</ReclutadorAlert> : null}

          <div className="reclutador-actions-RP">
            <ReclutadorButton as={Link} to="/Reclutador/Publicacion" variant="action">
              <Plus size={20} />
              <strong>Crear Oferta</strong>
              <span>Publicar nueva vacante</span>
            </ReclutadorButton>
            <ReclutadorButton as={Link} to="/Reclutador/EnterprisePage" variant="action">
              <Building2 size={20} />
              <strong>Gestionar Empresa</strong>
              <span>Editar datos corporativos</span>
            </ReclutadorButton>
            <ReclutadorButton as={Link} to="/Reclutador/Ofertas" variant="action">
              <FileText size={20} />
              <strong>Ver Postulaciones</strong>
              <span>Revisar candidatos</span>
            </ReclutadorButton>
          </div>

          <section className="reclutador-grid-RP">
            <ReclutadorCard as="article">
              <ReclutadorSectionHeader kicker="Mis ofertas" title="Ofertas Recientes" />

              {ofertas.length === 0 ? (
                <ReclutadorEmptyState action={(
                  <Link to="/Reclutador/Publicacion" className="reclutador-button-RP">
                    Crear oferta
                  </Link>
                )}>
                  <p>No tienes ofertas publicadas.</p>
                </ReclutadorEmptyState>
              ) : (
                <>
                  <div className="reclutador-ofertas-list-RP">
                    {ofertas.slice(0, 3).map((oferta) => (
                      <div key={oferta.id} className="reclutador-oferta-item-RP">
                        <div>
                          <h4>{oferta.titulo}</h4>
                          <p className="reclutador-oferta-meta-RP">
                            {oferta.municipio?.nombre || oferta.ubicacion} • {oferta.modalidad}
                          </p>
                          {oferta.salario && (
                            <span className="reclutador-oferta-salary-RP">
                              ${oferta.salario.toLocaleString("es-CO")}
                            </span>
                          )}
                        </div>
                        <div className="reclutador-oferta-actions-RP">
                          <Link to={`/Reclutador/Ofertas`} className="reclutador-oferta-link-RP">
                            Ver
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  {ofertas.length > 3 && (
                    <div className="reclutador-view-all-RP">
                      <Link to="/Reclutador/Ofertas" className="reclutador-link-RP">
                        Ver todas las ofertas ({ofertas.length})
                      </Link>
                    </div>
                  )}
                </>
              )}
            </ReclutadorCard>
          </section>
        </>
      )}

    </ReclutadorLayout>
  );
};

export default ReclutadorPage;
