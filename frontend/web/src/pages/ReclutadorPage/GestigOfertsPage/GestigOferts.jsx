import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, Users, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import reclutadoresApi from "../../../api/reclutadoresApi";
import { getOfertasByEmpresaId, eliminarOferta, cambiarEstadoOferta } from "../../../api/ofertasAPI";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorEmptyState from "../../../components/reclutador/ReclutadorEmptyState";
import ReclutadorAlert from "../../../components/reclutador/ReclutadorAlert";
import OfertaEditarModal from "../../../components/shared/OfertaEditarModal/OfertaEditarModal";
import "./GestigOferts.css";

const filtrosIniciales = {
  texto: "",
  estado: "",
  municipioId: "",
  modalidad: "",
  salarioMin: "",
  salarioMax: "",
};

const estadoOptions = [
  { value: "", label: "Todos" },
  { value: "ABIERTA", label: "Abierta" },
  { value: "CERRADA", label: "Cerrada" },
];

const modalidadOptions = [
  { value: "", label: "Todas" },
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "REMOTO", label: "Remoto" },
  { value: "HIBRIDO", label: "Híbrido" },
];

const GestigOfertsPage = () => {
  const navigate = useNavigate();

  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState("Aún no has publicado tu primera oferta.");
  const [filters, setFilters] = useState(filtrosIniciales);
  const [editingOfertaId, setEditingOfertaId] = useState(null);
  const [editingOferta, setEditingOferta] = useState(null);

  // Filtrar ofertas basado en los filtros aplicados
  const ofertasFiltradas = useMemo(() => {
    return ofertas.filter((oferta) => {
      const tituloMatch = !filters.texto || 
        oferta.titulo?.toLowerCase().includes(filters.texto.toLowerCase()) ||
        oferta.descripcion?.toLowerCase().includes(filters.texto.toLowerCase());

      const estadoMatch = !filters.estado || 
        (oferta.estadoOferta || oferta.estado || "ABIERTA") === filters.estado;

      const municipioMatch = !filters.municipioId || 
        oferta.municipio?.id === Number(filters.municipioId);

      const modalidadMatch = !filters.modalidad || 
        oferta.modalidad === filters.modalidad;

      const salarioMinMatch = !filters.salarioMin || 
        (oferta.salario || 0) >= Number(filters.salarioMin);

      const salarioMaxMatch = !filters.salarioMax || 
        (oferta.salario || 0) <= Number(filters.salarioMax);

      return tituloMatch && estadoMatch && municipioMatch && modalidadMatch && 
             salarioMinMatch && salarioMaxMatch;
    });
  }, [ofertas, filters]);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    setLoading(true);
    setError(null);
    setEmptyMessage("Aún no has publicado tu primera oferta.");
    
    try {
      const reclutador = await reclutadoresApi.getMyProfile();
      const empresaId = reclutador?.empresa?.id;

      if (!empresaId) {
        setOfertas([]);
        setEmptyMessage("Aún no tienes una empresa asociada. Cuando la registres podrás crear tu primera oferta.");
        return;
      }

      const ofertasEmpresa = await getOfertasByEmpresaId(empresaId);
      const listaOfertas = Array.isArray(ofertasEmpresa) ? ofertasEmpresa : [];
      setOfertas(listaOfertas);
      setEmptyMessage(
        listaOfertas.length === 0
          ? "Aún no has publicado tu primera oferta. Crea tu primera oferta para empezar a recibir postulaciones."
          : ""
      );
    } catch (err) {
      console.error('Error al cargar ofertas:', err);
      setOfertas([]);
      setError(null);
      setEmptyMessage("Aún no has publicado tu primera oferta. Crea tu primera oferta para empezar a recibir postulaciones.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (oferta) => {
    setEditingOfertaId(oferta.id);
    setEditingOferta(oferta);
  };

  const closeEditModal = () => {
    setEditingOfertaId(null);
    setEditingOferta(null);
  };

  const handleOfertaActualizada = async () => {
    closeEditModal();
    await fetchOfertas();
  };

  const handleVerPostulaciones = (id) => {
    navigate(`/Reclutador/oferta/${id}/postulaciones`);
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

      // Actualizar el estado local
      setOfertas((current) =>
        current.map((oferta) =>
          oferta.id === id
            ? { ...oferta, estado: nuevoEstado === "ABIERTA" ? "ACTIVA" : "INACTIVA", estadoOferta: nuevoEstado }
            : oferta
        )
      );

      alert(`Oferta ${nuevoEstado === "ABIERTA" ? "abierta" : "cerrada"} exitosamente`);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado de la oferta: ' + err.message);
    }
  };

  const limpiarFiltros = () => {
    setFilters(filtrosIniciales);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    // Los filtros se aplican automáticamente con useMemo
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
      {/* Hero compacto con título y botón */}
      <div className="gestion-hero-GO">
        <div className="hero-content-GO">
          <div className="hero-text-GO">
            <span className="hero-kicker-GO">Ofertas</span>
            <h1 className="hero-title-GO">Gestión de ofertas</h1>
            <p className="hero-description-GO">
              Administra todas tus ofertas laborales desde un solo lugar
            </p>
          </div>
          <div className="hero-action-GO">
            <ReclutadorButton
              type="button"
              onClick={() => navigate("/Reclutador/Publicacion")}
              className="nueva-oferta-btn-GO"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Crear nueva oferta
            </ReclutadorButton>
          </div>
        </div>
      </div>

      {/* Layout lado a lado: filtros | ofertas */}
      <div className="gestion-content-GO">
        {/* Panel de filtros */}
        <ReclutadorCard className="filters-panel-GO">
          <ReclutadorSectionHeader
            title="FILTROS"
            action={
              <ReclutadorButton type="button" variant="secondary" onClick={limpiarFiltros}>
                Limpiar
              </ReclutadorButton>
            }
          />

          <p className="aspirante-help-AP">
            Ajusta los filtros para reducir resultados y gestionar mejor tus ofertas.
          </p>

          <form onSubmit={handleFilterSubmit} className="filters-form-GO">
            <div className="filters-grid-GO">
              <div className="filter-field-GO">
                <label className="filter-label-GO">Buscar</label>
                <div className="filter-input-icon-GO">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Título o descripción..."
                    value={filters.texto}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, texto: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="filter-field-GO">
                <label className="filter-label-GO">Estado</label>
                <select
                  value={filters.estado}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, estado: event.target.value }))
                  }
                >
                  {estadoOptions.map((option) => (
                    <option key={option.value || "todos"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-field-GO">
                <label className="filter-label-GO">Modalidad</label>
                <select
                  value={filters.modalidad}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, modalidad: event.target.value }))
                  }
                >
                  {modalidadOptions.map((option) => (
                    <option key={option.value || "todas"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-field-GO">
                <label className="filter-label-GO">Salario mínimo</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ej. 1500000"
                  value={filters.salarioMin}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, salarioMin: event.target.value }))
                  }
                />
              </div>

              <div className="filter-field-GO">
                <label className="filter-label-GO">Salario máximo</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ej. 3000000"
                  value={filters.salarioMax}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, salarioMax: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="filters-actions-GO">
              <ReclutadorButton type="submit">
                <SlidersHorizontal size={16} />
                Buscar
              </ReclutadorButton>
            </div>
          </form>
        </ReclutadorCard>

        {/* Card de ofertas */}
        <ReclutadorCard as="section" className="offers-listing-GO">
          <ReclutadorSectionHeader
            title="OFERTAS DISPONIBLES"
          />

          <p className="aspirante-help-AP">
            Gestiona tus ofertas laborales: edita, cambia estado o elimina según necesites.
          </p>
          {ofertasFiltradas.length === 0 && ofertas.length > 0 ? (
            <ReclutadorEmptyState action={(
              <ReclutadorButton type="button" onClick={limpiarFiltros}>
                Limpiar filtros
              </ReclutadorButton>
            )}>
              No se encontraron ofertas con los filtros aplicados.
            </ReclutadorEmptyState>
          ) : ofertas.length === 0 ? (
            <ReclutadorEmptyState action={(
              <ReclutadorButton type="button" onClick={() => navigate("/Reclutador/Publicacion")}>
                Publicar oferta
              </ReclutadorButton>
            )}>
              {emptyMessage}
            </ReclutadorEmptyState>
          ) : (
            <div className="table-wrapper-GO">
              <div className="table-header-GO">
                <span>{ofertasFiltradas.length} de {ofertas.length} ofertas</span>
              </div>
              <table className="tabla-gestion-GO">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Ubicación</th>
                    <th>Modalidad</th>
                    <th>Salario</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ofertasFiltradas.map((oferta) => {
                    const estadoRaw = oferta.estadoOferta || oferta.estado || "ABIERTA";
                    const estado = estadoRaw === "ACTIVA" ? "ABIERTA" : estadoRaw;
                    return (
                      <tr key={oferta.id}>
                        <td className="td-titulo-GO">{oferta.titulo}</td>
                        <td>
                          <div className="td-location-GO">
                            <MapPin size={14} />
                            {oferta.municipio?.nombre || oferta.ubicacion}
                          </div>
                        </td>
                        <td>{oferta.modalidad || "No especificada"}</td>
                        <td className="td-salary-GO">
                          ${new Intl.NumberFormat("es-CO").format(oferta.salario || 0)}
                        </td>
                        <td>
                          <span className={`badge-estado-GO ${estado === "ABIERTA" ? "badge-activa-GO" : "badge-cerrada-GO"}`}>
                            {estado}
                          </span>
                        </td>
                        <td className="td-acciones-GO">
                          <ReclutadorButton
                            variant="action"
                            size="small"
                            onClick={() => handleVerPostulaciones(oferta.id)}
                          >
                            <Users size={14} />
                            Ver postulaciones
                          </ReclutadorButton>
                          <ReclutadorButton
                            variant="secondary"
                            size="small"
                            onClick={() => handleEditar(oferta)}
                          >
                            <Edit size={14} />
                            Editar
                          </ReclutadorButton>
                          <ReclutadorButton
                            variant={estado === "ABIERTA" ? "secondary" : "action"}
                            size="small"
                            onClick={() => handleCambiarEstado(oferta.id, estado === "ABIERTA" ? "CERRADA" : "ABIERTA")}
                          >
                            {estado === "ABIERTA" ? <EyeOff size={14} /> : <Eye size={14} />}
                            {estado === "ABIERTA" ? "Cerrar" : "Abrir"}
                          </ReclutadorButton>
                          <ReclutadorButton
                            variant="danger"
                            size="small"
                            onClick={() => handleEliminar(oferta.id)}
                          >
                            <Trash2 size={14} />
                            Eliminar
                          </ReclutadorButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </ReclutadorCard>
      </div>
      <OfertaEditarModal
        isOpen={Boolean(editingOfertaId)}
        ofertaId={editingOfertaId}
        ofertaInicial={editingOferta}
        onClose={closeEditModal}
        onSaved={handleOfertaActualizada}
      />
    </ReclutadorLayout>
  );
};

export default GestigOfertsPage;
