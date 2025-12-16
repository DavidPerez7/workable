import React, { useState, useEffect } from 'react';
import { obtenerPostulacionesPorOferta, actualizarPostulacion, eliminarPostulacion } from '../../../api/postulacionesAPI';
import { getAllOfertas } from '../../../api/ofertasAPI';
import aspirantesApi from '../../../api/aspirantesApi';
import './AdminPostulaciones.css';

export default function AdminPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [filtroOferta, setFiltroOferta] = useState('todas');
  const [processingId, setProcessingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [citacionFormOpen, setCitacionFormOpen] = useState(null);
  const [citacionForm, setCitacionForm] = useState({ fecha: '', hora: '', linkMeet: '', estadoCitacion: 'PENDIENTE' });
  const [editForm, setEditForm] = useState({ estado: '' });

  // Clear success messages after a short timeout
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 3500);
    return () => clearTimeout(t);
  }, [success]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ofertasData] = await Promise.all([getAllOfertas()]);
      setOfertas(ofertasData);

      // Cargar postulaciones de todas las ofertas
      const todasLasPostulaciones = [];
      for (const oferta of ofertasData) {
        try {
          const postulacionesData = await obtenerPostulacionesPorOferta(oferta.id, localStorage.getItem("usuarioId"));
          todasLasPostulaciones.push(...postulacionesData);
        } catch (err) {
          console.warn(`Error cargando postulaciones para oferta ${oferta.id}:`, err);
        }
      }
      setPostulaciones(todasLasPostulaciones);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta postulación?')) return;
    try {
      setProcessingId(id);
      await eliminarPostulacion(id);
      setPostulaciones(postulaciones.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      setError('Error al eliminar: ' + (err.message || ''));
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (postulacion) => {
    setEditingId(postulacion.id);
    setEditForm({ estado: postulacion.estado });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ estado: '' });
  };

  const handleSaveEdit = async () => {
    try {
      setProcessingId(editingId);
      const postulacionActualizada = {
        id: editingId,
        aspirante: postulaciones.find(p => p.id === editingId).aspirante,
        oferta: postulaciones.find(p => p.id === editingId).oferta,
        estado: editForm.estado
      };
      await actualizarPostulacion(postulacionActualizada);
      setPostulaciones(postulaciones.map(p =>
        p.id === editingId ? { ...p, estado: editForm.estado } : p
      ));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError('Error al actualizar: ' + (err.message || ''));
    } finally {
      setProcessingId(null);
    }
  };

  const handleAbrirFormularioCitacion = (postulacion) => {
    setCitacionFormOpen(postulacion.id);
    setCitacionForm({
      fecha: postulacion.citacionData?.fecha || '',
      hora: postulacion.citacionData?.hora || '',
      linkMeet: postulacion.citacionData?.linkMeet || '',
      estadoCitacion: postulacion.citacionData?.estadoCitacion || 'PENDIENTE'
    });
  };

  const handleCerrarFormularioCitacion = () => {
    setCitacionFormOpen(null);
    setCitacionForm({ fecha: '', hora: '', linkMeet: '', estadoCitacion: 'PENDIENTE' });
  };

  const handleGuardarCitacion = async () => {
    if (!citacionForm.fecha || !citacionForm.hora || !citacionForm.linkMeet) {
      setError('Completa todos los campos de la citación');
      return;
    }
    try {
      setProcessingId(citacionFormOpen);
      const postulacionActualizada = {
        id: citacionFormOpen,
        aspirante: postulaciones.find(p => p.id === citacionFormOpen).aspirante,
        oferta: postulaciones.find(p => p.id === citacionFormOpen).oferta,
        estado: 'ENTREVISTA_PROGRAMADA',
        citacionData: citacionForm
      };
      await actualizarPostulacion(postulacionActualizada);
      setPostulaciones(postulaciones.map(p =>
        p.id === citacionFormOpen ? { ...p, estado: 'ENTREVISTA_PROGRAMADA', citacionData: citacionForm } : p
      ));
      handleCerrarFormularioCitacion();
    } catch (err) {
      console.error(err);
      setError('Error al guardar citación: ' + (err.message || ''));
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return (
    <div className="admin-postulaciones-main">
      <div className="container-postulaciones-manage">
        <p>Cargando...</p>
      </div>
    </div>
  );

  // Calcular estadísticas
  const totalPostulaciones = postulaciones.length;
  const pendientes = postulaciones.filter(p => p.estado === 'PENDIENTE').length;
  const aceptadas = postulaciones.filter(p => p.estado === 'ACEPTADO').length;
  const rechazadas = postulaciones.filter(p => p.estado === 'RECHAZADO').length;
  const entrevistas = postulaciones.filter(p => p.estado === 'ENTREVISTA_PROGRAMADA').length;

  // Filtrar postulaciones
  const postulacionesFiltradas = postulaciones.filter(p => {
    const cumpleFiltroEstado = filtroEstado === 'todas' || p.estado === filtroEstado;
    const cumpleFiltroOferta = filtroOferta === 'todas' || p.oferta?.id === parseInt(filtroOferta);
    const cumpleBusqueda =
      p.aspirante?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.aspirante?.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.oferta?.titulo.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltroEstado && cumpleFiltroOferta && cumpleBusqueda;
  });

  return (
    <div className="admin-postulaciones-main">
      <div className="container-postulaciones-manage">
        {/* Header Section */}
        <div className="header-section-AP">
          <div>
            <h1 className="title-postulaciones-AP">Gestión de Postulaciones</h1>
            <p className="subtitle-postulaciones-AP">Administra y supervisa todas las postulaciones de aspirantes</p>
          </div>
          <button onClick={cargarDatos} className="btn-refresh-header-AP" title="Refrescar datos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36"></path>
            </svg>
            Refrescar
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="error-block-AP">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Cerrar</button>
          </div>
        )}
        
        {success && (
          <div className="success-block-AP">
            <p>{success}</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="stats-section-AP">
          <div className="stat-card-AP stat-total-AP">
            <svg className="stat-icon-AP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21H3V3h18v18z"></path>
              <path d="M7 12l4-4 4 4 6-6"></path>
            </svg>
            <h3 className="stat-number-AP">{totalPostulaciones}</h3>
            <p className="stat-label-AP">Total</p>
          </div>

          <div className="stat-card-AP stat-pendientes-AP">
            <svg className="stat-icon-AP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <h3 className="stat-number-AP">{pendientes}</h3>
            <p className="stat-label-AP">Pendientes</p>
          </div>

          <div className="stat-card-AP stat-aceptadas-AP">
            <svg className="stat-icon-AP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <h3 className="stat-number-AP">{aceptadas}</h3>
            <p className="stat-label-AP">Aceptadas</p>
          </div>

          <div className="stat-card-AP stat-rechazadas-AP">
            <svg className="stat-icon-AP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h3 className="stat-number-AP">{rechazadas}</h3>
            <p className="stat-label-AP">Rechazadas</p>
          </div>

          <div className="stat-card-AP stat-entrevistas-AP">
            <svg className="stat-icon-AP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z"></path>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <h3 className="stat-number-AP">{entrevistas}</h3>
            <p className="stat-label-AP">Entrevistas</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section-AP">
          <div className="search-box-AP">
            <input
              type="text"
              placeholder="Buscar por aspirante, email u oferta..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input-AP"
            />
            <button className="search-btn-AP">🔍</button>
          </div>

          <div className="filter-buttons-AP">
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="filter-select-AP">
              <option value="todas">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="ACEPTADO">Aceptado</option>
              <option value="RECHAZADO">Rechazado</option>
              <option value="ENTREVISTA_PROGRAMADA">Entrevista Programada</option>
            </select>
            <select value={filtroOferta} onChange={(e) => setFiltroOferta(e.target.value)} className="filter-select-AP">
              <option value="todas">Todas las ofertas</option>
              {ofertas.map(o => (
                <option key={o.id} value={o.id}>{o.titulo}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container-AP">
          {postulacionesFiltradas.length === 0 ? (
            <p className="no-results-AP">No hay postulaciones que coincidan con los filtros</p>
          ) : (
            <table className="table-AP">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Aspirante</th>
                  <th>Email</th>
                  <th>Oferta</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {postulacionesFiltradas.map(p => (
                  <tr key={p.id} className={`row-${p.estado?.toLowerCase()}`}>
                    <td className="id-cell-AP">#{p.id}</td>
                    <td className="nombre-cell-AP">{p.aspirante?.nombre} {p.aspirante?.apellido || ''}</td>
                    <td className="email-cell-AP">{p.aspirante?.correo}</td>
                    <td className="oferta-cell-AP">{p.oferta?.titulo}</td>
                    <td className="estado-cell-AP">
                      {editingId === p.id ? (
                        <select
                          value={editForm.estado}
                          onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                          className="estado-select-AP"
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="ACEPTADO">Aceptado</option>
                          <option value="RECHAZADO">Rechazado</option>
                          <option value="ENTREVISTA_PROGRAMADA">Entrevista</option>
                        </select>
                      ) : (
                        <span className={`status-badge status-${p.estado?.toLowerCase()}`}>{p.estado}</span>
                      )}
                    </td>
                    <td className="fecha-cell-AP">{p.fechaCreacion?.split('T')[0]}</td>
                    <td className="actions-AP">
                      {editingId === p.id ? (
                        <>
                          <button className="btn-action-AP btn-save-AP" onClick={handleSaveEdit} disabled={processingId === p.id} title="Guardar">✓</button>
                          <button className="btn-action-AP btn-cancel-AP" onClick={handleCancelEdit} title="Cancelar">✕</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-action-AP btn-edit-AP" onClick={() => handleEdit(p)} disabled={processingId === p.id} title="Editar estado">✏️</button>
                          {p.estado !== 'ENTREVISTA_PROGRAMADA' && (
                            <button className="btn-action-AP btn-citacion-AP" onClick={() => handleAbrirFormularioCitacion(p)} disabled={processingId === p.id} title="Programar citación">
                              📅
                            </button>
                          )}
                          {p.estado === 'ENTREVISTA_PROGRAMADA' && (
                            <button className="btn-action-AP btn-citacion-AP" onClick={() => handleAbrirFormularioCitacion(p)} disabled={processingId === p.id} title="Editar citación">
                              ✏️📅
                            </button>
                          )}
                          <button className="btn-action-AP btn-delete-AP" onClick={() => handleEliminar(p.id)} disabled={processingId === p.id} title="Eliminar">🗑️</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal para programar citación */}
        {citacionFormOpen && (
          <div className="modal-overlay-AP" onClick={handleCerrarFormularioCitacion}>
            <div className="modal-content-AP" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-AP">
                <div className="title-wrap">
                  <div className="accent-dot"></div>
                  <h3>Programar Citación</h3>
                </div>
                <button className="modal-close-AP" onClick={handleCerrarFormularioCitacion}>✕</button>
              </div>
              <div className="modal-body-AP">
                <form onSubmit={(e) => { e.preventDefault(); handleGuardarCitacion(); }}>
                  <div className="form-group-AP">
                    <label>Fecha *</label>
                    <input
                      type="date"
                      required
                      value={citacionForm.fecha}
                      onChange={(e) => setCitacionForm({ ...citacionForm, fecha: e.target.value })}
                    />
                  </div>
                  <div className="form-group-AP">
                    <label>Hora (HH:MM) *</label>
                    <input
                      type="time"
                      required
                      value={citacionForm.hora}
                      onChange={(e) => setCitacionForm({ ...citacionForm, hora: e.target.value })}
                    />
                  </div>
                  <div className="form-group-AP">
                    <label>Link Meet (URL) *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://meet.google.com/..."
                      value={citacionForm.linkMeet}
                      onChange={(e) => setCitacionForm({ ...citacionForm, linkMeet: e.target.value })}
                    />
                  </div>
                  <div className="form-group-AP">
                    <label>Estado</label>
                    <select
                      value={citacionForm.estadoCitacion}
                      onChange={(e) => setCitacionForm({ ...citacionForm, estadoCitacion: e.target.value })}
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="CONFIRMADA">Confirmada</option>
                      <option value="ASISTIO">Asistió</option>
                      <option value="NO_ASISTIO">No Asistió</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                  </div>
                  <div className="modal-buttons-AP">
                    <button type="button" className="btn-cancel-modal-AP" onClick={handleCerrarFormularioCitacion}>Cancelar</button>
                    <button type="submit" className="btn-submit-modal-AP" disabled={processingId === citacionFormOpen}>Guardar Citación</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
