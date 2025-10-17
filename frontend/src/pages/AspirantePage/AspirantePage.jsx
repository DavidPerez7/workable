import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './AspirantePage.css';
import HeaderAspirant from '../../components/HeaderAspirant/HeaderAspirant'
import Buttons  from '../../components/Buttons/Buttons';
import Dropdown from '../../components/Dropdown/Dropdown';



const AspirantePage = () => {
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);

  const allJobListings = [
    { id: 1, name: 'Desarrollador Frontend', location: 'Medellín, Antioquia', timePosted: 'Hace 11 minutos', timepostuled: 'Termina el 28-08-2025', modalidad: 'Presencial', contrato: 'Término Fijo', empresa: "Empresa: Nexabyte Solutions", description: "Estamos en la búsqueda de un desarrollador frontend con experiencia en React, CSS, JavaScript y HTML. La persona ideal debe ser capaz de construir interfaces modernas, dinámicas y responsivas, trabajar en equipo con diseñadores y backend, y aportar ideas que mejoren la experiencia del usuario. Valoramos la atención al detalle, la creatividad y la capacidad de transformar requerimientos en soluciones funcionales y atractivas.s", salary: "2.500.000", fulltime: "Tiempo Completo"},
    { id: 2, name: 'Analista de Datos', location: 'Bogotá, Cundinamarca', timePosted: 'Hace 1 hora', timepostuled: 'Termina el 18-09-2025', modalidad: 'Remota', contrato: 'Término Indefinido', empresa: "Empresa: Codexia Tech Labs", description: "Experto en SQL, Python y Power BI, manejo de grandes volúmenes de datos." },
    { id: 3, name: 'Especialista QA', location: 'Cali, Valle', timePosted: 'Hace 2 días', timepostuled: 'Termina el 08-10-2025', modalidad: 'Presencial', contrato: 'Aprendiz', empresa: "Empresa: Lumitech Global", description: "Pruebas de software, automatización, metodologías ágiles." },
    { id: 4, name: 'Diseñador UX/UI', location: 'Barranquilla, Atlántico', timePosted: 'Hace 3 días', timepostuled: 'Termina el 20-11-2025', modalidad: 'Presencial', contrato: 'Prestación de Servicios', empresa: "Empresa: QuantumEdge Systems", description: "Experiencia con Figma, Sketch, Adobe XD, prototipado." },
    { id: 5, name: 'Ingeniero Backend', location: 'Cartagena, Bolívar', timePosted: 'Hace 5 días', timepostuled: 'Termina el 11-07-2025', modalidad: 'Hibrido', contrato: 'Aprendiz', empresa: "Empresa: Synapse Core", description: "Desarrollo de APIs con Node.js y bases de datos SQL, microservicios." },
    { id: 6, name: 'Asesor Comercial', location: 'Bogotá, D.C.', timePosted: 'Hace 1 día', timepostuled: 'Termina el 01-12-2025', modalidad: 'Presencial', contrato: 'Término Indefinido', empresa: "Empresa: Ventas Pro S.A.", description: "Experiencia en ventas y atención al cliente, manejo de CRM." },
    { id: 7, name: 'Desarrollador Java', location: 'Medellín, Antioquia', timePosted: 'Hace 4 días', timepostuled: 'Termina el 15-11-2025', modalidad: 'Remota', contrato: 'Término Fijo', empresa: "Empresa: Tech Solutions", description: "Desarrollo de aplicaciones empresariales con Java y Spring Boot." },
    { id: 8, name: 'Asistente Administrativo', location: 'Bogotá, D.C.', timePosted: 'Hace 6 días', timepostuled: 'Termina el 20-10-2025', modalidad: 'Hibrido', contrato: 'Prestación de Servicios', empresa: "Empresa: Oficina Eficaz", description: "Manejo de documentos, atención telefónica, organización, excel." }
  ];

  const queryParams = new URLSearchParams(location.search);
  const generalQuery = queryParams.get('query')?.toLowerCase() || '';

  const filteredJobListings = generalQuery
    ? allJobListings.filter(job =>
        job.salary.toLowerCase().includes(generalQuery)||
        job.salary.toLowerCase().includes(generalQuery)||
        job.name.toLowerCase().includes(generalQuery) ||
        job.description.toLowerCase().includes(generalQuery) ||
        job.location.toLowerCase().includes(generalQuery) ||
        job.empresa.toLowerCase().includes(generalQuery) ||
        job.modalidad.toLowerCase().includes(generalQuery) ||
        job.contrato.toLowerCase().includes(generalQuery)
      )
    : allJobListings;

    document.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', function() {
    const menu = this.nextElementSibling;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
  });

  return (
    <>
      <HeaderAspirant/>
      <main className="main-aspirant-page">

    <div className='dropdown-buttons'>
      <Dropdown label="Ordenar" options={["Relevancia", "Fecha", "Salario"]} />
      <Dropdown label="Distancia" options={["Hasta 5 km", "Hasta 10 km", "Hasta 25 km"]} />
      <Dropdown label="Fecha" options={["Urgente", "Hoy", "Ultimos 3 dias"]} />
      <Dropdown label="Categoria" options={["Administracion", "Contabilidad, Finanzas", "Ventas"]}></Dropdown>
      <Dropdown label="Lugar de trabajo" options={["Bogota"]}></Dropdown>
      <Dropdown label="Experiencia" options={["Sin experiencia", "1 año", "2 años"]}></Dropdown>
      <Dropdown label="Salario" options={["Menos de 700.000", "Mas de 700.000", "Mas de 1.000.000"]}></Dropdown>
      <Dropdown label="Jornada" options={["Tiempo completo", "Tiempo parcial"]}></Dropdown>
      <Dropdown label="Contrato" options={["Contrato a termino indefinido", "Contrato de obra o labor", "Contrato a termino fijo"]}></Dropdown>
    </div>

        <section className="section-job-panels">
          <section className="section-listings-panel">
              <nav className="nav-job-categories"><p>Busca tu trabajo deseado</p></nav>
            <div className="div-job-cards-grid">
              {filteredJobListings.length > 0 ? (
                filteredJobListings.map((job) => (
                  <div
                    key={job.id}
                    className="div-job-card"
                    onClick={() => setSelectedJob(job)}
                  >
                    <h3 className="h3-job-card-title">{job.name}</h3>
                    <p className="p-job-location">{job.location}</p>
                    <p className="p-job-time">{job.timePosted}</p>
                    <p className="p-job-postuled">{job.timepostuled}</p>
                    <p className="p-modalidad">{job.modalidad}</p>
                    <p className="p-contrato">{job.contrato}</p>
                    <p className="p-empresa">{job.empresa}</p>
                    <div className="div-job-card-actions">
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-offers-message">
                  <p>No hay ofertas disponibles que coincidan con tu búsqueda.</p>
                </div>
              )}
            </div>
          </section>

          <section className="section-details-panel">
            {selectedJob ? (
              <div className="div-job-detail-content">
                <h2 className="h2-job-detail-title">{selectedJob.name}</h2>
                <p className="p-job-detail-empresa"> <p>{selectedJob.empresa}</p></p>
                <p className="p-job-detail-location">{selectedJob.location}</p>
                <Buttons></Buttons>
                <p className="p-job-detail-salary">{selectedJob.salary} (Mensual)</p>
                <p className="p-job-detail-contrato">Contrato: {selectedJob.contrato}</p>
                <p className="p-job-detail-fulltime">{selectedJob.fulltime}</p>
                <p className="p-job-detail-description">
                  {selectedJob.description}
                </p>
              </div>
            ) : (
              <div className="div-no-selection-message">
                <p>Selecciona una oferta para ver los detalles aquí.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
};

export default AspirantePage;