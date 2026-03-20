import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, RefreshCcw, Trash2 } from "lucide-react";
import AspiranteCard from "../../../../components/aspirante/AspiranteCard";
import AspiranteButton from "../../../../components/aspirante/AspiranteButton";
import AspiranteAlert from "../../../../components/aspirante/AspiranteAlert";
import AspiranteLayout from "../../AspiranteLayout";
import aspirantesApi from "../../../../api/aspirantesApi";
import {
  eliminarPostulacion,
} from "../../../../api/postulacionesAPI";
import "./MisPostulaciones.css";

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

  const cargarPostulaciones = async () => {
    try {
      setLoading(true);
      setError("");
      const usuarioId = localStorage.getItem("usuarioId");

      if (!usuarioId) {
        throw new Error("No se encontró el usuario autenticado.");
      }

      const aspirante = await aspirantesApi.get(usuarioId);
      setPostulaciones(Array.isArray(aspirante?.postulaciones) ? aspirante.postulaciones : []);
    } catch (err) {
      console.error("Error al obtener postulaciones:", err);
      setError(err.message || "No se pudieron cargar las postulaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPostulaciones();
  }, []);

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

  return (
    <AspiranteLayout shellClassName="postulaciones-shell-AP" mainClassName="postulaciones-main-AP">
      <section className="postulaciones-hero-AP">
        <div>
          <p className="postulaciones-kicker-AP">Mis postulaciones</p>
          <h1>Controla tus aplicaciones en un solo lugar</h1>
          <p>Vista simple con actualización real desde el endpoint del módulo aspirante.</p>
        </div>
        <AspiranteButton type="button" variant="secondary" onClick={cargarPostulaciones}>
          <RefreshCcw size={16} />
          Actualizar
        </AspiranteButton>
      </section>

      {error && (
        <AspiranteAlert type="error" className="postulaciones-alert-AP">
          <AlertCircle size={18} />
          <span>{error}</span>
        </AspiranteAlert>
      )}

      {loading ? (
        <div className="postulaciones-empty-AP asp-loading">Cargando postulaciones...</div>
      ) : postulaciones.length === 0 ? (
        <div className="postulaciones-empty-AP asp-empty">
          No tienes postulaciones registradas. <Link to="/Aspirante">Ver ofertas</Link>
        </div>
      ) : (
        <div className="postulaciones-list-AP">
          {postulaciones.map((postulacion) => (
            <AspiranteCard key={postulacion.id} className="postulacion-card-AP">
              <div className="postulacion-top-AP">
                <div>
                  <h2>{postulacion.oferta?.titulo || "Oferta sin título"}</h2>
                  <p>{postulacion.oferta?.empresa?.nombre || "Empresa"}</p>
                </div>
                <span className={`asp-badge ${getEstadoTone(postulacion.estado)}`}>
                  {postulacion.estado || "Pendiente"}
                </span>
              </div>

              <div className="postulacion-meta-AP">
                <span>{postulacion.oferta?.municipio?.nombre || "Sin ubicación"}</span>
                <span>{postulacion.oferta?.modalidad || "Sin modalidad"}</span>
                {postulacion.oferta?.salario && <span>{formatearSalario(postulacion.oferta.salario)}</span>}
              </div>

              {postulacion.citacion?.fecha && (
                <div className="citacion-box-AP">
                  <strong>Citación programada</strong>
                  <p>
                    {new Date(postulacion.citacion.fecha).toLocaleDateString("es-CO")}
                    {postulacion.citacion.hora ? ` · ${postulacion.citacion.hora}` : ""}
                  </p>
                  {postulacion.citacion.linkMeet && (
                    <a href={postulacion.citacion.linkMeet} target="_blank" rel="noreferrer">
                      Unirse a la reunión
                    </a>
                  )}
                </div>
              )}

              <div className="postulacion-footer-AP">
                <small>
                  Postulada el {new Date(postulacion.fechaCreacion).toLocaleDateString("es-CO")}
                </small>
                <AspiranteButton
                  type="button"
                  variant="danger"
                  onClick={() => handleEliminar(postulacion.id)}
                  disabled={eliminandoId === postulacion.id}
                >
                  <Trash2 size={16} />
                  {eliminandoId === postulacion.id ? "Eliminando..." : "Eliminar"}
                </AspiranteButton>
              </div>
            </AspiranteCard>
          ))}
        </div>
      )}
    </AspiranteLayout>
  );
};

export default MisPostulaciones;
