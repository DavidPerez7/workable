// frontend/src/pages/ReclutadorPage/GestionarOfertasPage/GestionarOfertasPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOfertasPorEmpresa, eliminarOferta } from '../../../api/ofertasAPI';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import './GestionarOfertasPage.css';

const GestionarOfertasPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar ofertas del reclutador autenticado
  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const empresaId = localStorage.getItem('empresaId');
        
        if (!empresaId) {
          setError('No se encontró el ID de la empresa. Por favor, inicia sesión nuevamente.');
          setLoading(false);
          return;
        }

        console.log('🔄 Cargando ofertas de la empresa:', empresaId);
        const data = await getOfertasPorEmpresa(empresaId);
        console.log('✅ Ofertas cargadas:', data);
        setOfertas(data);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error al cargar ofertas:', error);
        setError(error.message || 'Error al cargar ofertas');
        setLoading(false);
      }
    };
    fetchOfertas();
  }, []);

  const handleEditar = (id) => {
    navigate(`/reclutador/editar-oferta/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta oferta? Esta acción no se puede deshacer.');
    
    if (confirmacion) {
      try {
        await eliminarOferta(id);
        alert('Oferta eliminada exitosamente');
        // Recargar ofertas
        setOfertas(ofertas.filter(oferta => oferta.id !== id));
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar oferta: ' + error.message);
      }
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificado';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <main className="container-main-gestion">
          <div className="loading-message">
            <p>⏳ Cargando ofertas...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderReclutador />
        <main className="container-main-gestion">
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />

      <main className="container-main-gestion">
        <h1 className="title-page">Gestionar Ofertas Laborales</h1>

        <section className="section-card">
          {ofertas.length === 0 ? (
            <div className="no-ofertas">
              <p>No tienes ofertas publicadas.</p>
              <Link to="/reclutador/publicacion" className="btn-publicar">
                Publicar primera oferta
              </Link>
            </div>
          ) : (
            <table className="tabla-gestion-ofertas" role="table" aria-label="Tabla de ofertas laborales">
              <thead>
                <tr>
                  <th scope="col">Título</th>
                  <th scope="col">Ubicación</th>
                  <th scope="col">Modalidad</th>
                  <th scope="col">Fecha publicación</th>
                  <th scope="col">Fecha límite</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ofertas.map((oferta) => (
                  <tr key={oferta.id}>
                    <td>{oferta.titu}</td>
                    <td>{oferta.ubi}</td>
                    <td>{oferta.modalNomb}</td>
                    <td>{formatearFecha(oferta.fechaPub)}</td>
                    <td>{formatearFecha(oferta.fechLim)}</td>
                    <td>
                      <button 
                        className="btn-editar" 
                        onClick={() => handleEditar(oferta.id)}
                        aria-label={`Editar oferta ${oferta.titu}`}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-eliminar" 
                        onClick={() => handleEliminar(oferta.id)}
                        aria-label={`Eliminar oferta ${oferta.titu}`}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <Link to="/reclutador" className="link-goback">Volver al panel</Link>
      </main>
    </>
  );
};

export default GestionarOfertasPage;