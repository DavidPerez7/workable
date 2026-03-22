import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import reclutadoresApi from "../../../api/reclutadoresApi";
import { getEmpresaById } from "../../../api/empresaAPI";
import { getOfertasByEmpresaId, eliminarOferta, cambiarEstadoOferta } from "../../../api/ofertasAPI";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorEmptyState from "../../../components/reclutador/ReclutadorEmptyState";
import ReclutadorAlert from "../../../components/reclutador/ReclutadorAlert";
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
      const reclutador = await reclutadoresApi.getMyProfile();
      const empresaId = reclutador?.empresa?.id;

      if (!empresaId) {
        throw new Error('No se encontró ID de empresa. Registra una empresa primero.');
      }

      const ofertasEmpresa = await getOfertasByEmpresaId(empresaId);
      setOfertas(ofertasEmpresa);
    } catch (err) {
      console.error('Error al cargar ofertas:', err);
      setOfertas([]);
      setError('No se pudieron cargar las ofertas de la empresa.');
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
      setOfertas((current) => current.filter((oferta) => oferta.id !== id));
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
      setOfertas((current) => current.map(oferta => 
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
      <ReclutadorLayout>
        <ReclutadorCard>Cargando ofertas...</ReclutadorCard>
      </ReclutadorLayout>
    );
  }

  if (error) {
    return (
      <ReclutadorLayout>
        <ReclutadorCard>
          <ReclutadorAlert>{error}</ReclutadorAlert>
          <ReclutadorButton type="button" onClick={fetchOfertas}>
            Reintentar
          </ReclutadorButton>
        </ReclutadorCard>
      </ReclutadorLayout>
    );
  }

  return (
    <ReclutadorLayout>
      <ReclutadorCard as="section">
        <ReclutadorSectionHeader
          kicker="Ofertas"
          title="Gestion de ofertas"
          action={(
            <ReclutadorButton type="button" onClick={() => navigate("/Reclutador/Publicacion")}>
              Nueva oferta
            </ReclutadorButton>
          )}
        />

        {ofertas.length === 0 ? (
          <ReclutadorEmptyState action={(
            <ReclutadorButton type="button" onClick={() => navigate("/Reclutador/Publicacion")}>
              Publicar oferta
            </ReclutadorButton>
          )}>
            No tienes ofertas publicadas.
          </ReclutadorEmptyState>
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
                      <td><span className={`badge-estado-GO ${estado === "ABIERTA" ? "badge-activa-GO" : "badge-cerrada-GO"}`}>{estado}</span></td>
                      <td className="td-acciones-GO">
                        <button className="btn-editar-GO" onClick={() => handleVerPostulaciones(oferta.id)} title="Ver postulaciones">Postulaciones</button>
                        <button className="btn-editar-GO" onClick={() => handleEditar(oferta.id)} title="Editar oferta">Editar</button>
                        <button className="btn-estado-GO" onClick={() => handleCambiarEstado(oferta.id, estado === "ABIERTA" ? "CERRADA" : "ABIERTA")} title="Cambiar estado">{estado === "ABIERTA" ? "Cerrar" : "Abrir"}</button>
                        <button className="btn-eliminar-GO" onClick={() => handleEliminar(oferta.id)} title="Eliminar oferta">Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </ReclutadorCard>
    </ReclutadorLayout>
  );
};

export default GestigOfertsPage;
