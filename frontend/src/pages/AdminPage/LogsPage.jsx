import React, { useEffect, useState } from 'react';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      setLoading(true);
      // Simular carga de logs (sin endpoint específico en backend)
      // En producción, puedes conectar a un endpoint real como GET /api/logs
      console.log('fetchLogs -> GET /api/logs (simulated - sin endpoint en backend)');
      setLogs([
        { id: 1, date: '2025-12-10 14:30', user: 'admin@workable.com', action: 'LOGIN', desc: 'Inicio de sesión exitoso' },
        { id: 2, date: '2025-12-10 14:45', user: 'admin@workable.com', action: 'CREATE_USER', desc: 'Creó nuevo usuario' },
        { id: 3, date: '2025-12-09 09:15', user: 'admin@workable.com', action: 'UPDATE_PRODUCT', desc: 'Actualizó oferta laboral' }
      ]);
      setError(null);
    } catch (err) {
      console.error('Error loading logs:', err);
      setError('Error al cargar logs');
    } finally {
      setLoading(false);
    }
  }

  const filtered = logs.filter((l) => {
    if (query && !`${l.user} ${l.action} ${l.desc}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (date && !l.date.startsWith(date)) return false;
    return true;
  });

  if (loading) return <section><p>Cargando logs...</p></section>;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Logs y Auditoría</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#374151' }}>Filtro por fecha</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />
          </label>
        </div>
      </div>

      {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}

      <div style={{ marginTop: 12, marginBottom: 12, display: 'flex', gap: 8 }}>
        <input placeholder="Buscar por usuario, acción o descripción" value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', flex: 1 }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: 8 }}>Fecha/Hora</th>
              <th style={{ padding: 8 }}>Usuario</th>
              <th style={{ padding: 8 }}>Acción</th>
              <th style={{ padding: 8 }}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} style={{ borderTop: '1px solid #eef2ff' }}>
                <td style={{ padding: 8 }}>{l.date}</td>
                <td style={{ padding: 8 }}>{l.user}</td>
                <td style={{ padding: 8 }}>{l.action}</td>
                <td style={{ padding: 8 }}>{l.desc}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} style={{ padding: 12, color: '#6b7280' }}>No hay registros</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const input = { padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' };

export default LogsPage;
