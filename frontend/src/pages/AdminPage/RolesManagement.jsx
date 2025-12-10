import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminApi';

const RolesManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      setLoading(true);
      const data = await adminAPI.getAll();
      setAdmins(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <section><p>Cargando administradores...</p></section>;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Roles y Administradores</h1>
      </div>

      {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}

      <div style={{ marginTop: 12 }}>
        <table style={{ width: '100%', background: '#fff', borderRadius: 8 }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: 8 }}>ID</th>
              <th style={{ padding: 8 }}>Nombre</th>
              <th style={{ padding: 8 }}>Email</th>
              <th style={{ padding: 8 }}>Activo</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid #eef2ff' }}>
                <td style={{ padding: 8 }}>{r.id}</td>
                <td style={{ padding: 8 }}>{r.nombre}</td>
                <td style={{ padding: 8 }}>{r.correo}</td>
                <td style={{ padding: 8 }}>{r.isActive ? '✓' : '✗'}</td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 12, color: '#6b7280' }}>No hay administradores</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RolesManagement;
