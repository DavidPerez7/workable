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
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
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
        <NavLink to="/Administrador/Citaciones" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Citaciones
        </NavLink>
        <NavLink to="/Administrador/Notificaciones" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Notificaciones
        </NavLink>
        <NavLink to="/Administrador/Feedback" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Feedback
        </NavLink>
        <NavLink to="/Administrador/Habilidades" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          Habilidades
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <small>Superusuario</small>
      </div>
    </aside>
  );
};

export default Sidebar;
