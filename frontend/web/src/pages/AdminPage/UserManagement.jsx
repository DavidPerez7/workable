import React, { useEffect, useState } from 'react';
import { userAPI } from '../../api/adminApi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await userAPI.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }

  async function createUser(payload) {
    try {
      const newUser = await userAPI.create(payload);
      setUsers((prev) => [newUser, ...prev]);
      setShowModal(false);
      setSuccess('Usuario creado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Error al crear usuario: ' + (err.response?.data?.message || err.message));
    }
  }

  async function updateUser(id, payload) {
    try {
      const updated = await userAPI.update(id, payload);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      setShowModal(false);
      setEditing(null);
      setSuccess('Usuario actualizado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Error al actualizar usuario: ' + (err.response?.data?.message || err.message));
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
      await userAPI.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSuccess('Usuario eliminado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error al eliminar usuario: ' + (err.response?.data?.message || err.message));
    }
  }

  async function toggleStatus(id, currentStatus) {
    try {
      let updated;
      if (currentStatus) {
        updated = await userAPI.deactivate(id);
      } else {
        updated = await userAPI.activate(id);
      }
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      setSuccess(`Usuario ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error toggling status:', err);
      setError('Error al cambiar estado del usuario');
    }
  }

  const filtered = users
    .filter((u) => (statusFilter === 'ALL' ? true : (statusFilter === 'ACTIVE' ? u.isActive : !u.isActive)))
    .filter((u) => query ? `${u.nombre} ${u.apellido} ${u.correo}`.toLowerCase().includes(query.toLowerCase()) : true);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) return <section><p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Cargando usuarios...</p></section>;

  return (
    <section>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', marginBottom: 16}}>
        <h1>Gestión de Usuarios (CRUD)</h1>
        <button onClick={() => { setEditing(null); setShowModal(true); }} style={btnStyle}>+ Crear Usuario</button>
      </div>

      {error && <div style={alertError}>{error}</div>}
      {success && <div style={alertSuccess}>{success}</div>}

      <div style={{ display: 'flex', gap: 12, marginTop: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <input 
          placeholder="Buscar por nombre, apellido o email" 
          value={query} 
          onChange={(e)=>{setQuery(e.target.value); setPage(1);}} 
          style={{...inputStyle, flex: 1, minWidth: '200px'}} 
        />
        <select 
          value={statusFilter} 
          onChange={(e)=>{setStatusFilter(e.target.value); setPage(1);}} 
          style={{...selectStyle, minWidth: '150px'}}
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Activos</option>
          <option value="INACTIVE">Inactivos</option>
        </select>
      </div>

      <div style={{ overflowX:'auto', background:'#fff', borderRadius:8, padding:16, boxShadow:'0 8px 20px rgba(2,6,23,0.06)'}}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ textAlign:'left', color:'#374151', borderBottom: '2px solid #e6edf3' }}>
            <tr>
              <th style={{ padding:12 }}>ID</th>
              <th style={{ padding:12 }}>Nombre</th>
              <th style={{ padding:12 }}>Apellido</th>
              <th style={{ padding:12 }}>Email</th>
              <th style={{ padding:12 }}>Estado</th>
              <th style={{ padding:12 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {current.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid #e6edf3', hover: { background: '#f9fafb' } }}>
                <td style={{ padding:12, fontWeight: 500 }}>{u.id}</td>
                <td style={{ padding:12 }}>{u.nombre}</td>
                <td style={{ padding:12 }}>{u.apellido}</td>
                <td style={{ padding:12 }}>{u.correo}</td>
                <td style={{ padding:12 }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: u.isActive ? '#dcfce7' : '#fee2e2',
                    color: u.isActive ? '#15803d' : '#991b1b'
                  }}>
                    {u.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding:12 }}>
                  <button 
                    onClick={() => { setEditing(u); setShowModal(true); }} 
                    style={{...actionBtn, marginRight: 6}}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => toggleStatus(u.id, u.isActive)} 
                    style={{...toggleBtn, marginRight: 6}}
                  >
                    {u.isActive ? '🔒 Desactivar' : '🔓 Activar'}
                  </button>
                  <button 
                    onClick={() => deleteUser(u.id)} 
                    style={{...deleteBtn}}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding:24, color:'#6b7280', textAlign: 'center' }}>
                  No hay usuarios que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:16 }}>
          <div style={{ color:'#6b7280', fontSize: '0.9rem' }}>
            Página {page} de {totalPages} (Total: {filtered.length} usuarios)
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={() => setPage((p)=>Math.max(1,p-1))} 
              disabled={page === 1}
              style={{...pageBtn, opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer'}}
            >
              ← Anterior
            </button>
            <button 
              onClick={() => setPage((p)=>Math.min(totalPages,p+1))} 
              disabled={page === totalPages}
              style={{...pageBtn, opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer'}}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <UserModal
          initial={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onCreate={createUser}
          onUpdate={updateUser}
          error={error}
        />
      )}
    </section>
  );
};

const UserModal = ({ initial, onClose, onCreate, onUpdate, error }) => {
  const [form, setForm] = useState(() => 
    initial || { 
      nombre: '', 
      apellido: '', 
      correo: '', 
      password: '',
      telefono: '',
      fechaNacimiento: ''
    }
  );
  const [formError, setFormError] = useState(null);

  function submit(e) {
    e.preventDefault();
    setFormError(null);

    if (!form.nombre.trim()) {
      setFormError('El nombre es obligatorio');
      return;
    }
    if (!form.apellido.trim()) {
      setFormError('El apellido es obligatorio');
      return;
    }
    if (!form.correo.includes('@')) {
      setFormError('El email debe ser válido');
      return;
    }
    if (!initial && !form.password) {
      setFormError('La contraseña es obligatoria para nuevos usuarios');
      return;
    }
    if (!initial && form.password && form.password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!form.fechaNacimiento && !initial) {
      setFormError('La fecha de nacimiento es obligatoria');
      return;
    }

    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      correo: form.correo,
      telefono: form.telefono,
      fechaNacimiento: form.fechaNacimiento
    };

    if (!initial) {
      payload.password = form.password;
    }

    if (initial) onUpdate(initial.id, payload);
    else onCreate(payload);
  }

  return (
    <div style={modalOverlay}>
      <form onSubmit={submit} style={modalBox}>
        <h3 style={{ marginTop: 0 }}>{initial ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
        
        {formError && <div style={{ ...alertError, marginBottom: 12 }}>{formError}</div>}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Nombre *</label>
            <input 
              value={form.nombre} 
              onChange={(e)=>setForm({...form,nombre:e.target.value})} 
              style={inputStyle} 
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Apellido *</label>
            <input 
              value={form.apellido} 
              onChange={(e)=>setForm({...form,apellido:e.target.value})} 
              style={inputStyle}
              required
            />
          </div>
        </div>

        <label style={labelStyle}>Email *</label>
        <input 
          type="email"
          value={form.correo} 
          onChange={(e)=>setForm({...form,correo:e.target.value})} 
          style={inputStyle}
          required
        />

        {!initial && (
          <>
            <label style={labelStyle}>Contraseña *</label>
            <input 
              type="password"
              value={form.password} 
              onChange={(e)=>setForm({...form,password:e.target.value})} 
              style={inputStyle}
              required
            />
          </>
        )}

        <label style={labelStyle}>Teléfono</label>
        <input 
          value={form.telefono} 
          onChange={(e)=>setForm({...form,telefono:e.target.value})} 
          style={inputStyle}
        />

        {!initial && (
          <>
            <label style={labelStyle}>Fecha de Nacimiento *</label>
            <input 
              type="date"
              value={form.fechaNacimiento} 
              onChange={(e)=>setForm({...form,fechaNacimiento:e.target.value})} 
              style={inputStyle}
              required
            />
          </>
        )}

        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:16 }}>
          <button type="button" onClick={onClose} style={btnStyleAlt}>Cancelar</button>
          <button type="submit" style={btnStyle}>{initial? 'Guardar cambios' : 'Crear usuario'}</button>
        </div>
      </form>
    </div>
  );
};

const inputStyle = { padding:10, borderRadius:6, border:'1px solid #e5e7eb', width:'100%', marginBottom: 12, fontSize: '0.95rem' };
const selectStyle = { padding:10, borderRadius:6, border:'1px solid #e5e7eb', fontSize: '0.95rem' };
const btnStyle = { background:'#2563eb', color:'#fff', padding:'10px 16px', borderRadius:6, border:'none', cursor:'pointer', fontWeight: 600, fontSize: '0.95rem' };
const btnStyleAlt = { background:'#f3f4f6', color:'#374151', padding:'10px 16px', borderRadius:6, border:'none', cursor:'pointer', fontWeight: 600, fontSize: '0.95rem' };
const actionBtn = { background:'#10b981', color:'#fff', padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer', fontSize: '0.9rem' };
const toggleBtn = { background:'#f59e0b', color:'#fff', padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer', fontSize: '0.9rem' };
const deleteBtn = { background:'#ef4444', color:'#fff', padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer', fontSize: '0.9rem' };
const pageBtn = { padding:'8px 12px', borderRadius:6, border:'1px solid #e5e7eb', background:'#fff', fontWeight: 500, cursor: 'pointer' };
const modalOverlay = { position:'fixed', inset:0, background:'rgba(2,6,23,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 };
const modalBox = { background:'#fff', padding:24, borderRadius:8, minWidth: 450, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow:'0 20px 50px rgba(2,6,23,0.3)' };
const labelStyle = { display:'block', marginTop:12, marginBottom:6, color:'#374151', fontWeight:600, fontSize: '0.95rem' };
const alertError = { padding: 12, borderRadius: 6, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: 12 };
const alertSuccess = { padding: 12, borderRadius: 6, background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', marginBottom: 12 };

export default UserManagement;
