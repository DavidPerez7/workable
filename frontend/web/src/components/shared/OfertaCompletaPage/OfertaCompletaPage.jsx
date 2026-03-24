import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Edit, Users, Trash2, Send, Building2 } from "lucide-react";
import { getOfertaById, eliminarOferta } from "../../../api/ofertasAPI";
import { obtenerPostulacionesPorOferta, crearPostulacion } from "../../../api/postulacionesAPI";
import aspirantesApi from "../../../api/aspirantesApi";
import OfertaEditarModal from "../OfertaEditarModal/OfertaEditarModal";
import "./OfertaCompletaPage.css";

const OfertaCompletaPage = ({ layout: LayoutComponent }) => {
  const { ofertaId } = useParams();
  const navigate = useNavigate();
  const [oferta, setOferta] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postulando, setPostulando] = useState(false);
  const [yaPostulado, setYaPostulado] = useState(false);
  const [notice, setNotice] = useState("");

  // Detectar rol del usuario
  const userRole = localStorage.getItem("rol");

  const fetchOfertaData = async () => {
    try {
      setLoading(true);
      setError(null);

      const ofertaData = await getOfertaById(ofertaId);
      setOferta(ofertaData);

      // Si es reclutador, cargar postulaciones
      if (userRole === "RECLUTADOR") {
        try {
          const postulacionesData = await obtenerPostulacionesPorOferta(ofertaId);
          setPostulaciones(postulacionesData || []);
        } catch (err) {
          console.warn("No se pudieron cargar las postulaciones:", err);
          setPostulaciones([]);
        }
      }

      // Si es aspirante, verificar si ya se postuló
      if (userRole === "ASPIRANTE") {
        const usuarioId = localStorage.getItem("usuarioId");
        if (usuarioId) {
          try {
            const aspirante = await aspirantesApi.get(Number(usuarioId));
            const postulaciones = aspirante.postulaciones || [];
            const yaPostuladoCheck = postulaciones.some(p => p.ofertaId === Number(ofertaId));
            setYaPostulado(yaPostuladoCheck);
          } catch (err) {
            console.warn("Error al verificar postulación previa:", err);
          }
        }
      }
    } catch (err) {
      console.error("Error al cargar la oferta:", err);
      setError("No se pudo cargar la oferta. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertaData();
  }, [ofertaId, userRole]);

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

  const handlePostularse = async () => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
      setNotice("Debes iniciar sesión para postularte.");
      return;
    }

    try {
      setPostulando(true);
      setNotice("");
      await crearPostulacion({
        aspirante: { id: Number(usuarioId) },
        oferta: { id: Number(ofertaId) },
      });
      setNotice("Postulación enviada correctamente.");
      setYaPostulado(true);
    } catch (err) {
      console.error("Error al postularse:", err);
      setNotice(err.message || "No se pudo enviar la postulación.");
    } finally {
      setPostulando(false);
    }
  };

  const handleOfertaActualizada = async () => {
    setShowEditModal(false);
    await fetchOfertaData();
  };

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

  if (loading) {
    return (
      <LayoutComponent>
        <div>Cargando oferta...</div>
      </LayoutComponent>
    );
  }

  if (error || !oferta) {
    return (
      <LayoutComponent>
        <div style={{ padding: "2rem", textAlign: "center", color: "#dc2626" }}>
          <h2>{error || "Oferta no encontrada"}</h2>
          <Link to={userRole === "RECLUTADOR" ? "/Reclutador" : "/Aspirante"} style={{ marginTop: "1rem", display: "inline-block", color: "#1b337a" }}>
            Volver
          </Link>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {/* Hero Section */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
          <div>
            <p style={{ margin: "0 0 0.5rem", color: "#2563eb", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "800" }}>
              Detalle completo
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
              <h1 style={{ margin: "0", fontSize: "2rem", fontWeight: "700", color: "#0f172a" }}>
                {oferta.titulo || "Sin título"}
              </h1>
              <span style={{ display: "inline-block", padding: "0.5rem 1rem", background: "#f1f5f9", borderRadius: "999px", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a" }}>
                {oferta.estado || "Estado"}
              </span>
            </div>
            <p style={{ margin: "0", color: "#64748b", fontSize: "1.1rem" }}>
              <Link to={`/EmpresaPerfil/${oferta.empresa?.id}`} className="empresa-link-shared">
                <Building2 size={14} />
                {oferta.empresa?.nombre || "Empresa"}
              </Link>
            </p>
          </div>
        </div>

        {/* Info Sections */}
        <div style={{ background: "white", borderRadius: "12px", padding: "0.75rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
          <p className="oferta-section-header-RP">
            Descripción
          </p>
          <h2 className="oferta-section-title-RP">
            Detalles de la oferta
          </h2>
          <p className="oferta-description-RP">
            {oferta.descripcion || "Sin descripción disponible."}
          </p>
          {oferta.requisitos ? (
            <div className="oferta-requirements-RP">
              <p className="oferta-requirements-header-RP">
                Requisitos
              </p>
              <p className="oferta-requirements-text-RP">
                {oferta.requisitos}
              </p>
            </div>
          ) : null}
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "0.75rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
          <p className="oferta-section-header-RP">
            Resumen
          </p>
          <h2 className="oferta-section-title-RP">
            Información principal
          </h2>
          <div className="oferta-info-grid-RP">
            <div className="oferta-info-item-RP">
              <div className="oferta-info-label-RP">Empresa</div>
              <p className="oferta-info-value-RP">{oferta.empresa?.nombre || "No especificada"}</p>
            </div>
            <div className="oferta-info-item-RP">
              <div className="oferta-info-label-RP">Experiencia</div>
              <p className="oferta-info-value-RP">{oferta.nivelExperiencia || "No definida"}</p>
            </div>
            <div className="oferta-info-item-RP">
              <div className="oferta-info-label-RP">Ubicación</div>
              <p className="oferta-info-value-RP">{oferta.municipio?.nombre || oferta.ubicacion || "-"}</p>
            </div>
            <div className="oferta-info-item-RP">
              <div className="oferta-info-label-RP">Salario</div>
              <p className="oferta-info-value-RP">{formatSalary(oferta.salario)}</p>
            </div>
            <div className="oferta-info-item-RP">
              <div className="oferta-info-label-RP">Modalidad</div>
              <p className="oferta-info-value-RP">{oferta.modalidad || "No definida"}</p>
            </div>
            <div className="oferta-info-item-RP">
              <div className="oferta-info-label-RP">Fecha límite</div>
              <p className="oferta-info-value-RP">{formatDate(oferta.fechaLimite || oferta.fechaPublicacion)}</p>
            </div>
            <div className="oferta-info-item-full-RP">
              <div className="oferta-info-label-RP">Tipo contrato</div>
              <p className="oferta-info-value-RP">{oferta.tipoContrato || "No definido"}</p>
            </div>
          </div>
        </div>

        {/* Actions - Cambian según el rol */}
        <div style={{ background: "white", borderRadius: "12px", padding: "0.75rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
          <p className="oferta-section-header-RP">
            Acciones
          </p>
          <h2 className="oferta-section-title-RP">
            {userRole === "RECLUTADOR" ? "Gestionar oferta" : "Aplicar a la oferta"}
          </h2>

          {notice && (
            <div style={{ marginBottom: "1rem", padding: "1rem", background: notice.includes("correctamente") ? "#d1fae5" : "#fee2e2", borderRadius: "8px", color: notice.includes("correctamente") ? "#065f46" : "#dc2626" }}>
              {notice}
            </div>
          )}

          <div className="oferta-actions-RP">
            {userRole === "RECLUTADOR" ? (
              <>
                <Link
                  to="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setShowEditModal(true);
                  }}
                  className="oferta-action-btn-RP oferta-action-edit-RP"
                >
                  <Edit size={16} /> Editar oferta
                </Link>
                <Link
                  to={`/Reclutador/oferta/${ofertaId}/postulaciones`}
                  className="oferta-action-btn-RP oferta-action-view-RP"
                >
                  <Users size={16} /> Ver postulaciones ({postulaciones.length})
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteOferta}
                  disabled={deleting}
                  className="oferta-action-btn-RP oferta-action-delete-RP"
                >
                  <Trash2 size={16} /> {deleting ? "Eliminando..." : "Eliminar oferta"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handlePostularse}
                disabled={yaPostulado || postulando}
                className="oferta-action-btn-RP oferta-action-apply-RP"
              >
                {yaPostulado ? "Ya te has postulado" : postulando ? "Postulando..." : "Postularme"}
                {!yaPostulado && <Send size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {userRole === "RECLUTADOR" && (
        <OfertaEditarModal
          isOpen={showEditModal}
          ofertaId={ofertaId}
          ofertaInicial={oferta}
          onClose={() => setShowEditModal(false)}
          onSaved={handleOfertaActualizada}
        />
      )}
    </LayoutComponent>
  );
};

export default OfertaCompletaPage;