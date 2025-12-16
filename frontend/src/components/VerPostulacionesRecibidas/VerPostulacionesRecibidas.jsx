import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { obtenerPostulacionesPorOferta, cambiarEstadoPostulacion } from "../../api/postulacionesAPI";
import HeaderReclutador from "../HeaderReclutador/HeaderReclutador";
import "./VerPostulacionesRecibidas.css";

const VerPostulacionesRecibidas = ({ ofertas = [] }) => {
  const location = useLocation();
  const ofertaId = location.state?.ofertaId;

  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [ordenFecha, setOrdenFecha] = useState("desc");

  useEffect(() => {
    if (ofertaId) {
      // Si se especificó una oferta específica, cargar solo sus postulaciones
      fetchPostulaciones();
    } else if (ofertas && ofertas.length > 0) {
      // Si se pasaron ofertas como prop, cargar postulaciones de todas ellas
      fetchAllPostulaciones();
    } else {
      setError('No hay ofertas disponibles');
      setLoading(false);
    }
  }, [ofertaId, ofertas]);

  const fetchPostulaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerPostulacionesPorOferta(ofertaId);
      setPostulaciones(data || []);
    } catch (err) {
      console.error('Error al cargar postulaciones:', err);
      setError(err.message || 'Error al cargar postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPostulaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const allPostulaciones = [];

      // Cargar postulaciones de cada oferta
      for (const oferta of ofertas) {
        try {
          const data = await obtenerPostulacionesPorOferta(oferta.id);
          if (data && data.length > 0) {
            // Agregar la información de la oferta a cada postulación
            const postulacionesConOferta = data.map(p => ({
              ...p,
              oferta: oferta
            }));
            allPostulaciones.push(...postulacionesConOferta);
          }
        } catch (err) {
          console.warn(`Error al cargar postulaciones de oferta ${oferta.id}:`, err);
        }
      }

      setPostulaciones(allPostulaciones);
    } catch (err) {
      console.error('Error al cargar todas las postulaciones:', err);
      setError(err.message || 'Error al cargar postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (postulacionId, nuevoEstado) => {
    try {
      await cambiarEstadoPostulacion(postulacionId, nuevoEstado);
      await fetchPostulaciones();
      alert(`Estado cambiado a: ${nuevoEstado}`);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado de la postulación');
    }
  };

  const obtenerPostulacionesFiltradas = () => {
    let resultado = [...postulaciones];

    // Filtro por estado
    if (filtroEstado !== "todos") {
      resultado = resultado.filter((p) => p.estado === filtroEstado);
    }

    // Orden por fecha
    resultado.sort((a, b) => {
      const fechaA = a.fechaPostulacion || a.fecha;
      const fechaB = b.fechaPostulacion || b.fecha;
      return ordenFecha === "asc"
        ? new Date(fechaA) - new Date(fechaB)
        : new Date(fechaB) - new Date(fechaA);
    });

    return resultado;
  };

  const postulacionesFiltradas = obtenerPostulacionesFiltradas();

  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <div className="vp-page">
          <p>Cargando postulaciones...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderReclutador />
        <div className="vp-page">
          <p className="error-text">Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      <main className="vp-page">
        <h1 className="vp-title">Postulaciones Recibidas</h1>

        {/* ======== CONTROLES DE FILTRO ======== */}
        <div className="vp-filters">
          <div className="vp-filter-group">
            <label>Estado:</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="ACEPTADA">Aceptada</option>
              <option value="RECHAZADA">Rechazada</option>
            </select>
          </div>

          <div className="vp-filter-group">
            <label>Orden por fecha:</label>
            <select
              value={ordenFecha}
              onChange={(e) => setOrdenFecha(e.target.value)}
            >
              <option value="asc">Antiguas → Recientes</option>
              <option value="desc">Recientes → Antiguas</option>
            </select>
          </div>
        </div>

        <p className="vp-count">
          {postulacionesFiltradas.length} resultados encontrados
        </p>

        {/* ======== LISTA DE POSTULACIONES ======== */}
        <div className="vp-container">
          {postulacionesFiltradas.length === 0 ? (
            <p>No hay postulaciones disponibles</p>
          ) : (
            postulacionesFiltradas.map((p) => (
              <div className="vp-item" key={p.id}>
                <div className="vp-header">
                  <div className="vp-avatar">
                    {p.aspirante?.nombre?.charAt(0) || 'A'}
                  </div>

                  <div className="vp-info">
                    <p className="vp-name">
                      {p.aspirante?.nombre || 'Aspirante'} {p.aspirante?.apellido || ''}
                    </p>
                    <p className="vp-status">{p.estado}</p>
                  </div>
                </div>

                {/* Información de la oferta */}
                {p.oferta && (
                  <div className="vp-oferta-info">
                    <p className="vp-oferta-titulo">
                      <strong>Oferta:</strong> {p.oferta.titulo || p.oferta.nom || 'Sin título'}
                    </p>
                    <p className="vp-oferta-desc">
                      {p.oferta.descripcion || p.oferta.desc || 'Sin descripción'}
                    </p>
                  </div>
                )}

                <p className="vp-text">
                  Fecha: {new Date(p.fechaPostulacion || p.fecha).toLocaleDateString()}
                </p>
                <p className="vp-text">
                  Correo: {p.aspirante?.correo || 'No disponible'}
                </p>
                <p className="vp-text">
                  Teléfono: {p.aspirante?.telefono || 'No disponible'}
                </p>

                <div className="vp-actions">
                  {p.estado === 'PENDIENTE' && (
                    <>
                      <button
                        className="btn-aceptar"
                        onClick={() => handleCambiarEstado(p.id, 'ACEPTADA')}
                      >
                        Aceptar
                      </button>
                      <button
                        className="btn-rechazar"
                        onClick={() => handleCambiarEstado(p.id, 'RECHAZADA')}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default VerPostulacionesRecibidas;
