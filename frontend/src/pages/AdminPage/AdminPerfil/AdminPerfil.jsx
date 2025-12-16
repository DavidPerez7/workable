import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import administradorAPI from '../../../api/administradorAPI';
import { logout } from '../../../api/authApi';
import './AdminPerfil.css';

export default function AdminPerfil() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAdminProfile();
  }, []);

  const loadAdminProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const usuarioId = localStorage.getItem('usuarioId');
      if (!usuarioId) {
        setError('No se encontró ID de usuario');
        return;
      }
      const data = await administradorAPI.get(usuarioId);
      setAdminData(data);
      setFormData(data);
    } catch (err) {
      console.error('Error loading admin profile:', err);
      setError('Error al cargar el perfil: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const usuarioId = localStorage.getItem('usuarioId');
      await administradorAPI.update(usuarioId, formData);
      setAdminData(formData);
      setEditing(false);
      setSuccess('Perfil actualizado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Error al guardar: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  const handleCancel = () => {
    setFormData(adminData);
    setEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="admin-perfil-wrapper">
        <div className="loading-state">Cargando perfil...</div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="admin-perfil-wrapper">
        <div className="error-state">Error: No se pudo cargar el perfil</div>
      </div>
    );
  }

  return (
    <div className="admin-perfil-wrapper">
      <div className="perfil-container">
        <div className="perfil-header">
          <h1>Mi Perfil</h1>
          <p className="subtitle">Administrador del Sistema</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="perfil-content">
          <div className="profile-section">
            <div className="section-header">
              <h2>Información Personal</h2>
              {!editing && (
                <button className="btn-edit" onClick={() => setEditing(true)}>
                  ✏️ Editar
                </button>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre || ''}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={editing ? 'editable' : ''}
                />
              </div>

              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido || ''}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={editing ? 'editable' : ''}
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={editing ? 'editable' : ''}
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono || ''}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={editing ? 'editable' : ''}
                />
              </div>

              {formData.municipio && (
                <div className="form-group">
                  <label>Municipio</label>
                  <input
                    type="text"
                    value={formData.municipio.nombre || ''}
                    disabled
                  />
                </div>
              )}

              <div className="form-group">
                <label>Rol</label>
                <input
                  type="text"
                  value="Administrador"
                  disabled
                />
              </div>
            </div>

            {editing && (
              <div className="form-actions">
                <button
                  className="btn-save"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  ❌ Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="profile-section session-section">
            <div className="section-header">
              <h2>Sesión</h2>
            </div>

            <div className="session-info">
              <p>Estás conectado como administrador del sistema Workable.</p>
              <button
                className="btn-logout"
                onClick={handleLogout}
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
