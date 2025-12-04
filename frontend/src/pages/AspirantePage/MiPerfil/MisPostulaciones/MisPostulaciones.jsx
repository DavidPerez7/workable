import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAspirant from "../../../../components/HeaderAspirant/HeaderAspirant";
import Menu from "../../../../components/Menu/Menu";
import { getPostulacionesPorUsuario, eliminarPostulacion } from "../../../../api/postulacionAPI";
import "./MisPostulaciones.css";

const MisPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // ============================================
  //   📌 OBTENER POSTULACIONES REALES
  // ============================================
  useEffect(() => {
    if (!userId) {
      navigate("/Login");
      return;
    }
    obtenerPostulaciones();
  }, [userId]);

  const obtenerPostulaciones = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPostulacionesPorUsuario(userId);
      setPostulaciones(data);
    } catch (err) {
      console.error("Error al obtener postulaciones:", err);
      setError("No se pudieron cargar tus postulaciones");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  //   🗑️ CANCELAR POSTULACIÓN
  // ============================================
  const cancelarPostulacion = async (postulacionId) => {
    if (!window.confirm("¿Estás seguro de cancelar esta postulación?")) return;

    try {
      await eliminarPostulacion(postulacionId, userId);
      setPostulaciones(postulaciones.filter(p => p.id !== postulacionId));
      alert("Postulación cancelada exitosamente");
    } catch (err) {
      console.error("Error al cancelar postulación:", err);
      alert("No se pudo cancelar la postulación");
    }
  };

  // ============================================
  //   🏷️ OBTENER CLASE DE ESTADO
  // ============================================
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "mp-status-pending";
      case "ACEPTADO":
        return "mp-status-accepted";
      case "RECHAZADO":
        return "mp-status-rejected";
      case "ENTREVISTA_PROGRAMADA":
        return "mp-status-review";
      default:
        return "";
    }
  };

  // ============================================
  //   🏷️ FORMATEAR ESTADO PARA MOSTRAR
  // ============================================
  const formatEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "Pendiente";
      case "ACEPTADO":
        return "Aceptado";
      case "RECHAZADO":
        return "Rechazado";
      case "ENTREVISTA_PROGRAMADA":
        return "Entrevista Programada";
      default:
        return estado;
    }
  };

  // ============================================
  //   📅 FORMATEAR FECHA
  // ============================================
  const formatFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // ============================================
  //   💰 FORMATEAR SALARIO
  // ============================================
  const formatSalary = (value) => {
    if (!value) return "No especificado";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <HeaderAspirant />
      <Menu />
      <div className="mispostulaciones-container-MP">
        <h2 className="mp-title">Mis postulaciones</h2>
        <p className="mp-subtitle">
          Aquí puedes ver todas las ofertas a las que te has postulado.
        </p>

        {loading ? (
          <p className="mp-loading">Cargando postulaciones...</p>
        ) : error ? (
          <div className="mp-error">
            <p>{error}</p>
            <button onClick={obtenerPostulaciones}>Reintentar</button>
          </div>
        ) : postulaciones.length === 0 ? (
          <div className="mp-empty">
            <p>No tienes postulaciones registradas.</p>
            <button onClick={() => navigate("/AspirantePage")}>
              Explorar ofertas
            </button>
          </div>
        ) : (
          <div className="mp-list">
            {postulaciones.map((post) => (
              <div key={post.id} className="mp-card">
                <div className="mp-card-header">
                  <h3 className="mp-job-title">
                    {post.oferta?.titulo || "Oferta sin título"}
                  </h3>
                  <span className={`mp-status ${getEstadoClass(post.estado)}`}>
                    {formatEstado(post.estado)}
                  </span>
                </div>

                <p className="mp-company">
                  {post.oferta?.empresa?.nombre || "Empresa no especificada"}
                </p>
                <p className="mp-location">
                  {post.oferta?.municipio?.nombre || "Ubicación no especificada"}
                  {post.oferta?.municipio?.departamento && `, ${post.oferta.municipio.departamento}`}
                </p>

                <div className="mp-tags">
                  <span className="mp-tag modalidad">
                    {post.oferta?.modalidad || "N/A"}
                  </span>
                  <span className="mp-tag contrato">
                    {post.oferta?.tipoContrato?.replace(/_/g, " ") || "N/A"}
                  </span>
                </div>

                <div className="mp-footer">
                  <p className="mp-salary">
                    {formatSalary(post.oferta?.salario)}
                  </p>
                  <p className="mp-date">
                    Postulado el: {formatFecha(post.fechaCreacion)}
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="mp-actions">
                  <button 
                    className="mp-btn-view"
                    onClick={() => navigate(`/oferta/${post.oferta?.id}`)}
                  >
                    Ver oferta
                  </button>
                  {post.estado === "PENDIENTE" && (
                    <button 
                      className="mp-btn-cancel"
                      onClick={() => cancelarPostulacion(post.id)}
                    >
                      Cancelar postulación
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MisPostulaciones;
