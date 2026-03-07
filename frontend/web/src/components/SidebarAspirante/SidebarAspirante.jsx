import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SidebarAspirante.css';

const SidebarAspirante = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-aspirante">
      <nav className="nav-list-aspirante">
        <Link 
          to="/Aspirante" 
          className={`nav-item-aspirante ${isActive('/Aspirante') ? 'active' : ''}`}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          <span>Ofertas</span>
        </Link>

        <Link 
          to="/Aspirante/MiPerfil" 
          className={`nav-item-aspirante ${isActive('/Aspirante/MiPerfil') ? 'active' : ''}`}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Mi Perfil</span>
        </Link>

        <Link 
          to="/Aspirante/MiPerfil/MisPostulaciones" 
          className={`nav-item-aspirante ${location.pathname.includes('MisPostulaciones') ? 'active' : ''}`}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Postulaciones</span>
        </Link>

        <Link 
          to="/Aspirante/MiPerfil/HojaDeVida" 
          className={`nav-item-aspirante ${location.pathname.includes('HojaDeVida') ? 'active' : ''}`}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <span>Hoja de Vida</span>
        </Link>
      </nav>
    </aside>
  );
};

export default SidebarAspirante;
