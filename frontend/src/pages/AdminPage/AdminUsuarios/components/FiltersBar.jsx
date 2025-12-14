import React from 'react';

export default function FiltersBar({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroRol,
  setFiltroRol
}) {
  return (
    <div className="filters-section-UP">
      <div className="search-box-UP">
        <input
          type="text"
          className="search-input-UP"
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="search-btn-UP">🔍</button>
      </div>

      <div className="filter-buttons-UP">
        <button
          className={`filter-btn-UP ${filtroEstado === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('todos')}
        >
          Todos
        </button>
        <button
          className={`filter-btn-UP ${filtroEstado === 'activos' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('activos')}
        >
          Activos
        </button>
        <button
          className={`filter-btn-UP ${filtroEstado === 'inactivos' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('inactivos')}
        >
          Inactivos
        </button>
      </div>

      <div className="filter-buttons-UP">
        <button
          className={`filter-btn-UP ${filtroRol === 'aspirante' ? 'active' : ''}`}
          onClick={() => setFiltroRol('aspirante')}
        >
          Aspirantes
        </button>
        <button
          className={`filter-btn-UP ${filtroRol === 'reclutador' ? 'active' : ''}`}
          onClick={() => setFiltroRol('reclutador')}
        >
          Reclutadores
        </button>
        <button
          className={`filter-btn-UP ${filtroRol === 'admin' ? 'active' : ''}`}
          onClick={() => setFiltroRol('admin')}
        >
          Administradores
        </button>
      </div>
    </div>
  );
}
