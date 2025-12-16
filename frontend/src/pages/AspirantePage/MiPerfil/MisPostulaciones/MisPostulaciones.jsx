import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header/Header";
import Menu from "../../../../components/Menu/Menu"
import SidebarAspirante from "../../../../components/SidebarAspirante/SidebarAspirante";
import { obtenerPostulacionesAspirante, eliminarPostulacion } from "../../../../api/postulacionesAPI";
import "./MisPostulaciones.css";

const MisPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eliminando, setEliminando] = useState(null);

  // ============================================
  //   📌 OBTENER POSTULACIONES – API REAL
  // ============================================
  useEffect(() => {
    obtenerPostulaciones();
  }, []);

  const obtenerPostulaciones = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await obtenerPostulacionesAspirante();
      setPostulaciones(data || []);
    } catch (error) {
      console.error("Error al obtener postulaciones:", error);
      setError(error.message || "Error al obtener postulaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarPostulacion = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta postulación?")) {
      setEliminando(id);
      try {
        await eliminarPostulacion(id);
        setPostulaciones(postulaciones.filter(post => post.id !== id));
        alert("Postulación eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar postulación:", error);
        alert("Error al eliminar la postulación: " + error.message);
      } finally {
        setEliminando(null);
      }
    }
  };

  const formatSalary = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  const getEstadoClass = (estado) => {
    if (!estado) return "mp-status-pending";
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes("revisión") || estadoLower.includes("revision")) return "mp-status-review";
    if (estadoLower.includes("rechazad")) return "mp-status-rejected";
    if (estadoLower.includes("aceptad")) return "mp-status-accepted";
    return "mp-status-pending";
  };

  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />
      <Menu />
      <div style={{display: 'flex', minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(135deg, #f5f7fa 0%, #E5E7EB 100%)'}}>
        <SidebarAspirante />
        <div className="mispostulaciones-container-MP" style={{flex: 1, padding: '2rem'}}>
        <h2 className="mp-title">Mis postulaciones</h2>
        <p className="mp-subtitle">
          Aquí puedes ver todas las ofertas a las que te has postulado.
        </p>

        {error && <div className="mp-error">{error}</div>}

        {loading ? (
          <p className="mp-loading">Cargando postulaciones...</p>
        ) : postulaciones.length === 0 ? (
          <div className="mp-empty">
            <p>No tienes postulaciones registradas.</p>
          </div>
        ) : (
          <div className="mp-list">
            {postulaciones.map((post) => (
              <div key={post.id} className="mp-card">
                <div className="mp-card-header">
                  <h3 className="mp-job-title">{post.oferta?.titulo || "Oferta sin título"}</h3>
                  <span className={`mp-status ${getEstadoClass(post.estado)}`}>
                    {post.estado || "Pendiente"}
                  </span>
                </div>

                <p className="mp-company">{post.oferta?.empresa?.nombre || "Empresa desconocida"}</p>
                <p className="mp-location">{post.oferta?.modalidad || "Modalidad no especificada"}</p>

                <div className="mp-tags">
                  {post.oferta?.modalidad && <span className="mp-tag modalidad">{post.oferta.modalidad}</span>}
                  {post.oferta?.tipoContrato && <span className="mp-tag contrato">{post.oferta.tipoContrato}</span>}
                </div>

                {/* CITACIÓN EMBEDDED */}
                {post.citacion && post.citacion.fecha && (
                  <div className="mp-citacion">
                    <h4 className="mp-citacion-title">📅 Citación programada</h4>
                    <div className="mp-citacion-info">
                      <p><strong>Fecha:</strong> {new Date(post.citacion.fecha).toLocaleDateString("es-CO")}</p>
                      {post.citacion.hora && <p><strong>Hora:</strong> {post.citacion.hora}</p>}
                      {post.citacion.linkMeet && (
                        <p>
                          <strong>Enlace:</strong>{" "}
                          <a href={post.citacion.linkMeet} target="_blank" rel="noopener noreferrer" className="mp-citacion-link">
                            Unirse a la reunión
                          </a>
                        </p>
                      )}
                      {post.citacion.detalles && <p><strong>Detalles:</strong> {post.citacion.detalles}</p>}
                      {post.citacion.estado && (
                        <span className={`mp-citacion-estado ${post.citacion.estado.toLowerCase()}`}>
                          {post.citacion.estado}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mp-footer">
                  {post.oferta?.salario && <p className="mp-salary">{formatSalary(post.oferta.salario)}</p>}
                  <p className="mp-date">Postulado el: {new Date(post.fechaCreacion).toLocaleDateString("es-CO")}</p>
                  <button 
                    className="mp-delete-btn"
                    onClick={() => handleEliminarPostulacion(post.id)}
                    disabled={eliminando === post.id}
                  >
                    {eliminando === post.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default MisPostulaciones;
