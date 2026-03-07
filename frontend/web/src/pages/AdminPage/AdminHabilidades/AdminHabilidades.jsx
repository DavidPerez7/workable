import React, { useState, useEffect } from 'react';
import Sidebar from '../SideBar/Sidebar';
// NOTA: Habilidades fueron removidas del backend, este componente no funciona actualmente
// import { obtenerTodasLasHabilidades, crearHabilidad, actualizarHabilidad, eliminarHabilidad } from '../../../api/habilidadAPI';
import aspirantesApi from '../../../api/aspirantesApi';
import './AdminHabilidades.css';

function AdminHabilidades() {
  const [habilidades, setHabilidades] = useState([]);
  const [aspirantes, setAspirantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [habilidadesData, aspirantesData] = await Promise.all([
        obtenerTodasLasHabilidades(),
        aspirantesApi.getAll()
      ]);
      setHabilidades(habilidadesData);
      setAspirantes(aspirantesData);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
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
      fetchData();
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
      fetchData();
    } catch (err) {
      console.error('Error al actualizar:', err);
      alert('Error al actualizar habilidad');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta habilidad?')) {
      try {
        await eliminarHabilidad(id);
        fetchData();
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

  if (loading) return <div style={{padding: '2rem', textAlign: 'center'}}>Cargando...</div>;
  if (error) return <div style={{padding: '2rem', color: '#DC2626'}}>{error}</div>;

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-habilidades-HAB">
        <div className="container-habilidades-HAB">
          <div className="header-section-HAB">
            <div>
              <h1 className="title-habilidades-HAB">Gestión de Habilidades</h1>
              <p className="subtitle-habilidades-HAB">Administra las habilidades de los aspirantes</p>
            </div>
            <button className="btn-crear-HAB" onClick={openCreateModal}>+ Nueva Habilidad</button>
          </div>

          <div className="filters-habilidades-HAB">
            <input
              type="text"
              placeholder="Buscar habilidad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input-HAB"
            />
          </div>

          <div className="table-container-HAB">
            <table className="table-habilidades-HAB">
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
                    <td className="actions-cell-HAB">
                      <button className="btn-editar-HAB" onClick={() => openEditModal(hab)}>Editar</button>
                      <button className="btn-eliminar-HAB" onClick={() => handleDelete(hab.id)}>Eliminar</button>
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
      </div>
    </div>
  );
}

export default AdminHabilidades;
