import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AspirantePage.css";
import HeaderAspirant from "../../components/HeaderAspirant/HeaderAspirant";
import Footer from "../../components/Footer/Footer";
import { getAllOfertas } from "../../api/ofertasAPI";
import { crearPostulacion, verificarYaPostulado } from "../../api/postulacionAPI";

const AspirantePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postulando, setPostulando] = useState(false);
  const [yaPostulado, setYaPostulado] = useState(false);

  const userId = localStorage.getItem("userId");

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
  // OBTENER OFERTAS REALES DE LA API
  // ============================================
  useEffect(() => {
    obtenerOfertas();
  }, []);

  const obtenerOfertas = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllOfertas();
      // Filtrar solo ofertas activas
      const ofertasActivas = data.filter(o => o.isActive !== false);
      setOfertas(ofertasActivas);
      if (ofertasActivas.length > 0) {
        setSelectedJob(ofertasActivas[0]);
      }
    } catch (err) {
      console.error("Error al obtener ofertas:", err);
      setError("No se pudieron cargar las ofertas");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // VERIFICAR SI YA ESTÁ POSTULADO
  // ============================================
  useEffect(() => {
    if (selectedJob && userId) {
      verificarPostulacion();
    }
  }, [selectedJob, userId]);

  const verificarPostulacion = async () => {
    try {
      const resultado = await verificarYaPostulado(userId, selectedJob.id);
      setYaPostulado(resultado);
    } catch (err) {
      console.error("Error al verificar postulación:", err);
      setYaPostulado(false);
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
    const titulo = job.titulo?.toLowerCase() || "";
    const descripcion = job.descripcion?.toLowerCase() || "";
    const ubicacion = job.municipio?.nombre?.toLowerCase() || "";
    const empresa = job.empresa?.nombre?.toLowerCase() || "";

    const matchCargo = filterCargo ? titulo.includes(filterCargo) : true;
    const matchCiudad = filterCiudad ? ubicacion.includes(filterCiudad) : true;

    const matchesGeneral =
      titulo.includes(generalQuery) ||
      descripcion.includes(generalQuery) ||
      ubicacion.includes(generalQuery) ||
      empresa.includes(generalQuery);

    // Filtros del sidebar
    const matchModalidad = filters.modalidad
      ? job.modalidad === filters.modalidad
      : true;
    const matchContrato = filters.contrato
      ? job.tipoContrato === filters.contrato
      : true;

    return matchCargo && matchCiudad && matchesGeneral && matchModalidad && matchContrato;
  });

  // ============================================
  // ORDENAR RESULTADOS
  // ============================================
  if (filters.ordenar === "recientes") {
    filteredJobListings = filteredJobListings.sort((a, b) => {
      return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
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
  const formatSalary = (value) => {
    if (!value) return "No especificado";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // ============================================
  // FORMATEAR FECHA
  // ============================================
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // ============================================
  // CALCULAR TIEMPO DESDE PUBLICACIÓN
  // ============================================
  const tiempoDesdePublicacion = (fecha) => {
    if (!fecha) return "";
    const ahora = new Date();
    const publicacion = new Date(fecha);
    const diff = Math.floor((ahora - publicacion) / 60000); // minutos
    
    if (diff < 60) return `Hace ${diff} minutos`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)} horas`;
    return `Hace ${Math.floor(diff / 1440)} días`;
  };

  // ============================================
  // POSTULARSE - API REAL
  // ============================================
  const handlePostularse = async (ofertaId) => {
    if (!userId) {
      alert("Debes iniciar sesión para postularte");
      navigate("/Login");
      return;
    }

    if (yaPostulado) {
      alert("Ya te has postulado a esta oferta");
      return;
    }

    setPostulando(true);
    try {
      await crearPostulacion(userId, ofertaId);
      alert("¡Postulación exitosa!");
      setYaPostulado(true);
    } catch (err) {
      console.error("Error al postularse:", err);
      alert(err.message || "No se pudo completar la postulación");
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
      <HeaderAspirant />

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
              <option value="PRESENCIAL">Presencial</option>
              <option value="REMOTO">Remoto</option>
              <option value="HIBRIDO">Híbrido</option>
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
              <option value="TERMINO_FIJO">Término Fijo</option>
              <option value="TERMINO_INDEFINIDO">Término Indefinido</option>
              <option value="OBRA_LABOR">Obra Labor</option>
              <option value="PRESTACION_SERVICIOS">Prestación de Servicios</option>
              <option value="APRENDIZAJE">Aprendizaje</option>
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

          {loading ? (
            <p className="loading-msg-AP">Cargando ofertas...</p>
          ) : error ? (
            <div className="error-msg-AP">
              <p>{error}</p>
              <button onClick={obtenerOfertas}>Reintentar</button>
            </div>
          ) : (
          <section className="section-job-panels-AP">
            {/* LISTADO */}
            <section className="section-listings-panel-AP">
              {filteredJobListings.length === 0 ? (
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
                      setYaPostulado(false);
                    }}
                  >
                    <div className="job-card-header-AP">
                      <h3 className="job-card-title-AP">{job.titulo}</h3>
                      <span className="job-time-badge-AP">
                        {tiempoDesdePublicacion(job.fechaCreacion)}
                      </span>
                    </div>

                    <p className="job-company-AP">{job.empresa?.nombre || "Empresa"}</p>
                    <p className="job-location-AP">
                      {job.municipio?.nombre || "Ubicación"}
                      {job.municipio?.departamento && `, ${job.municipio.departamento}`}
                    </p>

                    <div className="job-tags-AP">
                      <span className="job-tag-AP tag-modalidad-AP">
                        {job.modalidad?.replace(/_/g, " ") || "N/A"}
                      </span>
                      <span className="job-tag-AP tag-contrato-AP">
                        {job.tipoContrato?.replace(/_/g, " ") || "N/A"}
                      </span>
                    </div>

                    <div className="job-card-footer-AP">
                      <p className="job-salary-AP">
                        {formatSalary(job.salario)}
                      </p>
                      <p className="job-deadline-AP">
                        {job.fechaLimite ? `Termina el ${formatFecha(job.fechaLimite)}` : ""}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </section>

            {/* DETALLES */}
            <section className="section-details-panel-AP">
              {selectedJob ? (
                <div className="job-detail-content-AP">
                  <div className="job-detail-header-AP">
                    <div>
                      <h2 className="job-detail-title-AP">
                        {selectedJob.titulo}
                      </h2>
                      <p className="job-detail-company-AP">
                        {selectedJob.empresa?.nombre || "Empresa"}
                      </p>
                    </div>
                  </div>

                  <div className="job-detail-info-AP">
                    <div className="info-item-AP">
                      {selectedJob.municipio?.nombre || "Ubicación"}
                      {selectedJob.municipio?.departamento && `, ${selectedJob.municipio.departamento}`}
                    </div>
                    <div className="info-item-AP">
                      {selectedJob.modalidad?.replace(/_/g, " ") || "N/A"}
                    </div>
                    <div className="info-item-AP">
                      {selectedJob.tipoContrato?.replace(/_/g, " ") || "N/A"}
                    </div>
                    <div className="info-item-AP">
                      {selectedJob.jornada?.replace(/_/g, " ") || "Tiempo Completo"}
                    </div>
                  </div>

                  <div className="job-detail-salary-AP">
                    <span className="salary-label-AP">Salario: </span>
                    <span className="salary-value-AP">
                      {formatSalary(selectedJob.salario)}
                    </span>
                    <span className="salary-period-AP">/ mensual</span>
                  </div>

                  <button
                    className={`btn-apply-AP ${yaPostulado ? "already-applied" : ""}`}
                    onClick={() => handlePostularse(selectedJob.id)}
                    disabled={postulando || yaPostulado}
                  >
                    {postulando ? "Postulando..." : yaPostulado ? "Ya postulado ✓" : "Postularme ahora"}
                  </button>

                  <div className="job-detail-description-AP">
                    <h3 className="description-title-AP">
                      Descripción del puesto
                    </h3>
                    <p className="description-text-AP">
                      {selectedJob.descripcion || "Sin descripción disponible"}
                    </p>
                  </div>

                  {selectedJob.requisitos && selectedJob.requisitos.length > 0 && (
                    <div className="job-detail-requirements-AP">
                      <h3 className="description-title-AP">Requisitos</h3>
                      <ul>
                        {Array.from(selectedJob.requisitos).map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedJob.beneficios && selectedJob.beneficios.length > 0 && (
                    <div className="job-detail-benefits-AP">
                      <h3 className="description-title-AP">Beneficios</h3>
                      <ul>
                        {Array.from(selectedJob.beneficios).map((ben, idx) => (
                          <li key={idx}>{ben.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="job-detail-deadline-AP">
                    <span>
                      {selectedJob.fechaLimite 
                        ? `Fecha límite: ${formatFecha(selectedJob.fechaLimite)}`
                        : "Sin fecha límite"}
                    </span>
                  </div>

                  {/* VALORACIÓN RF14 */}
                  <div className="rating-section-AP">
                    <h3 className="rating-title-AP">Valorar esta oferta</h3>

                    <p>Calificación de la oferta:</p>
                    <div className="rating-stars-AP">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`rating-star-AP ${
                            offerRating >= star ? "active" : ""
                          }`}
                          onClick={() => setOfferRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <p>Calificación de la empresa:</p>
                    <div className="rating-stars-AP">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`rating-star-AP ${
                            companyRating >= star ? "active" : ""
                          }`}
                          onClick={() => setCompanyRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <textarea
                      className="rating-comment-AP"
                      placeholder="Escribe un comentario..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    {!ratingSuccess ? (
                      <button
                        className="rating-submit-btn-AP"
                        onClick={submitRating}
                      >
                        Enviar valoración
                      </button>
                    ) : (
                      <p className="rating-success-message-AP">
                        ¡Gracias por tu valoración! ✔
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-selection-message-AP">
                  <p className="no-selection-text-AP">
                    Selecciona una oferta para ver los detalles.
                  </p>
                </div>
              )}
            </section>
          </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AspirantePage;
