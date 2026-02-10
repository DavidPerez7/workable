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
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="filter-select-UP"
        >
          <option value="todos">Todos los Estados</option>
          <option value="activos">Usuarios Activos</option>
          <option value="inactivos">Usuarios Inactivos</option>
        </select>
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className="filter-select-UP"
        >
          <option value="aspirante">Aspirantes</option>
          <option value="reclutador">Reclutadores</option>
          <option value="admin">Administradores</option>
        </select>
      </div>
    </div>
  );
}
