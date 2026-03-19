import React, { useEffect, useState } from 'react';
import { getAllOfertas } from '../../../api/ofertasAPI';
import { obtenerPostulacionesPorOferta } from '../../../api/postulacionesAPI';
import aspirantesApi from '../../../api/aspirantesApi';
import reclutadoresApi from '../../../api/reclutadoresApi';
import administradorAPI from '../../../api/administradorAPI';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [summary, setSummary] = useState({
    aspirantes: 0,
    reclutadores: 0,
    administradores: 0,
    ofertas: 0,
    postulaciones: 0,
    pendientes: 0,
    aceptadas: 0,
  });
  const [recentPostulaciones, setRecentPostulaciones] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const [aspirantes, reclutadores, administradores, ofertas] = await Promise.all([
        aspirantesApi.getAll().catch(() => []),
        reclutadoresApi.getAll().catch(() => []),
        administradorAPI.getAll().catch(() => []),
        getAllOfertas().catch(() => []),
      ]);

      const postulacionesPorOferta = await Promise.all(
        ofertas.map(async (oferta) => {
          try {
            return await obtenerPostulacionesPorOferta(oferta.id, localStorage.getItem('usuarioId'));
          } catch {
            return [];
          }
        })
      );

      const postulaciones = postulacionesPorOferta.flat();
      setSummary({
        aspirantes: aspirantes.length,
        reclutadores: reclutadores.length,
        administradores: administradores.length,
        ofertas: ofertas.length,
        postulaciones: postulaciones.length,
        pendientes: postulaciones.filter((item) => item.estado === 'PENDIENTE').length,
        aceptadas: postulaciones.filter((item) => item.estado === 'ACEPTADO').length,
      });
      setRecentPostulaciones(postulaciones.slice(0, 5));
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el tablero');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <section className="dashboard-shell"><p className="dashboard-state">Cargando tablero...</p></section>;
  }

  const cards = [
    { label: 'Aspirantes', value: summary.aspirantes },
    { label: 'Reclutadores', value: summary.reclutadores },
    { label: 'Administradores', value: summary.administradores },
    { label: 'Ofertas', value: summary.ofertas },
    { label: 'Postulaciones', value: summary.postulaciones },
    { label: 'Aceptadas', value: summary.aceptadas },
  ];

  return (
    <section className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Vista simple del estado general</p>
          {lastUpdated && <p className="dashboard-meta">Actualizado: {lastUpdated.toLocaleString()}</p>}
        </div>
        <div className="quick-actions">
          <button className="btn-quick" onClick={loadDashboard}>Refrescar</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <article key={card.label} className="summary-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-panels">
        <article className="panel">
          <h2>Resumen rápido</h2>
          <div className="mini-list">
            <div>Aspirantes: {summary.aspirantes}</div>
            <div>Reclutadores: {summary.reclutadores}</div>
            <div>Postulaciones pendientes: {summary.pendientes}</div>
          </div>
        </article>

        <article className="panel">
          <h2>Postulaciones recientes</h2>
          {recentPostulaciones.length > 0 ? (
            <div className="mini-list">
              {recentPostulaciones.map((item) => (
                <div key={item.id} className="list-row">
                  <strong>#{item.id}</strong>
                  <span>{item.aspirante?.nombre || 'Aspirante'} · {item.oferta?.titulo || 'Oferta'}</span>
                  <small>{item.estado}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-state">No hay postulaciones para mostrar.</p>
          )}
        </article>
      </div>

      {error && <p className="error-message">{error}</p>}
    </section>
  );
};

export default Dashboard;
