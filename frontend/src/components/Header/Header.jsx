import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="header-container">
			<Link to='/' className="logo-container"> 
				<img src="https://i.ibb.co/gMwyTHb7/logotipo-workable.png" alt="Workable Logo" className='img-wkb'/>
			</Link>

			<button 
				className="menu-toggle"
				onClick={() => setMenuOpen(open => !open)}
				aria-label="Abrir menú"
				aria-expanded={menuOpen}
			>
				<span className="menu-icon">☰</span>
			</button>

			<nav className={menuOpen ? 'nav-list show' : 'nav-list'}>
				<NavLink 
					to="/Professional" 
					className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
					onClick={() => setMenuOpen(false)}
				>
					Perfil Profesional
				</NavLink>
				<NavLink 
					to="/Salary" 
					className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
					onClick={() => setMenuOpen(false)}
				>
					Salarios
				</NavLink>
			</nav>

			<div className={menuOpen ? 'user-menu show' : 'user-menu'}>
				<Link 
					to="/Login" 
					className="btn-login"
					onClick={() => setMenuOpen(false)}
				>
					Iniciar Sesión
				</Link>
				<Link 
					to="/SignUp" 
					className="btn-signup"
					onClick={() => setMenuOpen(false)}
				>
					Registrarse
				</Link>
			</div>
		</header>
	);
}

export default Header;