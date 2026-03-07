import React from 'react';

function EmpresasTable({ empresasFiltradas, getEstadoBadgeClass, handleEditEmpresa, handleAprobar, handleDesactivar, handleEliminar, onViewRecruiters, processingId }) {
  return (
    <div className="table-container-CP">
      <table className="companies-table-CP">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Número Trabajadores</th>
            <th>Puntuación</th>
            <th>Fecha Creación</th>
            <th>Email Contacto</th>
            <th>Teléfono Contacto</th>
            <th>Website</th>
            <th>Logo URL</th>
            <th>Redes Sociales</th>
            <th>Direcciones</th>
            <th>NIT</th>
            <th>Razón Social</th>
            <th>Código Invitación</th>
            <th>Reclutador Owner</th>
            <th>Categorías</th>
            <th>Municipio</th>
            <th>Reclutadores</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresasFiltradas.length > 0 ? (
            empresasFiltradas.map(empresa => (
              <tr key={empresa.id}>
                <td>{empresa.id}</td>
                <td className="empresa-name-CP">{empresa.nombre}</td>
                <td>{empresa.descripcion || 'N/A'}</td>
                <td>{empresa.numeroTrabajadores != null ? empresa.numeroTrabajadores : 'N/A'}</td>
                <td>{empresa.puntuacion != null ? empresa.puntuacion : 'N/A'}</td>
                <td>{empresa.fechaCreacion || 'N/A'}</td>
                <td>{empresa.emailContacto || 'N/A'}</td>
                <td>{empresa.telefonoContacto || 'N/A'}</td>
                <td>{empresa.website || 'N/A'}</td>
                <td>{empresa.logoUrl != null ? empresa.logoUrl : 'N/A'}</td>
                <td>{empresa.redesSociales && empresa.redesSociales.length > 0 ? empresa.redesSociales.join(', ') : 'N/A'}</td>
                <td>{empresa.direcciones && empresa.direcciones.length > 0 ? empresa.direcciones.join(', ') : 'N/A'}</td>
                <td>{empresa.nit}</td>
                <td>{empresa.razonSocial || 'N/A'}</td>
                <td>{empresa.codigoInvitacion || 'N/A'}</td>
                <td>{empresa.reclutadorOwner ? `${empresa.reclutadorOwner.nombre} ${empresa.reclutadorOwner.apellido}` : 'N/A'}</td>
                <td>{empresa.categories && empresa.categories.length > 0 ? [...empresa.categories].join(', ') : 'N/A'}</td>
                <td>{empresa.municipio ? empresa.municipio.nombre : 'N/A'}</td>
                <td>
                  <button
                    className="btn-action-CP btn-view-CP"
                    onClick={() => onViewRecruiters(empresa)}
                    title="Ver Reclutadores"
                    disabled={processingId === empresa.id}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </td>
                <td>
                  <span className={`estado-badge-CP ${getEstadoBadgeClass(empresa.isActive)}`}>
                    {empresa.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td>
                  <div className="actions-buttons-CP">
                    <button
                      className="btn-action-CP btn-edit-CP"
                      onClick={() => handleEditEmpresa(empresa)}
                      title="Editar"
                      disabled={processingId === empresa.id}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    {empresa.isActive ? (
                      <button
                        className="btn-action-CP btn-reject-CP"
                        onClick={() => handleDesactivar(empresa.id)}
                        title={processingId === empresa.id ? 'Procesando...' : 'Desactivar'}
                        disabled={processingId === empresa.id}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      </button>
                    ) : (
                      <button
                        className="btn-action-CP btn-approve-CP"
                        onClick={() => handleAprobar(empresa.id)}
                        title={processingId === empresa.id ? 'Procesando...' : 'Activar'}
                        disabled={processingId === empresa.id}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </button>
                    )}
                    <button
                      className="btn-action-CP btn-delete-CP"
                      onClick={() => handleEliminar(empresa.id)}
                      title="Eliminar"
                      disabled={processingId === empresa.id}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="21" className="no-results-CP">
                No se encontraron empresas con los filtros seleccionados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmpresasTable;