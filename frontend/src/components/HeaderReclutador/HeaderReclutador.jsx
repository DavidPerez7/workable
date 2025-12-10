import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../api/authApi';
import './HeaderReclutador.css';

function HeaderReclutador() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const nombre = user.nombre || localStorage.getItem('nombre') || 'Reclutador';
    setUserData({ nombre });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/Login');
  };

  return (
    <header className="header-container-rc">
      <Link to='/Reclutador' className="logo-container-rc">
        <img src="https://i.ibb.co/gMwyTHb7/logotipo-workable.png" alt="workable logo" className='img-logo-wkb-rc'/>
      </Link>

      <button className="menu-toggle-rc"
        onClick={() => setMenuOpen(open => !open)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <nav className={menuOpen ? 'nav-list-rc show-rc' : 'nav-list-rc'}>
        <Link to="/Reclutador/Publicacion">Publicar Oferta</Link>
        <Link to="/Reclutador/GestigOferts">Mis Ofertas</Link>
        <Link to="/Reclutador/EnterprisePage">Mi Empresa</Link>
      </nav>

      <div className={menuOpen ? 'user-profile-menu-rc show-rc' : 'user-profile-menu-rc'}>
        <div className="user-info-rc">
          <span className="username-text-rc">{userData?.nombre}</span>
          <Link to='/Reclutador/ReclutadorProfile' className="avatar-placeholder-rc"></Link>
          <button onClick={handleLogout} className="logout-btn-rc" title="Cerrar sesión">
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderReclutador;