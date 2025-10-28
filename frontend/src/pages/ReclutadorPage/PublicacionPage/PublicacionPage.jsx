import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearOferta } from '../../../api/ofertasAPI';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import './PublicacionPage.css';

const PublicacionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    tituloAviso: '',
    descripcionTrabajo: '',
    direccion: '',
    requisitos: '',
    salario: '',
    jornada: '',
    beneficios: '',
    responsabilidades: '',
    contacto: '',
    fechaPublicacion: '',
    fechaLimite: '',
    modalidadTrabajo: '',
    tipoContrato: ''
  });


  const modalidades = [
    { id: 1, nombre: 'Presencial' },
    { id: 2, nombre: 'Remoto' },
    { id: 3, nombre: 'Híbrido' }
  ];

  const tiposContrato = [
    { id: 1, nombre: 'Indefinido' },
    { id: 2, nombre: 'Término fijo' },
    { id: 3, nombre: 'Prácticas' }
  ];

  const tiposJornada = [
    'Tiempo completo',
    'Medio tiempo',
    'Por horas',
    'Remoto'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Obtener el empresaId desde localStorage
      const empresaId = localStorage.getItem('empresaId');
      
      if (!empresaId) {
        alert('Error: No se encontró el ID de la empresa. Por favor, inicia sesión nuevamente.');
        return;
      }

      // Preparar los datos según el formato del backend (OfertaDto)
      const ofertaData = {
        titu: formData.tituloAviso,
        desc: formData.descripcionTrabajo,
        ubi: formData.direccion,
        requisitos: formData.requisitos || null,
        salario: formData.salario || null,
        jornada: formData.jornada || null,
        beneficios: formData.beneficios || null,
        responsabilidades: formData.responsabilidades || null,
        contacto: formData.contacto || null,
        fechaPu: formData.fechaPublicacion,
        fechaLi: formData.fechaLimite,
        modalidad_id: parseInt(formData.modalidadTrabajo),
        tipoContrato_id: parseInt(formData.tipoContrato),
        empresa_id: parseInt(empresaId) // Usar el empresaId del localStorage
      };

      console.log('📤 Enviando datos de oferta al backend:', ofertaData);

      // Llamar a la API para crear la oferta
      const respuesta = await crearOferta(ofertaData);
      
      console.log('✅ Oferta creada exitosamente:', respuesta);
      
      alert('¡Oferta publicada exitosamente!');
      
      // Redirigir a la página de gestión de ofertas o lista de ofertas
      navigate('/reclutador/ofertas');
      
    } catch (err) {
      console.error('❌ Error al crear oferta:', err);
      setError(err.message || 'Error al crear la oferta');
      alert('Error al publicar la oferta: ' + (err.message || 'Por favor, intenta de nuevo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderReclutador />
      <main className="container-main-PB">
        <h1 className="title-page-PB">Publicar oferta</h1>

        <form onSubmit={handleSubmit}>
          <section className="section-card-PB">
            <h2 className="title-section-PB">Datos de la oferta</h2>

            <div className="form-grid-PB">
              <div className="form-group-PB full-width-PB">
                <label htmlFor="tituloAviso">Título del aviso:</label>
                <input
                  type="text"
                  id="tituloAviso"
                  name="tituloAviso"
                  value={formData.tituloAviso}
                  onChange={handleChange}
                  placeholder="Ej: Desarrollador Full Stack"
                  required
                />
              </div>

              <div className="form-group-PB full-width-PB">
                <label htmlFor="descripcionTrabajo">Descripción:</label>
                <textarea
                  id="descripcionTrabajo"
                  name="descripcionTrabajo"
                  value={formData.descripcionTrabajo}
                  onChange={handleChange}
                  placeholder="Descripción breve del puesto..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-group-PB full-width-PB">
                <label htmlFor="requisitos">Requisitos:</label>
                <textarea
                  id="requisitos"
                  name="requisitos"
                  value={formData.requisitos}
                  onChange={handleChange}
                  placeholder="- Experiencia mínima de X años&#10;- Conocimientos en tecnologías&#10;- Capacidad de trabajo en equipo&#10;- Proactividad y responsabilidad"
                  rows="6"
                />
              </div>

              <div className="form-group-PB full-width-PB">
                <label htmlFor="responsabilidades">Responsabilidades:</label>
                <textarea
                  id="responsabilidades"
                  name="responsabilidades"
                  value={formData.responsabilidades}
                  onChange={handleChange}
                  placeholder="- Cumplir con los objetivos del área&#10;- Reportar avances al líder de proyecto&#10;- Participar en reuniones de equipo&#10;- Mantener buenas prácticas de desarrollo"
                  rows="6"
                />
              </div>

              <div className="form-group-PB full-width-PB">
                <label htmlFor="beneficios">Beneficios:</label>
                <textarea
                  id="beneficios"
                  name="beneficios"
                  value={formData.beneficios}
                  onChange={handleChange}
                  placeholder="- Contrato estable&#10;- Oportunidad de crecimiento&#10;- Ambiente laboral agradable&#10;- Prestaciones de ley"
                  rows="5"
                />
              </div>

              <div className="form-group-PB">
                <label htmlFor="direccion">Ubicación:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Calle 123 #45-67, Bogotá"
                  required
                />
              </div>

              <div className="form-group-PB">
                <label htmlFor="salario">Salario:</label>
                <input
                  type="text"
                  id="salario"
                  name="salario"
                  value={formData.salario}
                  onChange={handleChange}
                  placeholder="Ej: A convenir, $2.000.000 - $3.000.000"
                />
              </div>

              <div className="form-group-PB">
                <label htmlFor="jornada">Jornada:</label>
                <select
                  id="jornada"
                  name="jornada"
                  value={formData.jornada}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una jornada</option>
                  {tiposJornada.map((tipo, index) => (
                    <option key={index} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-PB">
                <label htmlFor="contacto">Contacto (Email):</label>
                <input
                  type="email"
                  id="contacto"
                  name="contacto"
                  value={formData.contacto}
                  onChange={handleChange}
                  placeholder="talento@empresa.com"
                />
              </div>

              <div className="form-group-PB">
                <label htmlFor="fechaPublicacion">Fecha de publicación:</label>
                <input
                  type="date"
                  id="fechaPublicacion"
                  name="fechaPublicacion"
                  value={formData.fechaPublicacion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group-PB">
                <label htmlFor="fechaLimite">Postúlate hasta:</label>
                <input
                  type="date"
                  id="fechaLimite"
                  name="fechaLimite"
                  value={formData.fechaLimite}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group-PB">
                <label htmlFor="modalidadTrabajo">Modalidad:</label>
                <select
                  id="modalidadTrabajo"
                  name="modalidadTrabajo"
                  value={formData.modalidadTrabajo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una modalidad</option>
                  {modalidades.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-PB">
                <label htmlFor="tipoContrato">Tipo de contrato:</label>
                <select
                  id="tipoContrato"
                  name="tipoContrato"
                  value={formData.tipoContrato}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un tipo de contrato</option>
                  {tiposContrato.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="error-message-PB" style={{
                padding: '15px',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '8px',
                color: '#c33',
                marginTop: '15px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <button className="button-submit-PB" type="submit" disabled={loading}>
              {loading ? '⏳ Publicando...' : 'Publicar'}
            </button>
          </section>
        </form>
      </main>
    </>
  );
};

export default PublicacionPage;
