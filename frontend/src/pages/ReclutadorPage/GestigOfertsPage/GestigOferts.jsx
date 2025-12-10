import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import { getOfertasPorReclutador, eliminarOferta, cambiarEstadoOferta } from "../../../api/ofertasAPI";
import "./GestigOferts.css";

const GestigOfertsPage = () => {
  const navigate = useNavigate();

  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('No hay sesión activa');
      }

      const user = JSON.parse(userStr);
      const reclutadorId = user.id;

      if (!reclutadorId) {
        throw new Error('No se encontró ID de reclutador');
      }

      const data = await getOfertasPorReclutador(reclutadorId);
      setOfertas(data);
    } catch (err) {
      console.error('Error al cargar ofertas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id) => {
    navigate('/Reclutador/EditarOfertaLaboral', { state: { ofertaId: id } });
  };

  const handleVerPostulaciones = (id) => {
    navigate('/Reclutador/VerPostulacionesRecibidas', { state: { ofertaId: id } });
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar esta oferta?"
    );

    if (!confirmacion) return;

    try {
      await eliminarOferta(id);
      setOfertas(ofertas.filter((oferta) => oferta.id !== id));
      alert('Oferta eliminada exitosamente');
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar la oferta: ' + err.message);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoOferta(id, nuevoEstado);
      
      // Actualizar estado local
      setOfertas(ofertas.map(oferta => 
        oferta.id === id 
          ? { ...oferta, estadoOferta: nuevoEstado }
          : oferta
      ));
      
      alert(`Estado cambiado a ${nuevoEstado}`);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado: ' + err.message);
    }
  };

  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <div className="gestion-container">
          <p className="loading-text">Cargando ofertas...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderReclutador />
        <div className="gestion-container">
          <p className="error-text">Error: {error}</p>
          <button onClick={fetchOfertas} className="btn-reintentar">
            Reintentar
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      <div className="gestion-container">
        <div className="gestion-header">
          <h1 className="gestion-title">Gestión de Ofertas</h1>
          <button
            className="btn-nueva-oferta"
            onClick={() => navigate("/Reclutador/Publicacion")}
          >
            + Nueva Oferta
          </button>
        </div>

        {ofertas.length === 0 ? (
          <div className="empty-state">
            <p>No tienes ofertas publicadas</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/Reclutador/Publicacion")}
            >
              Publicar tu primera oferta
            </button>
          </div>
        ) : (
          <div className="ofertas-grid">
            {ofertas.map((oferta) => (
              <div key={oferta.id} className="oferta-card">
                <div className="oferta-header">
                  <h3 className="oferta-title">{oferta.titulo}</h3>
                  <span className={`estado-badge estado-${oferta.estadoOferta?.toLowerCase()}`}>
                    {oferta.estadoOferta || 'ABIERTA'}
                  </span>
                </div>

                <div className="oferta-info">
                  <p className="oferta-descripcion">{oferta.descripcion}</p>
                  <p className="oferta-fecha">
                    Publicada: {new Date(oferta.fechaPublicacion).toLocaleDateString()}
                  </p>
                  <p className="oferta-ubicacion">
                    📍 {oferta.municipio?.nombre || oferta.ubicacion}
                  </p>
                  <p className="oferta-salario">
                    💰 ${new Intl.NumberFormat('es-CO').format(oferta.salario || 0)}
                  </p>
                </div>

                <div className="oferta-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleVerPostulaciones(oferta.id)}
                  >
                    Ver Postulaciones
                  </button>
                  <button
                    className="btn-editar"
                    onClick={() => handleEditar(oferta.id)}
                  >
                    Editar
                  </button>
                  
                  {oferta.estadoOferta === 'ABIERTA' ? (
                    <button
                      className="btn-cerrar"
                      onClick={() => handleCambiarEstado(oferta.id, 'CERRADA')}
                    >
                      Cerrar
                    </button>
                  ) : (
                    <button
                      className="btn-abrir"
                      onClick={() => handleCambiarEstado(oferta.id, 'ABIERTA')}
                    >
                      Abrir
                    </button>
                  )}
                  
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminar(oferta.id)}
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

export default GestigOfertsPage;
