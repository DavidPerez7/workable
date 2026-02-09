import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">Workable Admin</div>
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
      <NavLink to="/Administrador/Postulaciones" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11"></path>
        </svg>
        Postulaciones
      </NavLink>
      <div className="sidebar-footer">
        <NavLink to="/Administrador/Perfil" className={({isActive})=> isActive? 'nav-link-perfil active':'nav-link-perfil'}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Mi Perfil
        </NavLink>
        <small>Superusuario</small>
      </div>
    </aside>
  );
};

export default Sidebar;
