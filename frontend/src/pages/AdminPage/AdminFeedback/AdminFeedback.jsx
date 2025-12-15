import React, { useState, useEffect } from 'react';
import Sidebar from '../SideBar/Sidebar';
import { getAllFeedbacks, getFeedbackById, updateFeedback, deleteFeedback } from '../../../api/feedbackAPI';
import './AdminFeedback.css';

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  
  // Modales
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    puntuacion: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const feedbacksFiltrados = feedbacks.filter(feedback => {
    const searchLower = busqueda.toLowerCase();
    return (
      feedback.titulo?.toLowerCase().includes(searchLower) ||
      feedback.id?.toString().includes(searchLower) ||
      feedback.aspirante?.nombre?.toLowerCase().includes(searchLower) ||
      feedback.empresa?.nombre?.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateFeedback(selectedFeedback.id, {
        ...selectedFeedback,
        ...formData,
        aspirante: selectedFeedback.aspirante
      }, 1);
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      console.error('Error al actualizar:', err);
      alert('Error al actualizar feedback');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este feedback?')) {
      try {
        await deleteFeedback(id, 1);
        fetchData();
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar feedback');
      }
    }
  };

  const openViewModal = async (feedback) => {
    try {
      const data = await getFeedbackById(feedback.id);
      setSelectedFeedback(data);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cargar feedback');
    }
  };

  const openEditModal = (feedback) => {
    setSelectedFeedback(feedback);
    setFormData({
      titulo: feedback.titulo,
      descripcion: feedback.descripcion,
      puntuacion: feedback.puntuacion
    });
    setShowEditModal(true);
  };

  if (loading) return <div style={{padding: '2rem', textAlign: 'center'}}>Cargando...</div>;
  if (error) return <div style={{padding: '2rem', color: '#DC2626'}}>{error}</div>;

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-feedback-FED">
        <div className="container-feedback-FED">
          <div className="header-section-FED">
            <div>
              <h1 className="title-feedback-FED">Gestión de Feedback</h1>
              <p className="subtitle-feedback-FED">Administra los feedbacks de aspirantes</p>
            </div>
          </div>

      <div className="filters-feedback-FED">
        <input
          type="text"
          placeholder="Buscar feedback..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input-FED"
        />
      </div>

      <div className="table-container-FED">
        <table className="table-feedback-FED">
          <thead>
            <tr>
              <th>ID</th>
              <th>Aspirante</th>
              <th>Empresa</th>
              <th>Oferta</th>
              <th>Título</th>
              <th>Puntuación</th>
              <th>Fecha</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {feedbacksFiltrados.map(feedback => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>{feedback.aspirante?.nombre || 'N/A'} {feedback.aspirante?.apellido || ''}</td>
                <td>{feedback.empresa?.nombre || 'N/A'}</td>
                <td>{feedback.oferta?.titulo || 'N/A'}</td>
                <td>{feedback.titulo}</td>
                <td>
                  <div className="stars-container-FED">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star-FED ${i < Math.floor(feedback.puntuacion || 0) ? 'filled' : i < feedback.puntuacion ? 'half' : ''}`}>★</span>
                    ))}
                    <span className="puntuacion-valor-FED">{feedback.puntuacion?.toFixed(1) || 'N/A'}</span>
                  </div>
                </td>
                <td>{feedback.fechaCreacion}</td>
                <td>{feedback.isActive ? '✅' : '❌'}</td>
                <td className="actions-cell-FED">
                  <button className="btn-ver-FED" onClick={() => openViewModal(feedback)}>Ver</button>
                  <button className="btn-editar-FED" onClick={() => openEditModal(feedback)}>Editar</button>
                  <button className="btn-eliminar-FED" onClick={() => handleDelete(feedback.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL VIEW */}
      {showViewModal && selectedFeedback && (
        <div className="modal-overlay-AE" onClick={() => setShowViewModal(false)}>
          <div className="modal-content-AE" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-AE">
              <h2>Detalles de Feedback #{selectedFeedback.id}</h2>
              <button className="modal-close-AE" onClick={() => setShowViewModal(false)}>✖</button>
            </div>
            <div className="modal-body-AE">
              <p><strong>Título:</strong> {selectedFeedback.titulo}</p>
              <p><strong>Descripción:</strong> {selectedFeedback.descripcion}</p>
              <p><strong>Puntuación:</strong> ⭐ {selectedFeedback.puntuacion?.toFixed(1)}</p>
              <p><strong>Aspirante:</strong> {selectedFeedback.aspirante?.nombre} {selectedFeedback.aspirante?.apellido}</p>
              <p><strong>Empresa:</strong> {selectedFeedback.empresa?.nombre || 'N/A'}</p>
              <p><strong>Oferta:</strong> {selectedFeedback.oferta?.titulo || 'N/A'}</p>
              <p><strong>Fecha Creación:</strong> {selectedFeedback.fechaCreacion}</p>
              <p><strong>Activo:</strong> {selectedFeedback.isActive ? 'Sí' : 'No'}</p>
            </div>
            <div className="modal-actions-AE">
              <button className="btn-cancelar-AE" onClick={() => setShowViewModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {showEditModal && selectedFeedback && (
        <div className="modal-overlay-AE" onClick={() => setShowEditModal(false)}>
          <div className="modal-content-AE" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-AE">
              <h2>Editar Feedback #{selectedFeedback.id}</h2>
              <button className="modal-close-AE" onClick={() => setShowEditModal(false)}>✖</button>
            </div>
            <form onSubmit={handleEdit} className="modal-form-AE">
              <div className="form-group-AE">
                <label className="form-field-label">Título *</label>
                <input type="text" required maxLength="100" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} className="form-field-input" />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Descripción *</label>
                <textarea required value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="form-field-textarea" />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Puntuación * (0-5)</label>
                <input type="number" required min="0" max="5" step="0.1" value={formData.puntuacion} onChange={(e) => setFormData({...formData, puntuacion: e.target.value})} className="form-field-input" />
              </div>
              <div className="modal-actions-AE">
                <button type="button" className="btn-cancelar-AE" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="submit" className="btn-guardar-AE">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default AdminFeedback;
