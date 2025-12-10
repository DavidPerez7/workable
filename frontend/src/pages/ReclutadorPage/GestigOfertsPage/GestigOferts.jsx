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
      const reclutadorId = user.usuarioId;

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
        <div className="container-main-GO">
          <div className="loading-state-GO">
            <p className="loading-text-GO">⏳ Cargando ofertas...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderReclutador />
        <div className="container-main-GO">
          <div className="error-state-GO">
            <p className="error-text-GO">❌ Error: {error}</p>
            <button onClick={fetchOfertas} className="btn-retry-GO">
              Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      <div className="container-main-GO">
        <div className="header-section-GO">
          <h1 className="title-page-GO">Gestión de Ofertas</h1>
          <button
            className="link-goback-GO"
            onClick={() => navigate("/Reclutador/Publicacion")}
          >
            + Nueva Oferta
          </button>
        </div>

        <div className="section-card-GO">
          {ofertas.length === 0 ? (
            <div className="empty-state-GO">
              <p className="empty-text-GO">No tienes ofertas publicadas</p>
              <button
                className="btn-create-GO"
                onClick={() => navigate("/Reclutador/Publicacion")}
              >
                Publicar tu primera oferta
              </button>
            </div>
          ) : (
            <div>
              <div className="table-wrapper-GO">
                <table className="tabla-gestion-GO">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Ubicación</th>
                      <th>Salario</th>
                      <th>Fecha Publicación</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ofertas.map((oferta) => (
                      <tr key={oferta.id}>
                        <td className="td-titulo-GO">{oferta.titulo}</td>
                        <td>{oferta.municipio?.nombre || oferta.ubicacion}</td>
                        <td>${new Intl.NumberFormat('es-CO').format(oferta.salario || 0)}</td>
                        <td className="td-fecha-GO">
                          {new Date(oferta.fechaPublicacion).toLocaleDateString('es-CO')}
                        </td>
                        <td>
                          <span className={`badge-estado-GO ${oferta.estadoOferta === 'ABIERTA' ? 'badge-activa-GO' : 'badge-cerrada-GO'}`}>
                            {oferta.estadoOferta || 'ABIERTA'}
                          </span>
                        </td>
                        <td className="td-acciones-GO">
                          <button
                            className="btn-editar-GO"
                            onClick={() => handleVerPostulaciones(oferta.id)}
                            title="Ver postulaciones"
                          >
                            👥
                          </button>
                          <button
                            className="btn-editar-GO"
                            onClick={() => handleEditar(oferta.id)}
                            title="Editar oferta"
                          >
                            ✏️
                          </button>
                          
                          {oferta.estadoOferta === 'ABIERTA' ? (
                            <button
                              className="btn-estado-GO"
                              onClick={() => handleCambiarEstado(oferta.id, 'CERRADA')}
                              title="Cerrar oferta"
                            >
                              Cerrar
                            </button>
                          ) : (
                            <button
                              className="btn-estado-GO"
                              onClick={() => handleCambiarEstado(oferta.id, 'ABIERTA')}
                              title="Abrir oferta"
                            >
                              Abrir
                            </button>
                          )}
                          
                          <button
                            className="btn-eliminar-GO"
                            onClick={() => handleEliminar(oferta.id)}
                            title="Eliminar oferta"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GestigOfertsPage;
