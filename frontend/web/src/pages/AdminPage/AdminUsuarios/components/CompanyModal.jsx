import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompanyModal({ show, onClose, company, loading }) {
  const navigate = useNavigate();
  const [showRaw, setShowRaw] = useState(false);
  if (!show) return null;
  return (
    <div className="modal-overlay-UP" onClick={onClose}>
      <div className="modal-content-UP hoja-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-UP hoja-modal-header">
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{fontSize:18, fontWeight:700}}>{company?.nombre || 'Empresa'}</div>
            {company?.logoUrl ? <img src={company.logoUrl} alt="logo" style={{width:48,height:48,borderRadius:6}} /> : null}
          </div>
          <div>
            <button className="modal-close-UP" onClick={onClose} aria-label="Cerrar">✖</button>
          </div>
        </div>

        <div className="modal-body-simple hoja-body-grid">
          {/** build bodyContent to avoid nested ternary JSX complexity */}
          {(() => {
            if (loading) return <p>Cargando empresa...</p>;
            if (!company) return <p>No hay datos de empresa disponibles.</p>;
            if (company.message) return <div style={{ padding: 12 }}><strong>{company.message}</strong></div>;

            return (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      ['ID', company.id],
                      ['Nombre', company.nombre],
                      ['Descripción', company.descripcion],
                      ['NIT', company.nit],
                      ['Razón Social', company.razonSocial],
                      ['Email', company.emailContacto],
                      ['Teléfono', company.telefonoContacto],
                      ['Website', company.website ? <a href={company.website} target="_blank" rel="noreferrer">{company.website}</a> : '-'],
                      ['Nº Trabajadores', company.numeroTrabajadores != null ? company.numeroTrabajadores : '-'],
                      ['Puntuación', company.puntuacion != null ? company.puntuacion : '-'],
                      ['Direcciones', Array.isArray(company.direcciones) ? company.direcciones.map(d => (typeof d === 'string' ? d : JSON.stringify(d))).join(', ') : (company.direcciones || '-')],
                      ['Redes Sociales', Array.isArray(company.redesSociales) ? company.redesSociales.join(', ') : (company.redesSociales || '-')],
                      ['Logo', company.logoUrl ? <img src={company.logoUrl} alt="logo" style={{ maxWidth: 160, maxHeight: 80, borderRadius: 6 }} /> : '-'],
                      ['Municipio', company.municipio ? company.municipio.nombre : '-'],
                      ['Categorías', Array.isArray(company.categories) ? company.categories.join(', ') : (company.categories || '-')],
                      ['Estado', company.isActive ? 'Activo' : 'Inactivo'],
                      ['Fecha Creación', company.fechaCreacion || '-'],
                      ['Fecha Actualización', company.fechaActualizacion || '-']
                    ].map(([label, value]) => (
                      <tr key={label} style={{ borderBottom: '1px solid #e6edf3' }}>
                        <td style={{ padding: 12, fontWeight: 700, width: '35%', verticalAlign: 'top' }}>{label}</td>
                        <td style={{ padding: 12 }}>{value ?? '-'}</td>
                      </tr>
                    ))}

                    {/* render any additional keys dynamically so nothing is hidden */}
                    {Object.keys(company || {}).filter(k => !['id','nombre','descripcion','nit','razonSocial','emailContacto','telefonoContacto','website','numeroTrabajadores','puntuacion','direcciones','redesSociales','logoUrl','municipio','categories','isActive','fechaCreacion','fechaActualizacion'].includes(k)).map((key) => (
                      <tr key={key} style={{ borderBottom: '1px solid #e6edf3' }}>
                        <td style={{ padding: 12, fontWeight: 700, width: '35%', verticalAlign: 'top' }}>{key}</td>
                        <td style={{ padding: 12 }}>{typeof company[key] === 'object' ? <pre style={{whiteSpace:'pre-wrap', margin:0}}>{JSON.stringify(company[key], null, 2)}</pre> : String(company[key])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 12, alignItems: 'center' }}>
                  <div>
                    <button className="btn-small ghost" onClick={() => setShowRaw((s) => !s)}>{showRaw ? 'Ocultar JSON' : 'Mostrar JSON'}</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button className="btn-back-CP" onClick={() => { onClose(); navigate('/Administrador/Empresas', { state: { empresaId: company.id } }); }}>Gestionar Empresa</button>
                    <button className="modal-close-btn" onClick={onClose}>Cerrar</button>
                  </div>
                </div>
                {showRaw && (
                  <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f8fafc', padding: 12, borderRadius: 6, marginTop: 12 }}>{JSON.stringify(company, null, 2)}</pre>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
