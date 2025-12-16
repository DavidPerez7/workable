import React, { useEffect, useState } from 'react';
import './OffersPostulacionesModal.css';
import { obtenerPostulacionesPorOferta, cambiarEstadoPostulacion, eliminarPostulacion, crearPostulacion, actualizarPostulacion } from '../../../../api/postulacionesAPI';
import aspirantesApi from '../../../../api/aspirantesApi';

export default function OffersPostulacionesModal({ isOpen, ofertaId, onClose, onChange }) {
  const [loading, setLoading] = useState(true);
  const [postulaciones, setPostulaciones] = useState([]);
  const [aspirantes, setAspirantes] = useState([]);
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editForm, setEditForm] = useState({ aspiranteId: '', estado: '' });
  const [createForm, setCreateForm] = useState({ aspiranteId: '' });
  const [citacionFormOpen, setCitacionFormOpen] = useState(null);
  const [citacionForm, setCitacionForm] = useState({ fecha: '', hora: '', linkMeet: '', estadoCitacion: 'PENDIENTE' });

  useEffect(() => {
    if (isOpen && ofertaId) {
      fetchData();
    }
  }, [isOpen, ofertaId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setErrorDetail(null);
    try {
      const usuarioIdActual = localStorage.getItem("usuarioId");
      const [postulacionesData, aspirantesData] = await Promise.all([
        obtenerPostulacionesPorOferta(ofertaId, usuarioIdActual),
        aspirantesApi.getAll()
      ]);
      setPostulaciones(postulacionesData);
      setAspirantes(aspirantesData || []);
    } catch (err) {
      console.error('Error al cargar postulaciones:', err);
      setError(`Error al cargar postulaciones: ${err.message}`);
      setErrorDetail(err.serverData || null);
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
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar la postulación: ' + (err.message || ''));
      setErrorDetail(err.serverData || null);
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (postulacion) => {
    setEditingId(postulacion.id);
    setEditForm({ aspiranteId: postulacion.aspirante?.id || '', estado: postulacion.estado });
  };

  const handleSaveEdit = async () => {
    if (!editForm.aspiranteId) {
      setError('Selecciona un aspirante válido.');
      return;
    }
    try {
      setProcessingId(editingId);
      const updatedPostulacion = {
        id: editingId,
        aspirante: { id: parseInt(editForm.aspiranteId) },
        oferta: { id: ofertaId },
        estado: editForm.estado
      };
      await actualizarPostulacion(updatedPostulacion);
      setPostulaciones(postulaciones.map(p =>
        p.id === editingId ? { ...p, aspirante: aspirantes.find(a => a.id === parseInt(editForm.aspiranteId)), estado: editForm.estado } : p
      ));
      setEditingId(null);
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      setError('Error al actualizar postulación: ' + (err.message || ''));
      setErrorDetail(err.serverData || null);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ aspiranteId: '', estado: '' });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!createForm.aspiranteId) {
      setError('Selecciona un aspirante válido.');
      return;
    }
    try {
      setLoading(true);
      await crearPostulacion({ aspiranteId: parseInt(createForm.aspiranteId), ofertaId: ofertaId });
      setShowCreateForm(false);
      setCreateForm({ aspiranteId: '' });
      if (onChange) onChange();
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Error al crear postulación: ' + (err.message || ''));
      setErrorDetail(err.serverData || null);
    } finally {
      setLoading(false);
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
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      setError('Error al guardar citación: ' + (err.message || ''));
    } finally {
      setProcessingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="opal-modal-overlay" onClick={onClose}>
      <div className="opal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="opal-modal-header">
          <h3>Postulaciones - Oferta #{ofertaId}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="opal-modal-body">
          {loading ? <p>Cargando postulaciones...</p> : null}
          {error && (
            <div className="error-block-opm">
              <p className="error-text">{error}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn-small ghost" onClick={fetchData}>Reintentar</button>
                <button className="btn-small ghost" onClick={() => { setError(null); setErrorDetail(null); }}>Ocultar</button>
              </div>
              {errorDetail && (
                <details style={{ marginTop: 8 }}>
                  <summary>Ver detalles del servidor</summary>
                  <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{JSON.stringify(errorDetail, null, 2)}</pre>
                </details>
              )}
            </div>
          )}

          <div className="opal-actions-row">
            <button className="btn-small primary" onClick={() => setShowCreateForm(true)}>+ Crear</button>
            <button className="btn-small ghost" onClick={fetchData}>Recargar</button>
          </div>

          {showCreateForm && (
            <form className="create-form-opm" onSubmit={handleCrear}>
              <h4>Crear Nueva Postulación</h4>
              <div className="form-group-opm">
                <label>Aspirante</label>
                <select
                  value={createForm.aspiranteId}
                  onChange={(e) => setCreateForm({ ...createForm, aspiranteId: e.target.value })}
                  required
                >
                  <option value="">Seleccionar aspirante</option>
                  {aspirantes.map(aspirante => (
                    <option key={aspirante.id} value={aspirante.id}>
                      {aspirante.nombre} {aspirante.apellido} - {aspirante.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-buttons-opm">
                <button type="button" onClick={() => setShowCreateForm(false)}>Cancelar</button>
                <button type="submit">Crear</button>
              </div>
            </form>
          )}

          <div className="opal-list">
            {postulaciones.length === 0 && !loading ? (
              <p>No hay postulaciones para esta oferta</p>
            ) : (
              postulaciones.map((p) => (
                <div className="opal-item" key={p.id}>
                  <div className="opal-left">
                    <div className="opal-avatar">{p.aspirante?.nombre?.charAt(0) || 'A'}</div>
                    <div>
                      <div className="opal-name">{p.aspirante?.nombre} {p.aspirante?.apellido}</div>
                      <div className="opal-sub">{p.aspirante?.correo || '—'}</div>
                      <div className="opal-meta">ID: {p.id} • Postulado: {p.fechaCreacion || '—'}</div>
                    </div>
                  </div>
                  <div className="opal-right">
                    {editingId === p.id ? (
                      <div className="edit-form-opm">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <select
                            value={editForm.aspiranteId}
                            onChange={(e) => setEditForm({ ...editForm, aspiranteId: e.target.value })}
                            required
                          >
                            <option value="">Seleccionar aspirante</option>
                            {aspirantes.map(aspirante => (
                              <option key={aspirante.id} value={aspirante.id}>
                                {aspirante.nombre} {aspirante.apellido} - {aspirante.email}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editForm.estado}
                            onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                          >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="ACEPTADO">Aceptado</option>
                            <option value="RECHAZADO">Rechazado</option>
                            <option value="ENTREVISTA_PROGRAMADA">Entrevista Programada</option>
                          </select>
                        </div>
                        <div className="edit-buttons-opm">
                          <button className="btn-small primary" onClick={handleSaveEdit} disabled={processingId === p.id}>Guardar</button>
                          <button className="btn-small ghost" onClick={handleCancelEdit}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={`status ${p.estado?.toLowerCase()}`}>{p.estado}</div>
                        <div className="opal-buttons">
                          <button className="btn-small edit" onClick={() => handleEdit(p)} disabled={processingId === p.id} title="Editar postulación">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          {p.estado !== 'ENTREVISTA_PROGRAMADA' && (
                            <button className="btn-small primary" onClick={() => handleAbrirFormularioCitacion(p)} disabled={processingId === p.id} title="Programar citación">
                              📅 Citar
                            </button>
                          )}
                          {p.estado === 'ENTREVISTA_PROGRAMADA' && (
                            <button className="btn-small primary" onClick={() => handleAbrirFormularioCitacion(p)} disabled={processingId === p.id} title="Editar citación">
                              ✏️ Citar
                            </button>
                          )}
                          <button className="btn-small danger" onClick={() => handleEliminar(p.id)} disabled={processingId === p.id} title="Eliminar postulación">Eliminar</button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Detalles expandibles completos */}
                  <details className="opal-details">
                    <summary>Ver detalles completos</summary>
                    <div className="opal-details-content">
                      {/* Datos de Postulacion */}
                      <div className="opal-detail-section">
                        <h4>Información de Postulación</h4>
                        <div className="opal-detail-rows">
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">ID:</span>
                            <span className="opal-detail-value">{p.id}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Estado:</span>
                            <span className={`status ${p.estado?.toLowerCase()}`}>{p.estado}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Fecha Postulación:</span>
                            <span className="opal-detail-value">{p.fechaCreacion || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Activo:</span>
                            <span className="opal-detail-value">{p.isActive ? 'Sí' : 'No'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Datos de Aspirante */}
                      <div className="opal-detail-section">
                        <h4>Información del Aspirante</h4>
                        <div className="opal-detail-rows">
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">ID:</span>
                            <span className="opal-detail-value">{p.aspirante?.id || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Nombre:</span>
                            <span className="opal-detail-value">{p.aspirante?.nombre} {p.aspirante?.apellido}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Correo:</span>
                            <span className="opal-detail-value">{p.aspirante?.correo || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Teléfono:</span>
                            <span className="opal-detail-value">{p.aspirante?.telefono || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Género:</span>
                            <span className="opal-detail-value">{p.aspirante?.genero || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Ubicación:</span>
                            <span className="opal-detail-value">{p.aspirante?.ubicacion || '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Datos de Oferta */}
                      <div className="opal-detail-section">
                        <h4>Información de Oferta</h4>
                        <div className="opal-detail-rows">
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">ID:</span>
                            <span className="opal-detail-value">{p.oferta?.id || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Título:</span>
                            <span className="opal-detail-value">{p.oferta?.titulo || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Empresa:</span>
                            <span className="opal-detail-value">{p.oferta?.empresa?.nombre || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Salario:</span>
                            <span className="opal-detail-value">${p.oferta?.salario?.toLocaleString() || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Modalidad:</span>
                            <span className="opal-detail-value">{p.oferta?.modalidad || '—'}</span>
                          </div>
                          <div className="opal-detail-row">
                            <span className="opal-detail-label">Estado:</span>
                            <span className="opal-detail-value">{p.oferta?.estado || '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Datos de Citación (solo si estado es ENTREVISTA_PROGRAMADA) */}
                      {p.estado === 'ENTREVISTA_PROGRAMADA' && p.citacionData && (
                        <div className="opal-detail-section">
                          <h4>Información de Citación</h4>
                          <div className="opal-detail-rows">
                            <div className="opal-detail-row">
                              <span className="opal-detail-label">Fecha:</span>
                              <span className="opal-detail-value">{p.citacionData?.fecha || '—'}</span>
                            </div>
                            <div className="opal-detail-row">
                              <span className="opal-detail-label">Hora:</span>
                              <span className="opal-detail-value">{p.citacionData?.hora || '—'}</span>
                            </div>
                            <div className="opal-detail-row">
                              <span className="opal-detail-label">Link Meet:</span>
                              <span className="opal-detail-value">
                                {p.citacionData?.linkMeet ? (
                                  <a href={p.citacionData.linkMeet} target="_blank" rel="noopener noreferrer">
                                    {p.citacionData.linkMeet}
                                  </a>
                                ) : (
                                  '—'
                                )}
                              </span>
                            </div>
                            <div className="opal-detail-row">
                              <span className="opal-detail-label">Estado Citación:</span>
                              <span className="opal-detail-value">{p.citacionData?.estadoCitacion || '—'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {p.estado === 'ENTREVISTA_PROGRAMADA' && !p.citacionData && (
                        <div className="opal-detail-section">
                          <h4>Información de Citación</h4>
                          <p className="opal-no-data">No hay datos de citación disponibles</p>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal para programar citación */}
        {citacionFormOpen && (
          <div className="opal-modal-overlay" onClick={handleCerrarFormularioCitacion}>
            <div className="opal-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="opal-modal-header">
                <h3>📅 Programar Citación</h3>
                <button className="modal-close-btn" onClick={handleCerrarFormularioCitacion}>✕</button>
              </div>
              <div className="opal-modal-body">
                <form onSubmit={(e) => { e.preventDefault(); handleGuardarCitacion(); }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Fecha *</label>
                    <input
                      type="date"
                      required
                      value={citacionForm.fecha}
                      onChange={(e) => setCitacionForm({ ...citacionForm, fecha: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Hora (HH:MM) *</label>
                    <input
                      type="time"
                      required
                      value={citacionForm.hora}
                      onChange={(e) => setCitacionForm({ ...citacionForm, hora: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Link Meet (URL) *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://meet.google.com/..."
                      value={citacionForm.linkMeet}
                      onChange={(e) => setCitacionForm({ ...citacionForm, linkMeet: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Estado</label>
                    <select
                      value={citacionForm.estadoCitacion}
                      onChange={(e) => setCitacionForm({ ...citacionForm, estadoCitacion: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="CONFIRMADA">Confirmada</option>
                      <option value="ASISTIO">Asistió</option>
                      <option value="NO_ASISTIO">No Asistió</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn-small ghost" onClick={handleCerrarFormularioCitacion}>Cancelar</button>
                    <button type="submit" className="btn-small primary" disabled={processingId === citacionFormOpen}>Guardar Citación</button>
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
