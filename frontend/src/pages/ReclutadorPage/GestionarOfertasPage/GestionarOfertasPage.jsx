// frontend/src/pages/ReclutadorPage/GestionarOfertasPage/GestionarOfertasPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import './GestionarOfertasPage.css';

const GestionarOfertasPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar ofertas del reclutador autenticado
  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const response = await fetch('/api/ofertas/mis-ofertas', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setOfertas(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
        setLoading(false);
      }
    };
    fetchOfertas();
  }, []);

  const handleEditar = (id) => {
    navigate(`/reclutador/editar-oferta/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta oferta? Esta acción cambiará su estado a "Inactiva".');
    
    if (confirmacion) {
      try {
        const response = await fetch(`/api/ofertas/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          alert('Oferta eliminada exitosamente');
          // Recargar ofertas
          setOfertas(ofertas.filter(oferta => oferta.id !== id));
        } else {
          alert('Error al eliminar oferta');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar oferta');
      }
    }
  };

  if (loading) return <div>Cargando ofertas...</div>;

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
                  <th scope="col">Fecha publicación</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Postulaciones</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ofertas.map((oferta) => (
                  <tr key={oferta.id}>
                    <td>{oferta.titulo}</td>
                    <td>{new Date(oferta.fecha_publicacion).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${oferta.estado.toLowerCase()}`}>
                        {oferta.estado}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to={`/reclutador/postulaciones/${oferta.id}`}
                        className="link-postulaciones"
                        aria-label={`Ver postulaciones de ${oferta.titulo}`}
                      >
                        {oferta.num_postulaciones || 0} postulaciones
                      </Link>
                    </td>
                    <td>
                      <button 
                        className="btn-editar" 
                        onClick={() => handleEditar(oferta.id)}
                        aria-label={`Editar oferta ${oferta.titulo}`}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-eliminar" 
                        onClick={() => handleEliminar(oferta.id)}
                        aria-label={`Eliminar oferta ${oferta.titulo}`}
                      >
                        Eliminar
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