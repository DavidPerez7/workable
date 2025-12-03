import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AspirantePage.css";
import HeaderAspirant from "../../components/HeaderAspirant/HeaderAspirant";
import Footer from "../../components/Footer/Footer";

const AspirantePage = () => {
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

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
  // DATOS SIMULADOS
  // ============================================
  const allJobListings = [
    {
      id: 1,
      name: "Desarrollador Frontend",
      location: "Medellín, Antioquia",
      timePosted: "Hace 11 minutos",
      timepostuled: "Termina el 28-08-2025",
      modalidad: "Presencial",
      contrato: "Término Fijo",
      empresa: "Nexabyte Solutions",
      description:
        "Estamos en la búsqueda de un desarrollador frontend con experiencia en React, CSS, JavaScript y HTML...",
      salary: "2500000",
      fulltime: "Tiempo Completo",
    },
    {
      id: 2,
      name: "Analista de Datos",
      location: "Bogotá, Cundinamarca",
      timePosted: "Hace 1 hora",
      timepostuled: "Termina el 18-09-2025",
      modalidad: "Remota",
      contrato: "Término Indefinido",
      empresa: "Codexia Tech Labs",
      description: "Experto en SQL, Python y Power BI...",
      salary: "3200000",
      fulltime: "Tiempo Completo",
    },
    {
      id: 3,
      name: "Especialista QA",
      location: "Cali, Valle",
      timePosted: "Hace 2 días",
      timepostuled: "Termina el 08-10-2025",
      modalidad: "Presencial",
      contrato: "Aprendiz",
      empresa: "Lumitech Global",
      description: "Pruebas de software, automatización, metodologías ágiles.",
      salary: "1800000",
      fulltime: "Tiempo Completo",
    },
  ];

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
  let filteredJobListings = allJobListings.filter((job) => {
    const matchCargo = filterCargo
      ? job.name.toLowerCase().includes(filterCargo)
      : true;

    const matchCiudad = filterCiudad
      ? job.location.toLowerCase().includes(filterCiudad)
      : true;

    const matchesGeneral =
      job.name.toLowerCase().includes(generalQuery) ||
      job.description.toLowerCase().includes(generalQuery) ||
      job.location.toLowerCase().includes(generalQuery) ||
      job.empresa.toLowerCase().includes(generalQuery);

    return matchCargo && matchCiudad && matchesGeneral;
  });

  // ============================================
  // ORDENAR RESULTADOS
  // ============================================
  if (filters.ordenar === "recientes") {
    filteredJobListings = filteredJobListings.sort((a, b) => {
      const getMinutes = (timeString) => {
        if (timeString.includes("minuto")) return parseInt(timeString) || 0;
        if (timeString.includes("hora"))
          return (parseInt(timeString) || 0) * 60;
        if (timeString.includes("día"))
          return (parseInt(timeString) || 0) * 1440;
        return 999999;
      };
      return getMinutes(a.timePosted) - getMinutes(b.timePosted);
    });
  }

  if (filters.ordenar === "salario") {
    filteredJobListings = filteredJobListings.sort(
      (a, b) => Number(b.salary) - Number(a.salary)
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
  // SELECCIONAR AUTOMÁTICAMENTE LA PRIMERA OFERTA
  // ============================================
  useEffect(() => {
    if (filteredJobListings.length > 0) {
      setSelectedJob(filteredJobListings[0]);
    } else {
      setSelectedJob(null);
    }
  }, [location.search]);

  // ============================================
  // POSTULARSE
  // ============================================
  const handlePostularse = (id) => {
    alert(`Postulación exitosa a la oferta ${id} (simulación)`);
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
                    }}
                  >
                    <div className="job-card-header-AP">
                      <h3 className="job-card-title-AP">{job.name}</h3>
                      <span className="job-time-badge-AP">
                        {job.timePosted}
                      </span>
                    </div>

                    <p className="job-company-AP">{job.empresa}</p>
                    <p className="job-location-AP">{job.location}</p>

                    <div className="job-tags-AP">
                      <span className="job-tag-AP tag-modalidad-AP">
                        {job.modalidad}
                      </span>
                      <span className="job-tag-AP tag-contrato-AP">
                        {job.contrato}
                      </span>
                    </div>

                    <div className="job-card-footer-AP">
                      <p className="job-salary-AP">
                        {formatSalary(job.salary)}
                      </p>
                      <p className="job-deadline-AP">{job.timepostuled}</p>
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
                        {selectedJob.name}
                      </h2>
                      <p className="job-detail-company-AP">
                        {selectedJob.empresa}
                      </p>
                    </div>
                  </div>

                  <div className="job-detail-info-AP">
                    <div className="info-item-AP">{selectedJob.location}</div>
                    <div className="info-item-AP">{selectedJob.modalidad}</div>;
                    <div className="info-item-AP">{selectedJob.contrato}</div>
                    <div className="info-item-AP">{selectedJob.fulltime}</div>
                  </div>

                  <div className="job-detail-salary-AP">
                    <span className="salary-label-AP">Salario: </span>
                    <span className="salary-value-AP">
                      {formatSalary(selectedJob.salary)}
                    </span>
                    <span className="salary-period-AP">/ mensual</span>
                  </div>

                  <button
                    className="btn-apply-AP"
                    onClick={() => handlePostularse(selectedJob.id)}
                  >
                    Postularme ahora
                  </button>

                  <div className="job-detail-description-AP">
                    <h3 className="description-title-AP">
                      Descripción del puesto
                    </h3>
                    <p className="description-text-AP">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div className="job-detail-deadline-AP">
                    <span>{selectedJob.timepostuled}</span>
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
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AspirantePage;
