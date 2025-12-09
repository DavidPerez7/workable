import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header/Header";
import Menu from "../../../../components/Menu/Menu"
import { obtenerPostulacionesAspirante, eliminarPostulacion } from "../../../../api/postulacionesAPI";
import "./MisPostulaciones.css";

const MisPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      try {
        await eliminarPostulacion(id);
        setPostulaciones(postulaciones.filter(post => post.id !== id));
      } catch (error) {
        console.error("Error al eliminar postulación:", error);
        alert("Error al eliminar la postulación: " + error.message);
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
      <div className="mispostulaciones-container-MP">
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

                <div className="mp-footer">
                  {post.oferta?.salario && <p className="mp-salary">{formatSalary(post.oferta.salario)}</p>}
                  <p className="mp-date">Postulado el: {new Date(post.fechaCreacion).toLocaleDateString("es-CO")}</p>
                  <button 
                    className="mp-delete-btn"
                    onClick={() => handleEliminarPostulacion(post.id)}
                  >
                    Eliminar
                  </button>
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
