import React, { useEffect, useMemo, useState } from 'react';

const SUMMARY_KEYS = ['nombre', 'apellido', 'correo', 'titulo', 'estado', 'departamento', 'telefono', 'rol', 'nombreCompleto'];

function prettifyKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (char) => char.toUpperCase());
}

function normalizeValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'object') {
    if (Array.isArray(value)) return `${value.length} items`;
    return value.nombre || value.titulo || value.correo || value.id || JSON.stringify(value);
  }
  return String(value);
}

function buildSummary(item) {
  if (!item || typeof item !== 'object') return 'Sin datos';

  const preferred = SUMMARY_KEYS
    .map((key) => item[key])
    .find((value) => value !== undefined && value !== null && value !== '');

  if (preferred !== undefined) return normalizeValue(preferred);

  const firstPrimitive = Object.entries(item).find(([, value]) => {
    const type = typeof value;
    return value !== null && (type === 'string' || type === 'number' || type === 'boolean');
  });

  if (firstPrimitive) {
    return normalizeValue(firstPrimitive[1]);
  }

  return `#${item.id ?? 'sin-id'}`;
}

function safeStringify(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '{}';
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
}

function cloneDeep(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((item) => cloneDeep(item));
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneDeep(item)]));
  }
  return value;
}

function getValueAtPath(source, path) {
  return path.reduce((current, key) => (current === null || current === undefined ? current : current[key]), source);
}

function setValueAtPath(source, path, newValue) {
  const next = cloneDeep(source);
  let current = next;

  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index];
    const nextKey = path[index + 1];
    if (current[key] === null || current[key] === undefined) {
      current[key] = typeof nextKey === 'number' ? [] : {};
    }
    current = current[key];
  }

  current[path[path.length - 1]] = newValue;
  return next;
}

function deleteValueAtPath(source, path) {
  const next = cloneDeep(source);
  if (path.length === 0) return next;

  let current = next;
  for (let index = 0; index < path.length - 1; index += 1) {
    current = current[path[index]];
    if (current === null || current === undefined) return next;
  }

  if (Array.isArray(current)) {
    current.splice(path[path.length - 1], 1);
  }

  return next;
}

function getArrayItemTemplate(values, sampleValue) {
  if (Array.isArray(values) && values.length > 0) {
    return cloneDeep(values[0]);
  }

  if (Array.isArray(sampleValue) && sampleValue.length > 0) {
    return cloneDeep(sampleValue[0]);
  }

  return '';
}

function toDateInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string' && value.length >= 10) return value.slice(0, 10);
  return String(value);
}

function toTimeInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string' && value.length >= 5) return value.slice(0, 5);
  return String(value);
}

function parseNumberValue(value) {
  if (value === '') return '';
  const parsed = Number(value);
  return Number.isNaN(parsed) ? '' : parsed;
}

function getFieldOptions(fieldName, entityName) {
  const normalizedEntity = entityName.toLowerCase();

  const optionsByField = {
    genero: ['MASCULINO', 'FEMENINO', 'OTRO'],
    rol: ['ADMIN', 'RECLUTADOR', 'ASPIRANTE'],
    modalidad: ['PRESENCIAL', 'REMOTO', 'HIBRIDO'],
    nivelExperiencia: ['SIN_EXPERIENCIA', 'BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO'],
    tipoContrato: ['TIEMPO_COMPLETO', 'MEDIO_TIEMPO', 'TEMPORAL', 'PRESTACION_SERVICIOS', 'PRACTICAS'],
    nivelEducativo: ['PRIMARIA', 'BACHILLERATO', 'TECNICO', 'TECNOLOGO', 'LICENCIATURA', 'UNIVERSITARIO', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO'],
    estadoCitacion: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'],
  };

  if (fieldName === 'estado') {
    if (normalizedEntity.includes('oferta')) return ['ACTIVA', 'INACTIVA', 'FINALIZADA'];
    if (normalizedEntity.includes('postul')) return ['PENDIENTE', 'RECHAZADO', 'ACEPTADO', 'ENTREVISTA_PROGRAMADA'];
  }

  return optionsByField[fieldName] || null;
}

function getInputType(fieldName, value) {
  if (fieldName === 'password') return 'password';
  if (fieldName === 'correo' || fieldName === 'correoElectronico' || fieldName === 'email' || fieldName === 'emailContacto') return 'email';
  if (fieldName.includes('telefono')) return 'tel';
  if (fieldName.includes('url') || fieldName.includes('link')) return 'url';
  if (fieldName.includes('fecha')) return 'date';
  if (fieldName === 'hora') return 'time';
  if (typeof value === 'number') return 'number';
  return 'text';
}

function shouldUseTextarea(fieldName, value) {
  return typeof value === 'string' && ['descripcion', 'resumenProfesional', 'requisitos'].includes(fieldName);
}

function getEmptyArrayItem(sampleValue) {
  if (isPlainObject(sampleValue)) return cloneDeep(sampleValue);
  if (Array.isArray(sampleValue) && sampleValue.length > 0) return getEmptyArrayItem(sampleValue[0]);
  return '';
}

export default function CrudEntityPage({
  title,
  subtitle,
  entityName,
  loadAll,
  loadById,
  createItem,
  updateItem,
  deleteItem,
  samplePayload = {},
  showHeaderActions = true,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const sampleKeys = Object.keys(samplePayload || {});

  const loadItems = async () => {
    if (typeof loadAll !== 'function') return;

    try {
      setLoading(true);
      setError('');
      const data = await loadAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err?.message || `Error al cargar ${entityName}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) => safeStringify(item).toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  const columns = useMemo(() => {
    const firstItem = filteredItems[0];
    if (!firstItem) return [];

    const preferredKeys = ['id', 'nombre', 'apellido', 'correo', 'titulo', 'estado', 'departamento', 'telefono', 'rol', 'isActive'];
    const keys = preferredKeys.filter((key) => Object.prototype.hasOwnProperty.call(firstItem, key));

    if (keys.length > 0) return keys;

    return Object.keys(firstItem).filter((key) => {
      const value = firstItem[key];
      return value === null || ['string', 'number', 'boolean'].includes(typeof value);
    }).slice(0, 6);
  }, [filteredItems]);

  const stats = useMemo(() => {
    const total = items.length;
    const activos = items.filter((item) => item?.isActive === true || item?.estado === 'ACTIVO' || item?.estado === 'Activo').length;
    const inactivos = items.filter((item) => item?.isActive === false || item?.estado === 'INACTIVO' || item?.estado === 'Inactivo').length;
    return [
      { label: 'Total', value: total, tone: 'blue' },
      { label: 'Activos', value: activos, tone: 'green' },
      { label: 'Inactivos', value: inactivos, tone: 'amber' },
      { label: 'Mostrados', value: filteredItems.length, tone: 'neutral' },
    ];
  }, [items, filteredItems.length]);

  const metrics = useMemo(() => ({
    total: items.length,
    activos: items.filter((item) => item?.isActive === true || item?.estado === 'ACTIVO' || item?.estado === 'Activo').length,
    inactivos: items.filter((item) => item?.isActive === false || item?.estado === 'INACTIVO' || item?.estado === 'Inactivo').length,
    mostrados: filteredItems.length,
  }), [items, filteredItems.length]);

  const openCreate = () => {
    setEditorMode('create');
    setSelectedItem(null);
    setFormData(cloneDeep(samplePayload));
    setEditorOpen(true);
  };

  const openEdit = (item) => {
    setEditorMode('edit');
    setSelectedItem(item);
    setFormData(cloneDeep(item));
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setSelectedItem(null);
    setFormData(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (typeof createItem !== 'function' || typeof updateItem !== 'function') {
      setError(`No hay acciones configuradas para ${entityName}`);
      return;
    }

    if (!formData) {
      setError('No hay datos para guardar');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (editorMode === 'create') {
        await createItem(formData);
      } else if (selectedItem?.id !== undefined && selectedItem?.id !== null) {
        await updateItem(selectedItem.id, formData);
      }
      await loadItems();
      closeEditor();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err?.message || `Error al guardar ${entityName}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (typeof deleteItem !== 'function') {
      setError(`No hay eliminación configurada para ${entityName}`);
      return;
    }

    if (!window.confirm(`¿Eliminar ${entityName} #${item.id}?`)) return;

    try {
      setSaving(true);
      setError('');
      await deleteItem(item.id);
      await loadItems();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err?.message || `Error al eliminar ${entityName}`);
    } finally {
      setSaving(false);
    }
  };

  const handleView = async (item) => {
    try {
      setError('');
      if (typeof loadById === 'function') {
        const detail = await loadById(item.id);
        setViewItem(detail || item);
      } else {
        setViewItem(item);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err?.message || `Error al cargar ${entityName}`);
    }
  };

  const handleExportMetrics = () => {
    const exportData = {
      title,
      entityName,
      generatedAt: new Date().toISOString(),
      query,
      metrics,
      filteredCount: filteredItems.length,
      records: filteredItems,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entityName}-metricas.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderField = (fieldName, value, path = []) => {
    const options = getFieldOptions(fieldName, entityName);
    const inputType = getInputType(fieldName, value);
    const label = prettifyKey(fieldName);
    const fieldPath = [...path, fieldName];

    if (Array.isArray(value)) {
      const sampleArrayValue = getValueAtPath(samplePayload, fieldPath);
      const itemTemplate = getArrayItemTemplate(value, sampleArrayValue);

      if (fieldName === 'categories') {
        const selectedValues = Array.isArray(value) ? value : [];
        const categoryOptions = ['TECNOLOGIA', 'SALUD', 'EDUCACION', 'FINANZAS', 'MANUFACTURA', 'COMERCIO', 'CONSTRUCCION', 'SERVICIOS', 'AGRICULTURA', 'OTRO'];

        return (
          <fieldset key={fieldPath.join('.')} className="crud-fieldset crud-fieldset-list">
            <legend>{label}</legend>
            <div className="crud-chip-grid">
              {categoryOptions.map((option) => (
                <label key={option} className="crud-chip-option">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={(event) => {
                      const nextValues = event.target.checked
                        ? [...selectedValues, option]
                        : selectedValues.filter((item) => item !== option);
                      setFormData((current) => setValueAtPath(current, fieldPath, nextValues));
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        );
      }

      const isObjectArray = isPlainObject(itemTemplate);

      return (
        <fieldset key={fieldPath.join('.')} className="crud-fieldset">
          <legend>{label}</legend>
          <div className="crud-array-list">
            {value.map((item, index) => {
              const itemPath = [...fieldPath, index];
              return (
                <article key={itemPath.join('.')} className="crud-array-item">
                  <div className="crud-array-item-header">
                    <strong>{label} #{index + 1}</strong>
                    <button
                      type="button"
                      className="crud-secondary crud-mini-button"
                      onClick={() => setFormData((current) => deleteValueAtPath(current, itemPath))}
                    >
                      Quitar
                    </button>
                  </div>
                  {isObjectArray ? (
                    <div className="crud-form-grid">
                      {Object.entries(item || {}).map(([childKey, childValue]) => renderField(childKey, childValue, [...fieldPath, index]))}
                    </div>
                  ) : (
                    <input
                      type={getInputType(fieldName, item)}
                      className="crud-input"
                      value={item ?? ''}
                      onChange={(event) => {
                        const nextValue = inputType === 'number' ? parseNumberValue(event.target.value) : event.target.value;
                        setFormData((current) => {
                          const next = cloneDeep(current);
                          const list = getValueAtPath(next, fieldPath) || [];
                          list[index] = nextValue;
                          return setValueAtPath(next, fieldPath, list);
                        });
                      }}
                    />
                  )}
                </article>
              );
            })}
          </div>
          <button
            type="button"
            className="crud-secondary"
            onClick={() => {
              const nextItem = getEmptyArrayItem(itemTemplate);
              setFormData((current) => {
                const next = cloneDeep(current);
                const list = getValueAtPath(next, fieldPath) || [];
                return setValueAtPath(next, fieldPath, [...list, nextItem]);
              });
            }}
          >
            Agregar elemento
          </button>
        </fieldset>
      );
    }

    if (isPlainObject(value)) {
      const objectKeys = Object.keys(value);

      if (objectKeys.length === 1 && objectKeys[0] === 'id') {
        return (
          <div key={fieldPath.join('.')} className="crud-field">
            <label className="crud-label">{label} ID</label>
            <input
              type="number"
              className="crud-input"
              value={value.id ?? ''}
              onChange={(event) => {
                const nextId = parseNumberValue(event.target.value);
                setFormData((current) => setValueAtPath(current, fieldPath, { id: nextId }));
              }}
            />
          </div>
        );
      }

      return (
        <fieldset key={fieldPath.join('.')} className="crud-fieldset">
          <legend>{label}</legend>
          <div className="crud-form-grid">
            {objectKeys.map((childKey) => renderField(childKey, value[childKey], [...path, fieldName]))}
          </div>
        </fieldset>
      );
    }

    if (options) {
      return (
        <div key={fieldPath.join('.')} className="crud-field">
          <label className="crud-label">{label}</label>
          <select
            className="crud-input crud-select"
            value={value ?? ''}
            onChange={(event) => setFormData((current) => setValueAtPath(current, fieldPath, event.target.value))}
          >
            <option value="">Selecciona una opción</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }

    if (shouldUseTextarea(fieldName, value)) {
      return (
        <div key={fieldPath.join('.')} className="crud-field">
          <label className="crud-label">{label}</label>
          <textarea
            className="crud-input crud-textarea crud-textarea-inline"
            value={value ?? ''}
            onChange={(event) => setFormData((current) => setValueAtPath(current, fieldPath, event.target.value))}
          />
        </div>
      );
    }

    return (
      <div key={fieldPath.join('.')} className="crud-field">
        <label className="crud-label">{label}</label>
        <input
          type={inputType}
          className="crud-input"
          value={value ?? ''}
          onChange={(event) => {
            const nextValue = inputType === 'number' ? parseNumberValue(event.target.value) : event.target.value;
            setFormData((current) => setValueAtPath(current, fieldPath, nextValue));
          }}
        />
      </div>
    );
  };

  const renderFormFields = () => {
    if (!formData || !isPlainObject(formData)) return null;

    return (
      <div className="crud-form-grid">
        {Object.entries(formData).map(([fieldName, value]) => {
          if (fieldName === 'id') return null;
          return renderField(fieldName, value, []);
        })}
      </div>
    );
  };

  if (loading) {
    return <section className="crud-page"><p className="crud-state">Cargando {entityName}...</p></section>;
  }

  return (
    <section className="crud-page">
      <div className={`crud-header${showHeaderActions ? '' : ' crud-header-centered'}`}>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {showHeaderActions && (
          <div className="crud-actions">
            <button className="crud-primary" onClick={loadItems} disabled={saving}>Refrescar</button>
            <button className="crud-primary" onClick={openCreate} disabled={saving}>Nuevo</button>
          </div>
        )}
      </div>

      <div className="crud-stats-section">
        {stats.map((stat) => (
          <article key={stat.label} className={`crud-stat-card crud-stat-${stat.tone}`}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="crud-filters-section">
        <input
          type="text"
          className="crud-search"
          placeholder={`Buscar ${entityName}...`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="crud-filters-actions">
          <button className="crud-secondary crud-export" onClick={handleExportMetrics} disabled={saving || filteredItems.length === 0}>Exportar métricas</button>
          <button className="crud-secondary" onClick={loadItems} disabled={saving}>Actualizar</button>
          <button className="crud-primary" onClick={openCreate} disabled={saving}>Crear</button>
        </div>
      </div>

      {error && <div className="crud-alert crud-alert-error">{error}</div>}

      <div className="crud-table-wrap">
        <table className="crud-table">
          <thead>
            <tr>
              {(columns.length ? columns : ['id']).map((column) => (
                <th key={column}>{prettifyKey(column)}</th>
              ))}
              <th>Resumen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id ?? JSON.stringify(item)}>
                {(columns.length ? columns : ['id']).map((column) => (
                  <td key={column}>{normalizeValue(item[column])}</td>
                ))}
                <td>{buildSummary(item)}</td>
                <td>
                  <div className="crud-row-actions">
                    <button className="crud-secondary" onClick={() => handleView(item)} disabled={saving}>Ver</button>
                    <button className="crud-secondary" onClick={() => openEdit(item)} disabled={saving}>Editar</button>
                    <button className="crud-danger" onClick={() => handleDelete(item)} disabled={saving}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={(columns.length ? columns : ['id']).length + 2} className="crud-empty">
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editorOpen && (
        <div className="crud-modal-backdrop" onClick={closeEditor}>
          <div className="crud-modal" onClick={(event) => event.stopPropagation()}>
            <div className="crud-modal-header">
              <h2>{editorMode === 'create' ? `Crear ${entityName}` : `Editar ${entityName}`}</h2>
              <button className="crud-close" onClick={closeEditor}>×</button>
            </div>
            <div className="crud-modal-layout">
              <form onSubmit={handleSubmit} className="crud-form crud-modal-form">
                {renderFormFields()}
                <div className="crud-form-actions">
                  <button type="button" className="crud-secondary" onClick={closeEditor} disabled={saving}>Cancelar</button>
                  <button type="submit" className="crud-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>

              <aside className="crud-modal-side">
                <p className="crud-modal-eyebrow">Guía rápida</p>
                <h3>Formulario compartido</h3>
                <p className="crud-modal-note">Este modal genera campos simples desde la estructura de cada entidad. Mantiene el CRUD consistente sin mostrar datos crudos al usuario.</p>

                {sampleKeys.length > 0 && (
                  <div className="crud-modal-chip-list">
                    {sampleKeys.slice(0, 8).map((key) => (
                      <span key={key} className="crud-modal-chip">{prettifyKey(key)}</span>
                    ))}
                  </div>
                )}

                <div className="crud-modal-sample-box">
                  <span>Campos detectados</span>
                  <p className="crud-modal-note">{sampleKeys.length} campos base para esta entidad.</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="crud-modal-backdrop" onClick={() => setViewItem(null)}>
          <div className="crud-modal" onClick={(event) => event.stopPropagation()}>
            <div className="crud-modal-header">
              <h2>Detalle de {entityName}</h2>
              <button className="crud-close" onClick={() => setViewItem(null)}>×</button>
            </div>
            <pre className="crud-pre">{safeStringify(viewItem)}</pre>
          </div>
        </div>
      )}
    </section>
  );
}