import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">Workable Admin</div>
      <nav className="sidebar-nav">
        <NavLink to="/Administrador" end className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/Administrador/Usuarios" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          👥 Usuarios (Aspirantes)
        </NavLink>
        <NavLink to="/Administrador/Empresas" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          🏢 Empresas
        </NavLink>
        <NavLink to="/Administrador/Ofertas" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          💼 Ofertas Laborales
        </NavLink>
        <NavLink to="/Administrador/Productos" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          🛍️ Productos
        </NavLink>
        <NavLink to="/Administrador/Roles" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          🔐 Roles & Permisos
        </NavLink>
        <NavLink to="/Administrador/Logs" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>
          📜 Logs
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <small>Superusuario</small>
      </div>
    </aside>
  );
};

export default Sidebar;
