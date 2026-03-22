import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Building2, CalendarDays, Clock3, Link2, Trash2, X } from "lucide-react";
import AspiranteCard from "../../../components/aspirante/AspiranteCard";
import AspiranteButton from "../../../components/aspirante/AspiranteButton";
import AspiranteAlert from "../../../components/aspirante/AspiranteAlert";
import AspiranteLayout from "../AspiranteLayout";
import AspiranteSectionHeader from "../../../components/aspirante/AspiranteSectionHeader";
import AspiranteFormField from "../../../components/aspirante/AspiranteFormField";
import aspirantesApi from "../../../api/aspirantesApi";
import { eliminarPostulacion } from "../../../api/postulacionesAPI";
import "./MisPostulaciones.css";

const filtrosIniciales = {
  estado: "",
  fechaDesde: "",
  fechaHasta: "",
};

const estadoOptions = [
  { value: "", label: "Todas" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_REVISION", label: "En revisión" },
  { value: "ACEPTADA", label: "Aceptada" },
  { value: "RECHAZADA", label: "Rechazada" },
];

const getEstadoClass = (estado) => {
  const normalizado = (estado || "").toLowerCase();

  if (normalizado.includes("acept")) {
    return "state-accepted";
  }

  if (normalizado.includes("rechaz")) {
    return "state-rejected";
  }

  if (normalizado.includes("revision") || normalizado.includes("revisión")) {
    return "state-review";
  }

  return "state-pending";
};

const formatearSalario = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor || 0));

const getEstadoTone = (estado) => {
  const clase = getEstadoClass(estado);

  if (clase === "state-accepted") {
    return "success";
  }

  if (clase === "state-rejected") {
    return "error";
  }

  if (clase === "state-review") {
    return "info";
  }

  return "warning";
};

const MisPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eliminandoId, setEliminandoId] = useState(null);
  const [postulacionEntrevista, setPostulacionEntrevista] = useState(null);
  const [filters, setFilters] = useState(filtrosIniciales);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError("");
      const usuarioId = localStorage.getItem("usuarioId");

      if (!usuarioId) {
        throw new Error("No se encontró el usuario autenticado.");
      }

      const aspirante = await aspirantesApi.get(usuarioId);
      const postulacionesResult = Array.isArray(aspirante?.postulaciones) ? aspirante.postulaciones : [];
      setPostulaciones(Array.isArray(postulacionesResult) ? postulacionesResult : []);
    } catch (err) {
      console.error("Error al obtener postulaciones:", err);
      setError(err.message || "No se pudieron cargar las postulaciones");
    } finally {
      setLoading(false);
    }
  };

  const postulacionesFiltradas = useMemo(() => {
    return postulaciones.filter((postulacion) => {
      if (filters.estado && postulacion.estado !== filters.estado) {
        return false;
      }

      if (filters.fechaDesde) {
        const fechaDesde = new Date(filters.fechaDesde);
        const fechaCreacion = new Date(postulacion.fechaCreacion);
        if (fechaCreacion < fechaDesde) {
          return false;
        }
      }

      if (filters.fechaHasta) {
        const fechaHasta = new Date(filters.fechaHasta);
        const fechaCreacion = new Date(postulacion.fechaCreacion);
        if (fechaCreacion > fechaHasta) {
          return false;
        }
      }

      return true;
    });
  }, [postulaciones, filters]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta postulación?")) {
      return;
    }

    try {
      setEliminandoId(id);
      await eliminarPostulacion(id);
      setPostulaciones((current) => current.filter((postulacion) => postulacion.id !== id));
    } catch (err) {
      console.error("Error al eliminar postulación:", err);
      setError(err.message || "No se pudo eliminar la postulación");
    } finally {
      setEliminandoId(null);
    }
  };

  const abrirEntrevista = (postulacion) => {
    setPostulacionEntrevista(postulacion);
  };

  const limpiarFiltros = () => {
    setFilters(filtrosIniciales);
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  return (
    <AspiranteLayout shellClassName="postulaciones-shell-AP" mainClassName="postulaciones-main-AP">
      <section className="aspirante-content-AP">
        <AspiranteCard as="aside" className="aspirante-filters-AP">
          <AspiranteSectionHeader
            title="FILTROS"
            action={
              <AspiranteButton type="button" variant="secondary" onClick={limpiarFiltros}>
                Limpiar
              </AspiranteButton>
            }
          />

          <p className="aspirante-help-AP">
            Ajusta los filtros para reducir resultados y encontrar más rápido tus postulaciones.
          </p>

          <form className="filters-form-AP">
            <AspiranteFormField label="Estado">
              <select
                value={filters.estado}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, estado: event.target.value }))
                }
              >
                {estadoOptions.map((option) => (
                  <option key={option.value || "todas"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </AspiranteFormField>

            <AspiranteFormField label="Fecha desde">
              <input
                type="date"
                value={filters.fechaDesde}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, fechaDesde: event.target.value }))
                }
              />
            </AspiranteFormField>

            <AspiranteFormField label="Fecha hasta">
              <input
                type="date"
                value={filters.fechaHasta}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, fechaHasta: event.target.value }))
                }
              />
            </AspiranteFormField>
          </form>
        </AspiranteCard>

        <AspiranteCard as="section" className="aspirante-listing-AP">
          <AspiranteSectionHeader
            title="MIS POSTULACIONES"
          />

          <p className="aspirante-help-AP">
            Revisa el listado de tus postulaciones y administra tus aplicaciones.
          </p>

          {error && (
            <AspiranteAlert type="error" className="postulaciones-alert-AP">
              <AlertCircle size={18} />
              <span>{error}</span>
            </AspiranteAlert>
          )}

          {loading ? (
            <div className="postulaciones-empty-AP asp-loading">Cargando postulaciones...</div>
          ) : postulacionesFiltradas.length === 0 ? (
            <div className="postulaciones-empty-AP asp-empty">
              {postulaciones.length === 0 ? (
                <>No tienes postulaciones registradas. <Link to="/Aspirante">Ver ofertas</Link></>
              ) : (
                "No hay postulaciones que coincidan con los filtros actuales."
              )}
            </div>
          ) : (
            <div className="postulaciones-list-AP">
              {postulacionesFiltradas.map((postulacion) => (
            <AspiranteCard key={postulacion.id} className="postulacion-card-AP">
              <div className="postulacion-top-AP">
                <div>
                  <h2>{postulacion.oferta?.titulo || "Oferta sin título"}</h2>
                  <p>
                    {(() => {
                      const empresaId = postulacion.empresaId || postulacion.oferta?.empresa?.id;
                      const empresaNombre = postulacion.oferta?.empresa?.nombre || "Empresa";

                      return empresaId ? (
                        <Link to={`/EmpresaPerfil/${empresaId}`} className="postulacion-empresa-link-AP" title={`Empresa: ${empresaNombre}`}>
                          <Building2 size={14} />
                          {empresaNombre}
                        </Link>
                      ) : (
                        <span className="postulacion-empresa-link-AP">
                          <Building2 size={14} />
                          {empresaNombre}
                        </span>
                      );
                    })()}
                  </p>
                </div>
                <AspiranteButton
                  type="button"
                  variant="danger"
                  className="postulacion-delete-top-AP"
                  onClick={() => handleEliminar(postulacion.id)}
                  disabled={eliminandoId === postulacion.id}
                >
                  <Trash2 size={16} />
                  {eliminandoId === postulacion.id ? "Eliminando..." : "Eliminar"}
                </AspiranteButton>
              </div>

              <div className="postulacion-meta-AP">
                <div className="postulacion-meta-info-AP">
                  <span>{postulacion.oferta?.municipio?.nombre || "Sin ubicación"}</span>
                  <span>{postulacion.oferta?.modalidad || "Sin modalidad"}</span>
                  {postulacion.oferta?.salario && <span>{formatearSalario(postulacion.oferta.salario)}</span>}
                  <span>{new Date(postulacion.fechaCreacion).toLocaleDateString("es-CO")}</span>
                </div>

                <div className="postulacion-meta-actions-AP">
                  {postulacion.citacion?.fecha ? (
                    <div className="postulacion-entrevista-row-AP">
                      <span className="postulacion-entrevista-state-AP active">ENTREVISTA PROGRAMADA</span>

                      <AspiranteButton
                        type="button"
                        variant="secondary"
                        className="postulacion-entrevista-btn-AP"
                        onClick={() => abrirEntrevista(postulacion)}
                      >
                        Ver detalles
                      </AspiranteButton>
                    </div>
                  ) : (
                    <span className="postulacion-entrevista-state-AP inactive">SIN ENTREVISTA</span>
                  )}
                </div>
              </div>
            </AspiranteCard>
          ))}
        </div>
      )}
        </AspiranteCard>
      </section>

      {postulacionEntrevista?.citacion?.fecha ? (
        <div className="postulacion-modal-backdrop-AP" onClick={cerrarEntrevista} role="presentation">
          <div className="postulacion-modal-AP" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="postulacion-modal-title">
            <div className="postulacion-modal-header-AP">
              <div>
                <p className="postulacion-modal-kicker-AP">Entrevista programada</p>
                <h2 id="postulacion-modal-title">{postulacionEntrevista.oferta?.titulo || "Oferta sin título"}</h2>
              </div>
              <button type="button" className="postulacion-modal-close-AP" onClick={cerrarEntrevista} aria-label="Cerrar modal">
                <X size={18} />
              </button>
            </div>

            <div className="postulacion-modal-body-AP">
              <div className="postulacion-modal-row-AP">
                <CalendarDays size={16} />
                <div>
                  <span>Fecha</span>
                  <strong>{new Date(postulacionEntrevista.citacion.fecha).toLocaleDateString("es-CO")}</strong>
                </div>
              </div>

              <div className="postulacion-modal-row-AP">
                <Clock3 size={16} />
                <div>
                  <span>Hora</span>
                  <strong>{postulacionEntrevista.citacion.hora || "Sin hora registrada"}</strong>
                </div>
              </div>

              <div className="postulacion-modal-row-AP">
                <Link2 size={16} />
                <div>
                  <span>Link de la reunión</span>
                  {postulacionEntrevista.citacion.linkMeet ? (
                    <a href={postulacionEntrevista.citacion.linkMeet} target="_blank" rel="noreferrer">
                      Abrir enlace
                    </a>
                  ) : (
                    <strong>Sin enlace disponible</strong>
                  )}
                </div>
              </div>
            </div>

            <div className="postulacion-modal-footer-AP">
              <AspiranteButton type="button" variant="secondary" onClick={cerrarEntrevista}>
                Cerrar
              </AspiranteButton>
            </div>
          </div>
        </div>
      ) : null}
    </AspiranteLayout>
  );
};

export default MisPostulaciones;
