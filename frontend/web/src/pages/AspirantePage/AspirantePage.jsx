import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Briefcase,
  BookOpenText,
  Building2,
  FileText,
  MapPin,
  Search,
  Send,
  UserRoundPen,
  UserRoundX,
  SlidersHorizontal,
} from "lucide-react";
import "./AspirantePage.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";
import AspiranteCard from "../../components/aspirante/AspiranteCard";
import AspiranteSectionHeader from "../../components/aspirante/AspiranteSectionHeader";
import AspiranteFormField from "../../components/aspirante/AspiranteFormField";
import AspiranteButton from "../../components/aspirante/AspiranteButton";
import AspiranteAlert from "../../components/aspirante/AspiranteAlert";
import { buscarOfertasAvanzada } from "../../api/ofertasAPI";
import { getMunicipios } from "../../api/municipioAPI";
import { crearPostulacion } from "../../api/postulacionesAPI";

const filtrosIniciales = {
  texto: "",
  municipioId: "",
  modalidad: "",
  experiencia: "",
  salarioMin: "",
  salarioMax: "",
};

const experienciaOptions = [
  { value: "", label: "Todas" },
  { value: "SIN_EXPERIENCIA", label: "Sin experiencia" },
  { value: "BASICO", label: "Básico" },
  { value: "INTERMEDIO", label: "Intermedio" },
  { value: "AVANZADO", label: "Avanzado" },
  { value: "EXPERTO", label: "Experto" },
];

const modalidadOptions = [
  { value: "", label: "Todas" },
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "REMOTO", label: "Remoto" },
  { value: "HIBRIDO", label: "Híbrido" },
];

const formatearSalario = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor || 0));

const normalizarTexto = (texto) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const AspirantePage = () => {
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const textoUrl = searchParams.get("query") || searchParams.get("cargo") || "";
  const ciudadUrl = searchParams.get("ciudad") || "";

  const [ofertas, setOfertas] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [selectedOferta, setSelectedOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [postulandoId, setPostulandoId] = useState(null);
  const [filters, setFilters] = useState({
    ...filtrosIniciales,
    texto: textoUrl,
  });

  const municipioIdPorNombre = (nombre, lista) => {
    const target = normalizarTexto(nombre);
    const match = (lista || []).find((municipio) =>
      normalizarTexto(municipio.nombre || "").includes(target)
    );
    return match?.id || "";
  };

  const construirPayload = (nextFilters, municipioIdOverride = "") => {
    const payload = { estado: "ACTIVA" };
    const texto = (nextFilters.texto || "").trim();
    const municipioId = municipioIdOverride || nextFilters.municipioId;

    if (texto) {
      payload.nombre = texto;
    }

    if (municipioId) {
      payload.municipioId = Number(municipioId);
    }

    if (nextFilters.modalidad) {
      payload.modalidad = nextFilters.modalidad;
    }

    if (nextFilters.experiencia) {
      payload.experiencia = nextFilters.experiencia;
    }

    if (nextFilters.salarioMin) {
      payload.salarioMin = Number(nextFilters.salarioMin);
    }

    if (nextFilters.salarioMax) {
      payload.salarioMax = Number(nextFilters.salarioMax);
    }

    return payload;
  };

  const cargarOfertas = async (nextFilters = filters, municipiosCargados = municipios) => {
    const municipioId =
      nextFilters.municipioId || municipioIdPorNombre(ciudadUrl, municipiosCargados);
    const payload = construirPayload(nextFilters, municipioId);

    try {
      setError("");
      setSearching(true);
      const data = await buscarOfertasAvanzada(payload);
      const ofertasData = Array.isArray(data) ? data : [];
      setOfertas(ofertasData);
      setSelectedOferta((current) => {
        if (current && ofertasData.some((oferta) => oferta.id === current.id)) {
          return ofertasData.find((oferta) => oferta.id === current.id) || ofertasData[0] || null;
        }
        return ofertasData[0] || null;
      });
      setNotice(
        ofertasData.length
          ? `Se encontraron ${ofertasData.length} ofertas.`
          : "No hay ofertas para esos filtros."
      );
    } catch (err) {
      console.error("Error al buscar ofertas:", err);
      setError(err.message || "No se pudieron cargar las ofertas");
      setOfertas([]);
      setSelectedOferta(null);
    } finally {
      setSearching(false);
    }
  };

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      const [municipiosData] = await Promise.all([getMunicipios()]);
      const listaMunicipios = Array.isArray(municipiosData) ? municipiosData : [];
      setMunicipios(listaMunicipios);
      await cargarOfertas(
        {
          ...filtrosIniciales,
          texto: textoUrl,
        },
        listaMunicipios
      );
    } catch (err) {
      console.error("Error al cargar datos iniciales:", err);
      setError(err.message || "No se pudo inicializar la página");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      texto: textoUrl,
    }));
    cargarDatosIniciales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await cargarOfertas(filters);
  };

  const limpiarFiltros = async () => {
    const base = { ...filtrosIniciales };
    setFilters(base);
    await cargarOfertas(base);
  };

  const handlePostularse = async (ofertaId) => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
      setNotice("Debes iniciar sesión para postularte.");
      return;
    }

    try {
      setPostulandoId(ofertaId);
      setNotice("");
      await crearPostulacion({
        aspirante: { id: Number(usuarioId) },
        oferta: { id: ofertaId },
      });
      setNotice("Postulación enviada correctamente.");
    } catch (err) {
      console.error("Error al postularse:", err);
      setNotice(err.message || "No se pudo enviar la postulación.");
    } finally {
      setPostulandoId(null);
    }
  };

  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />

      <div className="aspirante-shell-AP">
        <main className="aspirante-main-AP">
          <section className="aspirante-hero-AP">
            <div>
              <h1>Encuentra ofertas y postúlate</h1>
            </div>

            <div className="aspirante-hero-stats-AP">
              <strong>{ofertas.length}</strong>
              <span>ofertas visibles</span>
            </div>
          </section>

          <section className="aspirante-actions-AP">
            <AspiranteCard as={Link} to="/Aspirante/MiPerfil" className="aspirante-action-card-AP">
              <FileText size={22} />
              <strong>Mi perfil</strong>
              <span>Ver tus datos y accesos principales.</span>
            </AspiranteCard>

            <AspiranteCard as={Link} to="/Aspirante/MiPerfil/ActualizarPerfil" className="aspirante-action-card-AP">
              <UserRoundPen size={22} />
              <strong>Actualizar perfil</strong>
              <span>Editar información personal y contacto.</span>
            </AspiranteCard>

            <AspiranteCard as={Link} to="/Aspirante/MiPerfil/HojaDeVida" className="aspirante-action-card-AP">
              <BookOpenText size={22} />
              <strong>Hoja de vida</strong>
              <span>Revisar estudios, experiencia y resumen.</span>
            </AspiranteCard>

            <AspiranteCard as={Link} to="/Aspirante/MiPerfil/MisPostulaciones" className="aspirante-action-card-AP">
              <Briefcase size={22} />
              <strong>Mis postulaciones</strong>
              <span>Seguir el estado de tus aplicaciones.</span>
            </AspiranteCard>

            <AspiranteCard as={Link} to="/Aspirante/MiPerfil/EliminarPerfil" className="aspirante-action-card-AP danger">
              <UserRoundX size={22} />
              <strong>Eliminar cuenta</strong>
              <span>Acción permanente para borrar tu perfil.</span>
            </AspiranteCard>
          </section>

          <section className="aspirante-content-AP">
            <AspiranteCard as="aside" className="aspirante-filters-AP">
              <AspiranteSectionHeader
                kicker="Filtros"
                title="Filtrar ofertas"
                action={
                  <AspiranteButton type="button" variant="secondary" onClick={limpiarFiltros}>
                    Limpiar
                  </AspiranteButton>
                }
              />

              <form className="filters-form-AP" onSubmit={handleSubmit}>
                <AspiranteFormField label="Cargo o nombre">
                  <div className="asp-input-icon">
                    <Search size={16} />
                    <input
                      type="text"
                      value={filters.texto}
                      onChange={(event) =>
                        setFilters((current) => ({ ...current, texto: event.target.value }))
                      }
                      placeholder="Ej. desarrollador, auxiliar, analista"
                    />
                  </div>
                </AspiranteFormField>

                <AspiranteFormField label="Municipio">
                  <div className="asp-input-icon">
                    <MapPin size={16} />
                    <select
                      value={filters.municipioId}
                      onChange={(event) =>
                        setFilters((current) => ({ ...current, municipioId: event.target.value }))
                      }
                    >
                      <option value="">Todos</option>
                      {municipios.map((municipio) => (
                        <option key={municipio.id} value={municipio.id}>
                          {municipio.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </AspiranteFormField>

                <AspiranteFormField label="Modalidad">
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
                </AspiranteFormField>

                <AspiranteFormField label="Experiencia">
                  <select
                    value={filters.experiencia}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, experiencia: event.target.value }))
                    }
                  >
                    {experienciaOptions.map((option) => (
                      <option key={option.value || "todas"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </AspiranteFormField>

                <AspiranteFormField label="Salario mínimo">
                  <input
                    type="number"
                    min="0"
                    value={filters.salarioMin}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, salarioMin: event.target.value }))
                    }
                    placeholder="Ej. 1500000"
                  />
                </AspiranteFormField>

                <AspiranteFormField label="Salario máximo">
                  <input
                    type="number"
                    min="0"
                    value={filters.salarioMax}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, salarioMax: event.target.value }))
                    }
                    placeholder="Ej. 3000000"
                  />
                </AspiranteFormField>

                <AspiranteButton type="submit" disabled={searching}>
                  <SlidersHorizontal size={16} />
                  {searching ? "Buscando..." : "Buscar"}
                </AspiranteButton>
              </form>

              {notice && <AspiranteAlert type="success">{notice}</AspiranteAlert>}
              {error && <AspiranteAlert type="error">{error}</AspiranteAlert>}
            </AspiranteCard>

            <AspiranteCard as="section" className="aspirante-listing-AP">
              <AspiranteSectionHeader
                kicker="Resultados"
                title="Ofertas disponibles"
                action={<span className="asp-badge neutral">{ofertas.length} resultados</span>}
              />

              {loading ? (
                <div className="asp-loading">Cargando ofertas...</div>
              ) : ofertas.length === 0 ? (
                <div className="asp-empty">
                  No hay ofertas para mostrar con los filtros actuales.
                </div>
              ) : (
                <div className="cards-list-AP">
                  {ofertas.map((oferta) => (
                    <article
                      key={oferta.id}
                      className={`offer-card-AP ${selectedOferta?.id === oferta.id ? "active" : ""}`}
                      onClick={() => setSelectedOferta(oferta)}
                    >
                      <div className="offer-card-top-AP">
                        <div>
                          <h3>{oferta.titulo || "Sin título"}</h3>
                          <p className="offer-company-AP">
                            <Building2 size={14} />
                            {oferta.empresa?.nombre || "Empresa"}
                          </p>
                        </div>
                        <span className="offer-chip-AP">
                          {oferta.modalidad || "Modalidad"}
                        </span>
                      </div>

                      <div className="offer-meta-AP">
                        <span>
                          <MapPin size={14} />
                          {oferta.municipio?.nombre || "Sin ubicación"}
                        </span>
                        <span>
                          <Briefcase size={14} />
                          {oferta.nivelExperiencia || "Sin experiencia"}
                        </span>
                      </div>

                      <div className="offer-footer-AP">
                        <strong>
                          {oferta.salario ? formatearSalario(oferta.salario) : "Salario no publicado"}
                        </strong>
                        <small>
                          {oferta.fechaPublicacion
                            ? new Date(oferta.fechaPublicacion).toLocaleDateString("es-CO")
                            : "Reciente"}
                        </small>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </AspiranteCard>

            <section className="asp-card aspirante-detail-AP">
              <AspiranteSectionHeader kicker="Detalle" title="Oferta seleccionada" />

              {selectedOferta ? (
                <article className="detail-card-AP">
                  <div className="detail-title-row-AP">
                    <div>
                      <h3>{selectedOferta.titulo || "Sin título"}</h3>
                      <p>
                        {selectedOferta.empresa?.nombre || "Empresa"} · {selectedOferta.municipio?.nombre || "Sin ubicación"}
                      </p>
                    </div>
                    <span className="detail-badge-AP">
                      {selectedOferta.tipoContrato || "Contrato"}
                    </span>
                  </div>

                  <div className="detail-grid-AP">
                    <div>
                      <strong>Modalidad</strong>
                      <span>{selectedOferta.modalidad || "No definida"}</span>
                    </div>
                    <div>
                      <strong>Experiencia</strong>
                      <span>{selectedOferta.nivelExperiencia || "No definida"}</span>
                    </div>
                    <div>
                      <strong>Salario</strong>
                      <span>
                        {selectedOferta.salario ? formatearSalario(selectedOferta.salario) : "No especificado"}
                      </span>
                    </div>
                    <div>
                      <strong>Fecha límite</strong>
                      <span>
                        {selectedOferta.fechaLimite
                          ? new Date(selectedOferta.fechaLimite).toLocaleDateString("es-CO")
                          : "Sin fecha"}
                      </span>
                    </div>
                  </div>

                  <div className="detail-section-AP">
                    <h4>Descripción</h4>
                    <p>{selectedOferta.descripcion || "Sin descripción disponible"}</p>
                  </div>

                  {selectedOferta.requisitos && (
                    <div className="detail-section-AP">
                      <h4>Requisitos</h4>
                      <p>{selectedOferta.requisitos}</p>
                    </div>
                  )}

                  <AspiranteButton
                    type="button"
                    className="asp-full-width"
                    onClick={() => handlePostularse(selectedOferta.id)}
                    disabled={postulandoId === selectedOferta.id}
                  >
                    <Send size={16} />
                    {postulandoId === selectedOferta.id ? "Postulando..." : "Postularme"}
                  </AspiranteButton>

                  <p className="detail-note-AP">
                    La postulación usa el endpoint real del módulo aspirante.
                  </p>
                </article>
              ) : (
                <div className="asp-empty">
                  Selecciona una oferta para ver su detalle.
                </div>
              )}
            </section>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default AspirantePage;
