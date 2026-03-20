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
            <div className="reclutador-hero-metric-RP">
              <strong>{ofertas.length}</strong>
              <span>ofertas activas</span>
            </div>
          </ReclutadorCard>

          {error ? <ReclutadorAlert>{error}</ReclutadorAlert> : null}

          <div className="reclutador-actions-RP">
            <Link to="/Reclutador/ProfileEditPage" className="reclutador-action-card-RP">
              <Settings size={20} />
              <strong>Mi Perfil</strong>
              <span>Editar información personal</span>
            </Link>
            <Link to="/Reclutador/EnterprisePage" className="reclutador-action-card-RP">
              <Building2 size={20} />
              <strong>Mi Empresa</strong>
              <span>Gestionar empresa</span>
            </Link>
            <Link to="/Reclutador/GestigOferts" className="reclutador-action-card-RP">
              <FileText size={20} />
              <strong>Ofertas</strong>
              <span>Ver todas mis ofertas</span>
            </Link>
            <Link to="/Reclutador/Publicacion" className="reclutador-action-card-RP">
              <Plus size={20} />
              <strong>Nueva oferta</strong>
              <span>Crear oferta laboral</span>
            </Link>
            <button onClick={handleLogout} className="reclutador-action-card-RP danger">
              <LogOut size={20} />
              <strong>Salir</strong>
              <span>Cerrar sesión</span>
            </button>
          </div>

          <section className="reclutador-grid-RP">
            <ReclutadorCard as="article">
              <ReclutadorSectionHeader kicker="Información" title="Mi Empresa" />

              {empresa ? (
                <div className="reclutador-company-RP">
                  <div className="reclutador-company-avatar-RP">
                    {empresa.logo ? <img src={empresa.logo} alt={empresa.nombre} /> : <span>{empresa.nombre?.charAt(0) || "E"}</span>}
                  </div>
                  <div className="reclutador-company-info-RP">
                    <h3>{empresa.nombre}</h3>
                    <p>{empresa.descripcion || "Sin descripción"}</p>
                    <span>📍 {empresa.municipio?.nombre || "Sin ubicación"}</span>
                  </div>
                </div>
              ) : (
                <ReclutadorEmptyState action={(
                  <Link to="/Reclutador/RegistrarEmpresa" className="reclutador-button-RP">
                    Registrar empresa
                  </Link>
                )}>
                  <p>Aún no tienes una empresa registrada.</p>
                </ReclutadorEmptyState>
              )}
            </ReclutadorCard>

            <ReclutadorCard as="article">
              <ReclutadorSectionHeader kicker="Mis ofertas" title="Ofertas Activas" />

              {ofertas.length === 0 ? (
                <ReclutadorEmptyState action={(
                  <Link to="/Reclutador/Publicacion" className="reclutador-button-RP">
                    Crear oferta
                  </Link>
                )}>
                  <p>No tienes ofertas publicadas.</p>
                </ReclutadorEmptyState>
              ) : (
                <div className="reclutador-ofertas-list-RP">
                  {ofertas.map((oferta) => (
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
                        <Link to={`/Reclutador/GestigOferts`} className="reclutador-oferta-link-RP">
                          Ver
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ReclutadorCard>
          </section>
        </>
      )}
    </ReclutadorLayout>
  );
};

export default ReclutadorPage;
