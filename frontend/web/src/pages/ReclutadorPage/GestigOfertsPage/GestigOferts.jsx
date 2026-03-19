import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import { getOfertasPorEmpresa, eliminarOferta, cambiarEstadoOferta } from "../../../api/ofertasAPI";
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
      const empresaId = user.empresa?.id;

      if (!empresaId) {
        throw new Error('No se encontró ID de empresa');
      }

      const data = await getOfertasPorEmpresa(empresaId);
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
        <main className="reclutador-main-RP">
          <div className="reclutador-card-RP">Cargando ofertas...</div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderReclutador />
        <main className="reclutador-main-RP">
          <div className="reclutador-card-RP">
            <p className="reclutador-alert-RP error">{error}</p>
            <button onClick={fetchOfertas} className="reclutador-button-RP">
              Reintentar
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />
        <main className="reclutador-main-RP">
          <section className="reclutador-card-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Ofertas</p>
                <h2>Gestion de ofertas</h2>
              </div>
              <button
                className="reclutador-button-RP"
                onClick={() => navigate("/Reclutador/Publicacion")}
              >
                Nueva oferta
              </button>
            </div>

            {ofertas.length === 0 ? (
              <div className="reclutador-empty-RP">
                No tienes ofertas publicadas.
                <button
                  className="reclutador-button-RP"
                  onClick={() => navigate("/Reclutador/Publicacion")}
                >
                  Publicar oferta
                </button>
              </div>
            ) : (
              <div className="table-wrapper-GO">
                <table className="tabla-gestion-GO">
                  <thead>
                    <tr>
                      <th>Titulo</th>
                      <th>Ubicacion</th>
                      <th>Salario</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ofertas.map((oferta) => {
                      const estadoRaw = oferta.estadoOferta || oferta.estado || "ABIERTA";
                      const estado = estadoRaw === "ACTIVA" ? "ABIERTA" : estadoRaw;
                      return (
                        <tr key={oferta.id}>
                          <td className="td-titulo-GO">{oferta.titulo}</td>
                          <td>{oferta.municipio?.nombre || oferta.ubicacion}</td>
                          <td>${new Intl.NumberFormat("es-CO").format(oferta.salario || 0)}</td>
                          <td>
                            <span className={`badge-estado-GO ${estado === "ABIERTA" ? "badge-activa-GO" : "badge-cerrada-GO"}`}>
                              {estado}
                            </span>
                          </td>
                          <td className="td-acciones-GO">
                            <button
                              className="btn-editar-GO"
                              onClick={() => handleVerPostulaciones(oferta.id)}
                              title="Ver postulaciones"
                            >
                              Postulaciones
                            </button>
                            <button
                              className="btn-editar-GO"
                              onClick={() => handleEditar(oferta.id)}
                              title="Editar oferta"
                            >
                              Editar
                            </button>
                            <button
                              className="btn-estado-GO"
                              onClick={() =>
                                handleCambiarEstado(oferta.id, estado === "ABIERTA" ? "CERRADA" : "ABIERTA")
                              }
                              title="Cambiar estado"
                            >
                              {estado === "ABIERTA" ? "Cerrar" : "Abrir"}
                            </button>
                            <button
                              className="btn-eliminar-GO"
                              onClick={() => handleEliminar(oferta.id)}
                              title="Eliminar oferta"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default GestigOfertsPage;
