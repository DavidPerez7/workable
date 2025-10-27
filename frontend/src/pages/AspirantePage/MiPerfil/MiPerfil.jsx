
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
  // Estado del formulario - incluir todos los campos que espera el DTO
  const [editForm, setEditForm] = useState({
    nom: '',
    ape: '',
    corr: '',
    ubi: '',
    tel: '',
    feNa: '',
    foto: null,
    cla: '',
    numDoc: '',
    tipDoc_id: '',
    munici_id: '',
    genero_id: ''
  });
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
        // Mapear respuesta (AspiranteReadDto) al formulario
        setEditForm({
          nom: data.nom || '',
          ape: data.ape || '',
          corr: data.corr || data.corr || '',
          ubi: data.ubi || '',
          tel: data.tel || '',
          feNa: data.feNa ? new Date(data.feNa).toISOString().slice(0, 10) : '',
          foto: null,
          cla: '',
          numDoc: data.numerDoc || data.numDoc || '',
          tipDoc_id: data.tipDoc_id || '',
          munici_id: data.munici_id || '',
          genero_id: data.genero_id || ''
        });
      } catch (err) {
        console.error('Error cargar perfil:', err);
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
      // Construir el objeto DTO esperado por el backend usando los valores del formulario
      const body = {
        nom: editForm.nom,
        ape: editForm.ape,
        corr: editForm.corr,
        ubi: editForm.ubi,
        tel: editForm.tel ? Number(editForm.tel) : null,
        feNa: editForm.feNa || null,
        foto: null,
        cla: editForm.cla || '',
        numDoc: editForm.numDoc ? Number(editForm.numDoc) : null,
        tipDoc_id: editForm.tipDoc_id ? Number(editForm.tipDoc_id) : null,
        munici_id: editForm.munici_id ? Number(editForm.munici_id) : null,
        genero_id: editForm.genero_id ? Number(editForm.genero_id) : null
      };

      // Llamada al API
      const actualizado = await updateAspirante(idAspirante, body);

      // La API devuelve un AspiranteReadDto; actualizar el estado local con la respuesta
      setAspirante(prev => ({ ...prev, ...actualizado }));

      // Sincronizar el formulario con la última info desde el servidor
      setEditForm(prev => ({
        ...prev,
        nom: actualizado.nom || prev.nom,
        ape: actualizado.ape || prev.ape,
        corr: actualizado.corr || prev.corr,
        ubi: actualizado.ubi || prev.ubi,
        tel: actualizado.tel || prev.tel,
        feNa: actualizado.feNa ? new Date(actualizado.feNa).toISOString().slice(0, 10) : prev.feNa,
        numDoc: actualizado.numerDoc || prev.numDoc,
        tipDoc_id: actualizado.tipDoc_id || prev.tipDoc_id,
        munici_id: actualizado.munici_id || prev.munici_id,
        genero_id: actualizado.genero_id || prev.genero_id
      }));

      setShowEditModal(false);
      alert('Perfil actualizado correctamente');
    } catch (err) {
      // Mostrar mensaje detallado del error devuelto por la API si existe
      console.error(err);
      alert(err.message || 'Error al actualizar el perfil');
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
        console.error('Error eliminar cuenta:', err);
        alert('Error al eliminar la cuenta');
      }
    }
  };

  if (loading) {
    return (
      <>
        <HeaderAspirant />
        <Menu />
        <div className='loading-indicator'>Cargando perfil...</div>
      </>
    );
  }

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