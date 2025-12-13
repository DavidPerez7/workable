import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">Workable Admin</div>
      <nav className="sidebar-nav">
        <NavLink to="/Administrador" end className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Dashboard
        </NavLink>
        <NavLink to="/Administrador/Usuarios" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Usuarios
        </NavLink>
        <NavLink to="/Administrador/Empresas" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
            <line x1="6" y1="2" x2="6" y2="22"></line>
            <line x1="18" y1="2" x2="18" y2="22"></line>
            <line x1="2" y1="6" x2="22" y2="6"></line>
            <line x1="2" y1="18" x2="22" y2="18"></line>
          </svg>
          Empresas
        </NavLink>
        <NavLink to="/Administrador/Ofertas" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 2v6"></path>
            <path d="M8 2v6"></path>
            <line x1="2" y1="11" x2="22" y2="11"></line>
          </svg>
          Ofertas
        </NavLink>
        <NavLink to="/Administrador/HojaDeVida" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <line x1="8" y1="8" x2="16" y2="8"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
            <line x1="8" y1="16" x2="12" y2="16"></line>
          </svg>
          Hoja de Vida
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <small>Superusuario</small>
      </div>
    </aside>
  );
};

export default Sidebar;
