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

  const administradoresEjemplo = [
    {
      administradorId: 1,
      nombre: 'Carlos Mendoza',
      correo: 'carlos.mendoza@workable.com',
      telefono: '3001234567',
      fechaCreacion: '2024-01-15',
      ultimoAcceso: '2024-10-29 09:30',
      estado: 'Activo'
    },
    {
      administradorId: 2,
      nombre: 'Ana García',
      correo: 'ana.garcia@workable.com',
      telefono: '3012345678',
      fechaCreacion: '2024-03-20',
      ultimoAcceso: '2024-10-28 16:45',
      estado: 'Activo'
    },
    {
      administradorId: 3,
      nombre: 'Luis Torres',
      correo: 'luis.torres@workable.com',
      telefono: '3023456789',
      fechaCreacion: '2024-06-10',
      ultimoAcceso: '2024-10-29 08:15',
      estado: 'Activo'
    }
  ];

  const [administradores, setAdministradores] = useState(administradoresEjemplo);

  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contraseña: ''
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
      telefono: '',
      contraseña: ''
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

      setAdministradores(administradores.map(admin =>
        admin.administradorId === adminSeleccionado.administradorId
          ? {
              ...admin,
              nombre: formulario.nombre,
              correo: formulario.correo,
              telefono: formulario.telefono
            }
          : admin
      ));
      alert('Administrador actualizado correctamente');
    } else {

      const nuevoAdmin = {
        administradorId: administradores.length + 1,
        nombre: formulario.nombre,
        correo: formulario.correo,
        telefono: formulario.telefono,
        fechaCreacion: new Date().toISOString().split('T')[0],
        ultimoAcceso: 'Nunca',
        estado: 'Activo'
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
      telefono: admin.telefono,
      contraseña: ''
    });
    setMostrarFormulario(true);
  };

  const handleCambiarEstado = (id) => {
    setAdministradores(administradores.map(admin =>
      admin.administradorId === id
        ? { ...admin, estado: admin.estado === 'Activo' ? 'Inactivo' : 'Activo' }
        : admin
    ));
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este administrador? Esta acción no se puede deshacer.')) {
      setAdministradores(administradores.filter(admin => admin.administradorId !== id));
      alert('Administrador eliminado correctamente');
    }
  };

  const getEstadoBadgeClass = (estado) => {
    return estado === 'Activo' ? 'badge-activo-AAP' : 'badge-inactivo-AAP';
  };

  const estadisticas = {
    total: administradores.length,
    activos: administradores.filter(a => a.estado === 'Activo').length,
    inactivos: administradores.filter(a => a.estado === 'Inactivo').length
  };

  return (
    <>
      <HeaderAdmin />
      <main className="main-admin-accounts-AAP">
        <div className="container-admin-accounts-AAP">
          

          <div className="header-section-AAP">
            <div>
              <h1 className="title-admin-accounts-AAP">Gestión de Cuentas de Administrador</h1>
              <p className="subtitle-admin-accounts-AAP">
                Administra las cuentas internas de administradores de la plataforma
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
                onClick={() => navigate('/Administrador')}
              >
                ← Volver al Panel
              </button>
            </div>
          </div>


          <div className="info-box-AAP">
            <div className="info-icon-AAP">ℹ️</div>
            <div className="info-content-AAP">
              <strong>Nota:</strong> Esta sección es exclusiva para gestionar cuentas de administradores internos de la plataforma. 
              Los reclutadores (empresas) y aspirantes se gestionan desde sus respectivas secciones.
            </div>
          </div>


          <div className="quick-stats-AAP">
            <div className="stat-item-AAP">
              <div className="stat-icon-AAP">👥</div>
              <div>
                <div className="stat-number-AAP">{estadisticas.total}</div>
                <div className="stat-label-AAP">Total Administradores</div>
              </div>
            </div>
            <div className="stat-item-AAP">
              <div className="stat-icon-AAP">✅</div>
              <div>
                <div className="stat-number-AAP">{estadisticas.activos}</div>
                <div className="stat-label-AAP">Activos</div>
              </div>
            </div>
            <div className="stat-item-AAP">
              <div className="stat-icon-AAP">⏸️</div>
              <div>
                <div className="stat-number-AAP">{estadisticas.inactivos}</div>
                <div className="stat-label-AAP">Inactivos</div>
              </div>
            </div>
          </div>


          <div className="table-container-AAP">
            <table className="admins-table-AAP">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Fecha Creación</th>
                  <th>Último Acceso</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {administradores.map(admin => (
                  <tr key={admin.administradorId}>
                    <td>{admin.administradorId}</td>
                    <td className="admin-name-AAP">{admin.nombre}</td>
                    <td>{admin.correo}</td>
                    <td>{admin.telefono}</td>
                    <td>{admin.fechaCreacion}</td>
                    <td className="last-access-AAP">{admin.ultimoAcceso}</td>
                    <td>
                      <span className={`estado-badge-AAP ${getEstadoBadgeClass(admin.estado)}`}>
                        {admin.estado}
                      </span>
                    </td>
                    <td>
                      <div className="actions-buttons-AAP">
                        <button
                          className="btn-action-AAP btn-edit-AAP"
                          onClick={() => handleEditar(admin)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        {admin.estado === 'Activo' ? (
                          <button
                            className="btn-action-AAP btn-deactivate-AAP"
                            onClick={() => handleCambiarEstado(admin.administradorId)}
                            title="Desactivar"
                          >
                            ⏸️
                          </button>
                        ) : (
                          <button
                            className="btn-action-AAP btn-activate-AAP"
                            onClick={() => handleCambiarEstado(admin.administradorId)}
                            title="Activar"
                          >
                            ▶️
                          </button>
                        )}
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
                    <label htmlFor="telefono">Teléfono *</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formulario.telefono}
                      onChange={handleInputChange}
                      placeholder="3001234567"
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

                  <div className="form-info-AAP">
                    <h4>📋 Información importante:</h4>
                    <ul>
                      <li>Los administradores tienen acceso completo al panel de gestión de la plataforma</li>
                      <li>Pueden gestionar aspirantes, empresas (reclutadores), ofertas y ver reportes</li>
                      <li>La contraseña debe tener al menos 8 caracteres</li>
                      <li>Se recomienda usar correos corporativos (@workable.com)</li>
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