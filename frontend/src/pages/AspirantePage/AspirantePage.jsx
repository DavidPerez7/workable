import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AspirantePage.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";
import { getAllOfertas } from "../../api/ofertasAPI";
import { crearPostulacion } from "../../api/postulacionesAPI";

const AspirantePage = () => {
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ofertas, setOfertas] = useState([]);
  const [error, setError] = useState("");
  const [postulando, setPostulando] = useState(false);

  // ============================
  // RF14 — ESTADOS DE VALORACIÓN
  // ============================
  const [offerRating, setOfferRating] = useState(0);
  const [companyRating, setCompanyRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const [filters, setFilters] = useState({
    ordenar: "",
    experiencia: "",
    salario: "",
    jornada: "",
    contrato: "",
    modalidad: "",
    fecha: "",
    ciudad: "",
  });

  // ============================================
  // CARGAR OFERTAS DESDE API
  // ============================================
  useEffect(() => {
    cargarOfertas();
  }, []);

  const cargarOfertas = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllOfertas();
      setOfertas(data || []);
      if (data && data.length > 0) {
        setSelectedJob(data[0]);
      }
    } catch (err) {
      console.error("Error al cargar ofertas:", err);
      setError(err.message || "Error al cargar ofertas");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LECTURA DE PARÁMETROS DE LA URL
  // ============================================
  const params = new URLSearchParams(location.search);

  const filterCargo = params.get("cargo")?.toLowerCase() || "";
  const filterCiudad = params.get("ciudad")?.toLowerCase() || "";
  const generalQuery = params.get("query")?.toLowerCase() || "";

  // ============================================
  // FILTRADO COMPLETO
  // ============================================
  let filteredJobListings = ofertas.filter((job) => {
    // Filtro por URL (búsqueda general)
    const matchCargo = filterCargo
      ? (job.titulo || "").toLowerCase().includes(filterCargo)
      : true;

    const matchCiudad = filterCiudad
      ? (job.ubicacion || "").toLowerCase().includes(filterCiudad)
      : true;

    const matchesGeneral =
      (job.titulo || "").toLowerCase().includes(generalQuery) ||
      (job.descripcion || "").toLowerCase().includes(generalQuery) ||
      (job.ubicacion || "").toLowerCase().includes(generalQuery) ||
      (job.empresa?.nombre || "").toLowerCase().includes(generalQuery);

    // Filtro por experiencia (requerida)
    const matchExperiencia = filters.experiencia
      ? (job.nivelExperiencia || "").toLowerCase().includes(filters.experiencia.toLowerCase())
      : true;

    // Filtro por salario (rango mínimo)
    const matchSalario = filters.salario
      ? Number(job.salario || 0) >= Number(filters.salario)
      : true;

    // Filtro por jornada
    const matchJornada = filters.jornada
      ? (job.jornada || "").toLowerCase() === filters.jornada.toLowerCase()
      : true;

    // Filtro por tipo de contrato
    const matchContrato = filters.contrato
      ? (job.tipoContrato || "").toLowerCase() === filters.contrato.toLowerCase()
      : true;

    // Filtro por modalidad
    const matchModalidad = filters.modalidad
      ? (job.modalidad || "").toLowerCase() === filters.modalidad.toLowerCase()
      : true;

    // Filtro por ciudad
    const matchCityFilter = filters.ciudad
      ? (job.municipio?.nombre || "").toLowerCase().includes(filters.ciudad.toLowerCase())
      : true;

    // Filtro por fecha de creación (últimos X días)
    const matchFecha = filters.fecha ? (() => {
      const jobDate = new Date(job.fechaPublicacion);
      const today = new Date();
      const daysAgo = parseInt(filters.fecha);
      const dateLimit = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      return jobDate >= dateLimit;
    })() : true;

    return (
      matchCargo &&
      matchCiudad &&
      matchesGeneral &&
      matchExperiencia &&
      matchSalario &&
      matchJornada &&
      matchContrato &&
      matchModalidad &&
      matchCityFilter &&
      matchFecha
    );
  });

  // ============================================
  // ORDENAR RESULTADOS
  // ============================================
  if (filters.ordenar === "recientes") {
    filteredJobListings = filteredJobListings.sort((a, b) => {
      return new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion);
    });
  }

  if (filters.ordenar === "salario") {
    filteredJobListings = filteredJobListings.sort(
      (a, b) => Number(b.salario || 0) - Number(a.salario || 0)
    );
  }

  // ============================================
  // FORMATEAR SALARIO
  // ============================================
  const formatSalary = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  // ============================================
  // POSTULARSE
  // ============================================
  const handlePostularse = async (ofertaId) => {
    setPostulando(true);
    try {
      await crearPostulacion(ofertaId);
      alert("¡Postulación exitosa!");
      cargarOfertas();
    } catch (err) {
      console.error("Error al postularse:", err);
      alert("Error al postularse: " + err.message);
    } finally {
      setPostulando(false);
    }
  };

  // ============================================
  // ENVIAR VALORACIÓN
  // ============================================
  const submitRating = async () => {
    if (hasRated) return;

    if (offerRating === 0 || companyRating === 0) {
      alert("Debes calificar la oferta y la empresa.");
      return;
    }

    setHasRated(true);

    setTimeout(() => {
      setRatingSuccess(true);
    }, 800);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />

      <main className="main-aspirant-page-AP">
        {/* SIDEBAR */}
        <aside className="sidebar-filters-AP">
          <div className="filters-header-AP">
            <h2 className="filters-title-AP">Filtros de búsqueda</h2>
            <button
              className="btn-clear-filters-AP"
              onClick={() =>
                setFilters({
                  ordenar: "",
                  experiencia: "",
                  salario: "",
                  jornada: "",
                  contrato: "",
                  modalidad: "",
                  fecha: "",
                  ciudad: "",
                })
              }
            >
              Limpiar
            </button>
          </div>

          {/* Ordenar */}
          <div className="filter-group-AP">
            <label className="filter-label-AP">Ordenar por</label>
            <select
              className="filter-select-AP"
              value={filters.ordenar}
              onChange={(e) =>
                setFilters({ ...filters, ordenar: e.target.value })
              }
            >
              <option value="">Seleccionar</option>
              <option value="recientes">Más recientes</option>
              <option value="salario">Mayor salario</option>
            </select>
          </div>

          {/* Experiencia */}
          <div className="filter-group-AP">
            <label className="filter-label-AP">Experiencia</label>
            <select
              className="filter-select-AP"
              value={filters.experiencia}
              onChange={(e) =>
                setFilters({ ...filters, experiencia: e.target.value })
              }
            >
              <option value="">Seleccionar</option>
              <option value="junior">Junior</option>
              <option value="semi">Semi-Senior</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          {/* Modalidad */}
          <div className="filter-group-AP">
            <label className="filter-label-AP">Modalidad</label>
            <select
              className="filter-select-AP"
              value={filters.modalidad}
              onChange={(e) =>
                setFilters({ ...filters, modalidad: e.target.value })
              }
            >
              <option value="">Seleccionar</option>
              <option value="Presencial">Presencial</option>
              <option value="Remota">Remota</option>
              <option value="Híbrida">Híbrida</option>
            </select>
          </div>

          {/* Tipo de contrato */}
          <div className="filter-group-AP">
            <label className="filter-label-AP">Tipo de contrato</label>
            <select
              className="filter-select-AP"
              value={filters.contrato}
              onChange={(e) =>
                setFilters({ ...filters, contrato: e.target.value })
              }
            >
              <option value="">Seleccionar</option>
              <option value="Término Fijo">Término Fijo</option>
              <option value="Término Indefinido">Término Indefinido</option>
              <option value="Aprendiz">Aprendiz</option>
            </select>
          </div>

          {/* Jornada */}
          <div className="filter-group-AP">
            <label className="filter-label-AP">Jornada</label>
            <select
              className="filter-select-AP"
              value={filters.jornada}
              onChange={(e) =>
                setFilters({ ...filters, jornada: e.target.value })
              }
            >
              <option value="">Seleccionar</option>
              <option value="Completa">Completa</option>
              <option value="Media Tiempo">Media Tiempo</option>
              <option value="Por Horas">Por Horas</option>
            </select>
          </div>

          {/* Salario mínimo */}
          <div className="filter-group-AP">
            <label className="filter-label-AP">Salario mínimo</label>
            <input
              className="filter-input-AP"
              type="number"
              placeholder="Ej: 1000000"
              value={filters.salario}
              onChange={(e) =>
                setFilters({ ...filters, salario: e.target.value })
              }
            />
          </div>

          {/* Ciudad */}
          <div className="filter-group-AP">
            <label className="filter-label-AP">Ciudad</label>
            <input
              className="filter-input-AP"
              type="text"
              placeholder="Ej: Bogotá, Medellín"
              value={filters.ciudad}
              onChange={(e) =>
                setFilters({ ...filters, ciudad: e.target.value })
              }
            />
          </div>

          {/* Fecha de publicación */}
          <div className="filter-group-AP">
            <label className="filter-label-AP">Publicado hace</label>
            <select
              className="filter-select-AP"
              value={filters.fecha}
              onChange={(e) =>
                setFilters({ ...filters, fecha: e.target.value })
              }
            >
              <option value="">Seleccionar</option>
              <option value="1">Últimas 24 horas</option>
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
            </select>
          </div>
        </aside>

        {/* CONTENIDO */}
        <div className="content-wrapper-AP">
          <div className="results-header-AP">
            <h1 className="results-title-AP">
              {filterCargo || filterCiudad || generalQuery
                ? "Resultados de búsqueda"
                : "Todas las ofertas"}
            </h1>
            <p className="results-count-AP">
              {filteredJobListings.length} ofertas encontradas
            </p>
          </div>

          <section className="section-job-panels-AP">
            {/* LISTADO */}
            <section className="section-listings-panel-AP">
              {loading ? (
                <p className="no-results-msg">Cargando ofertas...</p>
              ) : error ? (
                <p className="no-results-msg">Error: {error}</p>
              ) : filteredJobListings.length === 0 ? (
                <p className="no-results-msg">
                  No encontramos ofertas que coincidan con tu búsqueda.
                </p>
              ) : (
                filteredJobListings.map((job) => (
                  <article
                    key={job.id}
                    className={`job-card-AP ${
                      selectedJob?.id === job.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedJob(job);
                      setOfferRating(0);
                      setCompanyRating(0);
                      setComment("");
                      setRatingSuccess(false);
                      setHasRated(false);
                    }}
                  >
                    <div className="job-card-header-AP">
                      <h3 className="job-card-title-AP">{job.titulo || "Sin título"}</h3>
                      <span className="job-time-badge-AP">
                        {job.fechaPublicacion ? new Date(job.fechaPublicacion).toLocaleDateString("es-CO") : "Reciente"}
                      </span>
                    </div>

                    <p className="job-company-AP">{job.empresa?.nombre || "Empresa"}</p>
                    <p className="job-location-AP">{job.municipio?.nombre || "Sin ubicación"}</p>

                    <div className="job-tags-AP">
                      <span className="job-tag-AP tag-modalidad-AP">
                        {job.modalidad || "Híbrida"}
                      </span>
                      <span className="job-tag-AP tag-contrato-AP">
                        {job.tipoContrato || "Indefinido"}
                      </span>
                    </div>

                    <div className="job-card-footer-AP">
                      <p className="job-salary-AP">
                        {job.salario ? formatSalary(job.salario) : "No especificado"}
                      </p>
                      <p className="job-deadline-AP">
                        {job.fechaLimite ? new Date(job.fechaLimite).toLocaleDateString("es-CO") : "Sin fecha"}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </section>

            {/* DETALLES */}
            <section className="section-details-panel-AP">
              {loading ? (
                <p className="detail-loading-AP">Cargando detalles...</p>
              ) : selectedJob ? (
                <div className="job-detail-content-AP">
                  <div className="job-detail-header-AP">
                    <div>
                      <h2 className="job-detail-title-AP">
                        {selectedJob.titulo || "Sin título"}
                      </h2>
                      <p className="job-detail-company-AP">
                        {selectedJob.empresa?.nombre || "Empresa"}
                      </p>
                    </div>
                  </div>

                  <div className="job-detail-info-AP">
                    <div className="info-item-AP">{selectedJob.municipio?.nombre || "Sin ubicación"}</div>
                    <div className="info-item-AP">{selectedJob.modalidad || "Híbrida"}</div>
                    <div className="info-item-AP">{selectedJob.tipoContrato || "Indefinido"}</div>
                    <div className="info-item-AP">{selectedJob.nivelExperiencia || "Intermedio"}</div>
                  </div>

                  <div className="job-detail-salary-AP">
                    <span className="salary-label-AP">Salario: </span>
                    <span className="salary-value-AP">
                      {selectedJob.salario ? formatSalary(selectedJob.salario) : "No especificado"}
                    </span>
                    <span className="salary-period-AP">/ mensual</span>
                  </div>

                  <button
                    className="btn-apply-AP"
                    onClick={() => handlePostularse(selectedJob.id)}
                    disabled={postulando}
                  >
                    {postulando ? "Postulando..." : "Postularme"}
                  </button>

                  <div className="job-detail-description-AP">
                    <h3>Descripción</h3>
                    <p>{selectedJob.descripcion || "Sin descripción disponible"}</p>
                  </div>

                  {selectedJob.requisitos && (
                    <div className="job-detail-requirements-AP">
                      <h3>Requisitos</h3>
                      <p>{selectedJob.requisitos}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="detail-empty-AP">Selecciona una oferta para ver los detalles</p>
              )}
            </section>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AspirantePage;
