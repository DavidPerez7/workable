import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../api/authApi';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <aside className="admin-sidebar">
      <nav className="admin-sidebar-nav">
        <NavLink to="/Administrador/Aspirantes" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Aspirantes</NavLink>
        <NavLink to="/Administrador/Administradores" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Administradores</NavLink>
        <NavLink to="/Administrador/Reclutadores" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Reclutadores</NavLink>
        <NavLink to="/Administrador/Empresas" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Empresas</NavLink>
        <NavLink to="/Administrador/Ofertas" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Ofertas</NavLink>
        <NavLink to="/Administrador/Postulaciones" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Postulaciones</NavLink>
        <NavLink to="/Administrador/HojasDeVida" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Hojas de vida</NavLink>
        <NavLink to="/Administrador/Municipios" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Municipios</NavLink>
      </nav>
      <button className="btn-logout-sidebar" onClick={handleLogout}>Cerrar sesión</button>
    </aside>
  );
};

export default Sidebar;
