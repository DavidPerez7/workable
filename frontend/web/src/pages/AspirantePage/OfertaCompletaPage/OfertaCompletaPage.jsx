import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Briefcase, Building2, MapPin, Send } from "lucide-react";
import AspiranteLayout from "../AspiranteLayout";
import AspiranteCard from "../../../components/aspirante/AspiranteCard";
import AspiranteSectionHeader from "../../../components/aspirante/AspiranteSectionHeader";
import AspiranteButton from "../../../components/aspirante/AspiranteButton";
import AspiranteAlert from "../../../components/aspirante/AspiranteAlert";
import { getOfertaById } from "../../../api/ofertasAPI";
import { crearPostulacion } from "../../../api/postulacionesAPI";
import aspirantesApi from "../../../api/aspirantesApi";
import "./OfertaCompletaPageSimple.css";

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

const OfertaCompletaPage = () => {
  const { ofertaId } = useParams();
  const navigate = useNavigate();
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [postulando, setPostulando] = useState(false);
  const [yaPostulado, setYaPostulado] = useState(false);

  useEffect(() => {
    const cargarOferta = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOfertaById(ofertaId);
        setOferta(data);

        // Verificar si ya se postuló
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
      } catch (err) {
        console.error("Error al cargar la oferta:", err);
        setError("No se pudo cargar el detalle de la oferta.");
      } finally {
        setLoading(false);
      }
    };

    cargarOferta();
  }, [ofertaId]);

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
    } catch (err) {
      console.error("Error al postularse:", err);
      setNotice(err.message || "No se pudo enviar la postulación.");
    } finally {
      setPostulando(false);
    }
  };

  return (
    <AspiranteLayout shellClassName="aspirante-shell-AP" mainClassName="oferta-detail-main-AP">
      {loading ? (
        <AspiranteCard>Cargando detalle...</AspiranteCard>
      ) : error || !oferta ? (
        <AspiranteCard>
          <AspiranteAlert type="error">{error || "Oferta no encontrada"}</AspiranteAlert>
          <AspiranteButton as={Link} to="/Aspirante" variant="secondary">
            Volver
          </AspiranteButton>
        </AspiranteCard>
      ) : (
        <>
          <AspiranteCard as="section" className="oferta-detail-hero-AP">
            <div>
              <p className="aspirante-kicker-AP">Detalle completo</p>
              <h1>{oferta.titulo || "Sin título"}</h1>
              <p className="oferta-detail-subtitle-AP">
                <Link to={`/Empresas/${oferta.empresa?.id}`} className="empresa-link" title={`Ver perfil de ${oferta.empresa?.nombre}`}>
                  {oferta.empresa?.nombre || "Empresa"} • Ver perfil
                </Link>
              </p>
            </div>
            <div className="oferta-detail-actions-AP">
              <span className="detail-badge-AP">{oferta.tipoContrato || "Contrato"}</span>
            </div>
          </AspiranteCard>

          {notice ? <AspiranteAlert type="success">{notice}</AspiranteAlert> : null}

          <section className="oferta-detail-grid-AP">
            <AspiranteCard className="oferta-detail-card-AP">
              <AspiranteSectionHeader kicker="Resumen" title="Información principal" />
              <div className="oferta-detail-meta-AP">
                <div>
                  <strong><Building2 size={16} /> Empresa</strong>
                  <span>{oferta.empresa?.nombre || "No especificada"}</span>
                </div>
                <div>
                  <strong><MapPin size={16} /> Ubicación</strong>
                  <span>{oferta.municipio?.nombre || oferta.ubicacion || "-"}</span>
                </div>
                <div>
                  <strong><Briefcase size={16} /> Modalidad</strong>
                  <span>{oferta.modalidad || "No definida"}</span>
                </div>
                <div>
                  <strong>Experiencia</strong>
                  <span>{oferta.nivelExperiencia || "No definida"}</span>
                </div>
                <div>
                  <strong>Salario</strong>
                  <span>{formatSalary(oferta.salario)}</span>
                </div>
                <div>
                  <strong>Fecha límite</strong>
                  <span>{formatDate(oferta.fechaLimite || oferta.fechaPublicacion)}</span>
                </div>
                <div>
                  <strong>Fecha publicación</strong>
                  <span>{formatDate(oferta.fechaPublicacion)}</span>
                </div>
                <div>
                  <strong>Tipo contrato</strong>
                  <span>{oferta.tipoContrato || "No definido"}</span>
                </div>
                <div>
                  <strong>Número vacantes</strong>
                  <span>{oferta.numeroVacantes || "No especificado"}</span>
                </div>
                <div>
                  <strong>Estado</strong>
                  <span>{oferta.estado || "No definido"}</span>
                </div>
              </div>
            </AspiranteCard>

            <AspiranteCard className="oferta-detail-card-AP">
              <AspiranteSectionHeader kicker="Descripción" title="Detalles de la oferta" />
              <p className="oferta-detail-text-AP">{oferta.descripcion || "Sin descripción disponible."}</p>
              {oferta.requisitos ? (
                <>
                  <AspiranteSectionHeader kicker="Requisitos" title="Lo que se espera" />
                  <p className="oferta-detail-text-AP">{oferta.requisitos}</p>
                </>
              ) : null}
              <AspiranteButton type="button" onClick={handlePostularse} disabled={yaPostulado || postulando}>
                {yaPostulado ? "Ya te has postulado" : postulando ? "Postulando..." : "Postularme"}
                {!yaPostulado && <Send size={16} />}
              </AspiranteButton>
            </AspiranteCard>
          </section>
        </>
      )}
    </AspiranteLayout>
  );
};

export default OfertaCompletaPage;
