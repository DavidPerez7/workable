import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeaderReclutador.css';

function HeaderReclutador() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [nombre, setNombre] = useState('Reclutador');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    // Cargar nombre del localStorage
    const storedNombre = localStorage.getItem('nombre');
    if (storedNombre) {
      setNombre(storedNombre);
    }
  }, []);

  return (
    <header className="header-container-rc">
      <Link to='/' className="logo-container-rc">
        <img src="https://i.postimg.cc/PrF6JqqC/WKB-LOGO-copia-removebg-preview.png" alt="workable logo" className='img-logo-wkb-rc'/>
      </Link>

      <button className="menu-toggle-rc"
        onClick={() => setMenuOpen(open => !open)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <nav className={menuOpen ? 'nav-list-rc show-rc' : 'nav-list-rc'}>
        <Link to="/Professional">Perfil Profesional</Link>
        <Link to="/Salary">Salarios</Link>
      </nav>

      <div className={menuOpen ? 'user-profile-menu-rc show-rc' : 'user-profile-menu-rc'}>
        <div className="user-info-rc">
          <span className="username-text-rc">{nombre}</span>
          <Link to='/Reclutador/EditarPerfil' className="avatar-placeholder-rc"></Link>
          <button onClick={handleLogout} className="logout-button-rc" title="Cerrar sesión">
            🚪
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderReclutador;