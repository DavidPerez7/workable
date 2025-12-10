import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/footer';
import { userAPI } from '../../../api/adminApi';
import './UsersManagePage.css';

function UsersManagePage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [aspirantes, setAspirantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', correo: '', telefono: '', password: '', fechaNacimiento: '', genero: '', numeroDocumento: '', tipoDocumento: 'CC', descripcion: '' });

  useEffect(() => { fetchAspirantes(); }, []);

  async function fetchAspirantes() {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAll();
      const aspirantesData = data.map((user) => ({
        aspiranteId: user.id,
        nombre: `${user.nombre} ${user.apellido || ''}`.trim(),
        correo: user.correo,
        telefono: user.telefono || 'N/A',
        documento: user.numeroDocumento || 'N/A',
        tipoDocumento: user.tipoDocumento || 'C.C',
        ubicacion: user.municipio?.nombre || 'N/A',
        estadoCuenta: user.isActive ? 'Activo' : 'Inactivo',
        fechaRegistro: user.fechaRegistro?.split('T')[0] || 'N/A',
        postulaciones: 0,
        experiencia: 'N/A',
        nombre_original: user.nombre,
        apellido_original: user.apellido || ''
      }));
      setAspirantes(aspirantesData);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar aspirantes');
    } finally {
      setLoading(false);
    }
  }

  const aspirantesFiltrados = aspirantes.filter(a => {
    const cumpleFiltro = filtroEstado === 'todos' || a.estadoCuenta === filtroEstado;
    const cumpleBusqueda = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) || a.correo.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  const handleCrear = () => { setEditingUser(null); setFormData({ nombre: '', apellido: '', correo: '', telefono: '', password: '', fechaNacimiento: '', genero: '', numeroDocumento: '', tipoDocumento: 'CC', descripcion: '' }); setShowModal(true); };
  const handleEditar = (asp) => { setEditingUser(asp); setFormData({ nombre: asp.nombre_original, apellido: asp.apellido_original, correo: asp.correo, telefono: asp.telefono === 'N/A' ? '' : asp.telefono, password: '', fechaNacimiento: '', genero: '', numeroDocumento: asp.documento !== 'N/A' ? asp.documento : '', tipoDocumento: asp.tipoDocumento || 'CC', descripcion: '' }); setShowModal(true); };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.correo.includes('@')) {
      setError('Campos requeridos inválidos');
      return;
    }
    if (!editingUser && !formData.password) { setError('Contraseña obligatoria'); return; }

    try {
      const payload = { 
        nombre: formData.nombre, 
        apellido: formData.apellido, 
        correo: formData.correo, 
        telefono: formData.telefono || null,
        fechaNacimiento: formData.fechaNacimiento || '1990-01-01',
        genero: formData.genero,
        numeroDocumento: formData.numeroDocumento || null,
        tipoDocumento: formData.tipoDocumento || 'CC',
        descripcion: formData.descripcion || null
      };
      if (!editingUser) {
        payload.password = formData.password;
        const newUser = await userAPI.create(payload);
        fetchAspirantes();
      } else {
        await userAPI.update(editingUser.aspiranteId, payload);
        fetchAspirantes();
      }
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error detail:', err.response?.data);
      setError('Error al guardar: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleActivar = async (id) => {
    try { await userAPI.activate(id); fetchAspirantes(); } catch (err) { setError('Error al activar'); }
  };

  const handleDesactivar = async (id) => {
    if (!window.confirm('¿Desactivar usuario?')) return;
    try { await userAPI.deactivate(id); fetchAspirantes(); } catch (err) { setError('Error al desactivar'); }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar usuario? No se puede deshacer.')) return;
    try { await userAPI.delete(id); fetchAspirantes(); } catch (err) { setError('Error al eliminar'); }
  };

  const getEstadoBadgeClass = (estado) => estado === 'Activo' ? 'badge-activo-UMP' : 'badge-inactivo-UMP';

  return (
    <>
      <HeaderAdmin />
      <main className="main-users-manage-UMP">
        <div className="container-users-manage-UMP">
          <div className="header-section-UMP">
            <div>
              <h1 className="title-users-UMP">Gestión de Aspirantes</h1>
              <p className="subtitle-users-UMP">Administra las cuentas de aspirantes</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-back-UMP" onClick={handleCrear} style={{ background: '#10b981' }}>+ Crear Usuario</button>
              <button className="btn-back-UMP" onClick={() => navigate('/Administrador')}>← Volver al Panel</button>
            </div>
          </div>

          {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Cargando...</div>
          ) : (
            <>
              <div className="stats-section-UMP">
                <div className="stat-card-UMP stat-total-UMP">
                  <div className="stat-icon-UMP">👥</div>
                  <div><div className="stat-number-UMP">{aspirantes.length}</div><div className="stat-label-UMP">Total Aspirantes</div></div>
                </div>
                <div className="stat-card-UMP stat-activos-UMP">
                  <div className="stat-icon-UMP">✅</div>
                  <div><div className="stat-number-UMP">{aspirantes.filter(a => a.estadoCuenta === 'Activo').length}</div><div className="stat-label-UMP">Activos</div></div>
                </div>
                <div className="stat-card-UMP stat-inactivos-UMP">
                  <div className="stat-icon-UMP">⏸️</div>
                  <div><div className="stat-number-UMP">{aspirantes.filter(a => a.estadoCuenta === 'Inactivo').length}</div><div className="stat-label-UMP">Inactivos</div></div>
                </div>
                <div className="stat-card-UMP stat-postulaciones-UMP">
                  <div className="stat-icon-UMP">📝</div>
                  <div><div className="stat-number-UMP">{aspirantes.reduce((sum, a) => sum + a.postulaciones, 0)}</div><div className="stat-label-UMP">Postulaciones</div></div>
                </div>
              </div>

              <div className="filters-section-UMP">
                <div className="search-box-UMP">
                  <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="search-input-UMP" />
                  <span className="search-icon-UMP">🔍</span>
                </div>
                <div className="filter-group-UMP">
                  <label className="filter-label-UMP">Estado:</label>
                  <div className="filter-buttons-UMP">
                    <button className={`filter-btn-UMP ${filtroEstado === 'todos' ? 'active' : ''}`} onClick={() => setFiltroEstado('todos')}>Todos</button>
                    <button className={`filter-btn-UMP ${filtroEstado === 'Activo' ? 'active' : ''}`} onClick={() => setFiltroEstado('Activo')}>Activos</button>
                    <button className={`filter-btn-UMP ${filtroEstado === 'Inactivo' ? 'active' : ''}`} onClick={() => setFiltroEstado('Inactivo')}>Inactivos</button>
                  </div>
                </div>
              </div>

              <div className="table-container-UMP">
                <table className="users-table-UMP">
                  <thead><tr><th>ID</th><th>Aspirante</th><th>Documento</th><th>Contacto</th><th>Ubicación</th><th>Experiencia</th><th>Postulaciones</th><th>Estado</th><th>Fecha Registro</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {aspirantesFiltrados.length > 0 ? (
                      aspirantesFiltrados.map(asp => (
                        <tr key={asp.aspiranteId}>
                          <td>{asp.aspiranteId}</td>
                          <td className="user-name-UMP">{asp.nombre}</td>
                          <td><div className="documento-info-UMP"><span className="tipo-doc-UMP">{asp.tipoDocumento}</span><span>{asp.documento}</span></div></td>
                          <td><div className="contact-info-UMP"><div>{asp.correo}</div><div className="phone-UMP">{asp.telefono}</div></div></td>
                          <td>{asp.ubicacion}</td>
                          <td className="experiencia-UMP">{asp.experiencia}</td>
                          <td className="postulaciones-count-UMP">{asp.postulaciones}</td>
                          <td><span className={`estado-badge-UMP ${getEstadoBadgeClass(asp.estadoCuenta)}`}>{asp.estadoCuenta}</span></td>
                          <td>{asp.fechaRegistro}</td>
                          <td>
                            <div className="actions-buttons-UMP">
                              <button className="btn-action-UMP btn-view-UMP" onClick={() => handleEditar(asp)} title="Editar">✏️</button>
                              {asp.estadoCuenta === 'Activo' ? (
                                <button className="btn-action-UMP btn-deactivate-UMP" onClick={() => handleDesactivar(asp.aspiranteId)} title="Desactivar">⏸️</button>
                              ) : (
                                <button className="btn-action-UMP btn-activate-UMP" onClick={() => handleActivar(asp.aspiranteId)} title="Activar">▶️</button>
                              )}
                              <button className="btn-action-UMP btn-delete-UMP" onClick={() => handleEliminar(asp.aspiranteId)} title="Eliminar">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="10" className="no-results-UMP">No hay resultados</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {showModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
              <form onSubmit={handleGuardar} style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <h2 style={{ marginTop: 0 }}>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Nombre *</label>
                    <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Apellido *</label>
                    <input type="text" value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} required />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Email *</label>
                  <input type="email" value={formData.correo} onChange={(e) => setFormData({...formData, correo: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box' }} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Género *</label>
                    <select value={formData.genero} onChange={(e) => setFormData({...formData, genero: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} required>
                      <option value="">Seleccionar...</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMENINO">Femenino</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Teléfono</label>
                    <input type="text" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Tipo Documento</label>
                    <select value={formData.tipoDocumento} onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                      <option value="CC">C.C</option>
                      <option value="PA">Pasaporte</option>
                      <option value="CE">C.E</option>
                      <option value="TI">T.I</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Número Documento</label>
                    <input type="text" value={formData.numeroDocumento} onChange={(e) => setFormData({...formData, numeroDocumento: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Descripción/Resumen</label>
                  <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} placeholder="Breve descripción del aspirante..." style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px' }} />
                </div>
                {!editingUser && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Fecha de Nacimiento (opcional)</label>
                    <input type="date" value={formData.fechaNacimiento} onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>
                )}
                {!editingUser && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Contraseña *</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box' }} required={!editingUser} />
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', border: 'none', borderRadius: '6px', background: '#f3f4f6', color: '#374151', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
                  <button type="submit" style={{ padding: '10px 16px', border: 'none', borderRadius: '6px', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>{editingUser ? 'Guardar Cambios' : 'Crear Usuario'}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default UsersManagePage;