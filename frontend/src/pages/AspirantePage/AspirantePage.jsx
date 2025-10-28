import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { crearPostulacion } from '../../api/postulacionAPI';
import { getAllOfertas } from '../../api/ofertasAPI';
import './AspirantePage.css';
import HeaderAspirant from '../../components/HeaderAspirant/HeaderAspirant';
import Buttons from '../../components/Buttons/Buttons';
import Dropdown from '../../components/Dropdown/Dropdown';

const AspirantePage = () => {
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar ofertas desde el backend
  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        console.log('🔄 Cargando ofertas desde el backend...');
        setLoading(true);
        const data = await getAllOfertas();
        console.log('✅ Ofertas cargadas:', data);
        
        // Mapear las ofertas del backend al formato del frontend
        const ofertasFormateadas = data.map(oferta => ({
          id: oferta.id,
          name: oferta.titu || 'Sin título',
          location: oferta.ubi || 'No especificado',
          description: oferta.desc || 'Sin descripción',
          requisitos: oferta.requisitos || 'No especificados',
          salario: oferta.salario || 'A convenir',
          jornada: oferta.jornada || 'No especificada',
          beneficios: oferta.beneficios || 'No especificados',
          responsabilidades: oferta.responsabilidades || 'No especificadas',
          contacto: oferta.contacto || 'No especificado',
          modalidad: oferta.modalNomb || 'No especificado',
          contrato: oferta.tipoConNomb || 'No especificado',
          empresa: oferta.empNomb || 'Empresa no especificada',
          empresaNombre: oferta.empNomb || 'Empresa no especificada',
          direccion: oferta.ubi,
          fechaPublicacion: oferta.fechaPub,
          fechaLimite: oferta.fechLim,
          timePosted: calcularTiempoPublicacion(oferta.fechaPub),
          timepostuled: `Termina el ${formatearFecha(oferta.fechLim)}`
        }));

        setOfertas(ofertasFormateadas);
        setError(null);
      } catch (err) {
        console.error('❌ Error al cargar ofertas:', err);
        setError(err.message || 'Error al cargar las ofertas');
      } finally {
        setLoading(false);
      }
    };

    cargarOfertas();
  }, []);

  // Función auxiliar para calcular el tiempo desde la publicación
  const calcularTiempoPublicacion = (fechaPub) => {
    if (!fechaPub) return 'Fecha no disponible';
    
    const fecha = new Date(fechaPub);
    const ahora = new Date();
    const diferencia = ahora - fecha;
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (minutos < 60) {
      return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    } else if (horas < 24) {
      return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    } else {
      return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    }
  };

  // Función auxiliar para formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificado';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Función para aplicar a una oferta
  const handleAplicarOferta = async (oferta) => {
    const idAspirante = localStorage.getItem('idAspirante');
    const role = localStorage.getItem('role');
    
    console.log('🎯 Intentando postularse a la oferta:', oferta.id, oferta.name);
    console.log('👤 idAspirante:', idAspirante, '| role:', role);
    
    // Validar que sea aspirante
    if (role !== 'ASPIRANTE') {
      alert('❌ Solo los aspirantes pueden postularse a ofertas. Por favor, inicia sesión como aspirante.');
      return;
    }
    
    if (!idAspirante) {
      alert('❌ Debes iniciar sesión como aspirante para postularte.');
      return;
    }
    
    // Confirmar postulación
    const confirmacion = window.confirm(
      `¿Deseas postularte a la oferta "${oferta.name}"?\n\n` +
      `Empresa: ${oferta.empresaNombre}\n` +
      `Ubicación: ${oferta.location}\n` +
      `Modalidad: ${oferta.modalidad}`
    );
    
    if (!confirmacion) return;
    
    try {
      if (applying) return;
      setApplying(true);
      
      const postulacion = {
        fech: new Date().toISOString(),
        estado_Id: 1, // Estado inicial: Pendiente/Aplicado
        oferta_Id: oferta.id,
        aspirante_id: Number(idAspirante)
      };
      
      console.log('📤 Enviando postulación:', postulacion);
      const respuesta = await crearPostulacion(postulacion);
      console.log('✅ Respuesta del backend:', respuesta);
      
      alert('🎉 ¡Te has postulado exitosamente!\n\nLa empresa revisará tu perfil y te contactará pronto.');
      
    } catch (err) {
      console.error('❌ Error al postularse:', err);
      
      // Manejar diferentes tipos de errores
      if (err.message.includes('ya está postulado') || err.message.includes('duplicate')) {
        alert('⚠️ Ya te has postulado a esta oferta anteriormente.');
      } else if (err.message.includes('403')) {
        alert('❌ No tienes permisos para postularte. Asegúrate de estar logueado como aspirante.');
      } else if (err.message.includes('404')) {
        alert('❌ La oferta ya no está disponible.');
      } else {
        alert('❌ Error al postularte: ' + (err.message || 'Por favor, intenta de nuevo.'));
      }
    } finally {
      setApplying(false);
    }
  };
  
  const queryParams = new URLSearchParams(location.search);
  const generalQuery = queryParams.get('query')?.toLowerCase() || '';

  // Filtrar ofertas (ahora usa las ofertas dinámicas del backend)
  const filteredJobListings = generalQuery
    ? ofertas.filter(job =>
        job.name.toLowerCase().includes(generalQuery) ||
        job.description.toLowerCase().includes(generalQuery) ||
        job.location.toLowerCase().includes(generalQuery) ||
        job.empresa.toLowerCase().includes(generalQuery) ||
        job.modalidad.toLowerCase().includes(generalQuery) ||
        job.contrato.toLowerCase().includes(generalQuery)
      )
    : ofertas;

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
              {loading ? (
                <div className="loading-message">
                  <p>⏳ Cargando ofertas...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <p>❌ {error}</p>
                  <button onClick={() => window.location.reload()}>Reintentar</button>
                </div>
              ) : filteredJobListings.length > 0 ? (
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
                    <p className="p-empresa">Empresa: {job.empresaNombre}</p>
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
                <p className="p-job-detail-empresa"><b>Empresa:</b> {selectedJob.empresaNombre}</p>
                <p className="p-job-detail-location"><b>Ubicación:</b> {selectedJob.location}</p>
                <p className="p-job-detail-salary"><b>Salario:</b> {selectedJob.salario}</p>
                <p className="p-job-detail-contrato"><b>Tipo de contrato:</b> {selectedJob.contrato}</p>
                <p className="p-job-detail-fulltime"><b>Jornada:</b> {selectedJob.jornada || selectedJob.modalidad}</p>
                <p className="p-job-detail-modalidad"><b>Modalidad:</b> {selectedJob.modalidad}</p>
                <p className="p-job-detail-postuled"><b>Postúlate hasta:</b> {selectedJob.timepostuled}</p>
                <p className="p-job-detail-publicado"><b>Publicado:</b> {selectedJob.timePosted}</p>
                <hr style={{margin: '15px 0'}} />
                <div className="p-job-detail-description">
                  <b>Descripción del puesto:</b><br/>
                  {selectedJob.description}
                </div>
                {selectedJob.requisitos && selectedJob.requisitos !== 'No especificados' && (
                  <div className="p-job-detail-requisitos" style={{whiteSpace: 'pre-line', marginTop: '15px'}}>
                    <b>Requisitos:</b><br/>
                    {selectedJob.requisitos}
                  </div>
                )}
                {selectedJob.responsabilidades && selectedJob.responsabilidades !== 'No especificadas' && (
                  <div className="p-job-detail-responsabilidades" style={{whiteSpace: 'pre-line', marginTop: '15px'}}>
                    <b>Responsabilidades:</b><br/>
                    {selectedJob.responsabilidades}
                  </div>
                )}
                {selectedJob.beneficios && selectedJob.beneficios !== 'No especificados' && (
                  <div className="p-job-detail-beneficios" style={{whiteSpace: 'pre-line', marginTop: '15px'}}>
                    <b>Beneficios:</b><br/>
                    {selectedJob.beneficios}
                  </div>
                )}
                {selectedJob.contacto && selectedJob.contacto !== 'No especificado' && (
                  <p className="p-job-detail-contacto" style={{marginTop: '15px'}}>
                    <b>Contacto:</b> {selectedJob.contacto}
                  </p>
                )}
                
                <div style={{marginTop: '25px', borderTop: '2px solid #e0e0e0', paddingTop: '20px'}}>
                  <button 
                    className="btn-aplicar-oferta" 
                    onClick={() => handleAplicarOferta(selectedJob)} 
                    disabled={applying}
                    style={{
                      width: '100%',
                      padding: '15px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      backgroundColor: applying ? '#ccc' : '#2541a0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: applying ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: applying ? 'none' : '0 4px 6px rgba(37, 65, 160, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      if (!applying) {
                        e.target.style.backgroundColor = '#1a2f7a';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 8px rgba(37, 65, 160, 0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!applying) {
                        e.target.style.backgroundColor = '#2541a0';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(37, 65, 160, 0.3)';
                      }
                    }}
                  >
                    {applying ? '⏳ Enviando postulación...' : '🚀 Postularme a esta oferta'}
                  </button>
                  
                  {applying && (
                    <p style={{
                      marginTop: '10px',
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      Por favor espera...
                    </p>
                  )}
                </div>
                
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