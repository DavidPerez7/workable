import React from 'react';

export default function OffersTable({ ofertas = [], onEdit = () => {}, onChangeState = () => {}, onDelete = () => {}, getEstadoBadgeClass = () => '', deletingIds = [], onViewPostulaciones = () => {} }) {
  if (!Array.isArray(ofertas)) return null;

  const formatDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toISOString().split('T')[0];
    } catch (e) {
      return d;
    }
  };

  const formatBenefits = (b) => {
    if (!b) return '—';
    if (Array.isArray(b)) return b.join(', ');
    if (typeof b === 'string') return b;
    if (b instanceof Set) return Array.from(b).join(', ');
    return String(b);
  };

  return (
    <div className="table-container-UP">
      <table className="table-UP">
        <thead>
            <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Empresa</th>
            <th>Empresa ID</th>
            <th>Municipio</th>
            <th>Municipio ID</th>
            <th>Modalidad</th>
            <th>Tipo Contrato</th>
            <th>Nivel Experiencia</th>
            <th>Salario</th>
            <th>Vacantes</th>
            <th>Estado</th>
            <th>Fecha Publicación</th>
            <th>Fecha Límite</th>
            <th>Requisitos</th>
            <th>Beneficios</th>
            <th>Postulaciones</th>
            <th>Punt.</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ofertas.length === 0 ? (
            <tr>
              <td colSpan={20} className="no-results-OP">No hay ofertas para mostrar</td>
            </tr>
          ) : (
            ofertas.map((oferta) => (
              <tr key={oferta.id}>
                <td>{oferta.id}</td>
                <td className="nombre-cell-UP">{oferta.titulo}</td>
                <td style={{ maxWidth: 300 }}>{oferta.descripcion ? (oferta.descripcion.length > 140 ? oferta.descripcion.slice(0, 140) + '…' : oferta.descripcion) : '—'}</td>
                <td>{oferta.empresa?.nombre || '—'}</td>
                <td>{oferta.empresa?.id ?? '—'}</td>
                <td>{oferta.municipio?.nombre || '—'}</td>
                <td>{oferta.municipio?.id ?? '—'}</td>
                <td>{oferta.modalidad || '—'}</td>
                <td>{oferta.tipoContrato || '—'}</td>
                <td>{oferta.nivelExperiencia || '—'}</td>
                <td>{oferta.salario?.toLocaleString ? oferta.salario.toLocaleString() : oferta.salario || '—'}</td>
                <td>{oferta.numeroVacantes ?? '—'}</td>
                <td>
                  <span
                    className={`status-badge-UP ${oferta.estado === 'ABIERTA' ? 'status-active-UP' : oferta.estado === 'CERRADA' ? 'status-inactive-UP' : ''}`}
                  >
                    {oferta.estado}
                  </span>
                </td>
                <td>{formatDate(oferta.fechaPublicacion)}</td>
                <td>{formatDate(oferta.fechaLimite)}</td>
                <td style={{ maxWidth: 240 }}>{oferta.requisitos ? (oferta.requisitos.length > 120 ? oferta.requisitos.slice(0, 120) + '…' : oferta.requisitos) : '—'}</td>
                <td>{formatBenefits(oferta.beneficios)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div>{oferta.postulacionesCount ?? 0}</div>
                    <button className="btn-action-UP" title="Ver postulaciones" onClick={() => onViewPostulaciones(oferta.id)}>Ver</button>
                  </div>
                </td>
                <td>{typeof oferta.puntuacion !== 'undefined' ? Number(oferta.puntuacion).toFixed(1) : '—'}</td>
                <td>
                  <div className="actions-UP">
                    <button className="btn-action-UP btn-edit-UP" aria-label={`Editar oferta ${oferta.id}`} title="Editar" onClick={() => onEdit(oferta)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    {oferta.estado === 'ABIERTA' ? (
                      <button className="btn-action-UP btn-deactivate-UP" aria-label={`Cerrar oferta ${oferta.id}`} title="Cerrar" onClick={() => onChangeState(oferta.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                      </button>
                    ) : (
                      <button className="btn-action-UP btn-activate-UP" aria-label={`Abrir oferta ${oferta.id}`} title="Abrir" onClick={() => onChangeState(oferta.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                    )}
                    <button className="btn-action-UP btn-delete-UP" aria-label={`Eliminar oferta ${oferta.id}`} title="Eliminar" onClick={() => onDelete(oferta.id)} disabled={deletingIds.includes(oferta.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
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
          )}
        </tbody>
      </table>
    </div>
  );
}
