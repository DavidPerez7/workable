import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reclutadoresApi from '../../../api/reclutadoresApi';

function RecruitersModal({ isOpen, onClose, empresa }) {
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && empresa) {
      fetchRecruiters();
    }
  }, [isOpen, empresa]);

  const fetchRecruiters = async () => {
    if (!empresa || !empresa.id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await reclutadoresApi.getByEmpresa(empresa.id);
      setRecruiters(data);
    } catch (err) {
      console.error('Error fetching recruiters:', err);
      setError('Error al cargar reclutadores');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !empresa) return null;

  return (
    <div className="opal-modal-overlay" onClick={onClose}>
      <div className="opal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="opal-modal-header">
          <h3>Reclutadores - Empresa {empresa.nombre}</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn-back-CP" 
              onClick={() => navigate('/Administrador/Usuarios')}
            >
              Gestionar Usuarios
            </button>
            <button className="modal-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="opal-modal-body">
          {loading ? (
            <p>Cargando reclutadores...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : recruiters.length > 0 ? (
            <div className="recruiters-table-container">
              <table className="recruiters-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>URL Foto Perfil</th>
                    <th>URL Banner</th>
                    <th>Fecha Nacimiento</th>
                    <th>Fecha Creación</th>
                    <th>Activo</th>
                    <th>Rol</th>
                    <th>Municipio</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiters.map((recruiter) => (
                    <tr key={recruiter.id}>
                      <td>{recruiter.id}</td>
                      <td>{recruiter.nombre}</td>
                      <td>{recruiter.apellido}</td>
                      <td>{recruiter.correo}</td>
                      <td>{recruiter.telefono || 'N/A'}</td>
                      <td>{recruiter.urlFotoPerfil || 'N/A'}</td>
                      <td>{recruiter.urlBanner || 'N/A'}</td>
                      <td>{recruiter.fechaNacimiento || 'N/A'}</td>
                      <td>{recruiter.fechaCreacion || 'N/A'}</td>
                      <td>{recruiter.isActive ? 'Sí' : 'No'}</td>
                      <td>{recruiter.rol}</td>
                      <td>{recruiter.municipio ? recruiter.municipio.nombre : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay reclutadores asociados a esta empresa.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruitersModal;