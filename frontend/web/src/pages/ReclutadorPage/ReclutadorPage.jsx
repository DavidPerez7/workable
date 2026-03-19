import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  FileText,
  Users,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";
import HeaderReclutador from "../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../components/SidebarReclutador/SidebarReclutador";
import reclutadoresApi from "../../api/reclutadoresApi";
import { getEmpresaById } from "../../api/empresaAPI";
import { getOfertasPorEmpresa } from "../../api/ofertasAPI";
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
        const [dataEmpresa, dataOfertas] = await Promise.all([
          getEmpresaById(datosReclutador.empresa.id),
          getOfertasPorEmpresa(datosReclutador.empresa.id),
        ]);
        setEmpresa(dataEmpresa);
        setOfertas(Array.isArray(dataOfertas) ? dataOfertas : []);
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
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />

        <main className="reclutador-main-RP">
          {loading ? (
            <div className="reclutador-loading-RP">Cargando...</div>
          ) : (
            <>
              <section className="reclutador-hero-RP">
                <div>
                  <p className="reclutador-kicker-RP">Panel reclutador</p>
                  <h1>Gestiona tu empresa y ofertas</h1>
                </div>
                <div className="reclutador-hero-metric-RP">
                  <strong>{ofertas.length}</strong>
                  <span>ofertas activas</span>
                </div>
              </section>

              {error && <p className="reclutador-alert-RP error">{error}</p>}

              <div className="reclutador-actions-RP">
                <Link
                  to="/Reclutador/ProfileEditPage"
                  className="reclutador-action-card-RP"
                >
                  <Settings size={20} />
                  <strong>Mi Perfil</strong>
                  <span>Editar información personal</span>
                </Link>
                <Link
                  to="/Reclutador/EnterprisePage"
                  className="reclutador-action-card-RP"
                >
                  <Building2 size={20} />
                  <strong>Mi Empresa</strong>
                  <span>Gestionar empresa</span>
                </Link>
                <Link
                  to="/Reclutador/GestigOferts"
                  className="reclutador-action-card-RP"
                >
                  <FileText size={20} />
                  <strong>Ofertas</strong>
                  <span>Ver todas mis ofertas</span>
                </Link>
                <Link
                  to="/Reclutador/Publicacion"
                  className="reclutador-action-card-RP"
                >
                  <Plus size={20} />
                  <strong>Nueva oferta</strong>
                  <span>Crear oferta laboral</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="reclutador-action-card-RP danger"
                >
                  <LogOut size={20} />
                  <strong>Salir</strong>
                  <span>Cerrar sesión</span>
                </button>
              </div>

              <section className="reclutador-grid-RP">
                <article className="reclutador-card-RP">
                  <div className="reclutador-card-header-RP">
                    <div>
                      <p className="reclutador-kicker-RP">Información</p>
                      <h2>Mi Empresa</h2>
                    </div>
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
                      <div className="reclutador-company-info-RP">
                        <h3>{empresa.nombre}</h3>
                        <p>{empresa.descripcion || "Sin descripción"}</p>
                        <span>📍 {empresa.municipio?.nombre || "Sin ubicación"}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="reclutador-empty-RP">
                      <p>Aún no tienes una empresa registrada.</p>
                      <Link
                        to="/Reclutador/RegistrarEmpresa"
                        className="reclutador-button-RP"
                      >
                        Registrar empresa
                      </Link>
                    </div>
                  )}
                </article>

                <article className="reclutador-card-RP">
                  <div className="reclutador-card-header-RP">
                    <div>
                      <p className="reclutador-kicker-RP">Mis ofertas</p>
                      <h2>Ofertas Activas</h2>
                    </div>
                  </div>

                  {ofertas.length === 0 ? (
                    <div className="reclutador-empty-RP">
                      <p>No tienes ofertas publicadas.</p>
                      <Link
                        to="/Reclutador/Publicacion"
                        className="reclutador-button-RP"
                      >
                        Crear oferta
                      </Link>
                    </div>
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
                            <Link
                              to={`/Reclutador/GestigOferts`}
                              className="reclutador-oferta-link-RP"
                            >
                              Ver
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default ReclutadorPage;
