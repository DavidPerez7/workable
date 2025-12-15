import React, { useState, useEffect } from 'react';
import { getAllCitaciones, createCitacion, updateCitacion, deleteCitacion } from '../../../api/citacionAPI';
import { getAllOfertas } from '../../../api/ofertasAPI';
import reclutadoresApi from '../../../api/reclutadoresApi';
import '../AdminEmpresas/AdminEmpresas.css';
import './AdminCitaciones.css';

function AdminCitaciones() {
  const [citaciones, setCitaciones] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [reclutadores, setReclutadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  
  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCitacion, setSelectedCitacion] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    postulacionId: '',
    reclutadorId: '',
    fechaCitacion: '',
    hora: '',
    linkMeet: '',
    detalles: '',
    usuarioIdActual: 1 // ADMIN default
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [citacionesData, ofertasData, reclutadoresData] = await Promise.all([
        getAllCitaciones(),
        getAllOfertas(),
        reclutadoresApi.getAll()
      ]);
      setCitaciones(citacionesData);
      setOfertas(ofertasData);
      setReclutadores(reclutadoresData);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const citacionesFiltradas = citaciones.filter(citacion => {
    const searchLower = busqueda.toLowerCase();
    return (
      citacion.id?.toString().includes(searchLower) ||
      citacion.linkMeet?.toLowerCase().includes(searchLower) ||
      citacion.estado?.toLowerCase().includes(searchLower)
    );
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCitacion(formData);
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error al crear citación:', err);
      alert('Error al crear citación');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateCitacion(selectedCitacion.id, formData.estado, 1);
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      console.error('Error al actualizar:', err);
      alert('Error al actualizar citación');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta citación?')) {
      try {
        await deleteCitacion(id, 1);
        fetchData();
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar citación');
      }
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openViewModal = (citacion) => {
    setSelectedCitacion(citacion);
    setShowViewModal(true);
  };

  const openEditModal = (citacion) => {
    setSelectedCitacion(citacion);
    setFormData({ ...formData, estado: citacion.estado });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      postulacionId: '',
      reclutadorId: '',
      fechaCitacion: '',
      hora: '',
      linkMeet: '',
      detalles: '',
      usuarioIdActual: 1
    });
  };

  if (loading) return <div className="container-admin-page-AP"><p>Cargando...</p></div>;
  if (error) return <div className="container-admin-page-AP"><p>{error}</p></div>;

  return (
    <div className="container-admin-page-AP">
      <div className="header-admin-empresas-AE">
        <h1>Gestión de Citaciones</h1>
        <button className="btn-crear-AE" onClick={openCreateModal}>+ Nueva Citación</button>
      </div>

      <div className="filters-AE">
        <input
          type="text"
          placeholder="Buscar citación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input-AE"
        />
      </div>

      <div className="table-container-AE">
        <table className="empresas-table-AE">
          <thead>
            <tr>
              <th>ID</th>
              <th>Postulación</th>
              <th>Reclutador</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citacionesFiltradas.map(citacion => (
              <tr key={citacion.id}>
                <td>{citacion.id}</td>
                <td>{citacion.postulacion?.id || 'N/A'}</td>
                <td>{citacion.reclutador?.nombre || 'N/A'} {citacion.reclutador?.apellido || ''}</td>
                <td>{citacion.fechaCitacion}</td>
                <td>{citacion.hora}</td>
                <td>
                  <span className={`badge-${citacion.estado?.toLowerCase().replace(/\s+/g, '_')}`}>
                    {citacion.estado}
                  </span>
                </td>
                <td className="actions-cell-AE">
                  <button className="btn-ver-AE" onClick={() => openViewModal(citacion)}>Ver</button>
                  <button className="btn-editar-AE" onClick={() => openEditModal(citacion)}>Editar</button>
                  <button className="btn-eliminar-AE" onClick={() => handleDelete(citacion.id)}>Eliminar</button>
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
              <h2>Crear Citación</h2>
              <button className="modal-close-AE" onClick={() => setShowCreateModal(false)}>✖</button>
            </div>
            <form onSubmit={handleCreate} className="modal-form-AE">
              <div className="form-group-AE">
                <label className="form-field-label">Postulación ID *</label>
                <input type="number" required value={formData.postulacionId} onChange={(e) => setFormData({...formData, postulacionId: e.target.value})} className="form-field-input" />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Reclutador *</label>
                <select required value={formData.reclutadorId} onChange={(e) => setFormData({...formData, reclutadorId: e.target.value})} className="form-field-select">
                  <option value="">Seleccionar...</option>
                  {reclutadores.map(r => (
                    <option key={r.id} value={r.id}>{r.nombre} {r.apellido}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Fecha *</label>
                <input type="date" required value={formData.fechaCitacion} onChange={(e) => setFormData({...formData, fechaCitacion: e.target.value})} className="form-field-input" />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Hora *</label>
                <input type="time" required value={formData.hora} onChange={(e) => setFormData({...formData, hora: e.target.value})} className="form-field-input" />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Link Meet *</label>
                <input type="url" required value={formData.linkMeet} onChange={(e) => setFormData({...formData, linkMeet: e.target.value})} className="form-field-input" />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Detalles</label>
                <textarea value={formData.detalles} onChange={(e) => setFormData({...formData, detalles: e.target.value})} className="form-field-textarea" />
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
      {showViewModal && selectedCitacion && (
        <div className="modal-overlay-AE" onClick={() => setShowViewModal(false)}>
          <div className="modal-content-AE" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-AE">
              <h2>Detalles de Citación #{selectedCitacion.id}</h2>
              <button className="modal-close-AE" onClick={() => setShowViewModal(false)}>✖</button>
            </div>
            <div className="modal-body-AE">
              <p><strong>Postulación:</strong> {selectedCitacion.postulacion?.id}</p>
              <p><strong>Reclutador:</strong> {selectedCitacion.reclutador?.nombre} {selectedCitacion.reclutador?.apellido}</p>
              <p><strong>Fecha:</strong> {selectedCitacion.fechaCitacion}</p>
              <p><strong>Hora:</strong> {selectedCitacion.hora}</p>
              <p><strong>Link Meet:</strong> <a href={selectedCitacion.linkMeet} target="_blank" rel="noreferrer">{selectedCitacion.linkMeet}</a></p>
              <p><strong>Estado:</strong> {selectedCitacion.estado}</p>
              <p><strong>Detalles:</strong> {selectedCitacion.detallesCitacion || 'N/A'}</p>
            </div>
            <div className="modal-actions-AE">
              <button className="btn-cancelar-AE" onClick={() => setShowViewModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {showEditModal && selectedCitacion && (
        <div className="modal-overlay-AE" onClick={() => setShowEditModal(false)}>
          <div className="modal-content-AE" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-AE">
              <h2>Cambiar Estado - Citación #{selectedCitacion.id}</h2>
              <button className="modal-close-AE" onClick={() => setShowEditModal(false)}>✖</button>
            </div>
            <form onSubmit={handleEdit} className="modal-form-AE">
              <div className="form-group-AE">
                <label className="form-field-label">Estado *</label>
                <select required value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} className="form-field-select">
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="CONFIRMADA">CONFIRMADA</option>
                  <option value="ASISTIO">ASISTIO</option>
                  <option value="NO_ASISTIO">NO_ASISTIO</option>
                  <option value="CANCELADA">CANCELADA</option>
                </select>
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
  );
}

export default AdminCitaciones;
