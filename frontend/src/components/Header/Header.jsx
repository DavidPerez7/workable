import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (

		<header className="header-container" href='/ '>
			<Link to='/' className="logo-container"> 
				<img src="https://i.postimg.cc/PrF6JqqC/WKB-LOGO-copia-removebg-preview.png" alt="imglogo" className='img-wkb'/>
			</Link>

			<button className="menu-toggle"
				onClick={() => setMenuOpen(open => !open)}
				aria-label="Abrir menú"
			>
				☰
			</button>

			<nav className={menuOpen ? 'nav-list show' : 'nav-list'}>
				<Link to="/Professional">Perfil Profesional</Link>
				<Link to="/Salary">Salarios</Link>
			</nav>

			<div className={menuOpen ? 'user-menu show' : 'user-menu'}>
				<Link to="/Login" className="ls-link">Iniciar Sesión</Link>
				<Link to="/SignUp" className="ls-link">Registrarse</Link>
			</div>
		</header>
	);
}

export default Header;
