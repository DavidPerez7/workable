import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOfertaById, eliminarOferta } from "../../../api/ofertasAPI";
import { obtenerPostulacionesPorOferta } from "../../../api/postulacionesAPI";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorAlert from "../../../components/reclutador/ReclutadorAlert";
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
      <ReclutadorLayout>
        <ReclutadorCard>Cargando oferta...</ReclutadorCard>
      </ReclutadorLayout>
    );
  }

  if (error || !oferta) {
    return (
      <ReclutadorLayout>
        <ReclutadorCard>
          <ReclutadorAlert>{error || "Oferta no encontrada"}</ReclutadorAlert>
          <Link to="/Reclutador" className="reclutador-button-RP">
            Volver
          </Link>
        </ReclutadorCard>
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
      <ReclutadorCard as="section">
        <ReclutadorSectionHeader
          kicker="Oferta"
          title={oferta.titulo || oferta.nom}
          action={<span className="oferta-estado-RP">{oferta.estado || oferta.estadoOferta || "ACTIVA"}</span>}
        />

        <div className="oferta-grid-RP">
          <div>
            <p className="oferta-label-RP">Descripcion</p>
            <p className="oferta-text-RP">{oferta.descripcion || oferta.desc || "No disponible"}</p>
          </div>
          <div>
            <p className="oferta-label-RP">Empresa</p>
            <p className="oferta-text-RP">{oferta.empresa?.nombre || "No especificada"}</p>
          </div>
          <div>
            <p className="oferta-label-RP">Ubicacion</p>
            <p className="oferta-text-RP">{oferta.municipio?.nombre || oferta.ubicacion || "-"}</p>
          </div>
          <div>
            <p className="oferta-label-RP">Salario</p>
            <p className="oferta-text-RP">{formatSalary(oferta.salario)}</p>
          </div>
          <div>
            <p className="oferta-label-RP">Experiencia</p>
            <p className="oferta-text-RP">{oferta.nivelExperiencia || "-"}</p>
          </div>
          <div>
            <p className="oferta-label-RP">Fecha limite</p>
            <p className="oferta-text-RP">{formatDate(oferta.fechaLimite || oferta.fechaPublicacion)}</p>
          </div>
        </div>

        <div className="oferta-actions-RP">
          <ReclutadorButton as={Link} to="/Reclutador" variant="link">Volver</ReclutadorButton>
          <ReclutadorButton as={Link} to={`/Reclutador/EditarOfertaLaboral?ofertaId=${ofertaId}`} variant="link">Editar</ReclutadorButton>
          <ReclutadorButton as={Link} to="/Reclutador/VerPostulacionesRecibidas" state={{ ofertaId }} variant="link">Ver postulaciones ({postulaciones.length})</ReclutadorButton>
          <ReclutadorButton type="button" onClick={handleDeleteOferta} disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </ReclutadorButton>
        </div>
      </ReclutadorCard>
    </ReclutadorLayout>
  );
};

export default OfertaCompletaPage;
