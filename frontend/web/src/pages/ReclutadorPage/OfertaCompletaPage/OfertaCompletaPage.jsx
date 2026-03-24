import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Edit, Users, Trash2 } from "lucide-react";
import { getOfertaById, eliminarOferta } from "../../../api/ofertasAPI";
import { obtenerPostulacionesPorOferta } from "../../../api/postulacionesAPI";
import ReclutadorLayout from "../ReclutadorLayout";

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
      <ReclutadorLayout>
        <div>Cargando oferta...</div>
      </ReclutadorLayout>
    );
  }

  if (error || !oferta) {
    return (
      <ReclutadorLayout>
        <div style={{ padding: "2rem", textAlign: "center", color: "#dc2626" }}>
          <h2>{error || "Oferta no encontrada"}</h2>
          <Link to="/Reclutador" style={{ marginTop: "1rem", display: "inline-block", color: "#1b337a" }}>
            Volver
          </Link>
        </div>
      </ReclutadorLayout>
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
    <ReclutadorLayout>
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {/* Hero Section */}
        <div style={{ background: "white", borderRadius: "12px", padding: "2rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
          <div>
            <p style={{ margin: "0 0 0.5rem", color: "#2563eb", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "800" }}>
              Detalle completo
            </p>
            <h1 style={{ margin: "0 0 0.5rem", fontSize: "2.5rem", fontWeight: "700", color: "#0f172a" }}>
              {oferta.titulo || "Sin título"}
            </h1>
            <p style={{ margin: "0", color: "#64748b", fontSize: "1.1rem" }}>
              <Link to={`/Empresas/${oferta.empresa?.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: "700" }}>
                {oferta.empresa?.nombre || "Empresa"} • Ver perfil
              </Link>
            </p>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <span style={{ display: "inline-block", padding: "0.5rem 1rem", background: "#f1f5f9", borderRadius: "999px", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a" }}>
              {oferta.estado || "Estado"}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
            <p style={{ margin: "0 0 1rem", color: "#2563eb", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "800" }}>
              Resumen
            </p>
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: "700", color: "#0f172a" }}>
              Información principal
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <strong style={{ color: "#0f172a" }}>Empresa</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b" }}>{oferta.empresa?.nombre || "No especificada"}</p>
              </div>
              <div>
                <strong style={{ color: "#0f172a" }}>Ubicación</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b" }}>{oferta.municipio?.nombre || oferta.ubicacion || "-"}</p>
              </div>
              <div>
                <strong style={{ color: "#0f172a" }}>Modalidad</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b" }}>{oferta.modalidad || "No definida"}</p>
              </div>
              <div>
                <strong style={{ color: "#0f172a" }}>Experiencia</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b" }}>{oferta.nivelExperiencia || "No definida"}</p>
              </div>
              <div>
                <strong style={{ color: "#0f172a" }}>Salario</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b" }}>{formatSalary(oferta.salario)}</p>
              </div>
              <div>
                <strong style={{ color: "#0f172a" }}>Fecha límite</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b" }}>{formatDate(oferta.fechaLimite || oferta.fechaPublicacion)}</p>
              </div>
              <div>
                <strong style={{ color: "#0f172a" }}>Tipo contrato</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b" }}>{oferta.tipoContrato || "No definido"}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
            <p style={{ margin: "0 0 1rem", color: "#2563eb", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "800" }}>
              Descripción
            </p>
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: "700", color: "#0f172a" }}>
              Detalles de la oferta
            </h2>
            <p style={{ margin: "0 0 1rem", color: "#475569", lineHeight: "1.6" }}>
              {oferta.descripcion || "Sin descripción disponible."}
            </p>
            {oferta.requisitos ? (
              <>
                <p style={{ margin: "1.5rem 0 0.5rem", color: "#2563eb", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "800" }}>
                  Requisitos
                </p>
                <p style={{ margin: "0", color: "#475569", lineHeight: "1.6" }}>
                  {oferta.requisitos}
                </p>
              </>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
          <p style={{ margin: "0 0 1rem", color: "#2563eb", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "800" }}>
            Acciones
          </p>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: "700", color: "#0f172a" }}>
            Gestionar oferta
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            <Link
              to={`/Reclutador/EditarOfertaLaboral?ofertaId=${ofertaId}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                background: "#2563eb",
                border: "none",
                borderRadius: "10px",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <Edit size={16} /> Editar oferta
            </Link>
            <Link
              to={`/Reclutador/oferta/${ofertaId}/postulaciones`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                background: "#2563eb",
                border: "none",
                borderRadius: "10px",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <Users size={16} /> Ver postulaciones ({postulaciones.length})
            </Link>
            <button
              type="button"
              onClick={handleDeleteOferta}
              disabled={deleting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                background: "#dc2626",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontWeight: "600",
                cursor: deleting ? "not-allowed" : "pointer",
                opacity: deleting ? 0.6 : 1
              }}
            >
              <Trash2 size={16} /> {deleting ? "Eliminando..." : "Eliminar oferta"}
            </button>
          </div>
        </div>
      </div>
    </ReclutadorLayout>
  );
};

export default OfertaCompletaPage;
