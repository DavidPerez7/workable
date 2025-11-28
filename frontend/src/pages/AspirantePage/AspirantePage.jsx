import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./AspirantePage.css";
import HeaderAspirant from "../../components/HeaderAspirant/HeaderAspirant";
import Footer from "../../components/Footer/Footer";

const AspirantePage = () => {
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    ordenar: "",
    distancia: "",
    fecha: "",
    categoria: "",
    lugar: "",
    experiencia: "",
    salario: "",
    jornada: "",
    contrato: "",
  });

  // ============================================
  // DATOS DE OFERTAS (SIMULADAS)
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
        "Estamos en la búsqueda de un desarrollador frontend con experiencia en React, CSS, JavaScript y HTML. La persona ideal debe ser capaz de construir interfaces modernas, dinámicas y responsivas, trabajar en equipo con diseñadores y backend, y aportar ideas que mejoren la experiencia del usuario. Valoramos la atención al detalle, la creatividad y la capacidad de transformar requerimientos en soluciones funcionales y atractivas.",
      salary: "2.500.000",
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
      description:
        "Experto en SQL, Python y Power BI, manejo de grandes volúmenes de datos.",
      salary: "3.200.000",
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
      salary: "1.800.000",
      fulltime: "Tiempo Completo",
    },
    {
      id: 4,
      name: "Diseñador UX/UI",
      location: "Barranquilla, Atlántico",
      timePosted: "Hace 3 días",
      timepostuled: "Termina el 20-11-2025",
      modalidad: "Presencial",
      contrato: "Prestación de Servicios",
      empresa: "QuantumEdge Systems",
      description: "Experiencia con Figma, Sketch, Adobe XD, prototipado.",
      salary: "2.800.000",
      fulltime: "Tiempo Completo",
    },
    {
      id: 5,
      name: "Ingeniero Backend",
      location: "Cartagena, Bolívar",
      timePosted: "Hace 5 días",
      timepostuled: "Termina el 11-07-2025",
      modalidad: "Híbrido",
      contrato: "Aprendiz",
      empresa: "Synapse Core",
      description:
        "Desarrollo de APIs con Node.js y bases de datos SQL, microservicios.",
      salary: "2.000.000",
      fulltime: "Tiempo Completo",
    },
    {
      id: 6,
      name: "Asesor Comercial",
      location: "Bogotá, D.C.",
      timePosted: "Hace 1 día",
      timepostuled: "Termina el 01-12-2025",
      modalidad: "Presencial",
      contrato: "Término Indefinido",
      empresa: "Ventas Pro S.A.",
      description:
        "Experiencia en ventas y atención al cliente, manejo de CRM.",
      salary: "1.500.000",
      fulltime: "Tiempo Completo",
    },
    {
      id: 7,
      name: "Desarrollador Java",
      location: "Medellín, Antioquia",
      timePosted: "Hace 4 días",
      timepostuled: "Termina el 15-11-2025",
      modalidad: "Remota",
      contrato: "Término Fijo",
      empresa: "Tech Solutions",
      description:
        "Desarrollo de aplicaciones empresariales con Java y Spring Boot.",
      salary: "3.500.000",
      fulltime: "Tiempo Completo",
    },
    {
      id: 8,
      name: "Asistente Administrativo",
      location: "Bogotá, D.C.",
      timePosted: "Hace 6 días",
      timepostuled: "Termina el 20-10-2025",
      modalidad: "Híbrido",
      contrato: "Prestación de Servicios",
      empresa: "Oficina Eficaz",
      description:
        "Manejo de documentos, atención telefónica, organización, excel.",
      salary: "1.300.000",
      fulltime: "Medio Tiempo",
    },
  ];

  // ============================================
  // OBTENER OFERTAS DESDE API (COMENTADO)
  // ============================================
  /*
  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8080/api/oferta', {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener ofertas');
      }

      const data = await response.json();
      // Filtrar solo ofertas activas/abiertas
      const ofertasActivas = data.filter(oferta => oferta.estado === 'ABIERTA');
      setAllJobListings(ofertasActivas);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  */

  // ============================================
  // FILTRADO Y BÚSQUEDA
  // ============================================
  const queryParams = new URLSearchParams(location.search);
  const generalQuery = queryParams.get("query")?.toLowerCase() || "";

  const filteredJobListings = generalQuery
    ? allJobListings.filter(
        (job) =>
          job.name.toLowerCase().includes(generalQuery) ||
          job.description.toLowerCase().includes(generalQuery) ||
          job.location.toLowerCase().includes(generalQuery) ||
          job.empresa.toLowerCase().includes(generalQuery) ||
          job.modalidad.toLowerCase().includes(generalQuery) ||
          job.contrato.toLowerCase().includes(generalQuery) ||
          job.salary.toLowerCase().includes(generalQuery)
      )
    : allJobListings;

  // ============================================
  // POSTULARSE A OFERTA (COMENTADO)
  // ============================================
  /*
  const handlePostularse = async (ofertaId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        alert('Debes iniciar sesión para postularte');
        return;
      }

      const response = await fetch('http://localhost:8080/api/postulacion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ofertaId: ofertaId,
          aspiranteId: parseInt(userId),
          estadoId: 1 // Pendiente
        })
      });

      if (!response.ok) {
        throw new Error('Error al postularse');
      }

      alert('¡Te has postulado exitosamente!');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al postularse: ' + err.message);
    }
  };
  */

  const handlePostularse = (ofertaId) => {
    alert(`Postulación exitosa a la oferta ${ofertaId} (simulación)`);
  };

  // ============================================
  // FORMATEAR SALARIO
  // ============================================
  const formatSalary = (salary) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  // ============================================
  // FORMATEAR FECHA
  // ============================================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <HeaderAspirant />
      <main className="main-aspirant-page-AP">
        {/* SECCIÓN DE FILTROS */}
        <aside className="sidebar-filters-AP">
          <div className="filters-header-AP">
            <h2 className="filters-title-AP">Filtros de búsqueda</h2>
            <button className="btn-clear-filters-AP">Limpiar</button>
          </div>

          <div className="filter-group-AP">
            <h3 className="filter-label-AP">Ordenar por</h3>
            <select className="filter-select-AP">
              <option value="">Seleccionar</option>
              <option value="relevancia">Relevancia</option>
              <option value="fecha">Más recientes</option>
              <option value="salario">Mayor salario</option>
            </select>
          </div>

          <div className="filter-group-AP">
            <h3 className="filter-label-AP">Modalidad</h3>
            <div className="filter-options-AP">
              <label className="filter-checkbox-AP">
                <input type="checkbox" />
                <span>Presencial</span>
              </label>
              <label className="filter-checkbox-AP">
                <input type="checkbox" />
                <span>Remoto</span>
              </label>
              <label className="filter-checkbox-AP">
                <input type="checkbox" />
                <span>Híbrido</span>
              </label>
            </div>
          </div>

          <div className="filter-group-AP">
            <h3 className="filter-label-AP">Tipo de contrato</h3>
            <div className="filter-options-AP">
              <label className="filter-checkbox-AP">
                <input type="checkbox" />
                <span>Término Indefinido</span>
              </label>
              <label className="filter-checkbox-AP">
                <input type="checkbox" />
                <span>Término Fijo</span>
              </label>
              <label className="filter-checkbox-AP">
                <input type="checkbox" />
                <span>Aprendiz</span>
              </label>
            </div>
          </div>

          <div className="filter-group-AP">
            <h3 className="filter-label-AP">Rango salarial</h3>
            <select className="filter-select-AP">
              <option value="">Seleccionar</option>
              <option value="0-1000000">Menos de $1.000.000</option>
              <option value="1000000-2000000">$1.000.000 - $2.000.000</option>
              <option value="2000000-3000000">$2.000.000 - $3.000.000</option>
              <option value="3000000+">Más de $3.000.000</option>
            </select>
          </div>

          <div className="filter-group-AP">
            <h3 className="filter-label-AP">Ubicación</h3>
            <input
              type="text"
              placeholder="Ciudad o departamento"
              className="filter-input-AP"
            />
          </div>
        </aside>

        {/* SECCIÓN DE OFERTAS */}
        <div className="content-wrapper-AP">
          {/* HEADER CON RESULTADOS */}
          <div className="results-header-AP">
            <h1 className="results-title-AP">
              {generalQuery
                ? `Resultados para "${generalQuery}"`
                : "Todas las ofertas"}
            </h1>
            <p className="results-count-AP">
              {filteredJobListings.length} ofertas encontradas
            </p>
          </div>

          <section className="section-job-panels-AP">
            {/* PANEL DE LISTADO */}
            <section className="section-listings-panel-AP">
              {loading ? (
                <div className="loading-state-AP">
                  <p>Cargando ofertas...</p>
                </div>
              ) : filteredJobListings.length > 0 ? (
                <div className="job-cards-grid-AP">
                  {filteredJobListings.map((job) => (
                    <article
                      key={job.id}
                      className={`job-card-AP ${
                        selectedJob?.id === job.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="job-card-header-AP">
                        <h3 className="job-card-title-AP">{job.name}</h3>
                        <span className="job-time-badge-AP">
                          {job.timePosted}
                        </span>
                      </div>

                      <p className="job-company-AP">{job.empresa}</p>
                      <p className="job-location-AP"> {job.location}</p>

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
                        <p className="job-deadline-AP"> {job.timepostuled}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="no-offers-message-AP">
                  <svg
                    className="no-offers-icon-AP"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="no-offers-text-AP">
                    No hay ofertas disponibles que coincidan con tu búsqueda.
                  </p>
                  <button className="btn-clear-search-AP">
                    Limpiar búsqueda
                  </button>
                </div>
              )}
            </section>

            {/* PANEL DE DETALLES */}
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
                    <button className="btn-save-job-AP" title="Guardar oferta">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="job-detail-info-AP">
                    <div className="info-item-AP">
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="info-item-AP">
                      <span>{selectedJob.modalidad}</span>
                    </div>
                    <div className="info-item-AP">
                      <span>{selectedJob.contrato}</span>
                    </div>
                    <div className="info-item-AP">
                      <span>{selectedJob.fulltime}</span>
                    </div>
                  </div>

                  <div className="job-detail-salary-AP">
                    <span className="salary-label-AP">Salario:</span>
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
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="deadline-icon-AP"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{selectedJob.timepostuled}</span>
                  </div>
                </div>
              ) : (
                <div className="no-selection-message-AP">
                  <svg
                    className="no-selection-icon-AP"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="no-selection-text-AP">
                    Selecciona una oferta para ver los detalles
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
