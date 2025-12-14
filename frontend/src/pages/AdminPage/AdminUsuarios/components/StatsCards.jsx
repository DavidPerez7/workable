import React from 'react';

export default function StatsCards({ usuarios = [] }) {
  const total = usuarios.length || 0;
  const activos = usuarios.filter((u) => u.estado === 'Activo').length;
  const inactivos = usuarios.filter((u) => u.estado === 'Inactivo').length;

  return (
    <div className="stats-section-UP">
      <div className="stat-card-UP stat-total-UP">
        <svg className="stat-icon-UP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <div className="stat-info-UP">
          <div className="stat-number-UP">{total}</div>
          <div className="stat-label-UP">Total Usuarios</div>
        </div>
      </div>

      <div className="stat-card-UP stat-activos-UP">
        <svg className="stat-icon-UP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <div className="stat-info-UP">
          <div className="stat-number-UP">{activos}</div>
          <div className="stat-label-UP">Activos</div>
        </div>
      </div>

      <div className="stat-card-UP stat-inactivos-UP">
        <svg className="stat-icon-UP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <div className="stat-info-UP">
          <div className="stat-number-UP">{inactivos}</div>
          <div className="stat-label-UP">Inactivos</div>
        </div>
      </div>
    </div>
  );
}
