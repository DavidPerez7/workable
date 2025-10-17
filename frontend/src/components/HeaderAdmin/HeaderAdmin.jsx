import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './HeaderAdmin.css';

const HeaderAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header-admin-HAD">
      <Link to="/Administrador" className="logo-container-HAD" aria-label="Volver al panel de administración">
        <img src="https://i.postimg.cc/PrF6JqqC/WKB-LOGO-copia-removebg-preview.png" alt="Logo Workable" className="img-wkb-HAD"/>
      </Link>

      <button
        className="menu-toggle-HAD"
        onClick={() => setMenuOpen(open => !open)}
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
      >
        ☰
      </button>

      <nav className={menuOpen ? 'nav-list-HAD show-HAD' : 'nav-list-HAD'}>
        <NavLink
          to="/Administrador"
          className={({ isActive }) => `nav-item-HAD ${isActive ? 'active-HAD' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/Administrador/CuentasInternas"
          className={({ isActive }) => `nav-item-HAD ${isActive ? 'active-HAD' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Cuentas Internas
        </NavLink>
        <NavLink
          to="/Administrador/Reportes"
          className={({ isActive }) => `nav-item-HAD ${isActive ? 'active-HAD' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Reportes
        </NavLink>
        <NavLink
          to="/Administrador/Retroalimentacion"
          className={({ isActive }) => `nav-item-HAD ${isActive ? 'active-HAD' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Retroalimentación
        </NavLink>
        <NavLink
          to="/Administrador/Empresas"
          className={({ isActive }) => `nav-item-HAD ${isActive ? 'active-HAD' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Empresas
        </NavLink>
        <NavLink
          to="/Administrador/Ofertas"
          className={({ isActive }) => `nav-item-HAD ${isActive ? 'active-HAD' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Ofertas
        </NavLink>
        <NavLink
          to="/Administrador/Usuarios"
          className={({ isActive }) => `nav-item-HAD ${isActive ? 'active-HAD' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Usuarios
        </NavLink>
      </nav>

      <div className={menuOpen ? 'user-menu-HAD show-HAD' : 'user-menu-HAD'}>
        <span className="username-HAD">Administrador</span>
        <div className="avatar-placeholder-HAD"></div>
      </div>
    </header>
  );
};

export default HeaderAdmin;