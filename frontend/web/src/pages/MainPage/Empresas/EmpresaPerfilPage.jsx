import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Building2, CalendarDays, MapPin, Phone, Mail, Users, BadgeInfo, Star } from "lucide-react";
import Header from "../../../components/Header/Header";
import SidebarAspirante from "../../../components/SidebarAspirante/SidebarAspirante";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import Footer from "../../../components/Footer/footer";
import AppCard from "../../../components/shared/AppCard";
import { getEmpresaById } from "../../../api/empresaAPI";
import { getOfertasPorEmpresa } from "../../../api/ofertasAPI";
import "./EmpresaPerfilPage.css";

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  try {
    return new Date(value).toLocaleDateString("es-CO");
  } catch {
    return "Sin fecha";
  }
};

const formatSalary = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
};

function EmpresaPerfilPage() {
  const { empresaId } = useParams();
  const rol = (localStorage.getItem("rol") || "").toUpperCase();
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sidebar = useMemo(() => {
    if (rol === "RECLUTADOR") {
      return <SidebarReclutador />;
    }

    if (rol === "ASPIRANTE") {
      return <SidebarAspirante />;
    }

    return null;
  }, [rol]);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!empresaId) {
        setError("No se encontró la empresa.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [empresaResult, ofertasResult] = await Promise.allSettled([
          getEmpresaById(empresaId),
          getOfertasPorEmpresa(empresaId),
        ]);

        if (empresaResult.status === "fulfilled") {
          setEmpresa(empresaResult.value);
        } else {
          throw empresaResult.reason;
        }

        if (ofertasResult.status === "fulfilled") {
          setOfertas(Array.isArray(ofertasResult.value) ? ofertasResult.value : []);
        } else {
          setOfertas([]);
        }
      } catch (err) {
        console.error("Error al cargar perfil de empresa:", err);
        setError(err.message || "No se pudo cargar el perfil de la empresa");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [empresaId]);

  const categories = useMemo(() => empresa?.categories || [], [empresa]);
  const resumen = useMemo(
    () => [
      {
        label: "Municipio",
        value: empresa?.municipio?.nombre || "-",
        icon: <MapPin size={16} />,
      },
      {
        label: "Correo",
        value: empresa?.email || "-",
        icon: <Mail size={16} />,
      },
      {
        label: "Teléfono",
        value: empresa?.telefono || "-",
        icon: <Phone size={16} />,
      },
      {
        label: "NIT",
        value: empresa?.nit || "-",
        icon: <BadgeInfo size={16} />,
      },
    ],
    [empresa]
  );

  return (
    <div className="empresa-perfil-layout-EP">
      <Header variant="simple" />

      <div className={`empresa-perfil-shell-EP ${sidebar ? "" : "empresa-perfil-shell-EP--stacked"}`.trim()}>
        {sidebar}

        <main className="empresa-perfil-page-EP">
          {loading ? (
          <AppCard className="empresa-perfil-state-EP">Cargando empresa...</AppCard>
          ) : error ? (
          <AppCard className="empresa-perfil-state-EP error">{error}</AppCard>
          ) : !empresa ? (
          <AppCard className="empresa-perfil-state-EP">Empresa no encontrada.</AppCard>
          ) : (
            <>
              <AppCard as="section" className="empresa-perfil-hero-EP">
                <div className="empresa-perfil-hero-bg-EP" aria-hidden="true" />

                <div className="empresa-perfil-hero-info-EP">
                  <div className="empresa-perfil-avatar-EP">
                    {empresa.logoUrl ? (
                      <img src={empresa.logoUrl} alt={empresa.nombre} />
                    ) : (
                      <Building2 size={34} />
                    )}
                  </div>

                  <div className="empresa-perfil-hero-copy-EP">
                    <p className="empresa-perfil-kicker-EP">Perfil de empresa</p>
                    <h1>{empresa.nombre}</h1>
                    <p>{empresa.descripcion || "Sin descripción registrada"}</p>
                  </div>

                  <div className="empresa-perfil-hero-rating-EP">
                    <Star size={18} />
                    <div>
                      <strong>{Number(empresa.puntuacion || 0).toFixed(1)}</strong>
                      <span>Puntuación general</span>
                    </div>
                  </div>
                </div>

                <div className="empresa-perfil-hero-stats-EP">
                  <div>
                    <Users size={16} />
                    <strong>{empresa.numeroTrabajadores || "-"}</strong>
                    <span>Trabajadores</span>
                  </div>
                  <div>
                    <CalendarDays size={16} />
                    <strong>{formatDate(empresa.fechaCreacion)}</strong>
                    <span>Registro</span>
                  </div>
                  <div>
                    <MapPin size={16} />
                    <strong>{empresa.municipio?.nombre || "-"}</strong>
                    <span>Ubicación</span>
                  </div>
                </div>
              </AppCard>

              <section className="empresa-perfil-summary-EP">
                {resumen.map((item) => (
                  <AppCard key={item.label} className="empresa-perfil-summary-card-EP">
                    <div className="empresa-perfil-summary-icon-EP">{item.icon}</div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </AppCard>
                ))}
              </section>

              <section className="empresa-perfil-grid-EP">
                <AppCard>
                  <div className="empresa-perfil-card-title-EP">
                    <BadgeInfo size={18} />
                    <h2>Información general</h2>
                  </div>

                  <div className="empresa-perfil-detail-EP">
                    <span>Municipio</span>
                    <strong>{empresa.municipio?.nombre || "-"}</strong>
                  </div>
                  <div className="empresa-perfil-detail-EP">
                    <span>Correo</span>
                    <strong>{empresa.email || "-"}</strong>
                  </div>
                  <div className="empresa-perfil-detail-EP">
                    <span>Teléfono</span>
                    <strong>{empresa.telefono || "-"}</strong>
                  </div>
                </AppCard>

                <AppCard>
                  <div className="empresa-perfil-card-title-EP">
                    <div>
                      <MapPin size={18} />
                      <h2>Categorías</h2>
                    </div>
                    <span className="empresa-perfil-section-count-EP">{categories.length}</span>
                  </div>

                  {categories.length > 0 ? (
                    <div className="empresa-perfil-tags-EP">
                      {categories.map((category) => (
                        <span key={category}>{category}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="empresa-perfil-empty-EP">Sin categorías registradas.</p>
                  )}

                  <div className="empresa-perfil-detail-EP">
                    <span>Logo URL</span>
                    <strong>{empresa.logoUrl ? <a href={empresa.logoUrl} target="_blank" rel="noreferrer">Ver logo</a> : "-"}</strong>
                  </div>
                  <div className="empresa-perfil-detail-EP">
                    <span>Código de invitación</span>
                    <strong>{empresa.codigoInvitacion || "-"}</strong>
                  </div>
                </AppCard>
              </section>

              <AppCard as="section" className="empresa-perfil-offers-EP">
                <div className="empresa-perfil-section-head-EP">
                  <div>
                    <p className="empresa-perfil-kicker-EP">Ofertas activas</p>
                    <h2>Vacantes publicadas</h2>
                  </div>
                  <span>{ofertas.length} resultados</span>
                </div>

                {ofertas.length === 0 ? (
                  <p className="empresa-perfil-empty-EP">No hay ofertas activas para esta empresa.</p>
                ) : (
                  <div className="empresa-perfil-offer-list-EP">
                    {ofertas.map((oferta) => (
                      <article key={oferta.id} className="empresa-perfil-offer-EP">
                        <div>
                          <h3>{oferta.titulo || "Oferta"}</h3>
                          <p>
                            {oferta.municipio?.nombre || "Sin ubicación"} · {oferta.modalidad || "Sin modalidad"}
                          </p>
                        </div>
                        <div className="empresa-perfil-offer-meta-EP">
                          <span>{formatSalary(oferta.salario)}</span>
                          <Link to={`/Aspirante/OfertaCompleta/${oferta.id}`}>Ver oferta</Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </AppCard>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default EmpresaPerfilPage;