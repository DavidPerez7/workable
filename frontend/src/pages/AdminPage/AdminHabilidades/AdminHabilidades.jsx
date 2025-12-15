import React, { useState, useEffect } from 'react';
import { obtenerHabilidadesPorUsuario, crearHabilidad, actualizarHabilidad, eliminarHabilidad } from '../../../api/habilidadAPI';
import aspirantesApi from '../../../api/aspirantesApi';
import '../AdminEmpresas/AdminEmpresas.css';
import './AdminHabilidades.css';

function AdminHabilidades() {
  const [habilidades, setHabilidades] = useState([]);
  const [aspirantes, setAspirantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [selectedAspiranteId, setSelectedAspiranteId] = useState('');
  
  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHabilidad, setSelectedHabilidad] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    nombre: '',
    aspirante: null
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (selectedAspiranteId) {
      fetchHabilidades(selectedAspiranteId);
    }
  }, [selectedAspiranteId]);

  const fetchUsuarios = async () => {
    try {
      const data = await aspirantesApi.getAll();
      setAspirantes(data);
      if (data.length > 0) {
        setSelectedAspiranteId(data[0].id);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar usuarios');
    }
  };

  const fetchHabilidades = async (aspiranteId) => {
    try {
      setLoading(true);
      const data = await obtenerHabilidadesPorUsuario(aspiranteId);
      setHabilidades(data);
    } catch (err) {
      console.error('Error:', err);
      setHabilidades([]);
    } finally {
      setLoading(false);
    }
  };

  const habilidadesFiltradas = habilidades.filter(hab => {
    const searchLower = busqueda.toLowerCase();
    return hab.nombre?.toLowerCase().includes(searchLower) || hab.id?.toString().includes(searchLower);
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await crearHabilidad({
        nombre: formData.nombre,
        aspirante: { id: formData.aspirante }
      });
      setShowCreateModal(false);
      resetForm();
      if (selectedAspiranteId) {
        fetchHabilidades(selectedAspiranteId);
      }
    } catch (err) {
      console.error('Error al crear habilidad:', err);
      alert('Error al crear habilidad');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await actualizarHabilidad(selectedHabilidad.id, {
        nombre: formData.nombre,
        aspirante: selectedHabilidad.aspirante
      });
      setShowEditModal(false);
      if (selectedAspiranteId) {
        fetchHabilidades(selectedAspiranteId);
      }
    } catch (err) {
      console.error('Error al actualizar:', err);
      alert('Error al actualizar habilidad');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta habilidad?')) {
      try {
        await eliminarHabilidad(id);
        if (selectedAspiranteId) {
          fetchHabilidades(selectedAspiranteId);
        }
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar habilidad');
      }
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (hab) => {
    setSelectedHabilidad(hab);
    setFormData({ nombre: hab.nombre, aspirante: hab.aspirante?.id });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', aspirante: null });
  };

  if (loading && !selectedAspiranteId) return <div className="container-admin-page-AP"><p>Cargando...</p></div>;
  if (error) return <div className="container-admin-page-AP"><p>{error}</p></div>;

  return (
    <div className="container-admin-page-AP">
      <div className="header-admin-empresas-AE">
        <h1>Gestión de Habilidades</h1>
        <button className="btn-crear-AE" onClick={openCreateModal}>+ Nueva Habilidad</button>
      </div>

      <div className="filters-AE">
        <select 
          value={selectedAspiranteId} 
          onChange={(e) => setSelectedAspiranteId(e.target.value)}
          className="filter-select-AE"
        >
          <option value="">Seleccionar Aspirante...</option>
          {aspirantes.map(asp => (
            <option key={asp.id} value={asp.id}>{asp.nombre} {asp.apellido}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar habilidad..."
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
              <th>Nombre</th>
              <th>Aspirante</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habilidadesFiltradas.map(hab => (
              <tr key={hab.id}>
                <td>{hab.id}</td>
                <td>{hab.nombre}</td>
                <td>{hab.aspirante?.nombre || 'N/A'} {hab.aspirante?.apellido || ''}</td>
                <td className="actions-cell-AE">
                  <button className="btn-editar-AE" onClick={() => openEditModal(hab)}>Editar</button>
                  <button className="btn-eliminar-AE" onClick={() => handleDelete(hab.id)}>Eliminar</button>
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
              <h2>Crear Habilidad</h2>
              <button className="modal-close-AE" onClick={() => setShowCreateModal(false)}>✖</button>
            </div>
            <form onSubmit={handleCreate} className="modal-form-AE">
              <div className="form-group-AE">
                <label className="form-field-label">Nombre * (máx 20 caracteres)</label>
                <input 
                  type="text" 
                  required 
                  maxLength="20" 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                  className="form-field-input"
                />
              </div>
              <div className="form-group-AE">
                <label className="form-field-label">Aspirante *</label>
                <select 
                  required 
                  value={formData.aspirante || ''} 
                  className="form-field-select"
                  onChange={(e) => setFormData({...formData, aspirante: e.target.value})}
                >
                  <option value="">Seleccionar...</option>
                  {aspirantes.map(asp => (
                    <option key={asp.id} value={asp.id}>{asp.nombre} {asp.apellido}</option>
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

      {/* MODAL EDIT */}
      {showEditModal && selectedHabilidad && (
        <div className="modal-overlay-AE" onClick={() => setShowEditModal(false)}>
          <div className="modal-content-AE" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-AE">
              <h2>Editar Habilidad #{selectedHabilidad.id}</h2>
              <button className="modal-close-AE" onClick={() => setShowEditModal(false)}>✖</button>
            </div>
            <form onSubmit={handleEdit} className="modal-form-AE">
              <div className="form-group-AE">
                <label className="form-field-label">Nombre * (máx 20 caracteres)</label>
                <input 
                  type="text" 
                  required 
                  maxLength="20" 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                  className="form-field-input"
                />
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

export default AdminHabilidades;
