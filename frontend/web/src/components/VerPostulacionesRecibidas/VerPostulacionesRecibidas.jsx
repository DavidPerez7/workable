import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { CheckCircle2, XCircle, CalendarDays, FileText, Mail, Phone, Search, SlidersHorizontal } from "lucide-react";
import { getOfertaById } from "../../api/ofertasAPI";
import { obtenerPostulacionesPorOferta, cambiarEstadoPostulacion } from "../../api/postulacionesAPI";
import AspiranteCard from "../../components/aspirante/AspiranteCard";
import AspiranteSectionHeader from "../../components/aspirante/AspiranteSectionHeader";
import AspiranteFormField from "../../components/aspirante/AspiranteFormField";
import AspiranteButton from "../../components/aspirante/AspiranteButton";
import "../../pages/AspirantePage/AspirantePage.css";
import ReclutadorLayout from "../../pages/ReclutadorPage/ReclutadorLayout";
import "./VerPostulacionesRecibidas.css";

const VerPostulacionesRecibidas = () => {
  const { ofertaId: paramOfertaId } = useParams();
  const location = useLocation();
  const ofertaId = paramOfertaId || location.state?.ofertaId;

  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [oferta, setOferta] = useState(null);
  const [filtros, setFiltros] = useState({ texto: "", estado: "" });

  useEffect(() => {
    if (ofertaId) {
      fetchPostulaciones();
    } else {
      setError('No hay postulaciones disponibles');
      setLoading(false);
    }
  }, [ofertaId]);

  const fetchPostulaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ofertaData, postulacionesData] = await Promise.all([
        getOfertaById(ofertaId),
        obtenerPostulacionesPorOferta(ofertaId),
      ]);

      setOferta(ofertaData || null);
      setPostulaciones(postulacionesData || []);
    } catch (err) {
      console.error('Error al cargar postulaciones:', err);
      setError(err.message || 'Error al cargar postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (postulacionId, nuevoEstado) => {
    if (!window.confirm(`¿Estás seguro de cambiar el estado a "${nuevoEstado}"?`)) {
      return;
    }

    try {
      await cambiarEstadoPostulacion(postulacionId, nuevoEstado);
      await fetchPostulaciones();
      alert(`Estado actualizado correctamente a: ${nuevoEstado}`);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al actualizar el estado. Inténtalo de nuevo.');
    }
  };

  const getStatusClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'aceptado':
        return 'vp-status--aceptado';
      case 'rechazado':
        return 'vp-status--rechazado';
      case 'pendiente':
        return 'vp-status--pendiente';
      default:
        return 'vp-status--postulado';
    }
  };

  const getStatusText = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'aceptado':
        return 'Aceptado';
      case 'rechazado':
        return 'Rechazado';
      case 'pendiente':
        return 'Pendiente';
      default:
        return 'Postulado';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No definida';

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return 'No definida';

    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(parsedDate);
  };

  const normalizarTexto = (texto) =>
    (texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const postulacionesFiltradas = postulaciones.filter((postulacion) => {
    const texto = normalizarTexto(filtros.texto);
    const estado = normalizarTexto(filtros.estado);
    const nombreCompleto = normalizarTexto(`${postulacion.aspirante?.nombre || ""} ${postulacion.aspirante?.apellido || ""}`);
    const correo = normalizarTexto(postulacion.aspirante?.correo || "");
    const telefono = normalizarTexto(postulacion.aspirante?.telefono || "");
    const estadoPostulacion = normalizarTexto(postulacion.estado || "");

    const coincideTexto =
      !texto ||
      nombreCompleto.includes(texto) ||
      correo.includes(texto) ||
      telefono.includes(texto);

    const coincideEstado = !estado || estadoPostulacion === estado;

    return coincideTexto && coincideEstado;
  });

  const limpiarFiltros = () => {
    setFiltros({ texto: "", estado: "" });
  };

  if (loading) {
    return (
      <ReclutadorLayout>
        <div className="reclutador-card-RP">Cargando postulaciones...</div>
      </ReclutadorLayout>
    );
  }

  if (error) {
    return (
      <ReclutadorLayout>
        <div className="reclutador-card-RP">
          <p className="reclutador-alert-RP error">{error}</p>
        </div>
      </ReclutadorLayout>
    );
  }

  return (
    <ReclutadorLayout>
      <div className="vp-page">
        <div className="vp-header-section">
          <div className="vp-header-content">
            <h1 className="vp-header-title">POSTULACIONES RECIBIDAS</h1>
          </div>
        </div>

        {/* Oferta referenciada arriba de los stats */}
        <div className="vp-offer-card">
          <div className="vp-offer-card__header">
            <div className="vp-offer-card__title-row">
              <p className="vp-offer-card__kicker">Oferta referenciada</p>
              <div className="vp-offer-card__title-action">
                <h2 className="vp-offer-card__title">{oferta?.titulo || "Sin título"}</h2>
                <Link to={`/Reclutador/oferta/${ofertaId}`} className="vp-offer-card__view-btn">
                  Ver
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="vp-stats-section">
          <div className="vp-stats">
            <div className="vp-stat-item">
              <span className="vp-stat-number">{postulaciones.length}</span>
              <span className="vp-stat-label">Total</span>
            </div>
            <div className="vp-stat-item">
              <span className="vp-stat-number">
                {postulaciones.filter(p => p.estado === 'PENDIENTE').length}
              </span>
              <span className="vp-stat-label">Pendientes</span>
            </div>
            <div className="vp-stat-item">
              <span className="vp-stat-number">
                {postulaciones.filter(p => p.estado === 'ACEPTADO').length}
              </span>
              <span className="vp-stat-label">Aceptados</span>
            </div>
          </div>
        </div>

        <div className="aspirante-content-AP">
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
              Ajusta los filtros para reducir resultados y revisar más rápido las postulaciones.
            </p>

            <form className="filters-form-AP" onSubmit={(event) => event.preventDefault()}>
              <AspiranteFormField label="Cargo o nombre">
                <div className="asp-input-icon">
                  <Search size={16} />
                  <input
                    type="text"
                    value={filtros.texto}
                    onChange={(event) => setFiltros((current) => ({ ...current, texto: event.target.value }))}
                    placeholder="Nombre, correo o teléfono"
                  />
                </div>
              </AspiranteFormField>

              <AspiranteFormField label="Estado">
                <div className="asp-input-icon">
                  <SlidersHorizontal size={16} />
                  <select
                    value={filtros.estado}
                    onChange={(event) => setFiltros((current) => ({ ...current, estado: event.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="ENTREVISTA_PROGRAMADA">Entrevista</option>
                    <option value="ACEPTADO">Aceptado</option>
                    <option value="RECHAZADO">Rechazado</option>
                  </select>
                </div>
              </AspiranteFormField>

              <AspiranteButton type="submit">
                <SlidersHorizontal size={16} />
                Buscar
              </AspiranteButton>
            </form>
          </AspiranteCard>

          <div className="vp-main-column">
            <div className="vp-container">
          {postulacionesFiltradas.length === 0 ? (
            <div className="vp-empty">
              <div className="vp-empty-icon">📋</div>
              <h3 className="vp-empty-title">No hay postulaciones</h3>
              <p className="vp-empty-text">
                No hay postulaciones para los filtros actuales.
              </p>
            </div>
          ) : (
            postulacionesFiltradas.map((p) => (
              <div className="vp-item" key={p.id}>
                <div className="vp-item-content">
                  <div className="vp-header">
                    <div className="vp-avatar">
                      {p.aspirante?.nombre?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div className="vp-info">
                      <h3 className="vp-name">
                        {p.aspirante?.nombre || "Aspirante"} {p.aspirante?.apellido || ""}
                      </h3>
                      <span className={`vp-status ${getStatusClass(p.estado)}`}>
                        {getStatusText(p.estado)}
                      </span>
                    </div>
                  </div>

                  <div className="vp-main-info">
                    <div className="vp-info-group vp-info-group--highlight">
                      <div className="vp-info-item vp-info-item--strong">
                        <span className="vp-info-label"><Mail size={12} /> Correo electrónico</span>
                        <span className="vp-info-value vp-info-value--emphasis">{p.aspirante?.correo || "No disponible"}</span>
                      </div>
                      <div className="vp-info-item vp-info-item--strong">
                        <span className="vp-info-label"><Phone size={12} /> Teléfono</span>
                        <span className="vp-info-value vp-info-value--emphasis">{p.aspirante?.telefono || "No disponible"}</span>
                      </div>
                    </div>
                    <div className="vp-info-group">
                      <div className="vp-info-item vp-info-item--strong">
                        <span className="vp-info-label">Fecha de postulación</span>
                        <span className="vp-info-value vp-info-value--date">
                          {formatDate(p.fechaPostulacion || p.fechaCreacion || p.fecha)}
                        </span>
                      </div>
                      <div className="vp-info-item vp-info-item--link">
                        <span className="vp-info-label">Hoja de vida</span>
                        <Link
                          to={`/Reclutador/HojaDeVida/${p.aspirante?.id || ""}`}
                          state={{ returnTo: `/Reclutador/oferta/${ofertaId}/postulaciones` }}
                          className={`vp-hdv-link ${!p.aspirante?.id ? "vp-hdv-link--disabled" : ""}`}
                          aria-disabled={!p.aspirante?.id}
                          tabIndex={p.aspirante?.id ? 0 : -1}
                        >
                          <FileText size={15} />
                          Ver hoja de vida
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="vp-actions">
                    {p.estado === 'PENDIENTE' && (
                      <>
                        <button
                          className="vp-action-btn vp-action-btn--accept"
                          onClick={() => handleCambiarEstado(p.id, 'ACEPTADO')}
                        >
                          <CheckCircle2 size={16} aria-hidden="true" />
                          <span>Aceptar</span>
                        </button>
                        <button
                          className="vp-action-btn vp-action-btn--interview"
                          onClick={() => handleCambiarEstado(p.id, 'ENTREVISTA_PROGRAMADA')}
                        >
                          <CalendarDays size={16} aria-hidden="true" />
                          <span>Entrevista</span>
                        </button>
                        <button
                          className="vp-action-btn vp-action-btn--reject"
                          onClick={() => handleCambiarEstado(p.id, 'RECHAZADO')}
                        >
                          <XCircle size={16} aria-hidden="true" />
                          <span>Rechazar</span>
                        </button>
                      </>
                    )}
                    {p.estado === 'ENTREVISTA_PROGRAMADA' && (
                      <>
                        <button
                          className="vp-action-btn vp-action-btn--accept"
                          onClick={() => handleCambiarEstado(p.id, 'ACEPTADO')}
                        >
                          <CheckCircle2 size={16} aria-hidden="true" />
                          <span>Contratar</span>
                        </button>
                        <button
                          className="vp-action-btn vp-action-btn--reject"
                          onClick={() => handleCambiarEstado(p.id, 'RECHAZADO')}
                        >
                          <XCircle size={16} aria-hidden="true" />
                          <span>Rechazar</span>
                        </button>
                      </>
                    )}
                    {(p.estado === 'ACEPTADO' || p.estado === 'RECHAZADO') && (
                      <span className="vp-info-value" style={{ fontStyle: 'italic', color: '#64748b' }}>
                        Estado final: {p.estado}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
            </div>
          </div>
        </div>
      </div>

    </ReclutadorLayout>
  );
};

export default VerPostulacionesRecibidas;
