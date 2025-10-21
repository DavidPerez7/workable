
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaWheelchair } from 'react-icons/fa';
import { Eye, IdCard, Rocket, Settings } from 'lucide-react';
import HeaderAspirant from '../../../components/HeaderAspirant/HeaderAspirant';
import Menu from '../../../components/Menu/Menu';
import { buscarAspirantePorId, updateAspirante, eliminarAspirante } from '../../../api/aspirantesApi';
import './MiPerfil.css';

const MiPerfil = () => {
  // Hooks y lógica para datos persistentes
  const [aspirante, setAspirante] = useState(null);
  const [editForm, setEditForm] = useState({ nom: '', ape: '', correo: '', tel: '', ubi: '', nombreMunicipio: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Obtener el id y token del usuario (ajusta según tu lógica de autenticación)
  const idAspirante = localStorage.getItem('idAspirante');
  const token = localStorage.getItem('token');

  // Cargar datos del aspirante al montar
  useEffect(() => {
    async function fetchAspirante() {
      try {
        const data = await buscarAspirantePorId(idAspirante);
        setAspirante(data);
        setEditForm({
          nom: data.nom || '',
          ape: data.ape || '',
          corr: data.corr || '',
          tel: data.tel || '',
          ubi: data.ubi || '',
          nombreMunicipio: data.nombreMunicipio || ''
        });
      } catch (err) {
        alert('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    }
    if (idAspirante && token) fetchAspirante();
  }, [idAspirante, token]);

  // Guardar cambios en el perfil
  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      // Construir el objeto DTO esperado por el backend
      const body = {
        nom: editForm.nom,
        ape: editForm.ape,
        corr: aspirante.corr, // correo original, no editable
        ubi: editForm.ubi,
        tel: Number(editForm.tel),
        feNa: aspirante.feNa,
        foto: aspirante.foto || null,
        cla: '', // No se actualiza clave aquí
        numDoc: aspirante.numerDoc,
        tipDoc_id: aspirante.tipDoc_id,
        munici_id: aspirante.munici_id,
        genero_id: aspirante.genero_id
      };
      await updateAspirante(idAspirante, body);
      setAspirante(prev => ({ ...prev, ...editForm }));
      setShowEditModal(false);
      alert('Perfil actualizado correctamente');
    } catch (err) {
      alert('Error al actualizar el perfil');
    }
  };

  // Eliminar cuenta
  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        await eliminarAspirante(idAspirante);
        localStorage.removeItem('token');
        localStorage.removeItem('idAspirante');
        alert('Cuenta eliminada correctamente');
        window.location.href = '/';
      } catch (err) {
        alert('Error al eliminar la cuenta');
      }
    }
  };

  return (
    <>
      <HeaderAspirant />
      <Menu />
      {showEditModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2 className='modal-title'>Editar información personal</h2>
            <form onSubmit={handleEditSubmit} className='form-edit-perfil'>
              <div className='form-grid'>
                <div className='form-group'>
                  <label htmlFor='nom'>Nombre</label>
                  <input id='nom' type='text' value={editForm.nom} onChange={e => setEditForm({ ...editForm, nom: e.target.value })} required placeholder='Nombre' />
                </div>
                <div className='form-group'>
                  <label htmlFor='ape'>Apellido</label>
                  <input id='ape' type='text' value={editForm.ape} onChange={e => setEditForm({ ...editForm, ape: e.target.value })} required placeholder='Apellido' />
                </div>
                <div className='form-group'>
                  <label htmlFor='corr'>Correo electrónico</label>
                  <input id='corr' type='email' value={editForm.corr} onChange={e => setEditForm({ ...editForm, corr: e.target.value })} required placeholder='Correo electrónico' />
                </div>
                <div className='form-group'>
                  <label htmlFor='tel'>Número de teléfono</label>
                  <input id='tel' type='tel' value={editForm.tel} onChange={e => setEditForm({ ...editForm, tel: e.target.value })} required placeholder='Teléfono' />
                </div>
                <div className='form-group'>
                  <label htmlFor='ubi'>Ubicación</label>
                  <input id='ubi' type='text' value={editForm.ubi} onChange={e => setEditForm({ ...editForm, ubi: e.target.value })} required placeholder='Ubicación' />
                </div>
                <div className='form-group'>
                  <label htmlFor='feNa'>Fecha de nacimiento</label>
                  <input id='feNa' type='date' value={editForm.feNa || ''} onChange={e => setEditForm({ ...editForm, feNa: e.target.value })} required placeholder='Fecha de nacimiento' />
                </div>
                <div className='form-group'>
                  <label htmlFor='genero'>Género</label>
                  <select id='genero' value={editForm.genero_id || ''} onChange={e => setEditForm({ ...editForm, genero_id: e.target.value })} required>
                    <option value=''>Selecciona tu género</option>
                    <option value='1'>Masculino</option>
                    <option value='2'>Femenino</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label htmlFor='tipDoc_id'>Tipo de documento</label>
                  <select id='tipDoc_id' value={editForm.tipDoc_id || ''} onChange={e => setEditForm({ ...editForm, tipDoc_id: e.target.value })} required>
                    <option value=''>Tipo de Documento</option>
                    <option value='1'>CC</option>
                    <option value='2'>TI</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label htmlFor='numDoc'>Número de documento</label>
                  <input id='numDoc' type='number' value={editForm.numDoc || ''} onChange={e => setEditForm({ ...editForm, numDoc: e.target.value })} required placeholder='Número de documento' />
                </div>
                <div className='form-group'>
                  <label htmlFor='munici_id'>Municipio</label>
                  <select id='munici_id' value={editForm.munici_id || ''} onChange={e => setEditForm({ ...editForm, munici_id: e.target.value })} required>
                    <option value=''>Ciudad</option>
                    <option value='1'>Cali</option>
                    <option value='2'>Medellín</option>
                    <option value='3'>Bogotá</option>
                    <option value='4'>Barranquilla</option>
                    <option value='5'>Cartagena</option>
                  </select>
                </div>
              </div>
              <div className='modal-actions'>
                <button type='submit' className='btn-perfil'>Guardar</button>
                <button type='button' className='btn-perfil btn-eliminar' onClick={() => setShowEditModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <main className='main-computrabajo-layout centrado-grande'>
        <div className='perfil-computrabajo-card grande perfil-computrabajo-ancho'>
          <div className='perfil-computrabajo-header'>
            <div className='profile-pic-computrabajo'>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-photo" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="90" height="90">
                <circle cx="12" cy="13" r="10" stroke="#cbd5e1" strokeWidth="2" fill="#f7fafc" />
                <circle cx="12" cy="13" r="7" stroke="#cbd5e1" strokeWidth="1" fill="#fff" />
              </svg>
            </div>
            <div className='perfil-computrabajo-info'>
              <h2>{aspirante?.nom} {aspirante?.ape}</h2>
              <p>{aspirante?.cargo || 'Cargo no definido'}</p>
            </div>
          </div>
          <div className='perfil-computrabajo-body'>
            <div className='perfil-computrabajo-buttons'>
              <button className='btn-perfil' onClick={() => setShowEditModal(true)}><Settings /> Editar Perfil</button>
              <Link className='btn-perfil' to="/mis-ofertas"><Rocket /> Mis Ofertas</Link>
              <Link className='btn-perfil' to="/visualizar-perfil"><Eye /> Ver Perfil Público</Link>
              <Link className='btn-perfil' to="/notificaciones">Ver Notificaciones</Link>
              <div className='btn-perfil btn-eliminar' onClick={handleEliminar}>❌ Eliminar Cuenta</div>
            </div>
            <div className='perfil-computrabajo-personal'>
              <h3>Información personal</h3>
              <p><b>Documento:</b> {aspirante?.numDoc || aspirante?.numerDoc || 'N/A'}</p>
              <p><b>Nombre:</b> {aspirante?.nom || 'N/A'}</p>
              <p><b>Apellido:</b> {aspirante?.ape || 'N/A'}</p>
              <p><b>Correo electrónico:</b> {aspirante?.corr || 'N/A'}</p>
              <p><b>Teléfono:</b> {aspirante?.tel || 'N/A'}</p>
              <p><b>Ubicación:</b> {aspirante?.ubi || 'N/A'}</p>
              <p><b>Fecha de nacimiento:</b> {aspirante?.feNa ? (new Date(aspirante.feNa).toLocaleDateString()): 'N/A'}</p>
              <p><b>Género:</b> {aspirante?.nombreGenero || aspirante?.genero || 'N/A'}</p>
              <p><b>Municipio:</b> {aspirante?.municipio || aspirante?.nombreMunicipio || 'N/A'}</p>
              <p><b>Tipo de documento:</b> {aspirante?.nombreTipDoc || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className='panel-recomendaciones-aplicaciones'>
          <div className='panel-recomendaciones-card grande'>
            <h3>Ofertas que te pueden interesar</h3>
            <div className='panel-recomendaciones-list'>
              <div className='recomendacion-item'>
                <strong>Trabajo Desde Casa Analista de Personal</strong>
                <p>BairesDev LLC · Bogotá, D.C.</p>
                <span>Remoto · Hace 1 hora</span>
              </div>
              <div className='recomendacion-item'>
                <strong>Analista de gestión humana</strong>
                <p>Corpótex de Colombia · Bogotá, D.C.</p>
                <span>$1.900.000 · Más de 30 días</span>
              </div>
              <div className='recomendacion-item'>
                <strong>Analista en Fundación Cakike</strong>
                <p>Fundación Cakike · Bogotá, D.C.</p>
                <span>Hace 2 días</span>
              </div>
            </div>
          </div>
          <div className='aplicaciones-computrabajo-card grande' style={{marginTop: '24px'}}>
            <h3>Mis aplicaciones</h3>
            <div className='aplicaciones-computrabajo-list'>
              <div className='aplicacion-item'><span>✅ Aplicado</span> <span>0</span></div>
              <div className='aplicacion-item'><span>⏳ En proceso</span> <span>0</span></div>
              <div className='aplicacion-item'><span>👁️ HdV vista</span> <span>0</span></div>
              <div className='aplicacion-item'><span>🏆 Finalista</span> <span>0</span></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MiPerfil;