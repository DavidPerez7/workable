import React, { useState } from 'react';
import './HojaDeVidaModal.css';

export default function HojaDeVidaModal(props) {
  const {
    show,
    onClose,
    selectedHojaDeVida,
    isEditing,
    hojaVidaFormData,
    onHojaVidaInputChange,
    handleEditHojaVida,
    handleSaveHojaVida,
    handleCancelEditHojaVida,
    handleSaveEstudio,
    handleDeleteEstudio,
    handleSaveExperiencia,
    handleDeleteExperiencia
  } = props;

  const [estudiosFormVisible, setEstudiosFormVisible] = useState(false);
  const [editingEstudio, setEditingEstudio] = useState(null);
  const [estudioForm, setEstudioForm] = useState({ institucion: '', titulo: '', fechaInicio: '', fechaFin: '' });
  const [experienciaFormVisible, setExperienciaFormVisible] = useState(false);
  const [editingExperiencia, setEditingExperiencia] = useState(null);
  const [experienciaForm, setExperienciaForm] = useState({ cargo: '', empresa: '', descripcion: '', fechaInicio: '', fechaFin: '' });

  if (!show || !selectedHojaDeVida) return null;

  return (
    <div className="modal-overlay-UP" onClick={onClose}>
      <div className="modal-content-UP hoja-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-UP hoja-modal-header">
          <div className="title-wrap">
            <div className="accent-dot" aria-hidden="true" />
            <div>
              <h2>Hoja de Vida</h2>
              <div className="modal-subtitle">Detalles, estudios y experiencias</div>
            </div>
          </div>
          <button className="modal-close-UP" onClick={onClose} aria-label="Cerrar">✖</button>
        </div>

        <div className="modal-body-simple hoja-body-grid">
          {/* Edit Mode */}
          {isEditing ? (
            <form className="hoja-edit-form" onSubmit={(e) => { e.preventDefault(); handleSaveHojaVida(); }}>
                <div className="hoja-form-grid hoja-edit-form">
                <div>
                  <label>Resumen Profesional</label>
                  <textarea name="resumenProfesional" value={hojaVidaFormData?.resumenProfesional || ''} onChange={onHojaVidaInputChange} rows={3} />
                </div>

                <div>
                  <label>Objetivo Profesional</label>
                  <textarea name="objetivoProfesional" value={hojaVidaFormData?.objetivoProfesional || ''} onChange={onHojaVidaInputChange} rows={3} />
                </div>

                <div className="hoja-two-cols">
                  <div>
                    <label>Red Social 1</label>
                    <input type="text" name="redSocial1" value={hojaVidaFormData?.redSocial1 || ''} onChange={onHojaVidaInputChange} />
                  </div>
                  <div>
                    <label>Red Social 2</label>
                    <input type="text" name="redSocial2" value={hojaVidaFormData?.redSocial2 || ''} onChange={onHojaVidaInputChange} />
                  </div>
                </div>

                <div className="hoja-form-row">
                  <div className="flex-1">
                    <label>Idiomas</label>
                    <input type="text" name="idiomas" value={hojaVidaFormData?.idiomas || ''} onChange={onHojaVidaInputChange} />
                  </div>
                  <div className="hoja-checkbox-row">
                    <label className="m-0">
                      <input type="checkbox" name="esPublica" checked={!!hojaVidaFormData?.esPublica} onChange={onHojaVidaInputChange} />
                      &nbsp;Pública
                    </label>
                  </div>
                </div>

                <div className="hoja-actions-row">
                  <button type="button" className="btn-small primary" onClick={handleSaveHojaVida}>Guardar</button>
                  <button type="button" className="btn-small ghost" onClick={handleCancelEditHojaVida}>Cancelar</button>
                </div>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="hoja-view">
              <div className="hoja-summary-card">
                  <div className="hoja-summary-header">
                  <div>
                      <div className="hoja-strong">{selectedHojaDeVida?.aspirante?.nombre || 'Aspirante'}</div>
                      <div className="hoja-small-txt">Hoja ID: {selectedHojaDeVida.id} · {selectedHojaDeVida.fechaCreacion}</div>
                      <div className="hoja-small-txt">Última actualización: {selectedHojaDeVida.fechaActualizacion || '-'}</div>
                  </div>
                  <div className="hoja-summary-actions">
                    <button className="btn-small primary" onClick={handleEditHojaVida}>Editar</button>
                    <button className="btn-small ghost" onClick={onClose}>Cerrar</button>
                  </div>
                </div>
                  <div className="hoja-right-stack">
                  <div className="meta-row"><strong>Id:</strong><span>{selectedHojaDeVida.id}</span></div>
                  <div className="meta-row"><strong>Aspirante:</strong><span>{selectedHojaDeVida?.aspirante?.nombre || 'N/A'}</span></div>
                  <div className="meta-row"><strong>Idiomas:</strong><span>{selectedHojaDeVida.idiomas || '-'}</span></div>
                  <div className="meta-row"><strong>Pública:</strong><span>{selectedHojaDeVida.esPublica ? 'Sí' : 'No'}</span></div>
                </div>
              </div>

              <div className="hoja-details-card">
                  <div className="hoja-card-title">Resumen</div>
                <div className="hoja-small-txt mt-04">{selectedHojaDeVida.resumenProfesional || 'Sin resumen'}</div>
                <div className="hoja-subtitle">Objetivo</div>
                <div className="hoja-small-txt mt-04">{selectedHojaDeVida.objetivoProfesional || 'Sin objetivo'}</div>
              </div>

              <div className="hoja-details-card">
                  <div className="hoja-card-title">Contacto / Redes</div>
                <div className="hoja-contacts">
                  <div>Red Social 1: {selectedHojaDeVida.redSocial1 || '-'}</div>
                  <div className="mt-04">Red Social 2: {selectedHojaDeVida.redSocial2 || '-'}</div>
                </div>
              </div>

              <div className="hoja-details-card">
                <div className="section-title">Estudios</div>
                {Array.isArray(selectedHojaDeVida.estudios) && selectedHojaDeVida.estudios.length > 0 ? (
                  selectedHojaDeVida.estudios.map((est) => (
                    <div key={est.id} className="list-item-simple">
                      <div>
                          <div className="hoja-subtitle">{est.titulo}</div>
                          <div className="hoja-small-txt">{est.institucion}</div>
                      </div>
                      <div className="hoja-list-actions">
                        <button className="btn-small ghost" onClick={() => { setEditingEstudio(est); setEstudioForm({ institucion: est.institucion || '', titulo: est.titulo || '', fechaInicio: est.fechaInicio || '', fechaFin: est.fechaFin || '' }); setEstudiosFormVisible(true); }}>Editar</button>
                        <button className="btn-small danger" onClick={() => handleDeleteEstudio(est.id)}>Eliminar</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No hay estudios</div>
                )}
                <div className="mt-06">
                  <button className="btn-small primary" onClick={() => { setEditingEstudio(null); setEstudiosFormVisible(true); setEstudioForm({ institucion: '', titulo: '', fechaInicio: '', fechaFin: '' }); }}>Añadir estudio</button>
                </div>
                {estudiosFormVisible && (
                  <div className="hoja-list-input">
                    <input placeholder="Institución" value={estudioForm?.institucion || ''} onChange={(e) => setEstudioForm({ ...estudioForm, institucion: e.target.value })} />
                    <input placeholder="Título" value={estudioForm?.titulo || ''} onChange={(e) => setEstudioForm({ ...estudioForm, titulo: e.target.value })} />
                    <div className="hoja-list-actions">
                      <button className="btn-small primary" onClick={async () => { try { await handleSaveEstudio(estudioForm, editingEstudio?.id); setEstudiosFormVisible(false); setEstudioForm({ institucion: '', titulo: '', fechaInicio: '', fechaFin: '' }); setEditingEstudio(null); } catch(e) { alert('Error guardando estudio: ' + e.message) } }}>Guardar</button>
                      <button className="btn-small ghost" onClick={() => { setEstudiosFormVisible(false); setEstudioForm({ institucion: '', titulo: '', fechaInicio: '', fechaFin: '' }); setEditingEstudio(null); }}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hoja-details-card">
                <div className="section-title">Experiencias</div>
                {Array.isArray(selectedHojaDeVida.experiencias) && selectedHojaDeVida.experiencias.length > 0 ? (
                  selectedHojaDeVida.experiencias.map((exp) => (
                    <div key={exp.id} className="list-item-simple">
                      <div>
                        <div className="hoja-subtitle">{exp.cargo}</div>
                        <div className="hoja-small-txt">{exp.empresa}</div>
                      </div>
                      <div className="hoja-list-actions">
                        <button className="btn-small ghost" onClick={() => { setEditingExperiencia(exp); setExperienciaForm({ cargo: exp.cargo || '', empresa: exp.empresa || '', descripcion: exp.descripcion || '', fechaInicio: exp.fechaInicio || '', fechaFin: exp.fechaFin || '' }); setExperienciaFormVisible(true); }}>Editar</button>
                        <button className="btn-small danger" onClick={() => handleDeleteExperiencia(exp.id)}>Eliminar</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No hay experiencias</div>
                )}
                <div className="mt-06">
                  <button className="btn-small primary" onClick={() => { setEditingExperiencia(null); setExperienciaFormVisible(true); setExperienciaForm({ cargo: '', empresa: '', descripcion: '', fechaInicio: '', fechaFin: '' }); }}>Añadir experiencia</button>
                </div>
                {experienciaFormVisible && (
                  <div className="hoja-list-input">
                    <input placeholder="Cargo" value={experienciaForm?.cargo || ''} onChange={(e) => setExperienciaForm({ ...experienciaForm, cargo: e.target.value })} />
                    <input placeholder="Empresa" value={experienciaForm?.empresa || ''} onChange={(e) => setExperienciaForm({ ...experienciaForm, empresa: e.target.value })} />
                    <div className="hoja-list-actions">
                      <button className="btn-small primary" onClick={async () => { try { await handleSaveExperiencia(experienciaForm, editingExperiencia?.id); setExperienciaFormVisible(false); setExperienciaForm({ cargo: '', empresa: '', descripcion: '', fechaInicio: '', fechaFin: '' }); setEditingExperiencia(null); } catch(e) { alert('Error guardando experiencia: ' + e.message) } }}>Guardar</button>
                      <button className="btn-small ghost" onClick={() => { setExperienciaFormVisible(false); setExperienciaForm({ cargo: '', empresa: '', descripcion: '', fechaInicio: '', fechaFin: '' }); setEditingExperiencia(null); }}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}