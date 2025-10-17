import React from 'react';
import { Link } from 'react-router-dom';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import './GestigOferts.css';

const ofertasSimuladas = [
  {
    id: 1,
    titulo: 'Desarrollador Frontend',
    fecha: '2025-07-08',
    estado: 'Activa'
  },
  {
    id: 2,
    titulo: 'Analista de Datos',
    fecha: '2025-07-01',
    estado: 'Cerrada'
  }
];

const GestigOfertsPage = () => {

  const handleEditar = (id) => {
    alert(`Editar oferta con ID: ${id}`);
  };

  const handleEliminar = (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta oferta?');
    if (confirmacion) {
      alert(`Oferta con ID ${id} eliminada`);
    }
  };

  return (
    <>
      <HeaderReclutador />

      <main className="container-main-PB">
        <h1 className="title-page-PB">Gestionar Ofertas</h1>

        <section className="section-card-PB">
          {ofertasSimuladas.length === 0 ? (
            <p>No hay ofertas registradas.</p>
          ) : (
            <table className="tabla-gestion-ofertas">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Fecha publicación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ofertasSimuladas.map((oferta) => (
                  <tr key={oferta.id}>
                    <td>{oferta.titulo}</td>
                    <td>{oferta.fecha}</td>
                    <td>{oferta.estado}</td>
                    <td>
                      <button className="btn-editar" onClick={() => handleEditar(oferta.id)}>Editar</button>
                      <button className="btn-eliminar" onClick={() => handleEliminar(oferta.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
          <Link to="/Reclutador" className='link-goback-go'>Volver</Link>
      </main>
    </>
  );
};

export default GestigOfertsPage;
