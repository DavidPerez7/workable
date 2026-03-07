import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOfertaById, eliminarOferta } from "../../../api/ofertasAPI";
import { obtenerPostulacionesPorOferta } from "../../../api/postulacionesAPI";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import "./OfertaCompletaPage.css";

const OfertaCompletaPage = () => {
  const { ofertaId } = useParams();
  const navigate = useNavigate();
  const [oferta, setOferta] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchOfertaData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener datos de la oferta
        const ofertaData = await getOfertaById(ofertaId);
        setOferta(ofertaData);

        // Obtener postulaciones de la oferta
        try {
          const postulacionesData = await obtenerPostulacionesPorOferta(ofertaId);
          setPostulaciones(postulacionesData || []);
        } catch (err) {
          console.warn("No se pudieron cargar las postulaciones:", err);
          setPostulaciones([]);
        }
      } catch (err) {
        console.error("Error al cargar la oferta:", err);
        setError("No se pudo cargar la oferta. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchOfertaData();
  }, [ofertaId]);

  const handleDeleteOferta = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta oferta? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      setDeleting(true);
      await eliminarOferta(ofertaId);
      alert("Oferta eliminada exitosamente");
      navigate("/Reclutador/EnterprisePage");
    } catch (err) {
      console.error("Error al eliminar oferta:", err);
      alert("Error al eliminar la oferta. Intenta más tarde.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <main className="oferta-completa-main">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando oferta...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !oferta) {
    return (
      <>
        <HeaderReclutador />
        <main className="oferta-completa-main">
          <div className="error-state">
            <p>{error || "Oferta no encontrada"}</p>
            <Link to="/Reclutador" className="btn-return">
              Volver al dashboard
            </Link>
          </div>
        </main>
      </>
    );
  }

  const formatSalary = (salary) => {
    if (!salary) return "Salario no especificado";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (date) => {
    if (!date) return "Fecha no especificada";
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <>
      <HeaderReclutador />
      <main className="oferta-completa-main">
        {/* Header */}
        <div className="oferta-header">
          <Link to="/Reclutador" className="btn-back">
            ← Volver
          </Link>
          <h1 className="oferta-titulo">{oferta.titulo || oferta.nom}</h1>
          <span className={`estado-badge ${oferta.estado?.toLowerCase()}`}>
            {oferta.estado}
          </span>
        </div>

        <div className="oferta-container">
          {/* Sección Principal */}
          <section className="oferta-principal">
            {/* Info General */}
            <div className="info-general">
              <div className="info-card">
                <h2 className="card-title">Información General</h2>

                <div className="info-grid">
                  <div className="info-item">
                    <label>Título de la posición</label>
                    <p>{oferta.titulo || oferta.nom}</p>
                  </div>

                  <div className="info-item">
                    <label>Descripción</label>
                    <p>{oferta.descripcion || oferta.desc || "No disponible"}</p>
                  </div>

                  <div className="info-item">
                    <label>Empresa</label>
                    <p>{oferta.empresa?.nombre || "No especificada"}</p>
                  </div>

                  <div className="info-item">
                    <label>Ubicación</label>
                    <p className="location">
                      📍 {oferta.ubicacion || oferta.ubi || "No especificada"}
                    </p>
                  </div>

                  <div className="info-item">
                    <label>Salario</label>
                    <p className="salary">💰 {formatSalary(oferta.salario)}</p>
                  </div>

                  <div className="info-item">
                    <label>Tipo de contrato</label>
                    <p>{oferta.tipoContrato?.nombre || "No especificado"}</p>
                  </div>

                  <div className="info-item">
                    <label>Nivel de experiencia</label>
                    <p>
                      {oferta.nivelExperiencia?.nombre ||
                        oferta.nivelExperiencia ||
                        "No especificado"}
                    </p>
                  </div>

                  <div className="info-item">
                    <label>Fecha de publicación</label>
                    <p>{formatDate(oferta.fechaPublicacion)}</p>
                  </div>

                  {oferta.fechaCierre && (
                    <div className="info-item">
                      <label>Fecha de cierre</label>
                      <p>{formatDate(oferta.fechaCierre)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Requisitos */}
              {oferta.requisitos && (
                <div className="info-card">
                  <h2 className="card-title">Requisitos</h2>
                  <p className="card-content">{oferta.requisitos}</p>
                </div>
              )}

              {/* Responsabilidades */}
              {oferta.responsabilidades && (
                <div className="info-card">
                  <h2 className="card-title">Responsabilidades</h2>
                  <p className="card-content">{oferta.responsabilidades}</p>
                </div>
              )}

              {/* Beneficios */}
              {oferta.beneficios && (
                <div className="info-card">
                  <h2 className="card-title">Beneficios</h2>
                  <p className="card-content">{oferta.beneficios}</p>
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <aside className="oferta-sidebar">
              <div className="stats-card">
                <div className="stat-item">
                  <span className="stat-number">{postulaciones.length}</span>
                  <span className="stat-label">Postulaciones</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {postulaciones.filter((p) => p.estado === "ACEPTADA")
                      .length}
                  </span>
                  <span className="stat-label">Aceptadas</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {postulaciones.filter((p) => p.estado === "PENDIENTE")
                      .length}
                  </span>
                  <span className="stat-label">Pendientes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {postulaciones.filter((p) => p.estado === "RECHAZADA")
                      .length}
                  </span>
                  <span className="stat-label">Rechazadas</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="actions-card">
                <h3>Acciones</h3>
                <Link 
                  to={`/Reclutador/EditarOfertaLaboral?ofertaId=${ofertaId}`} 
                  className="btn-action"
                >
                  ✏️ Editar oferta
                </Link>
                <Link
                  to="/Reclutador/VerPostulacionesRecibidas"
                  state={{ ofertaId }}
                  className="btn-action btn-view-applications"
                >
                  👥 Ver postulaciones
                </Link>
                <button 
                  onClick={handleDeleteOferta}
                  disabled={deleting}
                  className="btn-action btn-delete"
                >
                  {deleting ? "🗑️ Eliminando..." : "🗑️ Eliminar oferta"}
                </button>
              </div>
            </aside>
          </section>

          {/* Postulaciones */}
          {postulaciones.length > 0 && (
            <section className="postulaciones-section">
              <h2 className="section-title">Postulaciones Recientes</h2>
              <div className="postulaciones-grid">
                {postulaciones.slice(0, 5).map((postulacion) => (
                  <div className="postulacion-card" key={postulacion.id}>
                    <div className="postulacion-header">
                      <div className="postulacion-avatar">
                        {postulacion.aspirante?.nombre?.charAt(0) || "A"}
                      </div>
                      <div className="postulacion-info">
                        <p className="postulacion-nombre">
                          {postulacion.aspirante?.nombre}{" "}
                          {postulacion.aspirante?.apellido}
                        </p>
                        <p className="postulacion-email">
                          {postulacion.aspirante?.correo}
                        </p>
                      </div>
                      <span className={`estado-mini ${postulacion.estado?.toLowerCase()}`}>
                        {postulacion.estado}
                      </span>
                    </div>
                    <p className="postulacion-fecha">
                      📅 {formatDate(postulacion.fechaPostulacion)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default OfertaCompletaPage;
