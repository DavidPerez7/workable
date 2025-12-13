import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../api/adminApi';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ users: 0, orders: 0, avgResponse: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      setLoading(true);
      const data = await dashboardAPI.getMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      console.error('Error loading metrics:', err);
      setError('Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <section><p>Cargando...</p></section>;

  return (
    <section>
      <h1 style={{ marginBottom: 16 }}>Dashboard técnico</h1>
      {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        <div style={cardStyle}>
          <div style={kpiLabel}>Total Usuarios</div>
          <div style={kpiNumber}>{metrics.users}</div>
        </div>

        <div style={cardStyle}>
          <div style={kpiLabel}>Total Órdenes</div>
          <div style={kpiNumber}>{metrics.orders}</div>
        </div>

        <div style={cardStyle}>
          <div style={kpiLabel}>Tiempo de respuesta (ms)</div>
          <div style={kpiNumber}>{metrics.avgResponse}</div>
        </div>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2>Rendimiento</h2>
        <p style={{ color: '#666' }}>Gráficos simples / placeholders (puedes integrar Chart.js o similar luego).</p>
        <div style={{ height: 160, borderRadius: 8, background: 'linear-gradient(90deg,#eef2ff,#fff)', display:'flex',alignItems:'center',justifyContent:'center',color:'#334155' }}>
          Gráfico de ejemplo
        </div>
      </section>
    </section>
  );
};

const cardStyle = {
  background: '#fff',
  padding: 16,
  borderRadius: 8,
  boxShadow: '0 6px 18px rgba(2,6,23,0.08)'
};

const kpiLabel = { color: '#6b7280', fontWeight: 700 };
const kpiNumber = { fontSize: 28, fontWeight: 800, marginTop: 8 };

export default Dashboard;
