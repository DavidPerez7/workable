import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SidebarReclutador.css';

const SidebarReclutador = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/Reclutador',
      label: 'Inicio',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
      )
    },
    {
      path: '/Reclutador/GestigOferts',
      label: 'Ofertas',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      )
    },
    {
      path: '/Reclutador/RegistrarEmpresa',
      label: 'Empresa',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21V7a2 2 0 0 1 2-2h3V3h4v2h3a2 2 0 0 1 2 2v14"></path>
          <path d="M3 21h18"></path>
        </svg>
      )
    },
    {
      path: '/Reclutador/Configuracion',
      label: 'Config',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6"></path>
        </svg>
      )
    }
  ];

  return (
    <aside className="sidebar-nav">
      <nav className="nav-list-sidebar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item-sidebar ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarReclutador;
