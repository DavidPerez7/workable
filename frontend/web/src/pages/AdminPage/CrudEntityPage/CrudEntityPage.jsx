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
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [viewItem, setViewItem] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const openCreate = () => {
    setEditorMode('create');
    setSelectedItem(null);
    setJsonText(safeStringify(samplePayload));
    setEditorOpen(true);
  };

  const openEdit = (item) => {
    setEditorMode('edit');
    setSelectedItem(item);
    setJsonText(safeStringify(item));
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setSelectedItem(null);
    setJsonText('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (typeof createItem !== 'function' || typeof updateItem !== 'function') {
      setError(`No hay acciones configuradas para ${entityName}`);
      return;
    }

    let payload;
    try {
      payload = JSON.parse(jsonText);
    } catch {
      setError('El JSON no es válido');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (editorMode === 'create') {
        await createItem(payload);
      } else if (selectedItem?.id !== undefined && selectedItem?.id !== null) {
        await updateItem(selectedItem.id, payload);
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

  if (loading) {
    return <section className="crud-page"><p className="crud-state">Cargando {entityName}...</p></section>;
  }

  return (
    <section className="crud-page">
      <div className="crud-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="crud-actions">
          <button className="crud-primary" onClick={loadItems} disabled={saving}>Refrescar</button>
          <button className="crud-primary" onClick={openCreate} disabled={saving}>Nuevo</button>
        </div>
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
            <form onSubmit={handleSubmit} className="crud-form">
              <label className="crud-label">JSON del payload</label>
              <textarea
                className="crud-textarea"
                value={jsonText}
                onChange={(event) => setJsonText(event.target.value)}
                spellCheck={false}
              />
              <p className="crud-help">Puedes usar relaciones anidadas, por ejemplo: {`{ "municipio": { "id": 1 } }`}</p>
              <div className="crud-form-actions">
                <button type="button" className="crud-secondary" onClick={closeEditor} disabled={saving}>Cancelar</button>
                <button type="submit" className="crud-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
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