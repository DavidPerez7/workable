import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { crearPostulacion } from '../../api/postulacionAPI';
import './AspirantePage.css';
import HeaderAspirant from '../../components/HeaderAspirant/HeaderAspirant';
import Buttons from '../../components/Buttons/Buttons';
import Dropdown from '../../components/Dropdown/Dropdown';

const AspirantePage = () => {
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);

  // Función para aplicar a una oferta
  const handleAplicarOferta = async (oferta) => {
    const idAspirante = localStorage.getItem('idAspirante');
    console.log('Intentando postularse a la oferta:', oferta, 'con idAspirante:', idAspirante);
    if (!idAspirante) {
      alert('Debes iniciar sesión para postularte.');
      return;
    }
    try {
      if (applying) return;
      setApplying(true);
      const postulacion = {
        fech: new Date().toISOString(),
        estado_Id: 1, // Estado inicial: Aplicado
        oferta_Id: oferta.id,
        aspirante_id: Number(idAspirante)
      };
      console.log('Enviando postulacion:', postulacion);
      const respuesta = await crearPostulacion(postulacion);
      console.log('Respuesta del backend:', respuesta);
      alert('¡Te has postulado exitosamente a la oferta!');
    } catch (err) {
      console.error('Error al postularse:', err);
      alert(err.message || 'Error al postularte. Es posible que ya estés postulado o hubo un problema.');
    } finally {
      setApplying(false);
    }
  };
  // ...existing code...
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
                <p className="p-job-detail-empresa"><b>Empresa:</b> {selectedJob.empresa}</p>
                <p className="p-job-detail-location"><b>Ubicación:</b> {selectedJob.location}</p>
                <p className="p-job-detail-salary"><b>Salario:</b> {selectedJob.salary ? selectedJob.salary + ' COP (Mensual)' : 'A convenir'}</p>
                <p className="p-job-detail-contrato"><b>Tipo de contrato:</b> {selectedJob.contrato}</p>
                <p className="p-job-detail-fulltime"><b>Jornada:</b> {selectedJob.fulltime || selectedJob.modalidad}</p>
                <p className="p-job-detail-postuled"><b>Postúlate hasta:</b> {selectedJob.timepostuled}</p>
                <p className="p-job-detail-publicado"><b>Publicado:</b> {selectedJob.timePosted}</p>
                <hr style={{margin: '10px 0'}} />
                <p className="p-job-detail-description"><b>Descripción del puesto:</b><br/>{selectedJob.description}</p>
                <p className="p-job-detail-requisitos"><b>Requisitos:</b><br/>- Experiencia mínima de 1 año en el área.<br/>- Conocimientos en tecnologías relacionadas.<br/>- Capacidad de trabajo en equipo.<br/>- Proactividad y responsabilidad.</p>
                <p className="p-job-detail-beneficios"><b>Beneficios:</b><br/>- Contrato estable.<br/>- Oportunidad de crecimiento.<br/>- Ambiente laboral agradable.<br/>- Prestaciones de ley.</p>
                <p className="p-job-detail-responsabilidades"><b>Responsabilidades:</b><br/>- Cumplir con los objetivos del área.<br/>- Reportar avances al líder de proyecto.<br/>- Participar en reuniones de equipo.<br/>- Mantener buenas prácticas de desarrollo.</p>
                <p className="p-job-detail-contacto"><b>Contacto:</b> talento@empresa.com</p>
                <button className="btn-aplicar-oferta" onClick={() => handleAplicarOferta(selectedJob)} disabled={applying}>
                  {applying ? 'Enviando...' : 'Aplicar a esta oferta'}
                </button>
                <Buttons></Buttons>
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