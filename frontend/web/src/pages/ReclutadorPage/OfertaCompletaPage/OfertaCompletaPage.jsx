import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOfertaById, eliminarOferta } from "../../../api/ofertasAPI";
import { obtenerPostulacionesPorOferta } from "../../../api/postulacionesAPI";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
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
        <main className="reclutador-main-RP">
          <div className="reclutador-card-RP">Cargando oferta...</div>
        </main>
      </>
    );
  }

  if (error || !oferta) {
    return (
      <>
        <HeaderReclutador />
        <main className="reclutador-main-RP">
          <div className="reclutador-card-RP">
            <p className="reclutador-alert-RP error">{error || "Oferta no encontrada"}</p>
            <Link to="/Reclutador" className="reclutador-button-RP">
              Volver
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
      <div className="reclutador-shell-RP">
        <SidebarReclutador />
        <main className="reclutador-main-RP">
          <section className="reclutador-card-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Oferta</p>
                <h2>{oferta.titulo || oferta.nom}</h2>
              </div>
              <span className="oferta-estado-RP">{oferta.estado || oferta.estadoOferta || "ACTIVA"}</span>
            </div>

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
              <Link to="/Reclutador" className="reclutador-link-RP">
                Volver
              </Link>
              <Link to={`/Reclutador/EditarOfertaLaboral?ofertaId=${ofertaId}`} className="reclutador-link-RP">
                Editar
              </Link>
              <Link to="/Reclutador/VerPostulacionesRecibidas" state={{ ofertaId }} className="reclutador-link-RP">
                Ver postulaciones ({postulaciones.length})
              </Link>
              <button
                type="button"
                className="oferta-danger-RP"
                onClick={handleDeleteOferta}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default OfertaCompletaPage;
