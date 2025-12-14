import React, { useState } from 'react';
import hojaDeVidaApi from '/src/api/hojaDeVidaAPI.js';
import { getMunicipios } from '/src/api/municipioAPI.js';
import API from '/src/api/axiosConfig.js';
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
    handleDeleteHojaVida,
    handleSaveEstudio,
    handleDeleteEstudio,
    handleSaveExperiencia,
    handleDeleteExperiencia
  } = props;

  const [estudiosFormVisible, setEstudiosFormVisible] = useState(false);
  const [editingEstudio, setEditingEstudio] = useState(null);
  const [estudioForm, setEstudioForm] = useState({
    titulo: '',
    fechaInicio: '',
    fechaFin: '',
    enCurso: false,
    institucion: '',
    certificadoUrl: '',
    descripcion: '',
    modalidad: '',
    nivelEducativo: '',
    estadoEstudio: 'ACTIVO',
    municipioId: null
  });
  const [experienciaFormVisible, setExperienciaFormVisible] = useState(false);
  const [editingExperiencia, setEditingExperiencia] = useState(null);
  const [experienciaForm, setExperienciaForm] = useState({ cargo: '', empresa: '', descripcion: '', fechaInicio: '', fechaFin: '', enCurso: false, municipioId: null, estado: 'ACTIVO' });
  const [municipios, setMunicipios] = useState([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  // Inline field editing state
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [savingField, setSavingField] = useState(false);

  if (!show || !selectedHojaDeVida) return null;

  const aspirante = selectedHojaDeVida?.aspirante || {};
  const nombreCompleto = [aspirante.nombre, aspirante.apellido].filter(Boolean).join(' ');
  const initials = (aspirante.nombre?.[0] || '') + (aspirante.apellido?.[0] || '');

  const startEdit = (field, initial = '') => {
    setEditingField(field);
    setFieldValue(initial ?? '');
  };

  // Fetch municipios list when experiencia form is opened (for the municipio select)
  React.useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoadingMunicipios(true);
        const data = await getMunicipios();
        if (mounted) setMunicipios(data || []);
      } catch (e) {
        console.error('Error cargando municipios:', e.message || e);
      } finally {
        if (mounted) setLoadingMunicipios(false);
      }
    };
    if (experienciaFormVisible) fetch();
    return () => { mounted = false; };
  }, [experienciaFormVisible]);

  const cancelEdit = () => {
    setEditingField(null);
    setFieldValue('');
  };

  const saveField = async () => {
    if (!editingField) return;
    setSavingField(true);
    try {
      const mapping = { resumen: 'resumenProfesional', objetivo: 'objetivoProfesional', red1: 'redSocial1', idiomas: 'idiomas', public: 'esPublica', contacto: 'contactoEmail', telefono: 'telefono' };
      const key = mapping[editingField];
      let value = fieldValue;
      if (editingField === 'public') value = !!value;

      const payload = { ...selectedHojaDeVida, [key]: value };

      let updated;
      try {
        updated = await hojaDeVidaApi.actualizarHojaDeVida(selectedHojaDeVida.id, payload);
      } catch (e) {
        // fallback
        const resp = await API.put(`/api/hoja-vida/${selectedHojaDeVida.id}`, payload);
        updated = resp.data;
      }

      if (props.handleUpdateHojaDeVida) {
        props.handleUpdateHojaDeVida(updated);
      }
      setEditingField(null);
    } catch (e) {
      console.error('Error saving field:', e);
      alert('Error guardando campo.');
    } finally {
      setSavingField(false);
    }
  };

  return (
    <div className="modal-overlay-UP" onClick={onClose}>
      <div className="modal-content-UP hoja-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-UP hoja-modal-header">
          <div className="hoja-summary-header">
            <div className="hoja-avatar">
              {aspirante.urlFotoPerfil ? (
                <img src={aspirante.urlFotoPerfil} alt={`${nombreCompleto} foto`} />
              ) : (
                <div className="hoja-avatar-placeholder">{initials.toUpperCase()}</div>
              )}
            </div>
            <div>
              <div className="hoja-strong">{nombreCompleto || 'Aspirante'}</div>
              <div className="hoja-small-txt">Hoja ID: {selectedHojaDeVida.id} · {selectedHojaDeVida.fechaCreacion}</div>
              <div className="hoja-small-txt">Última actualización: {selectedHojaDeVida.fechaActualizacion || '-'}</div>
            </div>
          </div>
          <div className="hoja-header-actions">
            <button className="btn-small danger" onClick={() => { if (confirm('¿Eliminar esta Hoja de Vida? Esta acción es irreversible.')) { if (handleDeleteHojaVida) handleDeleteHojaVida(); } }}>Eliminar</button>
            <button className="modal-close-UP" onClick={onClose} aria-label="Cerrar">✖</button>
          </div>
        </div>

        <div className="modal-body-simple hoja-body-grid">
          <div className="hoja-view">
              <div className="hoja-details-card">
                <div className="meta-column">
                  <div className="meta-row">
                    <div className="meta-row-left">
                      <strong>Idiomas:</strong> <span className="mt-00">{selectedHojaDeVida.idiomas || '-'}</span>
                    </div>
                    <div className="meta-row-action">
                      <button className="btn-small ghost btn-edit" onClick={() => startEdit('idiomas', selectedHojaDeVida.idiomas)}>✎</button>
                    </div>
                  </div>
                  {editingField === 'idiomas' ? (
                    <div className="hoja-list-input mt-04">
                      <input value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} />
                      <div className="hoja-list-actions">
                        <button className="btn-small primary" onClick={saveField} disabled={savingField}>Guardar</button>
                        <button className="btn-small ghost" onClick={cancelEdit}>Cancelar</button>
                      </div>
                    </div>
                  ) : null}

                  <div className="meta-row">
                    <div className="meta-row-left">
                      <strong>Pública:</strong> <span className="mt-00">{selectedHojaDeVida.esPublica ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="meta-row-action">
                      <button className="btn-small ghost btn-edit" onClick={() => startEdit('public', selectedHojaDeVida.esPublica)}>✎</button>
                    </div>
                  </div>
                  {editingField === 'public' ? (
                    <div className="hoja-list-input mt-04">
                      <label><input type="checkbox" checked={!!fieldValue} onChange={(e) => setFieldValue(e.target.checked)} /> Pública</label>
                      <div className="hoja-list-actions">
                        <button className="btn-small primary" onClick={saveField} disabled={savingField}>Guardar</button>
                        <button className="btn-small ghost" onClick={cancelEdit}>Cancelar</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="hoja-details-card">
                  <div className="meta-row">
                    <div className="meta-row-left hoja-card-title">Resumen</div>
                    <div className="meta-row-action">
                      <button className="btn-small ghost btn-edit" onClick={() => startEdit('resumen', selectedHojaDeVida.resumenProfesional)}>✎</button>
                    </div>
                  </div>
                {editingField === 'resumen' ? (
                  <div>
                    <textarea value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} rows={4} />
                    <div className="hoja-actions-row mt-04">
                      <button className="btn-small primary" onClick={saveField} disabled={savingField}>Guardar</button>
                      <button className="btn-small ghost" onClick={cancelEdit}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="hoja-small-txt mt-04">{selectedHojaDeVida.resumenProfesional || 'Sin resumen'}</div>
                )}

                <div className="meta-row">
                  <div className="meta-row-left hoja-subtitle">Objetivo</div>
                  <div className="meta-row-action">
                    <button className="btn-small ghost ml-04 btn-edit" onClick={() => startEdit('objetivo', selectedHojaDeVida.objetivoProfesional)}>✎</button>
                  </div>
                </div>
                {editingField === 'objetivo' ? (
                  <div>
                    <textarea value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} rows={3} />
                    <div className="hoja-actions-row mt-04">
                      <button className="btn-small primary" onClick={saveField} disabled={savingField}>Guardar</button>
                      <button className="btn-small ghost" onClick={cancelEdit}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="hoja-small-txt mt-04">{selectedHojaDeVida.objetivoProfesional || 'Sin objetivo'}</div>
                )}
              </div>

              <div className="hoja-details-card">
                  <div className="hoja-card-title">Contacto / Redes</div>
                <div className="hoja-contacts">
                  <div className="meta-row-compact">
                    <div className="meta-row-left">
                      <strong>Red Social 1:</strong> <span className="mt-00">{selectedHojaDeVida.redSocial1 || '-'}</span>
                    </div>
                    <div className="meta-row-action">
                      <button className="btn-small ghost btn-edit" onClick={() => startEdit('red1', selectedHojaDeVida.redSocial1)}>✎</button>
                    </div>
                  </div>
                  {editingField === 'red1' ? (
                    <div className="hoja-list-input mt-04">
                      <input value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} />
                      <div className="hoja-list-actions">
                        <button className="btn-small primary" onClick={saveField} disabled={savingField}>Guardar</button>
                        <button className="btn-small ghost" onClick={cancelEdit}>Cancelar</button>
                      </div>
                    </div>
                  ) : null}

                    <div className="mt-04 meta-row-compact">
                      <div className="meta-row-left">
                        <strong>Contacto:</strong> <span className="mt-00">{selectedHojaDeVida.contactoEmail || (aspirante && aspirante.correo) || '-'}</span>
                      </div>
                      <div className="meta-row-action">
                        <button className="btn-small ghost btn-edit" onClick={() => startEdit('contacto', selectedHojaDeVida.contactoEmail || (aspirante && aspirante.correo))}>✎</button>
                      </div>
                    </div>
                    {editingField === 'contacto' ? (
                      <div className="hoja-list-input mt-04">
                        <input type="email" value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} />
                        <div className="hoja-list-actions">
                          <button className="btn-small primary" onClick={saveField} disabled={savingField}>Guardar</button>
                          <button className="btn-small ghost" onClick={cancelEdit}>Cancelar</button>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-04 meta-row-compact">
                      <div className="meta-row-left">
                        <strong>Teléfono:</strong> <span className="mt-00">{selectedHojaDeVida.telefono || (aspirante && aspirante.telefono) || '-'}</span>
                      </div>
                      <div className="meta-row-action">
                        <button className="btn-small ghost btn-edit" onClick={() => startEdit('telefono', selectedHojaDeVida.telefono || (aspirante && aspirante.telefono))}>✎</button>
                      </div>
                    </div>
                    {editingField === 'telefono' ? (
                      <div className="hoja-list-input mt-04">
                        <input type="tel" value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} />
                        <div className="hoja-list-actions">
                          <button className="btn-small primary" onClick={saveField} disabled={savingField}>Guardar</button>
                          <button className="btn-small ghost" onClick={cancelEdit}>Cancelar</button>
                        </div>
                      </div>
                    ) : null}
                </div>
              </div>

              {/* Editing inputs for Idiomas and Pública are rendered inline inside their Hoja details card */}

              <div className="hoja-details-card">
                <div className="section-title">Estudios</div>
                {Array.isArray(selectedHojaDeVida.estudios) && selectedHojaDeVida.estudios.length > 0 ? (
                  selectedHojaDeVida.estudios.map((est) => (
                    editingEstudio && editingEstudio.id === est.id && estudiosFormVisible ? (
                      <div key={est.id} className="list-item-simple form-inline">
                        <div className="hoja-list-input estudio-form">
                          <div className="estudio-grid two-col">
                            <div>
                              <label>Título *</label>
                              <input placeholder="Título" value={estudioForm?.titulo || ''} onChange={(e) => setEstudioForm({ ...estudioForm, titulo: e.target.value })} />
                            </div>
                            <div>
                              <label>Institución *</label>
                              <input placeholder="Institución" value={estudioForm?.institucion || ''} onChange={(e) => setEstudioForm({ ...estudioForm, institucion: e.target.value })} />
                            </div>
                            <div>
                              <label>Fecha inicio *</label>
                              <input type="date" value={estudioForm?.fechaInicio || ''} onChange={(e) => setEstudioForm({ ...estudioForm, fechaInicio: e.target.value })} />
                            </div>
                            {!estudioForm.enCurso && (
                              <div>
                                <label>Fecha fin</label>
                                <input type="date" value={estudioForm?.fechaFin || ''} onChange={(e) => setEstudioForm({ ...estudioForm, fechaFin: e.target.value })} />
                              </div>
                            )}
                            <div className="checkbox-row">
                              <label className="checkbox-inline-label"><input type="checkbox" checked={!!estudioForm.enCurso} onChange={(e) => setEstudioForm({ ...estudioForm, enCurso: e.target.checked, fechaFin: e.target.checked ? null : estudioForm.fechaFin })} /> En curso</label>
                            </div>
                            <div>
                              <label>Modalidad</label>
                              <select value={estudioForm.modalidad || ''} onChange={(e) => setEstudioForm({ ...estudioForm, modalidad: e.target.value })}>
                                <option value="">--</option>
                                <option value="PRESENCIAL">PRESENCIAL</option>
                                <option value="VIRTUAL">VIRTUAL</option>
                                <option value="HIBRIDA">HIBRIDA</option>
                              </select>
                            </div>
                            <div>
                              <label>Nivel educativo *</label>
                              <select value={estudioForm.nivelEducativo || ''} onChange={(e) => setEstudioForm({ ...estudioForm, nivelEducativo: e.target.value })}>
                                <option value="">--</option>
                                <option value="PRIMARIA">PRIMARIA</option>
                                <option value="BACHILLERATO">BACHILLERATO</option>
                                <option value="TECNICO">TECNICO</option>
                                <option value="TECNOLOGO">TECNOLOGO</option>
                                <option value="LICENCIATURA">LICENCIATURA</option>
                                <option value="UNIVERSITARIO">UNIVERSITARIO</option>
                                <option value="ESPECIALIZACION">ESPECIALIZACION</option>
                                <option value="MAESTRIA">MAESTRIA</option>
                                <option value="DOCTORADO">DOCTORADO</option>
                              </select>
                            </div>
                          </div>
                          <div className="two-col full-width">
                            <div>
                              <label>URL certificado</label>
                              <input placeholder="URL certificado (opcional)" value={estudioForm?.certificadoUrl || ''} onChange={(e) => setEstudioForm({ ...estudioForm, certificadoUrl: e.target.value })} />
                            </div>
                            <div>
                              <label>Estado</label>
                              <select value={estudioForm.estadoEstudio || 'ACTIVO'} onChange={(e) => setEstudioForm({ ...estudioForm, estadoEstudio: e.target.value })}>
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="INACTIVO">INACTIVO</option>
                              </select>
                            </div>
                          </div>
                          <div className="full-width">
                            <label>Descripción</label>
                            <textarea placeholder="Descripción (opcional)" value={estudioForm?.descripcion || ''} onChange={(e) => setEstudioForm({ ...estudioForm, descripcion: e.target.value })} />
                          </div>
                          <div className="hoja-list-actions">
                            <button className="btn-small primary" onClick={async () => {
                              try {
                                // Basic validation preserved
                                if (!estudioForm.titulo || !estudioForm.institucion || !estudioForm.fechaInicio || !estudioForm.nivelEducativo) {
                                  alert('Por favor completa Título, Institución, Fecha inicio y Nivel educativo.');
                                  return;
                                }
                                if (estudioForm.enCurso && estudioForm.fechaFin) {
                                  alert('Un estudio en curso no puede tener fecha de fin');
                                  return;
                                }
                                if (!estudioForm.enCurso && estudioForm.fechaFin && estudioForm.fechaInicio && new Date(estudioForm.fechaFin) < new Date(estudioForm.fechaInicio)) {
                                  alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
                                  return;
                                }
                                await handleSaveEstudio(estudioForm, editingEstudio?.id);
                                setEstudiosFormVisible(false);
                                setEstudioForm({ titulo: '', fechaInicio: '', fechaFin: '', enCurso:false, institucion: '', certificadoUrl: '', descripcion:'', modalidad:'', nivelEducativo:'', estadoEstudio:'ACTIVO', municipioId:null });
                                setEditingEstudio(null);
                              } catch(e) { alert('Error guardando estudio: ' + e.message) }
                            }}>Guardar</button>
                            <button className="btn-small danger" onClick={() => { setEstudiosFormVisible(false); setEstudioForm({ titulo: '', fechaInicio: '', fechaFin: '', enCurso:false, institucion: '', certificadoUrl: '', descripcion:'', modalidad:'', nivelEducativo:'', estadoEstudio:'ACTIVO', municipioId:null }); setEditingEstudio(null); }}>Cancelar</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={est.id} className="list-item-simple">
                        <div>
                            <div className="hoja-subtitle">{est.titulo}</div>
                            <div className="hoja-small-txt">{est.institucion}</div>
                        </div>
                        <div className="hoja-list-actions">
                          <button className="btn-small ghost" onClick={() => { setEditingEstudio(est); setEstudioForm({ titulo: est.titulo || '', fechaInicio: est.fechaInicio || '', fechaFin: est.fechaFin || '', enCurso: !!est.enCurso, institucion: est.institucion || '', certificadoUrl: est.certificadoUrl || '', descripcion: est.descripcion || '', modalidad: est.modalidad || '', nivelEducativo: est.nivelEducativo || '', estadoEstudio: est.estadoEstudio || 'ACTIVO', municipioId: est.municipio?.id || null }); setEstudiosFormVisible(true); }}>Editar</button>
                          <button className="btn-small danger" onClick={() => { if (confirm('¿Eliminar este estudio? Esta acción es irreversible.')) handleDeleteEstudio(est.id); }}>Eliminar</button>
                        </div>
                      </div>
                    )
                  ))
                ) : (
                  <div className="text-muted">No hay estudios</div>
                )}
                <div className="mt-06">
                  <button className="btn-small primary" onClick={() => { setEditingEstudio(null); setEstudiosFormVisible(true); setEstudioForm({ titulo: '', fechaInicio: '', fechaFin: '', enCurso:false, institucion: '', certificadoUrl: '', descripcion:'', modalidad:'', nivelEducativo:'', estadoEstudio:'ACTIVO', municipioId:null }); }}>Añadir estudio</button>
                </div>
                {estudiosFormVisible && !editingEstudio && (
                  <div className="hoja-list-input estudio-form">
                    <div className="estudio-grid two-col">
                      <div>
                        <label>Título *</label>
                        <input placeholder="Título" value={estudioForm?.titulo || ''} onChange={(e) => setEstudioForm({ ...estudioForm, titulo: e.target.value })} />
                      </div>
                      <div>
                        <label>Institución *</label>
                        <input placeholder="Institución" value={estudioForm?.institucion || ''} onChange={(e) => setEstudioForm({ ...estudioForm, institucion: e.target.value })} />
                      </div>
                      <div>
                        <label>Fecha inicio *</label>
                        <input type="date" value={estudioForm?.fechaInicio || ''} onChange={(e) => setEstudioForm({ ...estudioForm, fechaInicio: e.target.value })} />
                      </div>
                      {!estudioForm.enCurso && (
                        <div>
                          <label>Fecha fin</label>
                          <input type="date" value={estudioForm?.fechaFin || ''} onChange={(e) => setEstudioForm({ ...estudioForm, fechaFin: e.target.value })} />
                        </div>
                      )}
                      <div className="checkbox-row">
                        <label className="checkbox-inline-label"><input type="checkbox" checked={!!estudioForm.enCurso} onChange={(e) => setEstudioForm({ ...estudioForm, enCurso: e.target.checked, fechaFin: e.target.checked ? null : estudioForm.fechaFin })} /> En curso</label>
                      </div>
                      <div>
                        <label>Modalidad</label>
                        <select value={estudioForm.modalidad || ''} onChange={(e) => setEstudioForm({ ...estudioForm, modalidad: e.target.value })}>
                          <option value="">--</option>
                          <option value="PRESENCIAL">PRESENCIAL</option>
                          <option value="VIRTUAL">VIRTUAL</option>
                          <option value="HIBRIDA">HIBRIDA</option>
                        </select>
                      </div>
                      <div>
                        <label>Nivel educativo *</label>
                        <select value={estudioForm.nivelEducativo || ''} onChange={(e) => setEstudioForm({ ...estudioForm, nivelEducativo: e.target.value })}>
                          <option value="">--</option>
                          <option value="PRIMARIA">PRIMARIA</option>
                          <option value="BACHILLERATO">BACHILLERATO</option>
                          <option value="TECNICO">TECNICO</option>
                          <option value="TECNOLOGO">TECNOLOGO</option>
                          <option value="LICENCIATURA">LICENCIATURA</option>
                          <option value="UNIVERSITARIO">UNIVERSITARIO</option>
                          <option value="ESPECIALIZACION">ESPECIALIZACION</option>
                          <option value="MAESTRIA">MAESTRIA</option>
                          <option value="DOCTORADO">DOCTORADO</option>
                        </select>
                      </div>
                    </div>
                    <div className="two-col full-width">
                      <div>
                        <label>URL certificado</label>
                        <input placeholder="URL certificado (opcional)" value={estudioForm?.certificadoUrl || ''} onChange={(e) => setEstudioForm({ ...estudioForm, certificadoUrl: e.target.value })} />
                      </div>
                      <div>
                        <label>Estado</label>
                        <select value={estudioForm.estadoEstudio || 'ACTIVO'} onChange={(e) => setEstudioForm({ ...estudioForm, estadoEstudio: e.target.value })}>
                          <option value="ACTIVO">ACTIVO</option>
                          <option value="INACTIVO">INACTIVO</option>
                        </select>
                      </div>
                    </div>
                    <div className="full-width">
                      <label>Descripción</label>
                      <textarea placeholder="Descripción (opcional)" value={estudioForm?.descripcion || ''} onChange={(e) => setEstudioForm({ ...estudioForm, descripcion: e.target.value })} />
                    </div>
                    <div className="hoja-list-actions">
                        <button className="btn-small primary" onClick={async () => {
                          try {
                            // Basic client-side validation
                            if (!estudioForm.titulo || !estudioForm.institucion || !estudioForm.fechaInicio || !estudioForm.nivelEducativo) {
                              alert('Por favor completa Título, Institución, Fecha inicio y Nivel educativo.');
                              return;
                            }
                            if (estudioForm.enCurso && estudioForm.fechaFin) {
                              alert('Un estudio en curso no puede tener fecha de fin');
                              return;
                            }

                            // Fecha fin >= fecha inicio
                            if (!estudioForm.enCurso && estudioForm.fechaFin && estudioForm.fechaInicio && new Date(estudioForm.fechaFin) < new Date(estudioForm.fechaInicio)) {
                              alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
                              return;
                            }
                            await handleSaveEstudio(estudioForm, editingEstudio?.id);
                            // do not close the whole modal; update list and close the estudio form only
                            setEstudiosFormVisible(false);
                          setEstudioForm({ titulo: '', fechaInicio: '', fechaFin: '', enCurso:false, institucion: '', certificadoUrl: '', descripcion:'', modalidad:'', nivelEducativo:'', estadoEstudio:'ACTIVO', municipioId:null });
                          setEditingEstudio(null);
                        } catch(e) { alert('Error guardando estudio: ' + e.message) }
                      }}>Guardar</button>
                      <button className="btn-small danger" onClick={() => { setEstudiosFormVisible(false); setEstudioForm({ titulo: '', fechaInicio: '', fechaFin: '', enCurso:false, institucion: '', certificadoUrl: '', descripcion:'', modalidad:'', nivelEducativo:'', estadoEstudio:'ACTIVO', municipioId:null }); setEditingEstudio(null); }}>Cancelar</button>
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
                        <button className="btn-small ghost" onClick={() => { setEditingExperiencia(exp); setExperienciaForm({ cargo: exp.cargo || '', empresa: exp.empresa || '', descripcion: exp.descripcion || '', fechaInicio: exp.fechaInicio || '', fechaFin: exp.fechaFin || '', enCurso: !exp.fechaFin, municipioId: exp.municipio?.id || null, estado: exp.estado || 'ACTIVO', certificadoUrl: exp.certificadoUrl || '' }); setExperienciaFormVisible(true); }}>Editar</button>
                        <button className="btn-small danger" onClick={() => { if (confirm('¿Eliminar esta experiencia? Esta acción es irreversible.')) handleDeleteExperiencia(exp.id); }}>Eliminar</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No hay experiencias</div>
                )}
                <div className="mt-06">
                  <button className="btn-small primary" onClick={() => { setEditingExperiencia(null); setExperienciaFormVisible(true); setExperienciaForm({ cargo: '', empresa: '', descripcion: '', fechaInicio: '', fechaFin: '', enCurso:false, municipioId:null, estado:'ACTIVO', certificadoUrl: '' }); }}>Añadir experiencia</button>
                </div>
                {experienciaFormVisible && (
                  <div className="hoja-list-input estudio-form experiencia-form">
                    <div className="estudio-grid two-col">
                      <div>
                        <label>Cargo *</label>
                        <input placeholder="Cargo" value={experienciaForm?.cargo || ''} onChange={(e) => setExperienciaForm({ ...experienciaForm, cargo: e.target.value })} />
                      </div>
                      <div>
                        <label>Empresa *</label>
                        <input placeholder="Empresa" value={experienciaForm?.empresa || ''} onChange={(e) => setExperienciaForm({ ...experienciaForm, empresa: e.target.value })} />
                      </div>
                      <div>
                        <label>Fecha inicio *</label>
                        <input type="date" value={experienciaForm?.fechaInicio || ''} onChange={(e) => setExperienciaForm({ ...experienciaForm, fechaInicio: e.target.value })} />
                      </div>
                      {!experienciaForm.enCurso && (
                        <div>
                          <label>Fecha fin</label>
                          <input type="date" value={experienciaForm?.fechaFin || ''} onChange={(e) => setExperienciaForm({ ...experienciaForm, fechaFin: e.target.value })} />
                        </div>
                      )}
                      <div className="checkbox-row">
                        <label className="checkbox-inline-label"><input type="checkbox" checked={!!experienciaForm.enCurso} onChange={(e) => setExperienciaForm({ ...experienciaForm, enCurso: e.target.checked, fechaFin: e.target.checked ? null : experienciaForm.fechaFin })} /> En curso</label>
                      </div>
                      <div>
                        <label>Municipio</label>
                        <select value={experienciaForm?.municipioId || ''} onChange={(e) => setExperienciaForm({ ...experienciaForm, municipioId: e.target.value ? Number(e.target.value) : null })} disabled={loadingMunicipios}>
                          <option value="">--</option>
                          {municipios && municipios.map((m) => (
                            <option key={m.id} value={m.id}>{m.nombre}{m.departamento ? ` - ${m.departamento}` : ''}</option>
                          ))}
                        </select>
                      </div>
                      {/* Estado moved to the two-col full-width row with certificadoUrl */}
                    </div>
                    <div className="two-col full-width">
                      <div>
                        <label>URL certificado</label>
                        <input placeholder="URL certificado (opcional)" value={experienciaForm?.certificadoUrl || ''} onChange={(e) => setExperienciaForm({ ...experienciaForm, certificadoUrl: e.target.value })} />
                      </div>
                      <div>
                        <label>Estado</label>
                        <select value={experienciaForm.estado || 'ACTIVO'} onChange={(e) => setExperienciaForm({ ...experienciaForm, estado: e.target.value })}>
                          <option value="ACTIVO">ACTIVO</option>
                          <option value="INACTIVO">INACTIVO</option>
                        </select>
                      </div>
                    </div>
                    <div className="full-width">
                      <label>Descripción</label>
                      <textarea placeholder="Descripción (opcional)" value={experienciaForm?.descripcion || ''} onChange={(e) => setExperienciaForm({ ...experienciaForm, descripcion: e.target.value })} />
                    </div>
                    <div className="hoja-list-actions">
                      <button className="btn-small primary" onClick={async () => {
                        try {
                          // Validation
                          if (!experienciaForm.cargo || !experienciaForm.empresa || !experienciaForm.fechaInicio) {
                            alert('Por favor completa Cargo, Empresa y Fecha inicio.');
                            return;
                          }
                          if (experienciaForm.enCurso && experienciaForm.fechaFin) {
                            alert('Una experiencia en curso no puede tener fecha de fin');
                            return;
                          }
                          if (!experienciaForm.enCurso && experienciaForm.fechaFin && experienciaForm.fechaInicio && new Date(experienciaForm.fechaFin) < new Date(experienciaForm.fechaInicio)) {
                            alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
                            return;
                          }

                          // Prepare payload: convert municipioId to object if present
                          const payload = { ...experienciaForm };
                          if (payload.municipioId) payload.municipio = { id: payload.municipioId };
                          delete payload.municipioId;
                          // If enCurso true, ensure fechaFin is null
                          if (payload.enCurso) payload.fechaFin = null;

                          await handleSaveExperiencia(payload, editingExperiencia?.id);
                          setExperienciaFormVisible(false);
                          setExperienciaForm({ cargo: '', empresa: '', descripcion: '', fechaInicio: '', fechaFin: '', enCurso:false, municipioId:null, estado:'ACTIVO' });
                          setEditingExperiencia(null);
                        } catch(e) { alert('Error guardando experiencia: ' + e.message) }
                      }}>Guardar</button>
                      <button className="btn-small danger" onClick={() => { setExperienciaFormVisible(false); setExperienciaForm({ cargo: '', empresa: '', descripcion: '', fechaInicio: '', fechaFin: '', enCurso:false, municipioId:null, estado:'ACTIVO' }); setEditingExperiencia(null); }}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}