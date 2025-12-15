import React, { useState, useEffect } from 'react';
import { getAllNotificaciones, crearNotificacion, marcarNotificacionLeida, eliminarNotificacion } from '../../../api/notificacionAPI';
import aspirantesApi from '../../../api/aspirantesApi';
import reclutadoresApi from '../../../api/reclutadoresApi';
import '../AdminEmpresas/AdminEmpresas.css';
import './AdminNotificaciones.css';

function AdminNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  
  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotificacion, setSelectedNotificacion] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    tipo: 'MENSAJE',
    titulo: '',
    mensaje: '',
    url: '',
    aspiranteId: null,
    reclutadorId: null
  });

  const tiposNotificacion = ['POSTULACION', 'ENTREVISTA', 'CAMBIO_ESTADO', 'MENSAJE'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notificacionesData, aspirantesData, reclutadoresData] = await Promise.all([
        getAllNotificaciones(),
        aspirantesApi.getAll(),
        reclutadoresApi.getAll()
      ]);
      setNotificaciones(notificacionesData);
      // Combinar aspirantes y reclutadores en un solo array de usuarios
      const todosUsuarios = [
        ...aspirantesData.map(a => ({...a, rol: 'ASPIRANTE'})),
        ...reclutadoresData.map(r => ({...r, rol: 'RECLUTADOR'}))
      ];
      setUsuarios(todosUsuarios);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const notificacionesFiltradas = notificaciones.filter(notif => {
    const searchLower = busqueda.toLowerCase();
    const cumpleBusqueda = notif.titulo?.toLowerCase().includes(searchLower) || notif.mensaje?.toLowerCase().includes(searchLower);
    const cumpleTipo = filtroTipo === 'todos' || notif.tipo === filtroTipo;
    return cumpleBusqueda && cumpleTipo;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await crearNotificacion(formData);
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error al crear notificación:', err);
      alert('Error al crear notificación');
    }
  };

  const handleMarcarLeida = async (id) => {
    try {
      await marcarNotificacionLeida(id);
      fetchData();
    } catch (err) {
      console.error('Error al marcar como leída:', err);
      alert('Error al marcar como leída');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta notificación?')) {
      try {
        await eliminarNotificacion(id, 1);
        fetchData();
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar notificación');
      }
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openViewModal = (notif) => {
    setSelectedNotificacion(notif);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      tipo: 'MENSAJE',
      titulo: '',
      mensaje: '',
      url: '',
      aspiranteId: null,
      reclutadorId: null
    });
  };

  if (loading) return <div className="container-admin-page-AP"><p>Cargando...</p></div>;
  if (error) return <div className="container-admin-page-AP"><p>{error}</p></div>;

  return (
    <div className="container-admin-page-AP">
      <div className="header-admin-empresas-AE">
        <h1>Gestión de Notificaciones</h1>
        <button className="btn-crear-AE" onClick={openCreateModal}>+ Nueva Notificación</button>
      </div>

      <div className="filters-AE">
        <input
          type="text"
          placeholder="Buscar notificación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input-AE"
        />
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="filter-select-AE">
          <option value="todos">Todos los tipos</option>
          {tiposNotificacion.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      <div className="table-container-AE">
        <table className="empresas-table-AE">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Título</th>
              <th>Usuario</th>
              <th>Leída</th>
              <th>Activa</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {notificacionesFiltradas.map(notif => (
              <tr key={notif.id}>
                <td>{notif.id}</td>
                <td><span className={`badge-tipo-${notif.tipo?.toLowerCase().replace(/\s+/g, '_')}`}>{notif.tipo}</span></td>
                <td>{notif.titulo}</td>
                <td>{notif.aspirante?.nombre || notif.reclutador?.nombre || 'N/A'}</td>
                <td>{notif.leida ? '✅' : '❌'}</td>
                <td>{notif.isActive ? '✅' : '❌'}</td>
                <td>{notif.fechaCreacion}</td>
                <td className="actions-cell-AE">
                  <button className="btn-ver-AE" onClick={() => openViewModal(notif)}>Ver</button>
                  {!notif.leida && (
                    <button className="btn-editar-AE" onClick={() => handleMarcarLeida(notif.id)}>Marcar Leída</button>
                  )}
                  <button className="btn-eliminar-AE" onClick={() => handleDelete(notif.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREATE */}
      {showCreateModal && (
        <div className="modal-overlay-AE" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content-AE" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-AE">
              <h2>Crear Notificación</h2>
              <button className="modal-close-AE" onClick={() => setShowCreateModal(false)}>✖</button>
            </div>
            <form onSubmit={handleCreate} className="modal-form-AE">
              <div className="form-group-AE">
                <label className="form-field-label">Tipo *</label>
                <select required value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="form-field-select">
                  {tiposNotificacion.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Título *</label>
                <input type="text" required maxLength="50" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} className="form-field-input" />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Mensaje *</label>
                <textarea required maxLength="500" value={formData.mensaje} onChange={(e) => setFormData({...formData, mensaje: e.target.value})} className="form-field-textarea" />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">URL (opcional)</label>
                <input type="text" maxLength="500" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="form-field-input" />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Destinatario (Usuario)</label>
                <select onChange={(e) => {
                  const userId = e.target.value;
                  const user = usuarios.find(u => u.id === parseInt(userId));
                  if (user?.rol === 'ASPIRANTE') {
                    setFormData({...formData, aspiranteId: userId, reclutadorId: null});
                  } else if (user?.rol === 'RECLUTADOR') {
                    setFormData({...formData, reclutadorId: userId, aspiranteId: null});
                  }
                }} className="form-field-select">
                  <option value="">Seleccionar...</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} {u.apellido} ({u.rol})</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions-AE">
                <button type="button" className="btn-cancelar-AE" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn-guardar-AE">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VIEW */}
      {showViewModal && selectedNotificacion && (
        <div className="modal-overlay-AE" onClick={() => setShowViewModal(false)}>
          <div className="modal-content-AE" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-AE">
              <h2>Detalles de Notificación #{selectedNotificacion.id}</h2>
              <button className="modal-close-AE" onClick={() => setShowViewModal(false)}>✖</button>
            </div>
            <div className="modal-body-AE">
              <p><strong>Tipo:</strong> {selectedNotificacion.tipo}</p>
              <p><strong>Título:</strong> {selectedNotificacion.titulo}</p>
              <p><strong>Mensaje:</strong> {selectedNotificacion.mensaje}</p>
              <p><strong>URL:</strong> {selectedNotificacion.url || 'N/A'}</p>
              <p><strong>Leída:</strong> {selectedNotificacion.leida ? 'Sí' : 'No'}</p>
              <p><strong>Activa:</strong> {selectedNotificacion.isActive ? 'Sí' : 'No'}</p>
              <p><strong>Fecha Creación:</strong> {selectedNotificacion.fechaCreacion}</p>
            </div>
            <div className="modal-actions-AE">
              <button className="btn-cancelar-AE" onClick={() => setShowViewModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotificaciones;
