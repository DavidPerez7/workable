import React, { useEffect, useState } from 'react';
import { dashboardAPI, logsAPI } from '../../../api/adminApi';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ users: 0, orders: 0, avgResponse: 0 });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadMetrics();
    loadLogs();
  }, []);

  async function loadMetrics() {
    try {
      setLoading(true);
      const data = await dashboardAPI.getMetrics();
      setMetrics(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error loading metrics:', err);
      setError('Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  }

  async function loadLogs() {
    try {
      const data = await logsAPI.getLogs();
      setLogs(data || []);
    } catch (e) {
      console.warn('Error loading logs', e);
    }
  }

  // Send frontend errors to backend logs endpoint
  useEffect(() => {
    const postLog = async (payload) => {
      try { await logsAPI.postLog(payload); } catch(e) { console.warn(e); }
    };

    const onError = (event) => {
      postLog({ level: 'ERROR', source: 'FRONTEND', message: event.message || 'Error', details: event.filename + ':' + event.lineno });
      loadLogs();
    };

    const onRejection = (ev) => {
      const reason = ev.reason ? (ev.reason.message || JSON.stringify(ev.reason)) : 'Unhandled rejection';
      postLog({ level: 'ERROR', source: 'FRONTEND', message: reason, details: JSON.stringify(ev) });
      loadLogs();
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  if (loading) return <section className="dashboard-wrapper"><p>Cargando...</p></section>;

  // derive totals (backward-compatible with older `users`/`orders` fields)
  const totalUsers = (metrics.totalAspirantes || 0) + (metrics.totalReclutadores || 0) + (metrics.totalAdministradores || 0) || metrics.users || 0;
  const totalOrders = metrics.totalOfertas || metrics.orders || 0;

  return (
    <section className="dashboard-wrapper">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard técnico</h1>
          {lastUpdated && <div className="dashboard-subtitle">Última actualización: {lastUpdated.toLocaleString()}</div>}
        </div>
        <div className="quick-actions">
          <button className="btn-quick" onClick={loadMetrics}>Refrescar</button>
          <button className="btn-quick secondary" onClick={() => setLogs([])}>Limpiar vista</button>
        </div>
      </div>

      {/* Highlights */}
      <div className="highlights-grid">
        <div className="highlight-card">
          <div className="title">Entidades</div>
          <div className="value">{Object.values(metrics.byEntity || {}).reduce((s, v) => s + (v || 0), 0)}</div>
          <div className="subtext">Suma de todas las entidades</div>
        </div>
        <div className="highlight-card">
          <div className="title">Logs recientes</div>
          <div className="value">{logs.length}</div>
          <div className="subtext">Entradas en memoria</div>
        </div>
      </div>

      <section className="section">
        <div className="section-title">Usuarios</div>
        <div className="section-grid">
          <div className="kpi-card accent"><div className="kpi-label">Aspirantes</div><div className="kpi-number">{(metrics.totalAspirantes ?? metrics.users) ?? 0}</div></div>
          <div className="kpi-card"><div className="kpi-label">Reclutadores</div><div className="kpi-number">{metrics.totalReclutadores ?? 0}</div></div>
          <div className="kpi-card"><div className="kpi-label">Administradores</div><div className="kpi-number">{metrics.totalAdministradores ?? 0}</div></div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">Negocio</div>
        <div className="section-grid">
          <div className="kpi-card accent"><div className="kpi-label">Empresas</div><div className="kpi-number">{metrics.totalEmpresas ?? 0}</div></div>
          <div className="kpi-card"><div className="kpi-label">Ofertas</div><div className="kpi-number">{metrics.totalOfertas ?? 0}</div></div>
          <div className="kpi-card"><div className="kpi-label">Postulaciones</div><div className="kpi-number">{metrics.totalPostulaciones ?? 0}</div></div>
          <div className="kpi-card"><div className="kpi-label">Estudios</div><div className="kpi-number">{metrics.totalEstudios ?? 0}</div></div>
          <div className="kpi-card"><div className="kpi-label">Experiencias</div><div className="kpi-number">{metrics.totalExperiencias ?? 0}</div></div>
          <div className="kpi-card"><div className="kpi-label">Habilidades</div><div className="kpi-number">{metrics.totalHabilidades ?? 0}</div></div>
          <div className="kpi-card"><div className="kpi-label">Notificaciones</div><div className="kpi-number">{metrics.totalNotificaciones ?? 0}</div></div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">Logs recientes</div>
        <div className="section-body">
          {logs.length === 0 ? (
            <div className="placeholder">No hay logs recientes</div>
          ) : (
            <div className="logs-list">
              {logs.slice(0,50).map((l, idx) => (
                <div key={idx} className={"log-entry " + (l.level ? l.level.toLowerCase() : '')}>
                  <div className="meta">{l.level} · {l.source} · {new Date(l.timestamp).toLocaleString()}</div>
                  <div className="message">{l.message}</div>
                  {l.details && <div className="details">{l.details}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-title">Rendimiento</div>
        <p className="placeholder">Gráficos simples / placeholders (puedes integrar Chart.js o similar luego).</p>
        <div className="chart-placeholder">Gráfico de ejemplo</div>
      </section>
    </section>
  );
};

// Styles moved to Dashboard.css

export default Dashboard;
