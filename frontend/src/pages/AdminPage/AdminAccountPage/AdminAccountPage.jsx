import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/Footer';
import './AdminAccountPage.css';

function AdminAccountPage() {
  const navigate = useNavigate();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [adminSeleccionado, setAdminSeleccionado] = useState(null);

  // Datos de ejemplo (sin API)
  const administradoresEjemplo = [
    {
      administradorId: 1,
      nombre: 'Carlos Mendoza',
      correo: 'carlos.mendoza@workable.com',
      rol: 'Super Admin',
      fechaCreacion: '2024-01-15',
      ultimoAcceso: '2024-10-29 09:30'
    },
    {
      administradorId: 2,
      nombre: 'Ana García',
      correo: 'ana.garcia@workable.com',
      rol: 'Admin',
      fechaCreacion: '2024-03-20',
      ultimoAcceso: '2024-10-28 16:45'
    },
    {
      administradorId: 3,
      nombre: 'Luis Torres',
      correo: 'luis.torres@workable.com',
      rol: 'Moderador',
      fechaCreacion: '2024-06-10',
      ultimoAcceso: '2024-10-29 08:15'
    }
  ];

  const [administradores, setAdministradores] = useState(administradoresEjemplo);

  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    rol: 'Admin'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const handleAbrirFormulario = () => {
    setMostrarFormulario(true);
    setModoEdicion(false);
    setFormulario({
      nombre: '',
      correo: '',
      contraseña: '',
      rol: 'Admin'
    });
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setModoEdicion(false);
    setAdminSeleccionado(null);
  };

  const handleCrearAdmin = (e) => {
    e.preventDefault();
    
    if (modoEdicion && adminSeleccionado) {
      // Editar administrador existente
      setAdministradores(administradores.map(admin =>
        admin.administradorId === adminSeleccionado.administradorId
          ? {
              ...admin,
              nombre: formulario.nombre,
              correo: formulario.correo,
              rol: formulario.rol
            }
          : admin
      ));
      alert('Administrador actualizado correctamente');
    } else {
      // Crear nuevo administrador
      const nuevoAdmin = {
        administradorId: administradores.length + 1,
        nombre: formulario.nombre,
        correo: formulario.correo,
        rol: formulario.rol,
        fechaCreacion: new Date().toISOString().split('T')[0],
        ultimoAcceso: 'Nunca'
      };
      setAdministradores([...administradores, nuevoAdmin]);
      alert('Administrador creado correctamente');
    }
    
    handleCerrarFormulario();
  };

  const handleEditar = (admin) => {
    setAdminSeleccionado(admin);
    setModoEdicion(true);
    setFormulario({
      nombre: admin.nombre,
      correo: admin.correo,
      contraseña: '',
      rol: admin.rol
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este administrador? Esta acción no se puede deshacer.')) {
      setAdministradores(administradores.filter(admin => admin.administradorId !== id));
      alert('Administrador eliminado correctamente');
    }
  };

  const getRolBadgeClass = (rol) => {
    switch(rol) {
      case 'Super Admin': return 'badge-super-admin-AAP';
      case 'Admin': return 'badge-admin-AAP';
      case 'Moderador': return 'badge-moderador-AAP';
      default: return '';
    }
  };

  return (
    <>
      <HeaderAdmin />
      <main className="main-admin-accounts-AAP">
        <div className="container-admin-accounts-AAP">
          
          {/* Encabezado */}
          <div className="header-section-AAP">
            <div>
              <h1 className="title-admin-accounts-AAP">Gestión de Cuentas de Administrador</h1>
              <p className="subtitle-admin-accounts-AAP">
                Administra las cuentas internas de la plataforma
              </p>
            </div>
            <div className="header-actions-AAP">
              <button 
                className="btn-create-AAP"
                onClick={handleAbrirFormulario}
              >
                + Crear Administrador
              </button>
              <button 
                className="btn-back-AAP"
                onClick={() => navigate('/admin')}
              >
                ← Volver al Panel
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="quick-stats-AAP">
            <div className="stat-item-AAP">
              <div className="stat-icon-AAP">👥</div>
              <div>
                <div className="stat-number-AAP">{administradores.length}</div>
                <div className="stat-label-AAP">Total Administradores</div>
              </div>
            </div>
            <div className="stat-item-AAP">
              <div className="stat-icon-AAP">⭐</div>
              <div>
                <div className="stat-number-AAP">
                  {administradores.filter(a => a.rol === 'Super Admin').length}
                </div>
                <div className="stat-label-AAP">Admin</div>
              </div>
            </div>
            <div className="stat-item-AAP">
              <div className="stat-icon-AAP">🔧</div>
              <div>
                <div className="stat-number-AAP">
                  {administradores.filter(a => a.rol === 'Moderador').length}
                </div>
                <div className="stat-label-AAP">Admin</div>
              </div>
            </div>
          </div>

          {/* Tabla de administradores */}
          <div className="table-container-AAP">
            <table className="admins-table-AAP">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Fecha Creación</th>
                  <th>Último Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {administradores.map(admin => (
                  <tr key={admin.administradorId}>
                    <td>{admin.administradorId}</td>
                    <td className="admin-name-AAP">{admin.nombre}</td>
                    <td>{admin.correo}</td>
                    <td>
                      <span className={`rol-badge-AAP ${getRolBadgeClass(admin.rol)}`}>
                        {admin.rol}
                      </span>
                    </td>
                    <td>{admin.fechaCreacion}</td>
                    <td className="last-access-AAP">{admin.ultimoAcceso}</td>
                    <td>
                      <div className="actions-buttons-AAP">
                        <button
                          className="btn-action-AAP btn-edit-AAP"
                          onClick={() => handleEditar(admin)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action-AAP btn-delete-AAP"
                          onClick={() => handleEliminar(admin.administradorId)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulario Modal */}
          {mostrarFormulario && (
            <div className="modal-overlay-AAP" onClick={handleCerrarFormulario}>
              <div className="modal-content-AAP" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-AAP">
                  <h2>{modoEdicion ? 'Editar Administrador' : 'Crear Nuevo Administrador'}</h2>
                  <button className="btn-close-modal-AAP" onClick={handleCerrarFormulario}>
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleCrearAdmin} className="form-admin-AAP">
                  <div className="form-group-AAP">
                    <label htmlFor="nombre">Nombre Completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={handleInputChange}
                      placeholder="Ingrese el nombre completo"
                      required
                    />
                  </div>

                  <div className="form-group-AAP">
                    <label htmlFor="correo">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="correo"
                      name="correo"
                      value={formulario.correo}
                      onChange={handleInputChange}
                      placeholder="correo@workable.com"
                      required
                    />
                  </div>

                  <div className="form-group-AAP">
                    <label htmlFor="contraseña">
                      {modoEdicion ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}
                    </label>
                    <input
                      type="password"
                      id="contraseña"
                      name="contraseña"
                      value={formulario.contraseña}
                      onChange={handleInputChange}
                      placeholder="Mínimo 8 caracteres"
                      required={!modoEdicion}
                      minLength={8}
                    />
                  </div>

                  <div className="form-group-AAP">
                    <label htmlFor="rol">Rol *</label>
                    <select
                      id="rol"
                      name="rol"
                      value={formulario.rol}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Admin</option>
                      <option value="Moderador">Admin</option>
                    </select>
                  </div>

                  <div className="form-info-AAP">
                    <h4>Permisos por rol:</h4>
                    <ul>
                      <li><strong>Admin:</strong> Acceso total a todas las funcionalidades</li>
                      <li><strong>Admin:</strong> Gestión de usuarios, empresas y ofertas</li>
                      <li><strong>Moderador:</strong> Revisión y moderación de contenido</li>
                    </ul>
                  </div>

                  <div className="form-actions-AAP">
                    <button type="button" className="btn-cancel-AAP" onClick={handleCerrarFormulario}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-submit-AAP">
                      {modoEdicion ? 'Actualizar' : 'Crear'} Administrador
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminAccountPage;