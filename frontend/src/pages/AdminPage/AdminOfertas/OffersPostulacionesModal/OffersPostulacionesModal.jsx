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
                          <button className="btn-small edit" onClick={() => handleEdit(p)} disabled={processingId === p.id}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button className="btn-small danger" onClick={() => handleEliminar(p.id)} disabled={processingId === p.id}>Eliminar</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
