// frontend/src/pages/ReclutadorPage/EditarOfertaPage/EditarOfertaPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import Footer from '../../../components/Footer/Footer';
import './EditarOfertaPage.css';

const EditarOfertaPage = () => {
  const { id } = useParams(); // Obtener oferta_id de la URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    requisitos: '',
    salario: '',
    beneficios: '',
    modalidad: '',
    tipoContrato: '',
    municipio: '',
    fechaCierre: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Listas para los selects (puedes moverlos a un archivo de constantes)
  const modalidades = [
    { id: 1, nombre: 'Presencial' },
    { id: 2, nombre: 'Remoto' },
    { id: 3, nombre: 'Híbrido' }
  ];

  const tiposContrato = [
    { id: 1, nombre: 'Tiempo completo' },
    { id: 2, nombre: 'Medio tiempo' },
    { id: 3, nombre: 'Contrato temporal' },
    { id: 4, nombre: 'Freelance' },
    { id: 5, nombre: 'Prácticas profesionales' }
  ];

  const municipios = [
    { id: 1, nombre: 'Bogotá D.C' },
    { id: 2, nombre: 'Medellín' },
    { id: 3, nombre: 'Bello' },
    { id: 4, nombre: 'Itagüí' },
    { id: 5, nombre: 'Envigado' },
    { id: 6, nombre: 'Rionegro' }
  ];

  // Cargar datos de la oferta al montar el componente
  useEffect(() => {
    const fetchOferta = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Debes iniciar sesión como reclutador');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/ofertas/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          alert('Sesión expirada. Por favor inicia sesión nuevamente.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (response.status === 403) {
          alert('No tienes permiso para editar esta oferta');
          navigate('/reclutador/gestionar-ofertas');
          return;
        }

        if (!response.ok) {
          throw new Error('Error al cargar la oferta');
        }

        const data = await response.json();
        
        // Mapear datos de la API al formato del formulario
        setFormData({
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          requisitos: data.requisitos || '',
          salario: data.salario || '',
          beneficios: data.beneficios || '',
          modalidad: data.modalidad_id?.toString() || '',
          tipoContrato: data.tipo_contrato_id?.toString() || '',
          municipio: data.municipio_id?.toString() || '',
          fechaCierre: data.fecha_cierre ? data.fecha_cierre.split('T')[0] : ''
        });

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar oferta:', error);
        setError('Error al cargar la oferta. Por favor intenta nuevamente.');
        setLoading(false);
      }
    };

    fetchOferta();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Debes iniciar sesión como reclutador');
      navigate('/login');
      return;
    }

    // Preparar datos para enviar a la API
    const dataToSend = {
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
      requisitos: formData.requisitos.trim(),
      salario: formData.salario ? parseFloat(formData.salario) : null,
      beneficios: formData.beneficios.trim() || null,
      modalidad_id: parseInt(formData.modalidad),
      tipo_contrato_id: parseInt(formData.tipoContrato),
      municipio_id: parseInt(formData.municipio),
      fecha_cierre: formData.fechaCierre || null
    };

    try {
      const response = await fetch(`http://localhost:5000/api/ofertas/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (response.status === 403) {
        alert('No tienes permiso para editar esta oferta');
        navigate('/reclutador/gestionar-ofertas');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar oferta');
      }

      alert('✅ Oferta actualizada exitosamente');
      navigate('/reclutador/gestionar-ofertas');
    } catch (error) {
      console.error('Error al actualizar oferta:', error);
      setError(error.message || 'Error al actualizar la oferta. Por favor intenta nuevamente.');
      setSubmitting(false);
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <main className="container-main-editar-oferta">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando datos de la oferta...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Mostrar error si hubo problema al cargar
  if (error && !loading) {
    return (
      <>
        <HeaderReclutador />
        <main className="container-main-editar-oferta">
          <div className="error-container">
            <h2>Error al cargar la oferta</h2>
            <p>{error}</p>
            <Link to="/reclutador/gestionar-ofertas" className="btn-volver">
              Volver a Gestionar Ofertas
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      
      <main className="container-main-editar-oferta">
        <h1 className="title-page-editar">Editar Oferta Laboral</h1>
        
        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="form-editar-oferta">
          
          {/* Sección: Datos Principales */}
          <section className="section-card-editar">
            <h2 className="section-title-editar">Datos Principales</h2>

            <div className="form-group-editar">
              <label htmlFor="titulo">Título de la Oferta *</label>
              <input
                id="titulo"
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Desarrollador Full Stack"
                required
                aria-required="true"
                aria-describedby="titulo-help"
                disabled={submitting}
              />
              <span id="titulo-help" className="help-text">
                Escribe un título claro y descriptivo
              </span>
            </div>

            <div className="form-group-editar">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="5"
                placeholder="Describe las responsabilidades y actividades del puesto..."
                required
                aria-required="true"
                disabled={submitting}
              />
            </div>

            <div className="form-group-editar">
              <label htmlFor="requisitos">Requisitos *</label>
              <textarea
                id="requisitos"
                name="requisitos"
                value={formData.requisitos}
                onChange={handleChange}
                rows="5"
                placeholder="Ejemplo: 2 años de experiencia en React, conocimiento de APIs REST..."
                required
                aria-required="true"
                disabled={submitting}
              />
            </div>
          </section>

          {/* Sección: Condiciones Laborales */}
          <section className="section-card-editar">
            <h2 className="section-title-editar">Condiciones Laborales</h2>

            <div className="form-row-editar">
              <div className="form-group-editar">
                <label htmlFor="salario">Salario (COP)</label>
                <input
                  id="salario"
                  type="number"
                  name="salario"
                  value={formData.salario}
                  onChange={handleChange}
                  placeholder="3000000"
                  min="0"
                  disabled={submitting}
                />
              </div>

              <div className="form-group-editar">
                <label htmlFor="fechaCierre">Fecha de Cierre</label>
                <input
                  id="fechaCierre"
                  type="date"
                  name="fechaCierre"
                  value={formData.fechaCierre}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group-editar">
              <label htmlFor="beneficios">Beneficios</label>
              <textarea
                id="beneficios"
                name="beneficios"
                value={formData.beneficios}
                onChange={handleChange}
                rows="3"
                placeholder="Ej: Seguro médico, bonos, teletrabajo..."
                disabled={submitting}
              />
            </div>

            <div className="form-row-editar">
              <div className="form-group-editar">
                <label htmlFor="modalidad">Modalidad *</label>
                <select
                  id="modalidad"
                  name="modalidad"
                  value={formData.modalidad}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  disabled={submitting}
                >
                  <option value="">Selecciona modalidad</option>
                  {modalidades.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-editar">
                <label htmlFor="tipoContrato">Tipo de Contrato *</label>
                <select
                  id="tipoContrato"
                  name="tipoContrato"
                  value={formData.tipoContrato}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  disabled={submitting}
                >
                  <option value="">Selecciona tipo de contrato</option>
                  {tiposContrato.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-editar">
              <label htmlFor="municipio">Municipio *</label>
              <select
                id="municipio"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                required
                aria-required="true"
                disabled={submitting}
              >
                <option value="">Selecciona municipio</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>
                    {mun.nombre}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Botones de Acción */}
          <div className="form-actions-editar">
            <Link 
              to="/reclutador/gestionar-ofertas" 
              className={`btn-cancelar-editar ${submitting ? 'disabled' : ''}`}
              aria-label="Cancelar edición y volver a gestionar ofertas"
              onClick={(e) => {
                if (submitting) {
                  e.preventDefault();
                  return false;
                }
              }}
            >
              Cancelar
            </Link>
            <button 
              type="submit" 
              className="btn-guardar-editar"
              aria-label="Guardar cambios de la oferta"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
};

export default EditarOfertaPage;