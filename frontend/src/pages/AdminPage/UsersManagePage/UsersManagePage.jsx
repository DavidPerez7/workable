import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/Footer';
import './UsersManagePage.css';

function UsersManagePage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');


  const aspirantesEjemplo = [
    {
      aspiranteId: 1,
      nombre: 'Juan Carlos Pérez',
      correo: 'juan.perez@email.com',
      telefono: '3001234567',
      documento: '1020304050',
      tipoDocumento: 'C.C',
      ubicacion: 'Bogotá D.C',
      estadoCuenta: 'Activo',
      fechaRegistro: '2024-09-15',
      postulaciones: 12,
      experiencia: '3 años'
    },
    {
      aspiranteId: 2,
      nombre: 'María Fernanda López',
      correo: 'maria.lopez@email.com',
      telefono: '3012345678',
      documento: '1030405060',
      tipoDocumento: 'C.C',
      ubicacion: 'Medellín',
      estadoCuenta: 'Activo',
      fechaRegistro: '2024-09-20',
      postulaciones: 8,
      experiencia: '5 años'
    },
    {
      aspiranteId: 3,
      nombre: 'Carlos Andrés Gómez',
      correo: 'carlos.gomez@email.com',
      telefono: '3023456789',
      documento: '1040506070',
      tipoDocumento: 'C.C',
      ubicacion: 'Cali',
      estadoCuenta: 'Inactivo',
      fechaRegistro: '2024-08-10',
      postulaciones: 5,
      experiencia: '2 años'
    },
    {
      aspiranteId: 4,
      nombre: 'Ana Sofía Martínez',
      correo: 'ana.martinez@email.com',
      telefono: '3034567890',
      documento: '1050607080',
      tipoDocumento: 'C.C',
      ubicacion: 'Barranquilla',
      estadoCuenta: 'Activo',
      fechaRegistro: '2024-10-01',
      postulaciones: 15,
      experiencia: '7 años'
    },
    {
      aspiranteId: 5,
      nombre: 'Luis Eduardo Torres',
      correo: 'luis.torres@email.com',
      telefono: '3045678901',
      documento: '1060708090',
      tipoDocumento: 'C.C',
      ubicacion: 'Bogotá D.C',
      estadoCuenta: 'Activo',
      fechaRegistro: '2024-09-25',
      postulaciones: 10,
      experiencia: '4 años'
    },
    {
      aspiranteId: 6,
      nombre: 'Sandra Patricia Rojas',
      correo: 'sandra.rojas@email.com',
      telefono: '3056789012',
      documento: '1070809010',
      tipoDocumento: 'C.C',
      ubicacion: 'Medellín',
      estadoCuenta: 'Inactivo',
      fechaRegistro: '2024-07-15',
      postulaciones: 3,
      experiencia: '1 año'
    },
    {
      aspiranteId: 7,
      nombre: 'Roberto Jiménez Silva',
      correo: 'roberto.jimenez@email.com',
      telefono: '3067890123',
      documento: '1080910020',
      tipoDocumento: 'C.C',
      ubicacion: 'Cartagena',
      estadoCuenta: 'Activo',
      fechaRegistro: '2024-10-05',
      postulaciones: 6,
      experiencia: '2 años'
    }
  ];

  const [aspirantes, setAspirantes] = useState(aspirantesEjemplo);

  const aspirantesFiltrados = aspirantes.filter(aspirante => {
    const cumpleFiltroEstado = filtroEstado === 'todos' || aspirante.estadoCuenta === filtroEstado;
    const cumpleBusqueda = aspirante.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           aspirante.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           aspirante.documento.includes(busqueda);
    return cumpleFiltroEstado && cumpleBusqueda;
  });

  const handleActivar = (id) => {
    setAspirantes(aspirantes.map(asp => 
      asp.aspiranteId === id ? { ...asp, estadoCuenta: 'Activo' } : asp
    ));
  };

  const handleDesactivar = (id) => {
    if (window.confirm('¿Estás seguro de desactivar esta cuenta?')) {
      setAspirantes(aspirantes.map(asp => 
        asp.aspiranteId === id ? { ...asp, estadoCuenta: 'Inactivo' } : asp
      ));
    }
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este aspirante? Esta acción no se puede deshacer.')) {
      setAspirantes(aspirantes.filter(asp => asp.aspiranteId !== id));
    }
  };

  const handleVerPerfil = (id) => {
    navigate(`/admin/aspirantes/${id}`);
  };

  const getEstadoBadgeClass = (estado) => {
    return estado === 'Activo' ? 'badge-activo-UMP' : 'badge-inactivo-UMP';
  };

  const estadisticas = {
    total: aspirantes.length,
    activos: aspirantes.filter(a => a.estadoCuenta === 'Activo').length,
    inactivos: aspirantes.filter(a => a.estadoCuenta === 'Inactivo').length,
    totalPostulaciones: aspirantes.reduce((sum, a) => sum + a.postulaciones, 0)
  };

  return (
    <>
      <HeaderAdmin />
      <main className="main-users-manage-UMP">
        <div className="container-users-manage-UMP">
          

          <div className="header-section-UMP">
            <div>
              <h1 className="title-users-UMP">Gestión de Aspirantes</h1>
              <p className="subtitle-users-UMP">
                Administra las cuentas de aspirantes registrados en la plataforma
              </p>
            </div>
            <button 
              className="btn-back-UMP"
              onClick={() => navigate('/Administrador')}
            >
              ← Volver al Panel
            </button>
          </div>


          <div className="stats-section-UMP">
            <div className="stat-card-UMP stat-total-UMP">
              <div className="stat-icon-UMP">👥</div>
              <div>
                <div className="stat-number-UMP">{estadisticas.total}</div>
                <div className="stat-label-UMP">Total Aspirantes</div>
              </div>
            </div>
            <div className="stat-card-UMP stat-activos-UMP">
              <div className="stat-icon-UMP">✅</div>
              <div>
                <div className="stat-number-UMP">{estadisticas.activos}</div>
                <div className="stat-label-UMP">Cuentas Activas</div>
              </div>
            </div>
            <div className="stat-card-UMP stat-inactivos-UMP">
              <div className="stat-icon-UMP">⏸️</div>
              <div>
                <div className="stat-number-UMP">{estadisticas.inactivos}</div>
                <div className="stat-label-UMP">Cuentas Inactivas</div>
              </div>
            </div>
            <div className="stat-card-UMP stat-postulaciones-UMP">
              <div className="stat-icon-UMP">📝</div>
              <div>
                <div className="stat-number-UMP">{estadisticas.totalPostulaciones}</div>
                <div className="stat-label-UMP">Total Postulaciones</div>
              </div>
            </div>
          </div>


          <div className="filters-section-UMP">
            <div className="search-box-UMP">
              <input
                type="text"
                placeholder="Buscar por nombre, correo o documento..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input-UMP"
              />
              <span className="search-icon-UMP">🔍</span>
            </div>
            
            <div className="filter-group-UMP">
              <label className="filter-label-UMP">Estado:</label>
              <div className="filter-buttons-UMP">
                <button
                  className={`filter-btn-UMP ${filtroEstado === 'todos' ? 'active' : ''}`}
                  onClick={() => setFiltroEstado('todos')}
                >
                  Todos
                </button>
                <button
                  className={`filter-btn-UMP ${filtroEstado === 'Activo' ? 'active' : ''}`}
                  onClick={() => setFiltroEstado('Activo')}
                >
                  Activos
                </button>
                <button
                  className={`filter-btn-UMP ${filtroEstado === 'Inactivo' ? 'active' : ''}`}
                  onClick={() => setFiltroEstado('Inactivo')}
                >
                  Inactivos
                </button>
              </div>
            </div>
          </div>

          <div className="table-container-UMP">
            <table className="users-table-UMP">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Aspirante</th>
                  <th>Documento</th>
                  <th>Contacto</th>
                  <th>Ubicación</th>
                  <th>Experiencia</th>
                  <th>Postulaciones</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {aspirantesFiltrados.length > 0 ? (
                  aspirantesFiltrados.map(aspirante => (
                    <tr key={aspirante.aspiranteId}>
                      <td>{aspirante.aspiranteId}</td>
                      <td className="user-name-UMP">{aspirante.nombre}</td>
                      <td>
                        <div className="documento-info-UMP">
                          <span className="tipo-doc-UMP">{aspirante.tipoDocumento}</span>
                          <span>{aspirante.documento}</span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info-UMP">
                          <div>{aspirante.correo}</div>
                          <div className="phone-UMP">{aspirante.telefono}</div>
                        </div>
                      </td>
                      <td>{aspirante.ubicacion}</td>
                      <td className="experiencia-UMP">{aspirante.experiencia}</td>
                      <td className="postulaciones-count-UMP">{aspirante.postulaciones}</td>
                      <td>
                        <span className={`estado-badge-UMP ${getEstadoBadgeClass(aspirante.estadoCuenta)}`}>
                          {aspirante.estadoCuenta}
                        </span>
                      </td>
                      <td>{aspirante.fechaRegistro}</td>
                      <td>
                        <div className="actions-buttons-UMP">
                          <button
                            className="btn-action-UMP btn-view-UMP"
                            onClick={() => handleVerPerfil(aspirante.aspiranteId)}
                            title="Ver perfil"
                          >
                            👤
                          </button>
                          {aspirante.estadoCuenta === 'Activo' ? (
                            <button
                              className="btn-action-UMP btn-deactivate-UMP"
                              onClick={() => handleDesactivar(aspirante.aspiranteId)}
                              title="Desactivar"
                            >
                              ⏸️
                            </button>
                          ) : (
                            <button
                              className="btn-action-UMP btn-activate-UMP"
                              onClick={() => handleActivar(aspirante.aspiranteId)}
                              title="Activar"
                            >
                              ▶️
                            </button>
                          )}
                          <button
                            className="btn-action-UMP btn-delete-UMP"
                            onClick={() => handleEliminar(aspirante.aspiranteId)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="no-results-UMP">
                      No se encontraron aspirantes con los filtros seleccionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default UsersManagePage;